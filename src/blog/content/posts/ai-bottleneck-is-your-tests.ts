import type { BlogPost } from '../../types'

export const aiBottleneckIsYourTests: Omit<BlogPost, 'readingTime'> = {
  id: 'ai-bottleneck-is-your-tests',
  slug: 'con-ai-el-cuello-de-botella-son-tus-pruebas',
  title: 'Con AI, el cuello de botella son tus pruebas, no tu código',
  titleEn: 'AI Made Code Cheap. Your Tests Are Now the Bottleneck',
  date: '2026-11-17',
  tags: ['AI', 'testing', 'verificación', 'liderazgo'],
  category: 'ensayo',
  featured: false,
  excerpt:
    'Cuando escribir código se abarata, lo escaso es poder creerle a lo que lo verifica. Una suite que corre sobre sustitutos de la realidad aprueba lo que no entiende, y cada línea que escribe un asistente amplifica ese error. Tres casos propios, las cifras del informe DORA 2024 y cuatro reglas para saber contra qué corren tus pruebas.',
  excerptEn:
    'When writing code gets cheap, the scarce thing is being able to trust what verifies it. A suite that runs against stand-ins for reality approves what it does not understand, and every line an assistant writes amplifies that error. Three cases of my own, the DORA 2024 figures, and four rules for knowing what your tests actually ran against.',
  content: `Escribir código dejó de ser la parte lenta. Lo que ahora limita cuánto puedes entregar es cuánto puedes creerle a lo que verifica ese código. Y si esa verificación afirma más de lo que mide, cada línea que un asistente escribe por ti amplifica el error en lugar de diluirlo.

Esa es la tesis. Tiene una versión conocida, que comparto, y una más específica, que es la que quiero defender: el problema no es que falten pruebas. Es que muchas de las que ya tienes corren contra un sustituto de la realidad, y ese sustituto responde que sí a preguntas que nunca entendió.

**La idea común**

La idea común dice que, con AI, verificar es el nuevo cuello de botella. Generar es barato, leer es caro, así que el trabajo se desplaza de escribir a revisar. No es una idea mía ni es nueva.

Los datos que pude leer apuntan en esa dirección. El [resumen que Google Cloud publicó del informe DORA 2024](https://cloud.google.com/blog/products/devops-sre/announcing-the-2024-dora-report) reporta que más del 75 % de los encuestados dependía de AI para al menos una responsabilidad profesional diaria, y que más de un tercio percibía aumentos de productividad entre moderados y extremos. El mismo resumen asocia un aumento del 25 % en la adopción de AI con mejoras de 7.5 % en la calidad de la documentación, 3.4 % en la calidad del código y 3.1 % en la velocidad de revisión de código. Hasta ahí, todo sube.

Lo que baja es la entrega. Al aumentar la adopción, el informe estima una caída de 1.5 % en el rendimiento de entrega y de 7.2 % en su estabilidad. Y el 39 % de los encuestados declaró poca o ninguna confianza en el código generado por AI.

![Barras a los dos lados de un eje cero. Suben la calidad de la documentación (+7.5 %), la calidad del código (+3.4 %) y la velocidad de revisión de código (+3.1 %). Bajan el rendimiento de entrega (-1.5 %) y la estabilidad de entrega (-7.2 %).](figure/ai-bottleneck-dora-2024 "Fuente: resumen de Google Cloud del informe DORA 2024. Las tres mejoras se asocian a un aumento del 25 % en la adopción de AI; las dos caídas son las estimaciones que el resumen reporta al aumentar la adopción.")

La lectura que hace el propio equipo de DORA es prudente: mejorar el proceso de desarrollo no mejora automáticamente la entrega si no se respeta lo básico, y nombra dos cosas, lotes pequeños y mecanismos de prueba robustos. La [página del informe en dora.dev](https://dora.dev/research/2024/dora-report/) repite las mismas dos.

**Por qué se queda corta**

Dicho así, "verificar es el cuello de botella" suena a problema de capacidad: faltan horas de revisión, faltan pruebas, hay que producir más de las dos. La respuesta natural es pedirle al mismo asistente que escriba también las pruebas. Ahí la idea común deja de ayudar, porque no distingue entre una prueba que mide y una prueba que solo pasa.

Tengo un caso propio para esa diferencia. En DevManager, un SaaS multi-tenant que sigo desarrollando, cerré un módulo con unas 400 pruebas en verde sobre el proveedor InMemory de EF Core. La pieza delicada era la confirmación de una propuesta: una sola transacción, y si dos aprobaciones llegan juntas, una gana y la otra recibe un 409. Las pruebas pasaban. Pero InMemory no implementa transacciones, bloqueos ni índices únicos como lo hace SQL Server, así que las tres garantías que el diseño prometía, atomicidad, exclusión mutua y unicidad, no se ejercitaban en ninguna prueba. Cuando un verificador independiente corrió sondas contra un SQL Server real, con conexiones separadas, encontró tres bloqueadores que la suite no podía ver: un problema de bloqueos, una carrera entre dos operaciones que escribían la misma fila y un hueco en el rollback. El detalle técnico está en [Las pruebas InMemory mienten sobre las transacciones](#blog/article/pruebas-inmemory-mienten-sobre-transacciones).

Lo que me importa de ese caso no es EF Core. Es la forma del fallo. La suite no mentía sobre la lógica de negocio: la validaba bien. Mentía por omisión sobre todo lo que dependía del motor, y lo hacía con el mismo color verde que usaba para lo demás. Nada en el reporte separaba lo que se midió de lo que pasó porque el sustituto no sabe fallar.

No es un caso aislado en mi trabajo. En otro proyecto escribí la prueba obvia para un atributo de autorización: instanciar el controlador, llamar al método, revisar el resultado. Pasó a la primera y no probaba nada, porque ese atributo solo lo evalúa el middleware y una llamada directa al método nunca lo atraviesa. Y en ReaderSS llegué a 426 pruebas, cerca del 95 % de cobertura y once rondas de revisión adversarial, para luego encontrar, en cinco minutos de usar la aplicación, dos defectos que la volvían inservible. El hallazgo más caro de ese proyecto fue que los fixtures de prueba omitían una cabecera que el servicio real escribe en sus respuestas: con esa omisión, toda una clase de fallo era imposible de probar.

Tres proyectos y el mismo patrón: un doble, un atajo o un fixture que se parece a la realidad lo suficiente para que el código corra, y no lo suficiente para que el código falle.

**El modelo**

Propongo pensar en dos curvas. Una es el código que se escribe. La otra es el código cuyo comportamiento alguien comprobó contra algo capaz de decir que no. Mientras escribir es caro, las dos crecen despacio y más o menos juntas, porque la lentitud misma limita cuánto puedes producir sin mirar. Cuando escribir se abarata, la primera se dispara. La segunda no, porque depende de arneses, entornos y tiempo de ejecución contra sistemas reales, y nada de eso se abarata por el hecho de que el código salga más rápido.

![Dos líneas a lo largo del tiempo. Crecen juntas hasta una marca rotulada AI; después el código escrito sube con fuerza y el código verificado mantiene su pendiente. El área entre las dos está rotulada sin verificar.](figure/ai-bottleneck-gap "Esquema conceptual, no datos medidos. La brecha entre lo escrito y lo verificado siempre existió; lo que cambia es su tamaño.")

La brecha entre las dos es código que existe, compila, pasa revisión y nadie comprobó. Siempre hubo brecha. Lo nuevo es su tamaño, y que el tablero no la muestra: una suite sobre sustitutos pinta de verde las dos curvas por igual.

Ese es el mecanismo de amplificación. Un doble que no sabe fallar cuesta poco cuando escribes poco: cubre mal unos cuantos caminos delicados y tarde o temprano alguien los ejercita a mano. Cuando el volumen se multiplica, el mismo doble aprueba muchos más caminos delicados en el mismo tiempo, cada uno con su prueba verde generada junto con el código. Y quien genera esa prueba, persona o asistente, tiene como única señal observable que pase. Si el entorno acepta una transacción que no es una transacción, la prueba la acepta también, y queda tan prolija que invita a no mirarla.

> Una suite sobre sustitutos no se queda corta de forma visible. Aprueba, y aprueba más cuanto más código le das.

Hay una segunda consecuencia: la revisión humana tampoco cierra la brecha. Una transacción que se abre y se confirma se lee como atómica. Un índice único declarado en el modelo se lee como garantizado. El código de mi caso pasaba revisión por la misma razón por la que pasaba las pruebas: se veía correcto. Leer más rápido o leer más veces no cambia eso, porque el defecto no está en el texto sino en lo que el motor hace con él.

**Cómo aplicarlo**

Lo que saqué de esos casos cabe en cuatro reglas. Ninguna depende de una herramienta.

**1. Lista tus sustitutos y lo que cada uno no puede afirmar**

Base de datos en memoria, cliente HTTP simulado, reloj falso, fixture escrito a mano. Para cada uno, una línea con lo que no implementa. La mía para InMemory quedó así: no cubre transacciones, bloqueos ni índices; lo delicado se verifica en SQL Server real.

**2. Al cerrar una entrega, escribe qué no probaste**

En DevManager, la nota de cierre del módulo decía que la concurrencia y el rollback contra el motor real seguían sin probar. Esa frase fue la que señaló dónde poner la siguiente verificación. Cuando el volumen de código crece, esa nota importa más, porque es el único lugar donde la brecha queda por escrito.

**3. No silencies al sustituto cuando avisa**

Por defecto, abrir una transacción sobre InMemory lanza una excepción. La línea de configuración que se suele agregar para que la suite siga corriendo es exactamente la que vuelve silencioso el problema. Una instrucción como "haz que las pruebas pasen" se cumple con esa línea igual de bien que con un arreglo real. Por eso, cualquier cambio que apague una advertencia del entorno de pruebas merece que una persona lo lea y decida.

**4. Prueba la prueba**

Para el atributo de autorización, la prueba honesta necesitó un servidor de pruebas real y una mutación deliberada del atributo, para demostrar que medía lo que decía medir. Es una comprobación barata: altera lo que la prueba dice proteger y mira si se pone roja. Si sigue verde, no mide nada, y es mejor saberlo antes de apoyar en ella cien cambios más.

Nada de esto implica tirar la suite rápida. La mía sigue corriendo en cada cambio; lo que cambió es que ya no le pido que responda preguntas que no puede responder.

Para quien dirige un equipo, la traducción es de presupuesto. Si lo que inviertes en generar código sube y lo que inviertes en entornos de prueba reales se queda igual, estás comprando la primera curva y financiando la brecha. La pregunta útil al revisar una entrega deja de ser cuántas pruebas hay y pasa a ser contra qué corrieron.

**Dónde puedo estar equivocado**

Primero, los datos. DORA reporta asociaciones a partir de una encuesta, no causas, y el resumen que leí no dice que los dobles de prueba expliquen la caída de estabilidad. Esa conexión es una hipótesis mía, apoyada en tres casos propios y no en una medición del sector. El propio informe nombra los lotes pequeños junto a las pruebas robustas; es posible que el tamaño de los cambios pese más que la calidad de la verificación, y mis casos no permiten separar una cosa de la otra. Además son cifras de 2024; no verifiqué ediciones posteriores.

Segundo, el costo. Verificar contra el sistema real es más lento y más frágil. Para una buena parte del código, lógica pura, validaciones, cálculos, un sustituto es la decisión correcta y pedir más es desperdicio. Mi argumento se aplica a lo que depende de un sistema externo con semántica propia: transacciones, bloqueos, autorización, layout, red. Si tu producto casi no tiene de eso, tu cuello de botella probablemente esté en otra parte.

Tercero, la premisa. Puede que verificar también se abarate. Si los asistentes llegan a levantar entornos reales y a escribir sondas contra ellos con la misma facilidad con la que escriben código, la segunda curva también sube y la brecha se cierra sola. No tengo datos sobre cuánto falta para eso.

Y cuarto: la idea de fondo es común, y no pretendo lo contrario. Lo único que añado es dónde mirar primero. Antes de pedir más revisión o más pruebas, revisa contra qué corren las que ya tienes.`,
  contentEn: `Writing code is no longer the slow part. What now limits how much you can ship is how much you can believe the thing that checks that code. And if that check claims more than it measures, every line an assistant writes for you amplifies the error instead of diluting it.

That is the claim. It has a well-known version, which I agree with, and a narrower one, which is the one I want to defend: the problem is not a shortage of tests. It is that many of the tests you already have run against a stand-in for reality, and that stand-in says yes to questions it never understood.

**The common view**

The common view says that with AI, verification is the new bottleneck. Generating is cheap, reading is expensive, so the work moves from writing to reviewing. The idea is neither mine nor new.

The data I was able to read points the same way. [Google Cloud's summary of the 2024 DORA report](https://cloud.google.com/blog/products/devops-sre/announcing-the-2024-dora-report) says more than 75 percent of respondents relied on AI for at least one daily professional responsibility, and more than one-third reported moderate to extreme productivity increases. The same summary associates a 25% increase in AI adoption with a 7.5% increase in documentation quality, a 3.4% increase in code quality, and a 3.1% increase in code review speed. So far, everything goes up.

What goes down is delivery. As AI adoption increased, the report estimates a 1.5% decrease in delivery throughput and a 7.2% reduction in delivery stability. And 39% of respondents reported little to no trust in AI-generated code.

![Bars on both sides of a zero axis. Documentation quality (+7.5 %), code quality (+3.4 %) and code review speed (+3.1 %) go up. Delivery throughput (-1.5 %) and delivery stability (-7.2 %) go down.](figure/ai-bottleneck-dora-2024 "Source: Google Cloud's summary of the 2024 DORA report. The three improvements are associated with a 25% increase in AI adoption; the two declines are the estimates the summary reports as adoption increased.")

The DORA team's own reading is careful: improving the development process does not automatically improve software delivery without the basics, and it names two of them, small batch sizes and robust testing mechanisms. The [report page on dora.dev](https://dora.dev/research/2024/dora-report/) repeats the same two.

**Why it falls short**

Put that way, "verification is the bottleneck" sounds like a capacity problem: not enough review hours, not enough tests, produce more of both. The natural answer is to ask the same assistant to write the tests too. That is where the common view stops helping, because it does not tell a test that measures apart from a test that merely passes.

I have a case of my own for that difference. In DevManager, a multi-tenant SaaS I keep building, I closed a module with about 400 green tests on the EF Core InMemory provider. The delicate piece was confirming a proposal: a single transaction, and if two approvals arrive together, one wins and the other gets a 409. The tests passed. But InMemory does not implement transactions, locks, or unique indexes the way SQL Server does, so the three guarantees the design promised, atomicity, mutual exclusion and uniqueness, were exercised by no test at all. When an independent verifier ran probes against a real SQL Server, on separate connections, it found three blockers the suite could not see: a locking problem, a race between two operations writing the same row, and a rollback gap. The technical detail is in [InMemory Tests Lie About Transactions](#blog/article/pruebas-inmemory-mienten-sobre-transacciones).

What matters to me in that case is not EF Core. It is the shape of the failure. The suite did not lie about business logic: it validated that well. It lied by omission about everything that depended on the engine, and it did so in the same shade of green it used for everything else. Nothing in the report separated what was measured from what passed because the stand-in does not know how to fail.

It is not a one-off in my work. On another project I wrote the obvious test for an authorization attribute: instantiate the controller, call the method, check the result. It passed on the first run and proved nothing, because that attribute is only ever evaluated by the middleware, and a direct method call never goes through it. And on ReaderSS I got to 426 tests, about 95% coverage and eleven rounds of adversarial review, and then found, in five minutes of using the app, two defects that made it unusable. The most expensive finding on that project was that the test fixtures left out a header the real service writes on its responses: with that omission, a whole class of failure was impossible to test.

Three projects, one pattern: a double, a shortcut or a fixture that resembles reality closely enough for the code to run, and not closely enough for the code to fail.

**The model**

Think of two curves. One is the code that gets written. The other is the code whose behavior someone checked against something able to say no. While writing is expensive, both grow slowly and roughly together, because slowness itself caps how much you can produce without looking. When writing gets cheap, the first curve takes off. The second does not, because it depends on harnesses, environments and run time against real systems, and none of that gets cheaper just because code comes out faster.

![Two lines over time. They grow together up to a marker labeled AI; after it, code written climbs steeply while code verified keeps its slope. The area between them is labeled unverified.](figure/ai-bottleneck-gap "Conceptual sketch, not measured data. The gap between written and verified was always there; what changes is its size.")

The gap between them is code that exists, compiles, passes review, and that nobody checked. There was always a gap. What is new is its size, and the fact that the dashboard does not show it: a suite built on stand-ins paints both curves the same green.

That is the amplification mechanism. A double that cannot fail costs little when you write little: it covers a handful of delicate paths badly, and sooner or later someone exercises them by hand. When volume multiplies, the same double approves many more delicate paths in the same time, each with its own green test generated alongside the code. And whoever generates that test, person or assistant, has one observable signal: that it passes. If the environment accepts a transaction that is not a transaction, the test accepts it too, and it comes out tidy enough to discourage a second look.

> A suite built on stand-ins does not fall short in any visible way. It approves, and it approves more the more code you feed it.

There is a second consequence: human review does not close the gap either. A transaction that is opened and committed reads as atomic. A unique index declared in the model reads as guaranteed. The code in my case passed review for the same reason it passed the tests: it looked right. Reading faster or reading more times does not change that, because the defect is not in the text but in what the engine does with it.

**How to apply it**

What I took from those cases fits in four rules. None of them depends on a tool.

**1. List your stand-ins and what each one cannot claim**

In-memory database, mocked HTTP client, fake clock, hand-written fixture. For each one, a line with what it does not implement. Mine for InMemory came out like this: it does not cover transactions, locks or indexes; the delicate paths get verified on a real SQL Server.

**2. When you close a delivery, write down what you did not test**

In DevManager, the module's closing note said that concurrency and rollback against the real engine were still untested. That sentence is what pointed to where the next verification had to go. As code volume grows, the note matters more, because it is the only place where the gap exists in writing.

**3. Do not silence the stand-in when it warns you**

By default, opening a transaction on InMemory throws. The configuration line people usually add to keep the suite running is exactly the one that makes the problem silent. An instruction like "make the tests pass" is satisfied by that line just as well as by a real fix. So any change that switches off a warning from the test environment deserves a person reading it and deciding.

**4. Test the test**

For the authorization attribute, the honest test needed a real test server and a deliberate mutation of the attribute, to prove it measured what it claimed to measure. It is a cheap check: alter the thing the test says it protects and see whether it goes red. If it stays green, it measures nothing, and it is better to learn that before leaning a hundred more changes on it.

None of this means throwing away the fast suite. Mine still runs on every change; what changed is that I no longer ask it questions it cannot answer.

For anyone running a team, this translates into budget. If what you spend on generating code goes up and what you spend on real test environments stays flat, you are buying the first curve and funding the gap. The useful question in a delivery review stops being how many tests there are and becomes what they ran against.

**Where I could be wrong**

First, the data. DORA reports associations from a survey, not causes, and the summary I read does not say test doubles explain the drop in stability. That link is my hypothesis, backed by three cases of my own and not by an industry measurement. The report itself names small batches next to robust testing; batch size may well weigh more than verification quality, and my cases cannot separate the two. These are also 2024 figures; I did not check later editions.

Second, the cost. Verifying against the real system is slower and more brittle. For a large share of code, pure logic, validations, calculations, a stand-in is the right call and asking for more is waste. My argument applies to whatever depends on an external system with semantics of its own: transactions, locks, authorization, layout, network. If your product has very little of that, your bottleneck is probably somewhere else.

Third, the premise. Verification may get cheap too. If assistants become able to stand up real environments and write probes against them as easily as they write code, the second curve rises as well and the gap closes without any help from me. I have no data on how far away that is.

And fourth: the underlying idea is common, and I am not pretending otherwise. All I add is where to look first. Before asking for more review or more tests, check what the ones you already have are running against.`,
  relatedIds: [
    'inmemory-tests-lie-about-transactions',
    'adversarial-review-missed-user-defects',
    'authorization-attribute-invisible-to-unit-test',
  ],
}
