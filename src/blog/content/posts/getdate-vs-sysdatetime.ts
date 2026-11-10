import type { BlogPost } from '../../types'

export const getdateVsSysdatetime: Omit<BlogPost, 'readingTime'> = {
  id: 'getdate-vs-sysdatetime',
  slug: 'getdate-vs-sysdatetime-reloj-que-retrocede',
  title: 'GETDATE() contra SYSDATETIME(): el reloj que retrocede dos de cada tres veces',
  titleEn: 'GETDATE() vs SYSDATETIME(): The Clock That Runs Backwards Two Times Out of Three',
  date: '2026-10-27',
  tags: ['SQL Server', 'T-SQL', 'testing', 'datetime', 'debugging'],
  category: 'arquitectura',
  featured: false,
  excerpt:
    'Una prueba de base de datos fallaba de forma intermitente en una guarda que exige que un evento ocurra después de otro. Medí la causa: GETDATE() leído justo después de SYSDATETIME() compara como anterior en 13,339 de 20,000 ejecuciones, porque datetime redondea a pasos de 3.33 ms y datetime2 no. La prueba se arregló retrocediendo una fecha cinco segundos, que es exactamente el arreglo que no corrige nada; la corrección real es un solo reloj y un solo tipo de punta a punta.',
  excerptEn:
    'A database test failed intermittently on a guard that requires one event to happen after another. I measured the cause: GETDATE() read right after SYSDATETIME() compares as earlier in 13,339 of 20,000 runs, because datetime rounds to 3.33 ms steps and datetime2 does not. The test was fixed by pushing a timestamp five seconds into the past, which is exactly the fix that corrects nothing; the real correction is one clock and one type end to end.',
  content: `Estaba escribiendo pruebas de base de datos para un flujo con ciclos. Un registro de trabajo se reabre, y para cerrarlo otra vez hace falta una confirmación registrada después de la reapertura. La regla de negocio es sencilla de enunciar: una confirmación que pertenece al ciclo anterior no cuenta para el ciclo nuevo. La guarda que la implementa también parece sencilla: compara dos marcas de tiempo y exige que la confirmación sea igual o posterior a la reapertura.

Las dos marcas de tiempo las escriben dos procedimientos distintos, escritos en momentos distintos. Y ahí estaba el detalle que nadie había mirado: uno de ellos usaba SYSDATETIME() y el otro GETDATE().

\`\`\`sql
-- Writer A: opens the new cycle
UPDATE work_item SET reopened_at = SYSDATETIME() WHERE item_id = @item_id;

-- Writer B: records the confirmation
UPDATE confirmation SET confirmed_at = GETDATE() WHERE item_id = @item_id;

-- Guard: the confirmation must belong to the current cycle
IF NOT EXISTS (SELECT 1 FROM confirmation c JOIN work_item w ON w.item_id = c.item_id
               WHERE c.item_id = @item_id AND c.confirmed_at >= w.reopened_at)
    THROW 50001, 'Confirmation predates the current cycle.', 1;
\`\`\`

Las dos columnas eran datetime2(3), así que a simple vista todo estaba en el mismo tipo. No lo estaba. GETDATE() devuelve datetime, y el valor llega a la columna ya redondeado por ese tipo antes de que la conversión a datetime2(3) lo guarde.

En producción, entre la reapertura y la confirmación pasan segundos: una persona tiene que hacer algo en medio. En una prueba, los dos procedimientos corren uno detrás del otro, separados por microsegundos. Uno de mis casos de prueba hacía exactamente eso: reabría el ciclo y registraba la confirmación de inmediato. Y fallaba. No siempre, pero la mayoría de las veces.

La primera reacción ante una prueba que falla a veces es culpar a la prueba. "Es flaky", "es el entorno", "córrela otra vez". Antes de tocar nada quise saber cuánto fallaba y por qué, porque una prueba intermitente que compara relojes no es ruido: es una medición de algo que todavía no entiendes.

**El enfoque equivocado**

Primero fui a mirar cómo resolvían esto los otros casos de prueba del mismo conjunto. Ninguno fallaba, y la razón era visible en su preparación: todos retrocedían la fecha de reapertura cinco segundos antes de registrar la confirmación. Era una convención ya establecida, y la tentación de seguirla era obvia.

\`\`\`sql
-- Test arrange: push the cycle start 5 s into the past
UPDATE work_item
SET reopened_at = DATEADD(SECOND, -5, reopened_at)
WHERE item_id = @item_id;

EXEC record_confirmation @item_id = @item_id;
EXEC complete_cycle      @item_id = @item_id;  -- passes now
\`\`\`

Lo apliqué, y el caso pasó. Es lo que terminó en el commit de la prueba, y para la prueba es legítimo: simula los segundos que en producción separan los dos pasos, que es justamente lo que el caso necesita para probar otra cosa. Pero conviene ser preciso sobre lo que ese cambio no hace. No toca ninguno de los dos procedimientos. No cambia el reloj que usa cada uno. No cambia el tipo de dato con el que cada uno calcula su marca de tiempo. Solo agranda la distancia entre los dos eventos hasta que el error de redondeo deja de importar.

Visto desde ese ángulo, la convención de los otros casos no era una buena práctica que yo había olvidado seguir. Era la razón por la que nadie había visto el problema antes. Cada caso que retrocedía cinco segundos estaba tapando, sin saberlo, la misma inconsistencia. Si me hubiera quedado ahí, el siguiente en escribir una prueba sin esa preparación habría tropezado con lo mismo, y probablemente habría hecho lo mismo.

El otro arreglo equivocado, más tentador todavía, es relajar la guarda: comparar con una tolerancia de unos milisegundos, o usar mayor estricto en lugar de mayor o igual. Las dos variantes mueven el problema en vez de quitarlo. Una tolerancia hace que la guarda acepte confirmaciones que de verdad son anteriores a la reapertura; cambiar el operador no sirve de nada cuando el valor ya llega redondeado hacia atrás.

**La solución**

Lo primero fue medir. No quería explicar el fallo con una teoría sobre redondeo sin saber cuánto pesaba en la práctica. La forma de la medición fue un bucle que lee los dos relojes uno detrás del otro, en el mismo orden en que los usan los procedimientos, y cuenta cuántas veces el segundo valor compara como anterior al primero.

\`\`\`sql
DECLARE @i int = 0, @earlier int = 0, @first datetime2(3), @second datetime2(3);
WHILE @i < 20000
BEGIN
    SET @first  = SYSDATETIME();
    SET @second = GETDATE();
    IF @second < @first SET @earlier += 1;
    SET @i += 1;
END;
SELECT @earlier AS earlier_runs, @i AS total_runs;  -- 13339 / 20000
\`\`\`

El resultado: en 13,339 de 20,000 ejecuciones, GETDATE() leído después de SYSDATETIME() quedó como anterior. Dos de cada tres veces, el reloj "retrocede". El bucle no tiene concurrencia, ni dos servidores, ni zonas horarias: es la misma sesión leyendo el mismo reloj del sistema dos veces seguidas.

La explicación está en los tipos. datetime no guarda milisegundos arbitrarios: guarda pasos de un trescientosavo de segundo, unos 3.33 ms, y por eso su parte fraccionaria siempre termina en .000, .003 o .007. Cualquier instante se redondea al paso más cercano. datetime2, en cambio, tiene una precisión de 100 nanosegundos.

\`\`\`sql
SELECT CAST('2026-01-01 10:00:00.001' AS datetime) AS r1,           -- .000
       CAST('2026-01-01 10:00:00.002' AS datetime) AS r2,           -- .003
       CAST('2026-01-01 10:00:00.005' AS datetime) AS r3,           -- .007
       CAST('2026-01-01 10:00:00.0012345' AS datetime2(7)) AS r4;   -- exact
\`\`\`

Si SYSDATETIME() lee un instante y GETDATE() lee otro unos microsegundos después, el segundo puede caer redondeado hacia abajo hasta el paso anterior de la grilla de 3.33 ms, mientras el primero conserva su milisegundo real. El evento que ocurrió después queda escrito como si hubiera ocurrido antes.

\`\`\`
real time      ───────────┬──────┬──────────────────────────▶
                          t1     t2        (t1 < t2, µs apart)

SYSDATETIME() at t1 → datetime2(3) → 10:00:00.004
GETDATE()     at t2 → datetime     → 10:00:00.003  (3.33 ms grid)

guard: confirmed_at >= reopened_at  →  .003 >= .004  →  false
\`\`\`

El redondeo al paso más cercano desplaza el valor como máximo medio paso, es decir, unos 1.7 ms hacia cualquiera de los dos lados. Eso define el tamaño de la ventana. Hacia un lado, la guarda rechaza una confirmación legítima registrada a menos de 1.7 ms de la reapertura: es lo que rompía mi prueba, y en producción no ocurre porque entre los dos pasos pasan segundos. Hacia el otro lado está la parte que importa: una confirmación registrada hasta unos 1.7 ms antes de la reapertura puede quedar escrita como posterior, y contar para el ciclo nuevo cuando pertenece al anterior. Es una carrera estrecha y difícil de alcanzar, pero contradice exactamente la regla que la guarda existe para hacer cumplir.

La corrección real no está en la prueba ni en la guarda. Está en el procedimiento que escribe la confirmación: que use el mismo reloj y el mismo tipo que el procedimiento que escribe la reapertura.

\`\`\`sql
-- Writer B, one clock and one type with Writer A
UPDATE confirmation SET confirmed_at = SYSDATETIME() WHERE item_id = @item_id;
\`\`\`

Con las dos marcas de tiempo calculadas por SYSDATETIME(), las dos pasan por el mismo camino de redondeo, el de datetime2 a datetime2(3). Dos lecturas sucesivas del mismo reloj, convertidas al mismo tipo, ya no pueden invertir su orden por culpa de la conversión.

Ese cambio no lo apliqué en ese momento. El procedimiento tenía cambios en curso de otra persona sin publicar, y meter una edición encima habría mezclado dos trabajos en el mismo archivo. Lo dejé registrado como pendiente, con la medición y la explicación, para que el dueño del archivo lo aplicara sobre su propio trabajo. Un arreglo de una línea no justifica pisar el trabajo de otra persona; una nota con el número exacto y la línea exacta sí deja el arreglo listo para cuando el archivo esté libre.

**El impacto**

La prueba quedó verde, pero el verde vino acompañado de algo más útil: una explicación medida de por qué el resto del conjunto necesitaba retroceder cinco segundos. Antes, esa preparación era una convención sin justificación escrita; ahora es una decisión consciente, con su razón al lado, y con la diferencia clara entre lo que simula en la prueba y lo que no corrige en el código.

El hallazgo dejó también un número concreto donde antes había una sensación. "A veces falla" se convirtió en 13,339 de 20,000. Ese número cambia la conversación: nadie discute si una prueba que falla dos de cada tres veces es flaky; está señalando algo determinista con una distribución que se puede explicar.

Y dejó una regla para el resto del esquema: cualquier par de marcas de tiempo que una guarda compare entre sí tiene que salir del mismo reloj y del mismo tipo. Revisar eso es barato: buscar dónde se mezclan GETDATE() y SYSDATETIME() en columnas que después se comparan. Arreglarlo después de que una carrera de 1.7 ms aparezca en un incidente no lo es.

**Lecciones**

**Dos funciones que "devuelven la hora actual" no devuelven el mismo valor.** GETDATE() y SYSDATETIME() leen el mismo reloj del sistema, pero lo entregan en tipos distintos, y el tipo decide el redondeo. Leídos con microsegundos de diferencia, el orden de sus resultados no es el orden en que se leyeron.

**Una columna datetime2 no garantiza precisión datetime2.** Si el valor que se guarda viene de una expresión datetime, ya llega redondeado a pasos de 3.33 ms; la columna conserva con fidelidad un valor que ya perdió la información. El tipo que importa es el de la expresión que calcula el valor; el de la columna que lo recibe llega tarde para recuperar lo que el redondeo ya se llevó.

**Una prueba intermitente que compara tiempos es una medición, no ruido.** Contar cuántas veces falla y en qué condiciones convirtió un "a veces" en un número, y el número llevó directo a la causa. Correr la prueba otra vez hasta que pase habría escondido lo mismo que escondía la convención de los cinco segundos.

**Separar el evento en la prueba no corrige el código.** Retroceder una fecha es legítimo para simular el tiempo que pasa en producción, pero hay que decir en voz alta que eso solo agranda la distancia entre los eventos hasta que el error deja de verse. La inconsistencia sigue ahí, esperando al caso que no tenga esa preparación.

**Un solo reloj y un solo tipo de punta a punta.** Cuando una regla depende del orden entre dos eventos, las dos marcas de tiempo tienen que salir de la misma fuente y pasar por la misma conversión. Es una línea por procedimiento, y es la diferencia entre una guarda que hace cumplir el orden y una que lo invierte dos de cada tres veces.`,
  contentEn: `I was writing database tests for a flow built around cycles. A work record gets reopened, and closing it again requires a confirmation recorded after the reopening. The business rule is easy to state: a confirmation that belongs to the previous cycle does not count for the new one. The guard that enforces it looks just as easy: it compares two timestamps and requires the confirmation to be equal to or later than the reopening.

Two different procedures write those two timestamps, and they were written at different times. That was the detail nobody had looked at: one of them used SYSDATETIME() and the other used GETDATE().

\`\`\`sql
-- Writer A: opens the new cycle
UPDATE work_item SET reopened_at = SYSDATETIME() WHERE item_id = @item_id;

-- Writer B: records the confirmation
UPDATE confirmation SET confirmed_at = GETDATE() WHERE item_id = @item_id;

-- Guard: the confirmation must belong to the current cycle
IF NOT EXISTS (SELECT 1 FROM confirmation c JOIN work_item w ON w.item_id = c.item_id
               WHERE c.item_id = @item_id AND c.confirmed_at >= w.reopened_at)
    THROW 50001, 'Confirmation predates the current cycle.', 1;
\`\`\`

Both columns were datetime2(3), so at first glance everything lived in the same type. It did not. GETDATE() returns datetime, and the value reaches the column already rounded by that type before the conversion to datetime2(3) stores it.

In production, seconds pass between the reopening and the confirmation: a person has to do something in between. In a test, the two procedures run back to back, microseconds apart. One of my test cases did exactly that: it reopened the cycle and recorded the confirmation immediately. And it failed. Not every time, but most of the time.

The first reaction to a test that fails sometimes is to blame the test. "It's flaky", "it's the environment", "run it again". Before touching anything I wanted to know how often it failed and why, because an intermittent test that compares clocks is not noise: it is a measurement of something you do not understand yet.

**The wrong approach**

I first looked at how the other cases in the same suite dealt with this. None of them failed, and the reason was right there in their setup: every one of them pushed the reopening timestamp five seconds into the past before recording the confirmation. It was an established convention, and the temptation to follow it was obvious.

\`\`\`sql
-- Test arrange: push the cycle start 5 s into the past
UPDATE work_item
SET reopened_at = DATEADD(SECOND, -5, reopened_at)
WHERE item_id = @item_id;

EXEC record_confirmation @item_id = @item_id;
EXEC complete_cycle      @item_id = @item_id;  -- passes now
\`\`\`

I applied it, and the case passed. That is what ended up in the test commit, and for the test it is legitimate: it simulates the seconds that separate the two steps in production, which is exactly what the case needs in order to test something else. But it pays to be precise about what that change does not do. It touches neither procedure. It does not change the clock each one reads. It does not change the data type each one uses to compute its timestamp. It only widens the gap between the two events until the rounding error stops mattering.

Seen from that angle, the convention in the other cases was not a good practice I had forgotten to follow. It was the reason nobody had seen the problem before. Every case that went back five seconds was unknowingly covering up the same inconsistency. Had I stopped there, the next person to write a test without that setup would have tripped over the same thing, and would probably have done the same.

The other wrong fix, even more tempting, is to loosen the guard: compare with a tolerance of a few milliseconds, or use strictly-greater instead of greater-or-equal. Both variants move the problem instead of removing it. A tolerance makes the guard accept confirmations that really are earlier than the reopening; changing the operator does nothing when the value already arrives rounded backwards.

**The solution**

The first step was to measure. I did not want to explain the failure with a theory about rounding without knowing how much it weighed in practice. The shape of the measurement was a loop that reads both clocks back to back, in the same order the procedures use them, and counts how many times the second value compares as earlier than the first.

\`\`\`sql
DECLARE @i int = 0, @earlier int = 0, @first datetime2(3), @second datetime2(3);
WHILE @i < 20000
BEGIN
    SET @first  = SYSDATETIME();
    SET @second = GETDATE();
    IF @second < @first SET @earlier += 1;
    SET @i += 1;
END;
SELECT @earlier AS earlier_runs, @i AS total_runs;  -- 13339 / 20000
\`\`\`

The result: in 13,339 of 20,000 runs, GETDATE() read after SYSDATETIME() came out as earlier. Two times out of three, the clock "runs backwards". The loop has no concurrency, no second server, no time zones: it is the same session reading the same system clock twice in a row.

The explanation lives in the types. datetime does not store arbitrary milliseconds: it stores steps of one three-hundredth of a second, about 3.33 ms, which is why its fractional part always ends in .000, .003 or .007. Any instant gets rounded to the nearest step. datetime2, on the other hand, has a precision of 100 nanoseconds.

\`\`\`sql
SELECT CAST('2026-01-01 10:00:00.001' AS datetime) AS r1,           -- .000
       CAST('2026-01-01 10:00:00.002' AS datetime) AS r2,           -- .003
       CAST('2026-01-01 10:00:00.005' AS datetime) AS r3,           -- .007
       CAST('2026-01-01 10:00:00.0012345' AS datetime2(7)) AS r4;   -- exact
\`\`\`

If SYSDATETIME() reads one instant and GETDATE() reads another a few microseconds later, the second one can be rounded down to the previous step of the 3.33 ms grid, while the first keeps its real millisecond. The event that happened later gets written as if it had happened first.

\`\`\`
real time      ───────────┬──────┬──────────────────────────▶
                          t1     t2        (t1 < t2, µs apart)

SYSDATETIME() at t1 → datetime2(3) → 10:00:00.004
GETDATE()     at t2 → datetime     → 10:00:00.003  (3.33 ms grid)

guard: confirmed_at >= reopened_at  →  .003 >= .004  →  false
\`\`\`

Rounding to the nearest step moves the value by at most half a step, roughly 1.7 ms in either direction. That sets the size of the window. In one direction, the guard rejects a legitimate confirmation recorded less than 1.7 ms after the reopening: that is what broke my test, and it does not happen in production because seconds pass between the two steps. The other direction is the one that matters: a confirmation recorded up to about 1.7 ms before the reopening can be written as later, and count for the new cycle when it belongs to the old one. It is a narrow race and hard to hit, but it contradicts exactly the rule the guard exists to enforce.

The real correction is not in the test and not in the guard. It belongs in the procedure that writes the confirmation: it should use the same clock and the same type as the procedure that writes the reopening.

\`\`\`sql
-- Writer B, one clock and one type with Writer A
UPDATE confirmation SET confirmed_at = SYSDATETIME() WHERE item_id = @item_id;
\`\`\`

With both timestamps computed by SYSDATETIME(), both go through the same rounding path, datetime2 into datetime2(3). Two successive reads of the same clock, converted to the same type, can no longer swap their order because of the conversion.

I did not apply that change at the time. The procedure had unpublished work in progress by someone else, and editing on top of it would have mixed two pieces of work in the same file. I recorded it as pending, with the measurement and the explanation, so the owner of the file could apply it on top of their own work. A one-line fix does not justify stepping on someone else's work; a note with the exact number and the exact line leaves the fix ready for when the file is free.

**The impact**

The test went green, but the green came with something more useful: a measured explanation of why the rest of the suite needed to go back five seconds. Before, that setup was a convention with no written justification; now it is a deliberate decision with its reason next to it, and with a clear line between what it simulates in the test and what it does not fix in the code.

The finding also put a concrete number where there used to be a feeling. "It fails sometimes" became 13,339 of 20,000. That number changes the conversation: nobody argues whether a test that fails two times out of three is flaky; it is pointing at something deterministic with a distribution you can explain.

And it left a rule for the rest of the schema: any pair of timestamps a guard compares against each other has to come from the same clock and the same type. Checking that is cheap: look for places where GETDATE() and SYSDATETIME() are mixed into columns that later get compared. Fixing it after a 1.7 ms race shows up in an incident is not.

**Lessons**

**Two functions that "return the current time" do not return the same value.** GETDATE() and SYSDATETIME() read the same system clock, but they hand it back in different types, and the type decides the rounding. Read microseconds apart, the order of their results is not the order in which they were read.

**A datetime2 column does not guarantee datetime2 precision.** If the stored value comes from a datetime expression, it arrives already rounded to 3.33 ms steps; the column faithfully keeps a value that has already lost the information. The type that matters is the type of the expression that computes the value, not just the type of the column that receives it.

**An intermittent test that compares times is a measurement, not noise.** Counting how often it failed and under what conditions turned "sometimes" into a number, and the number led straight to the cause. Rerunning the test until it passed would have hidden the same thing the five-second convention was hiding.

**Separating the events in the test does not fix the code.** Going back in time is legitimate for simulating the time that passes in production, but it has to be said out loud that this only widens the gap between the events until the error stops being visible. The inconsistency is still there, waiting for the case that lacks that setup.

**One clock and one type, end to end.** When a rule depends on the order of two events, both timestamps have to come from the same source and go through the same conversion. It is one line per procedure, and it is the difference between a guard that enforces the order and one that inverts it two times out of three.`,
  relatedIds: [
    'dapper-stored-procedures-why-how',
    'authorization-attribute-invisible-to-unit-test',
    'adversarial-review-missed-user-defects',
  ],
}
