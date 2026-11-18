import type { BlogPost } from '../../types'

export const theHarnessDecides: Omit<BlogPost, 'readingTime'> = {
  id: 'the-harness-decides',
  slug: 'el-modelo-es-la-parte-facil-el-arnes-decide',
  series: 'Working with AI',
  seriesOrder: 1,
  title: 'Antes de cambiar de modelo, revisa las reglas y las comprobaciones que le pusiste a tu agente',
  titleEn: 'Before You Switch Models, Look at the Rules and Checks You Put Around Your Agent',
  date: '2026-11-17',
  tags: ['AI', 'agentes', 'proceso', 'verificación', 'liderazgo'],
  category: 'ensayo',
  featured: false,
  excerpt:
    'Cuando un agente de programación falla, lo primero que se piensa es cambiar de modelo. Cuento cuatro fallos de mi propio trabajo con agentes, y los cuatro se arreglaron cambiando algo alrededor del modelo. También propongo tres piezas que puedes añadir esta semana y dos preguntas para saber qué regla sobra.',
  excerptEn:
    'When a coding agent fails, the first thought is to switch models. I describe four failures from my own work with agents, and all four were fixed by changing something around the model. I also suggest three pieces you can add this week and two questions for telling which rule you can drop.',
  content: `Cuando un equipo empieza a trabajar con un agente de programación, lo primero que discute es qué modelo usar. Creo que esa es la parte fácil y la que menos decide. Lo que más decide el resultado es todo lo que rodea al modelo. A eso lo llamo arnés.

Uso la palabra en un sentido simple. El arnés es todo lo que rodea al modelo y que no es el modelo. Son las reglas que lee antes de escribir, los archivos y comandos que puede tocar, las comprobaciones que su trabajo tiene que pasar, las condiciones en las que debe parar y preguntar, y la forma en que se parte el trabajo. El modelo propone texto. El arnés decide qué parte de ese texto termina como un cambio aceptado.

Sostengo dos cosas. La primera es que, con el mismo modelo, un arnés distinto produce un resultado distinto, y creo que esa diferencia pesa más que la que hay entre dos modelos buenos. La segunda es que el modelo lo alquilas, y cambia cuando su fabricante lo decide. El arnés es la única parte que un equipo controla por completo.

**Lo que se suele pensar**

La opinión habitual es que la calidad viene del modelo. Sale una versión nueva, alguien compara resultados en un par de tareas, el equipo cambia de proveedor y espera que el trabajo mejore. Es una posición razonable. Los modelos sí son distintos, y uno mejor se equivoca menos. Además, comparar modelos es cómodo: otro publica las tablas, y elegir es una decisión de compra.

Lo otro no es cómodo. Tienes que escribir qué puede tocar un agente, qué tiene que demostrar antes de decir que terminó y cuándo debe detenerse. Es trabajo propio, no hay tabla que copiar, y se parece mucho a la burocracia. Por eso se deja para después.

Hay un dato que va contra esa comodidad, y viene de quienes construyen los modelos. En su guía [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents), el equipo de ingeniería de Anthropic cuenta que, al construir su agente para SWE-bench, dedicó más tiempo a las herramientas que al prompt: "we actually spent more time optimizing our tools than the overall prompt". El equipo que fabrica el modelo invirtió su tiempo en lo que lo rodea.

**Cuatro fallos que no eran del modelo**

Este sitio se construye con agentes, así que tengo casos propios. Cuento cuatro. En los cuatro, lo que hubo que arreglar estaba alrededor del modelo.

El primero es una comprobación que no podía fallar. El tema de periódico de este portafolio está protegido por [una puerta de píxeles](#blog/article/tdd-estricto-contra-driver-playwright-versionado). Es una comprobación que captura la página y la compara contra imágenes de referencia guardadas en el repositorio. Durante meses aprobó todo. Cuando las dos imágenes tenían alturas distintas, que es la señal más fuerte de que algo se movió, imprimía un conteo negativo de píxeles junto a "ALL PASSED". Cualquier agente que trabajara contra esa puerta recibía la misma respuesta, hiciera lo que hiciera. Para volver a creerle tuve que demostrar que podía fallar. Alargué un título a propósito y comprobé que se ponía en rojo, con 8.3 millones de píxeles distintos y solo en las capturas en español.

El segundo es un informe que parecía una verificación. Un agente cerró [una tarea de redacción](#blog/article/grep-redaccion-no-ve-camelcase) certificando que todos los fragmentos de código usaban identificadores inventados. Era falso. Lo di por bueno porque se leía como un control ya hecho. De ahí salió una regla: si una afirmación no trae su comando y su salida, cuenta como no verificada.

El tercero es una regla que no existía. La norma de confidencialidad de este blog figuraba en el índice de reglas del proyecto, pero el archivo al que apuntaba no estaba en el disco. Estuvo así durante todo un ciclo de trabajo. En el papel era la única barrera para ese riesgo. La escribí después, a partir de los fallos de ese mismo ciclo.

El cuarto es una advertencia que todos leyeron. En [otro proyecto](#blog/article/revision-adversarial-no-encontro-lo-que-el-usuario-si), once rondas de revisión pasaron por encima de un comentario honesto que decía que cierto comportamiento visual quedaba sin verificar. Nadie estaba obligado a hacer algo con él, y el defecto llegó intacto hasta el primer uso real.

Quizá un modelo mejor habría escrito menos certificaciones falsas. No lo sé, y sin arnés no tengo cómo saberlo. Una puerta que aprueba todo trata igual al mejor modelo y al peor. Un informe sin evidencia se lee igual de convincente, lo escriba quien lo escriba. El arnés limita al modelo, y también es el instrumento con el que lo mides. Si comparas modelos sin arnés, lo que comparas es qué tan bien redactan sus informes.

> Una puerta que aprueba todo trata igual al mejor modelo y al peor.

**Las cinco capas del arnés**

Lo dibujo como capas.

![Cinco rectángulos anidados alrededor de una caja pequeña rotulada modelo. De afuera hacia adentro: cómo se parte el trabajo, reglas que lee antes de escribir, archivos y comandos que puede tocar, comprobaciones que debe pasar, cuándo para y pregunta.](figure/harness-layers "Esquema conceptual, no datos medidos. Cinco capas que un equipo escribe, alrededor de la pieza que solo puede elegir.")

Cada capa responde una pregunta distinta, y lo que le falta a una no lo cubre otra. Las reglas le dicen al agente qué se espera, pero una regla no impide nada: mi norma de confidencialidad no existía y nada se quejó. La lista de lo que puede tocar limita el daño de un error. No dice si lo que el agente escribió ahí dentro es correcto. Las comprobaciones dicen si es correcto, siempre que puedan fallar. De eso trata [el ensayo sobre las pruebas como cuello de botella](#blog/article/con-ai-el-cuello-de-botella-son-tus-pruebas), y no lo repito aquí. Las condiciones de parada cubren lo que ninguna comprobación puede saber: que la pregunta estaba mal planteada, o que la decisión no le corresponde al agente. Y la forma de partir el trabajo decide cuánto puede salir mal de una sola vez.

Dibujé las proporciones a propósito. La caja del centro es la que se discute en las reuniones, y un equipo solo puede elegirla. Las cinco de afuera son archivos de texto y scripts que cualquier equipo puede editar hoy.

**Tres piezas que puedes añadir esta semana**

Propongo tres piezas. Las tres están en el repositorio de este sitio.

**1. Un documento por funcionalidad, que el agente lee antes de escribir**

Es un archivo de texto con cuatro partes: el pedido citado palabra por palabra, los requisitos numerados, las tareas con sus archivos y su commit, y una bitácora al final.

\`\`\`
## Specs
- S1: "<the request, word for word>"
## Tasks
- [x] T1 (S1) <what>. Files: <paths>. Commit <hash>.
## Log
- L1 (date, user, verbatim): "<the request>"
- L4 Result: <command> -> <observed output>
- L8 Not done: <what was left out, and why>
\`\`\`

La cita literal importa más de lo que parece. El documento de una mejora visual de este sitio conserva mi pedido con su error de tecleo incluido. Debajo anota lo que el agente tuvo que suponer. Una de esas suposiciones fue leer como aprobación una respuesta mía que no lo decía de forma expresa. Quedó marcada como suposición y aislada en un commit propio, para poder revertirla sola. Sin el documento, nadie habría podido distinguir esa suposición de una instrucción.

**2. La lista de archivos que puede tocar**

Cada tarea nombra sus archivos. Así, un cambio fuera de la lista se nota en el diff sin leer una línea de código, y varios agentes pueden trabajar a la vez. La tanda anterior de ensayos de este blog la redactaron cinco agentes en paralelo, cada uno con un archivo y un prefijo para sus figuras. El archivo compartido que registra los artículos tenía un solo dueño.

La lista también puede estar mal, y conviene esperarlo. Una especificación de este sitio enumeraba exactamente qué archivos se podían tocar. En otro requisito exigía algo que obligaba a editar cuatro archivos que no estaban en esa enumeración. La corrección se hizo por escrito, en la misma especificación. Cuando la lista y la tarea se contradicen, corrige la lista a la vista de todos.

**3. Una comprobación que se ejecuta y se reporta tal cual**

Para cerrar una tarea, el agente entrega el comando y lo que imprimió. En mis bitácoras se lee así: la prueba del tema de periódico, 8 de 8 con 0 píxeles distintos. El cierre lleva también una línea con lo que no se hizo. Esa línea cuesta casi nada y le dice a quien revisa dónde mirar.

A esto se le suma una condición de parada, que cuesta una frase. En este blog el agente propone los temas de los ensayos y espera a que yo elija antes de redactar. Y nunca publica: fusionar a la rama principal despliega el sitio, y esa decisión es mía.

**Dónde puedo estar equivocado**

Un arnés cuesta tiempo y puede volverse ceremonia. Una especificación de este sitio exigía cero errores del analizador de estilo. El repositorio, sin tocarlo, ya tenía quince, y estaban en archivos que la misma especificación prohibía modificar. Tal como estaba escrita, esa exigencia era imposible de cumplir. Hubo que cambiarla por una regla de no empeorar respecto a la base. Las reglas se acumulan, se escriben en momentos distintos y terminan contradiciéndose.

También es cierto que un modelo mejor vuelve innecesarias algunas reglas. Las que explican cómo hacer algo que el modelo nuevo ya hace bien solo estorban. La misma guía que cité recomienda añadir complejidad solo "when it demonstrably improves outcomes", es decir, cuando mejora los resultados de forma demostrable.

Para distinguir la regla que vale la pena de la que no, uso dos preguntas.

![Cuadrícula de dos por dos. Filas: si la regla nació de un fallo real. Columnas: si algo puede comprobarla. Con fallo y comprobable, se queda. Con fallo y sin comprobación, hay que volverla prueba. Sin fallo y comprobable, queda a prueba. Sin fallo y sin comprobación, se borra.](figure/harness-rule-test "Esquema conceptual, no datos medidos. Dos preguntas para decidir qué hacer con cada regla del arnés.")

La primera es si la regla nació de un fallo real que puedo nombrar. La de exigir comando y salida nació de una certificación falsa. La de aprobar solo con cero píxeles distintos nació de una puerta que dejaba pasar un cambio de 5,755 píxeles. La segunda es si hay algo que pueda comprobar que la regla se cumple.

Una regla con causa y con comprobación se queda. Una regla con causa y sin comprobación es como el comentario honesto de antes: se lee y se ignora, así que hay que convertirla en algo que falle. Una regla sin causa conocida, pero comprobable, queda a prueba. Si nunca bloquea nada, sobra. Una regla sin causa y sin comprobación es ceremonia, y se borra.

De ahí sale también qué hacer cuando cambia el modelo: quita una regla y mira si alguna comprobación se pone en rojo. Eso solo se puede hacer si la capa de comprobaciones ya existe, y es una razón más para construirla primero.

Queda el límite de mi evidencia. Es un sitio personal y unos pocos proyectos, con una sola persona decidiendo. No hice el experimento que probaría la tesis completa, que sería hacer el mismo trabajo con dos modelos y dos arneses. Tampoco puedo dar una cifra de cuánto pesa cada parte. Puede que en trabajo exploratorio, o en tareas de una tarde que nadie va a mantener, el arnés cueste más de lo que devuelve y el mejor modelo sea toda la respuesta. Lo que sí puedo afirmar es más estrecho: los cuatro fallos que conté se arreglaron cambiando algo alrededor del modelo.

El modelo lo eliges y lo pagas. El arnés tienes que escribirlo tú, y es lo único que sigue siendo tuyo cuando el modelo cambia.`,
  contentEn: `When a team starts working with a coding agent, the first thing it argues about is which model to use. I think that is the easy part, and the part that decides the least. What decides the outcome most is everything around the model. I call that the harness.

I use the word in a plain sense. The harness is everything around the model that is not the model. It is the rules the agent reads before it writes, the files and commands it is allowed to touch, the checks its work has to pass, the conditions under which it must stop and ask, and the way the work is split. The model proposes text. The harness decides how much of that text ends up as an accepted change.

I am claiming two things. The first is that, with the same model, a different harness gives you a different result, and I believe that difference outweighs the one between two good models. The second is that you rent the model, and it changes when its vendor says so. The harness is the only part a team fully controls.

**The common view**

The usual position is that quality comes from the model. A new version ships, someone compares results on a couple of tasks, the team switches provider and expects the work to improve. That is reasonable. Models do differ, and a better one makes fewer mistakes. Comparing models is also comfortable: somebody else publishes the tables, and choosing is a purchasing decision.

The other work is not comfortable. You have to write down what an agent may touch, what it has to demonstrate before it says it is done, and when it must stop. It is work you do yourself, there is no table to copy, and it looks a lot like bureaucracy. So it gets postponed.

One data point cuts against that comfort, and it comes from the people who build the models. In their guide [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents), Anthropic's engineering team says that while building their agent for SWE-bench, "we actually spent more time optimizing our tools than the overall prompt". The team that makes the model spent its time on what surrounds it.

**Four failures that were not the model's**

This site is built with agents, so I have cases of my own. I will describe four. In all four, the thing that needed fixing sat around the model.

The first is a check that could not fail. The newspaper theme of this portfolio is protected by [a pixel gate](#blog/article/tdd-estricto-contra-driver-playwright-versionado). It is a check that captures the page and compares it against reference images committed to the repository. For months it passed everything. When the two images had different heights, which is the strongest signal that something moved, it printed a negative pixel count next to "ALL PASSED". Any agent working against that gate got the same answer no matter what it did. To trust the gate again I had to show that it could fail. I lengthened a title on purpose and confirmed it went red, with 8.3 million differing pixels and only in the Spanish captures.

The second is a report that looked like verification. An agent closed [a writing task](#blog/article/grep-redaccion-no-ve-camelcase) by certifying that every code snippet used invented identifiers. That was false. I accepted it because it read like a check already done. One rule came out of it: if a claim does not come with its command and its output, it counts as unverified.

The third is a rule that did not exist. The confidentiality rule for this blog was listed in the project's index of rules, but the file it pointed to was not on disk. It stayed that way for a whole work cycle. On paper it was the only barrier against that risk. I wrote it afterwards, out of the failures of that same cycle.

The fourth is a warning everybody read. On [another project](#blog/article/revision-adversarial-no-encontro-lo-que-el-usuario-si), eleven rounds of review went past an honest comment saying that a certain piece of visual behaviour was unverified. Nobody was required to do anything about it, and the defect survived untouched until the first real use.

A better model might have written fewer false certifications. I do not know, and without a harness I have no way of knowing. A gate that passes everything treats the best model and the worst one alike. A report with no evidence reads just as convincing whoever wrote it. The harness constrains the model, and it is also the instrument you measure the model with. If you compare models without one, what you are comparing is how well they write their reports.

> A gate that passes everything treats the best model and the worst one alike.

**The five layers of the harness**

I draw it as layers.

![Five nested rectangles around a small box labelled model. From the outside in: how the work is split, rules it reads before writing, files and commands it may touch, checks its work must pass, when it stops and asks.](figure/harness-layers "Conceptual sketch, not measured data. Five layers a team writes, around the one piece it can only choose.")

Each layer answers a different question, and what one layer lacks is not covered by another. Rules tell the agent what is expected, but a rule prevents nothing: my confidentiality rule did not exist and nothing complained. The list of what it may touch limits the damage of a mistake. It says nothing about whether what the agent wrote inside that list is correct. Checks say whether it is correct, provided they can fail. That is the subject of [the essay on tests as the bottleneck](#blog/article/con-ai-el-cuello-de-botella-son-tus-pruebas), and I will not argue it again here. Stop conditions cover what no check can know: that the question was badly posed, or that the decision is not the agent's to make. And the way the work is split decides how much can go wrong in one go.

I drew the proportions on purpose. The box in the middle is the one that gets discussed in meetings, and a team can only choose it. The five around it are text files and scripts any team can edit today.

**Three pieces you can add this week**

I suggest three pieces. All three are in this site's repository.

**1. One document per feature, which the agent reads before it writes**

It is a text file with four parts: the request quoted word for word, numbered requirements, tasks with their files and their commit, and a log at the end.

\`\`\`
## Specs
- S1: "<the request, word for word>"
## Tasks
- [x] T1 (S1) <what>. Files: <paths>. Commit <hash>.
## Log
- L1 (date, user, verbatim): "<the request>"
- L4 Result: <command> -> <observed output>
- L8 Not done: <what was left out, and why>
\`\`\`

The verbatim quote matters more than it seems. The document for a visual improvement to this site keeps my request with its typo intact. Below it, the document records what the agent had to assume. One of those assumptions was reading a reply of mine as approval when it did not say so outright. It was labelled as an assumption and isolated in its own commit, so it could be reverted alone. Without the document, nobody could have told that assumption apart from an instruction.

**2. The list of files it may touch**

Every task names its files. That way a change outside the list shows up in the diff before you read a line of code, and several agents can work at once. The previous batch of essays on this blog was drafted by five agents in parallel, each with one file and one prefix for its figures. The shared file that registers the posts had a single owner.

The list can also be wrong, and you should expect that. A specification for this site enumerated exactly which files could be touched. In another requirement it demanded something that forced edits to four files outside that enumeration. The correction was made in writing, in the same specification. When the list and the task contradict each other, fix the list where everyone can see it.

**3. A check that is run and reported as is**

To close a task, the agent hands over the command and what it printed. In my logs it reads like this: the newspaper theme test, 8 of 8 with 0 differing pixels. The closing note also carries one line for what was not done. That line costs almost nothing and tells the reviewer where to look.

Add a stop condition to that, which costs one sentence. On this blog the agent proposes essay topics and waits for me to pick one before drafting. And it never publishes: merging to the main branch deploys the site, and that decision is mine.

**Where I could be wrong**

A harness costs time and can turn into ceremony. A specification for this site demanded zero linter errors. The untouched repository already had fifteen, and they were in files the same specification forbade changing. As written, that requirement could not be met. It had to be replaced with a rule of not getting worse than the baseline. Rules pile up, get written at different moments, and end up contradicting each other.

It is also true that a better model makes some rules unnecessary. The ones that explain how to do something the new model already does well only get in the way. The same guide I quoted recommends adding complexity only "when it demonstrably improves outcomes".

To tell a rule that is worth keeping from one that is not, I ask two questions.

![Two-by-two grid. Rows: whether the rule came from a real failure. Columns: whether something can check it. From a failure and checkable, keep it. From a failure with no check, make it a check. No failure but checkable, on probation. No failure and no check, delete it.](figure/harness-rule-test "Conceptual sketch, not measured data. Two questions for deciding what to do with each rule in the harness.")

The first is whether the rule came from a real failure I can name. The rule demanding a command and its output came from a false certification. The rule of passing only at zero differing pixels came from a gate that let a 5,755-pixel change through. The second is whether something can check that the rule is being followed.

A rule with a cause and a check stays. A rule with a cause and no check is like the honest comment from earlier: it gets read and then ignored, so it has to be turned into something that fails. A rule with no known cause that can still be checked goes on probation. If it never blocks anything, it goes. A rule with no cause and no check is ceremony, and gets deleted.

That also tells you what to do when the model changes: remove a rule and see whether any check goes red. You can only do that if the layer of checks already exists, which is one more reason to build it first.

Then there is the limit of my evidence. It is a personal site and a handful of projects, with one person making the calls. I have not run the experiment that would prove the whole claim, which would be doing the same work with two models and two harnesses. I cannot give a figure for how much each part weighs either. It may be that in exploratory work, or in an afternoon task nobody will maintain, the harness costs more than it returns and the best model is the whole answer. What I can say is narrower: the four failures I described were fixed by changing something around the model.

You choose the model and you pay for it. The harness you have to write yourself, and it is the only thing that is still yours when the model changes.`,
  relatedIds: [
    'strict-tdd-committed-playwright-driver',
    'redaction-grep-misses-camelcase',
    'adversarial-review-missed-user-defects',
  ],
}
