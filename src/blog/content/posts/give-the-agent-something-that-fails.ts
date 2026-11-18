import type { BlogPost } from '../../types'

export const giveTheAgentSomethingThatFails: Omit<BlogPost, 'readingTime'> = {
  id: 'give-the-agent-something-that-fails',
  slug: 'dale-al-agente-algo-que-pueda-fallar',
  series: 'Working with AI',
  seriesOrder: 2,
  title: 'Por qué a un agente de AI le entrego una prueba que falla antes que una buena descripción',
  titleEn: 'Why I Hand an AI Agent a Failing Test Before a Good Description',
  date: '2026-11-17',
  tags: ['AI', 'agentes', 'testing', 'verificación', 'liderazgo'],
  category: 'ensayo',
  featured: false,
  excerpt:
    'Un agente de AI trabaja hasta cumplir la comprobación que le das. Si solo le das una descripción, termina cuando el resultado se parece a lo descrito. Cuento cómo construyo este sitio con pruebas que fallan antes de empezar, una escalera de cuatro peldaños para ubicar cada encargo y tres casos míos en los que la comprobación estaba mal y el agente la cumplió igual.',
  excerptEn:
    'An AI agent works until it meets the check you give it. If all you give it is a description, it stops when the result looks like what you described. I explain how I build this site with tests that fail before the work starts, a four-rung ladder for placing each request, and three cases of my own where the check was wrong and the agent met it anyway.',
  content: `Lo que entrega un agente de AI depende de la comprobación contra la que trabaja. Depende mucho menos de lo bien redactado que esté el encargo. Un prompt le describe el objetivo. Una prueba que falla le dice exactamente qué falta. Por eso, si tengo una hora para mejorar el resultado, esa hora rinde más en la comprobación que en la redacción.

Pongo una condición. La comprobación tiene que existir antes de que empiece el trabajo, y tiene que estar fallando. A eso le digo "estar en rojo", por el color con que las herramientas marcan una prueba que falla. Una prueba escrita después, junto con el código, mide lo que el código ya hace. Una prueba escrita antes dice qué falta.

**Lo que se suele pensar**

Lo habitual es pensar que el resultado depende del encargo. Si el agente entregó algo distinto de lo que querías, le faltó contexto. Entonces hay que explicar mejor, dar ejemplos, escribir una especificación más larga o mantener un archivo de instrucciones. Me parece razonable y lo comparto en parte. Un encargo vago produce trabajo vago. Este sitio tiene su archivo de instrucciones y sus documentos de especificación, como cualquier proyecto que se construye con agentes.

Esa opinión deja una cosa sin responder: cómo sabe el agente que terminó. Con una descripción, termina cuando lo que produjo se parece a lo descrito. Quien juzga ese parecido es el mismo agente que lo produjo. Después lo juzgo yo, leyendo. Las dos lecturas tienen el mismo límite, porque comparan un texto con otro texto.

**Por qué una descripción no alcanza**

Una descripción no puede decir que no. Puede ser precisa, completa y estar bien escrita. Aun así, cualquier resultado plausible la cumple si quien lo lee tiene buena voluntad. Y quien acaba de generar algo lo lee con muy buena voluntad.

Vi la diferencia en este mismo sitio. El portafolio tiene un segundo tema, un escritorio con ventanas que puedes arrastrar, redimensionar y cerrar. Lo conté con detalle en [TDD estricto contra un driver Playwright versionado](#blog/article/tdd-estricto-contra-driver-playwright-versionado). Ese trabajo se verificaba con un driver, que es un script que hace clic sobre la interfaz real en un navegador real. La regla fue que cada unidad de trabajo empezaba escribiendo en el driver la afirmación que fallaba. Por ejemplo, antes de que existiera el arrastre con límites, el driver ya intentaba sacar una ventana dos mil píxeles fuera de la pantalla y exigía que siguiera dentro del escritorio. Falló primero, por la razón correcta, y después pasó. Así el driver creció de 58 verificaciones a 64, luego a 88 y luego a 98.

Compara eso con la descripción equivalente: "las ventanas no deben salirse del escritorio". La frase es correcta. Pero no dice qué pasa en el borde inferior, donde está la barra de tareas. Tampoco dice qué pasa con una ventana que se encoge desde la esquina noroeste hasta su tamaño mínimo. La verificación sí lo dice, porque para escribirla tienes que elegir un número. Al elegir el número tomas la decisión que la frase dejaba abierta.

El segundo caso de ese trabajo es el que más me convenció. Al abrir la ventana de ayuda, el foco de teclado no llegaba a su barra de título. El manejador hacía dos actualizaciones de estado seguidas, React las agrupaba, y la segunda borraba el marcador que la primera acababa de escribir. Cada pieza, mirada sola, estaba bien. Una lectura del código lo habría aprobado y una prueba unitaria también. El defecto solo aparecía al hacer clic. Ninguna descripción, por buena que fuera, habría ayudado a verlo a quien genera el código, porque el defecto no estaba en el texto.

Hoy el sitio se construye así. Cada funcionalidad tiene un documento que nombra, antes de la primera línea de código, los comandos que la van a juzgar. Si hace falta un comando nuevo, el documento nombra también el archivo del driver que habrá que escribir. La bitácora de cada tarea registra el resultado que se observó, sin opiniones: 100 de 100 verificaciones de comportamiento, 8 de 8 capturas con cero píxeles distintos, 6 de 6 rutas. Una vez el encargo fue que el escritorio se viera mejor. La bitácora dejó anotado que la barra de tareas se quedaba en 40 píxeles porque el driver lo afirma. Esa restricción no venía en el encargo. Estaba en algo que se pone en rojo.

> Una descripción se cumple a ojos de quien la lee. Una prueba en rojo no depende de quién la lea.

Este punto es distinto del que defendí en [Ahora que la AI escribe código rápido, lo que te frena es cuánto puedes confiar en tus pruebas](#blog/article/con-ai-el-cuello-de-botella-son-tus-pruebas). Allí el problema era cuánto creerle a un conjunto de pruebas que ya existe. Aquí hablo del momento anterior, de lo que le entregas al agente para que empiece.

**Dos formas de trabajar con un agente**

![Dos ciclos. En el primero, describir, generar y leer se repiten mientras alguien juzga si el resultado se parece, y el ciclo sale cuando alguien opina que ya está. En el segundo, una prueba en rojo, generar y ejecutar se repiten mientras la prueba siga en rojo, y el ciclo sale cuando el comando pasa.](figure/agent-contract-loops "Esquema conceptual, no datos medidos. El primer ciclo termina con una opinión. El segundo termina con el resultado de un comando.")

En el primer ciclo se describe, se genera y se lee. La única salida es que alguien decida que el resultado ya se parece. Ese juicio es caro si lo hago yo y poco fiable si lo hace quien generó. En el segundo ciclo la prueba falla, el agente genera y la prueba pasa. La salida es un hecho: el comando terminó bien o terminó mal. El agente puede dar veinte vueltas sin que yo lea ninguna, y lo que me llega al final viene con su resultado.

El costo cambia de lugar. En el primer ciclo pago al final, leyendo, y pago en cada entrega. En el segundo pago al principio, escribiendo algo que falle. Esa pieza se queda en el repositorio y sirve para el cambio siguiente.

No todos los encargos llegan al segundo ciclo. Para ubicar cada uno uso una escalera de cuatro peldaños.

![Escalera de cuatro peldaños, del menos al más comprobable: uno, descripción. Dos, criterio escrito que una persona marca. Tres, ejemplo con su resultado esperado. Cuatro, comprobación que falla hoy y que juzga un comando. El cuarto peldaño está resaltado.](figure/agent-contract-ladder "Esquema conceptual, no datos medidos. La regla es subir el encargo un peldaño antes de entregarlo.")

De abajo hacia arriba están la descripción, un criterio escrito que una persona marca, un ejemplo con su resultado esperado y una comprobación que se ejecuta y hoy falla. Mi regla es subir el encargo un peldaño antes de entregarlo. No hace falta llegar arriba cada vez.

**Cómo aplicarlo**

**1. Si es un defecto, pide primero la reproducción que falla**

En este sitio, los mapas del sitio publicaban los enlaces a los artículos con una barra después del numeral, y el enrutador los leía sin ella. Descrito, el encargo sería "arregla los enlaces del blog". Convertido en algo que puede fallar, es un script que abre las dos variantes en un navegador y exige que las dos terminen en el artículo. Lo exige en la primera carga y también al cambiar la dirección en una pestaña ya abierta. Ese script está en el repositorio y se corre con cada funcionalidad.

Puedes probarlo esta semana. Toma el próximo defecto que le ibas a describir a un agente y pide como primer entregable la reproducción en rojo, sin el arreglo. Revísala. Solo después pide el arreglo.

**2. Si es una regla de contenido, conviértela en una búsqueda**

El currículo en inglés de este sitio salía con fechas en español. "El CV en inglés no debe tener español" es una descripción. Hoy el generador del CV falla si llegan palabras en español a la versión en inglés. Antes de darlo por bueno, se comprobó que fallaba con el mapeo anterior. Muchas reglas de redacción, de formato o de cumplimiento se pueden escribir igual: una lista de lo que no puede aparecer, o de lo que tiene que aparecer, y un comando que la recorre.

**3. Si algo no puede cambiar, pon una comprobación que lo vigile**

A veces el encargo es cambiar una cosa sin tocar otra. En ese caso conviene volver ejecutable la otra, la que no debe moverse. Aquí es el tema periódico. Hay ocho capturas, cuatro anchos por dos idiomas, que se comparan contra imágenes versionadas, y la comprobación aprueba solo con cero píxeles distintos. Así el agente puede trabajar en el escritorio con libertad, porque lo que no debe pasar está escrito en un lugar que avisa sin que nadie le pregunte.

**4. Si diriges un equipo, pregunta qué va a estar en rojo**

Antes de aprobar un encargo, para una persona o para un agente, pregunta qué comprobación estará fallando cuando empiece el trabajo y pasando cuando termine. Si la respuesta es "lo reviso yo al final", el encargo está en el peldaño de abajo. A veces ese es el peldaño correcto. Conviene saberlo antes de comprometer una fecha.

**Dónde puedo estar equivocado**

Primero, no todo tiene una comprobación barata. El encargo de que el escritorio "se vea mejor" no la tuvo ni podía tenerla. Tampoco existe una para saber si un texto está bien escrito o si una funcionalidad merece existir. Los ensayos de este blog pasan comprobaciones de extensión, de enlaces y de que las figuras carguen. Ninguna dice si el argumento vale.

En esos casos hago dos cosas. Vuelvo ejecutable el borde, es decir, lo que no debe romperse mientras alguien mejora lo que no se puede medir. Y dejo el juicio a una persona concreta, sin fingir que una métrica la reemplaza.

Segundo, y más serio: el agente cumple una comprobación equivocada con la misma fidelidad que una correcta. Tengo tres casos en este mismo sitio. En el primero, el driver del escritorio probaba los botones de cerrar, minimizar y maximizar a través de un atajo de pruebas. Pasaba, y mientras tanto los botones no respondían al puntero real. En el segundo, la comprobación de píxeles estuvo meses aprobando cualquier captura cuyo alto hubiera cambiado, e imprimía un conteo negativo de píxeles junto a "ALL PASSED". En el tercero, un barrido de redacción devolvió cero coincidencias mientras un artículo publicaba identificadores reales, y el informe del agente certificaba que todo estaba limpio. Ese lo conté en [El grep de redacción que no puede ver un identificador en camelCase](#blog/article/grep-redaccion-no-ve-camelcase). En los tres, el trabajo cumplía exactamente lo que la comprobación pedía.

Con un agente ese riesgo crece. El agente llega a tener todas las pruebas pasando sin usar la aplicación a mano, y es al usarla a mano donde una persona tropieza con el botón que no responde.

La defensa que conozco tiene tres partes. La primera es ver fallar la comprobación antes de confiar en ella. Para volver a creerle a la comprobación de píxeles hubo que alargar a propósito un título en español y ver que fallaba con 8,3 millones de píxeles distintos, y solo en las cuatro capturas en español. La segunda es que la comprobación recorra el camino del usuario y no un atajo. La tercera es que la escriba o la revise alguien distinto de quien va a satisfacerla. Si el agente escribe la prueba y el código en el mismo paso, y nadie lee la prueba, estoy otra vez en el primer ciclo con un paso más.

Tercero, el costo. Para un cambio que se hace una vez y se descarta, escribir la comprobación cuesta más que leer el resultado. Mi argumento vale para trabajo que alguien va a volver a tocar.

Cuarto, el alcance de mi evidencia. Es un solo sitio, construido por mí con agentes. No hice el experimento de repetir el mismo encargo con y sin comprobación para comparar, así que no tengo una medición de cuánto mejora el resultado. Lo que tengo es dónde aparecieron los defectos: en lo que ninguna comprobación ejecutaba, o en lo que una comprobación ejecutaba mal.

Me quedo con una pregunta que me hago antes de escribir el encargo: qué va a estar en rojo cuando el agente empiece.`,
  contentEn: `What an AI agent delivers depends on the check it works against. It depends much less on how well the request is worded. A prompt describes the goal. A failing test tells the agent exactly what is missing. So if I have an hour to improve the outcome, that hour pays better spent on the check than on the wording.

I set one condition. The check has to exist before the work starts, and it has to be failing. I call that "being red", after the color tools use to mark a failing test. A test written afterwards, alongside the code, measures what the code already does. A test written beforehand says what is missing.

**What people usually think**

Most people think the result depends on the request. If the agent delivered something other than what you wanted, it was missing context. So you explain it better, give examples, write a longer spec or keep an instructions file. I find that reasonable and I agree with part of it. A vague request produces vague work. This site has its instructions file and its spec documents, like any project built with agents.

That view leaves one thing unanswered: how the agent knows it is finished. With a description, it is finished when what it produced looks like what was described. The one judging that likeness is the same agent that produced it. Then I judge it, by reading. Both readings share a limit, because they compare one text with another text.

**Why a description is not enough**

A description cannot say no. It can be precise, complete and well written. Any plausible result still meets it if the reader is feeling generous. And whoever has just generated something reads it very generously.

I saw the difference on this very site. The portfolio has a second theme, a desktop with windows you can drag, resize and close. I told that story in detail in [Strict TDD Against a Committed Playwright Driver](#blog/article/tdd-estricto-contra-driver-playwright-versionado). That work was checked with a driver, which is a script that clicks the real interface in a real browser. The rule was that every unit of work began by writing, in the driver, the assertion that failed. For example, before dragging within limits existed, the driver was already trying to push a window two thousand pixels off the screen and demanding that it stay inside the desktop. It failed first, for the right reason, and then it passed. That is how the driver grew from 58 checks to 64, then to 88, then to 98.

Compare that with the equivalent description: "windows must not leave the desktop". The sentence is correct. But it does not say what happens at the bottom edge, where the taskbar sits. It does not say what happens to a window being shrunk from its north-west corner down to its minimum size either. The check does say it, because to write it you have to pick a number. When you pick the number, you make the decision the sentence left open.

The second case from that work is the one that convinced me most. When the help window opened, keyboard focus never reached its title bar. The handler made two state updates in a row, React batched them, and the second one wiped the marker the first had just written. Each piece, looked at alone, was fine. A read of the code would have approved it, and so would a unit test. The defect only showed up when you clicked. No description, however good, would have helped whoever generates the code see it, because the defect was not in the text.

The site is built this way now. Each feature has a document that names, before the first line of code, the commands that will judge it. If a new command is needed, the document also names the driver file that will have to be written. Each task's log records the result that was observed, with no opinions: 100 of 100 behavior checks, 8 of 8 captures at zero differing pixels, 6 of 6 routes. Once the request was to make the desktop look better. The log noted that the taskbar stayed at 40 pixels because the driver asserts it. That constraint was not in the request. It was in something that goes red.

> A description is satisfied in the eyes of its reader. A red test does not depend on who reads it.

This is a different point from the one I made in [Now That AI Writes Code Fast, What Slows You Down Is How Much You Can Trust Your Tests](#blog/article/con-ai-el-cuello-de-botella-son-tus-pruebas). That essay was about how far to trust a set of tests that already exists. This one is about the moment before, about what you hand the agent so it can start.

**Two ways of working with an agent**

![Two loops. In the first, describe, generate and read repeat while someone judges whether the result is close enough, and the loop ends when someone feels it is done. In the second, a failing test, generate and run repeat while the test is still red, and the loop ends when the command passes.](figure/agent-contract-loops "Conceptual sketch, not measured data. The first loop ends on an opinion. The second ends on the result of a command.")

In the first loop you describe, the agent generates and someone reads. The only way out is someone deciding the result is close enough. That judgement is expensive if I make it and unreliable if the generator makes it. In the second loop the test fails, the agent generates and the test passes. The way out is a fact: the command succeeded or it did not. The agent can go round twenty times without my reading any of it, and what reaches me at the end comes with its result attached.

The cost moves. In the first loop I pay at the end, by reading, and I pay on every delivery. In the second I pay up front, by writing something that fails. That piece stays in the repository and works for the next change too.

Not every request can reach the second loop. To place each one I use a ladder with four rungs.

![A ladder with four rungs, from least to most checkable: one, a description. Two, a written criterion a person ticks. Three, an example with its expected result. Four, a check that fails today and is judged by a command. The fourth rung is highlighted.](figure/agent-contract-ladder "Conceptual sketch, not measured data. The rule is to move the request up one rung before handing it over.")

From the bottom up there is the description, a written criterion a person ticks, an example with its expected result, and a check that runs and fails today. My rule is to move the request up one rung before handing it over. It does not have to reach the top every time.

**How to apply it**

**1. If it is a defect, ask for the failing reproduction first**

On this site, the sitemaps published article links with a slash after the hash sign, and the router read them without it. As a description, the request would be "fix the blog links". As something that can fail, it is a script that opens both variants in a browser and demands that both land on the article. It demands that on first load and also when the address changes in a tab that is already open. That script is in the repository and runs with every feature.

You can try this within the week. Take the next defect you were going to describe to an agent and ask for the red reproduction as the first deliverable, with no fix. Review it. Only then ask for the fix.

**2. If it is a content rule, turn it into a search**

The English CV on this site was coming out with dates in Spanish. "The English CV must contain no Spanish" is a description. Today the CV generator fails if Spanish words reach the English version. Before that was accepted, it was shown to fail against the old mapping. Many rules about wording, format or compliance can be written the same way: a list of what must not appear, or of what must appear, and a command that walks the list.

**3. If something must not change, add a check that watches it**

Sometimes the request is to change one thing without touching another. In that case, make the other one executable, the one that must not move. Here that is the newspaper theme. Eight captures, four widths by two languages, are compared against committed images, and the check passes only at zero differing pixels. That lets the agent work freely on the desktop, because what must not happen is written somewhere that speaks up without being asked.

**4. If you lead a team, ask what will be red**

Before approving a request, for a person or for an agent, ask which check will be failing when the work starts and passing when it ends. If the answer is "I will review it at the end", the request sits on the bottom rung. Sometimes that is the right rung. It is worth knowing before you commit to a date.

**Where I could be wrong**

First, not everything has a cheap check. The request to make the desktop "look better" had none and could not have had one. There is none for whether a text is well written either, or for whether a feature deserves to exist. The essays on this blog pass checks for length, for links and for figures that load. None of those says whether the argument holds.

In those cases I do two things. I make the edge executable, meaning whatever must not break while someone improves the part that cannot be measured. And I leave the judgement with a specific person, without pretending a metric replaces them.

Second, and more serious: the agent meets a wrong check as faithfully as a right one. I have three cases on this same site. In the first, the desktop driver tested the close, minimize and maximize buttons through a test shortcut. It passed, and all the while the buttons did not respond to a real pointer. In the second, the pixel check spent months approving any capture whose height had changed, and it printed a negative pixel count next to "ALL PASSED". In the third, a redaction sweep returned zero hits while a post was publishing real identifiers, and the agent's report certified that everything was clean. I told that one in [The Redaction Grep That Cannot See a camelCased Identifier](#blog/article/grep-redaccion-no-ve-camelcase). In all three, the work met exactly what the check asked for.

With an agent that risk grows. The agent gets every test passing without using the application by hand, and using it by hand is where a person trips over the button that does nothing.

The defence I know has three parts. The first is to watch the check fail before trusting it. To believe the pixel check again, a Spanish title had to be lengthened on purpose, and the check had to fail with 8.3 million differing pixels, and only on the four Spanish captures. The second is that the check goes through the user's path and not a shortcut. The third is that someone other than whoever will satisfy it writes it or reviews it. If the agent writes the test and the code in one step, and nobody reads the test, I am back in the first loop with one extra step.

Third, the cost. For a change made once and thrown away, writing the check costs more than reading the result. My argument holds for work someone will touch again.

Fourth, how far my evidence reaches. It is one site, built by me with agents. I did not run the experiment of repeating the same request with and without a check to compare, so I have no measurement of how much the result improves. What I have is where the defects showed up: in what no check executed, or in what a check executed badly.

I keep one question that I ask myself before writing the request: what will be red when the agent starts.`,
  relatedIds: [
    'strict-tdd-committed-playwright-driver',
    'redaction-grep-misses-camelcase',
    'ai-bottleneck-is-your-tests',
  ],
}
