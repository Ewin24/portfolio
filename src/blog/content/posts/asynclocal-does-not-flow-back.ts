import type { BlogPost } from '../../types'

export const asyncLocalDoesNotFlowBack: Omit<BlogPost, 'readingTime'> = {
  id: 'asynclocal-does-not-flow-back',
  slug: 'asynclocal-no-sube-al-llamador',
  title: 'AsyncLocal<T> no sube al llamador: dos logs que no podían ser ciertos a la vez',
  titleEn: 'AsyncLocal<T> Does Not Flow Back to the Caller: Two Logs That Could Not Both Be True',
  date: '2026-11-10',
  tags: ['dotnet', 'csharp', 'async', 'HttpClient', 'debugging'],
  category: 'arquitectura',
  featured: false,
  excerpt:
    'Un DelegatingHandler capturaba el intercambio HTTP con un proveedor externo y lo publicaba asignándolo a un AsyncLocal. Quien hacía el await leía null siempre. El log del propio HttpClient decía 200 en milisegundos; mi log decía que no había llegado respuesta. Dos relatos irreconciliables de la misma llamada señalaban el canal de captura, no al proveedor: AsyncLocal fluye de padre a hijo, nunca de vuelta.',
  excerptEn:
    'A DelegatingHandler captured the HTTP exchange with an external provider and published it by assigning it to an AsyncLocal. Whoever awaited the call always read null. The HttpClient\'s own log said 200 in milliseconds; my log said no response had arrived. Two irreconcilable accounts of the same call pointed at the capture channel, not the provider: AsyncLocal flows from parent to child, never back.',
  content: `Un servicio en segundo plano despachaba trabajos a un proveedor externo a través de un cliente HTTP tipado, registrado con IHttpClientFactory. Para diagnosticar cada envío necesitaba guardar el intercambio crudo: código de estado, tiempo transcurrido y cuerpo de la respuesta. Ese tipo de captura no pertenece al servicio que despacha, que solo debería conocer el resultado de dominio que devuelve el cliente. Pertenece a la tubería HTTP. El lugar natural es un DelegatingHandler: ve la petición antes de salir y la respuesta antes de que nadie la deserialice.

El problema era el viaje de vuelta. El handler vive dentro de la llamada; el servicio que necesita el dato vive fuera, del otro lado del await. Había que llevar el registro del intercambio desde el handler hasta quien hizo la llamada, sin cambiar la firma del cliente tipado, que devuelve un resultado de dominio y no un HttpResponseMessage.

La primera idea razonable fue inyectar un servicio Scoped en el handler y leerlo desde el servicio que despacha. El comentario XML que acompañaba la solución que terminó en el código descartaba esa opción con un argumento correcto: un servicio Scoped inyectado en un DelegatingHandler no se resuelve desde el scope de quien llama, sino desde el scope propio que IHttpClientFactory crea para la cadena de handlers, y esa cadena se reutiliza durante su ciclo de vida, que por defecto ronda los dos minutos. Serían dos instancias distintas. Lo que el handler escribiera no lo vería nadie.

Hasta ahí, el razonamiento era impecable. El mismo comentario proponía entonces un AsyncLocal<T> como canal ambiental, y afirmaba que lo que el handler escribiera dentro de la llamada sería visible para quien hizo el await. Esa segunda afirmación era exactamente al revés.

**El enfoque equivocado**

El handler hacía su trabajo y publicaba el resultado asignando un valor nuevo a una propiedad estática respaldada por un AsyncLocal:

\`\`\`csharp
public sealed class ExchangeCaptureHandler : DelegatingHandler
{
    protected override async Task<HttpResponseMessage> SendAsync(
        HttpRequestMessage request, CancellationToken ct)
    {
        var response = await base.SendAsync(request, ct);
        ExchangeContext.Current = await ExchangeRecord.FromAsync(response, ct);
        return response;
    }
}
\`\`\`

Del otro lado, el servicio en segundo plano hacía el await sobre el cliente tipado, leía ExchangeContext.Current y escribía una línea de log con el estado, el tiempo y el tamaño del cuerpo. Compilaba, no lanzaba excepciones y producía logs en cada ejecución. Solo que cada uno de esos logs decía lo mismo: estado nulo, tiempo nulo, cero caracteres y una nota de que no había llegado respuesta HTTP.

La lectura obvia de ese log es que el proveedor no está respondiendo. Es la hipótesis más barata de formular y la más cara de perseguir: lleva a revisar conectividad, tiempos de espera, credenciales y a abrir una conversación con un tercero. Lo que me sacó de ese camino fue otra fuente que ya estaba en la misma consola. IHttpClientFactory registra por su cuenta cada petición que atraviesa un cliente con nombre o tipado, en categorías propias del framework, sin que la aplicación tenga que hacer nada. Puse las dos líneas una al lado de la otra:

\`\`\`
[framework] System.Net.Http.HttpClient.IPartnerClient.LogicalHandler
            Received HTTP response headers after ~16 ms - 200
[app]       HTTP (null), (null) ms, 0 chars, "no response captured"
\`\`\`

Las dos no podían ser ciertas a la vez. El framework vio una respuesta 200 en milisegundos; mi captura juraba que no hubo respuesta. Si el proveedor hubiera fallado, el log del framework lo habría mostrado. Como no lo mostraba, el fallo estaba entre el handler y la línea que leía el dato: en el canal de captura, no en el sistema remoto. Una sola lectura comparada redujo el espacio de búsqueda de "algo en la red o en el proveedor" a "un AsyncLocal y dos métodos".

**La causa**

AsyncLocal<T> guarda su valor en el ExecutionContext. Cuando un flujo asíncrono arranca un flujo hijo, el ExecutionContext se captura y el hijo trabaja sobre esa captura. El valor fluye hacia abajo: lo que el padre estableció antes de la llamada, el hijo lo ve. Pero cuando el hijo asigna un valor nuevo, no modifica el contexto del padre. Escribe en su propia copia. Al terminar la llamada, el padre reanuda la ejecución con su propio contexto, que nunca cambió.

Hay un matiz que hace este defecto más engañoso de lo que parece. Un método síncrono que asigna un AsyncLocal sí deja el valor visible para quien lo llamó, porque no hay frontera asíncrona de por medio. Un método async no: el constructor de la máquina de estados restaura el ExecutionContext del llamador cuando el método devuelve el control. SendAsync en un DelegatingHandler es asíncrono por naturaleza, así que la asignación quedaba siempre encerrada dentro de la llamada.

La forma más corta de convencerse no es leer la documentación, es correr cinco líneas:

\`\`\`csharp
var slot = new AsyncLocal<string?>();

async Task Child() { await Task.Yield(); slot.Value = "set by child"; }

slot.Value = "set by parent";
await Child();
Console.WriteLine(slot.Value); // "set by parent"
\`\`\`

El hijo asigna, termina, y el padre sigue viendo su propio valor. Si el padre no hubiera establecido nada, vería null, que es exactamente lo que veía el servicio en segundo plano. El diagrama del flujo real lo deja claro:

\`\`\`
caller EC   { Current = null }
   | await SubmitAsync()  -- EC captured -->  handler EC' { Current = null }
   |                                           Current = record   (writes EC' only)
   | <-- call returns, caller resumes on its own EC --
caller EC   { Current = null }   <- the record never arrives
\`\`\`

El comentario XML había razonado bien sobre la inyección de dependencias y mal sobre la dirección del AsyncLocal. Esa combinación es la peligrosa: un argumento correcto para descartar la primera alternativa le prestó credibilidad a una conclusión incorrecta sobre la segunda. Nadie revisa con lupa la segunda mitad de un comentario cuya primera mitad ya demostró que su autor sabía de qué hablaba.

**La solución**

La regla que resuelve el problema cabe en una línea: la asignación desde el hijo nunca es visible para el padre; la mutación de una referencia compartida siempre lo es. Si el padre pone en el AsyncLocal un objeto antes de la llamada, el hijo recibe una copia del contexto, pero esa copia apunta al mismo objeto. Mientras el hijo mute ese objeto en lugar de reemplazarlo, el padre verá el cambio cuando el await termine.

El contenedor es deliberadamente pequeño:

\`\`\`csharp
public sealed class ExchangeSlot { public ExchangeRecord? Record { get; set; } }

public static class ExchangeContext
{
    private static readonly AsyncLocal<ExchangeSlot?> _slot = new();
    public static ExchangeSlot? Slot { get => _slot.Value; set => _slot.Value = value; }
}
\`\`\`

Y la responsabilidad se reparte entre los dos lados de forma explícita: quien llama crea el contenedor antes de la llamada y conserva la referencia; el handler solo escribe dentro del contenedor que encontró, si lo encontró.

\`\`\`csharp
// Caller: create the slot BEFORE the call
var slot = ExchangeContext.Slot = new ExchangeSlot();
await _partner.SubmitAsync(job, ct);
_logger.LogInformation("HTTP {Status}", slot.Record?.Status);

// Handler: mutate, never reassign
if (ExchangeContext.Slot is { } shared)
    shared.Record = await ExchangeRecord.FromAsync(response, ct);
\`\`\`

Dos detalles de esa forma son intencionales. El llamador lee de su variable local slot, no vuelve a consultar ExchangeContext.Slot después del await: así la lectura no depende de ninguna propiedad del contexto, solo de la referencia que él mismo creó. Y el handler no crea un contenedor si no encuentra uno. Si lo hiciera, repetiría el defecto original con otra forma: asignaría desde el hijo un valor que el padre nunca vería, y además ocultaría que nadie había preparado el canal.

\`\`\`
caller EC   { Slot = ref#1 }  -- EC captured -->  handler EC' { Slot = ref#1 }
                                                    ref#1.Record = record
caller reads slot.Record  -> same object, the record is there
\`\`\`

Consideré dos alternativas antes de quedarme con el contenedor. La primera era HttpRequestMessage.Options, el diccionario tipado que viaja con la petición y que un handler puede leer y escribir. Es el canal correcto cuando quien llama tiene la petición o la respuesta en la mano; aquí el cliente tipado devolvía un resultado de dominio y el servicio nunca tocaba el mensaje HTTP, así que habría obligado a cambiar la firma del cliente. La segunda era devolver el registro como parte del resultado de dominio, que mezcla diagnóstico con negocio en un contrato que consumen otros. El contenedor mutable mantiene la captura donde nació, en la tubería HTTP, sin tocar ningún contrato.

**El impacto**

El cambio fue de unas pocas líneas repartidas en tres sitios: el tipo del contenedor, el handler y el punto de llamada. No hubo que tocar el registro del cliente en IHttpClientFactory ni la firma del cliente tipado. A partir de ahí, la línea de log del servicio empezó a coincidir con la del framework: mismo estado, tiempo del mismo orden, y el cuerpo real de la respuesta.

Lo más valioso no fue el arreglo, fue lo que dejó de pasar. Esa línea de log había mentido en cada ejecución desde que existía, y su mentira apuntaba en la dirección más costosa posible: hacia un tercero. Cualquier investigación sobre un envío fallido habría empezado por sospechar del proveedor, cuando el proveedor había respondido bien todas las veces.

También corregí el comentario XML. Mantuve la parte sobre el scope de los handlers, que era cierta y es útil para quien vuelva a tener la misma idea, y reescribí la parte sobre la dirección del AsyncLocal para que dijera lo que el código ahora hace: el llamador establece el contenedor, el handler lo muta. Un comentario que afirma lo contrario de lo que el runtime hace es peor que no tener comentario, porque convierte una suposición equivocada en documentación.

**Lecciones**

**AsyncLocal fluye de padre a hijo, nunca de vuelta.** Un flujo asíncrono hijo trabaja sobre una copia capturada del ExecutionContext; lo que asigna se queda en esa copia. Si el dato tiene que subir, el padre debe crear antes de la llamada un objeto compartido y el hijo debe mutarlo, no reemplazarlo.

**Cuando un canal ambiental devuelve null en silencio, compara dos relatos independientes del mismo evento antes de sospechar del sistema remoto.** El log del framework y el log propio describían la misma llamada; que se contradijeran ubicó el defecto en el canal de captura en una sola lectura. Los registros que el framework produce sin pedirlo son un testigo independiente gratuito.

**Un argumento correcto puede prestarle credibilidad a una conclusión incorrecta.** El razonamiento sobre el scope de los DelegatingHandler era cierto y bien explicado, y por eso nadie cuestionó la afirmación siguiente sobre AsyncLocal. Cada afirmación de un comentario se verifica por separado, y la forma más barata de verificar una sobre el runtime es una reproducción de cinco líneas.

**Síncrono y async se comportan distinto con la misma asignación.** Un método síncrono que asigna un AsyncLocal deja el valor visible para el llamador; un método async no, porque al devolver el control se restaura el contexto. Una prueba mental hecha con código síncrono no demuestra nada sobre un handler asíncrono.

**El diagnóstico pertenece a la capa que lo observa.** La captura del intercambio HTTP se quedó en la tubería HTTP y viajó por un canal explícito que el llamador abre y lee, sin contaminar el contrato del cliente tipado ni el resultado de dominio que consumen otros.`,
  contentEn: `A background service dispatched jobs to an external provider through a typed HTTP client registered with IHttpClientFactory. To diagnose each dispatch I needed to keep the raw exchange: status code, elapsed time, and the response body. That kind of capture does not belong in the service doing the dispatching, which should only know about the domain result the client returns. It belongs in the HTTP pipeline. The natural place is a DelegatingHandler: it sees the request before it leaves and the response before anyone deserializes it.

The problem was the trip back. The handler lives inside the call; the service that needs the data lives outside it, on the other side of the await. The exchange record had to travel from the handler to whoever made the call, without changing the typed client's signature, which returns a domain result rather than an HttpResponseMessage.

The first reasonable idea was to inject a Scoped service into the handler and read it from the dispatching service. The XML comment on the solution that ended up in the code ruled that option out with a correct argument: a Scoped service injected into a DelegatingHandler is not resolved from the caller's scope, but from the scope IHttpClientFactory creates for the handler chain, and that chain is reused for its lifetime, which defaults to roughly two minutes. They would be two different instances. Whatever the handler wrote, nobody would ever see.

Up to that point the reasoning was flawless. The same comment then proposed an AsyncLocal<T> as an ambient channel, and claimed that whatever the handler wrote inside the call would be visible to whoever awaited it. That second claim was exactly backwards.

**The wrong approach**

The handler did its job and published the result by assigning a new value to a static property backed by an AsyncLocal:

\`\`\`csharp
public sealed class ExchangeCaptureHandler : DelegatingHandler
{
    protected override async Task<HttpResponseMessage> SendAsync(
        HttpRequestMessage request, CancellationToken ct)
    {
        var response = await base.SendAsync(request, ct);
        ExchangeContext.Current = await ExchangeRecord.FromAsync(response, ct);
        return response;
    }
}
\`\`\`

On the other side, the background service awaited the typed client, read ExchangeContext.Current, and wrote a log line with the status, the elapsed time, and the body size. It compiled, threw nothing, and produced logs on every run. Except every one of those logs said the same thing: null status, null elapsed time, zero characters, and a note that no HTTP response had arrived.

The obvious reading of that log is that the provider is not answering. It is the cheapest hypothesis to form and the most expensive one to chase: it leads to checking connectivity, timeouts, and credentials, and to opening a conversation with a third party. What pulled me off that path was another source already sitting in the same console. IHttpClientFactory logs every request that goes through a named or typed client on its own, under framework categories, without the application doing anything. I put the two lines side by side:

\`\`\`
[framework] System.Net.Http.HttpClient.IPartnerClient.LogicalHandler
            Received HTTP response headers after ~16 ms - 200
[app]       HTTP (null), (null) ms, 0 chars, "no response captured"
\`\`\`

Both could not be true. The framework saw a 200 in milliseconds; my capture swore there was no response. Had the provider failed, the framework log would have shown it. Since it did not, the fault sat between the handler and the line reading the data: in the capture channel, not in the remote system. One side-by-side reading shrank the search space from "something in the network or the provider" to "one AsyncLocal and two methods".

**The cause**

AsyncLocal<T> stores its value in the ExecutionContext. When an async flow starts a child flow, the ExecutionContext is captured and the child works on that capture. The value flows down: whatever the parent set before the call, the child sees. But when the child assigns a new value, it does not modify the parent's context. It writes to its own copy. When the call completes, the parent resumes on its own context, which never changed.

There is a nuance that makes this defect more deceptive than it looks. A synchronous method that assigns an AsyncLocal does leave the value visible to its caller, because there is no async boundary in between. An async method does not: the state machine's builder restores the caller's ExecutionContext when the method hands control back. SendAsync on a DelegatingHandler is async by nature, so the assignment was always sealed inside the call.

The fastest way to be convinced is not reading the docs, it is running five lines:

\`\`\`csharp
var slot = new AsyncLocal<string?>();

async Task Child() { await Task.Yield(); slot.Value = "set by child"; }

slot.Value = "set by parent";
await Child();
Console.WriteLine(slot.Value); // "set by parent"
\`\`\`

The child assigns, returns, and the parent still sees its own value. Had the parent set nothing, it would see null, which is exactly what the background service saw. The diagram of the real flow makes it plain:

\`\`\`
caller EC   { Current = null }
   | await SubmitAsync()  -- EC captured -->  handler EC' { Current = null }
   |                                           Current = record   (writes EC' only)
   | <-- call returns, caller resumes on its own EC --
caller EC   { Current = null }   <- the record never arrives
\`\`\`

The XML comment had reasoned well about dependency injection and badly about AsyncLocal's direction. That combination is the dangerous one: a correct argument for discarding the first alternative lent credibility to a wrong conclusion about the second. Nobody scrutinizes the second half of a comment whose first half has already shown its author knew what they were talking about.

**The solution**

The rule that fixes it fits on one line: assignment from the child is never visible to the parent; mutation of a shared reference always is. If the parent puts an object in the AsyncLocal before the call, the child gets a copy of the context, but that copy points at the same object. As long as the child mutates that object instead of replacing it, the parent sees the change once the await completes.

The holder is deliberately small:

\`\`\`csharp
public sealed class ExchangeSlot { public ExchangeRecord? Record { get; set; } }

public static class ExchangeContext
{
    private static readonly AsyncLocal<ExchangeSlot?> _slot = new();
    public static ExchangeSlot? Slot { get => _slot.Value; set => _slot.Value = value; }
}
\`\`\`

And the responsibility is split explicitly between the two sides: the caller creates the holder before the call and keeps the reference; the handler only writes into the holder it found, if it found one.

\`\`\`csharp
// Caller: create the slot BEFORE the call
var slot = ExchangeContext.Slot = new ExchangeSlot();
await _partner.SubmitAsync(job, ct);
_logger.LogInformation("HTTP {Status}", slot.Record?.Status);

// Handler: mutate, never reassign
if (ExchangeContext.Slot is { } shared)
    shared.Record = await ExchangeRecord.FromAsync(response, ct);
\`\`\`

Two details of that shape are intentional. The caller reads from its local slot variable instead of querying ExchangeContext.Slot again after the await, so the read depends on no property of the context, only on the reference it created itself. And the handler does not create a holder when it finds none. If it did, it would repeat the original defect in a different shape: it would assign, from the child, a value the parent never sees, and it would also hide the fact that nobody had prepared the channel.

\`\`\`
caller EC   { Slot = ref#1 }  -- EC captured -->  handler EC' { Slot = ref#1 }
                                                    ref#1.Record = record
caller reads slot.Record  -> same object, the record is there
\`\`\`

I weighed two alternatives before settling on the holder. The first was HttpRequestMessage.Options, the typed bag that travels with the request and that a handler can read and write. It is the right channel when the caller has the request or response in hand; here the typed client returned a domain result and the service never touched the HTTP message, so it would have forced a change to the client's signature. The second was returning the record as part of the domain result, which mixes diagnostics with business data in a contract other code consumes. The mutable holder keeps the capture where it was born, in the HTTP pipeline, without touching any contract.

**The impact**

The change came to a handful of lines across three places: the holder type, the handler, and the call site. Neither the client's registration with IHttpClientFactory nor the typed client's signature had to change. From then on, the service's log line started matching the framework's: same status, elapsed time in the same range, and the actual response body.

The most valuable part was not the fix, it was what stopped happening. That log line had lied on every run since it existed, and its lie pointed in the most expensive direction possible: at a third party. Any investigation into a failed dispatch would have started by suspecting the provider, when the provider had answered correctly every single time.

I also fixed the XML comment. I kept the part about the handler scope, which was true and useful for whoever has the same idea next, and rewrote the part about AsyncLocal's direction so it says what the code now does: the caller sets up the holder, the handler mutates it. A comment that claims the opposite of what the runtime does is worse than no comment, because it turns a wrong assumption into documentation.

**Lessons**

**AsyncLocal flows from parent to child, never back.** An async child flow works on a captured copy of the ExecutionContext; whatever it assigns stays in that copy. If data has to travel up, the parent must create a shared object before the call and the child must mutate it, not replace it.

**When an ambient channel silently yields null, compare two independent accounts of the same event before suspecting the remote system.** The framework log and my own log described the same call; their contradiction placed the defect in the capture channel in a single reading. The logs the framework produces unasked are a free independent witness.

**A correct argument can lend credibility to a wrong conclusion.** The reasoning about DelegatingHandler scope was true and well explained, which is why nobody questioned the claim about AsyncLocal that followed it. Every claim in a comment gets verified on its own, and the cheapest way to verify one about the runtime is a five-line repro.

**Sync and async behave differently with the same assignment.** A synchronous method that assigns an AsyncLocal leaves the value visible to its caller; an async method does not, because the context is restored when control returns. A mental test run against synchronous code proves nothing about an async handler.

**Diagnostics belong to the layer that observes them.** The HTTP exchange capture stayed in the HTTP pipeline and traveled through an explicit channel the caller opens and reads, without polluting the typed client's contract or the domain result other code consumes.`,
  relatedIds: ['domain-exception-problemdetails-pipeline', 'cross-system-orchestration-without-coupling'],
}
