import type { BlogPost } from '../../types'

export const aiProposesTransactionDecides: Omit<BlogPost, 'readingTime'> = {
  id: 'ai-proposes-transaction-decides',
  slug: 'la-ai-propone-una-transaccion-decide',
  series: 'Working with AI',
  seriesOrder: 7,
  title: 'Por qué un botón de aprobar no basta cuando la AI propone cambios en tus datos',
  titleEn: 'Why an Approve Button Is Not Enough When AI Proposes Changes to Your Data',
  date: '2026-11-17',
  tags: ['AI', 'diseño de producto', 'decisiones', 'transacciones'],
  category: 'ensayo',
  featured: false,
  excerpt:
    'En mi producto, la AI propone tareas y una persona las aprueba. Aun así, dos aprobaciones casi simultáneas podían crear las tareas dos veces. Lo arreglé en la transacción que guarda los datos, y el prompt no tuvo nada que ver. También cuento cuándo sobra el paso de confirmación y qué pasa cuando nadie lee lo que confirma.',
  excerptEn:
    'In my product, the AI proposes tasks and a person approves them. Even so, two approvals arriving almost together could create the tasks twice. I fixed it in the transaction that saves the data, and the prompt had nothing to do with it. I also explain when the confirmation step is unnecessary and what happens when nobody reads what they confirm.',
  content: `En un producto que usa un modelo de lenguaje, lo que el modelo devuelve debería ser una propuesta. Una propuesta es un registro que alguien puede leer, corregir, rechazar o dejar vencer, y que por sí solo no cambia nada. Los datos los cambia otro paso: una persona confirma, y una transacción de base de datos comprueba, escribe y deja constancia. Ese segundo paso es determinístico, es decir, en las mismas condiciones hace siempre lo mismo. Yo diseño esa frontera entre proponer y decidir antes de escribir el prompt, porque es la única parte del sistema cuyo comportamiento puedo garantizar.

La razón es sencilla. Al modelo le puedo pedir cosas. A una transacción le puedo exigir cosas. Si el prompt dice que no se creen tareas duplicadas, eso es una petición que se cumple casi siempre. Un índice único en la base de datos es una regla que se cumple siempre, y cuando no puede cumplirse falla con un error que se ve. Si el resultado toca datos que otras personas van a usar, quiero que la última palabra la tenga el segundo tipo de mecanismo.

**Lo que se suele pensar**

Hay dos posturas habituales. La primera pone el esfuerzo en el modelo. Si el asistente crea algo que no debía, se mejora el prompt, se añaden ejemplos, se cambia de modelo o se suman instrucciones de seguridad. Ese trabajo es necesario, porque una propuesta mala hace perder tiempo aunque nadie la confirme. Pero esta postura trata la autoridad del modelo como un asunto de calidad. Da por hecho que, con suficiente calidad, el modelo puede escribir directamente en los datos.

La segunda es el humano en el circuito: antes de ejecutar, una persona aprueba. Es la recomendación estándar y la comparto. La guía de OWASP sobre [agencia excesiva](https://genai.owasp.org/llmrisk/llm062025-excessive-agency/) en aplicaciones con modelos de lenguaje describe el riesgo como acciones dañinas que se ejecutan a partir de salidas "unexpected, ambiguous or manipulated" del modelo. Entre sus mitigaciones pide dos cosas. Una es exigir aprobación humana para las acciones de alto impacto. La otra es poner la autorización en los sistemas que reciben la acción, en lugar de confiar en que el modelo decida si está permitida.

Mi desacuerdo es con la forma en que se suele construir la segunda. "Que una persona apruebe" termina siendo un botón, y el botón se trata como un detalle de interfaz. Casi nadie lo diseña como la ruta de escritura más delicada del producto, y eso es.

**Qué pasó en mi producto**

Tengo un caso propio. DevManager es un SaaS multi-tenant, un mismo sistema que usan varias organizaciones. Empezó como mi proyecto de grado y lo sigo desarrollando. Tiene un módulo de tareas en el que la AI convierte un requisito escrito en lenguaje natural en un lote de tareas propuestas. Ninguna tarea existe hasta que una persona revisa la propuesta y la confirma. Usé ese mismo caso en [Ahora que la AI escribe código rápido, lo que te frena es cuánto puedes confiar en tus pruebas](#blog/article/con-ai-el-cuello-de-botella-son-tus-pruebas) para hablar de pruebas. Aquí me interesa otra cosa: hasta dónde llega la autoridad del modelo.

Lo primero que aprendí es que añadir a la persona no vuelve determinístico el paso. La aprobación de acciones que ya existía en el proyecto seguía el patrón de siempre: leer el registro, comprobar que estaba pendiente, cambiar el estado y guardar. Entre la lectura y el guardado pasa un momento. Una propuesta pendiente aparece en el panel del proyecto y también en la tarjeta del chat donde se generó. Dos personas con permiso pueden abrirla a la vez. La misma persona puede pulsar dos veces porque la red tardó. Con ese patrón, las dos aprobaciones pasan la comprobación y cada una crea su propio lote de tareas. A ese defecto se le llama una carrera: dos operaciones llegan casi juntas y el resultado depende de cuál gana.

> Había un humano en el circuito, y el circuito tenía una carrera.

Ningún prompt arregla eso. Cuando el problema ocurre, el modelo ya terminó su trabajo.

Lo arreglé tratando la confirmación como un cambio de estado con guardas. Una guarda es una comprobación que tiene que cumplirse para que el cambio se escriba. La confirmación es una sola transacción. Empieza con un cambio de estado condicional: la propuesta pasa a aprobada solo si sigue pendiente y no ha vencido. Si ese cambio afecta una fila, esta petición ganó. Si afecta cero filas, otra persona ya decidió o el plazo pasó, y la respuesta es un error 409. En la misma transacción se reservan los números consecutivos de las tareas y se crean las tareas, con un índice único como última red de seguridad. Queda todo o no queda nada. El detalle técnico está en [Las pruebas InMemory mienten sobre las transacciones](#blog/article/pruebas-inmemory-mienten-sobre-transacciones).

Lo segundo que aprendí es que esa frontera sirve para más de un caso. Rechazar una propuesta y aprobar las demás acciones del agente usan ese mismo cambio de estado, en un único método. Al llevar la confirmación a ese camino se cerró de paso otra carrera de doble aprobación. Estaba en el flujo general de aprobaciones del agente, más allá de las tareas.

De ahí sale mi objeción al botón. Si la ruta de escritura está mal construida, la persona que aprueba decide tan poco como el modelo.

**Los dos carriles**

Lo dibujo con dos carriles.

![Dos columnas. A la izquierda, el carril del modelo: requisito escrito, modelo, validación de esquema y propuesta pendiente, con una marca que dice que ahí termina su autoridad. Una línea punteada lleva la propuesta a la columna derecha, el carril determinístico: una persona confirma, guardas de permiso, estado y plazo, commit todo o nada, registro de la decisión y, al final, los datos del producto.](figure/ai-proposes-lanes "Esquema conceptual, no datos medidos. El carril del modelo termina en la propuesta. Solo el carril determinístico llega a los datos.")

El carril del modelo va del requisito a la propuesta, y ahí termina. En mi caso, lo que entra se trata como no confiable, lo que sale se valida contra un esquema y cada lote tiene un tope de tareas. Las herramientas que el modelo puede invocar se filtran según los permisos de quien pregunta. Si todo lo que esa persona pide está denegado, el sistema responde con una negativa sin llamar al modelo. Todo eso reduce el daño de una mala propuesta. Nada de eso escribe en el tablero.

La propuesta es un registro con estado propio. Está pendiente, aprobada o rechazada, y tiene un plazo después del cual ya no se puede confirmar. Esa es la pieza que más cambia el diseño. Mientras la salida del modelo vive solo en la respuesta del chat, la única forma de usarla es ejecutarla. Cuando es un registro, se puede mostrar en dos sitios, puede quedarse esperando, la puede abrir más de una persona y vence.

El carril determinístico es el único que llega a los datos. Lo pienso en cuatro pasos. Una persona con permiso confirma. Las guardas comprueban lo que no depende de la opinión de nadie: que la propuesta siga pendiente, que no haya vencido y que quien confirma pueda hacerlo. El commit, que es el momento en que la transacción guarda sus cambios, escribe todo o nada. Y la propuesta, con su estado final, queda como constancia de qué se propuso y qué se decidió.

Cada carril responde una pregunta distinta. La persona responde si eso es lo que el equipo quiere. La transacción responde si se puede hacer y si deja los datos consistentes. Al modelo no le hago ninguna de las dos.

En la práctica, esto invierte el orden de trabajo. Antes de escribir el prompt defino qué forma tiene una propuesta, qué estados recorre, quién puede moverla y qué comprueba la transacción que la aplica. El prompt llega después, y llega con un contrato: tiene que producir algo que pase el esquema. Si mañana cambio de modelo, esa frontera no se mueve.

**Cómo aplicarlo**

**1. Haz la lista de lo que el modelo puede escribir hoy sin que nadie confirme**

Revisa las herramientas o funciones que tu asistente puede invocar y marca las que escriben: crear, enviar, borrar, cobrar, asignar. Para cada una hazte dos preguntas. La primera es si su efecto lo ve alguien más que quien lo pidió. La segunda es si se puede deshacer con un gesto. Las que ve alguien más y no se pueden deshacer deberían devolver una propuesta en lugar de ejecutar.

**2. Dale estados y plazo a la propuesta**

Pendiente, aprobada, rechazada, y una sola ruta para pasar de un estado a otro. El plazo importa más de lo que parece. Una propuesta generada con los datos de la semana pasada y confirmada hoy aplica una decisión sobre una situación que ya cambió.

**3. Intenta romper tu propio botón**

Abre la misma propuesta en dos pestañas y confirma en las dos lo más junto que puedas, o lanza dos peticiones a la vez. Después cuenta lo que quedó en la base de datos. Lo que respondió cada petición no te sirve como prueba. Si hay dos lotes, tu paso de confirmación solo retrasa la escritura y no decide nada.

**4. Mide si alguien lee lo que confirma**

Durante una semana, cuenta cuántas propuestas se confirman sin cambios, cuántas se rechazan y cuántas vencen. Cuenta también cuánto tiempo pasa entre que una propuesta se muestra y se confirma. Si todas se confirman en dos segundos, hay dos explicaciones posibles: un modelo excelente o un botón que nadie lee. Los números no las distinguen. Para distinguirlas, toma diez propuestas confirmadas y repásalas con quien las confirmó.

Si diriges un equipo, la pregunta para una revisión de diseño cabe en una línea: qué puede cambiar esta función sin una persona, y dónde queda escrito que lo cambió.

**Dónde puedo estar equivocado**

El punto débil más serio es el de la regla 4. Una confirmación que la gente pulsa sin leer no decide nada. Así suele terminar cualquier diálogo que aparece muchas veces y casi siempre tiene razón. Mi diseño no lo evita. Lo que hace es limitar el daño. Las guardas de la transacción no dependen de que alguien lea, así que una confirmación distraída puede crear tareas mal pensadas, pero no tareas duplicadas ni fuera de plazo. La pregunta de si eso era lo que el equipo quería queda sin responder. Sobre esa parte este ensayo no aporta datos. No reporta cuántas propuestas se rechazan en DevManager, así que no puede afirmar que la revisión humana esté ocurriendo. Solo puede afirmar que está disponible.

Segundo, no todo necesita una compuerta, que es como llamo al paso de confirmación. Un borrador que la persona va a leer y enviar ella misma ya tiene su paso de decisión, que es el envío. Una búsqueda o un resumen no cambian nada. Si les pones confirmación, enseñas a la gente a pulsar sin leer, y esa costumbre llega a las confirmaciones que sí importan. La prueba que uso tiene dos preguntas: si el resultado cambia algo que otra persona u otro sistema va a dar por cierto, y si quien lo pidió puede deshacerlo solo. Si no cambia nada compartido, no hace falta compuerta. Si lo cambia pero se deshace con un gesto, quizá baste con poder deshacer. Si lo cambia y no se deshace, hacen falta compuerta y transacción.

Tercero, el costo. Cada confirmación es fricción. Hay productos cuyo valor está en que el agente actúe solo sobre muchas cosas pequeñas. Ahí una confirmación por acción no escala, y a la persona hay que ponerla en otro sitio: en una política aprobada una vez, en un límite o en un lote que se revisa por muestreo.

Cuarto, el alcance de mi evidencia. Es un producto, mío, con un flujo de propuestas. La guía de OWASP que cito habla de seguridad y no de diseño de producto. Llevarla al diseño de producto es cosa mía.

Me llevo una regla de orden: primero decido qué puede cambiar los datos y con qué guardas, y después escribo el prompt.`,
  contentEn: `In a product built on a language model, what the model returns should be a proposal. A proposal is a record someone can read, correct, reject or leave to expire, and that changes nothing by itself. A separate step changes the data: a person confirms, and a database transaction checks, writes and leaves a record. That second step is deterministic, meaning it does the same thing every time under the same conditions. I design that boundary between proposing and deciding before I write the prompt, because it is the only part of the system whose behavior I can guarantee.

The reason is simple. I can ask a model for things. I can require things of a transaction. If the prompt says not to create duplicate tasks, that is a request, and it is honored almost every time. A unique index in the database is a rule that holds every time, and when it cannot hold it fails with an error you can see. When the result touches data other people are going to rely on, I want the second kind of mechanism to have the last word.

**What people usually think**

There are two usual positions. The first puts the effort into the model. If the assistant creates something it should not have, you improve the prompt, add examples, switch models or add safety instructions. That work is necessary, because a bad proposal wastes time even if nobody confirms it. But this position treats the model's authority as a quality problem. It assumes that, with enough quality, the model can write straight to the data.

The second is human in the loop: before anything runs, a person approves. It is the standard recommendation and I agree with it. The OWASP guidance on [excessive agency](https://genai.owasp.org/llmrisk/llm062025-excessive-agency/) in applications built on language models describes the risk as damaging actions performed in response to "unexpected, ambiguous or manipulated" outputs from the model. Among its mitigations it asks for two things. One is human approval for high-impact actions. The other is putting authorization in the systems that receive the action, rather than relying on the model to decide whether it is allowed.

Where I disagree is with how the second one usually gets built. "A person approves" turns into a button, and the button is treated as an interface detail. Hardly anyone designs it as the most delicate write path in the product, and that is what it is.

**What happened in my product**

I have a case of my own. DevManager is a multi-tenant SaaS, one system used by several organizations. It started as my degree project and I keep building it. It has a tasks module where the AI turns a requirement written in plain language into a batch of proposed tasks. No task exists until a person reviews the proposal and confirms it. I used the same case in [Now That AI Writes Code Fast, What Slows You Down Is How Much You Can Trust Your Tests](#blog/article/con-ai-el-cuello-de-botella-son-tus-pruebas) to talk about testing. Here I care about something else: how far the model's authority goes.

The first thing I learned is that adding the person does not make the step deterministic. The action approval that already existed in the project followed the usual pattern: read the record, check that it is pending, change the state, save. A moment passes between the read and the save. A pending proposal shows up in the project panel and also in the chat card where it was generated. Two people with permission can open it at the same time. One person can click twice because the network was slow. With that pattern both approvals pass the check and each one creates its own batch of tasks. That defect is called a race: two operations arrive almost together and the outcome depends on which one wins.

> There was a human in the loop, and the loop had a race.

No prompt fixes that. By the time the problem happens, the model has finished its work.

I fixed it by treating confirmation as a state change with guards. A guard is a check that has to hold for the change to be written. Confirmation is a single transaction. It opens with a conditional state change: the proposal becomes approved only if it is still pending and has not expired. If that change touches one row, this request won. If it touches zero rows, someone else already decided or the deadline passed, and the answer is a 409 error. The same transaction reserves the sequential task numbers and creates the tasks, with a unique index as the last safety net. Either all of it is saved or none of it is. The technical detail is in [InMemory Tests Lie About Transactions](#blog/article/pruebas-inmemory-mienten-sobre-transacciones).

The second thing I learned is that the boundary serves more than one case. Rejecting a proposal and approving the agent's other actions use that same state change, in a single method. Moving confirmation onto that path also closed another double-approval race. It sat in the agent's general approval flow, beyond tasks.

That is where my objection to the button comes from. If the write path is badly built, the person approving decides as little as the model does.

**The two lanes**

I draw it with two lanes.

![Two columns. On the left, the model lane: written requirement, model, schema validation and a pending proposal, with a mark saying its authority ends there. A dashed line carries the proposal to the right column, the deterministic lane: a person confirms, guards on permission, state and expiry, an all-or-nothing commit, a record of the decision and, at the end, the product data.](figure/ai-proposes-lanes "Conceptual sketch, not measured data. The model lane ends at the proposal. Only the deterministic lane reaches the data.")

The model lane runs from the requirement to the proposal, and stops there. In my case the input is treated as untrusted, the output is validated against a schema, and every batch has a cap on the number of tasks. The tools the model can call are filtered by the permissions of whoever is asking. If everything that person asks for is denied, the system answers with a refusal without calling the model at all. All of that limits the damage a bad proposal can do. None of it writes to the board.

The proposal is a record with a state of its own. It is pending, approved or rejected, and it has a deadline after which it can no longer be confirmed. That is the piece that changes the design most. As long as the model's output lives only in the chat reply, the only way to use it is to execute it. Once it is a record, it can be shown in two places, it can sit and wait, more than one person can open it, and it expires.

The deterministic lane is the only one that reaches the data. I think of it as four steps. A person with permission confirms. The guards check what does not depend on anyone's opinion: that the proposal is still pending, that it has not expired, and that whoever is confirming is allowed to. The commit, which is the moment the transaction saves its changes, writes all or nothing. And the proposal, with its final state, stays as the record of what was proposed and what was decided.

Each lane answers a different question. The person answers whether this is what the team wants. The transaction answers whether it can be done and whether it leaves the data consistent. I ask the model neither.

In practice, this flips the order of work. Before writing the prompt I define what a proposal looks like, which states it moves through, who can move it, and what the transaction that applies it checks. The prompt comes afterwards, and it comes with a contract: it has to produce something that passes the schema. If I switch models tomorrow, that boundary does not move.

**How to apply it**

**1. List what the model can write today with nobody confirming**

Go through the tools or functions your assistant can call and mark the ones that write: create, send, delete, charge, assign. Ask two questions about each one. The first is whether anyone other than the requester sees its effect. The second is whether it can be undone in one gesture. The ones someone else sees and nobody can undo should return a proposal instead of executing.

**2. Give the proposal states and a deadline**

Pending, approved, rejected, and a single path from one state to the next. The deadline matters more than it seems. A proposal generated from last week's data and confirmed today applies a decision to a situation that has already changed.

**3. Try to break your own button**

Open the same proposal in two tabs and confirm in both as close together as you can, or fire two requests at once. Then count what ended up in the database. What each request answered proves nothing. If there are two batches, your confirmation step only delays the write and decides nothing.

**4. Measure whether anyone reads what they confirm**

For one week, count how many proposals are confirmed unchanged, how many are rejected and how many expire. Also count how long passes between a proposal being shown and being confirmed. If every one is confirmed within two seconds, there are two possible explanations: an excellent model, or a button nobody reads. The numbers cannot tell them apart. To tell them apart, take ten confirmed proposals and walk through them with the person who confirmed them.

If you lead a team, the question for a design review fits on one line: what can this feature change without a person, and where is it written down that it did.

**Where I could be wrong**

The most serious weak point is rule 4. A confirmation people click through without reading decides nothing. That is where any dialog tends to end up if it appears often and is almost always right. My design does not prevent it. What it does is limit the damage. The transaction's guards do not depend on anyone reading, so a careless confirmation can create badly thought-out tasks, but it cannot create duplicated tasks or tasks past the deadline. Whether that was what the team wanted goes unanswered. This essay has no data on that part. It does not report how many proposals get rejected in DevManager, so it cannot claim that human review is happening. It can only claim that it is available.

Second, not everything needs a gate, which is what I call the confirmation step. A draft the person is going to read and send themselves already has its decision step, which is the sending. A search or a summary changes nothing. If you put a confirmation on those, you teach people to click without reading, and that habit reaches the confirmations that do matter. The test I use has two questions: does the result change something another person or another system will take as true, and can the requester undo it alone. If nothing shared changes, you need no gate. If it changes but one gesture undoes it, an undo may be enough. If it changes and cannot be undone, you need a gate and a transaction.

Third, the cost. Every confirmation is friction. Some products are valuable because the agent acts alone on many small things. There, one confirmation per action does not scale, and the person has to sit somewhere else: in a policy approved once, in a limit or in a batch reviewed by sampling.

Fourth, how far my evidence reaches. It is one product, mine, with one proposal flow. The OWASP guidance I cite is about security and not about product design. Carrying it over to product design is my doing.

What I take from this is a rule about order: first I decide what can change the data and under which guards, and then I write the prompt.`,
  relatedIds: ['inmemory-tests-lie-about-transactions', 'ai-bottleneck-is-your-tests'],
}
