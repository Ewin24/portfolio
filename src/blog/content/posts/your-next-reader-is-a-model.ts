import type { BlogPost } from '../../types'

export const yourNextReaderIsAModel: Omit<BlogPost, 'readingTime'> = {
  id: 'your-next-reader-is-a-model',
  slug: 'tu-proximo-lector-es-un-modelo',
  series: 'Working with AI',
  seriesOrder: 8,
  title: 'Escribe frases que se entiendan solas, porque un asistente de AI las va a sacar de tu página',
  titleEn: 'Write Sentences That Make Sense on Their Own, Because an AI Assistant Will Lift Them Out of Your Page',
  date: '2026-11-17',
  tags: ['AI', 'escritura', 'publicar', 'credibilidad', 'portafolio'],
  category: 'ensayo',
  featured: false,
  excerpt:
    'Cuando un asistente responde sobre ti o sobre tu producto, entrega dos o tres frases de tu página y deja el resto. Propongo escribir frases que se entiendan fuera de la página, con cada número junto a la forma en que se obtuvo. Lo muestro con este sitio, donde un lector que no ejecuta JavaScript recibe de cada artículo solo el resumen. No tengo ningún dato de que escribir así cambie cuánto cita un modelo a este sitio.',
  excerptEn:
    'When an assistant answers a question about you or your product, it hands over two or three sentences from your page and leaves the rest behind. I propose writing sentences that still make sense outside the page, with each number next to how it was obtained. I show it with this site, where a reader that does not run JavaScript gets only the summary of each post. I have no data showing that writing this way changes how often a model cites this site.',
  content: `Parte de lo que alguien llega a saber de ti o de tu producto ya no la lee en tu página. Se la cuenta un asistente que leyó la página por él, sacó dos o tres frases y las puso dentro de una respuesta. Por eso creo que quien publica debería escribir pensando en ese recorte. Las frases importantes tienen que poder salir de la página sin cambiar de significado. Eso pide tres cosas: afirmaciones que se entiendan solas, cada número junto a su método (la forma en que se obtuvo), y un índice que una máquina pueda recorrer.

Casi todo eso es escribir claro, y no tiene nada de nuevo. Lo único nuevo es pedirle a la afirmación que siga diciendo lo mismo cuando la sacan de su página.

Antes de seguir, aclaro qué clase de texto es este. Explico un mecanismo y saco consecuencias de él. No tengo ningún dato de que lo que describo haya cambiado cuántas veces un modelo cita o recomienda este sitio, y no quiero dar a entender que lo tengo. La evidencia que uso es de otro tipo. Una parte es lo que este sitio publica para las máquinas, que cualquiera puede leer en su código. La otra es lo que los fabricantes de modelos escriben sobre sus propios robots.

**Lo que se suele recomendar**

Hay dos posiciones habituales. La primera dice que basta con escribir bien para personas y que lo demás se acomoda solo. La segunda es más reciente y trata el asunto como una lista de archivos que hay que tener.

Yo hice la segunda, completa. Este sitio tiene un robots.txt con 21 grupos de reglas. Uno es general y los otros veinte nombran robots concretos, y todos dan permiso para leer todo. Tiene un sitemap que se genera en cada compilación a partir del mismo arreglo de artículos que alimenta el blog. Tiene datos estructurados en la cabecera, con un bloque por artículo que lleva título, descripción, fecha y autor. Tiene contenido prerrenderizado, que es una versión estática del contenido que un plugin escribe durante la compilación. Hace falta porque la aplicación se dibuja en el navegador, y sin JavaScript el cuerpo del documento llegaría vacío. La aplicación reemplaza esa versión estática al arrancar. Y tiene dos archivos en texto plano, llms.txt y llms-full.txt, con el índice del sitio en markdown.

El propio índice del sitio dice que esas medidas subieron una auditoría de 58 a 83 sobre 100. Ese puntaje sale de una lista de chequeo. Mide que los archivos existen y están bien formados. No mide si alguien cita algo.

Las dos posiciones dan por hecho lo mismo: que lo que se lee es la página entera. La primera cuida la página para una persona y la segunda la empaqueta para una máquina. Yo no estoy de acuerdo con ese punto de partida.

**Por qué eso no alcanza**

Los fabricantes documentan robots que piden una página cuando un usuario hace una pregunta. [OpenAI lo dice de ChatGPT-User](https://platform.openai.com/docs/bots) y [Anthropic de Claude-User](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler). Ninguna de las dos páginas describe qué pasa entre esa petición y la respuesta. Lo que sí puede comprobar cualquiera es el resultado. La respuesta es un texto más corto que la página, y en él caben unas pocas frases de cada fuente. Lo que le llega al usuario es un fragmento.

Mi sitio lo muestra sin que yo lo buscara. Quise saber qué recibe de un artículo un lector que no ejecuta mi aplicación, y lo encontré en la configuración de la compilación. Recibe el título, la fecha, la categoría, las etiquetas y el resumen. El cuerpo no lo recibe. En llms-full.txt hay lo mismo, con el resumen en inglés. Las direcciones de lectura tienen todas la forma \`#blog/article/...\`. Lo que va después del # lo resuelve mi aplicación en el navegador, así que para quien no ejecuta JavaScript todas son el mismo documento. Cada artículo tiene además una página estática propia en \`/blog/<slug>/\`, con su título y su resumen, que envía al lector a la aplicación. El cuerpo tampoco está ahí. La [guía de Google sobre JavaScript](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics) pide justamente no usar fragmentos para cargar contenido distinto.

Para ese lector, entonces, cada artículo es su resumen, que son tres o cuatro frases. Con esa medida comparé dos resúmenes que escribí yo.

El resumen del [artículo sobre GETDATE() y SYSDATETIME()](#blog/article/getdate-vs-sysdatetime-reloj-que-retrocede) contiene esta frase: "GETDATE() leído justo después de SYSDATETIME() compara como anterior en 13,339 de 20,000 ejecuciones, porque datetime redondea a pasos de 3.33 ms y datetime2 no". Si alguien la saca de la página, la frase todavía dice qué se comparó, cuántas veces, cuál fue el resultado y por qué.

El resumen del [artículo sobre el grep de redacción](#blog/article/grep-redaccion-no-ve-camelcase) termina así: "Esto es lo que cambié en el proceso". Para una persona que va a seguir leyendo es una buena frase. Para el lector que solo recibe el resumen, la frase anuncia un cuerpo que nunca le llega.

Los archivos para máquinas no arreglan esto, y tienen el mismo problema a su manera. Encontré tres casos en los míos.

El primero está en los datos estructurados, donde cada artículo declara un número de palabras. Ese número no sale de contar palabras. Es el tiempo de lectura en minutos multiplicado por 200. Publiqué un número sin su método, y lo hice en el formato que una máquina lee con más facilidad de todos los que tengo.

El segundo está en los dos archivos llms, que mantengo a mano. En noviembre de 2026 conté 37 artículos en el arreglo, 37 enlaces en llms.txt y 37 secciones en llms-full.txt, así que el índice está completo. Pero los encabezados no coinciden. Uno me presenta como "Tech Lead & .NET Developer" y el otro como "Software Architect & Full Stack Developer", y sus listas de tecnologías son distintas. Según cuál de los dos cite un modelo, describe a un profesional o a otro. Al sitemap no le puede pasar eso, porque se genera.

El tercero está en robots.txt, donde las veinte reglas con nombre dicen lo mismo que la regla general. La página de Anthropic lista tres robots. Mi archivo nombra uno de ellos y otros dos nombres que esa página no menciona. No se rompe nada, porque la regla general ya permite todo. Esa lista muestra a qué robots quise dar permiso. No dice cuáles visitaron el sitio.

**Qué le pasa a una frase cuando sale de su página**

![Cuatro tipos de frase recorren el camino de la página a la respuesta del modelo pasando por la extracción. La frase que nombra su sujeto y el número con su método llegan enteros. El pronombre que apunta a otra frase y la referencia a la página llegan sin aquello que señalaban.](figure/next-reader-extraction "Esquema conceptual, no datos medidos. Qué conserva su significado cuando una frase sale de su página. Los ejemplos 2 y 3 son texto de este sitio.")

El dibujo sigue cuatro frases desde la página hasta la respuesta. El paso del medio es la extracción, y ahí la frase se queda sin las frases que tenía al lado.

La frase que nombra su sujeto llega entera, porque no dependía de la anterior. El número también llega entero cuando su método está en la misma frase. En [Por qué un caso que mediste le sirve más al lector que tu lista de habilidades](#blog/article/publica-lo-que-mediste) defendí que un número publicado con su método le permite al lector repetirlo. Aquí agrego una condición de distancia. Si el método está dos párrafos más abajo, el número viaja solo.

El pronombre que apunta a otra frase y la referencia a la página llegan como palabras, pero ya no se sabe a qué se refieren. "Esto", "lo anterior" y "como muestra la tabla" señalan algo que se quedó en la página.

> Una frase que necesita a su página para significar algo no llega a la respuesta.

El dibujo simplifica una cosa. No sé cómo corta el texto cada sistema, y puede que algunos se lleven el párrafo entero. Para el argumento basta con que algo se corte y con que no sea yo quien elige por dónde.

**Cómo aplicarlo**

**1. Prueba cada frase por separado**

Toma el resumen o el primer párrafo de tus tres páginas más importantes. Copia cada frase sola en un documento vacío. Marca cada pronombre que apunta afuera, cada "arriba" o "abajo", y cada número sin unidad, sin fecha o sin la forma en que se obtuvo. Reescribe solo las frases que querrías ver citadas.

Un caso para esta semana es la página de precios o de límites de un producto. "Incluye hasta 10,000 al mes" no dice 10,000 de qué, ni desde cuándo, ni en qué plan. Otro caso es el estudio de un consultor que dice "redujimos el tiempo a la mitad" sin decir qué tiempo ni contra qué se comparó.

**2. Mira lo que recibe quien no ejecuta tu aplicación**

\`\`\`
curl -s https://example.com/ | grep -c "13,339"
\`\`\`

Cambia la dirección por la tuya y el número por la frase que quieres que citen. Si el resultado es 0, esa frase solo existe después de ejecutar JavaScript. No sé qué robots lo ejecutan. Google dice en esa misma guía que su buscador sí lo hace, con una versión actual de Chromium. Las páginas de OpenAI y Anthropic que leí no dicen nada al respecto. Lo más barato es que la frase no dependa de eso.

**3. Genera el índice en lugar de escribirlo a mano**

Si publicas un índice para máquinas, haz que salga de la misma fuente que las páginas. Si no puedes, agrega una comprobación que cuente las entradas de los dos lados y compare los encabezados. Un caso es el equipo de documentación que mantiene a mano una lista de versiones junto a un registro de cambios generado.

**4. Si diriges un equipo o un producto**

Escribe las cinco afirmaciones que querrías que se repitieran sobre tu producto o tu equipo. Para cada una, busca la frase pública donde está dicha completa, con su número y su método. Donde esa frase no exista, ya sabes cuál es el trabajo pendiente. Es un trabajo de redacción, y viene antes que el de los archivos.

**Dónde puedo estar equivocado**

El punto más débil ya lo dije: no tengo un resultado que mostrar. Además es difícil conseguirlo. Nadie fuera de los fabricantes ve qué se pidió, qué se extrajo, qué se citó ni por qué. En los registros de mi servidor yo podría ver quién pidió un archivo, pero no qué hizo con él. Preguntarle a un asistente por mi sitio me da una sola muestra, y mañana puede salir distinta.

Lo segundo es que llms.txt es una propuesta. [Su propia página](https://llmstxt.org/) se presenta como "A proposal to standardise". Cuenta que miles de sitios lo publican y que los laboratorios lo publican para su propia documentación. Que un laboratorio publique el suyo no lo compromete a leer el mío. La página de robots de OpenAI lo menciona solo como índice de su documentación, y la de Anthropic no lo menciona. Y [Google dice](https://developers.google.com/search/docs/appearance/ai-features) que para aparecer en sus funciones de AI no hace falta crear "new machine readable files, AI text files, or markup". Puede que mis dos archivos no los lea nadie.

Lo tercero es que escribir para máquinas puede estropear la escritura para personas. Repetir el sujeto en cada frase cansa, y la versión anterior de esta práctica fue llenar páginas de palabras clave. En mi propia configuración hay un comentario que dice que cierto bloque de datos estructurados es el de "highest impact for AI search". Lo escribí sin haber medido nada. Mi regla es corta: si el cambio empeora la frase para una persona, no lo hago. Solo les pido que se entiendan solas a las pocas frases que quiero ver citadas. Al resto del texto no se lo pido.

Lo cuarto es que todo esto puede volverse innecesario. Si los sistemas aprenden a llevarse el contexto junto con la frase, el problema del pronombre se hace más pequeño.

En ese caso queda lo que no era nuevo: frases claras y números con su método. Escribir así cuesta poco. Lo único que no puedo ofrecer es la prueba de que da resultado.`,
  contentEn: `Some of what a person ends up knowing about you or your product, they no longer read on your page. An assistant tells them. It read the page on their behalf, took two or three sentences, and placed them inside an answer. So I think whoever publishes should write with that cut in mind. The sentences that matter have to be able to leave the page without changing meaning. That takes three things: statements that make sense on their own, each number next to its method (how it was obtained), and an index a machine can walk through.

Most of that is clear writing, and none of it is new. The only new part is asking a claim to keep saying the same thing once it has been lifted out of its page.

Before going on, I should say what kind of text this is. I explain a mechanism and draw consequences from it. I have no data showing that anything described here changed how often a model cites or recommends this site, and I do not want to suggest that I have. The evidence I use is of a different kind. One part is what this site publishes for machines, which anyone can read in its code. The other is what model vendors write about their own bots.

**What people usually recommend**

There are two usual positions. The first says that writing well for people is enough and the rest sorts itself out. The second is more recent and treats the matter as a list of files to have.

I did the second, all of it. This site has a robots.txt with 21 rule groups. One is general and the other twenty name specific bots, and all of them allow reading everything. It has a sitemap generated on every build from the same array of posts that feeds the blog. It has structured data in the head, with one block per post that carries title, description, date and author. It has pre-rendered content, which is a static version of the content that a plugin writes at build time. It is needed because the app draws itself in the browser, and without JavaScript the body of the document would arrive empty. The app replaces that static version when it starts. And it has two plain-text files, llms.txt and llms-full.txt, holding the site index in markdown.

The site's own index says those measures took an audit from 58 to 83 out of 100. That score comes from a checklist. It measures that the files exist and are well formed. It does not measure whether anyone cites anything.

Both positions take the same thing for granted: that what gets read is the whole page. The first polishes the page for a person and the second packages it for a machine. I disagree with that starting point.

**Why that is not enough**

Vendors document bots that request a page when a user asks a question. [OpenAI says so about ChatGPT-User](https://platform.openai.com/docs/bots) and [Anthropic about Claude-User](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler). Neither page describes what happens between that request and the answer. What anyone can check is the result. The answer is a shorter text than the page, with room for a few sentences from each source. What reaches the user is a fragment.

My site shows this without my having planned it. I wanted to know what a reader that does not run my app gets from a post, and I found it in the build configuration. It gets the title, the date, the category, the tags and the summary. It does not get the body. llms-full.txt holds the same, with the summary in English. The reading addresses all look like \`#blog/article/...\`. Whatever follows the # is resolved by my app in the browser, so to a reader that does not run JavaScript they are all the same document. Each post also has a static page of its own at \`/blog/<slug>/\`, with its title and summary, that sends the reader on to the app. The body is not there either. [Google's guide on JavaScript](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics) asks sites not to use fragments to load different content, which is exactly what mine does.

For that reader, then, each post is its summary, which is three or four sentences. I used that yardstick on two summaries I wrote myself.

The summary of [the post on GETDATE() and SYSDATETIME()](#blog/article/getdate-vs-sysdatetime-reloj-que-retrocede) says that GETDATE() read right after SYSDATETIME() compares as earlier in 13,339 of 20,000 runs, because datetime rounds to 3.33 ms steps and datetime2 does not. If someone takes that sentence out of the page, it still says what was compared, how many times, what came out and why.

The summary of [the post on the redaction grep](#blog/article/grep-redaccion-no-ve-camelcase) ends like this: "This is what I changed in the process." For a person about to keep reading, that is a good sentence. For the reader that only gets the summary, it announces a body that never arrives.

The files for machines do not fix this, and they have the same problem in their own way. I found three cases in mine.

The first is in the structured data, where every post declares a word count. That number does not come from counting words. It is the reading time in minutes multiplied by 200. I published a number without its method, and I did it in the format a machine reads most easily of all the ones I have.

The second is in the two llms files, which I maintain by hand. In November 2026 I counted 37 posts in the array, 37 links in llms.txt and 37 sections in llms-full.txt, so the index is complete. But the headers disagree. One introduces me as "Tech Lead & .NET Developer" and the other as "Software Architect & Full Stack Developer", and their technology lists differ. Depending on which of the two a model quotes, it describes one professional or another. That cannot happen to the sitemap, because it is generated.

The third is in robots.txt, where the twenty named rules say the same thing as the general rule. Anthropic's page lists three bots. My file names one of them, plus two names that page does not mention. Nothing breaks, because the general rule already allows everything. That list shows which bots I meant to allow. It does not say which ones visited the site.

**What happens to a sentence when it leaves its page**

![Four kinds of sentence travel from the page to the model's answer through extraction. The sentence that names its subject and the number with its method arrive whole. The pronoun that points to another sentence and the reference to the page arrive without the thing they pointed at.](figure/next-reader-extraction "Conceptual sketch, not measured data. What keeps its meaning when a sentence leaves its page. Examples 2 and 3 are text from this site.")

The sketch follows four sentences from the page to the answer. The middle step is extraction, and that is where a sentence loses the sentences that were next to it.

The sentence that names its subject arrives whole, because it never depended on the one before. The number also arrives whole when its method is in the same sentence. In [Why a Case You Measured Gives a Reader More to Go On Than Your Skills List](#blog/article/publica-lo-que-mediste) I argued that a number published with its method lets the reader rerun it. Here I add a condition about distance. If the method sits two paragraphs further down, the number travels alone.

The pronoun that points to another sentence and the reference to the page arrive as words, but nobody can tell what they refer to any more. "This", "the above" and "as the table shows" all point at something that stayed on the page.

> A sentence that needs its page in order to mean something does not reach the answer.

The sketch simplifies one thing. I do not know how each system cuts text, and some may carry the whole paragraph. The argument only needs something to be cut, and the place of the cut not to be my choice.

**How to apply it**

**1. Test each sentence on its own**

Take the summary or the first paragraph of your three most important pages. Paste each sentence alone into an empty document. Mark every pronoun that points outside, every "above" or "below", and every number with no unit, no date, or no account of how it was obtained. Rewrite only the sentences you would want to see quoted.

One case for this week is a product's pricing or limits page. "Includes up to 10,000 a month" does not say 10,000 of what, since when, or on which plan. Another case is a consultant's case study that says "we cut the time in half" without saying which time or what it was compared against.

**2. Look at what a reader gets without running your app**

\`\`\`
curl -s https://example.com/ | grep -c "13,339"
\`\`\`

Swap in your own address, and replace the number with the sentence you want quoted. If the result is 0, that sentence only exists after JavaScript runs. I do not know which bots run it. Google says in that same guide that its search does, on a current version of Chromium. The OpenAI and Anthropic pages I read say nothing either way. The cheapest option is for the sentence not to depend on it.

**3. Generate the index instead of writing it by hand**

If you publish an index for machines, produce it from the same source as the pages. If you cannot, add a check that counts the entries on both sides and compares the headers. One case is a documentation team that keeps a hand-written version list next to a generated changelog.

**4. If you lead a team or a product**

Write down the five statements you would want repeated about your product or your team. For each one, find the public sentence where it is stated whole, with its number and its method. Where that sentence does not exist, you know what work is pending. It is writing work, and it comes before the work on files.

**Where I could be wrong**

The weakest point is the one I gave at the start: I have no result to show. One is also hard to get. Nobody outside the vendors sees what was requested, what was extracted, what was cited, or why. In my server logs I could see who asked for a file, but not what they did with it. Asking an assistant about my site gives me a single sample, and tomorrow it may come out differently.

The second point is that llms.txt is a proposal. [Its own page](https://llmstxt.org/) introduces itself as "A proposal to standardise". It reports that thousands of sites publish one and that the labs publish them for their own documentation. A lab publishing its own file does not commit it to reading mine. OpenAI's bots page mentions it only as the index of its own docs, and Anthropic's does not mention it. And [Google says](https://developers.google.com/search/docs/appearance/ai-features) that appearing in its AI features does not require creating "new machine readable files, AI text files, or markup". It may be that nobody reads my two files.

The third point is that writing for machines can damage writing for people. Repeating the subject in every sentence is tiring, and the previous version of this practice was stuffing pages with keywords. My own configuration has a comment saying a certain block of structured data is the one with "highest impact for AI search". I wrote that without having measured anything. My rule is short: if a change makes the sentence worse for a person, I do not make it. I only ask the few sentences I want quoted to make sense on their own. I do not ask it of the rest of the text.

The fourth point is that all of this may stop being necessary. If systems learn to carry the context along with the sentence, the pronoun problem gets smaller.

In that case what remains is the part that was never new: clear sentences, and numbers with their method. Writing this way costs little. The one thing I cannot offer is proof that it works.`,
  relatedIds: [
    'publish-what-you-measured',
    'redaction-grep-misses-camelcase',
    'getdate-vs-sysdatetime',
  ],
}
