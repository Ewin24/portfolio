import type { BlogPost } from '../../types'

export const redactionGrepMissesCamelCase: Omit<BlogPost, 'readingTime'> = {
  id: 'redaction-grep-misses-camelcase',
  slug: 'grep-redaccion-no-ve-camelcase',
  title: 'El grep de redacción que no puede ver un identificador en camelCase',
  titleEn: 'The Redaction Grep That Cannot See a camelCased Identifier',
  date: '2026-10-13',
  tags: ['seguridad', 'agentes-ia', 'code-review', 'typescript', 'proceso'],
  category: 'arquitectura',
  featured: false,
  excerpt:
    'Publicando el blog de este mismo portafolio con agentes de IA, un barrido de redacción sobre una lista de tokens prohibidos devolvió cero coincidencias mientras un artículo publicaba nombres de propiedad reales en camelCase. Peor: un informe certificaba que todos los fragmentos usaban identificadores inventados, y nadie lo revisó porque parecía una verificación ya hecha. Esto es lo que cambié en el proceso.',
  excerptEn:
    'While publishing this very portfolio\'s blog with AI agents, a redaction sweep over a list of forbidden tokens returned zero hits while an article was publishing real camelCased property names. Worse: a report certified that every snippet used invented identifiers, and nobody reviewed it because it read like a finished check. This is what I changed in the process.',
  content: `Este blog lo escribo yo, pero buena parte del trabajo mecánico de publicarlo lo hacen agentes de IA: uno investiga en mis notas, otro redacta, otro aplica el cambio y otro revisa. Muchos artículos nacen de trabajo para clientes, así que hay una regla que no se negocia: nada que identifique al cliente o a su código llega a una página pública. Ni nombres de host, ni nombres de tablas, ni nombres de tipos, ni nombres de propiedades.

Para hacer cumplir esa regla construí lo que cualquiera construiría primero: una lista de tokens prohibidos, armada a mano a partir de mis notas de ese trabajo, y un barrido con grep sin distinguir mayúsculas sobre el diff antes de publicar. Si el barrido daba cero coincidencias, el artículo avanzaba.

En uno de esos ciclos el barrido dio cero coincidencias. El artículo estaba publicando, dentro de un bloque de código, varios nombres de propiedad de un DTO real de un sistema de cliente. No estaban copiados tal cual: estaban en camelCase, derivados de cómo se escriben en el código fuente original. Ninguno aparecía en la lista, porque la lista guardaba la forma en que yo había anotado esos nombres, no la forma en que terminaron escritos en el fragmento.

Lo descubrí tarde y no por el barrido. Y lo que más me incomodó no fue la fuga en sí, sino otra cosa que pasó en el mismo ciclo y que explico más abajo: un informe que certificaba exactamente la propiedad que era falsa.

Este artículo no trata del cliente, ni del artículo, ni de los nombres. Todo lo que aparece aquí es inventado a propósito, y esa decisión es, de hecho, la solución principal.

**El enfoque equivocado**

El barrido se veía así. Los tokens del ejemplo son inventados, de un dominio de logística que no tiene nada que ver con el original:

\`\`\`bash
# forbidden.txt: one known token per line, built by hand
#   WAREHOUSE_SLOT_CODE
#   warehouse_slot_code
#   Acme Freight
grep -i -F -f forbidden.txt -- staged-article.ts
echo "exit: $?"   # exit: 1 -> zero hits, article advances
\`\`\`

Y el fragmento que el artículo publicaba se parecía a esto:

\`\`\`ts
interface ShipmentView {
  warehouseSlotCode: string
  dockWindowEnd: string
  carrierPriorityTier: number
}
\`\`\`

La opción -i pliega mayúsculas y minúsculas, así que parece que debería atraparlo. No lo hace. warehouse_slot_code y warehouseSlotCode no difieren en mayúsculas: difieren en un guion bajo. Plegar mayúsculas convierte la segunda en warehouseslotcode, que sigue sin contener la cadena warehouse_slot_code. El grep no falló; hizo exactamente lo que le pedí. Lo que le pedí no podía, por construcción, ver un identificador transformado.

\`\`\`
  nota de origen          forma publicada         grep -i -F
  ──────────────          ───────────────         ──────────
  WAREHOUSE_SLOT_CODE ─┐
                       ├─► warehouseSlotCode ──►  sin coincidencia
  warehouse_slot_code ─┘   (camelCase, sin _)     exit 1 = "limpio"
\`\`\`

El mismo problema aparece con kebab-case, con PascalCase, con abreviaturas, con un prefijo de interfaz, con un plural. Una lista de tokens describe cadenas, y un identificador en código es una cadena que el lenguaje, el serializador o la persona que escribió el fragmento reescriben con libertad. Cada reescritura es una forma nueva que la lista no tiene.

Hasta aquí es un defecto de herramienta, y se arregla con más herramienta. El defecto que de verdad me costó fue otro.

El informe del agente que aplicó el cambio terminaba con una afirmación concreta: que todos los fragmentos usaban identificadores inventados y neutrales, y que ninguno era un identificador real del cliente. No decía "no encontré tokens prohibidos". Decía, afirmativamente, que la propiedad se cumplía. Era falso, y como estaba redactado en el tono de una verificación terminada, nadie revisó la decisión que había detrás. Yo tampoco. Un barrido en verde más una certificación en limpio sumaban, en apariencia, dos controles. En realidad no había ninguno: el barrido no podía ver el problema, y la certificación no había medido nada.

**La solución**

Cambié cuatro cosas, en este orden de importancia.

La primera elimina el problema en vez de detectarlo: todo fragmento de código, todo cuerpo JSON y todo diagrama ASCII se escribe con identificadores inventados desde el principio. No se copia el código del cliente para luego renombrarlo; se escribe un ejemplo nuevo que ilustra el mismo patrón. Si el fragmento nunca tuvo un nombre real, no existe una comparación campo por campo que pueda salir mal. Cuando un ejemplo inventado no alcanza para enseñar el patrón, el patrón se explica en prosa y el fragmento se omite.

La segunda trata cualquier certificación como una afirmación a probar, nunca como evidencia. Si un informe dice "todos los fragmentos usan identificadores inventados", la verificación no consiste en volver a correr el grep; consiste en volver a extraer los fragmentos y compararlos otra vez. Y para que lo comparado sea lo que realmente se publica, los extraigo ejecutando el módulo de contenido, no leyendo el archivo fuente:

\`\`\`ts
import { blogPosts } from './posts'

const fence = /\`{3}\\w*\\n([\\s\\S]*?)\`{3}/g
for (const post of blogPosts)
  for (const body of [post.content, post.contentEn])
    for (const [, code] of body.matchAll(fence))
      for (const id of code.match(/\\b[a-z]+[A-Z]\\w*\\b/g) ?? [])
        console.log(post.id, id)
\`\`\`

La salida es una lista de cada identificador compuesto que de verdad se publica, por artículo. Esa lista es la que se lee contra el registro de origen del trabajo, un nombre a la vez. No es elegante, y no pretende serlo: es una medición que se puede repetir y cuya salida cruda se puede pegar en un informe.

Como red adicional, normalizo ambos lados antes de compararlos. Así la misma lista de tokens atrapa las variantes de mayúsculas y separadores:

\`\`\`ts
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '')

const leaked = (ids: string[], forbidden: string[]) =>
  ids.filter((id) => forbidden.some((t) => norm(id).includes(norm(t))))

// norm('warehouseSlotCode') === norm('WAREHOUSE_SLOT_CODE')
\`\`\`

Esto cierra el hueco concreto del camelCase, pero sigo tratándolo como respaldo y no como el control. Sigue sin ver una abreviatura, un sinónimo o una paráfrasis, y sigue dependiendo de que la lista esté completa. Por eso la lista ya no se copia de un informe anterior: se reconstruye cada vez a partir de las notas originales del trabajo, porque una lista copiada arrastra sus huecos.

La tercera amplía dónde se busca. Un barrido sobre las líneas añadidas no basta; hay tres superficies distintas y cada una puede filtrar algo:

\`\`\`bash
git diff main...HEAD | grep '^+' | grep -v '^+++' | grep -i -F -f forbidden.txt
git diff main...HEAD | grep -i -F -f forbidden.txt
git log main..HEAD --format='%an %ae %cn %ce%n%B' | grep -i -F -f forbidden.txt
\`\`\`

La primera línea mira solo lo añadido: de eso respondo directamente, y una coincidencia ahí bloquea el cambio. La segunda mira el diff completo con contexto: una coincidencia en una línea preexistente se reporta, pero no se reescribe por iniciativa propia, porque cambiar texto que ya estaba publicado es otra decisión, con su propio alcance. La tercera mira los mensajes de commit y los metadatos de autor y committer, que también terminan públicos y que nadie suele leer con este cuidado. En esa misma pasada busco también atribución de IA que no debería estar ahí.

La cuarta es la regla que ordena todas las demás: el valor por defecto es cerrado. Mantengo dos listas enumeradas, una de lo publicable y otra de lo prohibido. Lo que no está en ninguna de las dos no se publica: se describe de forma genérica o se omite. Si me sorprendo argumentando que algo no está explícitamente prohibido, ese argumento es justamente lo que activa la regla, no una excepción a ella.

\`\`\`
  borrador ──► fragmentos con nombres inventados desde el inicio
                 │
                 ▼
  extraer ejecutando el módulo ──► comparar con el registro de origen
                 │
                 ▼
  barrido en 3 superficies ──► añadidas: bloquea
                 │              contexto: se reporta
                 ▼              metadatos: bloquea
  ¿en ninguna lista? ──► no se publica (default cerrado)
\`\`\`

**El impacto**

El cambio más visible no está en ningún script; está en cómo se redactan los informes. Un informe del gate de protección de datos ya no dice "todo limpio". Dice qué comando corrió, sobre qué superficie, con qué salida cruda y con qué código de salida. Y termina con una sección explícita de lo que no se probó. Un barrido con cero coincidencias aparece como lo que es: la prueba de que los tokens conocidos no están, nada más.

Escribir los fragmentos inventados desde el principio resultó más barato de lo que esperaba. La comparación campo por campo era la parte lenta y la más propensa a error del proceso, y al eliminar su causa casi desaparece. El ejemplo inventado, además, suele enseñar mejor: no arrastra la complejidad accidental del dominio original, y el lector ve el patrón sin ruido.

Cambió también el papel del revisor humano, que en este caso soy yo. Antes leía la certificación del agente y la daba por buena. Ahora leo la medición, y si una afirmación no viene con su comando y su salida, la trato como no verificada. Eso no requiere desconfiar del agente; requiere no confundir una frase con una prueba.

Hay también un costo que acepté a sabiendas. Volver a extraer los fragmentos y leer cada identificador uno por uno toma unos minutos por artículo, y esos minutos no se pueden delegar al mismo barrido que ya falló una vez. Pude haber alargado la lista de tokens y darlo por resuelto. Una lista más larga habría parecido un avance y habría dejado el mismo punto ciego en su sitio: la forma que tome el próximo identificador que a nadie se le ocurrió anotar.

Este artículo no describe la fuga original más allá de su forma, y no lo hará: el detalle de qué se filtró y dónde es exactamente la clase de información que la regla existe para proteger.

**Lecciones**

**Un grep de redacción atrapa tokens, no identificadores.** Una lista de cadenas no puede ver una cadena que el código reescribió en camelCase, PascalCase o con otro separador. Normalizar ayuda, pero un barrido en cero solo prueba que los tokens conocidos no están.

**La mejor comparación es la que no hace falta.** Escribir cada fragmento con nombres inventados desde el inicio elimina el paso más frágil del proceso, en lugar de intentar ejecutarlo mejor.

**Una certificación es una afirmación, no una evidencia.** La verificación tiene que probar la certificación misma, volviendo a extraer y a comparar, no repetir el control que la produjo. Y un informe que afirma una propiedad sin mostrar el comando y la salida no verificó esa propiedad.

**Lo que se publica no es solo el contenido.** Las líneas añadidas, el contexto del diff y los metadatos del commit son tres superficies distintas, y cada una tiene su propia regla sobre qué bloquea y qué solo se reporta.

**Por defecto, cerrado.** Si algo no está en la lista de lo publicable, no se publica. La tentación de argumentar que no estaba prohibido es, precisamente, la señal de que hay que omitirlo.`,
  contentEn: `I write this blog myself, but much of the mechanical work of publishing it is done by AI agents: one researches my notes, one drafts, one applies the change and one reviews. Many posts grow out of client work, so one rule is not negotiable: nothing that identifies the client or its code reaches a public page. No host names, no table names, no type names, no property names.

To enforce that rule I built what anyone would build first: a list of forbidden tokens, assembled by hand from my notes on that work, and a case-insensitive grep over the diff before publishing. If the sweep returned zero hits, the article moved on.

In one of those cycles the sweep returned zero hits. The article was publishing, inside a code block, several property names from a real DTO in a client system. They were not copied verbatim: they were camelCased, derived from how they are spelled in the original source. None of them was on the list, because the list held the way I had written those names down, not the way they ended up written in the snippet.

I found out late, and not through the sweep. And what bothered me most was not the leak itself but something else that happened in the same cycle, which I get to below: a report certifying exactly the property that was false.

This post is not about the client, the article or the names. Everything in it is invented on purpose, and that choice is, in fact, the main fix.

**The Wrong Approach**

The sweep looked like this. The tokens in the example are invented, from a logistics domain that has nothing to do with the original:

\`\`\`bash
# forbidden.txt: one known token per line, built by hand
#   WAREHOUSE_SLOT_CODE
#   warehouse_slot_code
#   Acme Freight
grep -i -F -f forbidden.txt -- staged-article.ts
echo "exit: $?"   # exit: 1 -> zero hits, article advances
\`\`\`

And the snippet the article was publishing looked something like this:

\`\`\`ts
interface ShipmentView {
  warehouseSlotCode: string
  dockWindowEnd: string
  carrierPriorityTier: number
}
\`\`\`

The -i flag folds case, so it looks like it should catch it. It does not. warehouse_slot_code and warehouseSlotCode do not differ in case: they differ by an underscore. Folding case turns the second one into warehouseslotcode, which still does not contain the string warehouse_slot_code. The grep did not fail; it did exactly what I asked. What I asked could not, by construction, see a transformed identifier.

\`\`\`
  source note             published form          grep -i -F
  ───────────             ──────────────          ──────────
  WAREHOUSE_SLOT_CODE ─┐
                       ├─► warehouseSlotCode ──►  no match
  warehouse_slot_code ─┘   (camelCase, no _)      exit 1 = "clean"
\`\`\`

The same problem shows up with kebab-case, PascalCase, abbreviations, an interface prefix, a plural. A token list describes strings, and an identifier in code is a string that the language, the serializer or whoever wrote the snippet rewrites freely. Every rewrite is a new form the list does not have.

So far that is a tooling defect, and more tooling fixes it. The defect that actually cost me was a different one.

The report from the agent that applied the change ended with a concrete statement: every snippet used invented, neutral identifiers, and none was a real client identifier. It did not say "I found no forbidden tokens". It affirmatively said the property held. It was false, and because it was phrased in the voice of a completed check, nobody reviewed the decision behind it. Me included. A green sweep plus a clean certification looked like two controls. In reality there were none: the sweep could not see the problem, and the certification had measured nothing.

**The Solution**

I changed four things, in this order of importance.

The first removes the problem instead of detecting it: every code fence, every JSON body and every ASCII diagram is written with invented identifiers from the start. Client code is not copied and then renamed; a new example is written that illustrates the same pattern. If the snippet never had a real name in it, there is no field-by-field comparison left to get wrong. When an invented example is not enough to teach the pattern, the pattern is explained in prose and the snippet is dropped.

The second treats any certification as a claim to test, never as evidence. If a report says "every snippet uses invented identifiers", verifying it does not mean running the grep again; it means re-extracting the snippets and comparing them again. And so that what gets compared is what actually ships, I extract them by executing the content module, not by reading the source file:

\`\`\`ts
import { blogPosts } from './posts'

const fence = /\`{3}\\w*\\n([\\s\\S]*?)\`{3}/g
for (const post of blogPosts)
  for (const body of [post.content, post.contentEn])
    for (const [, code] of body.matchAll(fence))
      for (const id of code.match(/\\b[a-z]+[A-Z]\\w*\\b/g) ?? [])
        console.log(post.id, id)
\`\`\`

The output is a list of every compound identifier that actually gets published, per post. That list is what gets read against the source record of the work, one name at a time. It is not elegant and does not try to be: it is a measurement that can be repeated and whose raw output can be pasted into a report.

As an extra net, I normalize both sides before comparing. That way the same token list catches case and separator variants:

\`\`\`ts
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '')

const leaked = (ids: string[], forbidden: string[]) =>
  ids.filter((id) => forbidden.some((t) => norm(id).includes(norm(t))))

// norm('warehouseSlotCode') === norm('WAREHOUSE_SLOT_CODE')
\`\`\`

That closes the specific camelCase gap, but I still treat it as a backstop and not as the control. It still cannot see an abbreviation, a synonym or a paraphrase, and it still depends on the list being complete. That is why the list is no longer copied from a previous report: it is rebuilt every time from the original notes on the work, because a copied list carries its gaps forward.

The third widens where I look. A sweep over added lines is not enough; there are three distinct surfaces and each one can leak:

\`\`\`bash
git diff main...HEAD | grep '^+' | grep -v '^+++' | grep -i -F -f forbidden.txt
git diff main...HEAD | grep -i -F -f forbidden.txt
git log main..HEAD --format='%an %ae %cn %ce%n%B' | grep -i -F -f forbidden.txt
\`\`\`

The first line looks only at added lines: I answer for those directly, and a hit there blocks the change. The second looks at the full diff with context: a hit on a pre-existing line is reported, not rewritten on my own initiative, because changing text that was already published is a separate decision with its own scope. The third looks at commit messages and author and committer metadata, which also end up public and which nobody tends to read this carefully. In the same pass I also look for AI attribution that should not be there.

The fourth is the rule that orders all the others: the default is closed. I keep two enumerated lists, one of what is publishable and one of what is forbidden. Anything on neither list is not published: it is described generically or left out. If I catch myself arguing that something is not explicitly forbidden, that argument is exactly what triggers the rule, not an exception to it.

\`\`\`
  draft ──► snippets with invented names from the start
              │
              ▼
  extract by executing the module ──► compare with source record
              │
              ▼
  sweep 3 surfaces ──► added lines: blocks
              │         context: reported
              ▼         metadata: blocks
  on neither list? ──► not published (closed default)
\`\`\`

**The Impact**

The most visible change is not in any script; it is in how reports are written. A data-protection gate report no longer says "all clean". It says which command ran, over which surface, with what raw output and which exit code. And it ends with an explicit section on what was not tested. A sweep with zero hits shows up as what it is: proof that the known tokens are absent, nothing more.

Writing snippets with invented names from the start turned out cheaper than I expected. The field-by-field comparison was the slowest and most error-prone part of the process, and removing its cause makes it almost disappear. The invented example also tends to teach better: it does not drag along the accidental complexity of the original domain, and the reader sees the pattern without noise.

The role of the human reviewer changed too, and in this case that is me. I used to read the agent's certification and accept it. Now I read the measurement, and if a claim does not come with its command and its output, I treat it as unverified. That does not require distrusting the agent; it requires not mistaking a sentence for a test.

There is also a cost I accepted knowingly. Re-extracting the snippets and reading every identifier one by one takes a few minutes per post, and those minutes cannot be delegated to the same sweep that already failed once. I could have made the token list longer and called it solved. A longer list would have looked like progress and would have left the same blind spot in place: whatever form the next identifier takes that nobody thought to write down.

This post does not describe the original leak beyond its shape, and it will not: the detail of what leaked and where is exactly the kind of information the rule exists to protect.

**Lessons**

**A redaction grep catches tokens, not identifiers.** A list of strings cannot see a string that the code rewrote into camelCase, PascalCase or with a different separator. Normalizing helps, but a zero-hit sweep only proves the known tokens are absent.

**The best comparison is the one you no longer need.** Writing every snippet with invented names from the start removes the most fragile step of the process, instead of trying to run it better.

**A certification is a claim, not evidence.** Verification has to test the certification itself, by re-extracting and re-comparing, not by repeating the check that produced it. And a report that asserts a property without showing the command and its output did not verify that property.

**What ships is not only the content.** Added lines, diff context and commit metadata are three different surfaces, and each one has its own rule about what blocks and what is only reported.

**Closed by default.** If something is not on the publishable list, it does not ship. The temptation to argue it was not forbidden is precisely the signal that it should be left out.`,
  relatedIds: ['adversarial-review-missed-user-defects', 'interfaz-uniforme-asimetria-semantica'],
}
