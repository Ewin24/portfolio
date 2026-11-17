import type { BlogPost } from '../../types'

export const interactiveFiguresInsteadOfSvg: Omit<BlogPost, 'readingTime'> = {
  id: 'interactive-figures-instead-of-svg',
  slug: 'figuras-interactivas-en-lugar-de-svg',
  title: 'Reemplacé 40 archivos SVG por un componente propio: el blog pesa 22 kB más y aun así fue la decisión correcta',
  titleEn: 'I Replaced 40 SVG Files With an In-House Component: the Blog Got 22 kB Heavier and It Was Still the Right Call',
  date: '2026-11-17',
  tags: ['React', 'frontend', 'visualización', 'accesibilidad', 'AI'],
  category: 'arquitectura',
  featured: false,
  excerpt:
    'Las 21 figuras de este blog eran 40 archivos SVG escritos a mano: no seguían el tema oscuro, se encogían en el teléfono y casi todas existían dos veces, una por idioma. Las reemplacé por un componente propio que dibuja desde una descripción tipada y se presenta por pasos. El total de JavaScript y CSS con gzip subió de 444,549 a 466,634 bytes. Este caso cuenta qué se compró con esos 22,085 bytes, por qué una librería de gráficos no servía y cómo se repartió el trabajo entre agentes de AI.',
  excerptEn:
    'The 21 figures on this blog were 40 hand-written SVG files: they ignored the dark theme, shrank on a phone, and nearly all of them existed twice, once per language. I replaced them with an in-house component that draws from a typed description and plays step by step. Total JavaScript and CSS after gzip went from 444,549 to 466,634 bytes. This case study covers what those 22,085 bytes bought, why a chart library was the wrong tool, and how the work was split among AI agents.',
  content: `Este blog tenía 21 figuras. En el repositorio eran 40 archivos SVG escritos a mano: 19 figuras existían dos veces, una por idioma, y dos existían una sola vez. Cada artículo las cargaba como una imagen normal. Las reemplacé todas por un componente propio que dibuja cada figura a partir de una descripción tipada, sigue el tema del sitio y se reproduce paso a paso, como una diapositiva que se va armando.

Conviene dar primero el resultado incómodo: el sitio ahora pesa más. La suma de JavaScript y CSS comprimidos pasó de 444,549 a 466,634 bytes. Si el objetivo hubiera sido enviar menos bytes, este cambio sería un error. Este artículo cuenta qué se compró con esos 22,085 bytes.

El código lo escribieron agentes de AI en una sola sesión de trabajo, bajo mi dirección. Yo pedí el cambio, elegí entre las opciones que me presentaron y puse una condición: que las figuras se pudieran presentar por pasos. No tecleé los renderizadores, y la forma de repartir ese trabajo es parte de lo que el caso enseña.

Los archivos tenían cuatro defectos, visibles en el historial del repositorio.

El primero es el tema. Un SVG cargado con una etiqueta de imagen no puede leer las variables CSS de la página que lo contiene. Cada archivo llevaba entonces los colores del tema claro escritos como valores fijos. En modo oscuro las figuras se quedaban como tarjetas claras, y la hoja de estilos del tema oscuro tenía una regla dedicada a ponerles detrás un fondo de papel claro.

El segundo es el tamaño. De los 40 archivos, 39 eran dibujos de 600 unidades de ancho y uno de 720. Un dibujo de ancho fijo se encoge entero cuando la pantalla es más angosta, y el texto se encoge con él. La primera figura del blog tenía rótulos de 13 unidades en un dibujo de 720: en un teléfono de 375 px de ancho, aun sin descontar márgenes, eso es menos de 7 px.

El tercero es la duplicación. Un SVG lleva sus palabras adentro, así que cada figura con texto era un archivo en español y otro en inglés. Corregir una figura era corregir dos archivos.

El cuarto son las coordenadas. Cada rectángulo y cada texto tenía su posición escrita a mano, y nada comprueba que un texto no caiga encima de una línea. Pasó: en una de las figuras, el rótulo de una serie quedó sobre una línea punteada y hubo que moverlo a mano.

**El enfoque equivocado**

Mi pedido dejaba abiertas dos puertas: crear la funcionalidad o buscar una librería que ya la tuviera. La segunda parecía la sensata: dibujar gráficos es un problema resuelto.

Antes de elegir, el agente con el que trabajaba hizo dos cuentas, y esas cuentas decidieron. La primera fue el peso publicado de las candidatas, comprimido con gzip: uPlot 21 kB, Chart.js 68 kB, React Flow 86 kB, Observable Plot 124 kB, Mermaid 155 kB y Recharts 173 kB.

La segunda fue más importante: qué eran en realidad las 21 figuras. Cuatro eran gráficos de barras con datos. Las otras 17 eran esquemas conceptuales: una escalera, capas anidadas, matrices de dos por dos, carriles con cajas y flechas. Una librería de gráficos dibuja ejes y series, y nada de eso lo es. Habría resuelto 4 de 21 figuras, menos de la quinta parte, y las otras 17 habrían seguido siendo archivos hechos a mano. Las librerías de diagramas sí dibujan cajas y flechas, pero son las más pesadas de la lista y traen un estilo visual propio que no es el de este sitio.

El peso por sí solo no descartaba nada: la más liviana de esas librerías pesa casi lo mismo que lo que terminé agregando. La razón real fue que ninguna dibujaba lo que el blog publica. Con esas dos cuentas delante, el agente recomendó un componente propio. Decidí seguir la recomendación, sin instalar ninguna dependencia nueva.

Mi pedido traía además una expectativa equivocada: que así nos ahorrábamos los SVG. No del todo. El navegador sigue dibujando SVG donde hace falta geometría, como las flechas, los ejes y las curvas. Lo que desapareció fueron las coordenadas puestas a mano y los archivos duplicados.

**La solución**

Un artículo coloca una figura con la misma sintaxis de imagen que ya usaba, sola en su párrafo. La diferencia es la ruta: si empieza con \`figure/\` y sigue un identificador, es una figura interactiva. El texto alternativo y el pie se quedan en el artículo, cada uno en su idioma. El conversor de markdown reconoce esa ruta y, en lugar de una imagen, deja un nodo vacío que lleva el identificador y el texto alternativo:

\`\`\`ts
const figureId = /^figure\\/([\\w-]+)$/.exec(src)?.[1]
if (figureId) {
  return \`<figure data-figure="\${figureId}"><div class="figure-mount" data-alt="\${alt}"></div>\${caption}</figure>\`
}
\`\`\`

Cualquier otra ruta sigue siendo una imagen común. Y si el identificador no existe, o su descripción está mal armada, el lector ve el texto alternativo y el pie, nunca una caja vacía.

![Seis cajas unidas por flechas en dos filas: sintaxis de imagen, conversor y cuerpo del artículo; después portal, armazón y renderizador.](figure/figures-embed-pipeline "Esquema conceptual, no datos medidos: el camino de una figura desde el markdown hasta la pantalla.")

El identificador apunta a una descripción: un objeto de TypeScript que dice qué tipo de figura es y qué contiene. Cada texto visible viene en los dos idiomas dentro del mismo objeto, y cada elemento declara en qué paso aparece. Estas son las barras de una figura del ensayo sobre el presupuesto de contexto:

\`\`\`ts
bars: [
  { label: { es: 'entrada normal (precio base)', en: 'normal input (base price)' }, value: 1, display: '1×', tone: 'muted', step: 1 },
  { label: { es: 'escritura en caché, 5 minutos', en: 'cache write, 5 minutes' }, value: 1.25, display: '1.25×', step: 2 },
  { label: { es: 'escritura en caché, 1 hora', en: 'cache write, 1 hour' }, value: 2, display: '2×', step: 3 },
  { label: { es: 'lectura de caché', en: 'cache read' }, value: 0.1, display: '0.1×', tone: 'accent', strong: true, step: 4 },
],
\`\`\`

Las descripciones viven en TypeScript y no en JSON dentro del artículo para que el compilador las revise: cada una se declara con el tipo de su renderizador, y una barra sin valor o un rótulo sin su versión en inglés no compila.

Hay nueve renderizadores, cada uno en su archivo. Ni ellos ni las descripciones se registran en una lista central: las dos carpetas se descubren con \`import.meta.glob\`, así que agregar un tipo de figura o las figuras de un artículo es crear un archivo y no tocar ninguno compartido.

El cuerpo del artículo sigue siendo un único contenedor con el HTML que produce el conversor, que es lo que los estilos de la prosa esperan. Las figuras se montan con portales de React dentro de los nodos vacíos. Para el navegador están dentro del texto; para React pertenecen al árbol de la aplicación, y por eso conocen el idioma activo.

Los pasos son datos. Un renderizador dibuja siempre todos sus elementos y le pone a cada uno tres atributos con esta función:

\`\`\`ts
export function reveal(at: number, step: number, kind: RevealKind = 'box') {
  return { 'data-step': at, 'data-on': at <= step, 'data-reveal': kind }
}
\`\`\`

La hoja de estilos hace el resto:

\`\`\`css
.fig [data-on='false'] {
  opacity: 0;
  visibility: hidden;
  transition: opacity 180ms ease, transform 180ms ease, visibility 0s 180ms;
}
.fig [data-reveal='box'][data-on='false'] { transform: translateY(6px); }
\`\`\`

No hay librería de animación en esto: son transiciones de CSS que reaccionan a un atributo. Como los elementos ocultos conservan su lugar, avanzar un paso no mueve nada de sitio.

Alrededor del dibujo hay un armazón común que ningún renderizador repite. Reproduce la figura una sola vez, la primera vez que el 30 % de ella está en pantalla, a 2.4 segundos por paso, y se detiene ante cualquier interacción. Tiene botones de anterior, siguiente, reiniciar y pausa, responde a las flechas del teclado y muestra una línea de narración por paso en el idioma del lector. Si el sistema pide reducir el movimiento, la figura aparece en su estado final y los controles siguen funcionando. Los gráficos de datos ofrecen además sus números como tabla.

Los colores son siempre tokens de diseño del sitio, nunca valores fijos, así que una figura no tiene reglas propias para el tema oscuro ni para XP. El diseño es HTML y CSS con texto real que se acomoda al ancho del artículo.

**La sorpresa fue React 19.** El contenedor del artículo recibe su HTML con \`dangerouslySetInnerHTML\`, que toma un objeto con la cadena adentro. Escribir ese objeto en línea crea uno nuevo en cada render. React 19 vuelve a escribir \`innerHTML\` cada vez que ese objeto cambia de identidad, aunque la cadena sea la misma. Al reescribirlo se reemplazan todos los nodos del artículo, incluidos los nodos vacíos, y los portales quedaban montados en elementos que ya no estaban en el documento. El arreglo fue una línea:

\`\`\`tsx
// React 19 writes innerHTML again whenever this object changes identity,
// even with the same string, and that would replace the mount nodes under
// the portals. One object per HTML string keeps them.
const inner = useMemo(() => ({ __html: html }), [html])
\`\`\`

**Cómo se repartió el trabajo.** Un agente construyó primero el núcleo: el cambio en el conversor, el registro, el armazón con el reproductor y los tres primeros tipos, con diez figuras migradas. Solo cuando eso estuvo verificado, cuatro agentes trabajaron en paralelo sobre los tipos restantes y las otras once figuras. Cada uno tenía un archivo por renderizador y una hoja de estilos propia, así que ningún archivo compartido se editó al mismo tiempo. Limitar lo que cada agente puede tocar es una de las capas que describo en [el ensayo sobre el arnés](#blog/article/el-modelo-es-la-parte-facil-el-arnes-decide). Cada parte se comprobó con drivers que abren el sitio en un navegador y con capturas de pantalla en los temas claro, oscuro y XP, a 375 y 1440 px de ancho.

**El impacto**

Los 40 archivos SVG salieron de la carpeta pública: 116,178 bytes. Las 21 figuras siguen en sus artículos y los 19 pares duplicados ya no existen. Pero esos bytes nunca viajaban juntos. Cada SVG pesaba entre 1.5 y 6 kB aproximadamente y lo descargaba solo el artículo que lo usaba. El componente, en cambio, va en el código del blog y lo paga cada visita al blog, tenga o no figuras el artículo que se abre.

![Dos barras horizontales con el total de JavaScript y CSS con gzip: 444,549 bytes antes, con los 40 archivos SVG, y 466,634 bytes después, con el componente propio.](figure/figures-cost-bytes "Medido en esta rama contra la rama principal con la build de producción, sumando JavaScript y CSS con gzip.")

Medido con la build de producción en esta rama contra la principal, en la misma máquina: 22,085 bytes más, cerca de un 5 %. Sin comprimir, el fragmento del blog creció de 105,858 a 160,293 bytes y el CSS de 62,694 a 87,299.

Dicho sin adorno: si la meta era menos bytes, este cambio va en la dirección contraria. Esto es lo que compraron:

- Las figuras siguen el tema: en oscuro y en XP usan los mismos tokens que el texto.
- En una pantalla de 375 px no hay texto por debajo de 12 px ni desborde horizontal. Los drivers lo revisan.
- Una sola descripción sirve a los dos idiomas.
- Cada figura se presenta por pasos, con una línea de narración por paso.
- Hay 566 comprobaciones automáticas repartidas en cinco drivers. Son comprobaciones que pueden fallar, que es lo que pido en [el ensayo sobre darle al agente algo que pueda fallar](#blog/article/dale-al-agente-algo-que-pueda-fallar).

Queda un límite conocido, anotado en el código: el registro carga todos los renderizadores y descripciones en el fragmento del blog, y cargarlos por artículo no está hecho.

Lo que no sé: no existe ninguna medición de cómo leen las personas estas figuras ni de su rendimiento en dispositivos reales. Todo lo anterior se midió en la build y en un navegador automatizado.

**Lecciones**

**Mide el costo que agregas e imprímelo junto al beneficio.** Creía que me ahorraba los SVG. La build dice que agregué 22,085 bytes. Publicar ese número al lado de la lista de mejoras es lo que le permite a otra persona decidir si el intercambio le sirve. Es la misma regla de [publicar lo que mediste](#blog/article/publica-lo-que-mediste), aplicada cuando el número no favorece.

**Una descripción que es dato se puede revisar y traducir; un dibujo no.** El compilador rechaza una descripción a la que le falta un idioma, y el registro rechaza un elemento puesto en un paso que no existe. Un archivo SVG con un rótulo encima de una línea era perfectamente válido.

**Partir el trabajo paralelo por archivo fue lo que lo hizo seguro.** Cuatro agentes a la vez funcionaron porque el diseño no tenía ningún archivo que dos de ellos necesitaran editar.

**Una figura por pasos necesita una narración que solo repita lo que el artículo ya dice.** La línea de cada paso es texto nuevo, y el texto nuevo puede afirmar cosas. En la revisión apareció una narración que le atribuía una proporción a un esquema conceptual, y hubo que reescribirla.`,
  contentEn: `This blog had 21 figures. In the repository they were 40 hand-written SVG files: 19 figures existed twice, once per language, and two existed once. Each article loaded them as ordinary images. I replaced all of them with an in-house component that draws each figure from a typed description, follows the site theme, and plays step by step, like a slide that builds.

The uncomfortable result goes first: the site is heavier now. Compressed JavaScript and CSS went from 444,549 to 466,634 bytes. If the goal had been to ship fewer bytes, this change would be a mistake. This article covers what those 22,085 bytes bought.

AI agents wrote the code in a single working session, under my direction. I asked for the change, chose among the options they put in front of me, and set one condition: the figures had to be presentable in steps. I did not type the renderers, and the way that work was split is part of what this case teaches.

The files had four defects, all visible in the repository history.

The first is the theme. An SVG loaded through an image tag cannot read the CSS variables of the page that contains it. So every file carried the light theme's colours as fixed values. In dark mode the figures stayed light cards, and the dark theme stylesheet had a rule whose only job was to put a light paper background behind them.

The second is size. Of the 40 files, 39 were drawings 600 units wide and one was 720. A fixed-width drawing shrinks as a whole when the screen is narrower, and its text shrinks with it. The first figure on the blog had 13-unit labels in a 720-unit drawing: on a phone 375 px wide, even before subtracting any margin, that is under 7 px.

The third is duplication. An SVG carries its words inside it, so every figure with text was one file in Spanish and another in English. Fixing a figure meant fixing two files.

The fourth is coordinates. Every rectangle and every piece of text had its position written by hand, and nothing checks that a label does not land on top of a line. It happened: in one of the figures, a series label ended up over a dashed line and had to be moved by hand.

**The wrong approach**

My request left two doors open: build the feature or find a library that already had it. The second looked like the sensible one: drawing charts is a solved problem.

Before choosing, the agent I was working with ran two counts, and those counts made the decision. The first was the published size of the candidates, after gzip: uPlot 21 kB, Chart.js 68 kB, React Flow 86 kB, Observable Plot 124 kB, Mermaid 155 kB and Recharts 173 kB.

The second mattered more: what the 21 figures actually were. Four were bar charts with data. The other 17 were conceptual sketches: a ladder, nested layers, two-by-two matrices, lanes of boxes and arrows. A chart library draws axes and series, and none of those are that. It would have covered 4 of 21 figures, less than a fifth, and the other 17 would still have been hand-made files. Diagram libraries do draw boxes and arrows, but they are the heaviest on the list and they bring a visual style of their own that is not this site's.

Weight alone ruled nothing out: the lightest of those libraries weighs about the same as what I ended up adding. The real reason was that none of them drew what this blog publishes. With both counts on the table, the agent recommended an in-house component. I decided to follow the recommendation, with no new dependency installed.

My request also carried a wrong expectation: that this would save us the SVGs. Not quite. The browser still draws SVG wherever geometry is needed, such as arrows, axes and curves. What went away were the hand-placed coordinates and the duplicated files.

**The solution**

An article places a figure with the same image syntax it already used, alone in its paragraph. The difference is the path: if it starts with \`figure/\` followed by an id, it is an interactive figure. The alt text and the caption stay in the article, each in its own language. The markdown parser recognises that path and, instead of an image, leaves an empty node that holds the id and the alt text:

\`\`\`ts
const figureId = /^figure\\/([\\w-]+)$/.exec(src)?.[1]
if (figureId) {
  return \`<figure data-figure="\${figureId}"><div class="figure-mount" data-alt="\${alt}"></div>\${caption}</figure>\`
}
\`\`\`

Any other path is still a plain image. And if the id does not exist, or its description is malformed, the reader gets the alt text and the caption, never an empty box.

![Six boxes joined by arrows in two rows: image syntax, parser and article body; then portal, shell and renderer.](figure/figures-embed-pipeline "Conceptual sketch, not measured data: the path of a figure from markdown to the screen.")

The id points to a description: a TypeScript object that says what type of figure it is and what it contains. Every visible string comes in both languages inside the same object, and every element declares the step on which it appears. These are the bars of a figure from the essay on the context budget:

\`\`\`ts
bars: [
  { label: { es: 'entrada normal (precio base)', en: 'normal input (base price)' }, value: 1, display: '1×', tone: 'muted', step: 1 },
  { label: { es: 'escritura en caché, 5 minutos', en: 'cache write, 5 minutes' }, value: 1.25, display: '1.25×', step: 2 },
  { label: { es: 'escritura en caché, 1 hora', en: 'cache write, 1 hour' }, value: 2, display: '2×', step: 3 },
  { label: { es: 'lectura de caché', en: 'cache read' }, value: 0.1, display: '0.1×', tone: 'accent', strong: true, step: 4 },
],
\`\`\`

Descriptions live in TypeScript rather than as JSON inside the article so the compiler checks them: each one is declared with its renderer's type, and a bar without a value or a label missing its English version does not compile.

There are nine renderers, each in its own file. Neither they nor the descriptions are registered in a central list: both folders are discovered with \`import.meta.glob\`, so adding a figure type or an article's figures means creating one file and touching no shared one.

The article body is still a single container holding the HTML the parser produces, which is what the prose styles expect. The figures are mounted with React portals inside the empty nodes. To the browser they sit inside the text; to React they belong to the application tree, which is how they know the active language.

Steps are data. A renderer always draws every one of its elements and puts three attributes on each with this function:

\`\`\`ts
export function reveal(at: number, step: number, kind: RevealKind = 'box') {
  return { 'data-step': at, 'data-on': at <= step, 'data-reveal': kind }
}
\`\`\`

The stylesheet does the rest:

\`\`\`css
.fig [data-on='false'] {
  opacity: 0;
  visibility: hidden;
  transition: opacity 180ms ease, transform 180ms ease, visibility 0s 180ms;
}
.fig [data-reveal='box'][data-on='false'] { transform: translateY(6px); }
\`\`\`

No animation library is involved: these are CSS transitions reacting to an attribute. Because hidden elements keep their place, moving one step forward shifts nothing on the page.

Around the drawing there is a shared shell that no renderer repeats. It plays the figure once, the first time 30 % of it is on screen, at 2.4 seconds per step, and stops on any interaction. It has previous, next, restart and pause buttons, responds to the arrow keys, and shows one line of narration per step in the reader's language. If the system asks for reduced motion, the figure appears in its final state and the controls keep working. Data charts also offer their numbers as a table.

Colours are always the site's design tokens, never fixed values, so a figure has no rules of its own for the dark theme or for XP. The layout is HTML and CSS with real text that adapts to the width of the article.

**The surprise was React 19.** The article container receives its HTML through \`dangerouslySetInnerHTML\`, which takes an object with the string inside. Writing that object inline creates a new one on every render. React 19 writes \`innerHTML\` again whenever that object changes identity, even when the string is the same. Rewriting it replaces every node of the article, the empty nodes included, and the portals were left mounted in elements that were no longer in the document. The fix was one line:

\`\`\`tsx
// React 19 writes innerHTML again whenever this object changes identity,
// even with the same string, and that would replace the mount nodes under
// the portals. One object per HTML string keeps them.
const inner = useMemo(() => ({ __html: html }), [html])
\`\`\`

**How the work was split.** One agent built the core first: the parser change, the registry, the shell with its player, and the first three types, with ten figures migrated. Only once that was verified did four agents work in parallel on the remaining types and the other eleven figures. Each had one file per renderer and a stylesheet of its own, so no shared file was edited at the same time. Limiting what each agent may touch is one of the layers I describe in [the essay on the harness](#blog/article/el-modelo-es-la-parte-facil-el-arnes-decide). Every part was checked by drivers that open the site in a browser and by screenshots in the light, dark and XP themes, at 375 and 1440 px wide.

**The impact**

The 40 SVG files left the public folder: 116,178 bytes. The 21 figures are still in their articles and the 19 duplicated pairs are gone. But those bytes never travelled together. Each SVG weighed roughly 1.5 to 6 kB and was downloaded only by the article that used it. The component, by contrast, ships in the blog's code and every blog visit pays for it, whether or not the article being opened has figures.

![Two horizontal bars with total JavaScript and CSS after gzip: 444,549 bytes before, with the 40 SVG files, and 466,634 bytes after, with the in-house component.](figure/figures-cost-bytes "Measured on this branch against the main branch with the production build, summing JavaScript and CSS after gzip.")

Measured with the production build on this branch against main, on the same machine: 22,085 bytes more, close to 5 %. Uncompressed, the blog chunk grew from 105,858 to 160,293 bytes and the CSS from 62,694 to 87,299.

Put plainly: if the target was fewer bytes, this change goes the other way. This is what they bought:

- Figures follow the theme: in dark and in XP they use the same tokens as the text.
- On a 375 px screen no text renders below 12 px and nothing overflows sideways. The drivers check it.
- One description serves both languages.
- Every figure is presented in steps, with one line of narration per step.
- There are 566 automated checks across five drivers. They are checks that can fail, which is what I ask for in [the essay on giving the agent something that can fail](#blog/article/dale-al-agente-algo-que-pueda-fallar).

One known limit remains, noted in the code: the registry loads every renderer and description into the blog chunk, and loading them per article is not done.

What I do not know: there is no measurement of how people read these figures, nor of how they perform on real devices. Everything above was measured on the build and in an automated browser.

**Lessons**

**Measure the cost you are adding and print it next to the benefit.** I believed I was saving the SVGs. The build says I added 22,085 bytes. Publishing that number beside the list of improvements is what lets someone else decide whether the trade works for them. It is the same rule as [publishing what you measured](#blog/article/publica-lo-que-mediste), applied when the number is not flattering.

**A description that is data can be checked and translated; a drawing cannot.** The compiler rejects a description that is missing a language, and the registry rejects an element placed on a step that does not exist. An SVG file with a label sitting on top of a line was perfectly valid.

**Splitting parallel work by file is what made it safe.** Four agents at once worked because the design had no file that two of them needed to edit.

**A figure that plays in steps needs narration that only repeats what the article already says.** Each step's line is new text, and new text can make claims. Review turned up a narration line that assigned a proportion to a conceptual sketch, and it had to be reworded.`,
  relatedIds: [
    'the-harness-decides',
    'give-the-agent-something-that-fails',
    'publish-what-you-measured',
  ],
}
