import type { BlogPost } from '../../types'

export const characterizeBeforeYouChange: Omit<BlogPost, 'readingTime'> = {
  id: 'characterize-before-you-change',
  slug: 'antes-de-cambiar-lo-que-heredaste',
  title: 'Antes de cambiar lo que heredaste, escribe lo que hace hoy',
  titleEn: 'Write Down What It Does Before You Change What You Inherited',
  date: '2026-11-17',
  tags: ['liderazgo', 'legacy-code', 'testing', 'decisiones'],
  category: 'ensayo',
  featured: false,
  excerpt:
    'La cerca de Chesterton pide entender por qué algo está ahí antes de quitarlo. En lo heredado esa razón casi nunca está disponible; el comportamiento sí. Sostengo que registrar lo que algo hace hoy, en una forma que después pueda desmentirte, es una regla para dirigir cambios más que una técnica de pruebas. Con sistemas tengo evidencia propia; con procesos y equipos es una extensión por analogía, y lo digo así.',
  excerptEn:
    'Chesterton\'s fence asks you to understand why something is there before you remove it. With inherited things that reason is rarely available; the behavior is. I argue that recording what something does today, in a form that can contradict you later, is a rule for leading change more than a testing technique. For systems I have my own evidence; for processes and teams it is an extension by analogy, and I say so.',
  content: `Cuando heredas algo que funciona mal, lo primero que te piden es que lo cambies. Mi regla va en otro orden: antes de cambiar lo que heredaste, escribe lo que hace hoy. No lo que debería hacer, ni lo que dice la documentación, ni lo que recuerda quien lo construyó. Lo que hace, en una forma que pueda contradecirte después.

Aprendí esa regla con código, y durante un tiempo la tuve archivada como una técnica de pruebas. Hoy creo que es una regla sobre cómo se dirige un cambio, y que vale igual para un sistema, para un proceso y para un equipo que ya existían antes de que llegaras. Los dos últimos casos son una extensión mía, y más abajo digo con qué evidencia cuento.

**La idea común**

La idea común tiene dos versiones y las dos suenan sensatas.

La primera es la del que llega con mandato: te trajeron para arreglar esto, así que cada semana que pasas mirando es una semana sin resultados. Lo heredado se ve mal desde afuera, y la lectura rápida es que quien lo hizo no sabía lo que hacía.

La segunda es más respetable y es la que me interesa discutir: entiende por qué está ahí antes de quitarlo. Es la cerca de Chesterton. En "The Thing" (1929), en el capítulo "The Drift from Domesticity", G. K. Chesterton imagina una cerca atravesada en un camino y a un reformador que dice que no le ve la utilidad y propone quitarla. La respuesta del reformador más inteligente, en [el texto original](https://gist.github.com/austintaylor/90c9b867ca949d7ffb748549a76422bb), es esta (la traducción es mía):

> "Si no le ves la utilidad, ciertamente no te dejaré quitarla. Vete y piensa. Después, cuando puedas volver y decirme que sí le ves la utilidad, tal vez te permita destruirla."

Estoy de acuerdo con el orden que propone. Mi desacuerdo es con lo que acepta como prueba.

**Por qué falla**

Chesterton pide una razón. En lo heredado, la razón es justo lo que casi nunca está disponible. Quien puso la cerca se fue, o no se acuerda, o recuerda una versión ordenada de algo que en su momento fue una urgencia. Hay un riesgo peor: puedes volver con una razón plausible y equivocada. Decir "ya le vi la utilidad" es una opinión, y nada la pone a prueba.

Lo que siempre está disponible es el comportamiento. No necesitas al autor para observar qué hace hoy un sistema. Y un registro de lo que hace tiene una propiedad que una explicación no tiene: después del cambio puedes compararlo con la realidad y ver si coincide.

Tengo un caso documentado. Heredé un servicio .NET con tres métodos de 167, 161 y 137 líneas en el camino crítico: decidían cuándo se cierra un trabajo, con qué resultado y en qué orden se guardan las cosas. [Conté el detalle técnico en otro artículo](#blog/article/pruebas-caracterizacion-antes-de-refactorizar); aquí me interesan tres momentos de esa historia.

El primero: busqué los tres archivos en el proyecto de pruebas y aparecieron. No eran una red de seguridad. Eran menciones en comentarios y pruebas que leían el texto del archivo para verificar que ciertas palabras no estuvieran, sin ejecutar una sola línea. Lo heredado suele venir con algo así: señales de que alguien ya lo tiene bajo control que, al revisarlas, no describen lo que hace.

El segundo: el plan tentador era extraer con cuidado y revisar el diff con lupa. La revisión detecta lo que se ve raro, y un cambio de orden no se ve raro. Mover una línea de persistencia dos posiciones más abajo parece normal en un diff, y el error aparece días después como un trabajo que quedó abierto.

El tercero: antes de tocar producción escribí 16 pruebas que fijan lo que el código hace hoy, incluido el orden de sus efectos. Si el comportamiento tenía una rareza, la prueba la fijaba igual; no era el momento de corregir nada. Con eso en verde corté los métodos a 80, 79 y 34 líneas, una extracción a la vez.

Según [esta nota de InfoQ](https://www.infoq.com/news/2007/03/characterization-testing), el término lo acuñó Michael Feathers en "Working Effectively with Legacy Code", donde define las pruebas de caracterización como pruebas que caracterizan el comportamiento real de un fragmento de código. La palabra que importa es "real". Chesterton pide entender el propósito. La caracterización pide registrar el hecho, que es más barato y se puede verificar.

No es mi único caso. Cuando hice el fork de un proyecto Flutter que su autor había marcado como no mantenido, mi primer instinto fue agregar funciones; [al leer el estado real](#blog/article/heredar-proyecto-flutter-no-mantenido) encontré una app que no compilaba y un fallo en el arranque en frío. Y hoy dirijo una actualización por fases de Laravel 8 a 13 en producción contra una línea base de 1.143 pruebas: cada fase cierra con cero fallos nuevos. Esa línea base es lo que el sistema hacía antes de que yo empezara, escrito donde me puede desmentir.

**El modelo**

Hay dos caminos para cambiar algo heredado, y se diferencian en el momento en que descubres lo que hacía.

![Diagrama de flujo con dos caminos. Camino A, cambiar primero: cambiar sin registro, algo falla días después, averiguar qué hacía antes, y una flecha punteada que vuelve al inicio marcada como otra vuelta. Camino B, caracterizar primero: escribir lo que hace hoy, cambiar un paso, comparar con lo escrito; si no coincide, se revierte ese paso.](blog/figures/characterize-paths-es.svg "Esquema conceptual, no datos medidos: los dos caminos para cambiar algo heredado.")

En el camino A cambias primero. Lo que el sistema hacía lo descubres por sus ausencias: algo deja de pasar, alguien lo nota, y reconstruyes el comportamiento anterior a partir de la queja. Cada vuelta tiende a salir más cara que la anterior, porque ahora hay dos versiones del comportamiento, la vieja y la tuya, y la vieja ya no se puede observar.

En el camino B el descubrimiento ocurre antes, cuando todavía es barato: el original sigue ahí y puedes preguntarle. El cambio se hace en pasos pequeños y cada paso se compara con lo escrito. Si no coincide, se revierte ese paso y nada más.

El esquema exagera la limpieza del camino B: una caracterización nunca es completa y algo se escapa. Pero en B eso es la excepción, y en A es el método de trabajo.

**Cómo aplicarlo**

**1. Sistemas**

Aquí tengo evidencia y la regla es concreta. Antes de refactorizar, la pregunta es qué prueba se pone roja si cambio el comportamiento de este método. Si no hay respuesta, no hay red, por mucho que el archivo aparezca en el proyecto de pruebas. Y hay que comprobar que el registro puede fallar: quitar a mano una condición y ver que la prueba lo nota.

**2. Procesos**

Esto ya es una extensión por analogía, apoyada en un solo caso propio y pequeño. En un conjunto de pruebas de base de datos encontré una convención ya establecida: todos los casos retrocedían una fecha cinco segundos antes de continuar. Nadie había escrito por qué. [Medir lo que hacía](#blog/article/getdate-vs-sysdatetime-reloj-que-retrocede) mostró que tapaba una inconsistencia real entre dos funciones de reloj. Es un proceso de trabajo en miniatura: un paso que todos repiten y nadie puede justificar.

La analogía que propongo es esta. El procedimiento documentado dice lo que el proceso debería hacer; equivale al comentario en el código. Caracterizar un proceso es escribir lo que ocurre: quién hace qué, en qué orden, qué sale de cada paso y quién usa esa salida. La parte del orden me parece la más transferible, porque en mis pruebas fue justo la que la revisión visual no veía. Un paso de aprobación que parece burocracia puede ser lo único que obliga a que dos cosas ocurran en secuencia. Y el registro tiene que poder desmentirte: después del cambio, las mismas salidas deben seguir llegando a las mismas personas, o tienes que poder decir cuál quitaste a propósito.

**3. Equipos**

Aquí no tengo evidencia documentada y prefiero decirlo. Lo que sigue es argumento. [EDWIN: confirm si tienes un caso real de heredar o dirigir un equipo que ya existía; si no lo hay, esta sección se queda como argumento o se recorta.]

Un equipo heredado también tiene comportamiento actual: quién decide qué sin que nadie se lo haya asignado, a quién se le pregunta cuando algo se rompe, qué acuerdos se cumplen sin estar escritos. El organigrama cumple el papel de la documentación. La versión de la regla sería: antes de reorganizar, escribe cómo se toman hoy las decisiones y muéstraselo al equipo para que lo corrija. Esa última parte no tiene equivalente en el código, y ahí la analogía se debilita. Un método no cambia porque lo observes ni le importa lo que escribas sobre él. Una persona sí.

**Dónde puede estar equivocado**

El primero es la urgencia. Si lo heredado está causando daño ahora (una caída en producción, datos expuestos, un trato inaceptable dentro de un equipo), se detiene primero y se caracteriza después. La regla es para cambios elegidos, no para emergencias.

El segundo es el costo. Mis 16 pruebas cubrían tres métodos. Caracterizar un sistema entero antes de tocarlo es otra forma de no tocarlo nunca. La salida que conozco es caracterizar solo el perímetro de lo que vas a cambiar y aceptar el resto como riesgo declarado.

El tercero es que fijar lo que algo hace no equivale a aprobarlo. Una prueba de caracterización fija también los defectos, y si se queda para siempre sin que nadie la revise convierte un accidente en contrato. Conviene separar dos decisiones: primero conservar el comportamiento mientras cambias la forma; después, con el registro en la mano, decidir qué comportamiento cambiar a propósito. El propio Chesterton deja esa puerta abierta en el mismo capítulo: quien sabe cómo surgió algo y para qué servía puede concluir que esos propósitos eran malos o que ya no se cumplen. Conviene saber también que él usa la cerca para defender una institución concreta, el hogar y la familia. Tomo el procedimiento, no esa conclusión.

El cuarto es el más serio para la tesis: la extensión a equipos. Escribir lo que hace hoy un grupo de personas puede sentirse como vigilancia, puede congelar la descripción de alguien que iba a cambiar por su cuenta, y puede ser simplemente incorrecto, porque no hay forma de ejecutar a un equipo dos veces con la misma entrada. Si la regla sobrevive ahí, será en una versión más modesta: no asumas que lo que no entiendes no sirve, y deja por escrito lo que observaste antes de mover nada, para que después puedas distinguir lo que rompiste de lo que ya estaba roto.

Esa versión modesta me basta. Lo que defiendo es un orden de trabajo: primero el registro, después el cambio. Con sistemas lo he comprobado en mi propio trabajo. Con procesos y equipos es una apuesta razonada, y está marcada como tal.`,
  contentEn: `When you inherit something that works badly, the first thing people ask is that you change it. My rule runs in a different order: before you change what you inherited, write down what it does today. Not what it should do, not what the documentation says, not what the person who built it remembers. What it does, in a form that can contradict you later.

I learned that rule on code, and for a while I filed it as a testing technique. I now think it is a rule about how to lead a change, and that it holds for a system, a process, and a team that existed before you arrived. The last two are my own extension, and further down I say what evidence I have.

**The common view**

The common view comes in two versions, and both sound sensible.

The first belongs to whoever arrives with a mandate: you were brought in to fix this, so every week spent looking is a week without results. Inherited things look bad from the outside, and the quick reading is that whoever made them did not know what they were doing.

The second is more respectable, and it is the one I want to argue with: understand why it is there before you remove it. That is Chesterton's fence. In "The Thing" (1929), in the chapter "The Drift from Domesticity", G. K. Chesterton pictures a fence or gate across a road and a reformer who says he sees no use in it and proposes to clear it away. The more intelligent reformer, in [the original text](https://gist.github.com/austintaylor/90c9b867ca949d7ffb748549a76422bb), answers:

> "If you don't see the use of it, I certainly won't let you clear it away. Go away and think. Then, when you can come back and tell me that you do see the use of it, I may allow you to destroy it."

I agree with the order he proposes. I disagree with what he accepts as proof.

**Why it fails**

Chesterton asks for a reason. With inherited things, the reason is exactly what is rarely available. Whoever put up the fence has left, or has forgotten, or remembers a tidy version of what was an emergency at the time. There is a worse risk: you can come back with a reason that is plausible and wrong. "I see the use of it now" is an opinion, and nothing tests it.

What is always available is behavior. You do not need the author to observe what a system does today. And a record of what it does has a property an explanation lacks: after the change you can hold it against reality and see whether they match.

I have one documented case. I inherited a .NET service with three methods of 167, 161 and 137 lines on the critical path: they decided when a job closes, with which outcome, and in which order things get saved. [I wrote up the technical detail in another post](#blog/article/pruebas-caracterizacion-antes-de-refactorizar); three moments from that story matter here.

First, I searched the test project for the three files and they showed up. They were no safety net. The hits were mentions in comments and tests that read the file's text to check that certain words were absent, without running a single line. Inherited things often come with something like that: signs that someone already has it under control which, on inspection, do not describe what it does.

Second, the tempting plan was to extract carefully and review the diff closely. Review catches what looks odd, and a change of order does not look odd. Moving a persistence line two positions down looks normal in a diff, and the mistake shows up days later as a job left open.

Third, before touching production code I wrote 16 tests that pin what the code does today, including the order of its side effects. If current behavior had a quirk, the test pinned the quirk too; it was not the moment to fix anything. With those green, I cut the methods down to 80, 79 and 34 lines, one extraction at a time.

According to [this InfoQ piece](https://www.infoq.com/news/2007/03/characterization-testing), Michael Feathers coined the term in "Working Effectively with Legacy Code", where he defines characterization tests as tests that characterize the actual behavior of a piece of code. The word that matters is "actual". Chesterton asks you to understand the purpose. Characterization asks you to record the fact, which is cheaper and can be checked.

It is not my only case. When I forked a Flutter project its author had marked as unmaintained, my first instinct was to add features; [reading its real state](#blog/article/heredar-proyecto-flutter-no-mantenido) turned up an app that did not compile and a crash on cold start. And today I lead a phased Laravel 8 to 13 upgrade in production against a baseline of 1,143 tests: every phase closes with zero new failures. That baseline is what the system did before I started, written where it can prove me wrong.

**The model**

There are two paths for changing something inherited, and they differ in when you find out what it used to do.

![Flow diagram with two paths. Path A, change first: change with no record, something breaks days later, find out what it used to do, and a dashed arrow back to the start labeled another round. Path B, characterize first: write what it does today, change one step, compare with the record; if it differs, that step is reverted.](blog/figures/characterize-paths-en.svg "Conceptual sketch, not measured data: the two paths for changing something you inherited.")

On path A you change first. You learn what the system did through its absences: something stops happening, someone notices, and you rebuild the previous behavior from the complaint. Each round tends to cost more than the last, because there are now two versions of the behavior, the old one and yours, and the old one can no longer be observed.

On path B the discovery happens earlier, while it is still cheap: the original is still there and you can ask it. The change goes in small steps and each step is compared with the record. If it differs, you revert that step and nothing else.

The sketch makes path B look cleaner than it is: a characterization is never complete and something gets through. But on B that is the exception, and on A it is the working method.

**How to apply it**

**1. Systems**

Here I have evidence and the rule is concrete. Before refactoring, ask which test turns red if you change this method's behavior. If there is no answer, there is no net, however often the file shows up in the test project. Then check that the record can fail: remove a condition by hand and watch the test notice.

**2. Processes**

From here on it is an extension by analogy, resting on a single small case of my own. In a suite of database tests I found an established convention: every case pushed a timestamp five seconds into the past before going on. Nobody had written down why. [Measuring what it did](#blog/article/getdate-vs-sysdatetime-reloj-que-retrocede) showed it was covering a real inconsistency between two clock functions. It is a working process in miniature: a step everyone repeats and nobody can justify.

The analogy I propose is this. The documented procedure says what the process should do; it plays the role of the comment in the code. Characterizing a process means writing what happens: who does what, in which order, what comes out of each step, and who uses that output. The part about order seems the most transferable to me, because in my tests it was exactly the part visual review could not see. An approval step that looks like bureaucracy may be the only thing forcing two things to happen in sequence. And the record has to be able to prove you wrong: after the change, the same outputs should still reach the same people, or you should be able to say which one you removed on purpose.

**3. Teams**

Here I have no documented evidence and I would rather say so. What follows is argument. [EDWIN: confirm whether you have a real case of inheriting or leading a team that already existed; if there is none, this section stays as argument or gets cut.]

An inherited team also has current behavior: who decides what without anyone having assigned it, who gets asked when something breaks, which agreements are kept without being written anywhere. The org chart plays the role of the documentation. The rule would read: before reorganizing, write down how decisions get made today and show it to the team so they can correct it. That last part has no equivalent in code, and it is where the analogy weakens. A method does not change because you observe it, and it does not care what you write about it. A person does.

**Where this could be wrong**

The first is urgency. If the inherited thing is causing harm right now (a production outage, exposed data, unacceptable treatment inside a team), you stop it first and characterize afterwards. The rule is for chosen changes, not for emergencies.

The second is cost. My 16 tests covered three methods. Characterizing a whole system before touching it is another way of never touching it. The way out I know is to characterize only the perimeter of what you are about to change and accept the rest as declared risk.

The third is that pinning what something does is not approving it. A characterization test pins the defects too, and if it stays forever without anyone revisiting it, it turns an accident into a contract. Two decisions are better kept apart: first preserve the behavior while you change the shape; then, record in hand, decide which behavior to change on purpose. Chesterton leaves that door open in the same chapter: someone who knows how a thing arose and what it was meant to serve may conclude those purposes were bad or are no longer served. It is also worth knowing that he uses the fence to defend a specific institution, the household and the family. I take the procedure, not that conclusion.

The fourth is the most serious for the thesis: the extension to teams. Writing down what a group of people does today can feel like surveillance, can freeze a description of someone who was going to change on their own, and can simply be inaccurate, because there is no way to run a team twice on the same input. If the rule survives there, it will be in a more modest version: do not assume that what you do not understand is useless, and write down what you observed before moving anything, so that afterwards you can tell what you broke from what was already broken.

That modest version is enough for me. What I am defending is an order of work: the record first, the change second. With systems I have seen it hold in my own work. With processes and teams it is a reasoned bet, and it is labeled as one.`,
  relatedIds: [
    'characterization-tests-before-refactor',
    'getdate-vs-sysdatetime',
    'inherited-oss-flutter-modernization',
  ],
}
