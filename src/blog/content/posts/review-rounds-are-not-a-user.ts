import type { BlogPost } from '../../types'

export const reviewRoundsAreNotAUser: Omit<BlogPost, 'readingTime'> = {
  id: 'review-rounds-are-not-a-user',
  slug: 'once-rondas-de-revision-no-son-un-usuario',
  title: 'Once rondas de revisión con AI no reemplazan diez minutos de un usuario',
  titleEn: 'Eleven Rounds of AI Review Do Not Replace Ten Minutes of Real Use',
  date: '2026-11-17',
  tags: ['AI', 'revisión de código', 'verificación', 'testing', 'liderazgo'],
  category: 'ensayo',
  featured: false,
  excerpt:
    'Otra ronda de revisión del mismo tipo encuentra cada vez menos, y hay defectos que no encuentra nunca, porque todos los revisores leen el mismo material con los mismos medios. En un proyecto propio, 44 pasadas de revisión adversarial aplicaron 47 hallazgos y no vieron los dos defectos que aparecieron en cinco minutos de uso. Más revisión no es otra mirada: antes de pagar una ronda, pregunta qué tiene de distinto quien la hace.',
  excerptEn:
    'One more review round of the same kind finds less each time, and some defects it never finds, because every reviewer reads the same material with the same means. On a project of my own, 44 adversarial review passes applied 47 findings and missed the two defects that showed up in five minutes of use. More review is not a different view: before paying for a round, ask what is different about whoever runs it.',
  content: `Otra ronda de revisión del mismo tipo compra cada vez menos, y hay defectos que no compra nunca. Lo que los encuentra es un observador distinto: alguien, o algo, que mira otro material, con otros medios y con otra intención. Más revisión y otra mirada son cosas diferentes, y es fácil montar un proceso que trate la segunda como si viniera incluida en la primera.

Con agentes de AI esa confusión se vuelve barata. Una ronda de revisión dejó de costar la tarde de un colega: cuesta unos minutos. Entonces se apilan, y el número de rondas empieza a leerse como una medida de calidad.

**Lo que se suele pensar**

La idea habitual es sensata. Cada ronda encuentra algo, así que más rondas encuentran más. Si además cada una ataca el cambio desde un ángulo distinto, seguridad, resiliencia, legibilidad, confiabilidad, el conjunto debería cubrir casi todo. Y si un revisor adversarial intenta refutar los hallazgos de los demás, mejor todavía, porque se filtran los falsos positivos.

No discuto la primera mitad de esa idea, porque es cierta: las rondas encuentran cosas. Discuto el paso siguiente, el que casi nunca se dice en voz alta: que una pila alta de rondas sea evidencia de que el producto funciona.

**Por qué falla**

Tengo un caso propio, contado con su detalle técnico en [el artículo sobre ReaderSS](#blog/article/revision-adversarial-no-encontro-lo-que-el-usuario-si). ReaderSS es un lector de RSS que construí con agentes de AI. Al cerrarlo tenía 426 pruebas, cerca del 95 % de cobertura contra una puerta exigida del 70 %, y once rondas de revisión adversarial de cuatro lentes, es decir, 44 pasadas de revisión, más dos refutaciones formales. De ahí salieron 47 hallazgos aplicados, entre ellos un bloqueante y cuatro críticos.

Después abrí la aplicación en un navegador por primera vez. En menos de cinco minutos encontré dos defectos que la volvían inservible. No se podía agregar ningún feed, porque el comando de desarrollo no levantaba el servicio que los descarga, y la aplicación le echaba la culpa a la dirección que el usuario acababa de escribir. Y al hacer clic en una entrada no pasaba nada visible, porque el panel de lectura se dibujaba fuera de la pantalla. Ninguna de las 44 pasadas había encontrado ninguno de los dos.

Lo que importa es por qué. No faltó cuidado y no faltaron rondas. Las once tenían tres cosas en común. Leían el mismo material, que era el texto del código. Trabajaban en el mismo entorno, donde no había un navegador ni dos procesos corriendo a la vez. Y respondían la misma pregunta: si el código hace lo que dice hacer. Los dos defectos vivían fuera de esas tres cosas. Uno estaba en si dos procesos se hablan al arrancar. El otro, en lo que un motor de layout hace con una hoja de estilos. Ningún lector de código, por atento que sea, ejecuta un motor de layout de memoria.

Hay un detalle que lo muestra mejor que cualquier argumento. La hoja de estilos llevaba un comentario honesto: decía que ninguna prueba automatizada ejercitaba ese diseño y que quedaba sin verificar salvo por revisión manual. Once rondas leyeron ese comentario. Ninguna pudo hacer lo que pedía, porque en el entorno de los agentes no había con qué abrir un navegador, y la revisión manual se fue aplazando hasta que dejó de estar en la lista.

> Las cuatro lentes cambiaban la pregunta que se le hacía al código. Ninguna cambiaba lo que el revisor podía ver.

Esta forma no es exclusiva de los modelos. Jakob Nielsen la describió para las pruebas de usabilidad: con un solo usuario se aprende mucho, el segundo repite parte de lo que hizo el primero, y [en su artículo de 2000](https://www.nngroup.com/articles/why-you-only-need-to-test-with-5-users/) lo resume así: "As you add more and more users, you learn less and less". Su fórmula parte de que un usuario encuentra, en promedio, el 31 % de los problemas, y de que lo que encuentran varios se solapa. Me interesa sobre todo la excepción que él mismo anota: hacen falta más usuarios cuando un sitio tiene "several highly distinct groups of users". Los observadores parecidos se saturan rápido. Lo que justifica sumar otro es que sea distinto.

Tampoco es exclusiva de la revisión hecha por AI. Jacek Czerwonka y Michaela Greiler, en el resumen de [un artículo de 2015 publicado por Microsoft Research](https://www.microsoft.com/en-us/research/publication/code-reviews-do-not-find-bugs-how-the-current-code-review-best-practice-slows-us-down/), sostienen que "code reviews often do not find functionality issues that should block a code submission". Hablan de revisores humanos leyendo código, y describen el mismo límite.

Lo que la AI cambia es el precio, y con el precio, la tentación. Cuando una ronda costaba la tarde de una persona, nadie hacía once. Ahora se pueden hacer once sin que nadie pregunte qué ve la undécima que no haya visto la décima. Y el informe de cierre trae un número grande, que se lee como profundidad.

**El modelo**

Lo pienso con este dibujo.

![Una escalera de once peldaños que sube cada vez menos y se aplana bajo una línea punteada, el techo de ese tipo de revisión. Por encima del techo, fuera del alcance de leer el código, hay dos marcas cuadradas rotuladas otro observador.](figure/review-rounds-ceiling "Esquema conceptual, no datos medidos. Las rondas del mismo tipo se acercan a un techo y no lo cruzan; lo que encontró otro observador estaba por encima.")

Cada tipo de revisión tiene un techo: el conjunto de defectos que puede ver alguien con ese material, esos medios y esa pregunta. Las primeras rondas suben rápido hacia él. Las siguientes suben menos, porque encuentran lo que quedaba, que es cada vez más poco y más fino. Ninguna lo cruza. Y los defectos que están por encima no son más difíciles, son de otro tipo. Los dos míos eran evidentes para cualquiera que abriera la aplicación.

El dibujo es un esquema y no una medición. No publiqué el conteo de hallazgos por ronda, así que la forma exacta de la escalera es mi modelo y no un dato. Lo que sí es un dato es dónde quedaron las dos marcas de arriba.

Del dibujo sale una pregunta más útil que cuántas rondas llevamos: en qué se diferencia el siguiente observador de los anteriores. Yo miro tres cosas. Qué recibe: el texto, el programa corriendo, los datos reales. Qué puede hacer: leer, ejecutar, hacer clic, romper. Y qué quiere: comprobar que el código cumple lo que afirma, o conseguir algo con el producto. Una ronda nueva que no cambia ninguna de las tres trabaja debajo del mismo techo. Un usuario cambia las tres a la vez, y por eso diez minutos suyos rinden tanto.

**Cómo aplicarlo**

**1. Antes de pedir otra ronda, escribe qué no puede ver**

Una línea por cada tipo de revisión: qué material recibe y qué no puede ejecutar. La mía habría dicho: lee código, no arranca la aplicación, no tiene navegador. Con esa línea escrita, la ronda doce deja de parecer una mejora y el hueco queda a la vista de quien decide.

**2. Diez minutos de uso al cerrar cada entrega**

Este se puede probar esta misma semana. Al terminar una unidad de trabajo, alguien arranca el producto con el comando documentado, sin atajos, y hace la tarea principal de punta a punta. En ReaderSS esa tarea era agregar un feed y abrir una entrada. Desde entonces lo tengo como paso obligatorio del cierre de cada entrega, antes de declararla terminada.

Sirve igual fuera del código. Una guía de instalación revisada por tres modelos sigue sin estar probada hasta que una persona que no la escribió la sigue paso a paso en una máquina limpia. Los tres modelos leyeron el texto. Ninguno ejecutó los pasos.

**3. Cambia lo que el revisor puede tocar, no cuántos revisores hay**

El observador distinto no tiene que ser un usuario. En otro proyecto, un SaaS multi-tenant, una suite de unas 400 pruebas en verde no podía ver tres bloqueadores que un verificador independiente encontró al correr sondas contra un SQL Server real, con conexiones separadas. Lo conté en [el ensayo sobre las pruebas como cuello de botella](#blog/article/con-ai-el-cuello-de-botella-son-tus-pruebas). Ese verificador no leyó con más atención que los demás. Tenía otro acceso: un motor real al que hacerle preguntas. Si vas a gastar una ronda más, gástala en un revisor que tenga el programa corriendo delante.

**4. Una verificación manual aplazada tiene dueño y bloquea**

Esto va para quien dirige. El comentario de mi hoja de estilos era exacto y no controló nada, porque nadie respondía por él. Cuando el entorno de un agente no puede hacer una comprobación, lo correcto es que la escale a una persona, no que la aplace en silencio. Y al leer un informe de cierre conviene hacer una pregunta corta: quién miró esto que no fuera del mismo tipo que quien lo escribió.

**Dónde puedo estar equivocado**

Primero, es un caso. Un proyecto, un autor, una forma de revisar. Con eso no puedo afirmar que la revisión con agentes se sature siempre en pocas rondas. Y la referencia de Nielsen habla de pruebas con usuarios, no de revisores de código: tomo de ella la forma del argumento, no el 31 %.

Segundo, la revisión adversarial encontró defectos reales que el uso no habría encontrado nunca. El bloqueante y los cuatro críticos estaban casi todos en el borde de confianza: una guarda contra SSRF que debía reaplicarse en cada redirección, el punto único donde se sanea el contenido antes de dibujarlo, los límites de tamaño y de tiempo. Un usuario que abre el navegador no descubre nada de eso. Mis diez minutos también tienen techo, y está en otro sitio. El título compara dos cosas que no se sustituyen en ninguna dirección. Para un servicio expuesto a internet, no tengo claro que eligiera los diez minutos si solo pudiera quedarme con una.

Tercero, el usuario del caso era yo. Eso lo debilita: no era un extraño, conocía la aplicación y sabía qué intentar. Un usuario de verdad habría encontrado quizá otras cosas, o las mismas con más trabajo.

Cuarto, el techo se mueve. La revisión manual se cayó porque en aquel entorno los agentes no podían abrir un navegador. Un agente que sí puede arrancar la aplicación y hacer clic ya es un observador distinto en dos de las tres cosas que miro, y parte de lo que hoy le pido a una persona se lo podré pedir a él. La tercera no cambia: ese agente sigue comprobando lo que el código afirma, y alguien tiene que querer leer sus feeds.

Lo que me llevo es una regla de presupuesto. Antes de pagar otra ronda, pregunto qué tiene de distinto quien la va a hacer. Si la respuesta es nada, esos minutos rinden más con la aplicación abierta.`,
  contentEn: `One more review round of the same kind buys less each time, and some defects it never buys at all. What finds those is a different observer: someone, or something, looking at different material, with different means and a different intent. More review and a different view are separate things, and it is easy to build a process that treats the second as if it came bundled with the first.

AI agents make that confusion cheap. A review round no longer costs a colleague's afternoon. It costs a few minutes. So the rounds pile up, and the number of rounds starts to read like a measure of quality.

**The common view**

The usual idea is sensible. Every round finds something, so more rounds find more. If each one also attacks the change from a different angle, security, resilience, readability, reliability, the set should cover nearly everything. And if an adversarial reviewer tries to refute what the others found, better still, because false positives get filtered out.

I do not dispute the first half of that, because it is true: rounds find things. I dispute the next step, the one that is rarely said out loud: that a tall stack of rounds is evidence the product works.

**Why it fails**

I have a case of my own, told with its technical detail in [the post on ReaderSS](#blog/article/revision-adversarial-no-encontro-lo-que-el-usuario-si). ReaderSS is an RSS reader I built with AI agents. When I closed it out it had 426 tests, roughly 95% coverage against an enforced 70% gate, and eleven rounds of four-lens adversarial review, which is 44 review passes, plus two formal refutations. Those produced 47 applied findings, one blocker and four criticals among them.

Then I opened the app in a browser for the first time. In under five minutes I hit two defects that made it unusable. No feed could be added, because the dev command never started the service that fetches them, and the app blamed the address the user had just typed. And clicking an entry did nothing visible, because the reading pane was drawn off-screen. None of the 44 passes had found either one.

The reason is what matters. Care was not missing and rounds were not missing. All eleven had three things in common. They read the same material, the text of the code. They worked in the same environment, with no browser and no two processes running side by side. And they answered the same question: does the code do what it says it does. Both defects lived outside all three. One was in whether two processes talk to each other at startup. The other was in what a layout engine does with a stylesheet. No reader of code, however careful, runs a layout engine from memory.

One detail shows this better than any argument. The stylesheet carried an honest comment: it said no automated test exercised that layout and that it stayed unverified except by manual review. Eleven rounds read that comment. None could do what it asked for, because the agents' environment had nothing to open a browser with, and the manual review kept being deferred until it was no longer on the list.

> The four lenses changed the question put to the code. None of them changed what the reviewer could see.

This shape is not specific to models. Jakob Nielsen described it for usability testing: one user teaches you a lot, the second repeats part of what the first did, and [his 2000 article](https://www.nngroup.com/articles/why-you-only-need-to-test-with-5-users/) sums it up as "As you add more and more users, you learn less and less". His formula starts from one user finding, on average, 31% of the problems, with heavy overlap between users. What interests me most is the exception he notes himself: you need more users when a site has "several highly distinct groups of users". Similar observers saturate quickly. What justifies adding another one is that it is different.

It is not specific to AI review either. Jacek Czerwonka and Michaela Greiler, in the abstract of [a 2015 paper published by Microsoft Research](https://www.microsoft.com/en-us/research/publication/code-reviews-do-not-find-bugs-how-the-current-code-review-best-practice-slows-us-down/), argue that "code reviews often do not find functionality issues that should block a code submission". They are writing about human reviewers reading code, and they describe the same limit.

What AI changes is the price, and with the price, the temptation. When a round cost a person's afternoon, nobody ran eleven. Now you can run eleven without anyone asking what the eleventh sees that the tenth did not. And the closing report carries a large number, which reads as depth.

**The model**

This is the sketch I think with.

![A staircase of eleven steps that rises less each time and flattens under a dashed line, the ceiling of that kind of review. Above the ceiling, out of reach of reading the code, two square marks are labelled another observer.](figure/review-rounds-ceiling "Conceptual sketch, not measured data. Rounds of the same kind approach a ceiling and do not cross it; what another observer found was above it.")

Every kind of review has a ceiling: the set of defects visible to someone with that material, those means and that question. The first rounds climb toward it quickly. Later rounds climb less, because they find what was left, and what is left keeps getting smaller and finer. None of them crosses it. And the defects above it are not harder, they are of another kind. My two were obvious to anyone who opened the app.

The sketch is a model and not a measurement. I did not publish findings per round, so the exact shape of the staircase is my model and not data. What is data is where the two marks at the top ended up.

The sketch gives me a more useful question than how many rounds we have done: how is the next observer different from the previous ones. I look at three things. What it receives: the text, the running program, real data. What it can do: read, execute, click, break. And what it wants: to check that the code does what it claims, or to get something done with the product. A new round that changes none of the three works under the same ceiling. A user changes all three at once, which is why ten minutes of one go so far.

**How to apply it**

**1. Before asking for another round, write down what it cannot see**

One line per kind of review: what material it receives and what it cannot run. Mine would have said: reads code, does not start the app, has no browser. With that line written down, round twelve stops looking like an improvement and the gap is visible to whoever decides.

**2. Ten minutes of use at the close of every delivery**

You can try this one this week. When a unit of work is finished, someone starts the product with the documented command, no shortcuts, and does the main task end to end. In ReaderSS that task was adding a feed and opening an entry. Since then I keep it as a mandatory step of closing each delivery, before calling it done.

It works the same outside code. An installation guide reviewed by three models is still untested until a person who did not write it follows it step by step on a clean machine. The three models read the text. None of them ran the steps.

**3. Change what the reviewer can touch, not how many reviewers there are**

The different observer does not have to be a user. On another project, a multi-tenant SaaS, a suite of about 400 green tests could not see three blockers that an independent verifier found by running probes against a real SQL Server over separate connections. I wrote about it in [the essay on tests as the bottleneck](#blog/article/con-ai-el-cuello-de-botella-son-tus-pruebas). That verifier did not read more carefully than the others. It had different access: a real engine to put questions to. If you are going to spend one more round, spend it on a reviewer with the program running in front of it.

**4. A deferred manual check has an owner and blocks**

This one is for whoever leads. The comment in my stylesheet was accurate and controlled nothing, because nobody answered for it. When an agent's environment cannot perform a check, the right move is to escalate it to a person, not to defer it quietly. And when you read a closing report, one short question is worth asking: who looked at this that was not the same kind of thing that wrote it.

**Where I could be wrong**

First, it is one case. One project, one author, one way of reviewing. That does not let me claim that agent review always saturates within a few rounds. And Nielsen's piece is about tests with users, not about code reviewers: I take the shape of the argument from it, not the 31%.

Second, adversarial review found real defects that use would never have found. The blocker and the four criticals were nearly all on the trust boundary: an SSRF guard that had to be re-applied on every redirect, the single point where content is sanitised before it is drawn, the size and time limits. A user opening a browser discovers none of that. My ten minutes have a ceiling too, and it sits somewhere else. The title compares two things that do not replace each other in either direction. For a service exposed to the internet, I am not sure I would pick the ten minutes if I could keep only one.

Third, the user in this case was me. That weakens it: I was not a stranger, I knew the app and I knew what to try. A real user might have found other things, or the same ones with more effort.

Fourth, the ceiling moves. The manual review fell away because, in that environment, the agents could not open a browser. An agent that can start the app and click is already a different observer on two of the three things I look at, and part of what I ask a person for today I will be able to ask it for. The third does not change: that agent is still checking what the code claims, and somebody has to want to read their feeds.

What I take from this is a budget rule. Before paying for another round, I ask what is different about whoever will run it. If the answer is nothing, those minutes go further with the app open.`,
  relatedIds: ['adversarial-review-missed-user-defects', 'ai-bottleneck-is-your-tests'],
}
