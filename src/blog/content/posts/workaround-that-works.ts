import type { BlogPost } from '../../types'

export const workaroundThatWorks: Omit<BlogPost, 'readingTime'> = {
  id: 'workaround-that-works',
  slug: 'el-arreglo-que-funciona-no-decide',
  title: 'Si un arreglo hace pasar la prueba, deja escrito qué problema tapa',
  titleEn: 'If a Workaround Makes the Test Pass, Write Down What It Is Hiding',
  date: '2026-11-17',
  tags: ['decisiones', 'deuda técnica', 'testing', 'liderazgo'],
  category: 'ensayo',
  featured: false,
  excerpt:
    'Un arreglo que hace pasar la prueba parece una decisión y casi nunca lo es, porque apaga la única señal del defecto y deja un ejemplo listo para copiar. Lo vi en un conjunto de pruebas donde todos los casos retrocedían una fecha cinco segundos, y esa convención tapaba un defecto que aparecía en 13,339 de 20,000 ejecuciones. A veces el arreglo es la opción correcta. Lo que sale caro es dejarlo sin nota y sin dueño.',
  excerptEn:
    'A workaround that makes the test pass looks like a decision and rarely is one, because it switches off the only signal of the defect and leaves behind an example ready to be copied. I saw it in a test suite where every case pushed a timestamp five seconds back, and that convention covered a defect showing up in 13,339 of 20,000 runs. Sometimes the workaround is the right call. What gets expensive is leaving it with no note and no owner.',
  content: `Llamo arreglo a un cambio que hace pasar la prueba sin corregir la causa del problema. Cuando funciona, se siente como una decisión tomada, y casi nunca lo es. Había dos decisiones posibles: corregir el defecto, o aceptarlo por escrito con sus condiciones. El arreglo permitió no tomar ninguna. La prueba queda verde, el trabajo sigue, y nadie queda a cargo de la pregunta de fondo.

Creo que esta es la forma más cara de dejar algo sin decidir, y tengo una razón concreta. Las otras formas se notan. Un ticket abierto estorba. Una prueba en rojo estorba. Una reunión aplazada vuelve a aparecer en la agenda. El arreglo que funciona no le estorba a nadie. Apaga la única señal que avisaba del problema y deja en su lugar un ejemplo que funciona, listo para que la siguiente persona lo copie.

**Lo que se suele pensar**

La opinión habitual es razonable, y la comparto a medias. Dice que hay que ser pragmático. El plazo existe, la causa de fondo puede tardar días en aparecer, y un equipo que persigue cada rareza hasta el final no entrega nada. Entonces se resuelve lo urgente ahora y lo demás se anota para después.

La versión más seria de esa idea compara el código apurado con una deuda. Ward Cunningham la escribió en 1992, en un [informe de experiencia para OOPSLA](https://c2.com/doc/oopsla92.html): "Shipping first time code is like going into debt". Es decir, publicar código de primera pasada es como endeudarse. En la frase siguiente aclara que un poco de deuda acelera el desarrollo siempre que se pague pronto. Después dice dónde está el riesgo: "The danger occurs when the debt is not repaid".

Estoy de acuerdo con todo eso. Mi desacuerdo es con algo que se da por hecho cuando la comparación se usa a la ligera, y es que alguien sabe que pidió prestado. Una deuda tiene monto y tiene deudor. Quien la contrajo puede elegir cuándo pagarla porque sabe que existe. La opinión habitual trata cualquier arreglo rápido como deuda, y una buena parte de ellos no llega a serlo. Son un gasto que nadie registró.

**Qué pasó cuando copié un arreglo**

Tengo un caso medido. El detalle técnico está en [el artículo sobre GETDATE() y SYSDATETIME()](#blog/article/getdate-vs-sysdatetime-reloj-que-retrocede). Aquí me interesa lo que enseña sobre decidir.

Estaba escribiendo pruebas de base de datos para una regla que depende del orden entre dos eventos: una confirmación solo cuenta si se registró después de una reapertura. Uno de mis casos fallaba la mayoría de las veces. Fui a mirar cómo lo resolvían los demás casos del mismo conjunto, y ninguno fallaba. La razón estaba en su preparación. Todos retrocedían cinco segundos la fecha de la reapertura antes de registrar la confirmación.

Esa línea era una convención del conjunto de pruebas y no tenía ninguna justificación escrita. Daban ganas de copiarla, porque funcionaba. La copié, y mi caso pasó.

También medí qué estaba tapando. Las dos marcas de tiempo las escribían dos procedimientos distintos. Cada uno usaba una función de reloj diferente, y las dos funciones devuelven tipos con precisión distinta. Leídas una detrás de la otra, la segunda comparó como anterior a la primera en 13,339 de 20,000 ejecuciones. Dos de cada tres veces, el evento que ocurrió después quedaba escrito como si hubiera ocurrido antes.

Ese número me importa por lo que dice de la convención. Los cinco segundos parecían una buena práctica que a mí se me había olvidado seguir. Resultaron ser la razón por la que nadie había visto el defecto. Cada caso que copiaba la línea agrandaba la distancia entre los dos eventos hasta que el error de redondeo dejaba de notarse. Y cada copia hacía que la línea le pareciera más normal a la siguiente persona que llegara.

El defecto tampoco era solo un asunto de pruebas. Por un lado, la comparación rechazaba confirmaciones legítimas registradas a menos de 1.7 ms de la reapertura. Eso en producción no ocurre, porque entre los dos pasos pasan segundos. Por el otro lado, podía aceptar para el ciclo nuevo una confirmación que pertenecía al anterior. Es una condición de carrera estrecha y difícil de provocar, pero contradice exactamente la regla que esa comparación debe hacer cumplir.

De ahí saco cómo funciona esto en general, en tres pasos. Primero, el arreglo apaga la señal. La prueba en rojo era la única medición disponible del defecto, y deja de medir. Segundo, el arreglo se vuelve ejemplo. Quien llega después encuentra código que funciona y lo copia, porque copiar lo que funciona es lo sensato. Tercero, el ejemplo se vuelve norma, y desde ese momento el raro es quien no la sigue. En ninguno de los tres pasos alguien decidió que el defecto era aceptable. Tampoco decidió nadie corregirlo.

> Nadie decidió que el defecto era aceptable. Tampoco decidió nadie corregirlo.

Cunningham dice que cada minuto gastado en código que no está del todo bien cuenta como interés: "Every minute spent on not-quite-right code counts as interest on that debt". Con un arreglo que se volvió convención ese interés se paga igual, pero nadie lo ve anotado en ninguna parte.

**Cuánto cuesta cada opción con el tiempo**

Para pensar el costo uso este dibujo.

![Dos líneas de costo acumulado en el tiempo. La corrección de raíz sube una sola vez al inicio y queda plana. El arreglo que funciona empieza casi en cero y sube un escalón con cada copia, hasta superar a la corrección.](figure/workaround-cost "Esquema conceptual, no datos medidos. La corrección cuesta una vez. El arreglo cuesta poco y vuelve a costar con cada copia.")

La corrección de raíz cuesta mucho una vez, porque hay que entender la causa y entender es la parte cara. Después su costo queda plano. El arreglo cuesta casi nada el primer día y sube un escalón con cada copia. Cada copia es una línea más que mantener, una persona más que la aprendió como norma y un lugar más donde el defecto quedó tapado.

El dibujo no tiene números porque no los tengo, y eso es parte del argumento. En el momento de elegir, nadie sabe dónde se cruzan las dos líneas. Lo que sí se sabe es quién paga cada una. La corrección la paga quien decide, hoy, con su tiempo. Los escalones del arreglo los paga gente que llega después y que no sabe que está pagando algo.

El dibujo simplifica un detalle. La línea de la corrección está trazada como si la corrección se hiciera al principio. Si se hace tarde, a veces cuesta más, porque además del defecto hay que desmontar la convención. En mi caso no fue así. La corrección seguía siendo una línea en un procedimiento. Lo que cada copia encareció fue encontrarla.

**Cómo aplicarlo**

No propongo corregir todo de raíz. Propongo que quien use un arreglo deje dicho qué queda sin resolver.

**1. Mide antes de tapar**

Una prueba intermitente está midiendo algo que todavía no entiendes. Contar cuántas veces falla cambia la conversación, porque nadie discute si es ruido algo que falla 13,339 veces de 20,000. Con el número en la mano ya no aplicas el arreglo por reflejo. Lo comparas con las otras opciones.

**2. Escribe al lado del arreglo qué simula y qué no corrige**

Mis cinco segundos simulan el tiempo que en producción separa los dos pasos. No cambian el reloj que usa cada procedimiento ni el tipo con el que calcula su marca de tiempo. Con esa frase al lado, la línea queda como una decisión con su razón escrita. La siguiente persona que la copie sabrá qué está copiando.

**3. Dale dueño a la corrección**

No apliqué la corrección de fondo en ese momento. El procedimiento tenía cambios sin publicar de otra persona, y editar encima habría mezclado dos trabajos en el mismo archivo. La dejé registrada como pendiente, con la medición y la línea exacta, para la persona dueña del archivo. Con ese registro el gasto pasa a ser una deuda como la que describe Cunningham, porque ahora tiene monto y tiene a quién cobrársela.

**4. Pregunta qué tapa la línea que se repite**

Esto va para quien dirige y revisa. En una revisión sirve más preguntar qué hubo que hacer para que la prueba pasara que preguntar si pasa. Una preparación idéntica en todos los casos, sin explicación, es el síntoma más barato de detectar. Puede ser una simulación legítima o puede estar ocultando un defecto. Sin la nota no hay forma de distinguirlas.

**Dónde puedo estar equivocado**

A veces el arreglo es la decisión correcta, y mi propio caso lo muestra. Los cinco segundos terminaron en el commit de la prueba y los volvería a escribir. Ese caso existía para probar otra cosa. Además, en producción los dos pasos están separados por segundos porque una persona tiene que hacer algo en medio. Simular esa distancia es legítimo.

Creo que el arreglo es la opción correcta cuando se cumplen tres condiciones: se sabe qué tapa, queda escrito junto a él, y la corrección de fondo tiene dueño o se descartó de forma explícita. Con las tres, es una decisión. Si falta alguna, nadie decidió nada, aunque lo parezca.

También hay casos en los que no vale la pena corregir. Puede ser un sistema que se va a retirar, un defecto cuyo peor caso es tolerable, o una corrección que toca algo más riesgoso que el propio defecto. En esos casos las dos líneas del dibujo no se cruzan nunca. Decir "lo aceptamos, por esto" es decidir, y cuesta una frase.

Y tengo que decir hasta dónde llega mi evidencia. Es un caso, en un conjunto de pruebas, medido por mí. No tengo datos sobre cuánto cuesta en general una convención así, ni sobre qué proporción de los arreglos copiados esconde algo serio. Puede que la mayoría no esconda nada, y entonces "la forma más cara" sería una exageración en promedio. Mi argumento no necesita que sean mayoría. Necesita que no se pueda saber cuáles son, y sin la nota al lado no se puede.

Lo que me llevo es una regla corta: si dejas un arreglo sin nota, otra persona va a heredar una decisión sin saber que existe.`,
  contentEn: `By workaround I mean a change that makes the test pass without fixing the cause of the problem. When it works, it feels like a decision, and it rarely is one. There were two decisions on the table: fix the defect, or accept it in writing with its conditions. The workaround let me make neither. The test goes green, the work moves on, and nobody is left in charge of the underlying question.

I think this is the most expensive way to leave something undecided, and I have a specific reason. The other ways are visible. An open ticket is in the way. A red test is in the way. A postponed meeting shows up on the calendar again. A workaround that works is in nobody's way. It switches off the only signal that pointed at the problem and leaves a working example in its place, ready for the next person to copy.

**The common view**

The usual position is reasonable, and I hold half of it. It says you have to be pragmatic. The deadline is real, the root cause can take days to find, and a team that chases every oddity to the bottom ships nothing. So you handle the urgent part now and write the rest down for later.

The most serious version of that idea compares rushed code to a debt. Ward Cunningham wrote it down in 1992, in an [experience report for OOPSLA](https://c2.com/doc/oopsla92.html): "Shipping first time code is like going into debt". His next sentence says a little debt speeds development so long as it is paid back promptly. Then he says where the risk is: "The danger occurs when the debt is not repaid".

I agree with all of it. What I disagree with is something people take for granted when they use the comparison loosely, which is that somebody knows they borrowed. A debt has an amount and a debtor. Whoever took it on can choose when to repay it because they know it exists. The common view treats every quick workaround as debt, and a good share of them never get that far. They are spending that nobody recorded.

**What happened when I copied a workaround**

I have a measured case. The technical detail is in [the post on GETDATE() and SYSDATETIME()](#blog/article/getdate-vs-sysdatetime-reloj-que-retrocede). What I care about here is what it teaches about deciding.

I was writing database tests for a rule that depends on the order of two events: a confirmation only counts if it was recorded after a reopening. One of my cases failed most of the time. I went to see how the other cases in the same suite handled it, and none of them failed. The reason was in their setup. Every one of them pushed the reopening timestamp five seconds into the past before recording the confirmation.

That line was a convention of the test suite, with no written reason anywhere. It was tempting to copy, because it worked. I copied it, and my case passed.

I also measured what it was covering. The two timestamps were written by two different procedures. Each one used a different clock function, and the two functions return types of different precision. Read back to back, the second value compared as earlier than the first in 13,339 of 20,000 runs. Two times out of three, the event that happened later was written down as if it had happened first.

That number matters to me for what it says about the convention. The five seconds looked like a good practice I had forgotten to follow. They turned out to be the reason nobody had seen the defect. Every case that copied the line widened the gap between the two events until the rounding error stopped showing. And every copy made the line look more normal to whoever came next.

The defect was not just a testing matter either. In one direction, the comparison rejected legitimate confirmations recorded less than 1.7 ms after the reopening. That does not happen in production, because seconds pass between the two steps. In the other direction, it could accept for the new cycle a confirmation that belonged to the previous one. That is a narrow race condition and hard to trigger, but it contradicts exactly the rule the comparison is there to enforce.

From there I get how this works in general, in three steps. First, the workaround switches off the signal. The red test was the only available measurement of the defect, and it stops measuring. Second, the workaround becomes an example. Whoever arrives later finds code that works and copies it, because copying what works is the sensible thing to do. Third, the example becomes the norm, and from then on the odd one out is whoever does not follow it. At no step did anyone decide the defect was acceptable. Nobody decided to fix it, either.

> Nobody decided the defect was acceptable. Nobody decided to fix it, either.

Cunningham says that every minute spent on code that is not quite right counts as interest: "Every minute spent on not-quite-right code counts as interest on that debt". With a workaround that has turned into a convention, that interest still gets paid, but nobody sees it written down anywhere.

**What each option costs over time**

This is the sketch I use to think about the cost.

![Two lines of cumulative cost over time. The root fix rises once at the start and stays flat. The workaround starts near zero and climbs one step with every copy, until it passes the fix.](figure/workaround-cost "Conceptual sketch, not measured data. The fix costs once. The workaround costs little and then costs again with every copy.")

The root fix costs a lot once, because you have to understand the cause, and understanding is the expensive part. After that its cost stays flat. The workaround costs almost nothing on day one and climbs a step with every copy. Each copy is one more line to maintain, one more person who learned it as the norm, and one more place where the defect is covered.

The sketch has no numbers because I do not have them, and that is part of the argument. At the moment of choosing, nobody knows where the two lines cross. What you do know is who pays for each. The fix is paid by the person deciding, today, with their own time. The steps of the workaround are paid by people who arrive later and do not know they are paying for anything.

The sketch simplifies one detail. The fix line is drawn as if the fix happened at the start. Done late, it sometimes costs more, because on top of the defect you have to take the convention apart. That was not my case. The fix was still one line in one procedure. What each copy made more expensive was finding it.

**How to apply it**

I am not proposing to fix everything at the root. I am proposing that whoever uses a workaround says in writing what is left unresolved.

**1. Measure before you cover**

An intermittent test is measuring something you do not understand yet. Counting how often it fails changes the conversation, because nobody argues that something failing 13,339 times out of 20,000 is noise. With the number in hand, you no longer apply the workaround by reflex. You compare it with the other options.

**2. Write next to the workaround what it simulates and what it does not fix**

My five seconds simulate the time that separates the two steps in production. They do not change the clock each procedure reads, or the type it uses to compute its timestamp. With that sentence next to it, the line stands as a decision with its reason written down. The next person who copies it will know what they are copying.

**3. Give the fix an owner**

I did not apply the root fix at the time. The procedure had someone else's unpublished changes in it, and editing on top would have mixed two pieces of work in one file. I recorded it as pending, with the measurement and the exact line, for the owner of that file. With that record the spending becomes a debt of the kind Cunningham describes, because it now has an amount and someone to collect from.

**4. Ask what the repeated line is covering**

This one is for whoever leads and reviews. In a review, asking what had to be done to make the test pass is more useful than asking whether it passes. An identical piece of setup in every case, with no explanation, is the cheapest symptom there is to spot. It may be a legitimate simulation, or it may be hiding a defect. Without the note there is no way to tell them apart.

**Where I could be wrong**

Sometimes the workaround is the right call, and my own case shows it. The five seconds ended up in the test commit and I would write them again. That case existed to test something else. Also, in production the two steps are seconds apart because a person has to do something in between. Simulating that distance is legitimate.

I think the workaround is the right option when three conditions hold: you know what it covers, that is written next to it, and the root fix either has an owner or was explicitly ruled out. With all three, it is a decision. With one missing, nobody decided anything, even if it looks as though someone did.

There are also cases where fixing is not worth it. It may be a system about to be retired, a defect whose worst case is tolerable, or a fix that touches something riskier than the defect itself. In those cases the two lines in the sketch never cross. Saying "we accept this, and here is why" is deciding, and it costs one sentence.

And I have to say how far my evidence reaches. It is one case, in one test suite, measured by me. I have no data on what a convention like that costs in general, or on what share of copied workarounds hide something serious. Most of them may hide nothing, and then "the most expensive way" would be an overstatement on average. My argument does not need them to be the majority. It needs you to be unable to tell which ones they are, and without the note next to them you cannot.

The rule I take from this is short: if you leave a workaround with no note, someone else will inherit a decision without knowing it exists.`,
  relatedIds: [
    'getdate-vs-sysdatetime',
    'characterization-tests-before-refactor',
    'adversarial-review-missed-user-defects',
  ],
}
