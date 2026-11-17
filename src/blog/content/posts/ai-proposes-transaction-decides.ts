import type { BlogPost } from '../../types'

export const aiProposesTransactionDecides: Omit<BlogPost, 'readingTime'> = {
  id: 'ai-proposes-transaction-decides',
  slug: 'la-ai-propone-una-transaccion-decide',
  title: 'La AI propone; una transacción decide',
  titleEn: 'The Model Proposes. A Transaction Decides',
  date: '2026-11-17',
  tags: ['AI', 'diseño de producto', 'decisiones', 'transacciones'],
  category: 'ensayo',
  featured: false,
  excerpt:
    'En un producto con un modelo de lenguaje, la salida del modelo debería ser una propuesta que por sí sola no cambia nada. Lo que cambia los datos es un paso determinístico: una persona confirma y una transacción con sus propias guardas escribe. En mi caso había un humano en el circuito y el circuito tenía una carrera de doble aprobación; la arregló la transacción, no el prompt. También digo cuándo la compuerta sobra y qué pasa cuando nadie lee lo que confirma.',
  excerptEn:
    'In a product built on a language model, the model\'s output should be a proposal that changes nothing by itself. What changes the data is a deterministic step: a person confirms and a transaction with its own guards does the writing. In my case there was a human in the loop and the loop had a double-approval race; the transaction fixed it, not the prompt. I also say when the gate is unnecessary and what happens when nobody reads what they confirm.',
  content: `En un producto que usa un modelo de lenguaje, lo que el modelo devuelve debería ser una propuesta: un registro que se puede leer, corregir, rechazar o dejar vencer, y que por sí solo no cambia nada. Lo que cambia los datos es otro paso, determinístico y con sus propias guardas: una persona confirma y una transacción comprueba, escribe y deja constancia. Sostengo que esa frontera entre proponer y decidir se diseña antes que el prompt, porque es la única parte del sistema cuyo comportamiento puedo garantizar.

La razón se dice rápido. Al modelo le puedo pedir cosas. A una transacción le puedo exigir cosas. Un prompt que dice que no se creen tareas duplicadas es una petición que se cumple casi siempre. Un índice único es una regla que se cumple siempre, o falla haciendo ruido. Cuando el resultado toca datos que otras personas van a usar, quiero que la última palabra la tenga la segunda clase de mecanismo.

**Lo que se suele pensar**

La primera postura habitual pone el esfuerzo en el modelo. Si el asistente crea algo que no debía, la respuesta es mejorar el prompt, añadir ejemplos, cambiar de modelo, sumar instrucciones de seguridad. Es trabajo necesario: una propuesta mala hace perder tiempo aunque nadie la confirme. Pero trata la autoridad del modelo como un asunto de calidad, y da por hecho que con suficiente calidad el modelo puede escribir directamente.

La segunda es el humano en el circuito: antes de ejecutar, que una persona apruebe. Es la recomendación estándar y la comparto. La guía de OWASP sobre [agencia excesiva](https://genai.owasp.org/llmrisk/llm062025-excessive-agency/) en aplicaciones con modelos de lenguaje describe el riesgo como acciones dañinas ejecutadas a partir de salidas "unexpected, ambiguous or manipulated" del modelo. Entre sus mitigaciones pide exigir aprobación humana para las acciones de alto impacto, y poner la autorización en los sistemas que reciben la acción en lugar de confiar en que el modelo decida si está permitida.

Mi desacuerdo es con cómo se suele construir la segunda. "Que una persona apruebe" termina siendo un botón, y el botón se trata como un detalle de interfaz. Casi nadie lo diseña como lo que es: la ruta de escritura más delicada del producto.

**Por qué falla**

Tengo un caso propio. DevManager es un SaaS multi-tenant que empezó como mi proyecto de grado y que sigo desarrollando. Tiene un módulo de tareas en el que la AI convierte un requisito escrito en lenguaje natural en un lote de tareas propuestas, y ninguna tarea existe hasta que una persona revisa la propuesta y la confirma. Usé ese mismo caso en [Con AI, el cuello de botella son tus pruebas, no tu código](#blog/article/con-ai-el-cuello-de-botella-son-tus-pruebas) para hablar de pruebas. Aquí me interesa otra cosa: dónde termina la autoridad del modelo.

Lo primero que aprendí es que añadir a la persona no vuelve determinístico el paso. La aprobación de acciones que ya existía en el proyecto seguía el patrón de siempre: leer el registro, comprobar que estaba pendiente, cambiar el estado y guardar. Entre la lectura y el guardado hay una ventana. Una propuesta pendiente aparece en el panel del proyecto y también en la tarjeta del chat donde se generó. Dos personas con permiso pueden abrirla a la vez, y la misma persona puede pulsar dos veces porque la red tardó. Con ese patrón, las dos aprobaciones pasan la comprobación y cada una crea su propio lote de tareas. Había un humano en el circuito, y el circuito tenía una carrera.

> Había un humano en el circuito, y el circuito tenía una carrera.

Ningún prompt arregla eso. Cuando el problema ocurre, el modelo ya terminó su trabajo.

Lo que lo arregló fue tratar la confirmación como una transición de estado con guardas. La confirmación es una sola transacción. Empieza con un cambio de estado condicional: la propuesta pasa a aprobada solo si sigue pendiente y no ha vencido. Si ese cambio afecta una fila, esta petición ganó. Si afecta cero, otra persona ya decidió o el plazo pasó, y la respuesta es un 409. En la misma transacción se reservan los números consecutivos de las tareas y se crean, con un índice único como última red. Queda todo o no queda nada. El detalle técnico está en [Las pruebas InMemory mienten sobre las transacciones](#blog/article/pruebas-inmemory-mienten-sobre-transacciones).

Lo segundo que aprendí es que la frontera sirve para más de un caso. Rechazar una propuesta y aprobar las demás acciones del agente usan esa misma transición, en un único método. Llevar la confirmación a ese camino cerró de paso una carrera de doble aprobación que estaba en el flujo general de aprobaciones del agente, más allá de las tareas.

De ahí sale mi objeción al botón: una persona que aprueba sobre una ruta de escritura mal construida decide tan poco como el modelo.

**El modelo**

El dibujo que uso tiene dos carriles.

![Dos columnas. A la izquierda, el carril del modelo: requisito escrito, modelo, validación de esquema y propuesta pendiente, con una marca que dice que ahí termina su autoridad. Una línea punteada lleva la propuesta a la columna derecha, el carril determinístico: una persona confirma, guardas de permiso, estado y plazo, commit todo o nada, registro de la decisión y, al final, los datos del producto.](figure/ai-proposes-lanes "Esquema conceptual, no datos medidos. El carril del modelo termina en la propuesta; solo el carril determinístico llega a los datos.")

El carril del modelo va del requisito a la propuesta, y ahí termina. En mi caso, lo que entra se trata como no confiable, lo que sale se valida contra un esquema y cada lote tiene un tope de tareas. Las herramientas que el modelo puede invocar se filtran por los permisos de quien pregunta, y si todo lo que pide está denegado, el sistema responde con una negativa sin llamar al modelo. Todo eso reduce el daño de una mala propuesta. Nada de eso escribe en el tablero.

La propuesta es un registro con estado propio: está pendiente, aprobada o rechazada, y tiene un plazo después del cual ya no se puede confirmar. Esa es la pieza que más cambia el diseño. Mientras la salida del modelo vive solo en la respuesta del chat, la única forma de usarla es ejecutarla. Cuando es un registro, se puede mostrar en dos sitios, puede quedarse esperando, la puede abrir más de una persona y vence.

El carril determinístico es el único que llega a los datos, y lo pienso en cuatro pasos. Una persona con permiso confirma. Las guardas comprueban lo que no depende de la opinión de nadie: que la propuesta siga pendiente, que no haya vencido, que quien confirma pueda hacerlo. El commit escribe todo o nada. Y la propuesta, con su estado final, queda como constancia de qué se propuso y qué se decidió.

Cada carril responde a una pregunta distinta. La persona responde si eso es lo que el equipo quiere. La transacción responde si se puede hacer y si deja los datos consistentes. Ninguna de las dos preguntas se la hago al modelo.

La consecuencia práctica es que el orden de trabajo se invierte. Antes de escribir el prompt defino qué forma tiene una propuesta, qué estados recorre, quién puede moverla y qué comprueba la transacción que la aplica. El prompt llega después, y llega con un contrato: tiene que producir algo que pase el esquema. Si mañana cambio de modelo, esa frontera no se mueve.

**Cómo aplicarlo**

**1. Lista lo que el modelo puede escribir hoy sin que nadie confirme**

Revisa las herramientas o funciones que tu asistente puede invocar y marca las que escriben: crear, enviar, borrar, cobrar, asignar. Para cada una, dos preguntas: si su efecto lo ve alguien más que quien lo pidió, y si se puede deshacer con un gesto. Las que lo vea alguien más y no se deshagan pasan a devolver una propuesta en lugar de ejecutar.

**2. Dale estados y plazo a la propuesta**

Pendiente, aprobada, rechazada, y una sola ruta para pasar de una a otra. El plazo importa más de lo que parece: una propuesta generada con los datos de la semana pasada y confirmada hoy aplica una decisión sobre un mundo que ya cambió.

**3. Ataca tu propio botón**

Abre la misma propuesta en dos pestañas y confirma en las dos lo más junto que puedas, o lanza dos peticiones a la vez. Después cuenta lo que quedó en la base de datos, no lo que respondió cada petición. Si hay dos lotes, tu paso de confirmación no decide. Solo retrasa.

**4. Mide si alguien lee**

Durante una semana, cuenta cuántas propuestas se confirman sin cambios, cuántas se rechazan y cuántas vencen, y cuánto tiempo pasa entre que una propuesta se muestra y se confirma. Si todas se confirman en dos segundos, hay dos lecturas posibles: un modelo excelente o un botón que nadie lee. Los números no las distinguen. Las distingue tomar diez propuestas confirmadas y repasarlas con quien las confirmó.

Para quien dirige, la pregunta de una revisión de diseño cabe en una línea: qué puede cambiar esta función sin una persona, y dónde queda escrito que lo cambió.

**Dónde puedo estar equivocado**

El punto débil más serio es el de la regla 4. Una confirmación que la gente pulsa sin leer no decide nada, y ese es el destino natural de cualquier diálogo que aparece muchas veces y casi siempre tiene razón. Mi diseño no lo evita. Lo que hace es acotar el daño: las guardas de la transacción no dependen de que alguien lea, así que una confirmación distraída puede crear tareas mal pensadas, pero no duplicadas, ni fuera de plazo. La pregunta de si eso era lo que el equipo quería se queda sin responder. De esa parte este ensayo no aporta datos: no reporta cuántas propuestas se rechazan en DevManager, así que no puede afirmar que la revisión humana esté ocurriendo; solo que está disponible.

Segundo, no todo necesita compuerta. Un borrador que la persona va a leer y enviar ella misma ya tiene su paso de decisión, que es el envío. Una búsqueda o un resumen no cambian nada. Ponerles confirmación enseña a pulsar sin leer, y eso contamina las confirmaciones que sí importan. La prueba que uso tiene dos preguntas: si el resultado cambia algo que otra persona u otro sistema va a dar por cierto, y si quien lo pidió puede deshacerlo solo. Si no cambia nada compartido, no hay compuerta. Si lo cambia pero se deshace con un gesto, quizá baste con poder deshacer. Si lo cambia y no se deshace, compuerta y transacción.

Tercero, el costo. Cada confirmación es fricción, y hay productos cuyo valor está en que el agente actúe solo sobre muchas cosas pequeñas. Ahí una confirmación por acción no escala, y a la persona habrá que ponerla en otro sitio: en una política aprobada una vez, en un límite, en un lote que se revisa por muestreo.

Y cuarto, el alcance de mi evidencia: un producto, mío, con un flujo de propuestas. La guía de OWASP que cito habla de seguridad, no de diseño de producto; la extensión es mía.

Lo que me llevo es una regla de orden: primero decido qué puede cambiar los datos y con qué guardas, y después escribo el prompt.`,
  contentEn: `In a product built on a language model, what the model returns should be a proposal: a record that can be read, corrected, rejected or left to expire, and that changes nothing by itself. What changes the data is a separate step, deterministic and with guards of its own: a person confirms, and a transaction checks, writes and leaves a record. My claim is that this boundary between proposing and deciding gets designed before the prompt does, because it is the only part of the system whose behavior I can guarantee.

The reason is quick to state. I can ask a model for things. I can require things of a transaction. A prompt that says not to create duplicate tasks is a request that is honored almost every time. A unique index is a rule that holds every time, or fails loudly. When the result touches data other people are going to rely on, I want the second kind of mechanism to have the last word.

**The common view**

The first usual position puts the effort into the model. If the assistant creates something it should not have, the answer is a better prompt, more examples, a different model, more safety instructions. That work is necessary: a bad proposal wastes time even if nobody confirms it. But it treats the model's authority as a quality problem, and assumes that with enough quality the model can write directly.

The second is human in the loop: before anything executes, a person approves. It is the standard recommendation and I agree with it. The OWASP guidance on [excessive agency](https://genai.owasp.org/llmrisk/llm062025-excessive-agency/) in applications built on language models describes the risk as damaging actions performed in response to "unexpected, ambiguous or manipulated" outputs from the model. Among its mitigations it asks for human approval of high-impact actions, and for authorization to live in the systems that receive the action rather than relying on the model to decide whether it is allowed.

Where I disagree is with how the second one usually gets built. "A person approves" turns into a button, and the button is treated as an interface detail. Hardly anyone designs it as what it is: the most delicate write path in the product.

**Why it fails**

I have a case of my own. DevManager is a multi-tenant SaaS that started as my degree project and that I keep building. It has a tasks module where the AI turns a requirement written in plain language into a batch of proposed tasks, and no task exists until a person reviews the proposal and confirms it. I used the same case in [AI Made Code Cheap. Your Tests Are Now the Bottleneck](#blog/article/con-ai-el-cuello-de-botella-son-tus-pruebas) to talk about testing. Here I care about something else: where the model's authority ends.

The first thing I learned is that adding the person does not make the step deterministic. The action approval that already existed in the project followed the usual pattern: read the record, check that it is pending, change the state, save. There is a window between the read and the save. A pending proposal shows up in the project panel and also in the chat card where it was generated. Two people with permission can open it at the same time, and one person can click twice because the network was slow. With that pattern both approvals pass the check and each one creates its own batch of tasks. There was a human in the loop, and the loop had a race.

> There was a human in the loop, and the loop had a race.

No prompt fixes that. By the time the problem happens, the model has finished its work.

What fixed it was treating confirmation as a guarded state transition. Confirmation is a single transaction. It opens with a conditional state change: the proposal becomes approved only if it is still pending and has not expired. If that change touches one row, this request won. If it touches zero, someone else already decided or the deadline passed, and the answer is a 409. The same transaction reserves the sequential task numbers and creates the tasks, with a unique index as the last safety net. Either all of it lands or none of it does. The technical detail is in [InMemory Tests Lie About Transactions](#blog/article/pruebas-inmemory-mienten-sobre-transacciones).

The second thing I learned is that the boundary serves more than one case. Rejecting a proposal and approving the agent's other actions use that same transition, in a single method. Moving confirmation onto that path also closed a double-approval race that sat in the agent's general approval flow, not just in tasks.

That is my objection to the button: a person approving over a badly built write path decides as little as the model does.

**The model**

The sketch I use has two lanes.

![Two columns. On the left, the model lane: written requirement, model, schema validation and a pending proposal, with a mark saying its authority ends there. A dashed line carries the proposal to the right column, the deterministic lane: a person confirms, guards on permission, state and expiry, an all-or-nothing commit, a record of the decision and, at the end, the product data.](figure/ai-proposes-lanes "Conceptual sketch, not measured data. The model lane ends at the proposal; only the deterministic lane reaches the data.")

The model lane runs from the requirement to the proposal, and stops. In my case the input is treated as untrusted, the output is validated against a schema, and every batch has a cap on the number of tasks. The tools the model can call are filtered by the permissions of whoever is asking, and if everything requested is denied, the system answers with a refusal without calling the model at all. All of that limits the damage a bad proposal can do. None of it writes to the board.

The proposal is a record with a state of its own: it is pending, approved or rejected, and it has a deadline after which it can no longer be confirmed. That is the piece that changes the design most. As long as the model's output lives only in the chat reply, the only way to use it is to execute it. Once it is a record, it can be shown in two places, it can sit and wait, more than one person can open it, and it expires.

The deterministic lane is the only one that reaches the data, and I think of it as four steps. A person with permission confirms. The guards check what does not depend on anyone's opinion: that the proposal is still pending, that it has not expired, that whoever is confirming is allowed to. The commit writes all or nothing. And the proposal, with its final state, stays as the record of what was proposed and what was decided.

Each lane answers a different question. The person answers whether this is what the team wants. The transaction answers whether it can be done and whether it leaves the data consistent. I ask the model neither.

The practical consequence is that the order of work flips. Before writing the prompt I define what a proposal looks like, which states it moves through, who can move it, and what the transaction that applies it checks. The prompt comes afterwards, and it comes with a contract: it has to produce something that passes the schema. If I switch models tomorrow, that boundary does not move.

**How to apply it**

**1. List what the model can write today with nobody confirming**

Go through the tools or functions your assistant can call and mark the ones that write: create, send, delete, charge, assign. For each one, two questions: does anyone other than the requester see its effect, and can it be undone in one gesture. The ones someone else sees and nobody can undo should return a proposal instead of executing.

**2. Give the proposal states and a deadline**

Pending, approved, rejected, and a single path from one to the next. The deadline matters more than it seems: a proposal generated from last week's data and confirmed today applies a decision to a world that has already changed.

**3. Attack your own button**

Open the same proposal in two tabs and confirm in both as close together as you can, or fire two requests at once. Then count what ended up in the database, not what each request answered. If there are two batches, your confirmation step does not decide. It only delays.

**4. Measure whether anyone reads**

For one week, count how many proposals are confirmed unchanged, how many are rejected and how many expire, and how long passes between a proposal being shown and being confirmed. If every one is confirmed within two seconds, there are two possible readings: an excellent model, or a button nobody reads. The numbers cannot tell them apart. What can is taking ten confirmed proposals and walking through them with the person who confirmed them.

For anyone running a team, the design-review question fits on one line: what can this feature change without a person, and where is it written down that it did.

**Where I could be wrong**

The most serious weak point is rule 4. A confirmation people click through without reading decides nothing, and that is where any dialog ends up if it appears often and is almost always right. My design does not prevent it. What it does is bound the damage: the transaction's guards do not depend on anyone reading, so a careless confirmation can create badly thought-out tasks, but not duplicated ones, and not past the deadline. Whether that was what the team wanted goes unanswered. This essay has no data on that part: it does not report how many proposals get rejected in DevManager, so it cannot claim that human review is happening rather than merely available.

Second, not everything needs a gate. A draft the person is going to read and send themselves already has its decision step, which is the sending. A search or a summary changes nothing. Putting a confirmation on those teaches people to click without reading, and that contaminates the confirmations that do matter. The test I use has two questions: does the result change something another person or another system will take as true, and can the requester undo it alone. If nothing shared changes, no gate. If it changes but one gesture undoes it, an undo may be enough. If it changes and cannot be undone, gate and transaction.

Third, cost. Every confirmation is friction, and some products are valuable precisely because the agent acts alone on many small things. There, one confirmation per action does not scale, and the person has to sit somewhere else: in a policy approved once, in a limit, in a batch reviewed by sampling.

And fourth, the reach of my evidence: one product, mine, with one proposal flow. The OWASP guidance I cite is about security, not product design; the extension is mine.

What I take from this is a rule about order: first I decide what can change the data and under which guards, and then I write the prompt.`,
  relatedIds: ['inmemory-tests-lie-about-transactions', 'ai-bottleneck-is-your-tests'],
}
