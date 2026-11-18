import type { BlogPost } from '../../types'

export const agentMemoryIsCuration: Omit<BlogPost, 'readingTime'> = {
  id: 'agent-memory-is-curation',
  slug: 'la-memoria-de-un-agente-es-curaduria',
  series: 'Working with AI',
  seriesOrder: 5,
  title: 'Revisé 56 notas de la memoria de mis agentes y todas figuraban como activas, incluso una que decía estar reemplazada',
  titleEn: 'I Checked 56 Notes in My Agents\' Memory and Every One Was Listed as Active, Even One That Said It Had Been Replaced',
  date: '2026-11-17',
  tags: ['AI', 'agentes', 'memoria', 'decisiones'],
  category: 'ensayo',
  featured: false,
  excerpt:
    'Es fácil darle a un agente notas que duran de una sesión a otra. Lo que cuesta es que sigan siendo ciertas. Revisé 56 notas de mi propia memoria de agentes y todas figuran como activas, y cada corrección que encontré la escribió alguien a mano. Cuento cuatro prácticas para guardar menos y desconfiar de las notas viejas, y lo que mi muestra no alcanza a probar.',
  excerptEn:
    'It is easy to give an agent notes that last from one session to the next. Keeping them true takes work. I checked 56 notes from my own agent memory and every one is listed as active, and every correction I found was written by hand. I describe four practices for storing less and distrusting old notes, and what my sample cannot prove.',
  content: `Darle memoria a un agente de código es fácil. El trabajo está en que esa memoria siga sirviendo. Para eso hay que decidir qué merece guardarse, notar cuándo una nota dejó de ser cierta y devolverle al agente pocas notas. Guardar, que es donde suele ponerse la atención, queda resuelto el primer día. Y una memoria que lo guarda todo hace que el agente repita decisiones viejas con total seguridad.

Antes aclaro qué quiero decir con memoria. No hablo de lo que el modelo aprendió al entrenarse. Tampoco hablo de la conversación en curso, que desaparece cuando se cierra. Hablo de notas: textos que el agente escribe durante una sesión de trabajo y que otra sesión, días o meses después, busca y lee antes de actuar. Puede ser una decisión con su razón, un defecto y cómo se corrigió, una convención del proyecto o el resumen de lo que quedó pendiente. Trabajo con un sistema así, Engram, compartido entre mis proyectos. Lo que sigue sale de mirar sus registros.

**Lo que se suele pensar**

La idea habitual es que el agente falla porque olvida. Cada sesión empieza de cero, vuelve a preguntar lo que ya se le explicó y repite el error de la semana pasada. La solución parece obvia: que lo guarde todo y que una buena búsqueda encuentre lo que hace falta. Guardar texto es barato, así que el diseño se concentra en capturar más y en buscar mejor.

Comparto la mitad. Un agente sin memoria sale caro, y en este mismo repositorio hay una regla que lo reconoce. La instrucción con la que un agente investiga material para este blog le ordena buscar siempre primero en la memoria y solo después ampliar a otros proyectos. Lo que no comparto es la suposición que viene detrás: que una nota sigue siendo cierta porque sigue guardada.

**Qué encontré al revisar mis notas**

Para este ensayo revisé la memoria misma, con un agente haciendo las búsquedas. El sistema informa 2,935 notas en 306 sesiones y 22 proyectos. No las leí todas. Tomé una muestra con tres búsquedas. Una fue en este proyecto, por la palabra memory. Las otras dos fueron en todos los proyectos, con palabras como vencido, reemplazado, corregido y duplicado, en inglés y en español. Cada búsqueda devuelve como máximo 20 resultados. Salieron 56 notas distintas, y las conté a mano por tipo.

![Gráfico de barras horizontales con los tipos de 56 notas: architecture 24, session_summary 10, decision 7, discovery 6, bugfix 4, pattern 2, config 2, feedback 1.](figure/agent-memory-sample-types "Tipos de las 56 notas distintas que devolvieron tres búsquedas en mi memoria de agentes, contadas a mano el 17 de noviembre de 2026. Es una muestra, no el total.")

Lo primero que se ve en la muestra es de qué está hecha la memoria. De las 24 notas con la etiqueta architecture, 20 son documentos de trabajo de un cambio concreto: especificaciones, diseños, listas de tareas, informes de verificación. Otras 10 son resúmenes de sesión. Las decisiones son 7. Es decir, 30 de 56 son papeles de un trabajo que tuvo principio y fin. Dejan de ser útiles cuando ese trabajo termina, aunque la nota siga ahí.

Lo segundo es que ninguna caduca. Las 56 figuran con estado activo. Una de ellas lleva en su propio título la palabra superseded, que significa reemplazada, y también figura activa. Es una nota de este portafolio, escrita en mayo. Afirmaba que el proyecto no tenía cómo ejecutar pruebas y que el modo de escribir la prueba primero estaba desactivado. En agosto el proyecto ya trabajaba con [un driver de Playwright versionado](#blog/article/tdd-estricto-contra-driver-playwright-versionado) y con la prueba primero. Un agente reescribió la nota para decir que no se confiara en ella y a cuál ir. El sistema no lo habría notado por su cuenta. La búsqueda devuelve una nota falsa con el mismo aspecto que una cierta.

Lo tercero es que las contradicciones se resuelven a mano. En otro proyecto, dos notas decían que cierto modo de trabajo estaba desactivado y un archivo de configuración versionado decía lo contrario. La nota que lo resolvió dejó la regla por escrito: gana el archivo, porque está bajo control de versiones, y las notas eran la observación de una sola corrida. El sistema tiene un mecanismo que compara cada nota nueva con las parecidas y registra un veredicto. En mi muestra hay 17 veredictos: 8 dicen relacionada, 6 sin conflicto y 3 compatible. Ninguno dice que una nota reemplaza a otra. Todos los reemplazos que encontré están escritos en prosa, dentro de la nota, por quien se dio cuenta.

Lo cuarto es que una nota puede nacer equivocada. Encontré dos que empiezan por su propia corrección. Una afirmaba que cierto valor de configuración nunca llegaría a instalarse. Era falso, porque otra sección del mismo script lo instalaba. La afirmación había salido de leer dos archivos y razonar, sin buscar en el archivo completo. La otra registraba como posible incidente la desaparición de un archivo durante el trabajo de un agente. El archivo lo había borrado yo. De los 20 resultados de la búsqueda con palabras como corregido, 7 abren declarando que reemplazan o corrigen un registro anterior. Esa búsqueda iba por ellas, así que el 7 no es una tasa. Dice que existen y que alguien tuvo que escribirlas.

Lo quinto es que guardar también puede destruir. En una sesión larga, un agente guardó siete notas distintas bajo la misma clave de tema. En este sistema una clave repetida sobrescribe, y solo la última quedó al alcance de la búsqueda. La nota que cuenta el caso lo resume así.

> Creía tener siete memorias y tenía una.

**Los cuatro estados de una nota**

Pienso cada nota como algo que pasa por cuatro estados.

![Cuatro estados en columna unidos por flechas: escrita, recordada, vencida y reemplazada. El estado vencida está resaltado y dice que nada la marca y sigue activa.](figure/agent-memory-lifecycle "Esquema conceptual, no datos medidos. Guardar cubre el primer estado y buscar cubre el segundo. Los otros dos dependen de que alguien los escriba.")

Escrita, recordada, vencida, reemplazada. Guardar se ocupa del primer estado y buscar se ocupa del segundo. De los otros dos no se ocupa nadie por defecto. Una nota pasa de recordada a vencida sin que ocurra nada dentro de la memoria. Lo que cambia es el código, la configuración o la decisión, y eso vive en otro lado. Por eso ninguna de mis 56 notas figura como vencida. El paso a reemplazada sí deja rastro, pero solo cuando alguien lo escribe.

El dibujo también explica por qué guardar más puede empeorar las cosas. Cada nota nueva es una nota que algún día vence, y la búsqueda no distingue estados. Si nadie cuida las notas al mismo ritmo al que se guardan, la proporción de notas vencidas entre las que vuelven tiende a subir. Eso no lo medí, es un argumento. Y un agente que recibe una nota vencida no tiene con qué dudar de ella. La trata como contexto y actúa.

**Cómo aplicarlo**

Ninguna de estas prácticas depende de la herramienta. Valen igual para un archivo de notas dentro del repositorio.

**1. Guarda la razón y la fecha, y un solo tema por nota**

Una decisión guardada sin su razón no se puede revisar. Cuando cambian las condiciones, nadie sabe si todavía aplica. Es el mismo problema de [el arreglo que nadie anotó](#blog/article/el-arreglo-que-funciona-no-decide), en otro lugar. La fecha te permite desconfiar más de una nota cuanto más vieja es. Y el tema único es lo que hace posible reemplazar. El caso de las siete notas muestra los dos lados. La clave que las destruyó es la misma que permite actualizar una decisión sin dejar viva la anterior. La regla que quedó escrita después fue una clave, una nota.

**2. Trata lo recordado como una pista**

Si una nota nombra un archivo, una opción o un estado, compruébalo contra el repositorio antes de actuar. Tengo un caso de este portafolio. Una lista de tareas guardada en memoria tenía dos bloques enteros marcados como terminados, y el código de esos bloques no existía. Las marcas se habían puesto al planear. Un agente que leyera solo las casillas habría dado el trabajo por hecho. Hoy los documentos de tareas de este sitio viven como archivo en el repositorio. Su copia en memoria empieza por decir dónde está el archivo y que el archivo es el documento completo. La memoria guarda la dirección, y lo que se puede comparar con el código queda junto al código.

**3. Corrige en el mismo lugar y deja el error a la vista**

Las dos notas corregidas que cité no borraron la versión equivocada. Dicen arriba qué estaba mal y conservan lo que se aprendió sobre la forma de trabajar. En una, que razonar sobre el orden en que corre un script no es verificar. En la otra, que una foto del estado del repositorio tomada al empezar la sesión no basta para concluir que se perdió un archivo. Esa lección dura más que el dato que la originó. Además, al corregir en el mismo lugar no quedan dos notas compitiendo en la siguiente búsqueda.

**4. Ponles fecha de revisión a las decisiones**

En mi muestra, 5 de las 7 decisiones llevan una fecha de revisión unos seis meses después de escritas. Ninguna de las otras 49 notas la lleva. Una decisión vencida es la nota que más daño hace, porque el agente la obedece. Ninguna de esas fechas ha llegado. La más próxima de la muestra cae en enero de 2027, y no sé si alguien las va a atender.

**Dónde puedo estar equivocado**

Cuidar las notas cuesta, y alguien lo paga. Cada corrección que cité la escribió un agente en medio de otro trabajo, y ese tiempo también se paga. Si ese cuidado cuesta más que volver a explicar las cosas en cada sesión, conviene más no guardar. No he hecho esa cuenta.

La búsqueda puede no traer la nota que importaba. En el caso de las siete, seis notas existían y buscar por su contenido no las devolvía. Una memoria bien cuidada con una mala búsqueda falla igual.

Una creencia equivocada puede durar meses. La nota de mayo se corrigió en agosto, y el registro no me dice cuántas sesiones la leyeron cuando ya era falsa.

Y mi evidencia es corta: 56 notas de 2,935, traídas por búsquedas que apuntaban al problema. No mide cuántas notas están vencidas ni demuestra que un agente con una memoria bien cuidada trabaje mejor.

Lo que limita el daño está fuera de la memoria. El archivo versionado gana sobre la nota. [Las pruebas](#blog/article/con-ai-el-cuello-de-botella-son-tus-pruebas) fallan aunque la nota diga que todo está en orden. Y lo que se devuelve es poco, para que alguien alcance a leerlo antes de creerlo.

Me quedo con una regla corta. Una nota recordada es una pista con fecha, y vale lo que valga la última vez que alguien la comparó con la realidad.`,
  contentEn: `Giving a coding agent memory is easy. The work is in keeping that memory useful. That means deciding what deserves to be kept, noticing when a note has stopped being true, and handing the agent only a few notes. Storing, which is where the attention usually goes, is solved on day one. And a memory that keeps everything makes the agent repeat old decisions with complete confidence.

First, what I mean by memory. I do not mean what the model learned in training. I do not mean the current conversation either, which is gone when you close it. I mean notes: text the agent writes during a working session and that another session, days or months later, searches for and reads before acting. It can be a decision with its reason, a defect and how it was fixed, a project convention, or a summary of what was left pending. I work with a system like that, Engram, shared across my projects. What follows comes from looking at its records.

**What people usually think**

The usual idea is that the agent fails because it forgets. Every session starts from zero, asks again what was already explained, and repeats last week's mistake. The fix looks obvious: have it store everything and let a good search find what is needed. Storing text is cheap, so the design effort goes into capturing more and searching better.

I agree with half of that. An agent with no memory is expensive, and this repository has a rule that admits it. The instruction an agent follows when researching material for this blog tells it to always search memory first and only then widen to other projects. What I do not accept is the assumption behind it: that a note is still true because it is still stored.

**What I found when I checked my notes**

For this essay I examined the memory itself, with an agent running the searches. The system reports 2,935 notes across 306 sessions and 22 projects. I did not read them all. I took a sample with three searches. One was in this project, for the word memory. The other two ran across all projects, for words like stale, superseded, corrected and duplicated, in English and Spanish. Each search returns at most 20 results. That gave 56 distinct notes, which I counted by hand, by type.

![Horizontal bar chart of the types of 56 notes: architecture 24, session_summary 10, decision 7, discovery 6, bugfix 4, pattern 2, config 2, feedback 1.](figure/agent-memory-sample-types "Types of the 56 distinct notes returned by three searches of my agent memory, counted by hand on 17 November 2026. It is a sample, not the total.")

The first thing you see in the sample is what the memory is made of. Of the 24 notes labelled architecture, 20 are working documents for one specific change: specs, designs, task lists, verification reports. Another 10 are session summaries. There are 7 decisions. So 30 of 56 are the paperwork of a job that had a beginning and an end. They stop being useful when the job ends, even though the note stays.

The second is that none of them expires. All 56 are listed as active. One carries the word superseded in its own title, and it is listed as active too. It is a note from this portfolio, written in May. It stated that the project had no way to run tests and that test-first mode was off. By August the project was working with [a committed Playwright driver](#blog/article/tdd-estricto-contra-driver-playwright-versionado) and writing the test first. An agent rewrote the note to say it should not be trusted and where to look instead. The system would not have noticed by itself. Search returns a false note looking exactly like a true one.

The third is that contradictions get resolved by hand. In another project, two notes said a certain working mode was disabled and a versioned configuration file said the opposite. The note that settled it wrote the rule down: the file wins, because it is under version control, and the notes were one run's observation. The system does have a mechanism that compares each new note with similar ones and records a verdict. My sample holds 17 verdicts: 8 say related, 6 say no conflict and 3 say compatible. None says one note replaces another. Every replacement I found is written in prose, inside the note, by whoever noticed.

The fourth is that a note can be wrong from the day it is written. I found two that open with their own correction. One claimed a certain configuration value would never get installed. That was false, because another section of the same script installed it. The claim had come from reading two files and reasoning, without searching the whole file. The other recorded, as a possible incident, a file that vanished while an agent was working. I had deleted the file myself. Of the 20 results from the search for words like corrected, 7 open by declaring that they replace or correct an earlier record. That search was looking for them, so the 7 is not a rate. It says they exist and that someone had to write them.

The fifth is that saving can also destroy. In one long session an agent saved seven different notes under the same topic key. In this system a repeated key overwrites, and only the last note stayed within reach of search. The note that tells the story sums it up like this.

> I thought I had seven memories and I had one.

**The four states of a note**

I think of every note as moving through four states.

![Four states in a column joined by arrows: written, recalled, stale and replaced. The stale state is highlighted and says nothing flags it and it is still active.](figure/agent-memory-lifecycle "Conceptual sketch, not measured data. Storing covers the first state and searching covers the second. The other two depend on someone writing them down.")

Written, recalled, stale, replaced. Storing takes care of the first state and searching takes care of the second. Nobody takes care of the other two by default. A note goes from recalled to stale without anything happening inside the memory. What changes is the code, the configuration or the decision, and those live somewhere else. That is why none of my 56 notes is listed as stale. The move to replaced does leave a trace, but only when someone writes it.

The sketch also explains why storing more can make things worse. Every new note is a note that will go stale one day, and search does not tell states apart. If nobody looks after the notes at the pace they are saved, the share of stale notes among those that come back tends to rise. I did not measure that. It is an argument. And an agent handed a stale note has nothing to doubt it with. It treats the note as context and acts.

**How to apply it**

None of these practices depends on the tool. They work just as well for a notes file inside the repository.

**1. Save the reason and the date, and one topic per note**

A decision saved without its reason cannot be reviewed. When conditions change, nobody knows whether it still applies. It is the same problem as [the workaround nobody annotated](#blog/article/el-arreglo-que-funciona-no-decide), in a different place. The date lets you distrust a note more the older it is. And the single topic is what makes replacement possible. The seven-notes case shows both sides. The key that destroyed them is the same key that lets you update a decision without leaving the old one alive. The rule written down afterwards was one key, one note.

**2. Treat what is recalled as a lead**

If a note names a file, an option or a state, check it against the repository before acting. I have a case from this portfolio. A task list stored in memory had two whole blocks ticked as done, and the code for those blocks did not exist. The ticks had been placed during planning. An agent reading only the checkboxes would have taken the work as finished. Today the task documents for this site live as files in the repository. Their copy in memory opens by saying where the file is and that the file is the full document. Memory keeps the address, and what can be compared with the code stays next to the code.

**3. Correct in place and leave the mistake visible**

The two corrected notes I cited did not erase the wrong version. They say at the top what was wrong and they keep what was learned about the way of working. In one, that reasoning about the order a script runs in is not verification. In the other, that a snapshot of the repository state taken at the start of the session is not enough to conclude a file was lost. That lesson outlasts the fact that produced it. Correcting in place also means there are not two notes competing in the next search.

**4. Give decisions a review date**

In my sample, 5 of the 7 decisions carry a review date about six months after they were written. None of the other 49 notes has one. A stale decision is the note that does the most damage, because the agent obeys it. None of those dates has arrived. The nearest one in the sample falls in January 2027, and I do not know whether anyone will act on them.

**Where I could be wrong**

Looking after notes costs effort, and someone pays for it. Every correction I cited was written by an agent in the middle of other work, and that time is paid for too. If that care costs more than explaining things again in each session, you are better off not storing. I have not done that sum.

Search can miss the one note that mattered. In the seven-notes case, six notes existed and searching for their content did not return them. A well-kept memory with a poor search fails just the same.

A wrong belief can last for months. The May note was corrected in August, and the record does not tell me how many sessions read it once it was already false.

And my evidence is thin: 56 notes out of 2,935, brought back by searches aimed at the problem. It does not measure how many notes are stale, and it does not show that an agent with a well-kept memory works better.

What limits the damage sits outside the memory. The versioned file wins over the note. [The tests](#blog/article/con-ai-el-cuello-de-botella-son-tus-pruebas) fail even when the note says everything is in order. And what comes back is small, so that someone can read it before believing it.

The rule I keep is short. A recalled note is a lead with a date on it, and it is worth whatever the last comparison with reality was worth.`,
  relatedIds: [
    'strict-tdd-committed-playwright-driver',
    'workaround-that-works',
    'ai-bottleneck-is-your-tests',
  ],
}
