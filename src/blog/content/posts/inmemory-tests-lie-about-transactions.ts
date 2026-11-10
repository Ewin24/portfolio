import type { BlogPost } from '../../types'

// ═════════════════════════════════════════════════════════════════════════
// InMemory tests lie about transactions
// ═════════════════════════════════════════════════════════════════════════
export const inMemoryTestsLieAboutTransactions: Omit<BlogPost, 'readingTime'> = {
  id: 'inmemory-tests-lie-about-transactions',
  slug: 'pruebas-inmemory-mienten-sobre-transacciones',
  title: 'Las pruebas InMemory mienten sobre las transacciones',
  titleEn: 'InMemory Tests Lie About Transactions',
  date: '2026-11-07',
  tags: ['testing', 'EF Core', 'SQL Server', 'dotnet', 'concurrency'],
  category: 'arquitectura',
  featured: false,
  excerpt:
    'En DevManager, una suite de unas 400 pruebas sobre el proveedor InMemory de EF Core estaba en verde mientras la confirmación de propuestas de IA, una transacción con un cambio de estado condicional, seguía sin probarse contra el motor. InMemory no implementa transacciones, bloqueos ni índices únicos como SQL Server. Cuando un verificador independiente corrió sondas contra un SQL Server real, encontró tres bloqueadores que la suite no podía ver.',
  excerptEn:
    'In DevManager, a suite of about 400 tests on the EF Core InMemory provider was green while the confirmation of AI proposals, a transaction built around a conditional state change, had never run against the engine. InMemory does not implement transactions, locks, or unique indexes the way SQL Server does. When an independent verifier ran probes against a real SQL Server, it found three blockers the suite could not see.',
  content: `DevManager empezó como mi proyecto de grado y hoy es un SaaS multi-tenant que sigo desarrollando: .NET 8, EF Core y SQL Server, con varias organizaciones compartiendo la misma base de datos, separadas por un identificador de organización en cada fila. Hace unas semanas le añadí un módulo de actividades al estilo de un tablero de tareas, con una pieza que me interesaba más que el resto: la IA puede proponer un lote de tareas a partir de un requisito escrito en lenguaje natural, pero ninguna tarea existe hasta que una persona revisa la propuesta y la confirma.

Ese "hasta que una persona la confirma" es la frontera humana del flujo, y es justo donde la concurrencia deja de ser teórica. Una propuesta pendiente aparece en el panel del proyecto y también en la tarjeta del chat donde se generó. Dos personas con permiso pueden abrirla a la vez. La misma persona puede pulsar el botón dos veces porque la red tardó en responder. El requisito que escribí en el diseño fue corto: la confirmación es una sola transacción; si dos aprobaciones llegan juntas, una gana y la otra recibe un 409, y el tablero nunca termina con tareas duplicadas ni con números de tarea repetidos.

Cada tarea tiene una clave legible formada por un prefijo del proyecto y un número consecutivo. Ese número sale de un contador por proyecto, y confirmar una propuesta reserva de golpe tantos números como tareas trae el lote. En la misma transacción conviven entonces tres cosas delicadas: un cambio de estado condicional, una reserva de números que debe ser atómica por proyecto, y un índice único sobre el par proyecto y número como última red de seguridad.

La suite de pruebas corría sobre el proveedor InMemory de EF Core. Al cerrar el módulo tenía unas 400 pruebas en verde. Y aun así, la nota de cierre que dejé ese día decía que la concurrencia y el rollback contra SQL real seguían sin probar, porque no existía un arnés de pruebas contra el motor. Ese verde era real. Lo que no era real era todo lo que yo hubiera querido afirmar a partir de él.

**El enfoque equivocado**

La aprobación de acciones que ya existía en el proyecto seguía el patrón que cualquiera escribe la primera vez: leer la entidad, comprobar su estado, cambiarlo y guardar.

\`\`\`csharp
var proposal = await db.Proposals.FindAsync(id);
if (proposal.Status != ProposalStatus.Pending)
    return Conflict();
proposal.Status = ProposalStatus.Approved;
await db.SaveChangesAsync(); // two requests can both pass the if
\`\`\`

Entre la lectura y el guardado hay una ventana. Dos peticiones pueden leer la propuesta en estado pendiente, ambas pasan el if y ambas guardan. Sin tokens de concurrencia en las entidades, y el repositorio no tenía ninguno, la segunda escritura no falla: pisa a la primera en silencio, y cada petición sigue adelante creando su propio lote de tareas.

Una prueba de doble confirmación sobre InMemory se ve más o menos así, y pasa:

\`\`\`csharp
[Fact]
public async Task Second_confirm_loses_ILLUSION()
{
    await using var db = new AppDbContext(InMemoryOptions());
    await _service.ConfirmAsync(db, proposalId);
    var second = await _service.ConfirmAsync(db, proposalId);
    Assert.Equal(ConfirmOutcome.Conflict, second);
    // sequential calls on one context: no lock, no race, no isolation
}
\`\`\`

Pasa por la razón equivocada. Dos llamadas secuenciales sobre el mismo contexto no son una carrera: la segunda ve el estado que dejó la primera porque no hay nada entre ellas. Y aunque las lanzara en paralelo, InMemory no tiene lo que la prueba necesita medir. El proveedor no es una base de datos relacional. No implementa transacciones: por defecto, abrir una lanza una excepción, y la salida habitual para que una suite siga corriendo es configurar el proveedor para ignorar esa advertencia, con lo que el código transaccional pasa sin ninguna atomicidad. No tiene bloqueos ni niveles de aislamiento, y no hace cumplir los índices únicos que declaras en el modelo. Una fila duplicada que el motor rechazaría con un error, InMemory la guarda sin decir nada.

Eso significa que tres de las garantías que el diseño prometía, atomicidad, exclusión mutua y unicidad, no se ejercitaban en ninguna prueba. La suite no mentía sobre la lógica de negocio: validaba bien el esquema de la propuesta, el tope de tareas por lote o el cálculo del orden en el tablero. Mentía por omisión sobre todo lo que depende del motor, y lo hacía con el mismo color verde que usaba para lo demás.

Lo incómodo es que el código de producción también pasaba revisión. Una transacción abierta con BeginTransactionAsync y cerrada con CommitAsync se lee como atómica. Un índice único declarado en la configuración del modelo se lee como garantizado. Nadie que revise ese código va a dudar de él, y ninguna prueba sobre InMemory le va a dar motivos para hacerlo.

**La solución**

La corrección de diseño fue sustituir el patrón de comprobar y luego actuar por una transición condicional: un UPDATE cuyo WHERE incluye el estado de origen. Si actualiza una fila, esta petición ganó. Si actualiza cero, otra ya decidió o la propuesta caducó, y la respuesta es 409. Todo dentro de una transacción que también reserva los números y crea las tareas.

\`\`\`csharp
await using var tx = await db.Database.BeginTransactionAsync(ct);
var won = await db.Proposals
    .Where(p => p.Id == id && p.Status == ProposalStatus.Pending && p.CreatedAt >= cutoff)
    .ExecuteUpdateAsync(s => s.SetProperty(p => p.Status, ProposalStatus.Approved), ct);
if (won == 0) return Conflict(); // 409: someone else already decided
var first = await ReserveNumbersAsync(projectId, items.Count, ct);
db.Tasks.AddRange(BuildTasks(items, first));
await db.SaveChangesAsync(ct);
await tx.CommitAsync(ct);
\`\`\`

La diferencia no está en la sintaxis sino en quién decide. En la versión anterior decidía la aplicación, con un dato que podía estar viejo en el momento de guardar. Aquí decide el motor: el UPDATE bloquea la fila mientras la evalúa, una segunda petición que llega a la misma fila espera a que la primera confirme o revierta, y cuando por fin la evalúa ya no la encuentra en estado pendiente. Cero filas, 409. Nadie tiene que comparar nada en memoria.

Ese camino ni siquiera se puede ejecutar sobre InMemory: ExecuteUpdate solo funciona con proveedores relacionales. La suite rápida podía cubrir lo que rodeaba a la confirmación, pero no la transición en sí, y por eso la nota de cierre de esa entrega decía que la concurrencia y el rollback contra el motor real quedaban sin probar.

La reserva de números sigue la misma idea: un UPDATE sobre el contador del proyecto que suma el tamaño del lote y devuelve el valor nuevo en la misma sentencia. El bloqueo de fila que toma ese UPDATE serializa las reservas de un mismo proyecto sin frenar a los demás. El índice único sobre proyecto y número queda como red de seguridad: si alguna ruta futura se salta el contador, el motor rechaza el duplicado en lugar de guardarlo.

\`\`\`
confirm ──► BEGIN TRAN
             │
             ├─ UPDATE proposal WHERE status = Pending ── 0 rows ──► ROLLBACK ──► 409
             │     (row lock held until commit)
             ├─ UPDATE project counter + n, OUTPUT new value (reserve n numbers)
             ├─ INSERT n tasks          (unique index: project + number)
             └─ COMMIT ──► notify requester
\`\`\`

En el diseño decidí además que el rechazo de una propuesta y la aprobación de las demás acciones del agente usaran exactamente la misma transición condicional, en un único método del repositorio. Un solo camino para cambiar de estado es más fácil de razonar y de probar que tres variantes parecidas escritas en momentos distintos.

Pero un diseño correcto no demuestra nada por sí solo, y la nota de cierre seguía ahí. Las siguientes entregas que tocaron caminos delicados las cerré de otra forma: además de la suite, un verificador independiente ejecutó una batería de sondas contra un SQL Server real, con conexiones separadas para simular a dos usuarios distintos.

\`\`\`csharp
var a = Task.Run(() => ConfirmOnNewConnectionAsync(proposalId));
var b = Task.Run(() => ConfirmOnNewConnectionAsync(proposalId));
var codes = await Task.WhenAll(a, b);
Assert.Single(codes, c => c == 200);
Assert.Single(codes, c => c == 409);
Assert.Equal(expectedTasks, await CountTasksAsync(projectId)); // state, not return values
\`\`\`

Cada sonda dispara las operaciones en conexiones distintas y afirma sobre el estado que quedó en la base: cuántas peticiones ganaron, cuántas perdieron, cuántas filas existen después y si los números siguen siendo únicos. No sobre lo que devolvió un método. Esa distinción es la que separa una prueba de concurrencia de una prueba que solo tiene concurrencia en el nombre.

**El impacto**

Las sondas contra el motor real encontraron tres bloqueadores que la suite InMemory, en verde con varios cientos de pruebas, no podía ver: un problema de bloqueos, una carrera entre dos operaciones que escribían la misma fila y un hueco en el rollback. Ninguno de los tres era un error de lógica que una prueba unitaria mejor escrita hubiera atrapado; los tres dependían de cómo el motor ejecuta transacciones y bloqueos. Los tres se corrigieron y se volvieron a verificar contra SQL Server antes de entregar.

El motor real también me cambió una decisión de producto. La importación masiva de personas desde un CSV corre en una sola transacción, y con READ_COMMITTED_SNAPSHOT desactivado, una importación de 1.000 filas retenía bloqueos durante más de 15 segundos; mientras tanto, peticiones de otras organizaciones quedaban esperando. En un sistema multi-tenant eso es lo peor que puede pasar: un cliente haciendo algo legítimo frena a otro que no tiene nada que ver. Con 200 filas la espera bajaba a entre 1 y 2 segundos. Fijé el límite del archivo en 200 filas y dejé anotado confirmar el aislamiento por versiones de fila en producción antes de desplegar. En InMemory esa importación tardaba lo mismo con o sin otros usuarios, porque no había nadie a quien bloquear.

Hubo un tercer frente, el de los índices: un índice de reportes que hubo que corregir. InMemory tampoco iba a avisar de eso, porque ni usa los índices para consultar ni hace cumplir los que son únicos.

La regla que quedó en mis notas del proyecto es corta: InMemory no cubre transacciones, bloqueos ni índices; lo delicado se verifica en SQL Server real. No reemplacé la suite rápida. Sigue siendo la que corre en cada cambio y la que protege la lógica. Lo que cambió es que ya no le pido que responda preguntas que no puede responder.

**Lecciones**

**InMemory no es una base de datos más rápida: es otra cosa.** No implementa transacciones, bloqueos, aislamiento ni índices únicos como lo hace el motor. Toda prueba cuya aserción dependa de una de esas cuatro cosas pasa en InMemory sin medir nada.

**El verde de una suite vale lo que su afirmación más débil.** Unas 400 pruebas en verde sobre la lógica no compran confianza sobre la concurrencia. Al cerrar una entrega, escribe qué no probaste; esa línea te dice dónde poner la siguiente verificación.

**Comprobar y luego actuar es una carrera, aunque se vea bien en revisión.** La transición condicional, un UPDATE con el estado de origen en el WHERE y el número de filas afectadas como respuesta, convierte la carrera en una decisión del motor, que sí sabe serializar.

**Lo delicado se verifica contra el motor real, con conexiones separadas.** Doble aprobación, reservas concurrentes, rollback a mitad de camino: cada camino así merece una sonda que afirme sobre el estado final de la base, no sobre el retorno de un método.

**Si conservas InMemory, no silencies lo que te avisa.** Por defecto, abrir una transacción en InMemory lanza una excepción. La línea que la mayoría agrega para seguir adelante es justo la que vuelve silenciosa la mentira:

\`\`\`csharp
options.UseInMemoryDatabase("unit")
       // Makes every transaction a no-op: green tests, zero atomicity.
       .ConfigureWarnings(w => w.Ignore(InMemoryEventId.TransactionIgnoredWarning));
\`\`\`

Deja la advertencia en su valor por defecto. Así, la primera prueba que abre una transacción falla en lugar de pasar, y te obliga a decidir si ese caso pertenece a la suite rápida o a la del motor real.`,
  contentEn: `DevManager started as my degree project and is now a multi-tenant SaaS I keep building: .NET 8, EF Core and SQL Server, with several organizations sharing one database, separated by an organization id on every row. A few weeks ago I added an activities module in the style of a task board, with one piece I cared about more than the rest: the AI can propose a batch of tasks from a requirement written in plain language, but no task exists until a person reviews the proposal and confirms it.

That "until a person confirms it" is the human boundary of the flow, and it is exactly where concurrency stops being theoretical. A pending proposal shows up in the project panel and also in the chat card where it was generated. Two people with permission can open it at the same time. The same person can click the button twice because the network was slow. The requirement I wrote in the design was short: confirmation is a single transaction; if two approvals arrive together, one wins and the other gets a 409, and the board never ends up with duplicated tasks or repeated task numbers.

Every task has a readable key made of a project prefix and a sequential number. That number comes from a per-project counter, and confirming a proposal reserves as many numbers at once as the batch has tasks. So three delicate things share one transaction: a conditional state change, a number reservation that must be atomic per project, and a unique index on the project and number pair as the last safety net.

The test suite ran on the EF Core InMemory provider. When I closed the module it had about 400 green tests. Even so, the closing note I left that day said that concurrency and rollback against real SQL were still untested, because there was no test harness against the engine. That green was real. What was not real was everything I would have liked to claim from it.

**The wrong approach**

The action approval that already existed in the project followed the pattern everyone writes the first time: read the entity, check its state, change it, save.

\`\`\`csharp
var proposal = await db.Proposals.FindAsync(id);
if (proposal.Status != ProposalStatus.Pending)
    return Conflict();
proposal.Status = ProposalStatus.Approved;
await db.SaveChangesAsync(); // two requests can both pass the if
\`\`\`

There is a window between the read and the save. Two requests can both read the proposal as pending, both pass the if, and both save. With no concurrency tokens on the entities, and the repository had none, the second write does not fail: it silently overwrites the first, and each request goes on to create its own batch of tasks.

A double-confirm test on InMemory looks roughly like this, and it passes:

\`\`\`csharp
[Fact]
public async Task Second_confirm_loses_ILLUSION()
{
    await using var db = new AppDbContext(InMemoryOptions());
    await _service.ConfirmAsync(db, proposalId);
    var second = await _service.ConfirmAsync(db, proposalId);
    Assert.Equal(ConfirmOutcome.Conflict, second);
    // sequential calls on one context: no lock, no race, no isolation
}
\`\`\`

It passes for the wrong reason. Two sequential calls on the same context are not a race: the second one sees the state the first one left because nothing sits between them. And even if I fired them in parallel, InMemory does not have what the test needs to measure. The provider is not a relational database. It does not implement transactions: by default, opening one throws, and the usual way to keep a suite running is to configure the provider to ignore that warning, which lets transactional code pass with no atomicity at all. It has no locks or isolation levels, and it does not enforce the unique indexes you declare in the model. A duplicate row the engine would reject with an error, InMemory stores without a word.

That means three of the guarantees the design promised, atomicity, mutual exclusion and uniqueness, were exercised by no test at all. The suite did not lie about business logic: it validated the proposal schema, the per-batch task cap, and the board ordering math just fine. It lied by omission about everything that depends on the engine, and it did so in the same shade of green it used for everything else.

The uncomfortable part is that the production code passed review too. A transaction opened with BeginTransactionAsync and closed with CommitAsync reads as atomic. A unique index declared in the model configuration reads as guaranteed. Nobody reviewing that code is going to doubt it, and no InMemory test is going to give them a reason to.

**The solution**

The design fix was to replace check-then-act with a conditional transition: an UPDATE whose WHERE clause includes the source state. If it updates one row, this request won. If it updates zero, someone else already decided or the proposal expired, and the answer is 409. All of it inside a transaction that also reserves the numbers and creates the tasks.

\`\`\`csharp
await using var tx = await db.Database.BeginTransactionAsync(ct);
var won = await db.Proposals
    .Where(p => p.Id == id && p.Status == ProposalStatus.Pending && p.CreatedAt >= cutoff)
    .ExecuteUpdateAsync(s => s.SetProperty(p => p.Status, ProposalStatus.Approved), ct);
if (won == 0) return Conflict(); // 409: someone else already decided
var first = await ReserveNumbersAsync(projectId, items.Count, ct);
db.Tasks.AddRange(BuildTasks(items, first));
await db.SaveChangesAsync(ct);
await tx.CommitAsync(ct);
\`\`\`

The difference is not the syntax but who decides. In the old version the application decided, using data that could already be stale by the time it saved. Here the engine decides: the UPDATE locks the row while it evaluates it, a second request hitting the same row waits for the first one to commit or roll back, and when it finally evaluates the row it no longer finds it pending. Zero rows, 409. Nobody has to compare anything in memory.

That path cannot even run on InMemory: ExecuteUpdate only works with relational providers. The fast suite could cover what surrounded the confirmation, but not the transition itself, which is why that delivery's closing note said concurrency and rollback against the real engine were left untested.

The number reservation follows the same idea: an UPDATE on the project counter that adds the batch size and returns the new value in the same statement. The row lock that UPDATE takes serializes reservations within one project without slowing down any other. The unique index on project and number stays as the safety net: if some future path skips the counter, the engine rejects the duplicate instead of storing it.

\`\`\`
confirm ──► BEGIN TRAN
             │
             ├─ UPDATE proposal WHERE status = Pending ── 0 rows ──► ROLLBACK ──► 409
             │     (row lock held until commit)
             ├─ UPDATE project counter + n, OUTPUT new value (reserve n numbers)
             ├─ INSERT n tasks          (unique index: project + number)
             └─ COMMIT ──► notify requester
\`\`\`

In the design I also decided that rejecting a proposal and approving the agent's other actions would use exactly the same conditional transition, in a single repository method. One path for changing state is easier to reason about and to test than three similar variants written at different times.

But a correct design proves nothing by itself, and the closing note was still there. I closed the next deliveries that touched delicate paths differently: on top of the suite, an independent verifier ran a battery of probes against a real SQL Server, with separate connections to simulate two different users.

\`\`\`csharp
var a = Task.Run(() => ConfirmOnNewConnectionAsync(proposalId));
var b = Task.Run(() => ConfirmOnNewConnectionAsync(proposalId));
var codes = await Task.WhenAll(a, b);
Assert.Single(codes, c => c == 200);
Assert.Single(codes, c => c == 409);
Assert.Equal(expectedTasks, await CountTasksAsync(projectId)); // state, not return values
\`\`\`

Each probe fires the operations on separate connections and asserts on the state left in the database: how many requests won, how many lost, how many rows exist afterwards, and whether the numbers are still unique. Not on what a method returned. That distinction is what separates a concurrency test from a test that only has concurrency in its name.

**The impact**

The probes against the real engine found three blockers the InMemory suite, green with several hundred tests, could not see: a locking problem, a race between two operations writing the same row, and a rollback gap. None of the three was a logic error that a better-written unit test would have caught; all three depended on how the engine runs transactions and locks. All three were fixed and re-verified against SQL Server before delivery.

The real engine also changed a product decision. The bulk import of people from a CSV file runs in a single transaction, and with READ_COMMITTED_SNAPSHOT off, a 1,000-row import held locks for more than 15 seconds; meanwhile, requests from other organizations sat waiting. In a multi-tenant system that is about the worst thing that can happen: one customer doing something legitimate stalls another who has nothing to do with it. At 200 rows the wait dropped to between 1 and 2 seconds. I capped the file at 200 rows and left a note to confirm row-versioning isolation in production before deploying. On InMemory that import took the same time with or without other users, because there was nobody to block.

There was a third front, indexes: a reporting index that needed a fix. InMemory was never going to flag that either, because it neither uses indexes to query nor enforces the unique ones.

The rule that ended up in my project notes is short: InMemory does not cover transactions, locks or indexes; the delicate paths get verified on a real SQL Server. I did not replace the fast suite. It is still what runs on every change and what protects the logic. What changed is that I no longer ask it questions it cannot answer.

**Lessons**

**InMemory is not a faster database: it is something else.** It does not implement transactions, locks, isolation or unique indexes the way the engine does. Any test whose assertion depends on one of those four things passes on InMemory while measuring nothing.

**A suite's green is only worth its weakest claim.** About 400 green tests on the logic buy no confidence about concurrency. When you close a delivery, write down what you did not test; that line tells you where the next verification goes.

**Check-then-act is a race, even when it looks fine in review.** A conditional transition, an UPDATE with the source state in its WHERE clause and the affected row count as the answer, turns the race into a decision made by the engine, which does know how to serialize.

**Verify the delicate paths against the real engine, on separate connections.** Double approval, concurrent reservations, rollback halfway through: every path like that deserves a probe that asserts on the final state of the database, not on a method's return value.

**If you keep InMemory, do not silence what it warns you about.** By default, opening a transaction on InMemory throws. The line most people add to move on is exactly the one that makes the lie silent:

\`\`\`csharp
options.UseInMemoryDatabase("unit")
       // Makes every transaction a no-op: green tests, zero atomicity.
       .ConfigureWarnings(w => w.Ignore(InMemoryEventId.TransactionIgnoredWarning));
\`\`\`

Leave the warning at its default. That way, the first test that opens a transaction fails instead of passing, and forces you to decide whether that case belongs in the fast suite or in the one that runs against the real engine.`,
  relatedIds: ['adversarial-review-missed-user-defects', 'authorization-attribute-invisible-to-unit-test'],
}
