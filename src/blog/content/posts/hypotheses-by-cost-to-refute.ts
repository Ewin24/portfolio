import type { BlogPost } from '../../types'

export const hypothesesByCostToRefute: Omit<BlogPost, 'readingTime'> = {
  id: 'hypotheses-by-cost-to-refute',
  slug: 'ordena-las-hipotesis-por-costo-de-refutar',
  title: 'Ordena las hipótesis por lo que cuesta refutarlas, no por lo probables que parecen',
  titleEn: 'Rank Your Hypotheses by What It Costs to Kill Them, Not by How Likely They Feel',
  date: '2026-11-17',
  tags: ['decisiones', 'debugging', 'diagnóstico', 'incertidumbre'],
  category: 'ensayo',
  featured: false,
  excerpt:
    'Ante un fallo, lo habitual es probar primero la explicación que parece más probable. Sostengo que el orden debe pesar también cuánto cuesta descartar cada una, y que la explicación que sale sola del síntoma es la que nadie prueba, porque no se siente como hipótesis. Un log que decía que un proveedor no respondía se refutaba con una lectura; lo que invitaba a hacer costaba mucho más.',
  excerptEn:
    'When something breaks, the usual move is to test the explanation that seems most likely. I argue the order should also weigh what each one costs to rule out, and that the explanation the symptom hands you is the one nobody tests, because it does not feel like a hypothesis. A log saying a provider was not answering could be refuted with one reading; what it invited me to do cost far more.',
  content: `Cuando algo falla y no sé por qué, el orden en que pruebo las explicaciones pesa más que el ingenio de cualquiera de ellas. Mi afirmación es esta: ese orden debe tener en cuenta cuánto cuesta descartar cada explicación, y no solo qué tan probable se siente. Una explicación improbable que se descarta con una lectura va antes que una probable que exige coordinar con otra empresa.

Hay un corolario incómodo. La explicación que menos cuesta formular suele ser la que se prueba de última, o nunca, porque no se siente como una hipótesis. Se siente como un hecho, y sobre los hechos se actúa.

**La visión común**

Lo habitual es ordenar por probabilidad. Se mira el síntoma, se pregunta cuál es la causa más probable y se empieza por ahí. La heurística tiene buena reputación por buenas razones: si la causa más probable es la real, se llega rápido, y nadie tiene que justificar por qué empezó por lo más probable.

Le faltan dos cosas.

La primera es la mitad de la cuenta. Probar una explicación tiene un precio en horas, en atención, en favores pedidos a otros y a veces en riesgo. Ese precio varía entre hipótesis mucho más de lo que varía su probabilidad. Entre dos candidatas razonables, mi estimación de cuál es más probable rara vez difiere tanto como el costo de comprobarlas: una se descarta leyendo una línea y la otra pide abrir un caso con un tercero.

La segunda es la calidad del dato con el que se ordena. La probabilidad que uso al principio de un diagnóstico es una sensación. El costo de una comprobación lo puedo estimar con bastante más confianza: antes de saber nada, sé mejor cuánto tardo en leer un log que cuán probable es que un sistema ajeno esté fallando. Ordenar solo por probabilidad es ordenar por el número peor conocido de los dos.

**Por qué falla**

Lo vi con claridad en un caso que [documenté con el detalle técnico](#blog/article/asynclocal-no-sube-al-llamador). Un servicio en segundo plano despachaba trabajos a un proveedor externo por HTTP, y un componente de la tubería HTTP capturaba cada intercambio para diagnóstico. La línea de log que salía de esa captura decía lo mismo en cada ejecución: estado nulo, tiempo nulo, cero caracteres y una nota de que no había llegado respuesta.

La lectura obvia es que el proveedor no responde. No hay que pensar para llegar a ella; el log prácticamente la redacta. Eso es lo que la vuelve peligrosa. Una explicación que no costó nada formular no entra en ninguna lista de hipótesis. Se pasa directo a trabajar sobre ella, y trabajar sobre esta era caro: revisar conectividad, tiempos de espera y credenciales, y abrir una conversación con un tercero.

Aquí aparece una distinción que ordenar por probabilidad borra. Perseguir una explicación y refutarla son dos tareas con precios distintos. Perseguir "el proveedor no responde" significaba trabajo de infraestructura y depender de la agenda de otra empresa. Refutarla costaba una lectura. El cliente HTTP del framework registra por su cuenta cada petición que lo atraviesa, sin que la aplicación haga nada, y esa línea ya estaba en la misma consola: respuesta 200 en unos 16 milisegundos. Puse las dos líneas una al lado de la otra y no podían ser ciertas a la vez. Si el proveedor hubiera fallado, el log del framework lo habría mostrado. El defecto estaba en mi canal de captura, no en el sistema remoto.

> Perseguir una explicación y refutarla son dos tareas con precios distintos.

Esa comparación redujo el espacio de búsqueda de "algo en la red o en el proveedor" a un mecanismo y dos métodos. La hipótesis que quedó en pie, que el dato capturado no viajaba de vuelta por el canal que el código usaba, también era barata de comprobar: una reproducción de cinco líneas, sin proveedor y sin red.

![Cuatro escalones de ancho creciente en dos grupos. Comprobaciones baratas: leer dos logs lado a lado y reproducir en cinco líneas. Lo que la lectura obvia pedía: revisar conectividad, timeouts y credenciales, y abrir conversación con un tercero.](figure/hypotheses-case-checks "Las comprobaciones del caso, de la más barata a la más cara. Esquema conceptual, no datos medidos: el ancho indica orden, no una duración.")

Del caso saco tres cosas que no dependen de la tecnología.

El testigo independiente era gratis y ya existía. No hubo que instrumentar nada ni pedir acceso a nada. Lo único que faltaba era decidir que "el proveedor no responde" era algo refutable antes de ser un plan de trabajo.

El instrumento mentía siempre en la misma dirección. Esa línea de log había dicho lo mismo en cada ejecución desde que existía, y señalaba hacia la opción más costosa: un tercero que había respondido bien todas las veces. Cualquier investigación de un envío fallido habría empezado por ahí. Un instrumento así convierte la explicación más barata de formular en la explicación por defecto de todo el que lo lea.

La certeza prestada tiene el mismo efecto. El diseño original venía acompañado de un comentario en el código que descartaba una alternativa con un argumento correcto y, acto seguido, afirmaba algo falso sobre el mecanismo elegido. La primera mitad le dio crédito a la segunda. La afirmación falsa se refutaba con las mismas cinco líneas, pero parecía tan probable que nadie las corrió. Parecer muy probable fue justo la razón para no hacer una comprobación casi gratuita.

**El modelo**

A cada explicación le hago dos preguntas: qué tan probable parece, y cuál es la observación más barata que la haría falsa. La segunda no es "cómo la investigo". Es "qué tendría que ver para tacharla".

![Matriz de dos por dos. Eje horizontal: costo de refutar, de bajo a alto. Eje vertical: qué tan probable parece, de baja a alta. Probable y barata: probar ya. Improbable y barata: probar igual, la que se salta. Probable y cara: probar después. Improbable y cara: aparcar.](figure/hypotheses-matrix "El orden que propongo: primero la columna barata completa, después la cara por probabilidad. Esquema conceptual, no datos medidos.")

La celda de arriba a la izquierda no tiene discusión: probable y barata, se prueba ya. El desacuerdo con la visión común está en el segundo lugar. Ordenar por probabilidad manda a la celda de arriba a la derecha, la explicación probable y cara. Yo mando a la de abajo a la izquierda: la improbable que casi no cuesta. Si la descarto, perdí minutos. Si resulta cierta, me ahorré la rama cara completa. La explicación probable y cara espera a que la columna barata esté agotada, y la improbable y cara se aparca hasta que algo la vuelva probable.

El análisis de decisiones tiene nombre para la intuición de fondo. La [entrada de Wikipedia sobre el valor de la información](https://en.wikipedia.org/wiki/Value_of_information) lo define como la cantidad que quien decide estaría dispuesto a pagar por información antes de tomar una decisión, y cita como primera referencia el artículo de Ronald Howard, [Information Value Theory](https://doi.org/10.1109/TSSC.1966.300074), publicado en 1966 en IEEE Transactions on Systems Science and Cybernetics. No propongo hacer ese cálculo en medio de un incidente. Tomo la forma de la pregunta: una comprobación es una compra, y vale la pena cuando cuesta menos que lo que me ahorra saber. Una lectura que puede eliminar la rama más cara del árbol es casi siempre una buena compra, aunque yo crea que la rama es cierta.

**Cómo aplicarlo**

**1. Escribe la lectura obvia como hipótesis.** Lo que el síntoma dice solo, anótalo en la lista junto a las demás. Mientras no esté escrito como algo que puede ser falso, nadie lo va a probar.

**2. Pregunta por la refutación, no por la investigación.** Para cada explicación: qué observación concreta la tacharía y cuánto cuesta obtenerla. Si no existe ninguna observación que pueda salir en contra, esa comprobación no refuta nada, por barata que sea.

**3. Busca testigos que ya existan.** Dos relatos independientes del mismo evento son la comprobación más barata que conozco. En software suelen ser los registros que el framework o la plataforma producen sin pedirlos. Fuera del software, cualquier registro del mismo hecho llevado por alguien que no depende del primero.

**4. Agota la columna barata y después ordena por probabilidad.** Dentro de lo barato, empieza por lo más probable. Cuando lo barato se acabe, la visión común vuelve a tener razón.

Nada de esto es exclusivo de un diagnóstico técnico. Quien decide con información incompleta sobre un proyecto atrasado, una métrica que cae o un cliente que se queja tiene delante la misma estructura: una explicación que sale sola, otras que cuestan pensar, y comprobaciones de precios muy distintos. La pregunta útil sigue siendo cuál de ellas puedo tachar hoy con lo que ya tengo.

**Dónde puede estar equivocado**

Sin el caso, esto es consejo genérico. "Prueba primero lo barato" lo firma cualquiera. Lo que el caso aporta es más estrecho: que la explicación obvia no se registra como hipótesis, y que refutarla puede costar muy distinto de perseguirla. Y es un caso. Cuando digo que la explicación más barata de formular "suele" quedarse sin probar, describo lo que vi ahí y lo que el argumento predice; no tengo un conteo que lo respalde.

Hay situaciones donde empezar por lo más probable es lo correcto:

- **Cuando la comprobación barata no existe.** Si todas las refutaciones cuestan parecido, el costo deja de discriminar y solo queda la probabilidad.
- **Cuando la comprobación es destructiva.** Reiniciar un servicio o restaurar un respaldo pueden ser rápidos y aun así caros, porque borran la evidencia o tocan a los usuarios. El costo de refutar incluye lo que se rompe al comprobar.
- **Cuando la probabilidad previa es abrumadora.** Si el fallo empezó justo después de un cambio, se revierte el cambio. Recorrer primero lo improbable por disciplina sería seguir la regla en contra de su propio propósito.
- **Cuando lo barato es mucho.** Veinte comprobaciones de cinco minutos no son baratas. La columna barata necesita un límite, y pasado ese límite manda la probabilidad.
- **Cuando esperar cuesta más que equivocarse.** Con usuarios afectados, primero se mitiga con la mejor apuesta disponible y el diagnóstico ordenado viene después.

Queda una objeción que no puedo resolver del todo: el sesgo retrospectivo. Sé que el log del framework era el testigo decisivo porque conozco el final. En el momento, mi estimación del costo de cada comprobación también es una sensación, y puede fallar igual que la de probabilidad. Lo que sostengo es que falla menos, y que la regla resultante, tachar primero lo que se puede tachar con lo que ya está sobre la mesa, sale barata incluso las veces que no encuentra nada.`,
  contentEn: `When something breaks and I do not know why, the order in which I test explanations matters more than how clever any of them is. My claim: that order should account for what each explanation costs to rule out, and not only for how likely it feels. An unlikely explanation I can discard with one reading goes ahead of a likely one that requires coordinating with another company.

There is an uncomfortable corollary. The explanation that is cheapest to form tends to be tested last, or never, because it does not feel like a hypothesis. It feels like a fact, and facts are things you act on.

**The common view**

The usual approach is to rank by probability. You look at the symptom, ask what the most likely cause is, and start there. The heuristic has a good reputation for good reasons: if the most likely cause is the real one, you get there fast, and nobody has to defend having started with the most likely thing.

It is missing two things.

The first is half of the arithmetic. Testing an explanation has a price in hours, in attention, in favors asked of other people, and sometimes in risk. That price varies between hypotheses far more than their probability does. Between two reasonable candidates, my estimate of which is more likely rarely differs as much as the cost of checking them: one is ruled out by reading a line, the other means opening a case with a third party.

The second is the quality of the number used for ranking. The probability I hold at the start of a diagnosis is a feeling. The cost of a check is something I can estimate with much more confidence: before I know anything, I know how long reading a log takes better than I know how likely it is that someone else's system is failing. Ranking by probability alone means ranking by the worse-known of the two numbers.

**Why it fails**

I saw this clearly in a case I [wrote up with the technical detail](#blog/article/asynclocal-no-sube-al-llamador). A background service dispatched jobs to an external provider over HTTP, and a component in the HTTP pipeline captured each exchange for diagnostics. The log line produced from that capture said the same thing on every run: null status, null elapsed time, zero characters, and a note that no response had arrived.

The obvious reading is that the provider is not answering. Getting there takes no thought; the log all but writes it for you. That is what makes it dangerous. An explanation that cost nothing to form never makes it onto a list of hypotheses. You go straight to working on it, and working on this one was expensive: checking connectivity, timeouts, and credentials, and opening a conversation with a third party.

This is where a distinction shows up that ranking by probability erases. Chasing an explanation and refuting it are two jobs with different prices. Chasing "the provider is not answering" meant infrastructure work and waiting on another company's calendar. Refuting it cost one reading. The framework's HTTP client logs every request that goes through it on its own, without the application doing anything, and that line was already sitting in the same console: a 200 response in about 16 milliseconds. I put the two lines side by side, and they could not both be true. Had the provider failed, the framework log would have shown it. The defect was in my capture channel, not in the remote system.

> Chasing an explanation and refuting it are two jobs with different prices.

That comparison shrank the search space from "something in the network or the provider" to one mechanism and two methods. The hypothesis left standing, that the captured data was not traveling back through the channel the code used, was also cheap to check: a five-line reproduction, with no provider and no network.

![Four steps of growing width in two groups. Cheap checks: read two logs side by side and reproduce it in five lines. What the obvious reading asked for: check connectivity, timeouts and credentials, and open a thread with a third party.](figure/hypotheses-case-checks "The checks in the case, from cheapest to most expensive. Conceptual sketch, not measured data: width shows order, not a duration.")

I take three things from the case that do not depend on the technology.

The independent witness was free and already existed. Nothing had to be instrumented and no access had to be requested. The only missing piece was deciding that "the provider is not answering" was something to refute before it was a work plan.

The instrument lied in the same direction every time. That log line had said the same thing on every run since it existed, and it pointed at the most expensive option: a third party that had answered correctly every single time. Any investigation into a failed dispatch would have started there. An instrument like that turns the cheapest explanation to form into the default explanation for everyone who reads it.

Borrowed certainty does the same thing. The original design came with a code comment that ruled out one alternative with a correct argument and then, in the next breath, claimed something false about the mechanism it chose instead. The first half lent credit to the second. The false claim could be refuted with those same five lines, but it seemed so likely that nobody ran them. Seeming very likely was precisely the reason an almost free check never happened.

**The model**

I ask two questions of every explanation: how likely does it seem, and what is the cheapest observation that would make it false. The second is not "how do I investigate this". It is "what would I have to see to cross it off".

![Two by two matrix. Horizontal axis: cost to refute, low to high. Vertical axis: how likely it seems, low to high. Likely and cheap: test now. Unlikely and cheap: test anyway, the one people skip. Likely and expensive: test later. Unlikely and expensive: park.](figure/hypotheses-matrix "The order I propose: the whole cheap column first, then the expensive one by probability. Conceptual sketch, not measured data.")

The top-left cell is uncontroversial: likely and cheap, test it now. The disagreement with the common view is about what comes second. Ranking by probability sends you to the top-right cell, the likely and expensive explanation. I go to the bottom left: the unlikely one that costs almost nothing. If I rule it out, I lost minutes. If it turns out to be true, I skipped the entire expensive branch. The likely and expensive explanation waits until the cheap column is exhausted, and the unlikely and expensive one is parked until something makes it likely.

Decision analysis has a name for the underlying intuition. The [Wikipedia entry on value of information](https://en.wikipedia.org/wiki/Value_of_information) defines it as the amount a decision maker would be willing to pay for information prior to making a decision, and lists as its first reference Ronald Howard's paper [Information Value Theory](https://doi.org/10.1109/TSSC.1966.300074), published in 1966 in IEEE Transactions on Systems Science and Cybernetics. I am not suggesting anyone run that calculation in the middle of an incident. I am borrowing the shape of the question: a check is a purchase, and it is worth making when it costs less than what knowing saves me. A reading that can eliminate the most expensive branch of the tree is almost always a good purchase, even when I believe the branch is true.

**How to apply it**

**1. Write the obvious reading down as a hypothesis.** Whatever the symptom says by itself goes on the list next to everything else. Until it is written as something that can be false, nobody will test it.

**2. Ask about refutation, not investigation.** For each explanation: what concrete observation would cross it off, and what does that observation cost. If no possible observation could come out against it, the check refutes nothing, however cheap it is.

**3. Look for witnesses that already exist.** Two independent accounts of the same event are the cheapest check I know. In software they tend to be the logs a framework or platform produces unasked. Outside software, any record of the same fact kept by someone who does not depend on the first.

**4. Exhaust the cheap column, then rank by probability.** Within the cheap ones, start with the most likely. Once the cheap ones run out, the common view is right again.

None of this is specific to a technical diagnosis. Anyone deciding with incomplete information about a late project, a falling metric, or a complaining customer is looking at the same structure: one explanation that arrives unprompted, others that take effort to think of, and checks with very different prices. The useful question is still which of them I can cross off today with what I already have.

**Where this could be wrong**

Without the case, this is generic advice. Anyone will sign "test the cheap thing first". What the case adds is narrower: that the obvious explanation never gets recorded as a hypothesis, and that refuting it can cost something very different from chasing it. And it is one case. When I say the cheapest explanation to form "tends to" go untested, I am describing what I saw there and what the argument predicts; I have no count to back it.

There are situations where starting with the most likely explanation is the right call:

- **When no cheap check exists.** If every refutation costs about the same, cost stops discriminating and probability is all that is left.
- **When the check is destructive.** Restarting a service or restoring a backup can be quick and still expensive, because they erase the evidence or reach users. The cost to refute includes whatever breaks while checking.
- **When the prior is overwhelming.** If the failure started right after a change, you revert the change. Walking through the unlikely options first out of discipline would be following the rule against its own purpose.
- **When cheap adds up.** Twenty five-minute checks are not cheap. The cheap column needs a cap, and past that cap probability rules.
- **When waiting costs more than being wrong.** With users affected, you mitigate first on your best bet and the orderly diagnosis comes afterwards.

One objection I cannot fully answer is hindsight. I know the framework log was the decisive witness because I know how the story ends. In the moment, my estimate of what each check costs is also a feeling, and it can fail just like the probability estimate. My position is that it fails less often, and that the resulting rule, cross off first what can be crossed off with what is already on the table, stays cheap even on the days it finds nothing.`,
  relatedIds: [
    'asynclocal-does-not-flow-back',
    'getdate-vs-sysdatetime',
    'adversarial-review-missed-user-defects',
  ],
}
