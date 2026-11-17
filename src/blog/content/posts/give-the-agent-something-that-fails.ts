import type { BlogPost } from '../../types'

export const giveTheAgentSomethingThatFails: Omit<BlogPost, 'readingTime'> = {
  id: 'give-the-agent-something-that-fails',
  slug: 'dale-al-agente-algo-que-pueda-fallar',
  title: 'A un agente de AI no le des una descripción: dale algo que pueda fallar',
  titleEn: 'Stop Describing the Work to Your AI Agent. Give It Something That Can Fail',
  date: '2026-11-17',
  tags: ['AI', 'agentes', 'testing', 'verificación', 'liderazgo'],
  category: 'ensayo',
  featured: false,
  excerpt:
    'Lo que produce un agente de AI está limitado por la comprobación contra la que trabaja, y no por lo bien redactado que esté el encargo. Un prompt describe el objetivo; una prueba que falla antes de empezar lo define. Cómo se construye este sitio con esa regla, una escalera para ubicar cada encargo y los tres casos propios en los que una comprobación equivocada se cumplió al pie de la letra.',
  excerptEn:
    'What an AI agent produces is bounded by the check it works against, and not by how well the request is worded. A prompt describes the goal; a test that fails before the work starts defines it. How this site is built on that rule, a ladder for placing each request, and three cases of my own where a wrong check was satisfied to the letter.',
  content: `Lo que produce un agente de AI está limitado por la comprobación contra la que trabaja, y no por lo bien redactado que esté el encargo. Un prompt describe el objetivo. Una prueba que falla lo define. Si tengo una hora para mejorar el resultado, rinde más gastarla en la comprobación que en la redacción.

Lo sostengo con una condición: la comprobación tiene que existir antes de que empiece el trabajo, y tiene que estar en rojo. Una prueba escrita después, junto con el código, mide lo que el código ya hace. Una prueba escrita antes dice qué falta.

**Lo que se suele pensar**

La opinión habitual es que el resultado depende del encargo. Si el agente entregó algo distinto de lo que querías, faltó contexto: hay que explicar mejor, dar ejemplos, escribir una especificación más larga, mantener un archivo de instrucciones. Es una opinión razonable y la comparto en parte. Un encargo vago produce trabajo vago, y este sitio tiene su archivo de instrucciones y sus documentos de especificación, como cualquier proyecto que se construye con agentes.

Lo que esa opinión deja sin responder es cómo sabe el agente que terminó. Con una descripción, termina cuando lo que produjo se parece a lo descrito, y quien juzga el parecido es el mismo agente que lo produjo. Después lo juzgo yo, leyendo. Las dos lecturas tienen el mismo límite: comparan un texto con otro texto.

**Por qué falla**

Una descripción no puede decir que no. Puede ser precisa, completa y estar bien escrita, y aun así cualquier resultado plausible la cumple a ojos de quien lo lee con buena voluntad. Quien acaba de generar algo lo lee con muy buena voluntad.

Tengo evidencia de la diferencia en este mismo sitio. El portafolio tiene un segundo tema, un escritorio con ventanas que se arrastran, se redimensionan y se cierran. Lo conté con detalle en [TDD estricto contra un driver Playwright versionado](#blog/article/tdd-estricto-contra-driver-playwright-versionado). La regla de ese trabajo fue que cada unidad empezaba escribiendo la afirmación que fallaba, en un driver que hace clic sobre la interfaz real en un navegador real. Antes de que existiera el arrastre con límites, el driver ya intentaba sacar una ventana dos mil píxeles fuera de la pantalla y exigía que siguiera dentro del escritorio. Falló primero, por la razón correcta, y después pasó. El driver creció así de 58 verificaciones a 64, a 88 y a 98.

Compara eso con la descripción equivalente: "las ventanas no deben salirse del escritorio". Es una frase correcta. No dice qué pasa en el borde inferior, donde está la barra de tareas, ni con una ventana que se encoge desde la esquina noroeste hasta su tamaño mínimo. La verificación sí lo dice, porque para escribirla hay que elegir un número, y elegir el número es tomar la decisión que la frase dejaba abierta.

El segundo caso de ese trabajo es el que más pesa. Al abrir la ventana de ayuda, el foco de teclado no llegaba a su barra de título. El manejador hacía dos actualizaciones de estado seguidas, React las agrupaba, y la segunda borraba el marcador que la primera acababa de escribir. Cada pieza, mirada sola, estaba bien: una lectura del código lo habría aprobado y una prueba unitaria también. El defecto solo existía al hacer clic. Ninguna descripción, por buena que fuera, habría hecho que quien genera el código lo viera, porque no estaba en el texto.

Hoy el sitio se construye así. Cada funcionalidad tiene un documento que nombra, antes de la primera línea de código, los comandos que la van a juzgar y, cuando hace falta uno nuevo, el archivo del driver que habrá que escribir. La bitácora de cada tarea registra el resultado observado y no una opinión: 100 de 100 verificaciones de comportamiento, 8 de 8 capturas con cero píxeles distintos, 6 de 6 rutas. Cuando el encargo fue que el escritorio se viera mejor, la bitácora dejó anotado que la barra de tareas se quedaba en 40 píxeles porque el driver lo afirma. Esa restricción no venía en el encargo. Estaba en algo que se pone en rojo.

> Una descripción se cumple a ojos de quien la lee. Una prueba en rojo no depende de quién la lea.

Esto es distinto de lo que argumenté en [Con AI, el cuello de botella son tus pruebas, no tu código](#blog/article/con-ai-el-cuello-de-botella-son-tus-pruebas). Allí el problema era cuánto creerle a una suite que ya existe. Aquí hablo del momento anterior: qué le entregas al agente para que empiece.

**El modelo**

![Dos ciclos. En el primero, describir, generar y leer se repiten mientras alguien juzga si el resultado se parece, y el ciclo sale cuando alguien opina que ya está. En el segundo, una prueba en rojo, generar y ejecutar se repiten mientras la prueba siga en rojo, y el ciclo sale cuando el comando pasa.](blog/figures/agent-contract-loops-es.svg "Esquema conceptual, no datos medidos. El primer ciclo termina con una opinión; el segundo, con el resultado de un comando.")

En el primero, describir, generar y leer, la única salida es que alguien decida que ya se parece. Ese juicio es caro si lo hago yo y poco fiable si lo hace quien generó. En el segundo, fallar, generar y pasar, la salida es un hecho: el comando terminó bien o no. El agente puede dar veinte vueltas sin que yo lea ninguna, y lo que me llega al final viene con su resultado.

El costo cambia de lugar. En el primer ciclo pago al final, leyendo, y pago en cada entrega. En el segundo pago al principio, escribiendo algo que falle, y esa pieza se queda en el repositorio para el cambio siguiente.

No todo encargo llega al segundo ciclo. Para ubicar cada uno uso una escalera.

![Escalera de cuatro peldaños, del menos al más comprobable: uno, descripción; dos, criterio escrito que una persona marca; tres, ejemplo con su resultado esperado; cuatro, comprobación que falla hoy y que juzga un comando. El cuarto peldaño está resaltado.](blog/figures/agent-contract-ladder-es.svg "Esquema conceptual, no datos medidos. La regla es subir el encargo un peldaño antes de entregarlo.")

De abajo hacia arriba: la descripción, un criterio escrito que una persona marca, un ejemplo con su resultado esperado y una comprobación que se ejecuta y hoy falla. La regla que uso es subir el encargo un peldaño antes de entregarlo. No hace falta llegar arriba cada vez.

**Cómo aplicarlo**

**1. Un defecto: primero la reproducción que falla**

En este sitio, los mapas del sitio publicaban los enlaces a los artículos con una barra después del numeral, y el enrutador los leía sin ella. La forma descriptiva del encargo es "arregla los enlaces del blog". La forma que puede fallar es un script que abre las dos variantes en un navegador y exige que las dos terminen en el artículo, en la primera carga y al cambiar la dirección en una pestaña ya abierta. Ese script está en el repositorio y se corre con cada funcionalidad.

Para probarlo esta semana: toma el próximo defecto que le ibas a describir a un agente y pide como primer entregable la reproducción en rojo, sin el arreglo. Revísala. Solo después pide el arreglo.

**2. Una regla de contenido: conviértela en una búsqueda**

El currículo en inglés de este sitio salía con fechas en español. "El CV en inglés no debe tener español" es una descripción. Hoy el generador del CV falla si llegan palabras en español a la versión en inglés, y antes de darlo por bueno se comprobó que fallaba con el mapeo anterior. Muchas reglas de redacción, de formato o de cumplimiento admiten esa forma: una lista de lo que no puede aparecer, o de lo que tiene que aparecer, y un comando que la recorre.

**3. Un cambio con algo que no puede moverse: una puerta de invariancia**

Cuando el encargo es cambiar una cosa sin tocar otra, lo que conviene volver ejecutable es la otra. Aquí es el tema periódico: ocho capturas, cuatro anchos por dos idiomas, comparadas contra imágenes versionadas, y la puerta aprueba solo con cero píxeles distintos. El agente puede trabajar en el escritorio con libertad, porque lo que no debe pasar está escrito en un lugar que se queja solo.

**4. Para quien dirige: pregunta qué va a estar en rojo**

Antes de aprobar un encargo, para una persona o para un agente, pregunta qué comprobación estará fallando cuando empiece el trabajo y pasando cuando termine. Si la respuesta es "lo reviso yo al final", el encargo está en el peldaño de abajo. A veces es el peldaño correcto. Conviene saberlo antes de comprometer una fecha.

**Dónde puedo estar equivocado**

Primero: no todo tiene una comprobación barata. El encargo de que el escritorio "se vea mejor" no la tuvo ni podía tenerla. Tampoco la hay para saber si un texto está bien escrito o si una funcionalidad merece existir. Los ensayos de este blog pasan comprobaciones de extensión, de enlaces y de que las figuras carguen, y ninguna dice si el argumento vale.

En esos casos hago dos cosas. Vuelvo ejecutable el borde, es decir, lo que no debe romperse mientras alguien mejora lo que no se puede medir. Y dejo el juicio en una persona concreta, en lugar de fingir que una métrica lo reemplaza.

Segundo, y más serio: una comprobación equivocada se cumple con la misma fidelidad que una correcta. Tengo tres casos en este mismo sitio. El driver del escritorio ejercitaba los botones de cerrar, minimizar y maximizar a través de un atajo de pruebas, y pasaba, mientras los botones no respondían al puntero real. La puerta de píxeles estuvo meses aprobando cualquier captura cuyo alto hubiera cambiado, e imprimía un conteo negativo de píxeles junto a "ALL PASSED". Y un barrido de redacción devolvió cero coincidencias mientras un artículo publicaba identificadores reales, con un informe del agente que certificaba que todo estaba limpio; ese lo conté en [El grep de redacción que no puede ver un identificador en camelCase](#blog/article/grep-redaccion-no-ve-camelcase). En los tres, el trabajo cumplía exactamente lo que la comprobación pedía.

Con un agente ese riesgo crece, porque llega al verde sin pasar por el uso manual, que es donde una persona tropieza con el botón muerto.

La defensa que conozco tiene tres partes. La comprobación tiene que verse fallar antes de confiar en ella: para volver a creerle a la puerta de píxeles hubo que alargar a propósito un título en español y ver que fallaba con 8,3 millones de píxeles distintos, y solo en las cuatro capturas en español. Tiene que recorrer el camino del usuario y no un atajo. Y la escribe o la revisa alguien distinto de quien va a satisfacerla. Si el agente escribe la prueba y el código en el mismo paso, y nadie lee la prueba, estoy otra vez en el primer ciclo con un paso más.

Tercero, el costo. Para un cambio que se hace una vez y se descarta, escribir la comprobación cuesta más que leer el resultado. Mi argumento vale para trabajo que alguien va a volver a tocar.

Cuarto, el alcance de mi evidencia. Es un sitio, construido por mí con agentes, y no hice el experimento de repetir el mismo encargo con y sin comprobación para comparar. No tengo una medición de cuánto mejora el resultado. Lo que tengo es dónde aparecieron los defectos: en lo que ninguna comprobación ejecutaba, o en lo que una comprobación ejecutaba mal.

Me quedo con una pregunta para antes de escribir el encargo: qué va a estar en rojo cuando el agente empiece.`,
  contentEn: `What an AI agent produces is bounded by the check it works against, and not by how well the request is worded. A prompt describes the goal. A failing test defines it. If I have an hour to improve the outcome, it pays better spent on the check than on the wording.

I hold that with one condition: the check has to exist before the work starts, and it has to be red. A test written afterwards, alongside the code, measures what the code already does. A test written beforehand says what is missing.

**The common view**

The usual position is that the result depends on the request. If the agent delivered something other than what you wanted, context was missing: explain it better, give examples, write a longer spec, keep an instructions file. That is reasonable and I hold part of it. A vague request produces vague work, and this site has its instructions file and its spec documents like any project built with agents.

What that position leaves unanswered is how the agent knows it is finished. With a description, it is finished when what it produced resembles what was described, and the one judging the resemblance is the agent that produced it. Then I judge it, by reading. Both readings share a limit: they compare one text with another text.

**Why it fails**

A description cannot say no. It can be precise, complete and well written, and any plausible result still satisfies it in the eyes of a charitable reader. Whoever has just generated something reads it very charitably.

I have evidence of the difference on this very site. The portfolio has a second theme, a desktop with windows you can drag, resize and close. The detail is in [Strict TDD Against a Committed Playwright Driver](#blog/article/tdd-estricto-contra-driver-playwright-versionado). The rule for that work was that every unit opened by writing the assertion that failed, in a driver that clicks the real interface in a real browser. Before clamped dragging existed, the driver was already trying to shove a window two thousand pixels off the screen and demanding that it stay inside the desktop. It failed first, for the right reason, and then it passed. The driver grew that way from 58 checks to 64, to 88, to 98.

Compare that with the equivalent description: "windows must not leave the desktop". The sentence is correct. It does not say what happens at the bottom edge, where the taskbar sits, or to a window being shrunk from its north-west corner down to its minimum size. The check does say it, because to write it you have to pick a number, and picking the number is making the decision the sentence left open.

The second case from that work carries the most weight. When the help window opened, keyboard focus never reached its title bar. The handler made two state updates in a row, React batched them, and the second one wiped the marker the first had just written. Each piece, looked at alone, was fine: a read of the code would have approved it and so would a unit test. The defect existed only when you clicked. No description, however good, would have made whoever generates the code see it, because it was not in the text.

The site is built this way now. Each feature has a document that names, before the first line of code, the commands that will judge it and, when a new one is needed, the driver file that will have to be written. Each task's log records the observed result and not an opinion: 100 of 100 behaviour checks, 8 of 8 captures at zero differing pixels, 6 of 6 routes. When the request was to make the desktop look better, the log noted that the taskbar stayed at 40 pixels because the driver asserts it. That constraint was not in the request. It was in something that goes red.

> A description is satisfied in the eyes of its reader. A red test does not depend on who reads it.

This is a different point from the one I made in [AI Made Code Cheap. Your Tests Are Now the Bottleneck](#blog/article/con-ai-el-cuello-de-botella-son-tus-pruebas). That essay was about how far to trust a suite that already exists. This one is about the moment before: what you hand the agent so it can start.

**The model**

![Two loops. In the first, describe, generate and read repeat while someone judges whether the result is close enough, and the loop ends when someone feels it is done. In the second, a failing test, generate and run repeat while the test is still red, and the loop ends when the command passes.](blog/figures/agent-contract-loops-en.svg "Conceptual sketch, not measured data. The first loop ends on an opinion; the second ends on the result of a command.")

In the first one, describe, generate, read, the only exit is someone deciding it is close enough. That judgement is expensive if I make it and unreliable if the generator makes it. In the second, fail, generate, pass, the exit is a fact: the command succeeded or it did not. The agent can go round twenty times without my reading any of it, and what reaches me at the end comes with its result attached.

The cost moves. In the first loop I pay at the end, by reading, and I pay on every delivery. In the second I pay up front, by writing something that fails, and that piece stays in the repository for the next change.

Not every request can reach the second loop. To place each one I use a ladder.

![A ladder with four rungs, from least to most checkable: one, a description; two, a written criterion a person ticks; three, an example with its expected result; four, a check that fails today and is judged by a command. The fourth rung is highlighted.](blog/figures/agent-contract-ladder-en.svg "Conceptual sketch, not measured data. The rule is to move the request up one rung before handing it over.")

From the bottom up: the description, a written criterion a person ticks, an example with its expected result, and a check that runs and fails today. My rule is to move the request up one rung before handing it over. It does not have to reach the top every time.

**How to apply it**

**1. A defect: the failing reproduction comes first**

On this site, the sitemaps published article links with a slash after the hash sign, and the router read them without it. The descriptive form of the request is "fix the blog links". The form that can fail is a script that opens both variants in a browser and demands that both land on the article, on first load and when the address changes in a tab that is already open. That script is in the repository and runs with every feature.

To try it this week: take the next defect you were going to describe to an agent and ask for the red reproduction as the first deliverable, with no fix. Review it. Only then ask for the fix.

**2. A content rule: turn it into a search**

The English CV on this site was coming out with dates in Spanish. "The English CV must contain no Spanish" is a description. Today the CV generator fails if Spanish words reach the English version, and before that was accepted it was shown to fail against the old mapping. Many rules about wording, format or compliance take the same shape: a list of what must not appear, or of what must, and a command that walks it.

**3. A change with something that must not move: an invariance gate**

When the request is to change one thing without touching another, the one worth making executable is the other. Here that is the newspaper theme: eight captures, four widths by two languages, compared against committed images, and the gate passes only at zero differing pixels. The agent can work freely on the desktop, because what must not happen is written somewhere that complains without being asked.

**4. If you lead: ask what will be red**

Before approving a request, for a person or for an agent, ask which check will be failing when the work starts and passing when it ends. If the answer is "I will review it at the end", the request sits on the bottom rung. Sometimes that is the right rung. It is worth knowing before you commit to a date.

**Where I could be wrong**

First: not everything has a cheap check. The request to make the desktop "look better" had none and could not have had one. Neither does the question of whether a text is well written, or whether a feature deserves to exist. The essays on this blog pass checks for length, for links and for figures that load, and none of those says whether the argument holds.

In those cases I do two things. I make the edge executable, meaning whatever must not break while someone improves the part that cannot be measured. And I leave the judgement with a specific person, instead of pretending a metric replaces it.

Second, and more serious: a wrong check is satisfied as faithfully as a right one. I have three cases on this same site. The desktop driver exercised the close, minimise and maximise buttons through a test shortcut, and passed, while the buttons did not respond to a real pointer. The pixel gate spent months approving any capture whose height had changed, printing a negative pixel count next to "ALL PASSED". And a redaction sweep returned zero hits while a post was publishing real identifiers, with an agent's report certifying that everything was clean; I told that one in [The Redaction Grep That Cannot See a camelCased Identifier](#blog/article/grep-redaccion-no-ve-camelcase). In all three, the work met exactly what the check asked for.

With an agent that risk grows, because it reaches green without passing through manual use, which is where a person trips over the dead button.

The defence I know has three parts. The check has to be seen failing before it is trusted: to believe the pixel gate again, a Spanish title had to be lengthened on purpose, and the gate had to fail with 8.3 million differing pixels, and only on the four Spanish captures. It has to go through the user's path and not a shortcut. And it is written or reviewed by someone other than whoever will satisfy it. If the agent writes the test and the code in one step, and nobody reads the test, I am back in the first loop with one extra step.

Third, the cost. For a change made once and thrown away, writing the check costs more than reading the result. My argument holds for work someone will touch again.

Fourth, how far my evidence reaches. It is one site, built by me with agents, and I did not run the experiment of repeating the same request with and without a check to compare. I have no measurement of how much the result improves. What I have is where the defects showed up: in what no check executed, or in what a check executed badly.

I keep one question for the moment before writing the request: what will be red when the agent starts.`,
  relatedIds: [
    'strict-tdd-committed-playwright-driver',
    'redaction-grep-misses-camelcase',
    'ai-bottleneck-is-your-tests',
  ],
}
