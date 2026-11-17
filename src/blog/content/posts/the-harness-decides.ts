import type { BlogPost } from '../../types'

export const theHarnessDecides: Omit<BlogPost, 'readingTime'> = {
  id: 'the-harness-decides',
  slug: 'el-modelo-es-la-parte-facil-el-arnes-decide',
  title: 'El modelo es la parte fácil: el arnés decide el resultado',
  titleEn: 'The Model Is the Easy Part. The Harness Decides What You Get',
  date: '2026-11-17',
  tags: ['AI', 'agentes', 'proceso', 'verificación', 'liderazgo'],
  category: 'ensayo',
  featured: false,
  excerpt:
    'Con un agente de programación, el resultado depende menos del modelo que del arnés que lo rodea: las reglas que lee, lo que puede tocar, cómo se comprueba su trabajo, cuándo debe parar y cómo se parte la tarea. Cuatro fallos de mi propio trabajo con agentes, todos arreglados cambiando algo alrededor del modelo, tres piezas que se pueden añadir esta semana y dos preguntas para saber qué regla sobra.',
  excerptEn:
    'With a coding agent, the outcome depends less on the model than on the harness around it: the rules it reads, what it may touch, how its work is checked, when it has to stop, and how the task is split. Four failures from my own work with agents, all fixed by changing something around the model, three pieces you can add this week, and two questions for telling which rule is dead weight.',
  content: `Cuando un equipo empieza a trabajar con un agente de programación, la primera discusión es qué modelo usar. Creo que esa es la parte fácil y la que menos decide. Lo que decide el resultado es el arnés.

Uso la palabra en un sentido simple. El arnés es todo lo que rodea al modelo y no es el modelo: las reglas que lee antes de escribir, los archivos y comandos que puede tocar, las comprobaciones que su trabajo tiene que pasar, las condiciones en las que debe parar y preguntar, y la forma en que se parte el trabajo. El modelo propone texto. El arnés decide qué parte de ese texto llega a ser un cambio aceptado.

Mi tesis tiene dos mitades. La primera: con el mismo modelo, un arnés distinto produce un resultado distinto, y sostengo que esa diferencia pesa más que la que hay entre dos modelos buenos. La segunda: el modelo se alquila y cambia cuando su fabricante lo decide, mientras que el arnés es la única parte que un equipo controla por completo.

**Lo que se suele pensar**

La opinión habitual es que la calidad viene del modelo. Sale una versión nueva, se comparan resultados en un par de tareas, se cambia de proveedor y se espera que el trabajo mejore. Es una posición razonable: los modelos sí son distintos, y uno mejor se equivoca menos. Además, comparar modelos es cómodo. Otro publica las tablas, y elegir es una decisión de compra.

Lo otro no es cómodo. Escribir qué puede tocar un agente, qué tiene que demostrar antes de decir que terminó y cuándo debe detenerse es trabajo propio, sin tabla que copiar, y se parece mucho a la burocracia. Por eso se deja para después.

Hay un dato de quienes construyen los modelos que va contra esa comodidad. En su guía [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents), el equipo de ingeniería de Anthropic cuenta que, al construir su agente para SWE-bench, dedicó más tiempo a las herramientas que al prompt: "we actually spent more time optimizing our tools than the overall prompt". Quien tiene el modelo en casa invirtió su tiempo en lo que lo rodea.

**Por qué falla**

Este sitio se construye con agentes, así que tengo casos propios. En los cuatro que cuento, lo que hubo que arreglar estaba alrededor del modelo.

El primero es una comprobación que no podía fallar. El tema de periódico de este portafolio está protegido por [una puerta de píxeles](#blog/article/tdd-estricto-contra-driver-playwright-versionado): captura la página y la compara contra imágenes de referencia guardadas en el repositorio. Durante meses aprobó todo. Cuando las dos imágenes tenían alturas distintas, que es la señal más fuerte de que algo se movió, imprimía un conteo negativo de píxeles junto a "ALL PASSED". Cualquier agente que trabajara contra esa puerta recibía la misma respuesta, hiciera lo que hiciera. Para volver a creerle tuve que demostrar que podía fallar: alargué un título a propósito y comprobé que se ponía en rojo, con 8.3 millones de píxeles distintos y solo en las capturas en español.

El segundo es un informe que se parecía a una verificación. Un agente cerró [una tarea de redacción](#blog/article/grep-redaccion-no-ve-camelcase) certificando que todos los fragmentos de código usaban identificadores inventados. Era falso, y lo di por bueno porque se leía como un control ya hecho. De ahí salió una regla: una afirmación que no trae su comando y su salida cuenta como no verificada.

El tercero es una regla que no existía. La norma de confidencialidad de este blog figuraba en el índice de reglas del proyecto, y el archivo al que apuntaba no estaba en el disco. Estuvo así durante todo un ciclo de trabajo. En el papel era la única barrera para ese riesgo. La escribí después, a partir de los fallos de ese mismo ciclo.

El cuarto es una advertencia que todos leyeron. En [otro proyecto](#blog/article/revision-adversarial-no-encontro-lo-que-el-usuario-si), once rondas de revisión pasaron por encima de un comentario honesto que decía que cierto comportamiento visual quedaba sin verificar. Nadie estaba obligado a actuar sobre él, y el defecto llegó intacto hasta el primer uso real.

Un modelo mejor quizá habría escrito menos certificaciones falsas. No lo sé, y ahí está el punto: sin arnés no tengo cómo saberlo. Una puerta que aprueba todo trata igual al mejor modelo y al peor. Un informe sin evidencia se lee igual de convincente venga de donde venga. El arnés limita al modelo y además es el instrumento con el que se lo mide. Quien compara modelos sin él está comparando la prosa de sus informes.

> Una puerta que aprueba todo trata igual al mejor modelo y al peor.

**El esquema**

Lo dibujo como capas.

![Cinco rectángulos anidados alrededor de una caja pequeña rotulada modelo. De afuera hacia adentro: cómo se parte el trabajo, reglas que lee antes de escribir, archivos y comandos que puede tocar, comprobaciones que debe pasar, cuándo para y pregunta.](blog/figures/harness-layers-es.svg "Esquema conceptual, no datos medidos. Cinco capas que un equipo escribe, alrededor de la pieza que solo puede elegir.")

Cada capa responde una pregunta distinta, y el hueco de una no lo tapa otra. Las reglas le dicen al agente qué se espera, pero una regla no impide nada: mi norma de confidencialidad no existía y nada se quejó. La lista de lo que puede tocar limita el daño de un error, y no dice si lo que se escribió dentro es correcto. Las comprobaciones dicen si es correcto, siempre que puedan fallar; de eso trata [Con AI, el cuello de botella son tus pruebas, no tu código](#blog/article/con-ai-el-cuello-de-botella-son-tus-pruebas) y no lo repito aquí. Las condiciones de parada cubren lo que ninguna comprobación puede saber: que la pregunta estaba mal planteada, o que la decisión no le corresponde al agente. Y la partición del trabajo decide cuánto puede salir mal de una sola vez.

El dibujo tiene una proporción deliberada. La caja del centro es la que se discute en las reuniones y la que un equipo solo puede elegir. Las cinco de afuera son archivos de texto y scripts que cualquier equipo puede editar hoy.

**Cómo aplicarlo**

Propongo tres piezas que se pueden añadir esta semana. Las tres están en el repositorio de este sitio.

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

La cita literal importa más de lo que parece. El documento de una mejora visual de este sitio conserva mi pedido con su error de tecleo incluido, y debajo anota lo que el agente tuvo que suponer. Una de esas suposiciones fue leer como aprobación una respuesta mía que no lo decía de forma expresa. Quedó marcada como suposición y aislada en un commit propio, para poder revertirla sola. Sin el documento, esa suposición no se habría podido distinguir de una instrucción.

**2. La lista de archivos que puede tocar**

Cada tarea nombra sus archivos. Con eso, un cambio fuera de la lista se nota en el diff sin leer una línea de código, y varios agentes pueden trabajar a la vez. La tanda anterior de ensayos de este blog la redactaron cinco agentes en paralelo, cada uno con un archivo y un prefijo para sus figuras. El archivo compartido que registra los artículos tenía un solo dueño.

La lista también puede estar mal, y conviene esperarlo. Una especificación de este sitio enumeraba exactamente qué archivos se podían tocar y, en otro requisito, exigía algo que obligaba a editar cuatro que no estaban en esa enumeración. La corrección se hizo por escrito, en la misma especificación. Cuando la lista y la tarea se contradicen, se corrige la lista a la vista.

**3. Una comprobación que se ejecuta y se reporta tal cual**

El cierre de una tarea lleva el comando y lo que imprimió. En mis bitácoras se lee así: la prueba del tema de periódico, 8 de 8 con 0 píxeles distintos. Lleva también una línea con lo que no se hizo. Esa línea cuesta casi nada y le dice a quien revisa dónde mirar.

A esto se le suma una condición de parada, que cuesta una frase. En este blog el agente propone los temas de los ensayos y espera mi elección antes de redactar. Y nunca publica: fusionar a la rama principal despliega el sitio, y esa decisión es mía.

**Dónde puedo estar equivocado**

Un arnés cuesta tiempo y puede volverse ceremonia. Una especificación de este sitio exigía cero errores del analizador de estilo, y el repositorio sin tocar ya tenía quince, en archivos que la misma especificación prohibía modificar. La puerta era imposible de cumplir tal como estaba escrita, y hubo que cambiarla por una regla de no empeorar respecto a la base. Las reglas se acumulan, se escriben en momentos distintos y terminan contradiciéndose.

También es cierto que un modelo mejor vuelve innecesarias algunas reglas. Las que explican cómo hacer algo que el modelo nuevo ya hace bien son peso muerto. La misma guía que cité recomienda añadir complejidad solo "when it demonstrably improves outcomes", cuando mejora los resultados de forma demostrable.

Para distinguir la regla que se gana su lugar de la que no, uso dos preguntas.

![Cuadrícula de dos por dos. Filas: si la regla nació de un fallo real. Columnas: si algo puede comprobarla. Con fallo y comprobable, se queda. Con fallo y sin comprobación, hay que volverla prueba. Sin fallo y comprobable, queda a prueba. Sin fallo y sin comprobación, se borra.](figure/harness-rule-test "Esquema conceptual, no datos medidos. Dos preguntas para decidir qué hacer con cada regla del arnés.")

La primera: ¿nació de un fallo real que puedo nombrar? La de exigir comando y salida nació de una certificación falsa. La de aprobar solo con cero píxeles distintos nació de una puerta que dejaba pasar un cambio de 5,755 píxeles. La segunda: ¿hay algo que pueda comprobar que se cumple?

Una regla con causa y con comprobación se queda. Una regla con causa y sin comprobación es el comentario honesto de antes: se lee y se ignora, así que hay que convertirla en algo que falle. Una regla sin causa conocida, pero comprobable, queda a prueba, y si nunca bloquea nada, sobra. Una regla sin causa y sin comprobación es ceremonia, y se borra.

De ahí sale también el procedimiento para cuando cambia el modelo: quitar una regla y mirar si alguna comprobación se pone en rojo. Eso solo se puede hacer con la capa de comprobaciones en pie, y es una razón más para construirla primero.

Queda el límite de mi evidencia. Es un sitio personal y unos pocos proyectos, con una sola persona decidiendo. No hice el experimento que probaría la tesis completa, que sería el mismo trabajo con dos modelos y dos arneses, y no puedo dar una cifra de cuánto pesa cada parte. Puede que en trabajo exploratorio, o en tareas de una tarde que nadie va a mantener, el arnés cueste más de lo que devuelve y el mejor modelo sea toda la respuesta. Lo que sí puedo afirmar es más estrecho: los cuatro fallos que conté se arreglaron cambiando algo alrededor del modelo.

Elegir el modelo es una compra. El arnés hay que escribirlo, y es lo único que sigue siendo tuyo cuando el modelo cambia.`,
  contentEn: `When a team starts working with a coding agent, the first argument is about which model to use. I think that is the easy part, and the part that decides the least. What decides the outcome is the harness.

I use the word in a plain sense. The harness is everything around the model that is not the model: the rules it reads before it writes, the files and commands it is allowed to touch, the checks its work has to pass, the conditions under which it must stop and ask, and the way the work is split. The model proposes text. The harness decides how much of that text becomes an accepted change.

My claim has two halves. First: with the same model, a different harness gives you a different result, and I hold that this difference outweighs the one between two good models. Second: the model is rented and changes when its vendor says so, while the harness is the only part a team fully controls.

**The common view**

The usual position is that quality comes from the model. A new version ships, someone compares results on a couple of tasks, the team switches provider and expects the work to improve. That is reasonable: models do differ, and a better one makes fewer mistakes. Comparing models is also comfortable. Somebody else publishes the tables, and choosing is a purchasing decision.

The other work is not comfortable. Writing down what an agent may touch, what it has to demonstrate before it says it is done, and when it must stop is work you do yourself, with no table to copy, and it looks a lot like bureaucracy. So it gets postponed.

One data point from the people who build the models cuts against that comfort. In their guide [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents), Anthropic's engineering team says that while building their agent for SWE-bench, "we actually spent more time optimizing our tools than the overall prompt". The people with the model in-house spent their time on what surrounds it.

**Why it fails**

This site is built with agents, so I have cases of my own. In all four I describe here, the thing that needed fixing sat around the model.

The first is a check that could not fail. The newspaper theme of this portfolio is protected by [a pixel gate](#blog/article/tdd-estricto-contra-driver-playwright-versionado): it captures the page and compares it against reference images committed to the repository. For months it passed everything. When the two images had different heights, which is the strongest signal that something moved, it printed a negative pixel count next to "ALL PASSED". Any agent working against that gate got the same answer no matter what it did. To trust the gate again I had to show that it could fail: I lengthened a title on purpose and confirmed it went red, with 8.3 million differing pixels and only in the Spanish captures.

The second is a report that looked like verification. An agent closed [a writing task](#blog/article/grep-redaccion-no-ve-camelcase) by certifying that every code snippet used invented identifiers. That was false, and I accepted it because it read like a check already done. One rule came out of it: a claim that does not come with its command and its output counts as unverified.

The third is a rule that did not exist. The confidentiality rule for this blog was listed in the project's index of rules, and the file it pointed to was not on disk. It stayed that way for a whole work cycle. On paper it was the only barrier against that risk. I wrote it afterwards, out of the failures of that same cycle.

The fourth is a warning everybody read. On [another project](#blog/article/revision-adversarial-no-encontro-lo-que-el-usuario-si), eleven rounds of review went past an honest comment saying that a certain piece of visual behaviour was unverified. Nobody was required to act on it, and the defect survived untouched until the first real use.

A better model might have written fewer false certifications. I do not know, and that is the point: without a harness I have no way of knowing. A gate that passes everything treats the best model and the worst one alike. A report with no evidence reads just as convincing whoever wrote it. The harness constrains the model, and it is also the instrument you measure the model with. Compare models without one and you are comparing the prose of their reports.

> A gate that passes everything treats the best model and the worst one alike.

**The picture**

I draw it as layers.

![Five nested rectangles around a small box labelled model. From the outside in: how the work is split, rules it reads before writing, files and commands it may touch, checks its work must pass, when it stops and asks.](blog/figures/harness-layers-en.svg "Conceptual sketch, not measured data. Five layers a team writes, around the one piece it can only choose.")

Each layer answers a different question, and a hole in one is not covered by another. Rules tell the agent what is expected, but a rule prevents nothing: my confidentiality rule did not exist and nothing complained. The list of what it may touch limits the damage of a mistake, and says nothing about whether what was written inside it is correct. Checks say whether it is correct, provided they can fail; that is the subject of [AI Made Code Cheap. Your Tests Are Now the Bottleneck](#blog/article/con-ai-el-cuello-de-botella-son-tus-pruebas) and I will not argue it again here. Stop conditions cover what no check can know: that the question was badly posed, or that the decision is not the agent's to make. And the way the work is split decides how much can go wrong in one go.

The proportions in the sketch are deliberate. The box in the middle is the one that gets discussed in meetings, and the one a team can only choose. The five around it are text files and scripts any team can edit today.

**How to apply it**

Here are three pieces you could add this week. All three are in this site's repository.

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

The verbatim quote matters more than it seems. The document for a visual improvement to this site keeps my request with its typo intact, and below it records what the agent had to assume. One of those assumptions was reading a reply of mine as approval when it did not say so outright. It was labelled as an assumption and isolated in its own commit, so it could be reverted alone. Without the document, that assumption would have been impossible to tell apart from an instruction.

**2. The list of files it may touch**

Every task names its files. With that, a change outside the list shows up in the diff before you read a line of code, and several agents can work at once. The previous batch of essays on this blog was drafted by five agents in parallel, each with one file and one prefix for its figures. The shared file that registers the posts had a single owner.

The list can also be wrong, and you should expect that. A specification for this site enumerated exactly which files could be touched and, in another requirement, demanded something that forced edits to four files outside that enumeration. The correction was made in writing, in the same specification. When the list and the task contradict each other, fix the list in plain view.

**3. A check that is run and reported as is**

Closing a task means giving the command and what it printed. In my logs it reads like this: the newspaper theme test, 8 of 8 with 0 differing pixels. It also carries one line for what was not done. That line costs almost nothing and tells the reviewer where to look.

Add a stop condition to that, which costs one sentence. On this blog the agent proposes essay topics and waits for my pick before drafting. And it never publishes: merging to the main branch deploys the site, and that decision is mine.

**Where I could be wrong**

A harness costs time and can turn into ceremony. A specification for this site demanded zero linter errors, and the untouched repository already had fifteen, in files the same specification forbade changing. The gate could not be satisfied as written, and it had to be replaced with a rule of not getting worse than the baseline. Rules pile up, get written at different moments, and end up contradicting each other.

It is also true that a better model makes some rules unnecessary. The ones that explain how to do something the new model already does well are dead weight. The same guide I quoted recommends adding complexity only "when it demonstrably improves outcomes".

To tell a rule that earns its place from one that does not, I ask two questions.

![Two-by-two grid. Rows: whether the rule came from a real failure. Columns: whether something can check it. From a failure and checkable, keep it. From a failure with no check, make it a check. No failure but checkable, on probation. No failure and no check, delete it.](figure/harness-rule-test "Conceptual sketch, not measured data. Two questions for deciding what to do with each rule in the harness.")

The first: did it come from a real failure I can name? The rule demanding a command and its output came from a false certification. The rule of passing only at zero differing pixels came from a gate that let a 5,755-pixel change through. The second: is there something that can check it is being followed?

A rule with a cause and a check stays. A rule with a cause and no check is the honest comment from earlier: it gets read and then ignored, so it has to be turned into something that fails. A rule with no known cause that can still be checked goes on probation, and if it never blocks anything, it goes. A rule with no cause and no check is ceremony, and gets deleted.

That also gives you the procedure for when the model changes: remove a rule and see whether any check goes red. You can only do that with the layer of checks standing, which is one more reason to build it first.

Then there is the limit of my evidence. It is a personal site and a handful of projects, with one person making the calls. I have not run the experiment that would prove the whole claim, the same work with two models and two harnesses, and I cannot give a figure for how much each part weighs. It may be that in exploratory work, or in an afternoon task nobody will maintain, the harness costs more than it returns and the best model is the whole answer. What I can say is narrower: the four failures I described were fixed by changing something around the model.

Choosing the model is a purchase. The harness has to be written, and it is the only thing that is still yours when the model changes.`,
  relatedIds: [
    'strict-tdd-committed-playwright-driver',
    'redaction-grep-misses-camelcase',
    'adversarial-review-missed-user-defects',
  ],
}
