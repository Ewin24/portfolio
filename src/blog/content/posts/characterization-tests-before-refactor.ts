import type { BlogPost } from '../../types'

export const characterizationTestsBeforeRefactor: Omit<BlogPost, 'readingTime'> = {
  id: 'characterization-tests-before-refactor',
  slug: 'pruebas-caracterizacion-antes-de-refactorizar',
  title: 'Pruebas de caracterización antes de refactorizar: fijar lo que el código hace, no lo que debería hacer',
  titleEn: 'Characterization Tests Before Refactoring: Pin What the Code Does, Not What It Should Do',
  date: '2026-11-03',
  tags: ['testing', 'refactoring', 'legacy-code', 'dotnet', 'moq'],
  category: 'arquitectura',
  featured: false,
  excerpt:
    'Tres métodos de 167, 161 y 137 líneas en un servicio .NET heredado, y ninguna prueba que los ejecutara. Antes de tocar una línea escribí 16 pruebas de caracterización que fijan el comportamiento actual, incluido el orden de los efectos asíncronos; después corté los métodos a 80, 79 y 34 líneas. Por el camino aprendí que "el archivo aparece en una prueba" no es cobertura, y que un Times.Never sobre un método que el mock no conoce lo cumple el mock, no el código.',
  excerptEn:
    'Three methods of 167, 161 and 137 lines in an inherited .NET service, and not a single test that executed them. Before touching a line I wrote 16 characterization tests pinning current behavior, including the order of async side effects; then I cut the methods down to 80, 79 and 34 lines. Along the way I learned that "the file shows up in a test" is not coverage, and that a Times.Never on a method the mock does not know is satisfied by the mock, not by the code.',
  content: `Heredé un servicio .NET con tres métodos que nadie quería abrir. El primero, el que procesa un trabajo en segundo plano, tenía 167 líneas. El segundo, una estrategia que interpreta la respuesta de un sistema externo, tenía 161. El tercero, una vista previa que arma lo que se enviaría sin enviarlo, tenía 137. Los tres compartían el mismo síntoma: comentarios de sección numerados, del tipo "// 3. Llamar al servicio externo" o "// 8. Cerrar el trabajo", porque el método no cabía en la cabeza de nadie y el autor original había dejado migas de pan para no perderse.

Esos comentarios son la señal más honesta de que un método pide ser partido. Cada comentario numerado es el nombre de un método que todavía no existe. El plan era obvio: extraer cada bloque a un método con nombre, de modo que el método principal se leyera como un índice y los comentarios de sección sobraran.

Lo que no era obvio era cómo hacerlo sin romper nada. Los tres métodos estaban en el camino crítico: decidían cuándo se cierra un trabajo, con qué resultado y en qué orden se persisten las cosas. Un error de extracción no se notaría en compilación; se notaría días después, como un trabajo que quedó abierto o un registro guardado antes de tiempo.

**El enfoque equivocado**

Lo primero que hice fue buscar cobertura existente. Busqué los tres archivos en el proyecto de pruebas y aparecieron. Durante unos minutos creí que había red de seguridad.

No la había. Los resultados eran de dos tipos. Unos eran menciones en comentarios. Los otros eran pruebas que no ejecutaban el código en absoluto: leían el TEXTO fuente del archivo y verificaban que ciertos identificadores no aparecieran en él. Eran guardas legítimas, puestas para impedir que alguien reintrodujera una regla que se había eliminado a propósito, pero no ejercitaban ni una línea del comportamiento.

\`\`\`csharp
[Fact]
public void Dispatcher_has_no_schedule_window()
{
    var source = File.ReadAllText(PathTo("JobDispatcher.cs"));
    Assert.DoesNotContain("ScheduleWindow", source);
    Assert.DoesNotContain("DayOfWeek", source);
}
\`\`\`

Una prueba así pasa aunque el método devuelva basura. Y tiene un efecto secundario que casi nadie anticipa: si al refactorizar renombro una variable local o extraigo un método cuyo nombre contiene una de esas palabras, la prueba se pone roja sin que el comportamiento haya cambiado. Es decir, el único "test" que tocaba esos archivos podía fallar por un refactor correcto y no podía fallar por uno incorrecto. Exactamente al revés de lo que necesitaba.

La tentación en este punto es la de siempre: el código funciona en producción, los métodos son largos pero se entienden con paciencia, extraigo con cuidado y reviso el diff con lupa. Ya conozco el resultado de ese plan. La revisión del diff detecta lo que se ve raro, no lo que cambia de orden. Mover una línea de persistencia dos posiciones más abajo dentro de un método extraído se ve perfectamente normal en un diff.

**La solución**

Antes de tocar una sola línea de producción escribí pruebas de caracterización: pruebas que no afirman lo que el código debería hacer, sino lo que hace hoy. Si el comportamiento actual tiene una rareza, la prueba la fija igual. No es momento de corregir nada; es momento de congelar.

El ciclo de trabajo quedó así:

\`\`\`
 caracterizar (16 pruebas, verdes sobre el código original)
        |
        v
 extraer UN método --> correr la red --> ¿verde? --sí--> siguiente extracción
        ^                                  |
        |                                  no
        +-------- revertir la extracción <-+
\`\`\`

Escribí 16 pruebas repartidas entre los tres métodos. Armarlas tuvo su propio aprendizaje, porque el código no estaba pensado para ser probado.

El primer obstáculo fueron las clases concretas. El método del trabajo en segundo plano usaba un motor de decisión, un constructor de paquetes y un priorizador, todos clases concretas sin métodos virtuales. Moq no puede simular eso. La salida fue mirar hacia abajo: todas esas clases se construían sobre interfaces y un logger, así que las armé reales, con mocks en sus dependencias. Eso además hizo la caracterización más fiel, porque el comportamiento que fijaba incluía la lógica real del motor, no mi suposición sobre ella.

\`\`\`csharp
// Concrete, non-virtual: Moq cannot fake it, so build the real one on mocked ports.
var rules = new Mock<IRuleSource>();
rules.Setup(r => r.GetRuleAsync("retry-limit"))
     .ReturnsAsync(new Rule { Enabled = true, Value = 3 }); // Enabled defaults to false
var engine = new OutcomeEngine(rules.Object, NullLogger<OutcomeEngine>.Instance);
var worker = new JobWorker(_gateway.Object, _store.Object, _jobs.Object, engine);
\`\`\`

Ese comentario sobre el valor por defecto no es decorativo. El motor devolvía null cuando la regla no estaba activa, y el valor por defecto de un booleano en un objeto simulado es false. Un stub sin esa bandera lleva la prueba por un camino que no tiene nada que ver con lo que se quiere fijar. Otro detalle parecido: una lectura de configuración que en el código parecía un método de la interfaz era en realidad un método de extensión. Moq no simula métodos de extensión; hubo que simular el miembro real de la interfaz que la extensión llamaba por dentro.

El segundo obstáculo fue el asíncrono. El método del trabajo en segundo plano no devolvía nada interesante: su comportamiento eran sus efectos. Llama al sistema externo, persiste el intercambio, registra un diagnóstico, cierra el trabajo. Una prueba que verifica que cada efecto ocurrió con Verify no detecta el defecto más probable de una extracción: que dos efectos cambien de orden. Persistir antes de llamar, o cerrar antes de persistir, deja todos los Verify en verde.

Lo que hay que fijar es el ORDEN. La técnica que usé es una lista compartida alimentada por el Callback de cada mock:

\`\`\`csharp
var order = new List<string>();
_gateway.Setup(g => g.SendAsync(It.IsAny<Request>()))
        .Callback(() => order.Add("send")).ReturnsAsync(Accepted());
_store.Setup(s => s.SaveExchangeAsync(It.IsAny<Exchange>()))
      .Callback(() => order.Add("save")).Returns(Task.CompletedTask);
_jobs.Setup(j => j.FinishAsync(It.IsAny<int>(), It.IsAny<Outcome>()))
     .Callback(() => order.Add("finish")).Returns(Task.CompletedTask);
await _worker.ProcessJobAsync(job);
Assert.Equal(new[] { "send", "save", "finish" }, order);
\`\`\`

Una aserción sobre la secuencia completa atrapa exactamente lo que una extracción mal hecha rompe: un await movido de sitio, una rama que ahora se evalúa antes, un return temprano que se comió un paso.

El tercer obstáculo fue el más sutil, y es el que más me interesa contar. Algunas pruebas tenían que afirmar que algo NO ocurre: si el sistema externo responde que hay que esperar una devolución de llamada, el trabajo no se cierra. La forma natural es un Verify con Times.Never sobre el método de cierre.

La tentación es no configurar ese método en el mock, porque, en teoría, no se debe llamar. Con un mock estricto, una llamada no configurada lanza una excepción. Ese método vivía dentro de un try/catch del propio worker, que capturaba cualquier fallo inesperado y seguía su camino de error. Así que, si el código SÍ hubiera intentado cerrar el trabajo, la llamada habría explotado dentro del mock, el catch del worker se la habría tragado, y la prueba habría quedado verde de todos modos. El resultado lo decidía el mock, no el código.

La regla que saqué es simple: toda escritura que la prueba afirma que no ocurre se configura igual que las que sí ocurren, con su Callback a la lista de orden. Así Times.Never significa "el código eligió no llamar", y además la lista de orden lo confirma desde un segundo ángulo. Y la forma de saber que la prueba mide algo es intentar romperla: quitar a mano la condición que evita el cierre debe ponerla roja, nombrando el paso que sobra.

Con la red en verde sobre el código original, empecé a extraer, un método a la vez, corriendo las 16 pruebas después de cada extracción. El método del trabajo en segundo plano terminó leyéndose como un índice:

\`\`\`csharp
public async Task ProcessJobAsync(Job job)
{
    try {
        var reply = await _gateway.SendAsync(BuildRequest(job));
        if (reply.AwaitsCallback) { await SaveAwaitingReplyAsync(job, reply); return; }
        if (reply.IsTechnicalError) { await FailTechnicallyAsync(job, reply); return; }
        NoteOutcome(job, reply);
        await FinishWithOutcomeAsync(job, reply);
    } catch (Exception ex) { await FailUnexpectedlyAsync(job, ex); }
}
\`\`\`

Los comentarios de sección numerados desaparecieron porque los nombres de los métodos dicen lo mismo. No borré los comentarios que explicaban algo del mundo fuera del código; esos no los reemplaza ningún nombre.

**El impacto**

Los tres métodos pasaron de 167, 161 y 137 líneas a 80, 79 y 34. El de 137 fue el que más se redujo porque era casi enteramente composición: resolver una identidad, resolver unas líneas de contacto, armar el payload que se enviaría y calcular la escalación que ocurriría. Cuatro pasos con nombre y un return.

Las 16 pruebas de caracterización quedaron en el repositorio como pruebas normales. Ya no son una red provisional: son la primera cobertura real que esos tres métodos tuvieron, y cubren justo lo que más se rompe al tocarlos, el orden de los efectos y las ramas que terminan antes de tiempo.

Ese es justo el defecto que la lista de orden vigila: un return temprano que, al extraer, queda dentro del método nuevo en vez de en el llamador, de modo que el flujo sigue de largo al siguiente paso. En el diff se ve bien; en la secuencia aparece un paso de más.

Las guardas que leían el texto fuente siguieron verdes, pero ahora sé lo que son: una protección contra la reintroducción de una regla, no cobertura. Las dejé intactas y elegí los nombres de los métodos extraídos sin chocar con sus palabras prohibidas.

**Lecciones**

**"El archivo aparece en una prueba" no es cobertura.** Buscar el nombre de un archivo en el proyecto de pruebas encuentra comentarios, guardas sobre el texto fuente y pruebas que lo mencionan sin ejecutarlo. Antes de refactorizar, la pregunta no es si el archivo aparece, sino qué prueba se pone roja si cambio el comportamiento de este método. Si no hay respuesta, no hay red.

**Una prueba que lee el código fuente como texto puede fallar por un refactor correcto y no por uno incorrecto.** Tiene su lugar como guarda contra la reintroducción de algo eliminado a propósito, pero hay que saber que está ahí antes de renombrar nada.

**Para caracterizar código asíncrono, fija el orden de los efectos, no solo que ocurran.** Una lista alimentada por el Callback de cada mock y una aserción sobre la secuencia completa atrapan los defectos típicos de una extracción: un await movido, una rama reordenada, un return que cambió de método.

**Times.Never solo significa algo si el método está configurado.** Sin configuración, un mock estricto lanza dentro del código bajo prueba, y si ese código captura excepciones, la prueba queda verde por un camino que nadie eligió. Configura las escrituras prohibidas igual que las esperadas, y comprueba que la prueba puede fallar quitando a mano la condición que protege.

**Los valores por defecto de un objeto simulado son decisiones, no neutralidad.** Un booleano que por defecto es false puede apagar un motor entero y llevar la prueba por un camino que no tiene nada que ver con lo que se quiere fijar. Cada stub que alimenta una decisión necesita sus banderas explícitas.

**Cuando no puedes simular una clase concreta, constrúyela real sobre sus puertos simulados.** La caracterización queda más fiel, porque fija el comportamiento real del colaborador y no tu idea de él.`,
  contentEn: `I inherited a .NET service with three methods nobody wanted to open. The first, which processes a background job, ran 167 lines. The second, a strategy that interprets the response of an external system, ran 161. The third, a preview that assembles what would be sent without sending it, ran 137. All three shared the same symptom: numbered section comments like "// 3. Call the external service" or "// 8. Close the job", because the method did not fit in anyone's head and the original author had left breadcrumbs so as not to get lost.

Those comments are the most honest sign that a method wants to be split. Every numbered comment is the name of a method that does not exist yet. The plan was obvious: pull each block into a named method, so the main method reads like a table of contents and the section comments become redundant.

What was not obvious was how to do it without breaking anything. All three methods sat on the critical path: they decided when a job closes, with which outcome, and in which order things get persisted. An extraction mistake would not show up at compile time; it would show up days later, as a job left open or a record saved too early.

**The wrong approach**

The first thing I did was look for existing coverage. I searched the test project for the three files and they showed up. For a few minutes I believed I had a safety net.

I did not. The hits came in two kinds. Some were mentions in comments. The others were tests that did not execute the code at all: they read the file's source TEXT and checked that certain identifiers did not appear in it. They were legitimate guards, put there to stop anyone from reintroducing a rule that had been removed on purpose, but they did not exercise a single line of behavior.

\`\`\`csharp
[Fact]
public void Dispatcher_has_no_schedule_window()
{
    var source = File.ReadAllText(PathTo("JobDispatcher.cs"));
    Assert.DoesNotContain("ScheduleWindow", source);
    Assert.DoesNotContain("DayOfWeek", source);
}
\`\`\`

A test like that passes even if the method returns garbage. And it has a side effect almost nobody anticipates: if, while refactoring, I rename a local or extract a method whose name contains one of those words, the test turns red without any behavior having changed. In other words, the only "test" touching those files could fail on a correct refactor and could not fail on an incorrect one. The exact opposite of what I needed.

The temptation at this point is the usual one: the code works in production, the methods are long but understandable with patience, I extract carefully and review the diff closely. I already know how that plan ends. A diff review catches what looks odd, not what moves out of order. Moving a persistence line two positions down inside an extracted method looks perfectly normal in a diff.

**The solution**

Before touching a single production line I wrote characterization tests: tests that do not assert what the code should do, but what it does today. If current behavior has a quirk, the test pins the quirk too. This is not the moment to fix anything; it is the moment to freeze.

The working loop looked like this:

\`\`\`
 characterize (16 tests, green on the original code)
        |
        v
 extract ONE method --> run the net --> green? --yes--> next extraction
        ^                                  |
        |                                  no
        +-------- revert the extraction <--+
\`\`\`

I wrote 16 tests spread across the three methods. Building them was its own lesson, because the code had not been designed to be tested.

The first obstacle was concrete classes. The background job method used a decision engine, a package builder and a prioritizer, all concrete classes with no virtual methods. Moq cannot fake that. The way out was to look one level down: every one of those classes was built on interfaces plus a logger, so I constructed them for real, with mocks under their dependencies. That also made the characterization more faithful, because the behavior I pinned included the engine's real logic, not my assumption about it.

\`\`\`csharp
// Concrete, non-virtual: Moq cannot fake it, so build the real one on mocked ports.
var rules = new Mock<IRuleSource>();
rules.Setup(r => r.GetRuleAsync("retry-limit"))
     .ReturnsAsync(new Rule { Enabled = true, Value = 3 }); // Enabled defaults to false
var engine = new OutcomeEngine(rules.Object, NullLogger<OutcomeEngine>.Instance);
var worker = new JobWorker(_gateway.Object, _store.Object, _jobs.Object, engine);
\`\`\`

That comment about the default value is not decoration. The engine returned null whenever the rule was not enabled, and a boolean on a stubbed object defaults to false. A stub without that flag sends the test down a path that has nothing to do with what you want to pin. A similar detail: a configuration read that looked like an interface method in the code was actually an extension method. Moq does not fake extension methods; I had to fake the real interface member the extension called internally.

The second obstacle was async. The background job method returned nothing interesting: its behavior was its side effects. It calls the external system, persists the exchange, records a diagnosis, closes the job. A test that checks each effect happened with Verify misses the most likely extraction defect: two effects swapping places. Persisting before calling, or closing before persisting, leaves every Verify green.

What you have to pin is the ORDER. The technique I used is a shared list fed by each mock's Callback:

\`\`\`csharp
var order = new List<string>();
_gateway.Setup(g => g.SendAsync(It.IsAny<Request>()))
        .Callback(() => order.Add("send")).ReturnsAsync(Accepted());
_store.Setup(s => s.SaveExchangeAsync(It.IsAny<Exchange>()))
      .Callback(() => order.Add("save")).Returns(Task.CompletedTask);
_jobs.Setup(j => j.FinishAsync(It.IsAny<int>(), It.IsAny<Outcome>()))
     .Callback(() => order.Add("finish")).Returns(Task.CompletedTask);
await _worker.ProcessJobAsync(job);
Assert.Equal(new[] { "send", "save", "finish" }, order);
\`\`\`

One assertion over the whole sequence catches exactly what a botched extraction breaks: an await moved out of place, a branch now evaluated earlier, an early return that swallowed a step.

The third obstacle was the subtlest, and it is the one I most want to tell. Some tests had to assert that something does NOT happen: if the external system replies that we must wait for a callback, the job is not closed. The natural shape is a Verify with Times.Never on the close method.

The temptation is to leave that method unconfigured on the mock because, in theory, it should not be called. On a strict mock, an unconfigured call throws. That method lived inside a try/catch in the worker itself, which caught any unexpected failure and went down its error path. So if the code HAD tried to close the job, the call would have blown up inside the mock, the worker's catch would have swallowed it, and the test would have stayed green anyway. The mock decided the outcome, not the code.

The rule I took away is simple: every write the test claims does not happen gets configured exactly like the ones that do, with its Callback into the order list. That way Times.Never means "the code chose not to call it", and the order list confirms it from a second angle. And the way to know the test measures anything is to try to break it: removing the condition that prevents the close by hand must turn it red, naming the extra step.

With the net green on the original code, I started extracting, one method at a time, running all 16 tests after each extraction. The background job method ended up reading like a table of contents:

\`\`\`csharp
public async Task ProcessJobAsync(Job job)
{
    try {
        var reply = await _gateway.SendAsync(BuildRequest(job));
        if (reply.AwaitsCallback) { await SaveAwaitingReplyAsync(job, reply); return; }
        if (reply.IsTechnicalError) { await FailTechnicallyAsync(job, reply); return; }
        NoteOutcome(job, reply);
        await FinishWithOutcomeAsync(job, reply);
    } catch (Exception ex) { await FailUnexpectedlyAsync(job, ex); }
}
\`\`\`

The numbered section comments went away because the method names say the same thing. I kept the comments that explained something about the world outside the code; no method name replaces those.

**The impact**

The three methods went from 167, 161 and 137 lines to 80, 79 and 34. The 137-line one shrank the most because it was almost entirely composition: resolve an identity, resolve some contact lines, assemble the payload that would be sent and compute the escalation that would happen. Four named steps and a return.

The 16 characterization tests stayed in the repository as ordinary tests. They are no longer a temporary net: they are the first real coverage those three methods ever had, and they cover exactly what breaks most when you touch them, the order of effects and the branches that end early.

That is exactly the defect the order list watches for: an early return that, during extraction, ends up inside the new method instead of in the caller, so the flow falls through to the next step. In the diff it looks fine; in the sequence an extra step shows up.

The guards that read source text stayed green, but now I know what they are: protection against reintroducing a rule, not coverage. I left them untouched and chose the extracted method names so they would not collide with their forbidden words.

**Lessons**

**"The file shows up in a test" is not coverage.** Searching the test project for a file name finds comments, guards over source text, and tests that mention it without running it. Before refactoring, the question is not whether the file shows up, but which test turns red if I change this method's behavior. If there is no answer, there is no net.

**A test that reads source code as text can fail on a correct refactor and not on an incorrect one.** It has its place as a guard against reintroducing something removed on purpose, but you need to know it is there before you rename anything.

**To characterize async code, pin the order of the effects, not just that they happen.** A list fed by each mock's Callback and one assertion over the full sequence catch the typical extraction defects: a moved await, a reordered branch, a return that changed methods.

**Times.Never only means something if the method is configured.** Without a setup, a strict mock throws inside the code under test, and if that code catches exceptions, the test stays green down a path nobody chose. Configure forbidden writes exactly like expected ones, and prove the test can fail by removing the guarding condition by hand.

**A stubbed object's defaults are decisions, not neutrality.** A boolean that defaults to false can switch off a whole engine and send the test down a path unrelated to what you meant to pin. Every stub that feeds a decision needs its flags set explicitly.

**When you cannot fake a concrete class, build the real one on its faked ports.** The characterization ends up more faithful, because it pins the collaborator's actual behavior rather than your idea of it.`,
  relatedIds: ['strict-tdd-committed-playwright-driver', 'authorization-attribute-invisible-to-unit-test'],
}
