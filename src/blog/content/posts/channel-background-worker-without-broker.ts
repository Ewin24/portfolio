import type { BlogPost } from '../../types'

export const channelBackgroundWorkerWithoutBroker: Omit<BlogPost, 'readingTime'> = {
  id: 'channel-background-worker-without-broker',
  slug: 'trabajo-en-segundo-plano-channel-sin-broker',
  title: 'Trabajo en segundo plano en .NET sin un broker de mensajes',
  titleEn: 'Background Work in .NET Without a Message Broker',
  date: '2026-10-20',
  tags: ['dotnet', 'ASP.NET Core', 'arquitectura', 'BackgroundService', 'Channel'],
  category: 'arquitectura',
  featured: false,
  excerpt:
    'Una llamada síncrona a un proveedor externo de bot de voz mantenía abierta la petición HTTP mientras el bot marcaba. La convertí en encolar y consultar con un Channel<T> acotado y un BackgroundService, resolviendo dependencias con alcance desde un worker singleton, calculando la fase del trabajo con columnas que ya existían y expirando de forma pasiva al consultar, sin proceso barredor. Ni broker, ni librería de trabajos, ni infraestructura nueva, y una tabla honesta de lo que eso cuesta.',
  excerptEn:
    'A synchronous call to an external voice-bot provider kept the HTTP request open while the bot dialed. I turned it into enqueue-and-poll with a bounded Channel<T> and a BackgroundService, resolving scoped dependencies from a singleton worker, computing the job phase from columns that already existed, and expiring passively on read with no sweeper process. No broker, no job library, no new infrastructure, and an honest table of what that costs.',
  content: `Un flujo de validación tenía un paso que dependía de un proveedor externo de bot de voz: el bot llama a una persona, conversa con ella y devuelve un diagnóstico. El endpoint que disparaba ese paso estaba escrito de forma síncrona: crear el registro de la campaña, llamar al proveedor, esperar su respuesta y devolverla al cliente. Todo dentro de la misma petición HTTP.

El problema era el tiempo. Una llamada telefónica no dura lo que dura una consulta a base de datos. Entre marcar, esperar que contesten y completar la conversación, la respuesta del proveedor tardaba desde decenas de segundos hasta varios minutos. Durante todo ese tiempo la petición seguía abierta, el usuario miraba una pantalla congelada y cualquier proxy intermedio con un timeout más corto que la llamada cortaba la conexión, aunque el bot siguiera hablando del otro lado. El resultado era el peor de los dos mundos: el trabajo ocurría, pero el cliente no se enteraba.

Había un detalle que hacía el cambio más interesante: el proveedor ya tenía un camino de callback. Cuando la conversación terminaba, el resultado llegaba también por una ruta propia, independiente de la petición original. Es decir, el sistema ya estaba preparado para que el resultado llegara después. Lo único síncrono era la espera, y la espera no aportaba nada.

El objetivo quedó así: la petición que inicia la llamada debe devolver de inmediato con "en proceso", el trabajo pesado debe ocurrir fuera de la petición, y el cliente debe poder preguntar en qué va sin que nadie tenga que inventar un estado que no exista en la base de datos.

**El enfoque equivocado**

La primera tentación fue subir los timeouts. Es un cambio de una línea y no exige rediseñar nada, pero no resuelve el problema: solo mueve el punto donde se rompe. Ningún timeout razonable cubre el peor caso de una llamada telefónica, y cada minuto adicional de petición abierta es un hilo, una conexión y un usuario esperando sin información.

La segunda tentación fue la contraria: traer un broker de mensajes o una librería de trabajos en segundo plano. Ambas opciones son correctas en muchos contextos, y las evalué en serio. Pero las dos agregan algo que este caso no necesitaba: infraestructura para desplegar y operar, o tablas propias de persistencia y un panel más que mantener. El volumen esperado eran decenas de llamadas por hora, no miles por segundo, y el sistema ya tenía una fuente de verdad durable: el registro de la campaña en la base de datos.

Hubo una tercera tentación, más sutil: modificar el método existente de la estrategia de validación por bot para que encolara en lugar de esperar. Ese método formaba parte de una cadena de respaldo: si el bot fallaba, el orquestador caía a un plan B manual. Cambiar su contrato habría roto esa cadena para todos los demás llamadores. Decidí dejar el camino síncrono intacto y agregar un método nuevo, dedicado a encolar, al lado del existente.

**La solución**

Diseñé e implementé un pipeline dentro del propio proceso con dos piezas del framework: un Channel<T> acotado como cola y un BackgroundService como consumidor. El registro es corto:

\`\`\`csharp
services.AddSingleton(Channel.CreateBounded<CallRequest>(
    new BoundedChannelOptions(100)
    {
        FullMode = BoundedChannelFullMode.DropWrite
    }));
services.AddHostedService<CallWorker>();
\`\`\`

La capacidad de 100 es deliberada. Un canal sin límite es una fuga de memoria esperando una ráfaga; uno acotado convierte la sobrecarga en una decisión explícita. Con DropWrite, si la cola está llena el elemento nuevo se descarta en lugar de bloquear la petición HTTP que lo escribe.

El endpoint ahora hace cuatro cosas y devuelve: revisa si ya existe una campaña activa para ese caso y, si existe, la devuelve sin crear otra; inserta la campaña con un código de diagnóstico que significa "en llamada"; escribe la solicitud en el canal; y responde "en proceso". La guarda de duplicados importa porque el usuario impaciente vuelve a hacer clic, y cada clic sería una llamada telefónica real.

\`\`\`
POST /checks/{id}/call
  ├─ active campaign exists? ──yes──> return it
  ├─ insert campaign (status: InProgress, code: Dialing)
  ├─ channel.Writer.TryWrite(request)
  └─ return { status: InProgress }

CallWorker (singleton)
  └─ loop: ReadAsync ─> new scope ─> call provider ─> record outcome

GET /checks/{id}/call  (polling)
  └─ read campaign ─> compute phase ─> expire if overdue ─> return
\`\`\`

El consumidor tiene una restricción que el framework no perdona: un BackgroundService se registra como singleton, y todo lo que necesitaba usar, el cliente HTTP del proveedor, el repositorio y el orquestador, estaba registrado con alcance o como transitorio. Inyectarlos en el constructor del worker los habría capturado para siempre, con una conexión de base de datos viva durante toda la vida del proceso. La salida es pedir un IServiceScopeFactory y crear un alcance por cada elemento de la cola:

\`\`\`csharp
protected override async Task ExecuteAsync(CancellationToken stop)
{
    await foreach (var req in _channel.Reader.ReadAllAsync(stop))
    {
        using var scope = _scopes.CreateScope();
        var client = scope.ServiceProvider.GetRequiredService<IVoiceBotClient>();
        var outcome = await client.StartCallAsync(req, stop);
        await RecordAsync(scope, req, outcome, stop);
    }
}
\`\`\`

Cada solicitud vive en su propio alcance, igual que si hubiera llegado por HTTP: sus dependencias nacen y mueren con ella. El worker distingue tres respuestas del proveedor. Si el bot excede su propio tiempo, se registra y la campaña se queda "en llamada", porque el callback todavía puede llegar. Si el proveedor devuelve un error técnico, la campaña se cierra como fallida. Si devuelve un diagnóstico normal, se procesa por el mismo camino que usaría el callback, de modo que no existen dos implementaciones del cierre.

La segunda mitad es la consulta. No agregué columnas de estado nuevas. La fase que ve el cliente se calcula a partir de lo que la tabla ya tenía: el estado de la campaña, el código de diagnóstico y la fecha de creación.

\`\`\`csharp
static CallPhase PhaseOf(CampaignRow c, DateTime now, TimeSpan timeout)
{
    var elapsed = now - c.CreatedAt;
    if (c.Status == Status.InProgress && elapsed > timeout) return CallPhase.Expired;
    if (c.Status == Status.Completed) return CallPhase.Completed;
    if (c.Status == Status.Failed) return CallPhase.Failed;
    return c.Code == Codes.Dialing && elapsed <= TimeSpan.FromSeconds(60)
        ? CallPhase.Dialing : CallPhase.AwaitingCallback;
}
\`\`\`

Esa función es pura: recibe una fila y un reloj y devuelve una fase. Por eso se prueba con casos fijos sin levantar nada: "en llamada" con 30 segundos, "en llamada" con 90 segundos, completada, vencida.

Cuando la fase calculada es "expirada", la misma consulta escribe el cierre definitivo de la campaña. Eso es la expiración pasiva: no hay un proceso barredor recorriendo la tabla cada minuto. Una campaña vencida se cierra la primera vez que alguien la mira. El límite de tiempo vive en la configuración de reglas de negocio, no en el código, así que ajustarlo no exige desplegar.

\`\`\`csharp
var phase = PhaseOf(row, _clock.UtcNow, timeout);
if (phase == CallPhase.Expired && row.Status == Status.InProgress)
    await _store.CloseAsync(row.Id, Codes.Expired, ct);
return CallStatusView.From(row, phase, _clock.UtcNow, timeout);
\`\`\`

El cierre tiene que ser idempotente, porque el callback del proveedor puede llegar justo después de que la consulta expiró la campaña. Quien llegue segundo encuentra la campaña ya cerrada y no la reabre.

**El impacto**

El cambio total en infraestructura fue cero: ningún servicio nuevo que desplegar, ningún contenedor, ninguna tabla de trabajos. En base de datos bastaron dos filas: un código de diagnóstico nuevo en el catálogo y un parámetro de timeout en la configuración. El orden de despliegue quedó en tres pasos: scripts de datos, API, interfaz.

El camino síncrono siguió existiendo sin un solo cambio en su contrato, así que la cadena de respaldo hacia el plan B manual no se tocó. La interfaz pasó de una pantalla congelada a una tarjeta que consulta cada pocos segundos y muestra la fase, el tiempo transcurrido y el tiempo restante esperado.

La comparación que hice antes de decidir, resumida:

| Criterio | Cola en proceso | Broker de mensajes | Librería de trabajos |
|---|---|---|---|
| Infraestructura nueva | Ninguna | Un servicio para operar | Tablas y panel propios |
| Sobrevive a un reinicio | No | Sí | Sí |
| Varias instancias consumiendo | No | Sí | Sí |
| Reintentos automáticos | Los escribes tú | Configurables | Integrados |
| Costo de adopción | Unas decenas de líneas | Alto | Medio |
| Encaja cuando | La verdad ya está en la base de datos | Hay varios consumidores o servicios | Hay trabajos programados y recurrentes |

La fila que más pesa es la segunda. Un Channel<T> vive en memoria: si el proceso se reinicia con elementos en la cola, esos elementos se pierden. Lo acepté porque la campaña ya estaba persistida antes de encolar. Una solicitud perdida no deja un estado inconsistente; deja una campaña "en llamada" que nadie procesó, y la expiración pasiva la cierra en cuanto alguien la consulta. El sistema se recupera solo, sin que ningún operador intervenga.

El cambio se diseñó e implementó, y luego quedó estacionado un tiempo detrás de una prioridad distinta. Cuando volví a él, el método principal del worker había crecido hasta superar las 150 líneas, con comentarios de sección numerados porque ya no cabía en la cabeza. Antes de partirlo escribí pruebas de caracterización que fijaban el orden de sus efectos, y solo entonces extraje métodos con nombre: el método quedó en menos de la mitad.

**Lecciones**

**Si la verdad ya es durable, la cola puede ser efímera.** La pregunta correcta no es "¿mi cola sobrevive un reinicio?", sino "¿qué pasa con el sistema si la cola pierde un elemento?". Si la respuesta es "se recupera solo", un Channel<T> alcanza. Si la respuesta es "se pierde trabajo sin rastro", hace falta persistencia en la cola.

**Un worker singleton nunca debe recibir dependencias con alcance en su constructor.** IServiceScopeFactory y un alcance por elemento le dan a cada trabajo la misma vida que tendría una petición HTTP.

**Calcula el estado en vez de almacenarlo cuando las columnas ya lo determinan.** La fase derivada no puede desincronizarse de los datos, porque no es un dato: es una función de ellos.

**La expiración pasiva cambia un proceso por una condición.** No hay barredor que monitorear ni que se quede colgado. El costo es que una campaña vencida sigue abierta hasta que alguien la mira, y eso solo es aceptable si nadie depende de verla cerrada antes.

**DropWrite descarta en silencio.** Con ese modo, quien escribe no se entera de que su elemento no entró en la cola. Aquí la expiración pasiva cubre ese caso, pero si lo hiciera de nuevo registraría la saturación con la variante de Channel.CreateBounded que recibe un callback por cada elemento descartado, para que la saturación aparezca en los logs antes que en las campañas que expiran.

**Elige la herramienta por la forma del problema, no por el tamaño del sistema.** Un broker y una librería de trabajos resuelven problemas reales. Este no era uno de ellos: no había varios consumidores, ni trabajos programados, ni otro servicio esperando el mensaje.`,
  contentEn: `A validation flow had a step that depended on an external voice-bot provider: the bot calls a person, talks to them, and returns a diagnosis. The endpoint that triggered that step was written synchronously: create the campaign record, call the provider, wait for its response, and hand it back to the client. All inside the same HTTP request.

The problem was time. A phone call does not take as long as a database query. Between dialing, waiting for someone to pick up, and finishing the conversation, the provider's response took anywhere from tens of seconds to several minutes. The whole time, the request stayed open, the user stared at a frozen screen, and any proxy in between with a shorter timeout than the call cut the connection while the bot kept talking on the other end. It was the worst of both worlds: the work happened, and the client never found out.

One detail made the change more interesting: the provider already had a callback path. When the conversation ended, the result also arrived through its own route, independent of the original request. The system was already built for the result to show up later. The only synchronous part was the waiting, and the waiting added nothing.

The goal became this: the request that starts the call must return immediately with "in progress", the heavy work must happen outside the request, and the client must be able to ask how it is going without anyone inventing a state that does not exist in the database.

**The wrong approach**

The first temptation was to raise the timeouts. It is a one-line change with no redesign, but it does not solve the problem; it only moves the point where things break. No reasonable timeout covers the worst case of a phone call, and every extra minute of open request is a thread, a connection, and a user waiting with no information.

The second temptation was the opposite: bring in a message broker or a background job library. Both are the right answer in plenty of contexts, and I weighed them seriously. But both add something this case did not need: infrastructure to deploy and operate, or their own persistence tables and one more dashboard to maintain. Expected volume was tens of calls per hour, not thousands per second, and the system already had a durable source of truth: the campaign record in the database.

There was a third, subtler temptation: change the existing bot validation strategy method so it enqueued instead of waiting. That method was part of a fallback chain: if the bot failed, the orchestrator dropped to a manual plan B. Changing its contract would have broken that chain for every other caller. I left the synchronous path alone and added a new method, dedicated to enqueueing, next to the existing one.

**The solution**

I designed and implemented an in-process pipeline from two framework pieces: a bounded Channel<T> as the queue and a BackgroundService as the consumer. The registration is short:

\`\`\`csharp
services.AddSingleton(Channel.CreateBounded<CallRequest>(
    new BoundedChannelOptions(100)
    {
        FullMode = BoundedChannelFullMode.DropWrite
    }));
services.AddHostedService<CallWorker>();
\`\`\`

The capacity of 100 is deliberate. An unbounded channel is a memory leak waiting for a burst; a bounded one turns overload into an explicit decision. With DropWrite, when the queue is full the new item is dropped instead of blocking the HTTP request that writes it.

The endpoint now does four things and returns: it checks whether an active campaign already exists for that case and, if so, returns it without creating another; it inserts the campaign with a diagnostic code that means "dialing"; it writes the request to the channel; and it answers "in progress". The duplicate guard matters because an impatient user clicks again, and every click would be a real phone call.

\`\`\`
POST /checks/{id}/call
  ├─ active campaign exists? ──yes──> return it
  ├─ insert campaign (status: InProgress, code: Dialing)
  ├─ channel.Writer.TryWrite(request)
  └─ return { status: InProgress }

CallWorker (singleton)
  └─ loop: ReadAsync ─> new scope ─> call provider ─> record outcome

GET /checks/{id}/call  (polling)
  └─ read campaign ─> compute phase ─> expire if overdue ─> return
\`\`\`

The consumer comes with a constraint the framework does not forgive: a BackgroundService is registered as a singleton, and everything it needed, the provider's HTTP client, the repository, and the orchestrator, was registered as scoped or transient. Injecting them through the worker's constructor would have captured them forever, with a live database connection for the whole lifetime of the process. The way out is to take an IServiceScopeFactory and create one scope per queue item:

\`\`\`csharp
protected override async Task ExecuteAsync(CancellationToken stop)
{
    await foreach (var req in _channel.Reader.ReadAllAsync(stop))
    {
        using var scope = _scopes.CreateScope();
        var client = scope.ServiceProvider.GetRequiredService<IVoiceBotClient>();
        var outcome = await client.StartCallAsync(req, stop);
        await RecordAsync(scope, req, outcome, stop);
    }
}
\`\`\`

Each request lives in its own scope, exactly as if it had arrived over HTTP: its dependencies are born and die with it. The worker tells three provider responses apart. If the bot hits its own timeout, that gets logged and the campaign stays "dialing", because the callback can still arrive. If the provider returns a technical error, the campaign is closed as failed. If it returns a normal diagnosis, it goes through the same path the callback would use, so there are never two implementations of the close.

The second half is the read side. I added no new status columns. The phase the client sees is computed from what the table already had: the campaign status, the diagnostic code, and the creation date.

\`\`\`csharp
static CallPhase PhaseOf(CampaignRow c, DateTime now, TimeSpan timeout)
{
    var elapsed = now - c.CreatedAt;
    if (c.Status == Status.InProgress && elapsed > timeout) return CallPhase.Expired;
    if (c.Status == Status.Completed) return CallPhase.Completed;
    if (c.Status == Status.Failed) return CallPhase.Failed;
    return c.Code == Codes.Dialing && elapsed <= TimeSpan.FromSeconds(60)
        ? CallPhase.Dialing : CallPhase.AwaitingCallback;
}
\`\`\`

That function is pure: it takes a row and a clock and returns a phase. That is why it is tested with fixed cases without spinning anything up: dialing at 30 seconds, dialing at 90 seconds, completed, overdue.

When the computed phase is "expired", the same read writes the campaign's final close. That is passive expiry: there is no sweeper walking the table every minute. An overdue campaign gets closed the first time someone looks at it. The time limit lives in the business-rules configuration, not in code, so tuning it does not require a deploy.

\`\`\`csharp
var phase = PhaseOf(row, _clock.UtcNow, timeout);
if (phase == CallPhase.Expired && row.Status == Status.InProgress)
    await _store.CloseAsync(row.Id, Codes.Expired, ct);
return CallStatusView.From(row, phase, _clock.UtcNow, timeout);
\`\`\`

The close has to be idempotent, because the provider's callback can land right after the read expired the campaign. Whoever arrives second finds the campaign already closed and does not reopen it.

**The impact**

The total infrastructure change was zero: no new service to deploy, no container, no jobs table. On the database side, two rows were enough: a new diagnostic code in the catalog and a timeout parameter in the configuration. The deploy order came down to three steps: data scripts, API, UI.

The synchronous path kept existing without a single change to its contract, so the fallback chain to the manual plan B was untouched. The UI went from a frozen screen to a card that polls every few seconds and shows the phase, the elapsed time, and the expected remaining time.

The comparison I made before deciding, summarized:

| Criterion | In-process queue | Message broker | Job library |
|---|---|---|---|
| New infrastructure | None | A service to operate | Its own tables and dashboard |
| Survives a restart | No | Yes | Yes |
| Multiple consuming instances | No | Yes | Yes |
| Automatic retries | You write them | Configurable | Built in |
| Adoption cost | A few dozen lines | High | Medium |
| Fits when | The truth already lives in the database | There are several consumers or services | There are scheduled, recurring jobs |

The row that weighs the most is the second one. A Channel<T> lives in memory: if the process restarts with items in the queue, those items are lost. I accepted that because the campaign was already persisted before it was enqueued. A lost request does not leave an inconsistent state; it leaves a "dialing" campaign nobody processed, and passive expiry closes it as soon as someone reads it. The system heals itself, with no operator stepping in.

The change was designed and implemented, then sat parked for a while behind a different priority. When I came back to it, the worker's main method had grown past 150 lines, with numbered section comments because it no longer fit in your head. Before splitting it I wrote characterization tests that pinned the order of its effects, and only then extracted named methods: the method ended up at less than half its size.

**Lessons**

**If the truth is already durable, the queue can be ephemeral.** The right question is not "does my queue survive a restart?" but "what happens to the system if the queue loses an item?". If the answer is "it heals itself", a Channel<T> is enough. If the answer is "work disappears without a trace", the queue needs persistence.

**A singleton worker must never take scoped dependencies through its constructor.** IServiceScopeFactory and one scope per item give each job the same lifetime an HTTP request would have.

**Compute state instead of storing it when the columns already determine it.** A derived phase cannot drift out of sync with the data, because it is not data: it is a function of it.

**Passive expiry trades a process for a condition.** There is no sweeper to monitor or to hang. The cost is that an overdue campaign stays open until someone looks at it, and that is only acceptable if nobody depends on seeing it closed sooner.

**DropWrite drops silently.** In that mode, the writer never learns its item did not make it into the queue. Here passive expiry covers that case, but if I did it again I would use the Channel.CreateBounded overload that takes a callback for every dropped item, so saturation shows up in the logs before it shows up as expired campaigns.

**Pick the tool by the shape of the problem, not the size of the system.** A broker and a job library solve real problems. This was not one of them: there were no multiple consumers, no scheduled jobs, and no other service waiting for the message.`,
  relatedIds: ['cross-system-orchestration-without-coupling', 'bot-ubica-prueba-vida', 'catalog-driven-decision-engine'],
}
