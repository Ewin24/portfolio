import type { BlogPost } from '../../types'

export const toolsForAgents: Omit<BlogPost, 'readingTime'> = {
  id: 'tools-for-agents',
  slug: 'una-herramienta-para-un-agente-es-una-api',
  series: 'Working with AI',
  seriesOrder: 3,
  title: 'Si tu agente usa mal una herramienta, revisa primero el nombre, la descripción y lo que le devuelves',
  titleEn: 'If Your Agent Misuses a Tool, Look First at Its Name, Its Description and What It Returns',
  date: '2026-11-17',
  tags: ['AI', 'agentes', 'herramientas', 'diseño de APIs', 'arquitectura'],
  category: 'ensayo',
  featured: false,
  excerpt:
    'Cuando un agente elige la función equivocada o inventa un parámetro, se culpa al modelo. Yo miro antes la herramienta, porque el modelo decide solo con un nombre, una descripción y lo que le devuelves. Aquí van cuatro decisiones de diseño que puedes aplicar esta semana, lo que hice en un producto propio y lo que un buen diseño no arregla.',
  excerptEn:
    'When an agent picks the wrong function or invents a parameter, the model gets the blame. I look at the tool first, because the model decides from nothing but a name, a description and whatever you return. Here are four design decisions you can apply this week, what I did in a product of my own, and what good tool design does not fix.',
  content: `Cuando un agente elige la función equivocada, inventa un parámetro o repite la misma llamada tres veces, lo primero que se dice es que el modelo se equivocó. Creo que casi siempre hay que mirar antes otra cosa: la herramienta que le diste. Una herramienta para un agente es una API. Quien la usa se parece a alguien recién llegado y con prisa: decide a partir del nombre y de la descripción, y no vuelve a preguntar.

Un poco de contexto si no trabajas con esto. Una herramienta (*tool*) es una función de tu sistema que le describes al modelo con un nombre, una descripción y un esquema de parámetros. El modelo no ejecuta nada. Según la [documentación de Anthropic sobre uso de herramientas](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview), decide cuándo llamarla a partir de la petición del usuario y de la descripción de la herramienta, y devuelve una llamada estructurada. Tu aplicación es la que la ejecuta y le entrega el resultado.

**Lo que se suele pensar**

La primera idea habitual es que el fallo es del modelo. Entonces se cambia a uno más capaz, o se agrega un párrafo al prompt del sistema que dice "no llames a esta función sin haber llamado antes a la otra". Tiene base, porque los modelos se comportan distinto. La misma documentación advierte que, cuando falta un parámetro obligatorio, un modelo más capaz tiende a pedirlo y otro puede inferir un valor razonable por su cuenta.

La segunda idea es que la API ya existe, así que basta con exponer cada endpoint como herramienta. Es barato y aprovecha lo que ya está probado.

El problema de la segunda lo nombra el propio proveedor. En su [guía de ingeniería sobre cómo escribir herramientas para agentes](https://www.anthropic.com/engineering/writing-tools-for-agents), Anthropic describe como un error común las herramientas que "merely wrap existing software functionality or API endpoints", sin mirar si le sirven a un agente.

**Por qué una API hecha para personas no le alcanza a un agente**

Una API hecha para personas cuenta con cosas que el agente no tiene. Quien integra un endpoint lee la documentación una tarde, prueba, se equivoca y pregunta. Después escribe un código que ya no se equivoca, y lo que aprendió queda guardado en ese código. El agente hace la integración de nuevo en cada conversación, con lo que tenga delante.

Conozco esa posición porque estuve en ella. Mantengo una aplicación de música que depende de una API interna que nadie documenta. Lo conté en [el artículo sobre InnerTube](#blog/article/youtube-innertube-api-resiliencia). Como no había documentación, el código que heredé había deducido el contrato a partir de lo que se veía: clasificaba los resultados de búsqueda por el título de cada sección. El día que el formato cambió, 1 de 25 resultados coincidía con lo esperado y los otros 24 caían en un grupo huérfano.

De ahí saco esto: quien solo ve la superficie de una API construye sobre lo que esa superficie sugiere, sea o no lo que el autor quiso prometer. Es una analogía y no una prueba, porque yo era una persona con tiempo para corregir. El modelo empieza de cero en cada conversación.

El segundo caso trata de la diferencia entre la forma de un dato y lo que significa. En [el artículo sobre la interfaz uniforme](#blog/article/interfaz-uniforme-no-arregla-asimetria-semantica) conté cómo quise poner dos proveedores externos detrás de una misma operación, evaluar viabilidad. Uno devolvía una decisión. El otro devolvía variables descriptivas y ningún campo de viabilidad. Gracias a la interfaz las dos formas compilaban, pero el dato que faltaba seguía faltando.

Un esquema de parámetros hace lo mismo con un modelo. La documentación ofrece un modo estricto que garantiza que cada llamada cumpla el esquema. Lo que garantiza es la forma. Si el parámetro se llama \`id\`, el modelo entregará un \`id\` del tipo correcto, y nada le dice de qué es ese id. La guía de Anthropic usa un ejemplo casi idéntico: en lugar de un parámetro llamado \`user\`, uno llamado \`user_id\`.

El tercer punto es el resultado. Lo que la herramienta devuelve entra al contexto del modelo, y el modelo lo lee entero. La guía lo explica con una libreta de contactos. Un agente que recibe todos los contactos y los recorre uno por uno gasta su contexto limitado en información que no viene al caso. Un endpoint que devuelve quinientas filas a una pantalla paginada está bien diseñado para esa pantalla. Para un modelo son quinientas filas que tiene que leer antes de pensar.

> El modelo nunca lee tu código. Decide con un nombre, una descripción y lo que le devuelves.

En DevManager, un producto propio que tiene un agente adentro, tomé estas decisiones en el código, sin depender del prompt. El orquestador le pasa al modelo solo las herramientas de los módulos que el usuario tiene permitidos. Así, la lista entre la que elige no incluye lo que de todos modos no podría usar. Cada resultado tiene tope: como máximo 8 KB y entre 1 y 50 filas. Los indicadores que acompañan a un resultado se calculan en código. Lo que pasa en una conversación sale como eventos con tipo, y uno de esos tipos es para las llamadas a herramientas. Y cuando todos los módulos que pide el usuario están denegados, la negativa se responde sin llamar al modelo.

**Los cuatro momentos de una llamada**

Para saber dónde mirar, divido una llamada en cuatro momentos.

![Tabla de los cuatro pasos de una llamada a herramienta: elegir, llenar, leer y corregir. Para cada paso, el texto que lee el modelo y la forma en que falla.](figure/agent-tools-steps "Esquema conceptual, no datos medidos. En cada paso el modelo tiene un solo texto delante, y ese texto lo escribió quien diseñó la herramienta.")

El dibujo sirve porque, con él, "el modelo falla con las herramientas" deja de ser un diagnóstico. Si llama a la herramienta equivocada, mira el nombre y la descripción. Si llama a la correcta con un valor inventado, mira el parámetro. Si llama bien y responde mal, mira lo que le devolviste. Si repite la misma llamada fallida, mira el error. Los cuatro textos los escribió quien diseñó la herramienta.

**Cuatro decisiones que puedes tomar esta semana**

Son cuatro decisiones sobre una herramienta que ya existe. El dibujo las junta en un ejemplo que inventé para ilustrar. No es código de ningún sistema.

![Dos columnas comparan la misma herramienta en nombre, parámetros, resultado y error: get_tasks, que envuelve el endpoint, contra buscar_tareas_atrasadas, hecha para la tarea.](figure/agent-tools-contrast "Esquema conceptual, no datos medidos. La misma capacidad con dos interfaces: la izquierda describe el endpoint, la derecha describe la tarea.")

**1. Ponle a la herramienta el nombre de la tarea que resuelve**

Con esto evitas la cadena de llamadas. Con tres herramientas pequeñas, el modelo tiene que descubrir el orden, pasar identificadores de una a otra y no perderse a la mitad. La guía de Anthropic da el ejemplo: en vez de \`list_users\`, \`list_events\` y \`create_event\`, una sola \`schedule_event\` que busca disponibilidad y agenda.

**2. Devuelve un resultado acotado y di cómo pedir más**

Con esto evitas un contexto lleno de filas que no importan. La guía recomienda combinar paginación, filtros y truncado con valores por defecto sensatos. Cuenta que en Claude Code las respuestas de herramienta se limitan por defecto a 25,000 tokens. También pide que, si la respuesta se trunca, oriente al agente hacia búsquedas más pequeñas y dirigidas. El tope de 8 KB y 50 filas de mi producto va en la misma dirección.

**3. Haz que el error diga qué hacer después**

Con esto evitas que el agente reintente la misma llamada. La [documentación sobre cómo manejar llamadas](https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls) pide mensajes de error instructivos y da el contraste: en lugar de "failed", algo como "Rate limit exceeded. Retry after 60 seconds.". En el caso de los dos proveedores hice lo mismo para un operador humano. Donde el dato no existía, la respuesta era un error cuyo motivo decía que el mapeo de viabilidad no estaba definido para ese proveedor. Con ese mensaje el operador sabía que la combinación que había elegido todavía no estaba soportada, y eso es lo que necesita saber para no insistir.

**4. Escribe en la descripción cuándo no usarla**

Con esto evitas que el modelo confunda dos herramientas parecidas. La [referencia para definir herramientas](https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools) dice que una descripción detallada es, con diferencia, el factor que más pesa en el desempeño, y que debe explicar cuándo usar la herramienta y cuándo no. Este mismo sitio lo aplica a otra clase de pieza. Las habilidades que un agente de código carga para trabajar en el repositorio se describen en una línea con sus disparadores, y varias dicen además para qué tareas no deben activarse. No son herramientas en sentido estricto, pero el agente las elige de la misma manera, leyendo una línea.

Si diriges y no escribes las herramientas, hay un ejercicio que cuesta una hora. Dale a alguien de fuera del equipo solo la lista de nombres y descripciones, junto con cinco peticiones reales de usuarios. Pregúntale cuál llamaría y con qué valores. La guía propone el mismo criterio: describir la herramienta como se la describirías a una persona nueva en el equipo. Donde esa persona dude, el modelo va a adivinar.

**Dónde puedo estar equivocado**

Los modelos mejoran, y mejoran justamente en usar herramientas incómodas. Un nombre ambiguo puede costar menos dentro de un año. La propia guía, al hablar de cómo nombrar las herramientas, reconoce que los efectos varían según el modelo y recomienda elegir con evaluaciones propias.

Tampoco tengo una medición de antes y después. No puedo mostrar cuántas llamadas fallidas evita un tope o un nombre mejor. Y casi todas las recomendaciones que cito vienen de un proveedor que habla de sus propios modelos. Lo mío es un argumento apoyado en esa guía y en dos casos propios de interfaces que prometían más de lo que entregaban.

Hay además algo que ningún diseño resuelve. Una herramienta limpia no define una tarea que nadie ha definido. En el caso de los dos proveedores, ningún nombre mejor habría creado la regla de negocio que faltaba. Lo único honesto era fallar con un error claro. Si nadie sabe qué significa "atrasada" en una tarea, \`buscar_tareas_atrasadas\` solo esconde la pregunta detrás de un buen nombre.

Creo que hay tres cosas que se mantienen, mejore lo que mejore el modelo. Cada fila devuelta se lee y se paga. La guía que cité espera que los contextos crezcan y que siga haciendo falta que las herramientas sean eficientes. Una ambigüedad en la interfaz se resuelve adivinando, y un lector mejor adivina mejor pero sigue adivinando. Y esos mismos nombres los va a leer la persona que mantenga el sistema después.

Me quedo con una regla corta: si alguien nuevo en el equipo no sabría cuál llamar leyendo solo los nombres, todavía no puedes culpar al modelo.`,
  contentEn: `When an agent picks the wrong function, invents a parameter or repeats the same call three times, the first thing people say is that the model got it wrong. I think something else nearly always deserves the first look: the tool you gave it. A tool for an agent is an API. Its user is like a newcomer in a hurry: it decides from the name and the description, and it does not come back to ask.

Some context if you do not work with this. A tool is a function in your system that you describe to the model with a name, a description and a parameter schema. The model runs nothing. According to [Anthropic's documentation on tool use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview), it decides when to call a tool based on the user's request and the tool's description, and it returns a structured call. Your application is what runs the call and hands back the result.

**The common view**

The first usual idea is that the failure belongs to the model. So you switch to a more capable one, or you add a paragraph to the system prompt saying "do not call this function before calling the other one". There is something to it, because models do behave differently. The same documentation warns that when a required parameter is missing, a more capable model tends to ask for it while another may infer a reasonable value on its own.

The second idea is that the API already exists, so exposing each endpoint as a tool is enough. It is cheap, and it reuses what is already tested.

The vendor itself names the problem with the second idea. In its [engineering guide to writing tools for agents](https://www.anthropic.com/engineering/writing-tools-for-agents), Anthropic describes as a common error tools that "merely wrap existing software functionality or API endpoints", whether or not they suit an agent.

**Why an API built for people is not enough for an agent**

An API built for people counts on things an agent does not have. Whoever integrates an endpoint reads the documentation one afternoon, tries it, gets it wrong and asks someone. Then they write code that no longer gets it wrong, and what they learned stays stored in that code. An agent does the integration again in every conversation, with whatever is in front of it.

I know that position because I have been in it. I maintain a music app that depends on an internal API nobody documents. I wrote about it in [the post on InnerTube](#blog/article/youtube-innertube-api-resiliencia). Since there was no documentation, the code I inherited had worked out the contract from what was visible: it sorted search results by the title of each section. The day the format changed, 1 of 25 results matched what the code expected and the other 24 fell into an orphan group.

Here is what I take from it: someone who only sees the surface of an API builds on whatever that surface suggests, whether or not that is what the author meant to promise. It is an analogy and not proof, because I was a person with time to correct course. The model starts from zero in every conversation.

The second case is about the difference between the shape of a piece of data and what it means. In [the post on the uniform interface](#blog/article/interfaz-uniforme-no-arregla-asimetria-semantica) I described trying to put two external providers behind one operation, evaluate viability. One returned a decision. The other returned descriptive variables and no viability field at all. Thanks to the interface both shapes compiled, but the missing datum was still missing.

A parameter schema does the same thing to a model. The documentation offers a strict mode that guarantees every call conforms to the schema. What it guarantees is the shape. If the parameter is called \`id\`, the model will supply an \`id\` of the right type, and nothing tells it what that id belongs to. Anthropic's guide uses nearly the same example: instead of a parameter named \`user\`, one named \`user_id\`.

The third point is the result. What a tool returns goes into the model's context, and the model reads all of it. The guide explains this with an address book. An agent that receives every contact and goes through them one by one spends its limited context on information that has nothing to do with the question. An endpoint that returns five hundred rows to a paginated screen is well designed for that screen. To a model, it is five hundred rows it has to read before thinking.

> The model never reads your code. It decides from a name, a description and what you return.

In DevManager, a product of my own with an agent inside it, I made these decisions in code, without relying on the prompt. The orchestrator hands the model only the tools for the modules the user is allowed to use. That way the list it picks from leaves out what it could not use anyway. Every result has a cap: at most 8 KB and between 1 and 50 rows. The flags that come with a result are computed in code. What happens in a conversation goes out as typed events, and one of those types is for tool calls. And when every module the user asks about is denied, the refusal is answered without calling the model.

**The four moments of a call**

To know where to look, I split a call into four moments.

![Table of the four steps of a tool call: pick, fill, read and recover. For each step, the text the model reads and the way it fails.](figure/agent-tools-steps "Conceptual sketch, not measured data. At each step the model has one piece of text in front of it, and whoever designed the tool wrote that text.")

The sketch is useful because, with it, "the model is bad with tools" stops being a diagnosis. If it calls the wrong tool, look at the name and the description. If it calls the right one with a made-up value, look at the parameter. If it calls correctly and answers badly, look at what you returned. If it repeats the same failed call, look at the error. All four texts were written by whoever designed the tool.

**Four decisions you can make this week**

These are four decisions about a tool that already exists. The figure puts them together in an example I made up for illustration. It is not code from any system.

![Two columns compare the same tool by name, parameters, result and error: get_tasks, which wraps the endpoint, against find_overdue_tasks, built for the task.](figure/agent-tools-contrast "Conceptual sketch, not measured data. The same capability behind two interfaces: the left one describes the endpoint, the right one describes the task.")

**1. Name the tool after the task it solves**

This prevents the chain of calls. With three small tools, the model has to work out the order, carry identifiers from one to the next, and not lose track halfway. Anthropic's guide gives the example: instead of \`list_users\`, \`list_events\` and \`create_event\`, a single \`schedule_event\` that finds availability and schedules.

**2. Return a bounded result and say how to get more**

This prevents a context full of rows that do not matter. The guide recommends some combination of pagination, filtering and truncation with sensible defaults. It mentions that Claude Code restricts tool responses to 25,000 tokens by default. It also asks that a truncated response steer the agent toward smaller, more targeted searches. The cap of 8 KB and 50 rows in my product points the same way.

**3. Make the error say what to do next**

This prevents the agent from retrying the same call. The [documentation on handling tool calls](https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls) asks for instructive error messages and gives the contrast: instead of "failed", something like "Rate limit exceeded. Retry after 60 seconds.". In the two-provider case I did the same thing for a human operator. Where the datum did not exist, the response was an error whose reason said the viability mapping was not defined for that provider. With that message the operator knew the combination they had selected was not supported yet, which is what you need to know to stop retrying.

**4. Write in the description when not to use it**

This prevents the model from confusing two tools that look alike. The [reference for defining tools](https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools) says a detailed description is by far the most important factor in tool performance, and that it should explain when the tool should be used and when it should not. This site applies the idea to a different kind of thing. The skills a coding agent loads to work in the repository are each described in one line with their triggers, and several also state which tasks they must not activate for. They are not tools in the strict sense, but the agent chooses them the same way, by reading one line.

If you lead and do not write the tools, there is an exercise that costs an hour. Give someone outside the team only the list of names and descriptions, along with five real user requests. Ask which one they would call and with what values. The guide proposes the same standard: describe the tool the way you would to a new hire on your team. Wherever that person hesitates, the model will guess.

**Where I could be wrong**

Models get better, and they get better precisely at using awkward tools. An ambiguous name may cost less a year from now. The guide itself, where it discusses naming, acknowledges that effects vary by model and recommends choosing from your own evaluations.

I also have no before-and-after measurement. I cannot show how many failed calls a cap or a better name prevents. And nearly every recommendation I cite comes from one vendor talking about its own models. Mine is an argument resting on that guide and on two cases of my own where an interface promised more than it delivered.

There is also something no design solves. A clean tool does not define a task nobody has defined. In the two-provider case, no better name would have created the missing business rule. The only honest option was to fail with a clear error. If nobody knows what "overdue" means for a task, \`find_overdue_tasks\` only hides the question behind a good name.

I think three things hold however much the model improves. Every returned row is read and paid for. The guide I cited expects contexts to grow and the need for context-efficient tools to remain. An ambiguity in the interface gets resolved by guessing, and a better reader guesses better but is still guessing. And the person who maintains the system later will read those same names.

I am left with a short rule: if someone new to the team could not tell which one to call from the names alone, you cannot blame the model yet.`,
  relatedIds: [
    'interfaz-uniforme-asimetria-semantica',
    'youtube-innertube-api-resilience',
  ],
}
