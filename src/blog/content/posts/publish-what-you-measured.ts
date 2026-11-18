import type { BlogPost } from '../../types'

export const publishWhatYouMeasured: Omit<BlogPost, 'readingTime'> = {
  id: 'publish-what-you-measured',
  slug: 'publica-lo-que-mediste',
  title: 'Por qué un caso que mediste le sirve más al lector que tu lista de habilidades',
  titleEn: 'Why a Case You Measured Gives a Reader More to Go On Than Your Skills List',
  date: '2026-11-17',
  tags: ['emprender', 'portafolio', 'credibilidad', 'medición', 'escritura'],
  category: 'ensayo',
  featured: false,
  excerpt:
    'Una lista de habilidades se lee igual si la escribe quien domina la herramienta, quien la usó una semana o quien miente. Un caso con una medición y su método le da al lector algo que puede repetir. Defiendo lo segundo con este mismo sitio como única evidencia, y aviso lo que falta: no tengo datos de si publicar así trae trabajo.',
  excerptEn:
    'A skills list reads the same whether it was written by someone who masters the tool, someone who used it for a week, or someone who is lying. A case with a measurement and its method gives the reader something to rerun. I argue for the second with this site as my only evidence, and I say what is missing: I have no data on whether publishing this way brings work.',
  content: `Cuando alguien que no te conoce tiene que decidir si confía en ti, suele tener delante una de dos cosas: una lista de habilidades o un caso escrito con una medición adentro. Creo que, para un desarrollador independiente o un negocio técnico pequeño, el caso con medición funciona mejor. La razón es que un lector puede comprobar una medición. Cuando solo le dices que sabes algo, no tiene cómo comprobarlo.

Aclaro desde ya qué clase de texto es este. No trae datos de resultados. No reporta si publicar así consigue más contactos, entrevistas o clientes que no hacerlo, y no quiero dar a entender que sí. Lo que sigue es un argumento sobre qué puede verificar un lector. Se apoya en una sola fuente de evidencia, que es este mismo sitio. Aquí conviven las dos formas de presentarse y se pueden leer una al lado de la otra.

**Lo que se suele hacer**

La forma habitual de presentarse es el inventario. Un currículum, un perfil o la sección de experiencia de un portafolio enumeran tecnologías, años y adjetivos. Tiene sentido, porque es barato de escribir, barato de leer, y es lo que esperan los filtros que buscan palabras clave. Yo también lo hago. Una de las entradas de mi página de experiencia termina con esta lista: ".NET 8, C#, SQL Server, Clean Architecture, Flutter, Dapper, React, TypeScript".

Esa lista no es falsa. Lo que le pasa es que alguien que usó cada una de esas herramientas una semana escribiría la misma lista, y alguien que miente también. Las tres personas producen los mismos caracteres. El lector no tiene con qué distinguirlas, así que hace lo único razonable, que es descontar la lista completa y buscar otra señal.

Lo mismo pasa con las frases que suenan a logro. En esa misma página hay una entrada de 2023 que habla de "un backend altamente escalable en .NET fundamentado en principios SOLID". Quien la lee desde afuera no se entera de cuánta carga soportó ese backend, contra qué se comparó ni qué habría pasado con otro diseño. Puede ser cierta. El lector no tiene forma de saberlo, y por eso la frase no le pesa.

**Por qué la lista no le alcanza al lector**

La lista le informa al lector de qué temas puedo hablar. Pero informar es distinto de darle algo que pueda revisar, y la lista no le deja nada que hacer.

Compárala con lo que hay en el blog de este mismo sitio. En [el artículo sobre GETDATE() y SYSDATETIME()](#blog/article/getdate-vs-sysdatetime-reloj-que-retrocede) no digo que sé de tipos de fecha en SQL Server. Cuento que leí los dos relojes uno detrás del otro 20,000 veces y que en 13,339 el segundo quedó como anterior al primero. También publico el bucle que lo cuenta. Un lector con una instancia de SQL Server puede correrlo en un minuto. Si le da un número parecido, ya no depende de mi palabra. Si le da otro, tiene con qué escribirme para decirme que estoy equivocado.

Esa segunda posibilidad es la que importa. Cuando publico una medición con su método, acepto que alguien pueda demostrar que está mal, y por eso se le puede creer. La lista de habilidades no corre ese riesgo, y por lo mismo no gana nada.

Hay un efecto secundario. El artículo no usa la etiqueta "SQL Server avanzado" en ninguna parte, y aun así la respalda mejor que la etiqueta misma. Para explicar por qué el reloj retrocede hay que entender cómo redondea cada tipo, así que quien lee el caso ve la habilidad sin que yo la nombre. Al revés no funciona, porque de la etiqueta no se deduce ningún caso.

Otros artículos del sitio siguen el mismo patrón, y los números más útiles son los que no me dejan bien. En [el de la revisión adversarial](#blog/article/revision-adversarial-no-encontro-lo-que-el-usuario-si) cuento un proyecto con 426 pruebas, cerca de 95 % de cobertura y once rondas de revisión. A continuación cuento que en cinco minutos de uso encontré dos defectos que lo volvían inservible. En [el de la API interna de YouTube Music](#blog/article/youtube-innertube-api-resiliencia) cuento que 24 de 25 resultados de búsqueda caían en el lugar equivocado después de un cambio de formato. Una lista de habilidades no tiene dónde poner un número así. Y quien solo publica éxitos está eligiendo qué mostrar.

**Tres niveles, según lo que el lector puede hacer**

Ordeno las formas de presentarse en tres niveles, según lo que el lector puede hacer con cada una.

![Tres bloques numerados y apilados. 1, afirmación: el lector solo puede creerla o no. 2, número sin método: puede comparar y preguntar. 3, número con método: puede repetirlo y desmentirlo. Una flecha indica que del 1 al 3 crece lo que el lector puede verificar.](figure/publish-measured-check "Esquema conceptual, no datos medidos. Los tres ejemplos son textos de este sitio. El orden entre ellos es el argumento del ensayo.")

El primer nivel es la afirmación: "SQL Server, Clean Architecture, Dapper". El lector solo puede creerla o no.

El segundo es el número sin método. En mi página de experiencia hay una línea que dice que una integración redujo sus tiempos de consulta "de 3s a 400ms". Es mejor que un adjetivo, porque es específica, permite comparar, y alguien que estuvo ahí podría desmentirla. Pero el lector de afuera no puede repetirla. No sabe qué se midió, con cuántas muestras ni en qué condiciones. Sigue dependiendo de mi palabra, solo que ahora con más detalle.

El tercero es el número con su método publicado: 13,339 de 20,000, y el bucle. Aquí el lector puede repetirlo, y con eso la prueba deja de depender de mí. Ya no le pido que confíe. Le doy con qué comprobar.

> Un número suelto se puede inventar igual que un adjetivo.

Lo que veo al ordenarlos así es que el salto grande está entre el segundo nivel y el tercero. Pasar de "sin número" a "con número" cambia menos. Lo difícil de inventar es un procedimiento que cualquiera puede ejecutar y que da lo que dije que daba.

De ahí sale una lectura incómoda de mi propio sitio. Los casos de estudio están llenos de cifras del segundo nivel. Son específicas y comparables, pero quien las lee desde afuera no puede repetir ninguna. Según este orden, un solo artículo del tercer nivel le da más con qué decidir que todas esas cifras juntas.

**Cómo aplicarlo**

Primero, elige un caso en lugar de un tema. "Rendimiento en bases de datos" es un tema. "Una prueba que fallaba dos de cada tres veces, y por qué" es un caso. El caso trae su propia medición, y el tema solo trae opiniones.

Segundo, mide antes de explicar. En el artículo del reloj, la teoría del redondeo era plausible desde el principio. Lo que la volvió publicable fue contar. Sin el 13,339 habría sido una explicación más sobre pruebas intermitentes.

Tercero, publica el método junto al número, con el tamaño de la muestra y las condiciones. Si el lector no puede repetirlo por falta de acceso, que al menos vea cómo se hizo y juzgue si el procedimiento aguanta.

Cuarto, incluye lo que salió mal. Un caso donde todo funcionó a la primera le deja al lector muy poco que revisar.

Queda el caso difícil, que para quien trabaja con clientes es el habitual: no puedes medir, o no puedes publicar lo que mediste. El trabajo es confidencial, o no existe una línea base contra la cual comparar. Ahí hay tres salidas, y ninguna consiste en inventar una cifra.

La primera es el rango. En vez del valor exacto das el orden de magnitud. En mi página de experiencia hay un cálculo nocturno descrito como "50.000–100.000 consultas sobre 15.000–50.000 registros". El rango protege el dato del cliente y conserva lo que el lector necesita, que es la escala.

La segunda es la reproducción. Si no puedes mostrar el sistema real, reconstruyes el fenómeno en un ejemplo neutro que cualquiera pueda ejecutar. [El artículo sobre el grep de redacción](#blog/article/grep-redaccion-no-ve-camelcase) hace eso. Todo lo que aparece ahí es inventado a propósito, de un dominio que no tiene relación con el original. Aun así el lector puede comprobar en su terminal que una búsqueda que ignora mayúsculas no encuentra warehouse_slot_code dentro de warehouseSlotCode. No hay un solo dato del cliente y la demostración está completa.

La tercera es publicar el método cuando no hay número. Puedes contar qué se ejecutó, sobre qué, y qué quedó sin probar. Escribir "esto no lo medí" le dice al lector exactamente dónde termina lo que sé, y eso también es información que puede usar.

Lo que no sirve es el punto medio: una cifra redonda sin origen, puesta porque un caso "debe" tener un número. Una cifra así vale lo mismo que la afirmación del primer nivel, porque el lector solo puede creerla o no.

**Dónde puedo estar equivocado**

El punto más débil es el que avisé al principio. Mi tesis dice que el caso medido gana más confianza. La confianza se nota en lo que la gente hace después de leer: escribir, llamar, contratar. Sobre eso este ensayo no reporta nada.

Lo que ofrezco, entonces, es un argumento sobre lo que el lector puede verificar. No ofrezco un resultado sobre ventas, y lo segundo no se deduce de lo primero.

Hay otras tres objeciones que me tomo en serio.

La primera es que muchos lectores no verifican nada. Alguien con decenas de perfiles por revisar no va a correr un bucle. Es probable. Mi respuesta es que la posibilidad de verificar pesa aunque nadie la use, porque mentir en algo comprobable sale caro. Pero eso es otra vez un argumento, y no tengo cómo mostrar que los lectores razonan así.

La segunda es que los filtros automáticos buscan palabras clave. Un caso medido no reemplaza la lista, y quien la quite puede desaparecer de búsquedas donde sí lo estaban buscando. La lista sigue en mi sitio y no propongo quitarla. Lo que defiendo es que no sea lo único que hay.

La tercera es que medir tiene sesgo de selección. Se publica lo que se pudo contar, y lo que se puede contar no siempre es lo importante. El criterio de diseño, el trato con un cliente difícil o saber cuándo no construir algo no caben en un bucle de 20,000 iteraciones. Un portafolio hecho solo de mediciones describiría a alguien muy bueno contando y diría poco de lo demás.

Con todo eso, mantengo la tesis en su versión acotada. Entre decir que sabes algo y mostrar algo que mediste junto con la forma de repetirlo, lo segundo le da al lector más con qué decidir. Si además se convierte en trabajo es una pregunta abierta, y este texto no la responde.`,
  contentEn: `When someone who does not know you has to decide whether to trust you, they usually have one of two things in front of them: a skills list, or a written case with a measurement in it. I think that for an independent developer or a small technical business, the measured case works better. The reason is that a reader can check a measurement. When you only tell them you know something, they have no way to check it.

I should say up front what kind of text this is. It contains no outcome data. It does not report whether publishing this way gets more contacts, interviews or clients than not doing it, and I do not want to suggest that it does. What follows is an argument about what a reader is able to verify. It rests on a single source of evidence, which is this site. Both ways of presenting yourself live here, and you can read them side by side.

**What people usually do**

The usual way to present yourself is the inventory. A résumé, a profile or the experience section of a portfolio lists technologies, years and adjectives. That makes sense, because it is cheap to write, cheap to read, and it is what keyword filters expect. I do it too. One entry on my experience page ends with this list: ".NET 8, C#, SQL Server, Clean Architecture, Flutter, Dapper, React, TypeScript".

That list is not false. Its trouble is that someone who used each of those tools for a week would write the same list, and so would someone who is lying. All three people produce the same characters. The reader has nothing to tell them apart with, so they do the only reasonable thing, which is to discount the whole list and look for another signal.

The same goes for sentences that sound like achievements. That same page has an entry from 2023 that mentions "a highly scalable backend in .NET grounded in SOLID principles". Someone reading it from the outside does not learn how much load that backend carried, what it was compared against, or what would have happened with a different design. It may well be true. The reader cannot know, so the sentence carries no weight with them.

**Why the list is not enough for the reader**

The list tells the reader which topics I can talk about. But telling them is different from giving them something they can inspect, and the list leaves them nothing to do.

Compare it with what is on this site's blog. In [the post about GETDATE() and SYSDATETIME()](#blog/article/getdate-vs-sysdatetime-reloj-que-retrocede) I do not say I know SQL Server date types. I say that I read the two clocks back to back 20,000 times and that in 13,339 of those the second came out earlier than the first. I also publish the loop that counts it. A reader with a SQL Server instance can run it in a minute. If they get a similar number, they no longer depend on my word. If they get a different one, they have something concrete to write to me about and tell me I am wrong.

That second possibility is the one that matters. When I publish a measurement with its method, I accept that someone may show it is wrong, and that is why it can be believed. A skills list takes no such risk, and for the same reason it earns nothing.

There is a side effect. The post never uses the label "advanced SQL Server", and it still backs that label better than the label itself does. Explaining why the clock runs backwards requires understanding how each type rounds, so whoever reads the case sees the skill without my naming it. It does not work in reverse, because no case can be derived from the label.

Other posts on the site follow the same pattern, and the most useful numbers are the unflattering ones. In [the one about adversarial review](#blog/article/revision-adversarial-no-encontro-lo-que-el-usuario-si) I describe a project with 426 tests, roughly 95% coverage and eleven review rounds. Then I say that five minutes of actually using it turned up two defects that made it unusable. In [the one about YouTube Music's internal API](#blog/article/youtube-innertube-api-resiliencia) I say that 24 of 25 search results landed in the wrong place after a format change. A skills list has nowhere to put a number like that. And someone who only publishes wins is choosing what to show.

**Three levels, by what the reader can do**

I sort the ways of presenting yourself into three levels, by what the reader can do with each.

![Three numbered, stacked blocks. 1, claim: the reader can only believe it or not. 2, number without method: they can compare and ask. 3, number with method: they can rerun it and disprove it. An arrow shows that what the reader can check grows from 1 to 3.](figure/publish-measured-check "Conceptual sketch, not measured data. The three examples are text from this site. The order between them is the essay's argument.")

The first level is the claim: "SQL Server, Clean Architecture, Dapper". The reader can believe it or not, and that is all.

The second is the number without a method. My experience page has a line saying an integration cut its query times "from 3s to 400ms". That beats an adjective, because it is specific, it allows comparison, and someone who was there could contradict it. But an outside reader cannot rerun it. They do not know what was measured, over how many samples, or under which conditions. It still depends on my word, only with more detail now.

The third is the number with its method published: 13,339 of 20,000, plus the loop. Here the reader can repeat it, and with that the proof stops depending on me. I no longer ask them to trust me. I give them the means to check.

> A bare number can be made up as easily as an adjective.

What I see when I sort them this way is that the big jump is between the second level and the third. Going from "no number" to "a number" changes less. What is hard to make up is a procedure anyone can run that returns what I said it returns.

That gives an uncomfortable reading of my own site. The case studies are full of second-level figures. They are specific and comparable, but an outside reader cannot rerun a single one. By this ordering, one third-level post gives them more to decide with than all of those figures together.

**How to apply it**

First, pick a case instead of a topic. "Database performance" is a topic. "A test that failed two times out of three, and why" is a case. A case brings its own measurement, and a topic only brings opinions.

Second, measure before you explain. In the clock post, the rounding theory was plausible from the start. What made it publishable was counting. Without the 13,339 it would have been one more explanation of flaky tests.

Third, publish the method next to the number, with the sample size and the conditions. If the reader cannot rerun it for lack of access, they should at least see how it was done and judge whether the procedure holds up.

Fourth, include what went wrong. A case where everything worked the first time leaves the reader very little to inspect.

That leaves the hard case, which is the normal one for anyone doing client work: you cannot measure, or you cannot publish what you measured. The work is confidential, or there is no baseline to compare against. There are three ways out, and none of them is inventing a figure.

The first is the range. Instead of the exact value, you give the order of magnitude. My experience page describes a nightly calculation as "50,000–100,000 queries over 15,000–50,000 records". The range protects the client's data and keeps what the reader needs, which is the scale.

The second is the reproduction. If you cannot show the real system, you rebuild the phenomenon in a neutral example anyone can run. [The post about the redaction grep](#blog/article/grep-redaccion-no-ve-camelcase) does that. Everything in it is invented on purpose, from a domain unrelated to the original. The reader can still confirm in their own terminal that a case-insensitive search does not find warehouse_slot_code inside warehouseSlotCode. It contains no client data at all, and the demonstration is complete.

The third is to publish the method when there is no number. You can say what was run, against what, and what was left untested. Writing "I did not measure this" tells the reader exactly where my knowledge stops, and that is information they can use too.

What does not work is the middle ground: a round figure with no origin, added because a case is "supposed to" have a number. A figure like that is worth the same as the first-level claim, because the reader can only believe it or not.

**Where I could be wrong**

The weakest point is the one I flagged at the start. My thesis says the measured case earns more trust. Trust shows up in what people do after reading: write, call, hire. This essay reports nothing about that.

What I offer, then, is an argument about what the reader can check. I do not offer a result about sales, and the second does not follow from the first.

There are three more objections I take seriously.

The first is that many readers verify nothing. Someone with dozens of profiles to get through is not going to run a loop. That is probably true. My answer is that the possibility of checking carries weight even when nobody uses it, because lying about something checkable is expensive. But that is an argument again, and I cannot show that readers reason that way.

The second is that automated filters look for keywords. A measured case does not replace the list, and whoever removes it may vanish from searches where they were in fact being looked for. The list is still on my site and I am not proposing to remove it. What I argue is that it should not be the only thing there.

The third is that measuring has a selection bias. You publish what you were able to count, and what can be counted is not always what matters. Design judgment, handling a difficult client, or knowing when not to build something do not fit in a 20,000-iteration loop. A portfolio made only of measurements would describe someone who is very good at counting and say little about the rest.

With all that, I keep the thesis in its narrow form. Between saying you know something and showing something you measured along with the way to repeat it, the second gives the reader more to decide with. Whether it also turns into work is an open question, and this text does not answer it.`,
  relatedIds: [
    'getdate-vs-sysdatetime',
    'adversarial-review-missed-user-defects',
    'redaction-grep-misses-camelcase',
  ],
}
