import type { BlogPost } from '../../types'

export const contextIsABudget: Omit<BlogPost, 'readingTime'> = {
  id: 'context-is-a-budget',
  slug: 'el-contexto-es-presupuesto',
  title: 'El contexto es presupuesto: lo que no entra importa más que lo que escribes',
  titleEn: 'Context Is a Budget: What You Keep Out Matters More Than What You Write',
  date: '2026-11-17',
  tags: ['AI', 'contexto', 'tokens', 'costos', 'agentes'],
  category: 'ensayo',
  featured: false,
  excerpt:
    'Cuando una sesión con un modelo sale cara o sale mal, se revisa la redacción de la petición. Sostengo que la palanca está en otro lado: en lo que se deja entrar a la ventana de contexto, porque lo que entra una vez se vuelve a pagar en cada turno y además compite por la atención del modelo. Cuatro jugadas para dejar cosas afuera, lo que arriesga cada una, y qué parte de esto es costo y qué parte es calidad.',
  excerptEn:
    'When a session with a model turns out expensive or wrong, people review how the request was worded. I argue the lever is somewhere else: in what is allowed into the context window, because whatever goes in once is paid for again on every turn and also competes for the model\'s attention. Four moves for keeping things out, what each one risks, and which part of this is about cost and which is about quality.',
  content: `Cuando una sesión con un modelo de lenguaje sale cara o sale mal, casi todos revisamos lo mismo: cómo redactamos la petición. Sostengo que ahí está la parte más pequeña del problema. El costo y la calidad del trabajo con un modelo dependen menos de cómo se escribe la petición que de lo que se deja entrar a su contexto. El uso de tokens se optimiza dejando cosas afuera, y muy poco escribiendo peticiones más cortas.

Un token es la unidad en la que el modelo lee, escribe y cobra: según el [glosario de Anthropic](https://platform.claude.com/docs/en/about-claude/glossary), puede corresponder a una palabra, a un fragmento de palabra o a un carácter. La ventana de contexto es, según [su documentación](https://platform.claude.com/docs/en/build-with-claude/context-windows), todo el texto que el modelo puede consultar al generar una respuesta, incluida la respuesta misma. Ahí van las instrucciones, los archivos leídos, lo que devolvieron las herramientas y la conversación entera.

Ese espacio se comporta como un presupuesto: tiene tope, y lo que se gastó en ruido ya no está disponible para lo que importa.

**Lo que se suele pensar**

La opinión habitual dice que el resultado depende del prompt: hay que redactarlo bien, darle estructura, y si la cuenta sube, acortarlo. Tiene una parte de razón: una petición ambigua produce trabajo ambiguo.

Lo que discuto es la versión de ahorro de esa idea: quitar cortesías, abreviar, pedir respuestas breves. Eso optimiza el renglón más pequeño de la cuenta. Una petición ocupa unas líneas. Un archivo abierto completo ocupa lo que mida el archivo, y la salida de una suite de pruebas ocupa lo que la suite imprima. En una sesión con herramientas, la ventana la llenan lo que el modelo lee y lo que las herramientas le devuelven, y casi nada de eso lo escribió la persona.

**Por qué falla**

Falla por la forma en que se cobra. La documentación sobre ventanas de contexto describe cada turno así: la entrada contiene todo el historial anterior más el mensaje nuevo, y los turnos previos se conservan completos. Un archivo que entró en el turno tres se vuelve a enviar en el cuatro, en el cinco y en todos los que sigan. La [guía de costos de Claude Code](https://code.claude.com/docs/en/costs) lo dice en una línea: el contexto viejo gasta tokens en cada mensaje posterior ("Stale context wastes tokens on every subsequent message").

> Lo que entra una vez se vuelve a pagar en cada turno.

Hay un segundo costo que no aparece en la factura. La misma página de ventanas de contexto advierte que más contexto no es automáticamente mejor: a medida que crece la cantidad de tokens, la precisión y el recuerdo se degradan, y a eso lo llama *context rot*. El [texto de ingeniería de Anthropic sobre contexto para agentes](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents), publicado en septiembre de 2025, lo plantea como un presupuesto de atención que cada token nuevo consume un poco, y concluye que el contexto debe tratarse como un recurso finito con rendimientos decrecientes. Son afirmaciones de un proveedor sobre sus propios modelos, y no las medí yo.

Lo que sí tengo es una regla que nació de chocar con ese tope. En otro proyecto mío, una revisión automática sobre un rango de unas dos mil líneas cambiadas falló antes de opinar: el material no cabía en el presupuesto de contexto del revisor. La petición estaba bien redactada, y redactarla mejor no habría cambiado nada. Lo que cambió el resultado fue partir la entrada. El mismo trabajo pasó revisado en cinco tramos, y la regla quedó anotada para las sesiones siguientes: revisar por commit. La palanca no estaba en las palabras de la petición. Estaba en cuánto entraba.

**El modelo**

Pienso la ventana como una barra con cuatro renglones de gasto y un resto.

![Dos barras del mismo ancho representan la misma ventana de contexto. En la de arriba, archivos leídos y salida de herramientas ocupan casi todo y casi no queda espacio libre. En la de abajo las instrucciones miden lo mismo, lo demás es mucho más corto y el espacio libre ocupa la mitad.](blog/figures/context-budget-window-es.svg "Esquema conceptual, no datos medidos. La misma ventana con todo adentro, y con solo lo que la tarea usa.")

Las instrucciones son lo estable: reglas y definiciones de herramientas, lo que se repite igual en cada turno. Los archivos leídos y la salida de herramientas son lo que crece sin que nadie lo escriba. La conversación es el historial. El resto es el espacio que le queda al modelo para trabajar en lo que le pedí. La barra de abajo es la misma tarea con las jugadas de la sección siguiente. El dibujo no tiene números porque no tengo mediciones de mis propias sesiones.

Ese presupuesto se cobra en dos monedas. Una es dinero: tokens de entrada en cada turno. La otra es atención: cuánto de lo que el modelo tiene delante es pertinente para la tarea. Las dos se gastan con lo mismo, pero no se cuidan con lo mismo, y conviene saber cuál se está cuidando.

Para la primera moneda hay un dato del proveedor que ordena lo demás.

![Cuatro barras horizontales con múltiplos del precio base de entrada: entrada normal 1, escritura en caché de 5 minutos 1.25, escritura en caché de 1 hora 2, lectura de caché 0.1.](blog/figures/context-budget-cache-es.svg "Múltiplos del precio base de entrada, leídos en la documentación de caché de prompts de Anthropic en noviembre de 2026. Algunos modelos tienen un múltiplo de lectura menor.")

A noviembre de 2026, la [documentación de caché de prompts](https://platform.claude.com/docs/en/build-with-claude/prompt-caching) dice que leer de caché un prefijo ya enviado cuesta 0.1 veces el precio base de entrada (menos en algunos modelos) y que escribirlo cuesta 1.25 veces con vida de cinco minutos. También dice cómo se arma el prefijo: herramientas, después sistema, después mensajes, y un cambio en un nivel invalida ese nivel y los que siguen. La página trae su propio contraejemplo: una marca de hora dentro del bloque marcado para caché cambia en cada petición, la caché nunca acierta y se paga escritura todas las veces. Los números van a cambiar. La diferencia de tamaño entre leer y volver a enviar explica por qué lo estable va primero.

**Cómo aplicarlo**

Antes de mover nada, conviene mirar la barra real. La documentación ofrece un [conteo de tokens](https://platform.claude.com/docs/en/build-with-claude/token-counting) gratuito, que ella misma describe como una estimación. Después vienen cuatro jugadas, cada una con lo que deja afuera y lo que arriesga.

**1. Buscar y leer un rango en vez de abrir el archivo**

Deja afuera el resto del archivo. La guía de costos de Claude Code da el ejemplo con un log de diez mil líneas: en vez de que el modelo lo lea entero, un filtro previo devuelve solo las líneas con error, y el contexto baja de decenas de miles de tokens a cientos. El riesgo es que la línea que importaba quede fuera del rango. El modelo no avisa de lo que no vio; completa con algo verosímil. Por eso el rango sale de una búsqueda y no de una corazonada, y se amplía ante la primera respuesta que suene a suposición.

**2. Pedir una conclusión con evidencia en vez de leer veinte archivos**

Un agente ayudante trabaja en su propia ventana y devuelve solo el resumen; así lo describe la [documentación de subagentes](https://code.claude.com/docs/en/sub-agents). El texto de ingeniería citado arriba da la proporción: un subagente puede explorar gastando decenas de miles de tokens y devolver un resumen condensado, a menudo de 1,000 a 2,000. Los veinte archivos quedan afuera de la ventana que decide.

Arriesga dos cosas. La primera es de calidad: un resumen pierde detalle, y un delegado devuelve sus errores con la misma seguridad que sus aciertos. Por eso pido la conclusión con archivo y línea, y abro al menos una de esas referencias antes de decidir. Poder confiar en lo que verifica es lo escaso, y lo argumenté en [Con AI, el cuello de botella son tus pruebas](#blog/article/con-ai-el-cuello-de-botella-son-tus-pruebas). La segunda es de costo, y va contra la intuición: esta jugada no abarata. La guía de costos aclara que las peticiones del subagente cuentan contra el mismo consumo. Delegar una búsqueda protege la atención de la sesión principal. La cuenta total puede subir.

**3. Lo estable primero, y por referencia**

Así está armado este sitio. Hay un índice de reglas que hoy lista treinta y seis archivos, cada uno con una línea que dice cuándo aplica y la ruta donde vive. Su contrato dice que es un índice y no un resumen: quien reparte una tarea elige las reglas que coinciden y pasa las rutas exactas, y quien ejecuta lee el archivo completo. Nadie carga el texto de las reglas que no le tocan.

Las tareas funcionan igual. Cada funcionalidad tiene un documento con las especificaciones numeradas arriba y una bitácora al final. A un ayudante no le vuelvo a explicar la tarea: recibe la ruta, el número de tarea y la orden de leer hasta donde empieza la bitácora. Lo que no cambia va arriba y lo que crece va al final, que es el mismo orden que premia la caché.

El riesgo es que una referencia vale lo que valga el documento. Si la especificación está desactualizada, el ayudante ejecuta con precisión algo viejo. Y un detalle: ese índice se niega a resumir. Dejar afuera no es lo mismo que comprimir. Es poner cada texto, completo, en la ventana que lo va a usar.

**4. Escribir la decisión y empezar una sesión nueva**

Deja afuera el camino: los intentos fallidos y las salidas largas. La guía de costos recomienda limpiar la sesión al pasar a un trabajo no relacionado. El riesgo es que la nota pierda el porqué. El texto de ingeniería lo advierte sobre los resúmenes automáticos: una compactación demasiado agresiva pierde contexto sutil cuya importancia solo se nota después. Mi nota lleva tres cosas: qué se decidió, por qué, y qué se descartó.

**Dónde puedo estar equivocado**

Dejar afuera puede dejar al modelo sin el único dato que necesitaba, y esa falla es más silenciosa que la contraria. Una ventana demasiado llena se nota en la cuenta. Una ventana a la que le falta algo responde igual de segura. En una tarea pequeña, abrir el archivo entero es lo correcto.

También conviene separar lo que mezclé. Ordenar lo estable para la caché es casi solo costo. Delegar la búsqueda es calidad, y puede costar más. Leer rangos y empezar sesiones nuevas sirven a las dos monedas.

La parte de costo tiene fecha de vencimiento. A noviembre de 2026, la documentación lista varios modelos con ventana de un millón de tokens a precio estándar, con una excepción que la propia página señala. Cada mejora de esas le quita peso a mi argumento económico. Sobre la parte de calidad, el proveedor sostiene que las ventanas de cualquier tamaño seguirán expuestas a contaminación en el futuro previsible; el mismo texto dice que los modelos más capaces necesitan menos ingeniería prescriptiva. Puede que yo esté describiendo una disciplina de transición.

Y mi evidencia es corta: una regla que salió de una revisión que no cupo, la forma en que están armados los archivos de este sitio, y documentación de un proveedor. No tengo conteos de tokens de mi propio trabajo. Si alguien mide que abrir todo da el mismo resultado a un precio que puede pagar, para ese trabajo mi argumento se reduce a orden.

La regla que me llevo es una pregunta que hago antes de redactar: qué va a tener delante el modelo cuando lea esto, y cuánto de eso puso ahí la tarea.`,
  contentEn: `When a session with a language model turns out expensive or wrong, most of us review the same thing: how we worded the request. My claim is that the wording is the smallest part of the problem. The cost and the quality of work done with a model depend less on how the request is written than on what is allowed into its context. You optimize token use by keeping things out, and hardly at all by writing shorter requests.

A token is the unit a model reads, writes and bills in: according to [Anthropic's glossary](https://platform.claude.com/docs/en/about-claude/glossary), it can correspond to a word, a piece of a word or a character. The context window, in the words of [its documentation](https://platform.claude.com/docs/en/build-with-claude/context-windows), is all the text the model can reference when generating a response, including the response itself. That covers the instructions, the files that were read, whatever the tools returned and the whole conversation.

That space behaves like a budget: it has a ceiling, and what was spent on noise is no longer available for what matters.

**The common view**

The usual position is that the result depends on the prompt: word it well, give it structure, and if the bill climbs, shorten it. It is partly right: an ambiguous request produces ambiguous work.

What I am arguing against is the savings version of that idea: drop the pleasantries, abbreviate, ask for short answers. That optimizes the smallest line on the bill. A request takes a few lines. A file opened whole takes whatever the file measures, and the output of a test suite takes whatever the suite prints. In a session with tools, the window is filled by what the model reads and what the tools hand back, and the person wrote almost none of it.

**Why it fails**

It fails because of how billing works. The context window documentation describes each turn this way: the input contains all previous conversation history plus the new message, and previous turns are preserved completely. A file that entered on turn three is sent again on turn four, on turn five and on every turn after that. The [Claude Code cost guide](https://code.claude.com/docs/en/costs) says it in one line: "Stale context wastes tokens on every subsequent message".

> Whatever goes in once is paid for again on every turn.

There is a second cost that never shows up on the invoice. The same context window page warns that more context is not automatically better: as the token count grows, accuracy and recall degrade, and it calls that context rot. [Anthropic's engineering piece on context for agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents), published in September 2025, frames it as an attention budget that every new token depletes a little, and concludes that context must be treated as a finite resource with diminishing marginal returns. Those are a vendor's statements about its own models, and I did not measure them.

What I do have is a rule that came out of hitting that ceiling. On another project of mine, an automated review over a range of roughly two thousand changed lines failed before it could say anything: the material did not fit in the reviewer's context budget. The request was well worded, and wording it better would have changed nothing. What changed the outcome was splitting the input. The same work went through review in five slices, and the rule was written down for later sessions: review per commit. The lever was not in the words of the request. It was in how much went in.

**The model**

I picture the window as a bar with four spending lines and a remainder.

![Two bars of the same width stand for the same context window. In the top one, files read and tool output take almost everything and hardly any free space is left. In the bottom one the instructions are the same size, the rest is much shorter and free space takes half the bar.](blog/figures/context-budget-window-en.svg "Conceptual sketch, not measured data. The same window with everything in it, and with only what the task uses.")

The instructions are the stable part: rules and tool definitions, the things repeated unchanged on every turn. Files read and tool output are what grows without anybody writing it. The conversation is the history. The remainder is the room the model has left to work on what I asked for. The bottom bar is the same task after the moves in the next section. The sketch has no numbers because I have no measurements of my own sessions.

That budget is charged in two currencies. One is money: input tokens on every turn. The other is attention: how much of what the model has in front of it is relevant to the task. The same things spend both, but different things protect each, and it helps to know which one you are protecting.

For the first currency there is one piece of vendor data that puts the rest in order.

![Four horizontal bars with multiples of the base input price: normal input 1, 5-minute cache write 1.25, 1-hour cache write 2, cache read 0.1.](blog/figures/context-budget-cache-en.svg "Multiples of the base input price, read in Anthropic's prompt caching documentation in November 2026. Some models have a lower cache read multiple.")

As of November 2026, the [prompt caching documentation](https://platform.claude.com/docs/en/build-with-claude/prompt-caching) says that reading an already-sent prefix from cache costs 0.1 times the base input price (less on some models) and that writing it costs 1.25 times with a five-minute lifetime. It also says how the prefix is assembled: tools, then system, then messages, and a change at one level invalidates that level and everything after it. The page carries its own counterexample: a timestamp inside the block marked for caching changes on every request, the cache never hits, and you pay for a write every time. The numbers will change. The size of the gap between reading and resending is why the stable material goes first.

**How to apply it**

Before moving anything, look at the real bar. The documentation offers [token counting](https://platform.claude.com/docs/en/build-with-claude/token-counting), which is free to use and which it describes as an estimate. Then come four moves, each with what it keeps out and what it risks.

**1. Search and read a range instead of opening the file**

It keeps out the rest of the file. The Claude Code cost guide gives the example of a ten-thousand-line log: instead of the model reading all of it, a filter that runs first returns only the lines with an error, and the context drops from tens of thousands of tokens to hundreds. The risk is that the line that mattered sits outside the range. The model does not tell you about what it never saw; it fills the gap with something plausible. So the range comes from a search and not from a hunch, and it gets widened at the first answer that sounds like a guess.

**2. Ask for a conclusion with evidence instead of reading twenty files**

A helper agent works in its own window and returns only the summary; that is how the [subagent documentation](https://code.claude.com/docs/en/sub-agents) describes it. The engineering piece cited above gives the proportion: a subagent may explore using tens of thousands of tokens and return a condensed summary, often 1,000 to 2,000. The twenty files stay out of the window that decides.

It risks two things. The first is about quality: a summary loses detail, and a delegate returns its mistakes in the same confident voice as its findings. That is why I ask for the conclusion with file and line, and open at least one of those references before deciding. Being able to trust what verifies is the scarce thing, which I argued in [AI Made Code Cheap. Your Tests Are Now the Bottleneck](#blog/article/con-ai-el-cuello-de-botella-son-tus-pruebas). The second is about cost, and it runs against intuition: this move does not make anything cheaper. The cost guide points out that the subagent's own requests draw on the same usage. Delegating a search protects the attention of the main session. The total bill can go up.

**3. Stable material first, and by reference**

This site is built that way. There is an index of rule files that lists thirty-six of them today, each with one line saying when it applies and the path where it lives. Its contract says it is an index and not a summary: whoever hands out a task picks the rules that match and passes the exact paths, and whoever does the work reads the full file. Nobody carries the text of rules they will not use.

Tasks work the same way. Each feature has one document with numbered specifications at the top and a log at the end. I do not explain the task to a helper again: it gets the path, the task number and the instruction to read up to where the log begins. What does not change sits at the top and what grows sits at the end, which is the same order the cache rewards.

The risk is that a reference is worth exactly what the document is worth. If the specification is out of date, the helper carries out something stale with great precision. And one detail: that index refuses to summarize. Keeping things out is not the same as compressing them. It means putting each text, whole, in the window that is going to use it.

**4. Write the decision down and start a fresh session**

It keeps out the path: the failed attempts and the long outputs. The cost guide recommends clearing the session when switching to unrelated work. The risk is that the note loses the reason. The engineering piece gives that warning about automatic summaries: overly aggressive compaction loses subtle context whose importance only becomes apparent later. My note carries three things: what was decided, why, and what was ruled out.

**Where I could be wrong**

Keeping things out can leave the model without the one fact it needed, and that failure is quieter than the opposite one. A window that is too full shows up on the bill. A window that is missing something answers just as confidently. On a small task, opening the whole file is the right call.

I should also separate what I have been mixing. Ordering the stable material for the cache is almost purely about cost. Delegating the search is about quality, and it can cost more. Reading ranges and starting fresh sessions serve both currencies.

The cost half has an expiry date. As of November 2026, the documentation lists several models with a one-million-token window at standard pricing, with one exception the page itself names. Every improvement of that kind takes weight off my economic argument. On the quality half, the vendor holds that context windows of all sizes will stay subject to pollution for the foreseeable future; the same piece says smarter models require less prescriptive engineering. I may be describing a transitional discipline.

And my evidence is thin: one rule that came out of a review that did not fit, the way the files of this site are laid out, and one vendor's documentation. I have no token counts for my own work. If someone measures that opening everything gives the same result at a price they can pay, then for that work my argument comes down to tidiness.

The rule I keep is a question I ask before I write the request: what will the model have in front of it when it reads this, and how much of that did the task put there.`,
  relatedIds: ['ai-bottleneck-is-your-tests'],
}
