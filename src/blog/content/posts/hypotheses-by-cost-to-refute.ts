import type { BlogPost } from '../../types'

export const hypothesesByCostToRefute: Omit<BlogPost, 'readingTime'> = {
  id: 'hypotheses-by-cost-to-refute',
  slug: 'ordena-las-hipotesis-por-costo-de-refutar',
  title: 'Cuando algo falla, empieza por la explicación más barata de descartar, aunque no sea la que parece más probable',
  titleEn: 'When Something Breaks, Start With the Explanation That Is Cheapest to Rule Out, Even if It Is Not the Likeliest',
  date: '2026-11-17',
  tags: ['decisiones', 'debugging', 'diagnóstico', 'incertidumbre'],
  category: 'ensayo',
  featured: false,
  excerpt:
    'Cuando algo falla, casi todos probamos primero la explicación que parece más probable. Propongo mirar también cuánto cuesta descartar cada una, porque la que aparece sola es la que nadie comprueba. Un log me decía que un proveedor no respondía. Descartar esa explicación costaba una lectura, y ponerme a trabajar sobre ella costaba mucho más.',
  excerptEn:
    'When something breaks, most of us test the explanation that seems most likely first. I suggest also looking at what each one costs to rule out, because the one that shows up unprompted is the one nobody checks. A log told me a provider was not answering. Ruling that out cost one reading, and starting to work on it cost far more.',
  content: `Cuando algo falla y no sé por qué, tengo varias explicaciones posibles y debo decidir cuál compruebo primero. Ese orden pesa más que lo ingeniosa que sea cualquiera de ellas. Lo que propongo es mirar dos cosas al ordenarlas: qué tan probable parece cada explicación y cuánto cuesta descartarla. Una explicación poco probable que descarto leyendo una línea va antes que una probable que me obliga a coordinar con otra empresa.

De ahí sale una consecuencia incómoda. La explicación que menos cuesta pensar suele probarse de última, o nunca. No se siente como una hipótesis, es decir, como una explicación que todavía no he comprobado. Se siente como un hecho, y con los hechos uno se pone a trabajar sin comprobarlos.

**Cómo se suelen ordenar las explicaciones**

Lo habitual es ordenar por probabilidad. Miras el síntoma, te preguntas cuál es la causa más probable y empiezas por ahí. La costumbre tiene buena fama y se la ganó: si la causa más probable es la real, llegas rápido. Además, nadie te pide que justifiques haber empezado por lo más probable.

A ese orden le faltan dos cosas.

La primera es el precio de comprobar. Probar una explicación cuesta horas, atención, favores que pides a otros y a veces riesgo. Ese precio cambia de una hipótesis a otra mucho más que la probabilidad. Entre dos candidatas razonables, mi estimación de cuál es más probable rara vez es tan distinta como lo que cuesta comprobarlas. Una se descarta leyendo una línea y la otra pide abrir un caso con un tercero.

La segunda es qué tan bien conozco cada número. La probabilidad que uso al empezar un diagnóstico es una sensación. El costo de una comprobación lo puedo estimar con bastante más confianza. Antes de saber nada, sé mejor cuánto tardo en leer un log que qué tan probable es que un sistema ajeno esté fallando. Si ordeno solo por probabilidad, ordeno por el número que peor conozco de los dos.

**El caso en el que lo vi**

Lo vi con claridad en un caso que [documenté con el detalle técnico](#blog/article/asynclocal-no-sube-al-llamador). Un servicio en segundo plano enviaba trabajos a un proveedor externo por HTTP. Un componente de la tubería HTTP guardaba cada intercambio para poder diagnosticar después. La línea de log que salía de ahí decía lo mismo en cada ejecución: estado nulo, tiempo nulo, cero caracteres y una nota de que no había llegado respuesta.

La lectura obvia es que el proveedor no responde. No hay que pensar para llegar a ella, porque el log casi la escribe por ti. Por eso es peligrosa. Una explicación que no costó nada pensar no entra en ninguna lista de hipótesis. Uno pasa directo a trabajar sobre ella, y trabajar sobre esta era caro: revisar conectividad, tiempos de espera y credenciales, y abrir una conversación con un tercero.

Aquí hay una diferencia que se pierde cuando ordenas solo por probabilidad. Investigar una explicación hasta el final y descartarla son dos tareas que cuestan distinto. Investigar "el proveedor no responde" significaba trabajo de infraestructura y depender de la agenda de otra empresa. Descartarla costaba una lectura. El cliente HTTP del framework registra por su cuenta cada petición que pasa por él, sin que la aplicación haga nada. Esa línea ya estaba en la misma consola: respuesta 200 en unos 16 milisegundos. Puse las dos líneas una al lado de la otra y no podían ser ciertas a la vez. Si el proveedor hubiera fallado, el log del framework lo habría mostrado. El proveedor había respondido bien y el defecto estaba en mi propio canal de captura.

> Investigar una explicación hasta el final y descartarla son dos tareas que cuestan distinto.

Esa comparación achicó la búsqueda. Pasé de "algo en la red o en el proveedor" a un mecanismo y dos métodos. Quedó en pie una hipótesis: que el dato capturado no volvía por el canal que el código usaba. También era barata de comprobar, con una reproducción de cinco líneas, sin proveedor y sin red.

![Cuatro escalones de ancho creciente en dos grupos. Comprobaciones baratas: leer dos logs lado a lado y reproducir en cinco líneas. Lo que la lectura obvia pedía: revisar conectividad, timeouts y credenciales, y abrir conversación con un tercero.](figure/hypotheses-case-checks "Las comprobaciones del caso, de la más barata a la más cara. Es un esquema conceptual y no tiene datos medidos. El ancho de cada escalón solo indica el orden.")

Del caso saco tres cosas que sirven con cualquier tecnología.

La primera: el segundo registro era gratis y ya existía. Era un relato independiente del mismo hecho. No tuve que instrumentar nada ni pedir acceso a nada. Solo faltaba decidir que "el proveedor no responde" era algo que podía descartar antes de convertirlo en un plan de trabajo.

La segunda: el instrumento se equivocaba siempre hacia el mismo lado. Esa línea de log había dicho lo mismo en cada ejecución desde que existía. Y señalaba hacia la opción más costosa, un tercero que había respondido bien todas las veces. Cualquier investigación de un envío fallido habría empezado por ahí. Un instrumento así hace que todo el que lo lea parta de la misma explicación, la que menos cuesta pensar.

La tercera: confiar en la seguridad de otro tiene el mismo efecto. El diseño original venía con un comentario en el código. El comentario descartaba una alternativa con un argumento correcto y enseguida afirmaba algo falso sobre el mecanismo elegido. Como la primera mitad era cierta, la segunda se creyó. La afirmación falsa se descartaba con las mismas cinco líneas, pero parecía tan probable que nadie las corrió. Nadie hizo una comprobación casi gratuita justamente porque la afirmación parecía muy probable.

**El orden que propongo**

A cada explicación le hago dos preguntas. Una es qué tan probable parece. La otra es cuál es la observación más barata que la haría falsa. Con la segunda pregunto qué tendría que ver para tacharla de la lista, que es distinto de preguntar cómo la investigo.

![Matriz de dos por dos. Eje horizontal: costo de descartar, de bajo a alto. Eje vertical: qué tan probable parece, de baja a alta. Probable y barata: probar ya. Improbable y barata: probar igual, la que se salta. Probable y cara: probar después. Improbable y cara: dejar en espera.](figure/hypotheses-matrix "El orden que propongo. Primero toda la columna barata y después la cara, ordenada por probabilidad. Es un esquema conceptual y no tiene datos medidos.")

Sobre la celda de arriba a la izquierda no hay discusión: es probable y barata, se prueba ya. Mi desacuerdo con el orden habitual está en lo que sigue. Quien ordena por probabilidad va después a la celda de arriba a la derecha, la explicación probable y cara. Yo voy a la de abajo a la izquierda, la improbable que casi no cuesta. Si la descarto, perdí minutos. Si resulta cierta, me ahorré toda la parte cara. La explicación probable y cara espera hasta que se acaben las baratas. La improbable y cara queda en espera hasta que algo la vuelva probable.

El análisis de decisiones le pone nombre a esta idea. La [entrada de Wikipedia sobre el valor de la información](https://en.wikipedia.org/wiki/Value_of_information) lo define como la cantidad que quien decide estaría dispuesto a pagar por información antes de tomar una decisión. Como primera referencia cita el artículo de Ronald Howard, [Information Value Theory](https://doi.org/10.1109/TSSC.1966.300074), publicado en 1966 en IEEE Transactions on Systems Science and Cybernetics. No propongo hacer ese cálculo en medio de un incidente. Me quedo con la pregunta: una comprobación vale la pena cuando cuesta menos que lo que me ahorra saber. Una lectura que puede eliminar la opción más cara casi siempre vale la pena, aunque yo crea que esa opción es la cierta.

**Cómo aplicarlo**

**1. Escribe la lectura obvia como una hipótesis más.** Anota en la lista, junto a las demás, lo que el síntoma parece decir por sí solo. Mientras no esté escrito como algo que puede ser falso, nadie lo va a probar.

**2. Pregunta qué tendrías que ver para descartarla.** Para cada explicación, busca la observación concreta que la tacharía y calcula cuánto cuesta conseguirla. Si ningún resultado posible puede salir en contra, esa comprobación no descarta nada, por barata que sea.

**3. Busca registros que ya existan.** Dos relatos independientes del mismo hecho son la comprobación más barata que conozco. En software suelen ser los registros que el framework o la plataforma producen sin que se los pidas. Fuera del software sirve cualquier registro del mismo hecho que lleve alguien que no depende del primero.

**4. Termina primero las comprobaciones baratas y después ordena por probabilidad.** Dentro de las baratas, empieza por la más probable. Cuando se acaben, ordenar por probabilidad vuelve a ser lo correcto.

Esto sirve también fuera de un diagnóstico técnico. Quien decide con información incompleta sobre un proyecto atrasado, una métrica que cae o un cliente que se queja tiene delante lo mismo: una explicación que aparece sola, otras que cuesta pensar y comprobaciones de precios muy distintos. La pregunta útil sigue siendo cuál puedo tachar hoy con lo que ya tengo.

**Dónde puedo estar equivocado**

Sin el caso, esto es un consejo genérico. "Prueba primero lo barato" lo firma cualquiera. El caso aporta algo más estrecho. Muestra que la explicación obvia no se anota como hipótesis, y que descartarla puede costar muy distinto de investigarla hasta el final. Y es un solo caso. Cuando digo que la explicación que menos cuesta pensar "suele" quedarse sin probar, describo lo que vi ahí y lo que el argumento predice. No tengo un conteo que lo respalde.

Hay situaciones donde lo correcto es empezar por lo más probable:

- **Cuando no existe una comprobación barata.** Si descartar cualquiera cuesta parecido, el costo ya no ayuda a elegir y solo queda la probabilidad.
- **Cuando la comprobación destruye algo.** Reiniciar un servicio o restaurar un respaldo pueden ser rápidos y aun así caros, porque borran la evidencia o afectan a los usuarios. El costo de descartar incluye lo que se rompe al comprobar.
- **Cuando la probabilidad de entrada es abrumadora.** Si el fallo empezó justo después de un cambio, reviertes el cambio. Revisar primero lo improbable por disciplina sería seguir la regla en contra de su propio propósito.
- **Cuando las comprobaciones baratas son muchas.** Veinte comprobaciones de cinco minutos no son baratas. Hay que ponerles un límite, y pasado ese límite manda la probabilidad.
- **Cuando esperar cuesta más que equivocarse.** Con usuarios afectados, primero reduces el daño con tu mejor apuesta y el diagnóstico ordenado viene después.

Queda una objeción que no puedo resolver del todo: el sesgo retrospectivo, que es juzgar una decisión cuando ya sabes cómo terminó. Sé que el log del framework era el registro decisivo porque conozco el final. En el momento, mi estimación de cuánto cuesta cada comprobación también es una sensación, y puede fallar igual que la de probabilidad. Lo que sostengo es que falla menos. Y la regla que sale de ahí, tachar primero lo que puedo tachar con lo que ya tengo, cuesta poco incluso las veces que no encuentra nada.`,
  contentEn: `When something breaks and I do not know why, I have several possible explanations and I have to decide which one to check first. That order matters more than how clever any of them is. I suggest looking at two things when you rank them: how likely each explanation seems, and what it costs to rule it out. An unlikely explanation I can rule out by reading one line goes ahead of a likely one that makes me coordinate with another company.

An uncomfortable consequence follows. The explanation that takes the least effort to think of tends to be tested last, or never. It does not feel like a hypothesis, meaning an explanation I have not checked yet. It feels like a fact, and people start working on facts without checking them.

**How explanations usually get ranked**

The usual approach is to rank by probability. You look at the symptom, ask what the most likely cause is, and start there. The habit has a good reputation and has earned it: if the most likely cause is the real one, you get there fast. Nobody asks you to defend having started with the most likely thing, either.

That order is missing two things.

The first is the price of checking. Testing an explanation costs hours, attention, favors you ask of other people, and sometimes risk. That price changes from one hypothesis to the next far more than probability does. Between two reasonable candidates, my estimate of which is more likely rarely differs as much as the cost of checking them. One is ruled out by reading a line. The other means opening a case with a third party.

The second is how well I know each number. The probability I hold at the start of a diagnosis is a feeling. The cost of a check is something I can estimate with much more confidence. Before I know anything, I know how long reading a log takes better than I know how likely it is that someone else's system is failing. If I rank by probability alone, I rank by the number I know worse.

**The case where I saw it**

I saw this clearly in a case I [wrote up with the technical detail](#blog/article/asynclocal-no-sube-al-llamador). A background service sent jobs to an external provider over HTTP. A component in the HTTP pipeline saved each exchange so it could be diagnosed later. The log line that came out of it said the same thing on every run: null status, null elapsed time, zero characters, and a note that no response had arrived.

The obvious reading is that the provider is not answering. Getting there takes no thought, because the log all but writes it for you. That is why it is dangerous. An explanation that took no effort to think of never makes it onto a list of hypotheses. You go straight to working on it, and working on this one was expensive: checking connectivity, timeouts, and credentials, and opening a conversation with a third party.

There is a difference here that gets lost when you rank by probability alone. Investigating an explanation to the end and ruling it out are two jobs with different costs. Investigating "the provider is not answering" meant infrastructure work and waiting on another company's calendar. Ruling it out cost one reading. The framework's HTTP client logs every request that goes through it on its own, without the application doing anything. That line was already in the same console: a 200 response in about 16 milliseconds. I put the two lines side by side, and they could not both be true. Had the provider failed, the framework log would have shown it. The provider had answered correctly, and the defect was in my own capture channel.

> Investigating an explanation to the end and ruling it out are two jobs with different costs.

That comparison narrowed the search. I went from "something in the network or the provider" to one mechanism and two methods. One hypothesis was left standing: the captured data was not coming back through the channel the code used. That one was cheap to check too, with a five-line reproduction, no provider and no network.

![Four steps of growing width in two groups. Cheap checks: read two logs side by side and reproduce it in five lines. What the obvious reading asked for: check connectivity, timeouts and credentials, and open a thread with a third party.](figure/hypotheses-case-checks "The checks in the case, from cheapest to most expensive. This is a conceptual sketch with no measured data. The width of each step only shows the order.")

Three things from the case apply whatever the technology.

First, the second record was free and already existed. It was an independent account of the same event. I did not have to instrument anything or ask for access to anything. All that was missing was deciding that "the provider is not answering" was something I could rule out before turning it into a work plan.

Second, the instrument was wrong in the same direction every time. That log line had said the same thing on every run since it existed. And it pointed at the most expensive option, a third party that had answered correctly every single time. Any investigation into a failed dispatch would have started there. An instrument like that makes everyone who reads it start from the same explanation, the one that takes the least effort to think of.

Third, trusting someone else's confidence does the same thing. The original design came with a code comment. The comment ruled out one alternative with a correct argument, and right after that it claimed something false about the mechanism it chose instead. Because the first half was true, the second half was believed. The false claim could be ruled out with those same five lines, but it seemed so likely that nobody ran them. An almost free check never happened because the claim seemed very likely.

**The order I propose**

I ask two questions of every explanation. One is how likely it seems. The other is what the cheapest observation is that would make it false. With the second I am asking what I would have to see to cross it off the list, which is different from asking how I would investigate it.

![Two by two matrix. Horizontal axis: cost to rule out, low to high. Vertical axis: how likely it seems, low to high. Likely and cheap: test now. Unlikely and cheap: test anyway, the one people skip. Likely and expensive: test later. Unlikely and expensive: park.](figure/hypotheses-matrix "The order I propose. The whole cheap column first, then the expensive one ranked by probability. This is a conceptual sketch with no measured data.")

The top-left cell needs no argument: likely and cheap, test it now. Where I disagree with the usual order is in what comes next. If you rank by probability, you go to the top-right cell, the likely and expensive explanation. I go to the bottom left, the unlikely one that costs almost nothing. If I rule it out, I lost minutes. If it turns out to be true, I skipped the whole expensive part. The likely and expensive explanation waits until the cheap ones run out. The unlikely and expensive one is parked until something makes it likely.

Decision analysis has a name for this idea. The [Wikipedia entry on value of information](https://en.wikipedia.org/wiki/Value_of_information) defines it as the amount a decision maker would be willing to pay for information prior to making a decision. As its first reference it lists Ronald Howard's paper [Information Value Theory](https://doi.org/10.1109/TSSC.1966.300074), published in 1966 in IEEE Transactions on Systems Science and Cybernetics. I am not suggesting anyone run that calculation in the middle of an incident. I keep the question: a check is worth making when it costs less than what knowing saves me. A reading that can eliminate the most expensive option is almost always worth it, even when I believe that option is the true one.

**How to apply it**

**1. Write the obvious reading down as one more hypothesis.** Put what the symptom seems to say by itself on the list, next to everything else. Until it is written as something that can be false, nobody will test it.

**2. Ask what you would have to see to rule it out.** For each explanation, find the concrete observation that would cross it off and work out what that observation costs. If no possible result could come out against it, the check rules nothing out, however cheap it is.

**3. Look for records that already exist.** Two independent accounts of the same event are the cheapest check I know. In software they tend to be the logs a framework or platform produces without being asked. Outside software, any record of the same fact works if it is kept by someone who does not depend on the first.

**4. Finish the cheap checks first, then rank by probability.** Among the cheap ones, start with the most likely. Once they run out, ranking by probability is the right call again.

This also applies outside a technical diagnosis. Anyone deciding with incomplete information about a late project, a falling metric, or a complaining customer is looking at the same thing: one explanation that shows up unprompted, others that take effort to think of, and checks with very different prices. The useful question is still which one I can cross off today with what I already have.

**Where I could be wrong**

Without the case, this is generic advice. Anyone will sign "test the cheap thing first". The case adds something narrower. It shows that the obvious explanation never gets written down as a hypothesis, and that ruling it out can cost something very different from investigating it to the end. And it is one case. When I say the explanation that takes the least effort to think of "tends to" go untested, I am describing what I saw there and what the argument predicts. I have no count to back it.

There are situations where starting with the most likely explanation is the right call:

- **When no cheap check exists.** If ruling out any of them costs about the same, cost no longer helps you choose and probability is all that is left.
- **When the check destroys something.** Restarting a service or restoring a backup can be quick and still expensive, because they erase the evidence or affect users. The cost of ruling something out includes whatever breaks while checking.
- **When the starting probability is overwhelming.** If the failure started right after a change, you revert the change. Going through the unlikely options first out of discipline would be following the rule against its own purpose.
- **When there are many cheap checks.** Twenty five-minute checks are not cheap. They need a cap, and past that cap probability decides.
- **When waiting costs more than being wrong.** With users affected, you first limit the damage on your best bet, and the orderly diagnosis comes afterwards.

One objection I cannot fully answer is hindsight, which is judging a decision when you already know how it ended. I know the framework log was the decisive record because I know how the story ends. In the moment, my estimate of what each check costs is also a feeling, and it can fail just like the probability estimate. My position is that it fails less often. And the rule that comes out of it, cross off first what I can cross off with what I already have, costs little even on the days it finds nothing.`,
  relatedIds: [
    'asynclocal-does-not-flow-back',
    'getdate-vs-sysdatetime',
    'adversarial-review-missed-user-defects',
  ],
}
