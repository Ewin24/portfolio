import type { BlogPost } from '../../types'

export const reviewRoundsAreNotAUser: Omit<BlogPost, 'readingTime'> = {
  id: 'review-rounds-are-not-a-user',
  slug: 'once-rondas-de-revision-no-son-un-usuario',
  series: 'Working with AI',
  seriesOrder: 6,
  title:
    'Puedes pedirle once rondas de revisión a la AI, pero nada reemplaza diez minutos usando el producto como un usuario de verdad',
  titleEn:
    'You Can Ask AI for Eleven Rounds of Review, but Nothing Replaces Ten Minutes of Using the Product Like a Real User',
  date: '2026-11-17',
  tags: ['AI', 'revisión de código', 'verificación', 'testing', 'liderazgo'],
  category: 'ensayo',
  featured: false,
  excerpt:
    'En un proyecto mío hice once rondas de revisión con AI, 44 pasadas en total, y apliqué 47 hallazgos. Después abrí la aplicación y en cinco minutos encontré dos defectos que la dejaban inservible. Antes de pagar otra ronda, pregunta qué puede ver quien la hace que no hayan visto los anteriores.',
  excerptEn:
    'On a project of my own I ran eleven rounds of AI review, 44 passes in all, and applied 47 findings. Then I opened the app and in five minutes found two defects that made it unusable. Before you pay for another round, ask what its reviewer can see that the earlier ones could not.',
  content: `Cuando le pides a un agente de AI otra ronda de revisión igual a las anteriores, cada vez encuentra menos. Y hay defectos que no encuentra nunca, por más rondas que sumes. Esos los encuentra un observador distinto: una persona o un programa que mira otro material, con otros medios y con otra intención. Pedir más revisión y conseguir una mirada distinta son dos cosas separadas. Es fácil armar un proceso que dé por hecho que la primera trae la segunda.

Con agentes de AI esa confusión sale barata. Antes, una ronda de revisión costaba la tarde de un colega. Ahora cuesta unos minutos. Entonces las rondas se acumulan, y uno empieza a leer el número de rondas como si midiera la calidad.

**Lo que se suele pensar**

La idea habitual es sensata. Cada ronda encuentra algo, así que más rondas encuentran más. Si además cada una mira el cambio desde un ángulo distinto (seguridad, resiliencia, legibilidad, confiabilidad), entre todas deberían cubrir casi todo. Y si hay un revisor adversarial, uno cuyo trabajo es intentar refutar lo que encontraron los demás, mejor todavía, porque filtra los falsos positivos.

La primera parte de esa idea es cierta y no la discuto: las rondas encuentran cosas. Discuto el paso siguiente, que casi nunca se dice en voz alta. Ese paso es creer que muchas rondas prueban que el producto funciona.

**Qué pasó cuando abrí la aplicación**

Tengo un caso propio. El detalle técnico está en [el artículo sobre ReaderSS](#blog/article/revision-adversarial-no-encontro-lo-que-el-usuario-si). ReaderSS es un lector de RSS que construí con agentes de AI. Al cerrarlo tenía 426 pruebas y cerca del 95 % de cobertura, cuando el mínimo exigido era 70 %. Tenía también once rondas de revisión adversarial de cuatro lentes, es decir, 44 pasadas de revisión, más dos refutaciones formales. De ahí salieron 47 hallazgos que apliqué, entre ellos un bloqueante y cuatro críticos.

Después abrí la aplicación en un navegador por primera vez. En menos de cinco minutos encontré dos defectos que la dejaban inservible. El primero era que no se podía agregar ningún feed. El comando de desarrollo no levantaba el servicio que los descarga, y la aplicación le echaba la culpa a la dirección que el usuario acababa de escribir. El segundo era que al hacer clic en una entrada no pasaba nada visible, porque el panel de lectura se dibujaba fuera de la pantalla. Ninguna de las 44 pasadas había encontrado ninguno de los dos.

Me interesa por qué. Hubo cuidado y hubo rondas de sobra. Pero las once tenían tres cosas en común. Leían el mismo material, que era el texto del código. Trabajaban en el mismo entorno, donde no había un navegador ni dos procesos corriendo a la vez. Y respondían la misma pregunta: si el código hace lo que dice hacer. Los dos defectos quedaban fuera de esas tres cosas. Uno dependía de si dos procesos se hablan al arrancar. El otro dependía de lo que un motor de layout hace con una hoja de estilos. Por atento que sea, nadie que lea código ejecuta un motor de layout de memoria.

Hay un detalle que lo muestra bien. La hoja de estilos llevaba un comentario honesto. Decía que ninguna prueba automatizada ejercitaba ese diseño y que quedaba sin verificar salvo por revisión manual. Once rondas leyeron ese comentario. Ninguna pudo hacer lo que pedía, porque en el entorno de los agentes no había con qué abrir un navegador. La revisión manual se fue aplazando hasta que dejó de estar en la lista.

> Las cuatro lentes le hacían al código preguntas distintas, pero el revisor seguía viendo lo mismo.

Esto no pasa solo con los modelos. Jakob Nielsen lo describió para las pruebas de usabilidad. Con un solo usuario aprendes mucho, y el segundo repite parte de lo que hizo el primero. [En su artículo de 2000](https://www.nngroup.com/articles/why-you-only-need-to-test-with-5-users/) lo resume así: "As you add more and more users, you learn less and less". Su fórmula parte de que un usuario encuentra, en promedio, el 31 % de los problemas, y de que buena parte de lo que encuentran varios usuarios se repite. Lo que más me interesa es la excepción que él mismo anota: hacen falta más usuarios cuando un sitio tiene "several highly distinct groups of users". Los observadores parecidos dejan de aportar pronto. Vale la pena sumar otro cuando es distinto.

Tampoco pasa solo con la revisión hecha por AI. Jacek Czerwonka y Michaela Greiler, en el resumen de [un artículo de 2015 publicado por Microsoft Research](https://www.microsoft.com/en-us/research/publication/code-reviews-do-not-find-bugs-how-the-current-code-review-best-practice-slows-us-down/), sostienen que "code reviews often do not find functionality issues that should block a code submission". Hablan de revisores humanos leyendo código, y describen el mismo límite.

Lo que la AI cambia es el precio, y con el precio llega la tentación. Cuando una ronda costaba la tarde de una persona, nadie hacía once. Ahora puedes hacer once sin que nadie pregunte qué ve la undécima que no haya visto la décima. Y el informe de cierre trae un número grande, que se lee como profundidad.

**Cómo lo pienso**

Lo pienso con este dibujo.

![Una escalera de once peldaños que sube cada vez menos y se aplana bajo una línea punteada, el techo de ese tipo de revisión. Por encima del techo, donde no se llega leyendo el código, hay dos marcas cuadradas rotuladas otro observador.](figure/review-rounds-ceiling "Esquema conceptual, no datos medidos. Las rondas del mismo tipo se acercan a un techo y no lo cruzan. Lo que encontró otro observador estaba por encima.")

Cada tipo de revisión tiene un techo. Llamo techo al conjunto de defectos que puede ver alguien con ese material, esos medios y esa pregunta. Las primeras rondas suben rápido hacia él. Las siguientes suben menos, porque encuentran lo que quedaba, que es cada vez menos y más fino. Ninguna lo cruza. Los defectos que quedan por encima pueden ser muy fáciles de ver para otro observador. Los dos míos eran evidentes para cualquiera que abriera la aplicación.

El dibujo es un esquema. No publiqué cuántos hallazgos dio cada ronda, así que la forma exacta de la escalera es como yo la imagino y no un dato medido. Lo que sí es un dato es dónde quedaron las dos marcas de arriba.

Del dibujo sale una pregunta más útil que "cuántas rondas llevamos". La pregunta es en qué se diferencia el siguiente observador de los anteriores. Yo miro tres cosas. Qué recibe: el texto, el programa corriendo, los datos reales. Qué puede hacer: leer, ejecutar, hacer clic, romper. Y qué quiere: comprobar que el código cumple lo que afirma, o conseguir algo con el producto. Si una ronda nueva no cambia ninguna de las tres, trabaja debajo del mismo techo. Un usuario cambia las tres a la vez, y por eso diez minutos suyos rinden tanto.

**Cómo usar esto en tu equipo**

**1. Antes de pedir otra ronda, escribe qué no puede ver**

Escribe una línea por cada tipo de revisión: qué material recibe y qué no puede ejecutar. La mía habría dicho: lee código, no arranca la aplicación, no tiene navegador. Con esa línea escrita, la ronda doce deja de parecer una mejora. Y quien decide puede ver qué parte sigue sin revisar.

**2. Usa el producto diez minutos al cerrar cada entrega**

Esto lo puedes probar esta misma semana. Al terminar una unidad de trabajo, alguien arranca el producto con el comando documentado, sin atajos, y hace la tarea principal de principio a fin. En ReaderSS esa tarea era agregar un feed y abrir una entrada. Desde entonces es un paso obligatorio cada vez que cierro una entrega, antes de declararla terminada.

Sirve igual fuera del código. Una guía de instalación revisada por tres modelos sigue sin estar probada hasta que una persona que no la escribió la sigue paso a paso en una máquina limpia. Los tres modelos leyeron el texto. Ninguno ejecutó los pasos.

**3. Dale al siguiente revisor algo distinto que tocar**

El observador distinto no tiene que ser un usuario. En otro proyecto, un SaaS multi-tenant, había una suite de unas 400 pruebas en verde. Esa suite no podía ver tres bloqueadores que un verificador independiente encontró al correr sondas contra un SQL Server real, con conexiones separadas. Lo conté en [el ensayo sobre las pruebas como cuello de botella](#blog/article/con-ai-el-cuello-de-botella-son-tus-pruebas). Ese verificador leyó con la misma atención que los demás. Lo que tenía de distinto era el acceso: un motor real al que hacerle preguntas. Si vas a gastar una ronda más, gástala en un revisor que tenga el programa corriendo delante.

**4. Si una verificación manual se aplaza, ponle dueño y haz que bloquee la entrega**

Esto va para quien dirige. El comentario de mi hoja de estilos era exacto y no controló nada, porque nadie respondía por él. Cuando el entorno de un agente no puede hacer una comprobación, el agente tiene que pasársela a una persona. Aplazarla en silencio es lo que pasó en mi caso. Y cuando leas un informe de cierre, haz una pregunta corta: quién miró esto que no fuera del mismo tipo que quien lo escribió.

**Dónde puedo estar equivocado**

Primero, es un solo caso: un proyecto, un autor, una forma de revisar. Con eso no puedo afirmar que la revisión con agentes deje siempre de encontrar cosas a las pocas rondas. Además, la referencia de Nielsen habla de pruebas con usuarios y no de revisores de código. De ella tomo la forma del argumento y dejo fuera el 31 %.

Segundo, la revisión adversarial encontró defectos reales que yo nunca habría encontrado usando la aplicación. El bloqueante y los cuatro críticos estaban casi todos en el borde de confianza: una guarda contra SSRF que debía volver a aplicarse en cada redirección, el punto único donde se sanea el contenido antes de dibujarlo, los límites de tamaño y de tiempo. Un usuario que abre el navegador no descubre nada de eso. Mis diez minutos también tienen techo, y está en otro sitio. El título dice que nada reemplaza esos diez minutos, y ellos tampoco reemplazan la revisión. Para un servicio expuesto a internet, no tengo claro que eligiera los diez minutos si solo pudiera quedarme con una de las dos.

Tercero, el usuario del caso era yo. Eso debilita el caso: yo no era un extraño, conocía la aplicación y sabía qué intentar. Un usuario de verdad quizá habría encontrado otras cosas, o las mismas con más trabajo.

Cuarto, el techo se mueve. La revisión manual se cayó porque en aquel entorno los agentes no podían abrir un navegador. Un agente que sí puede arrancar la aplicación y hacer clic ya es un observador distinto en dos de las tres cosas que miro. Parte de lo que hoy le pido a una persona se lo podré pedir a él. La tercera no cambia: ese agente sigue comprobando lo que el código afirma, y alguien tiene que querer leer sus feeds.

Me quedo con una regla para decidir en qué gasto el tiempo de revisión. Antes de pagar otra ronda, pregunto qué tiene de distinto quien la va a hacer. Si la respuesta es "nada", uso esos minutos con la aplicación abierta.`,
  contentEn: `When you ask an AI agent for one more review round just like the previous ones, it finds less each time. And some defects it never finds, however many rounds you add. Those get found by a different observer: a person or a program looking at different material, with different means and a different intent. Asking for more review and getting a different view are two separate things. It is easy to build a process that assumes the first one brings the second along.

AI agents make that confusion cheap. A review round used to cost a colleague's afternoon. Now it costs a few minutes. So the rounds pile up, and you start reading the number of rounds as if it measured quality.

**The common view**

The usual idea is sensible. Every round finds something, so more rounds find more. If each one also looks at the change from a different angle (security, resilience, readability, reliability), together they should cover nearly everything. And if there is an adversarial reviewer, one whose job is to try to refute what the others found, better still, because it filters out false positives.

The first part of that idea is true and I do not dispute it: rounds find things. I dispute the next step, which is rarely said out loud. That step is believing that many rounds prove the product works.

**What happened when I opened the app**

I have a case of my own. The technical detail is in [the post on ReaderSS](#blog/article/revision-adversarial-no-encontro-lo-que-el-usuario-si). ReaderSS is an RSS reader I built with AI agents. When I closed it out it had 426 tests and roughly 95% coverage, when the required minimum was 70%. It also had eleven rounds of four-lens adversarial review, which is 44 review passes, plus two formal refutations. Those produced 47 findings that I applied, one blocker and four criticals among them.

Then I opened the app in a browser for the first time. In under five minutes I found two defects that made it unusable. The first was that no feed could be added. The dev command never started the service that fetches them, and the app blamed the address the user had just typed. The second was that clicking an entry did nothing visible, because the reading pane was drawn off-screen. None of the 44 passes had found either one.

What interests me is why. There was care, and there were more than enough rounds. But all eleven had three things in common. They read the same material, which was the text of the code. They worked in the same environment, with no browser and no two processes running side by side. And they answered the same question: does the code do what it says it does. Both defects sat outside those three things. One depended on whether two processes talk to each other at startup. The other depended on what a layout engine does with a stylesheet. However careful they are, nobody who reads code runs a layout engine from memory.

One detail shows this well. The stylesheet carried an honest comment. It said no automated test exercised that layout and that it stayed unverified except by manual review. Eleven rounds read that comment. None could do what it asked for, because the agents' environment had nothing to open a browser with. The manual review kept being put off until it was no longer on the list.

> The four lenses asked the code different questions, but the reviewer kept seeing the same thing.

This does not only happen with models. Jakob Nielsen described it for usability testing. One user teaches you a lot, and the second repeats part of what the first did. [His 2000 article](https://www.nngroup.com/articles/why-you-only-need-to-test-with-5-users/) sums it up as "As you add more and more users, you learn less and less". His formula starts from one user finding, on average, 31% of the problems, with much of what several users find being repeated. What interests me most is the exception he notes himself: you need more users when a site has "several highly distinct groups of users". Observers who are alike stop adding much very soon. Adding another one is worth it when that one is different.

It does not only happen with AI review either. Jacek Czerwonka and Michaela Greiler, in the abstract of [a 2015 paper published by Microsoft Research](https://www.microsoft.com/en-us/research/publication/code-reviews-do-not-find-bugs-how-the-current-code-review-best-practice-slows-us-down/), argue that "code reviews often do not find functionality issues that should block a code submission". They are writing about human reviewers reading code, and they describe the same limit.

What AI changes is the price, and the temptation comes with the price. When a round cost a person's afternoon, nobody ran eleven. Now you can run eleven without anyone asking what the eleventh sees that the tenth did not. And the closing report carries a large number, which reads as depth.

**How I think about it**

This is the sketch I use.

![A staircase of eleven steps that rises less each time and flattens under a dashed line, the ceiling of that kind of review. Above the ceiling, where reading the code does not reach, two square marks are labelled another observer.](figure/review-rounds-ceiling "Conceptual sketch, not measured data. Rounds of the same kind approach a ceiling and do not cross it. What another observer found was above it.")

Every kind of review has a ceiling. By ceiling I mean the set of defects that someone with that material, those means and that question is able to see. The first rounds climb toward it quickly. Later rounds climb less, because they find what was left, and what is left keeps getting smaller and finer. None of them crosses it. The defects above it can be very easy for another observer to see. My two were obvious to anyone who opened the app.

The drawing is a sketch. I did not publish how many findings each round produced, so the exact shape of the staircase is how I picture it and not measured data. What is data is where the two marks at the top ended up.

The sketch gives me a more useful question than "how many rounds have we done". The question is how the next observer differs from the previous ones. I look at three things. What it receives: the text, the running program, real data. What it can do: read, execute, click, break. And what it wants: to check that the code does what it claims, or to get something done with the product. If a new round changes none of the three, it works under the same ceiling. A user changes all three at once, which is why ten minutes of one go so far.

**How to use this on your team**

**1. Before asking for another round, write down what it cannot see**

Write one line per kind of review: what material it receives and what it cannot run. Mine would have said: reads code, does not start the app, has no browser. With that line written down, round twelve stops looking like an improvement. And whoever decides can see which part is still unreviewed.

**2. Use the product for ten minutes at the close of every delivery**

You can try this one this week. When a unit of work is finished, someone starts the product with the documented command, no shortcuts, and does the main task from start to finish. In ReaderSS that task was adding a feed and opening an entry. Since then it is a mandatory step every time I close a delivery, before I call it done.

It works the same outside code. An installation guide reviewed by three models is still untested until a person who did not write it follows it step by step on a clean machine. The three models read the text. None of them ran the steps.

**3. Give the next reviewer something different to touch**

The different observer does not have to be a user. On another project, a multi-tenant SaaS, there was a suite of about 400 green tests. That suite could not see three blockers that an independent verifier found by running probes against a real SQL Server over separate connections. I wrote about it in [the essay on tests as the bottleneck](#blog/article/con-ai-el-cuello-de-botella-son-tus-pruebas). That verifier read just as carefully as the others. What it had that they did not was access: a real engine to put questions to. If you are going to spend one more round, spend it on a reviewer with the program running in front of it.

**4. If a manual check gets deferred, give it an owner and make it block the delivery**

This one is for whoever leads. The comment in my stylesheet was accurate and controlled nothing, because nobody answered for it. When an agent's environment cannot perform a check, the agent has to hand it to a person. Deferring it quietly is what happened in my case. And when you read a closing report, ask one short question: who looked at this that was not the same kind of thing that wrote it.

**Where I could be wrong**

First, it is a single case: one project, one author, one way of reviewing. That does not let me claim that agent review always stops finding things after a few rounds. Also, Nielsen's piece is about tests with users and not about code reviewers. I take the shape of the argument from it and leave the 31% out.

Second, adversarial review found real defects that I would never have found by using the app. The blocker and the four criticals were nearly all on the trust boundary: an SSRF guard that had to be applied again on every redirect, the single point where content is sanitised before it is drawn, the size and time limits. A user opening a browser discovers none of that. My ten minutes have a ceiling too, and it sits somewhere else. The title says nothing replaces those ten minutes, and they do not replace the review either. For a service exposed to the internet, I am not sure I would pick the ten minutes if I could keep only one of the two.

Third, the user in this case was me. That weakens it: I was not a stranger, I knew the app and I knew what to try. A real user might have found other things, or the same ones with more effort.

Fourth, the ceiling moves. The manual review fell away because, in that environment, the agents could not open a browser. An agent that can start the app and click is already a different observer on two of the three things I look at. Part of what I ask a person for today I will be able to ask it for. The third does not change: that agent is still checking what the code claims, and somebody has to want to read their feeds.

What I keep is a rule for deciding where my review time goes. Before paying for another round, I ask what is different about whoever will run it. If the answer is "nothing", I spend those minutes with the app open.`,
  relatedIds: ['adversarial-review-missed-user-defects', 'ai-bottleneck-is-your-tests'],
}
