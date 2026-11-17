import type { BlogPost } from '../../types'

export const yourNextReaderIsAModel: Omit<BlogPost, 'readingTime'> = {
  id: 'your-next-reader-is-a-model',
  slug: 'tu-proximo-lector-es-un-modelo',
  title: 'Tu próximo lector es un modelo',
  titleEn: 'Your Next Reader Is a Model',
  date: '2026-11-17',
  tags: ['AI', 'escritura', 'publicar', 'credibilidad', 'portafolio'],
  category: 'ensayo',
  featured: false,
  excerpt:
    'Un asistente que responde sobre un profesional o un producto no entrega la página que leyó: entrega dos o tres frases sacadas de ella. Sostengo que quien publica debe escribir frases que conserven su significado fuera de la página, con el número junto a su método, y lo muestro con este sitio, donde un lector que no ejecuta JavaScript recibe de cada artículo solo el resumen. Es un argumento sobre el mecanismo: no tengo ningún dato de que escribir así cambie cuánto cita un modelo a este sitio.',
  excerptEn:
    'An assistant answering a question about a professional or a product does not hand over the page it read: it hands over two or three sentences taken from it. I argue that whoever publishes should write sentences that keep their meaning outside the page, with the number next to its method, and I show it with this site, where a reader that does not run JavaScript gets only the summary of each post. This is an argument from mechanism: I have no data showing that writing this way changes how often a model cites this site.',
  content: `Parte de lo que alguien llega a saber de ti o de tu producto ya no la lee en tu página. Se la cuenta un asistente que leyó la página por él, sacó dos o tres frases y las puso dentro de una respuesta. Sostengo que quien publica debería escribir para que esas frases se puedan sacar sin que cambien de significado: afirmaciones que se sostienen solas, el número junto a su método, y un índice que una máquina pueda recorrer.

Casi todo eso es escribir claro, y no tiene nada de nuevo. Lo nuevo es una sola exigencia: que la afirmación sobreviva a que la saquen de su página.

Conviene decir qué clase de texto es este. Es un argumento sobre un mecanismo. No tengo ningún dato de que lo que describo haya cambiado cuántas veces un modelo cita o recomienda este sitio, y no lo insinúo. La evidencia es de otro tipo: lo que este sitio publica para las máquinas, que se puede leer en su código, y lo que los fabricantes de modelos escriben sobre sus propios robots.

**Lo que se suele pensar**

Hay dos posiciones habituales. La primera dice que basta con escribir bien para personas y que lo demás se acomoda solo. La segunda es más reciente y trata el asunto como una lista de archivos que hay que tener.

Yo hice la segunda, completa. Este sitio tiene un robots.txt con 21 grupos de reglas: uno general y veinte que nombran robots concretos, todos con permiso para leer todo. Tiene un sitemap que se genera en cada compilación a partir del mismo arreglo de artículos que alimenta el blog. Tiene datos estructurados en la cabecera: un bloque por artículo con título, descripción, fecha y autor. Tiene contenido prerrenderizado, porque la aplicación se dibuja en el navegador y sin JavaScript el cuerpo del documento llegaría vacío; un plugin escribe en la compilación una versión estática del contenido, que la aplicación reemplaza al arrancar. Y tiene dos archivos en texto plano, llms.txt y llms-full.txt, con el índice del sitio en markdown.

El propio índice del sitio dice que esas medidas subieron una auditoría de 58 a 83 sobre 100. Es un puntaje de lista de chequeo: mide que los archivos existen y están bien formados. No mide si alguien cita algo.

Las dos posiciones comparten un supuesto: que la unidad de lectura es la página. La primera cuida la página para una persona y la segunda la empaqueta para una máquina. Mi desacuerdo es con ese supuesto.

**Por qué falla**

Los fabricantes documentan robots que piden una página cuando un usuario hace una pregunta. [OpenAI lo dice de ChatGPT-User](https://platform.openai.com/docs/bots) y [Anthropic de Claude-User](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler). Lo que pasa entre esa petición y la respuesta no lo describe ninguna de las dos páginas. Lo que sí puede comprobar cualquiera es el resultado: la respuesta no es la página, es un texto más corto donde caben unas pocas frases de cada fuente. La unidad que viaja es el fragmento.

Mi sitio lo muestra por accidente. Me pregunté qué recibe de un artículo un lector que no ejecuta mi aplicación, y la respuesta está en la configuración de la compilación: título, fecha, categoría, etiquetas y el resumen. El cuerpo no. En llms-full.txt hay lo mismo, con el resumen en inglés. Las direcciones de lectura tienen todas la forma \`#blog/article/...\`, y lo que va después del # lo resuelve mi aplicación en el navegador, así que para quien no ejecuta JavaScript todas son el mismo documento. Cada artículo tiene además una página estática propia en \`/blog/<slug>/\`, con su título y su resumen, que envía al lector a la aplicación; el cuerpo tampoco está ahí. La [guía de Google sobre JavaScript](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics) pide justamente no usar fragmentos para cargar contenido distinto.

Para ese lector, entonces, cada artículo es su resumen: tres o cuatro frases. Con esa medida comparé dos que escribí yo.

El resumen del [artículo sobre GETDATE() y SYSDATETIME()](#blog/article/getdate-vs-sysdatetime-reloj-que-retrocede) contiene esta frase: "GETDATE() leído justo después de SYSDATETIME() compara como anterior en 13,339 de 20,000 ejecuciones, porque datetime redondea a pasos de 3.33 ms y datetime2 no". Sacada de su sitio dice qué se comparó, cuántas veces, cuál fue el resultado y por qué.

El resumen del [artículo sobre el grep de redacción](#blog/article/grep-redaccion-no-ve-camelcase) termina así: "Esto es lo que cambié en el proceso". Para una persona que va a seguir leyendo es una buena frase. Sacada de su sitio promete un cuerpo que ese lector no recibe.

Los archivos para máquinas no arreglan esto, y tienen su propia versión del problema. Encontré tres casos en los míos.

El primero: en los datos estructurados, cada artículo declara un número de palabras. Ese número no sale de contar palabras. Es el tiempo de lectura en minutos multiplicado por 200. Es un número sin su método, en el formato más legible para una máquina que tengo.

El segundo: los dos archivos llms los mantengo a mano. En noviembre de 2026 conté 37 artículos en el arreglo, 37 enlaces en llms.txt y 37 secciones en llms-full.txt, así que el índice está completo. Pero los encabezados no coinciden. Uno me presenta como "Tech Lead & .NET Developer" y el otro como "Software Architect & Full Stack Developer", y sus listas de tecnologías son distintas. Un modelo que cite uno o el otro describe a dos profesionales diferentes. El sitemap no puede caer en eso, porque se genera.

El tercero: las veinte reglas con nombre de robots.txt dicen lo mismo que la regla general. La página de Anthropic lista tres robots; mi archivo nombra uno de ellos y otros dos nombres que esa página no menciona. No se rompe nada, porque la regla general ya permite todo. Pero la lista dice a quién quise invitar. No dice quién vino.

**El modelo**

![Cuatro tipos de frase recorren el camino de la página a la respuesta del modelo pasando por la extracción. La frase que nombra su sujeto y el número con su método llegan enteros. El pronombre sin antecedente y la referencia a la página llegan sin su referente.](figure/next-reader-extraction "Esquema conceptual, no datos medidos. Qué conserva su significado cuando una frase sale de su página; los ejemplos 2 y 3 son texto de este sitio.")

El dibujo sigue cuatro frases de la página a la respuesta. La extracción es el paso donde la frase pierde a sus vecinas.

La frase que nombra su sujeto llega entera, porque no dependía de la anterior. El número con su método también, siempre que el método esté en la misma frase. En [Publica lo que mediste, no lo que sabes](#blog/article/publica-lo-que-mediste) defendí que un número con su método le permite al lector repetirlo. Aquí añado una condición de distancia: si el método está dos párrafos más abajo, el número viaja solo.

El pronombre sin antecedente y la referencia a la página llegan como palabras y sin referente. "Esto", "lo anterior", "como muestra la tabla" señalan algo que se quedó atrás.

> Una frase que necesita a su página para significar algo no llega a la respuesta.

El dibujo simplifica una cosa: no sé cómo corta el texto cada sistema. Puede que algunos lleven el párrafo entero. El argumento solo necesita que algo se corte, y que yo no elija por dónde.

**Cómo aplicarlo**

**1. La prueba del recorte**

Toma el resumen o el primer párrafo de tus tres páginas más importantes. Copia cada frase sola en un documento vacío. Marca cada pronombre que apunta afuera, cada "arriba" o "abajo", y cada número sin unidad, sin fecha o sin la forma en que se obtuvo. Reescribe solo las frases que querrías ver citadas.

Un caso para esta semana: la página de precios o de límites de un producto. "Incluye hasta 10,000 al mes" no dice 10,000 qué, ni desde cuándo, ni en qué plan. Otro: el caso de estudio de un consultor que dice "redujimos el tiempo a la mitad" sin decir qué tiempo ni contra qué.

**2. Mira lo que recibe quien no ejecuta tu aplicación**

\`\`\`
curl -s https://example.com/ | grep -c "13,339"
\`\`\`

Cambia la dirección por la tuya y el número por la frase que quieres que citen. Si el resultado es 0, esa frase solo existe después de ejecutar JavaScript. No sé qué robots lo ejecutan. Google dice en esa misma guía que su buscador sí, con una versión actual de Chromium. Las páginas de OpenAI y Anthropic que leí no dicen nada al respecto. Lo barato es no depender de eso.

**3. Genera el índice, no lo escribas**

Si publicas un índice para máquinas, que salga de la misma fuente que las páginas. Si no puedes, que una comprobación cuente las entradas de los dos lados y compare los encabezados. Un caso: el equipo de documentación que mantiene una lista de versiones a mano junto a un registro de cambios generado.

**4. Para quien dirige**

Escribe las cinco afirmaciones que querrías que se repitieran sobre tu producto o tu equipo. Para cada una, busca la frase pública donde está dicha completa, con su número y su método. Donde no exista, ese es el trabajo, y es de redacción antes que de archivos.

**Dónde puedo estar equivocado**

El punto más débil ya lo dije: no hay resultado. Y es difícil que lo haya. Nadie fuera de los fabricantes ve qué se pidió, qué se extrajo, qué se citó ni por qué. Yo podría ver en los registros de mi servidor quién pidió un archivo, no qué hizo con él. Preguntarle a un asistente por mi sitio da una muestra de uno, que mañana puede salir distinta.

Lo segundo: llms.txt es una propuesta. [Su propia página](https://llmstxt.org/) se presenta como "A proposal to standardise", y cuenta que miles de sitios lo publican y que los laboratorios lo publican para su propia documentación. Publicar el suyo no es comprometerse a leer el mío. La página de robots de OpenAI lo menciona solo como índice de su documentación; la de Anthropic no lo menciona. Y [Google dice](https://developers.google.com/search/docs/appearance/ai-features) que para aparecer en sus funciones de AI no hace falta crear "new machine readable files, AI text files, or markup". Puede que mis dos archivos no los lea nadie.

Lo tercero: escribir para máquinas puede estropear la escritura para personas. Repetir el sujeto en cada frase cansa, y la versión anterior de este juego fue llenar páginas de palabras clave. En mi propia configuración hay un comentario que dice que cierto bloque de datos estructurados es el de "highest impact for AI search". Lo escribí sin haber medido nada. Mi regla es corta: si el cambio empeora la frase para una persona, no lo hago. La autonomía se le pide a las pocas frases que uno quiere ver citadas, no al texto entero.

Lo cuarto: puede volverse innecesario. Si los sistemas aprenden a llevarse el contexto junto con la frase, el problema del pronombre se achica.

En ese caso queda lo que no era nuevo: frases claras y números con su método. Es una apuesta barata. Lo único que no puedo ofrecer es la prueba de que paga.`,
  contentEn: `Some of what a person ends up knowing about you or your product, they no longer read on your page. An assistant tells them: it read the page on their behalf, took two or three sentences, and placed them inside an answer. My claim is that whoever publishes should write so those sentences can be taken out without changing meaning: statements that stand alone, the number next to its method, and an index a machine can walk.

Most of that is clear writing, and none of it is new. The new part is a single requirement: the claim has to survive being lifted out of its page.

It is worth saying what kind of text this is. It is an argument about a mechanism. I have no data showing that anything described here changed how often a model cites or recommends this site, and I am not hinting at any. The evidence is of a different kind: what this site publishes for machines, which can be read in its code, and what model vendors write about their own bots.

**The common view**

There are two usual positions. The first says that writing well for people is enough and the rest sorts itself out. The second is more recent and treats the matter as a list of files to have.

I did the second, all of it. This site has a robots.txt with 21 rule groups: one general, and twenty that name specific bots, all of them allowed to read everything. It has a sitemap generated on every build from the same array of posts that feeds the blog. It has structured data in the head: one block per post with title, description, date and author. It has pre-rendered content, because the app draws itself in the browser and without JavaScript the body of the document would arrive empty; a plugin writes a static version of the content at build time, and the app replaces it on start. And it has two plain-text files, llms.txt and llms-full.txt, holding the site index in markdown.

The site's own index says those measures took an audit from 58 to 83 out of 100. That is a checklist score: it measures that the files exist and are well formed. It does not measure whether anyone cites anything.

Both positions share one assumption: that the unit of reading is the page. The first polishes the page for a person and the second packages it for a machine. That assumption is what I disagree with.

**Why it fails**

Vendors document bots that request a page when a user asks a question. [OpenAI says so about ChatGPT-User](https://platform.openai.com/docs/bots) and [Anthropic about Claude-User](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler). Neither page describes what happens between that request and the answer. What anyone can check is the result: the answer is not the page, it is a shorter text with room for a few sentences from each source. The unit that travels is the fragment.

My site shows it by accident. I asked what a reader that does not run my app gets from a post, and the answer is in the build configuration: title, date, category, tags and the summary. Not the body. llms-full.txt holds the same, with the summary in English. The reading addresses all look like \`#blog/article/...\`, and whatever follows the # is resolved by my app in the browser, so to a reader that does not run JavaScript they are all the same document. Each post also has a static page of its own at \`/blog/<slug>/\`, with its title and summary, that sends the reader on to the app; the body is not there either. [Google's guide on JavaScript](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics) asks for exactly that to be avoided: no fragments to load different content.

For that reader, then, each post is its summary: three or four sentences. I used that yardstick on two I wrote myself.

The summary of [the post on GETDATE() and SYSDATETIME()](#blog/article/getdate-vs-sysdatetime-reloj-que-retrocede) says that GETDATE() read right after SYSDATETIME() compares as earlier in 13,339 of 20,000 runs, because datetime rounds to 3.33 ms steps and datetime2 does not. Taken out of its place, that sentence says what was compared, how many times, what came out and why.

The summary of [the post on the redaction grep](#blog/article/grep-redaccion-no-ve-camelcase) ends like this: "This is what I changed in the process." For a person about to keep reading, that is a good sentence. Taken out of its place, it promises a body that reader never receives.

The files for machines do not fix this, and they have their own version of the problem. I found three cases in mine.

First: in the structured data, every post declares a word count. That number does not come from counting words. It is the reading time in minutes multiplied by 200. It is a number without its method, in the most machine-readable format I have.

Second: I maintain the two llms files by hand. In November 2026 I counted 37 posts in the array, 37 links in llms.txt and 37 sections in llms-full.txt, so the index is complete. But the headers disagree. One introduces me as "Tech Lead & .NET Developer" and the other as "Software Architect & Full Stack Developer", and their technology lists differ. A model quoting one or the other describes two different professionals. The sitemap cannot do that, because it is generated.

Third: the twenty named rules in robots.txt say the same thing as the general rule. Anthropic's page lists three bots; my file names one of them, plus two names that page does not mention. Nothing breaks, because the general rule already allows everything. But the list says who I meant to invite. It does not say who came.

**The model**

![Four kinds of sentence travel from the page to the model's answer through extraction. The sentence that names its subject and the number with its method arrive whole. The pronoun with no antecedent and the reference to the page arrive without their referent.](figure/next-reader-extraction "Conceptual sketch, not measured data. What keeps its meaning when a sentence leaves its page; examples 2 and 3 are text from this site.")

The sketch follows four sentences from the page to the answer. Extraction is the step where a sentence loses its neighbours.

The sentence that names its subject arrives whole, because it never depended on the one before. So does the number with its method, provided the method is in the same sentence. In [A Number the Reader Can Check Beats a Skill You Claim](#blog/article/publica-lo-que-mediste) I argued that a number with its method lets the reader rerun it. Here I add a condition about distance: if the method sits two paragraphs further down, the number travels alone.

The pronoun with no antecedent and the reference to the page arrive as words, minus the referent. "This", "the above", "as the table shows" all point at something left behind.

> A sentence that needs its page in order to mean something does not reach the answer.

The sketch simplifies one thing: I do not know how each system cuts text. Some may carry the whole paragraph. The argument only needs something to be cut, and the cut not to be mine to place.

**How to apply it**

**1. The lifting test**

Take the summary or the first paragraph of your three most important pages. Paste each sentence alone into an empty document. Mark every pronoun that points outside, every "above" or "below", and every number with no unit, no date, or no account of how it was obtained. Rewrite only the sentences you would want to see quoted.

One case for this week: a product's pricing or limits page. "Includes up to 10,000 a month" does not say 10,000 of what, since when, or on which plan. Another: a consultant's case study that says "we cut the time in half" without saying which time or against what.

**2. Look at what a reader gets without running your app**

\`\`\`
curl -s https://example.com/ | grep -c "13,339"
\`\`\`

Swap in your own address, and replace the number with the sentence you want quoted. If the result is 0, that sentence only exists after JavaScript runs. I do not know which bots run it. Google says in that same guide that its search does, on a current version of Chromium. The OpenAI and Anthropic pages I read say nothing either way. The cheap move is not to depend on it.

**3. Generate the index, do not write it**

If you publish an index for machines, produce it from the same source as the pages. If you cannot, have a check count the entries on both sides and compare the headers. One case: a documentation team keeping a hand-written version list next to a generated changelog.

**4. For whoever leads**

Write down the five statements you would want repeated about your product or your team. For each one, find the public sentence where it is stated whole, with its number and its method. Where there is none, that is the work, and it is writing work before it is file work.

**Where I could be wrong**

The weakest point is the one I gave at the start: there is no result. And one is hard to come by. Nobody outside the vendors sees what was requested, what was extracted, what was cited, or why. I could see in my server logs who asked for a file, not what they did with it. Asking an assistant about my site gives a sample of one, which may come out differently tomorrow.

Second: llms.txt is a proposal. [Its own page](https://llmstxt.org/) introduces itself as "A proposal to standardise", and reports that thousands of sites publish one and that the labs publish them for their own documentation. Publishing theirs is not a commitment to read mine. OpenAI's bots page mentions it only as the index of its own docs; Anthropic's does not mention it. And [Google says](https://developers.google.com/search/docs/appearance/ai-features) that appearing in its AI features does not require creating "new machine readable files, AI text files, or markup". It may be that nobody reads my two files.

Third: writing for machines can damage writing for people. Repeating the subject in every sentence is tiring, and the previous version of this game was stuffing pages with keywords. My own configuration has a comment saying a certain block of structured data is the one with "highest impact for AI search". I wrote that without having measured anything. My rule is short: if a change makes the sentence worse for a person, I do not make it. Standing alone is asked of the few sentences you want quoted, not of the whole text.

Fourth: it may stop being necessary. If systems learn to carry the context along with the sentence, the pronoun problem shrinks.

In that case what remains is the part that was never new: clear sentences, and numbers with their method. It is a cheap bet. The one thing I cannot offer is proof that it pays.`,
  relatedIds: [
    'publish-what-you-measured',
    'redaction-grep-misses-camelcase',
    'getdate-vs-sysdatetime',
  ],
}
