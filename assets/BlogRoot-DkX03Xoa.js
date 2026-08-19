import{i as e,r as t,t as n}from"./jsx-runtime-D-oznMWL.js";import{t as r}from"./react-DcCgrBX5.js";import{_ as i,g as a,h as o,m as s,n as c,o as l,p as u,t as d,v as f,y as p}from"./SectionOpening-CvVHV9oz.js";import{r as m}from"./ThemeContext-DCd5QHlX.js";var h=a(`arrow-right`,[[`path`,{d:`M5 12h14`,key:`1ays0h`}],[`path`,{d:`m12 5 7 7-7 7`,key:`xquz4c`}]]),g=a(`calendar`,[[`path`,{d:`M8 2v4`,key:`1cmpym`}],[`path`,{d:`M16 2v4`,key:`4m81vk`}],[`rect`,{width:`18`,height:`18`,x:`3`,y:`4`,rx:`2`,key:`1hopcy`}],[`path`,{d:`M3 10h18`,key:`8toen8`}]]),_=a(`chevron-down`,[[`path`,{d:`m6 9 6 6 6-6`,key:`qrunsl`}]]),v=a(`clock`,[[`circle`,{cx:`12`,cy:`12`,r:`10`,key:`1mglay`}],[`path`,{d:`M12 6v6l4 2`,key:`mmk7yg`}]]),y=a(`search`,[[`path`,{d:`m21 21-4.34-4.34`,key:`14j7rj`}],[`circle`,{cx:`11`,cy:`11`,r:`8`,key:`4ej97u`}]]),b=a(`tag`,[[`path`,{d:`M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z`,key:`vktsd0`}],[`circle`,{cx:`7.5`,cy:`7.5`,r:`.5`,fill:`currentColor`,key:`kqv944`}]]),x=e(r(),1);function S(e){let t=e.split(/\s+/).length;return Math.max(1,Math.ceil(t/200))}var C=[{id:`clean-architecture-los`,slug:`arquitectura-limpa-sistema-originacion-credito`,title:`Clean Architecture en un Sistema de Originación de Crédito: Cómo evité el caos antes de escribir la primera línea de código`,titleEn:`Clean Architecture in a Loan Origination System: How I avoided chaos before writing the first line of code`,date:`2026-01-15`,tags:[`arquitectura`,`.NET`,`clean architecture`,`DDD`],category:`arquitectura`,featured:!0,excerpt:`Cuando te dan un proyecto desde cero, la tentación es abrir Visual Studio y empezar a escribir controladores. Pero sin una estructura clara, en 3 meses tienes un Big Ball of Mud. Así diseñé la arquitectura del LOS antes de escribir una línea de código de producción.`,excerptEn:`When you get a greenfield project, the temptation is to open Visual Studio and start writing controllers. But without a clear structure, in 3 months you have a Big Ball of Mud. Here's how I designed the LOS architecture before writing a single line of production code.`,content:`Cuando asumí el diseño del Sistema de Originación de Crédito, sabía que este no sería un proyecto más. Era un sistema completo desde cero: base de datos transaccional, API REST con múltiples canales de consumo, integración con burós de crédito, verificación biométrica, y un flujo de 23 estados que un préstamo recorre desde la solicitud hasta el desembolso.

La decisión más importante no fue qué tecnología usar, sino cómo organizar el código para que el proyecto siguiera siendo mantenible cuando llegara a 100 mil líneas.

**El problema de la arquitectura tradicional**

En proyectos anteriores había visto el mismo patrón: carpetas planas (Controllers/, Models/, Services/), donde Services se convertía en un cajón de sastre con 5 mil líneas y dependencias cíclicas. El problema no es la falta de habilidad del equipo, sino la falta de límites claros.

Necesitaba una estructura donde:

- Agregar un nuevo endpoint no implicara tocar 5 archivos
- Cambiar un proveedor externo (ej: pasar de Datacredito a Cifin) no requiriera modificar controladores
- Un desarrollador nuevo pudiera entender el flujo completo en menos de una hora

**La solución: Capas con propósito único**

Dividí el código en 3 ejes ortogonales:

**1. Repositorios por esquema de base de datos**

La base de datos ya estaba organizada en 4 esquemas lógicos (cfg, cat, fab, aud). En lugar de crear un repositorio por tabla (anti-patrón), creé un repositorio por esquema: ICfgRepository, ICatRepository, IFabRepository, IAudRepository.

La regla mental es trivial: si la tabla está en fab.EstudiosCredito, va en IFabRepository. No hay ambigüedad.

**2. Servicios por dominio funcional**

Los servicios no se organizan por capa técnica (como un genérico "Services/"), sino por dominio de negocio:

- EstudioService: apertura, riesgo, aprobación
- TerceroService: datos del cliente
- OtpService: validación OTP
- BiometriaService: verificación facial

Cada servicio contiene toda la lógica de su dominio. Si mañana cambia la política de validación OTP, solo tocas OtpService.

**3. Controladores por canal de consumo**

El sistema tiene 4 canales: Tienda (BFF), Web, Handoff (transición), y Admin. Cada canal tiene sus propios controladores, pero TODOS inyectan los mismos servicios de dominio.

Admin y Tienda pueden consumir EstudioService sin duplicar lógica. La diferencia está solo en la forma del request, no en la lógica de negocio.

**El resultado**

114 endpoints organizados en 6 capas BFF, 27 stored procedures, 0 duplicación de lógica entre canales. Cuando llegó el requerimiento de agregar el canal Web, solo creamos los controladores nuevos — cero cambios en servicios o repositorios existentes.

La arquitectura no es un lujo, es una decisión de negocio. Cada hora invertida diseñando capas antes de escribir código de producción se paga 10 veces cuando evitas tener que reescribir todo en el futuro.`,contentEn:`When I took on the design of the Loan Origination System, I knew this wouldn't be just another project. It was a complete system from scratch: transactional database, REST API with multiple consumption channels, credit bureau integration, biometric verification, and a 23-state workflow that a loan travels through from application to disbursement.

The most important decision wasn't which technology to use, but how to organize the code so the project would remain maintainable when it reached 100k lines.

**The traditional architecture problem**

In previous projects I had seen the same pattern: flat folders (Controllers/, Models/, Services/), where Services became a catch-all with 5k lines and circular dependencies. The problem isn't lack of skill, but lack of clear boundaries.

I needed a structure where:

- Adding a new endpoint didn't mean touching 5 files
- Changing an external provider (e.g., switching from Datacredito to Cifin) didn't require modifying controllers
- A new developer could understand the complete flow in under an hour

**The solution: Single-purpose layers**

I divided the code into 3 orthogonal axes:

**1. Repositories by database schema**

The database was already organized into 4 logical schemas (cfg, cat, fab, aud). Instead of creating one repository per table (anti-pattern), I created one repository per schema: ICfgRepository, ICatRepository, IFabRepository, IAudRepository.

The mental rule is trivial: if the table is in fab.EstudiosCredito, it goes in IFabRepository. No ambiguity.

**2. Services by functional domain**

Services are not organized by technical layer (like a generic "Services/"), but by business domain:

- EstudioService: opening, risk, approval
- TerceroService: customer data
- OtpService: OTP validation
- BiometriaService: facial verification

Each service contains all the logic for its domain. If the OTP validation policy changes tomorrow, you only touch OtpService.

**3. Controllers by consumption channel**

The system has 4 channels: Store (BFF), Web, Handoff (transition), and Admin. Each channel has its own controllers, but ALL inject the same domain services.

Admin and Store can both consume EstudioService without duplicating logic. The difference is only in request shape, not business logic.

**The result**

114 endpoints organized across 6 BFF layers, 27 stored procedures, 0 logic duplication between channels. When the requirement came to add the Web channel, we only created new controllers — zero changes to existing services or repositories.

Architecture is not a luxury, it's a business decision. Every hour invested in designing layers before writing production code pays back 10x when you avoid having to rewrite everything in the future.`,relatedIds:[`catalog-driven-decision-engine`]},{id:`catalog-driven-decision-engine`,slug:`motor-decisiones-catalog-driven-sin-if`,title:`Eliminé todos los if/switch de mi motor de decisiones (y por qué deberías hacer lo mismo)`,titleEn:`I eliminated every if/switch from my decision engine (and why you should too)`,date:`2026-03-20`,tags:[`arquitectura`,`patrones`,`C#`,`design patterns`],category:`arquitectura`,featured:!0,excerpt:`Cuando construyes un sistema que toma decisiones basadas en diagnósticos externos (un bot de voz, un servicio de validación), la tentación es escribir switch(mensaje) { case "ERROR": ... }. Eso es deuda técnica inmediata. Te cuento cómo lo evité con un motor catalog-driven.`,excerptEn:`When you build a system that makes decisions based on external diagnoses (a voice bot, a validation service), the temptation is to write switch(message) { case "ERROR": ... }. That's immediate technical debt. Let me tell you how I avoided it with a catalog-driven engine.`,content:`El SOVI (Sistema Orquestador de Validación de Identidad) nació de un requisito aparentemente simple: "validar que la persona que solicita el crédito es quien dice ser". Pero la implementación tenía una complejidad oculta.

El bot de voz podía devolver 10+ diagnósticos diferentes: desde "identidad confirmada" hasta "error técnico", pasando por "voz no coincide" o "documento no legible". Cada diagnóstico requería una acción del sistema diferente: aprobar, escalar a asesor humano, rechazar, reintentar.

**El approach equivocado (el que todos conocemos)**

El 90% de los desarrolladores escribiría algo así:

\`\`\`csharp
switch (diagnostico) {
    case "IDENTIDAD_CONFIRMADA": return Aprobar();
    case "VOZ_NO_COINCIDE":      return EscalarAAsesor();
    case "ERROR_TECNICO_BOT":   return Reintentar();
    default:                     return Escalar();
}
\`\`\`

Esto funciona el primer día. El problema es cuando:

- Llega un nuevo diagnóstico del proveedor del bot → toca modificar código, recompilar, redeployar
- Un negocio decide que "VOZ_NO_COINCIDE" ya no debe escalar sino reintentar → toca modificar código
- Tienes 3 ambientes (dev, test, prod) y el cambio debe sincronizarse en todos

**La solución: Catálogo en base de datos**

En lugar de hardcodear las decisiones, creé una tabla cat.CatalogoDiagnosticosBot:

| IdDiagnostico | CodigoDiagnostico   | AccionSistema | RequiereReintento |
|---------------|--------------------|---------------|-------------------|
| 1             | IDENTIDAD_CONFIRMADA | APROBAR       | false             |
| 2             | VOZ_NO_COINCIDE      | ESCALAR       | true              |
| 3             | ERROR_TECNICO_BOT    | REINTENTAR    | true              |

El motor de decisiones ahora es una línea:

\`\`\`csharp
var accion = await _repositorio.ObtenerAccionPorDiagnostico(codigoDiagnostico);
return EjecutarAccion(accion);
\`\`\`

**El patrón Strategy para los canales de validación**

Además del motor catalog-driven, implementé el patrón Strategy con dos estrategias de validación:

- BotValidacionStrategy: automatizada, vía bot de voz
- ManualValidacionStrategy: asesor humano, como plan B

La clave aquí es que el plan B NO es un fallback after-thought. Es un ciudadano de primera clase, con su propia interfaz IValidacionStrategy y su propia lógica. Si el bot falla (ERROR_TECNICO_BOT), el sistema escala al asesor humano, que tipifica el caso usando el MISMO catálogo de diagnósticos.

**El resultado concreto**

- 0 cambios de código cuando el negocio modifica las reglas de decisión
- 0 cambios de código cuando se agregan nuevos diagnósticos del bot
- El plan B comparte la misma lógica de negocio que el plan A
- Trazabilidad completa: cada intento (automático o manual) queda registrado con timestamp, URL de audio y datos biométricos

Si tu motor de decisiones tiene ifs o switches con lógica de negocio, los estás acoplando al código. La base de datos no es solo para datos transaccionales — también es el mejor lugar para tus reglas de decisión cuando la frecuencia de cambio es alta.`,contentEn:`SOVI (Identity Validation Orchestrator System) was born from a seemingly simple requirement: "verify that the person requesting the loan is who they say they are." But the implementation had hidden complexity.

The voice bot could return 10+ different diagnoses: from "identity confirmed" to "technical error", including "voice doesn't match" or "document illegible". Each diagnosis required a different system action: approve, escalate to human advisor, reject, retry.

**The wrong approach (the one we all know)**

90% of developers would write something like this:

\`\`\`csharp
switch (diagnosis) {
    case "IDENTITY_CONFIRMED": return Approve();
    case "VOICE_MISMATCH":     return EscalateToAdvisor();
    case "BOT_TECH_ERROR":     return Retry();
    default:                   return Escalate();
}
\`\`\`

This works on day one. The problem starts when:

- A new diagnosis arrives from the bot provider → you have to modify code, recompile, redeploy
- The business decides that "VOICE_MISMATCH" should retry instead of escalate → you have to modify code
- You have 3 environments (dev, test, prod) and changes must be synchronized across all

**The solution: Database catalog**

Instead of hardcoding decisions, I created a cat.CatalogoDiagnosticosBot table:

| IdDiagnostico | CodigoDiagnostico | AccionSistema | RequiereReintento |
|---------------|-------------------|---------------|-------------------|
| 1             | IDENTITY_CONFIRMED | APPROVE       | false             |
| 2             | VOICE_MISMATCH     | ESCALATE      | true              |
| 3             | BOT_TECH_ERROR     | RETRY         | true              |

The decision engine is now a single line:

\`\`\`csharp
var action = await _repository.GetActionByDiagnosis(diagnosisCode);
return ExecuteAction(action);
\`\`\`

**The Strategy pattern for validation channels**

Beyond the catalog-driven engine, I implemented the Strategy pattern with two validation strategies:

- BotValidacionStrategy: automated, via voice bot
- ManualValidacionStrategy: human advisor, as Plan B

The key here is that Plan B is NOT an after-thought fallback. It's a first-class citizen, with its own IValidacionStrategy interface and its own logic. If the bot fails (BOT_TECH_ERROR), the system escalates to the human advisor, who classifies the case using the SAME diagnosis catalog.

**The concrete result**

- 0 code changes when the business modifies decision rules
- 0 code changes when new bot diagnoses are added
- Plan B shares the same business logic as Plan A
- Full traceability: each attempt (automatic or manual) is logged with timestamp, audio URL, and biometric data

If your decision engine has ifs or switches with business logic, you are coupling them to code. The database is not just for transactional data — it's also the best place for your decision rules when the change frequency is high.`,relatedIds:[`clean-architecture-los`]},{id:`comunicaciones-api-centralizada`,slug:`api-centralizada-comunicaciones`,title:`Centralicé todos los correos de la empresa en una API con Clean Architecture (y dejé de preguntarle al proveedor qué pasó)`,titleEn:`I centralized every corporate email into a single Clean Architecture API (and stopped asking the provider what happened)`,date:`2026-06-15`,tags:[`arquitectura`,`.NET`,`clean architecture`,`API`,`patrones`],category:`arquitectura`,featured:!0,excerpt:`Cada área de la empresa gestionaba el correo por su cuenta, con su propia implementación, su propia clave API, y su propia definición de "éxito". Hasta que el proveedor decía "no me llegó el comprobante" y nadie sabía qué pasó. Así diseñé una API centralizada que eliminó el black box de las comunicaciones empresariales.`,excerptEn:`Every business area managed email on its own —its own implementation, its own API key, its own definition of "success." Until the provider said "I didn't get the receipt" and no one knew what happened. Here's how I designed a centralized API that eliminated the enterprise communications black box.`,content:`"El correo se envió correctamente". Esa frase aparecía en el log de nuestro sistema de gestión de proveedores, pero el destinatario —un proveedor externo esperando su registro— juraba que nunca llegó. ¿Spam? ¿Rebote? ¿La IP del servidor en una blacklist? ¿Un error interno que el aplicación se tragó sin registrar? Nadie podía responder. Empezaba la ronda de correos: "revisá si te llegó", "¿está en spam?", "¿lo reenviamos?". Horas perdidas. En una ocasión, un comprobante fiscal que debía enviarse a un proveedor nunca llegó a su destino. El equipo de soporte pasó tres horas revisando logs, verificando la configuración anti-spam del destinatario, y reenviando el correo manualmente. Al final descubrimos que la API key de Sendinblue en ese repositorio tenía un typo en la variable de entorno de producción —pero como nadie la monitoreaba, nadie se dio cuenta hasta que el cliente llamó por tercera vez. Y no era la primera vez que pasaba.

 Teníamos áreas enteras de la empresa gestionando el correo por su cuenta. El equipo de gestión de proveedores manejaba sus propias notificaciones de registro y comprobantes fiscales. Recursos humanos tenía su propio sistema para encuestas de retiro, documentos de nómina y cartas de afiliación. El área de cumplimiento enviaba notificaciones de aceptación de políticas de datos para clientes en proceso de compra o estudio de crédito. Producción generaba órdenes de trabajo para que proveedores externos iniciaran procesos de fabricación de distintos productos. Y atención al cliente mandaba notificaciones transaccionales sobre el estado de solicitudes y servicios. Cada una con su propia integración de correo, su propia lógica de negocio, su propia clave API de Sendinblue hardcodeada en el repositorio, y su propio concepto de lo que significaba "éxito". Para algunas áreas, que el proveedor aceptara el mensaje era suficiente. Para otras, ni siquiera logueaban el intento. En un caso, el "envío exitoso" era simplemente no haber lanzado una excepción.

El síntoma era predecible: cuando alguien preguntaba "¿llegó el correo?", la respuesta era un encogimiento de hombros. Sin métricas, sin trazabilidad directa, sin auditoría central. El soporte era puramente reactivo: el cliente llamaba diciendo que no recibió el comprobante, un usuario interno reportaba que no le llegó la notificación, y empezaba la cacería. ¿Falló el proveedor? ¿Está en spam? ¿El template se rompió? ¿Se perdió en una cola? Sin datos concretos, era imposible saberlo.

El costo no era técnico, era de negocio: comprobantes que no llegaban, proveedores que no se registraban a tiempo, documentos contractuales que quedaban sin firma. Y nadie —literalmente nadie— podía probar qué pasó con cada mensaje.

**El anti-patrón que aceptamos como normal**

El anti-patrón era evidente: cada equipo reinventó la rueda del correo electrónico. El módulo de gestión de proveedores llamaba a Sendinblue directo desde un controller. Recursos humanos tenía un service propio con su propia configuración de HttpClient. El área de cumplimiento, la de producción y la de atención al cliente, cada una con su approach particular. Distintas formas de resolver lo mismo, cero estandarización.

Yo también caí en esta trampa antes de liderar este cambio. El problema no era la calidad individual de cada implementación —cada una funcionaba en aislamiento— sino el costo de mantenerlas como silos independientes. Cambiar de proveedor de Sendinblue a Infobip implicaba modificar múltiples repositorios. Codebase, pipelines de CI/CD, variables de entorno por ambiente, secretos en el vault de cada proyecto —todo había que tocarlo. Cada repo era un riesgo: su propia carpeta, su propio pull request, su propio ciclo de revisión, su propia oportunidad de error. Y ni hablar de los aspectos no funcionales: no había reintentos automáticos, ni circuit breaker, ni colas de respaldo. Si el proveedor respondía con un timeout, el mensaje se perdía para siempre. Cada equipo implementaba su propia lógica de reintento —cuando la implementaban, que no era siempre.

Los templates eran otro dolor. Cada sistema manejaba sus propias plantillas HTML con variables de reemplazo simple tipo {{NombreCliente}}. Sin lógica condicional, sin personalización real por dominio de negocio. Si un área necesitaba un formato diferente —digamos, un comprobante fiscal versus una notificación de registro— había que modificar el código del sistema correspondiente.

Y lo peor de todo: cero trazabilidad. El proveedor respondía HTTP 200 y el sistema asumía éxito. Nadie guardaba el payload enviado, nadie registraba la respuesta del servidor, nadie podía reconstruir qué pasó cuando un correo no llegaba.

**La solución: una API, 4 capas**

Diseñé una API centralizada con Clean Architecture en 4 capas: API (controllers HTTP), Application (servicios de orquestación), Domain (entidades e interfaces de repositorio), Infrastructure (proveedores concretos, repositorios con Dapper, configuración multi-tenant).

La decisión más importante fue tratar el correo electrónico como infraestructura, no como dominio de negocio. El dominio de negocio es la comunicación con el proveedor, el cliente o el empleado. El canal —email, SMS, push— es solo infraestructura. Esta distinción permitió que la capa de dominio definiera interfaces puras y que la infraestructura las implementara sin acoplamiento al resto del sistema.

El desacople empieza con una interfaz de 10 líneas:

\`\`\`csharp
// IEmailProvider — la pieza clave del desacople
public interface IEmailProvider
{
    Task<EmailResponse> SendAsync(EmailRequest request);
}
\`\`\`

Infobip es UNA implementación de esa interfaz. Zoho SMTP sería otra. Cuando migramos de Sendinblue a Infobip, el impacto total fue crear una nueva clase que implementara IEmailProvider. Ni un solo sistema consumidor se enteró. Esa interfaz eliminó de un golpe el acoplamiento que habíamos normalizado durante años.

**Trazabilidad con GUID**

Cada transacción de email se persiste con un GUID como identidad propia. No más depender del message ID arbitrario que devuelva el proveedor —el nuestro es estable, único, y trazable desde el origen hasta el log de auditoría:

\`\`\`csharp
public class EmailTransaction
{
    public Guid Id { get; set; }
    public string OriginContext { get; set; }
    public string RecipientEmail { get; set; }
    public string Status { get; set; }
    public string RequestPayload { get; set; }
    public string ResponsePayload { get; set; }
    public string InfobipMessageId { get; set; } public string? InfobipBulkId { get; set; }
}
\`\`\`

El status puede ser SUCCESS (el provider aceptó), API_REJECTED (el provider devolvió error) o APP_ERROR (error interno antes de llamar al provider). Cada transacción guarda el request payload completo y el response payload del proveedor, permitiendo reconstruir exactamente qué pasó.

**Multi-tenant desde el día 1**

Ocho cuentas de Infobip para 8 contextos de negocio distintos. La resolución se hace por OriginContext, un string que cada sistema consumidor envía al llamar a la API. La configuración centralizada se ve así:

\`\`\`json
"Infobip": {
  "Accounts": {
    "GestionProveedores": { "ApiKey": "...", "BaseUrl": "..." },
    "RecursosHumanos": { "ApiKey": "...", "BaseUrl": "..." }
  }
}
\`\`\`

Cuando la API recibe una solicitud con OriginContext "GestionProveedores", resuelve la cuenta correspondiente del dictionary y construye el cliente HTTP con esa configuración. Simple, testeable, y extensible sin tocar código existente.

**Template engine por contexto de negocio**

Cada dominio necesita su propio formato de correo. Un comprobante de pago no se ve igual que una notificación de registro. Implementé IEmailTemplateProcessor, una interfaz que permite tener procesadores distintos por contexto de negocio. Cada uno con su propia lógica de reemplazo de placeholders, estructura HTML y encabezados personalizados.

El Application Service resuelve el procesador según el OriginContext que llega en el request. Los templates son archivos HTML separados, no cadenas embebidas en el código. Esto permite que el equipo de negocio modifique los diseños sin tocar una línea de C#.

**Persistencia y logging**

Elegí Dapper sobre EF Core porque esta capa es puramente infraestructura. No necesito change tracking, ni migrations complejas, ni navegación de objetos. El stored procedure hace INSERT puro:

\`\`\`csharp
var sql = "EXEC sp_InsertEmailLog @Id, @OriginContext, @Status, @RequestPayload, @ResponsePayload";
await connection.ExecuteAsync(sql, transaction, commandType: CommandType.StoredProcedure);
\`\`\`

Los logs se estructuraron con Serilog usando tres pipelines separados:

\`\`\`json
"Serilog": {
  "WriteTo": [
    { "Name": "Console" },
    { "Name": "File", "Args": { "path": "logs/log-.txt" } },
    { "Name": "File", "Args": { "path": "logs/applog-.txt", "filter": "LogType in (Request, Response, Template)" } }
  ]
}
\`\`\`

El tercer pipeline es clave: filtra solo logs con LogType Request, Response o Template. Esto permite consultar la trazabilidad sin el ruido de los miles de logs HTTP que genera el pipeline de consola.

El flujo completo de la arquitectura:

\`\`\`
[Controller] → [Application Service] → [IEmailProvider]
                                              ↓
                                    [Infobip REST API]
                                              ↓
                                    [Dapper Repository]
                                              ↓
                                    [SQL Server Audit]
\`\`\`

Y la resolución multi-tenant:

\`\`\`
OriginContext (GestionProveedores)
       ↓
InfobipOptions.Accounts["GestionProveedores"]
       ↓
ApiKey + BaseUrl → InfobipClient
\`\`\`

**El impacto: lo que cambió**

Los números hablan por sí solos:

- Múltiples áreas que antes manejaban el correo por separado → 1 API centralizada
- Cambio de proveedor: de días o semanas a horas (implementar una nueva clase que implemente IEmailProvider)
- 8 cuentas de Infobip gestionadas desde un solo punto de configuración, sin tocar los sistemas consumidores
- Cada transacción con GUID, payload completo de request y response, timestamps exactos
- Tres pipelines de logging que separan el ruido operativo de la trazabilidad real

El impacto más tangible no fue técnico, fue cultural. Cambió la dinámica de todo el equipo. Cuando el negocio preguntaba "¿por qué no llegó el correo?", la respuesta ya no era un "no sabemos" o "revisemos los logs del servidor a ver si encontramos algo". Era abrir la tabla de auditoría y mostrar: "el provider respondió con este error a las 14:32:05, código 400, body: {...}".

Antes de la API centralizada, depurar un correo no entregado tomaba entre 30 minutos y 2 horas, asumiendo que alguien recordara en qué sistema y en qué archivo buscar. Con la API, cualquier miembro del equipo —incluso quienes no conocían cada sistema interno— podía ver el estado de una transacción en segundos. La trazabilidad pasó de ser un lujo a ser la línea base.

**Lecciones aprendidas**

**Uno. Provider-agnostic no es teoría académica.** Cuando Sendinblue cambió sus precios y condiciones de servicio, la abstracción de IEmailProvider nos permitió evaluar Infobip e implementar el adaptador sin tocar ni una línea de los sistemas consumidores. Esos meses de margen no los hubiéramos tenido con 5 implementaciones acopladas. La interfaz no era un adorno arquitectónico —era un seguro contra el cambio que nadie había contratado hasta entonces.

**Dos. Trazabilidad no es un feature, es una necesidad de debugging.** El GUID con payload completo de request y response pagó su peso en la primera semana. Literalmente la primera semana encontramos un caso donde el provider aceptaba el mensaje pero lo marcaba con status REJECTED en la respuesta —algo que antes pasaba desapercibido porque nadie guardaba la respuesta. Recuperar exactamente qué se envió, a quién y qué respondió el proveedor transformó el debugging de "adivinar" a "consultar". Sin esa trazabilidad, seguíamos en el mismo black box.

**Tres. Clean Architecture no es solo para dominios complejos.** El correo electrónico es infraestructura pura y se beneficia IGUAL que un dominio financiero. Las capas no son un adorno: son lo que permite cambiar una implementación completa sin que el resto del sistema se entere. Si alguien te dice que Clean Architecture es overkill para "solo enviar emails", no le creas. El email es el mejor caso de uso para capas bien definidas, porque TODO cambia alrededor del email: el proveedor, los templates, las políticas de envío, los requisitos de auditoría.`,contentEn:`"The email was sent successfully." That message appeared in our vendor management system's logs, yet the recipient —an external vendor waiting to complete registration— swore it never arrived. Spam? Bounce? Server IP on a blacklist? An internal error the application swallowed without logging? No one could answer. The email chain would start: "did you get it?", "check your spam folder", "should I resend it?". Hours wasted. In one case, a fiscal receipt that was supposed to reach a vendor never arrived. The support team spent three hours digging through logs, checking the recipient's anti-spam config, and manually resending the email. It turned out the Sendinblue API key in that repo had a typo in the production environment variable —but since no one monitored it, nobody noticed until the client called for the third time. And it wasn't the first time it happened.

 We had entire business areas managing email on their own. The vendor management team handled their own registration notifications and fiscal receipts. Human resources ran their own system for exit surveys, payroll documents, and affiliation letters. The compliance team sent data policy consent notifications for clients going through purchases or credit studies. Production generated work orders for external suppliers to start manufacturing different products. And customer support sent transactional notifications about service and application status. Each one with its own email integration, its own business logic, its own Sendinblue API key hardcoded in the repository, and its own definition of what "success" meant. For some areas, the provider accepting the message was enough. For others, they didn't even log the attempt. In one case, "successful send" meant simply not throwing an exception.

The symptom was predictable: when someone asked "did the email go through?", the answer was a shrug. No metrics, no direct traceability, no central audit trail. Support was purely reactive: a client would call saying they never received their receipt, an internal user reported a missing notification, and the hunt would begin. Did the provider fail? Is it in spam? Did the template break? Was it lost in a queue? Without concrete data, it was impossible to know.

The cost wasn't technical — it was business. Receipts that never arrived, vendors who couldn't register on time, contractual documents that went unsigned. And no one —literally no one— could prove what happened to each message.

**The anti-pattern we accepted as normal**

The anti-pattern was clear: every team reinvented the email wheel. The vendor management module called Sendinblue directly from a controller. Human resources had its own service with its own HttpClient configuration. Compliance, production, and customer support each took their own approach. Different ways to solve the same thing, zero standardization.

I fell into this trap too before leading this change. The problem wasn't the individual quality of each implementation —each one worked in isolation— but the cost of maintaining them as independent silos. Switching providers from Sendinblue to Infobip meant modifying multiple repositories. Not just the source code: also the CI/CD pipelines, environment variables across every environment, secrets in each project's vault. Each repo was a risk: its own folder, its own pull request, its own review cycle, its own opportunity for something to break. And let's not even talk about the non-functional aspects: no automatic retries, no circuit breaker, no backup queues. If the provider responded with a timeout, the message was gone forever. Each team implemented their own retry logic —when they implemented it at all, which wasn't always.

Templates were another headache. Each system managed its own HTML templates with simple variable replacement like {{CustomerName}}. No conditional logic, no real per-domain customization. If a business area needed a different format —say, a fiscal receipt versus a registration notification— someone had to modify that system's code.

And the worst part: zero traceability. The provider responded HTTP 200 and the system assumed success. No one saved the sent payload, no one logged the server's response, no one could reconstruct what happened when an email didn't arrive.

**The solution: one API, 4 layers**

I designed a centralized API with Clean Architecture in 4 layers: API (HTTP controllers), Application (orchestration services), Domain (entities and repository interfaces), Infrastructure (concrete providers, Dapper repositories, multi-tenant configuration).

The most important decision was treating email as infrastructure, not business domain. The business domain is communication with vendors, clients, or employees. The channel —email, SMS, push— is just infrastructure. This distinction allowed the domain layer to define pure interfaces and let infrastructure implement them without coupling to the rest of the system.

The decoupling starts with a 10-line interface:

\`\`\`csharp
// IEmailProvider — the key decoupling piece
public interface IEmailProvider
{
    Task<EmailResponse> SendAsync(EmailRequest request);
}
\`\`\`

Infobip is ONE implementation of that interface. Zoho SMTP would be another. When we migrated from Sendinblue to Infobip, the total impact was creating one new class that implemented IEmailProvider. Not a single consumer system knew about it. That one interface eliminated years of normalized coupling in one shot.

**GUID-based traceability**

Every email transaction is persisted with a GUID as its own identity. No more depending on whatever message ID the provider returns —ours is stable, unique, and traceable from origin to audit log:

\`\`\`csharp
public class EmailTransaction
{
    public Guid Id { get; set; }
    public string OriginContext { get; set; }
    public string RecipientEmail { get; set; }
    public string Status { get; set; }
    public string RequestPayload { get; set; }
    public string ResponsePayload { get; set; }
    public string InfobipMessageId { get; set; } public string? InfobipBulkId { get; set; }
}
\`\`\`

The status field captures SUCCESS (provider accepted), API_REJECTED (provider returned an error), or APP_ERROR (internal failure before reaching the provider). Every transaction stores the full request payload and the provider's response payload, making it possible to reconstruct exactly what happened.

**Multi-tenant from day one**

Eight Infobip accounts for 8 different business contexts. Resolution happens by OriginContext, a string each consumer system sends when calling the API. The centralized configuration looks like this:

\`\`\`json
"Infobip": {
  "Accounts": {
    "GestionProveedores": { "ApiKey": "...", "BaseUrl": "..." },
    "RecursosHumanos": { "ApiKey": "...", "BaseUrl": "..." }
  }
}
\`\`\`

When the API receives a request with OriginContext "GestionProveedores", it resolves the corresponding account from the dictionary and builds the HTTP client with that configuration. Simple, testable, and extensible without touching existing code.

**Template engine by business context**

Each business domain needs its own email format. A payment receipt doesn't look like a registration notification. I implemented IEmailTemplateProcessor, an interface that allows separate processors per business context. Each one has its own placeholder replacement logic, HTML structure, and custom headers.

The Application Service resolves the processor based on the OriginContext from the request. Templates are standalone HTML files, not strings embedded in code. This lets the business team modify layouts without touching a single line of C#.

**Persistence and logging**

I chose Dapper over EF Core because this layer is pure infrastructure. No need for change tracking, complex migrations, or object navigation. The stored procedure does a straight INSERT:

\`\`\`csharp
var sql = "EXEC sp_InsertEmailLog @Id, @OriginContext, @Status, @RequestPayload, @ResponsePayload";
await connection.ExecuteAsync(sql, transaction, commandType: CommandType.StoredProcedure);
\`\`\`

Logs were structured with Serilog using three separate pipelines:

\`\`\`json
"Serilog": {
  "WriteTo": [
    { "Name": "Console" },
    { "Name": "File", "Args": { "path": "logs/log-.txt" } },
    { "Name": "File", "Args": { "path": "logs/applog-.txt", "filter": "LogType in (Request, Response, Template)" } }
  ]
}
\`\`\`

The third pipeline is key: it only captures logs with LogType Request, Response, or Template. This lets us query traceability data without the noise of thousands of HTTP logs from the console pipeline.

The complete architecture flow:

\`\`\`
[Controller] → [Application Service] → [IEmailProvider]
                                              ↓
                                    [Infobip REST API]
                                              ↓
                                    [Dapper Repository]
                                              ↓
                                    [SQL Server Audit]
\`\`\`

And the multi-tenant resolution:

\`\`\`
OriginContext (GestionProveedores)
       ↓
InfobipOptions.Accounts["GestionProveedores"]
       ↓
ApiKey + BaseUrl → InfobipClient
\`\`\`

**The impact: what changed**

The numbers speak for themselves:

- Multiple areas that previously handled email separately → 1 centralized API
- Provider switching: from days or weeks to hours (implement one new class that implements IEmailProvider)
- 8 Infobip accounts managed from a single configuration point, without touching consumer systems
- Every transaction has a GUID, full request and response payload, exact timestamps
- Three logging pipelines that separate operational noise from true traceability

The most tangible impact wasn't technical — it was cultural. It changed the entire team's dynamic. When the business asked "why didn't the email go through?", the answer was no longer "we don't know" or "let's check the server logs and see if we find something." It was opening the audit table and showing: "the provider responded with this error at 14:32:05, code 400, body: {...}."

Before the centralized API, debugging a failed delivery took between 30 minutes and 2 hours, assuming someone remembered which system and which file to look in. With the API, any team member —not just those familiar with each internal system— could see a transaction's status in seconds. Traceability went from being a luxury to being the baseline. The support team went from "let's see what we can find" to having an answer in seconds.

**Lessons learned**

**One. Provider-agnostic isn't academic theory.** When Sendinblue changed its pricing and terms of service, the IEmailProvider abstraction let us evaluate Infobip and implement the adapter without touching a single line in the consumer systems. Those months of cushion wouldn't have existed with 5 tightly coupled implementations. The interface wasn't architectural decoration — it was insurance against change that no one had bought before.

**Two. Traceability isn't a feature, it's a debugging necessity.** The GUID with full request and response payload paid for itself in the first week. Literally the first week we found a case where the provider accepted the message but returned REJECTED status in the response —something that would have gone unnoticed before because no one saved the response. Recovering exactly what was sent, to whom, and what the provider responded transformed debugging from "guesswork" to "look it up." Without that traceability, we'd still be in the same black box.

**Three. Clean Architecture isn't just for complex domains.** Email is pure infrastructure and it benefits JUST AS MUCH as a financial domain. The layers aren't decoration — they're what let you swap an entire implementation without the rest of the system knowing. If someone tells you Clean Architecture is overkill for "just sending emails," don't believe them. Email is the best use case for well-defined layers, because EVERYTHING changes around email: the provider, the templates, the sending policies, the audit requirements. And when something changes, you want to change one file, not five.`,relatedIds:[`clean-architecture-los`]},{id:`dual-frontend-clean-architecture-dotnet-10`,slug:`dual-frontend-clean-architecture-dotnet-10`,title:`Diseñé un ERP donde la capa de presentación (Blazor) y la REST API son intercambiables gracias a Clean Architecture`,titleEn:`I Designed an ERP Where the Presentation Layer (Blazor) and REST API Are Interchangeable Thanks to Clean Architecture`,date:`2026-07-01`,tags:[`.NET`,`clean architecture`,`Blazor`,`ASP.NET Core`,`C#`],category:`arquitectura`,featured:!0,excerpt:`Cómo logré que Blazor y la API compartieran exactamente la misma lógica de negocio en un ERP de producción mediante inyección de dependencias en Clean Architecture, eliminando duplicación y acelerando el desarrollo de características.`,excerptEn:`How I made Blazor and the API share identical business logic in a production ERP through dependency injection in Clean Architecture, eliminating duplication and accelerating feature development.`,content:`**El problema: dos frontends para el mismo ERP**

En la empresa necesitábamos un ERP que atendiera dos tipos de consumidores: sistemas externos mediante REST API para integraciones con bancos y logística, y usuarios internos mediante una interfaz web rica con MudBlazor. La tentación inicial fue hacer que Blazor llamara a la API para reutilizar lógica, pero eso generaba sobrecarga de red innecesaria para operaciones internas y duplicación de manejo de autenticación (cookies vs JWT). Más crítico aún: cualquier cambio en reglas de negocio requería actualizar tanto la API como el cliente Blazor, con riesgo de inconsistencias y doble testing.

**El approach equivocado**

Primero intentamos que las páginas Blazor fueran meros consumidores de la API. Cada acción del usuario implicaba una ronda HTTP adicional, incluso para operaciones triviales como validar un campo. Luego probamos crear servicios separados por frontend: uno para API y otro para Blazor. Esto resultó en mantenimiento dual: cada nueva regla de negocio (como cálculo de impuestos regionales) debía implementarse dos veces. La autenticación también se duplicó: validación de cookies en Blazor y validación de tokens en API, con riesgo de desincronización en políticas de expiración.

**La solución: Application Services compartidos**

Aplicamos Clean Architecture con seis proyectos .NET 10: Domain (entidades), Contracts (DTOs compartidos), Application (casos de uso), Infrastructure (Dapper, repositorios), API (controladores REST) y un frontend web con Blazor Server. La clave: tanto la API como Blazor inyectan los mismos Application Services directamente desde un contenedor DI compartido. No hay llamadas HTTP entre capas de presentación — ambas acceden a la lógica de negocio mediante inyección directa.

\`\`\`
+----------------+     +---------------------+     +------------------+
|  Web Frontend  |     |   Application        |     |   Domain Model   |
| (Blazor Server)|<----|   Services (shared)  |<----|   (Domain)       |
+----------------+     +---------------------+     +------------------+
         ^                        ^
         |                        |
+----------------+     +---------------------+
|  REST API      |     |   Infrastructure    |
| (Controllers)  |<----|   (Infrastructure)  |
+----------------+     +---------------------+
\`\`\`

La interfaz del servicio de aplicación es simple:

\`\`\`csharp
public interface IOrdenService
{
    Task<OrdenDto> CrearOrdenAsync(CrearOrdenCommand comando);
    Task<IEnumerable<OrdenDto>> ObtenerOrdenesPendientesAsync();
    Task<bool> AprobarOrdenAsync(int ordenId, string usuario);
}
\`\`\`

El registro DI es idéntico para ambos entry points:

\`\`\`csharp
builder.Services.AddScoped<IOrdenService, OrdenService>();
builder.Services.AddScoped<IOrdenRepository, OrdenRepository>();
\`\`\`

En Blazor se inyecta con \`@inject\`:

\`\`\`csharp
@inject IOrdenService OrdenService

@code {
    protected override async Task OnInitializedAsync()
    {
        Ordenes = await OrdenService.ObtenerOrdenesPendientesAsync();
    }
}
\`\`\`

Y en el controller de la API, exactamente el mismo patrón:

\`\`\`csharp
[ApiController]
[Route("api/[controller]")]
public class OrdenController : ControllerBase
{
    private readonly IOrdenService _ordenService;

    public OrdenController(IOrdenService ordenService)
        => _ordenService = ordenService;

    [HttpPost]
    public async Task<ActionResult<OrdenDto>> Crear(
        [FromBody] CrearOrdenCommand comando)
    {
        var orden = await _ordenService.CrearOrdenAsync(comando);
        return CreatedAtAction(nameof(Obtener), new { id = orden.Id }, orden);
    }
}
\`\`\`

**El impacto**

Al compartir Application Services entre Blazor y API, logramos cero duplicación de lógica de negocio. Cada nueva regla se implementa una sola vez y está disponible inmediatamente en ambos frontends. Los DTOs definidos en Contracts se reutilizan sin transformación en Blazor pages y en respuestas de API. El tiempo para implementar una característica que afecta ambos frontends se redujo aproximadamente un sesenta por ciento comparado con el enfoque de doble implementación. Las pruebas unitarias de Application Services validan el comportamiento para ambas capas de presentación simultáneamente.

**Lecciones aprendidas**

El verdadero valor de Clean Architecture no reside principalmente en la testabilidad (aunque es un beneficio importante), sino en su capacidad para hacer que la lógica de negocio sea verdaderamente compartible entre múltiples consumidores. Cuando diseñamos pensando en múltiples puntos de entrada (web, API, workers) desde el inicio, evitamos el costo oculto de la duplicación que surge cuando se añaden nuevos canales después. La clave técnica fue reconocer que la capa de aplicación no debe conocer nada sobre el mecanismo de entrega (HTTP, SignalR, cola) sino enfocarse exclusivamente en orquestar reglas de dominio. Esta separación permitió que Blazor operara con latencia interna mínima mientras la API mantenía su contrato externo estable, todo usando exactamente el mismo código de negocio.`,contentEn:`**The problem: two frontends for the same ERP**

At the company we needed an ERP serving two consumer types: external systems via REST API for bank and logistics integrations, and internal users via a rich MudBlazor web interface. The initial temptation was making Blazor call the API to reuse logic, but this introduced unnecessary network overhead for internal operations and duplicated authentication handling (cookies vs JWT). More critically: any business rule change required updates in both API and Blazor clients, risking inconsistencies and double testing.

**The wrong approach**

First we tried making Blazor pages mere API consumers. Each user action triggered an extra HTTP roundtrip, even for trivial operations like field validation. Then we attempted creating frontend-specific services: one for the API, another for Blazor. This resulted in dual maintenance: every new business rule had to be implemented twice. Authentication also duplicated: cookie validation in Blazor versus token validation in the API, risking desynchronization in expiration policies.

**The solution: shared Application Services**

We applied Clean Architecture with six .NET 10 projects: Domain (entities), Contracts (shared DTOs), Application (use cases), Infrastructure (Dapper, repositories), API (REST controllers), and a web frontend with Blazor Server. The key: both API and Blazor inject the same Application Services directly from a shared DI container. No HTTP calls between presentation layers — both access business logic via direct injection.

\`\`\`
+----------------+     +---------------------+     +------------------+
|  Web Frontend  |     |   Application        |     |   Domain Model   |
| (Blazor Server)|<----|   Services (shared)  |<----|   (Domain)       |
+----------------+     +---------------------+     +------------------+
         ^                        ^
         |                        |
+----------------+     +---------------------+
|  REST API      |     |   Infrastructure    |
| (Controllers)  |<----|   (Infrastructure)  |
+----------------+     +---------------------+
\`\`\`

The application service interface is simple:

\`\`\`csharp
public interface IOrdenService
{
    Task<OrdenDto> CrearOrdenAsync(CrearOrdenCommand comando);
    Task<IEnumerable<OrdenDto>> ObtenerOrdenesPendientesAsync();
    Task<bool> AprobarOrdenAsync(int ordenId, string usuario);
}
\`\`\`

The DI registration is identical for both entry points:

\`\`\`csharp
builder.Services.AddScoped<IOrdenService, OrdenService>();
builder.Services.AddScoped<IOrdenRepository, OrdenRepository>();
\`\`\`

In Blazor it's injected with \`@inject\`:

\`\`\`csharp
@inject IOrdenService OrdenService

@code {
    protected override async Task OnInitializedAsync()
    {
        Ordenes = await OrdenService.ObtenerOrdenesPendientesAsync();
    }
}
\`\`\`

And in the API controller, the exact same pattern:

\`\`\`csharp
[ApiController]
[Route("api/[controller]")]
public class OrdenController : ControllerBase
{
    private readonly IOrdenService _ordenService;

    public OrdenController(IOrdenService ordenService)
        => _ordenService = ordenService;

    [HttpPost]
    public async Task<ActionResult<OrdenDto>> Crear(
        [FromBody] CrearOrdenCommand comando)
    {
        var orden = await _ordenService.CrearOrdenAsync(comando);
        return CreatedAtAction(nameof(Obtener), new { id = orden.Id }, orden);
    }
}
\`\`\`

**The impact**

By sharing Application Services between Blazor and API, we achieved zero duplication of business logic. Each new rule is implemented once and immediately available in both frontends. Contracts-defined DTOs are reused without transformation in Blazor pages and API responses. Feature implementation time affecting both frontends dropped approximately sixty percent compared to dual implementation. Application Services unit tests validate behavior for both presentation layers simultaneously.

**Lessons learned**

Clean Architecture's true value isn't primarily testability (though it's an important benefit) but its ability to make business logic genuinely shareable across multiple consumers. When designing for multiple entry points (web, API, workers) from the outset, we avoid the hidden cost of duplication that arises when adding channels later. The technical key was recognizing that the application layer must know nothing about the delivery mechanism (HTTP, SignalR, queue) and focus solely on orchestrating domain rules. This separation allowed Blazor to operate with minimal internal latency while the API maintained its external contract stable, using identical business logic.`,relatedIds:[`clean-architecture-los`]},{id:`domain-exception-problemdetails-pipeline`,slug:`error-handling-middleware-pipeline`,title:`Todo el error handling de mi API se reduce a dos archivos: así eliminé los try-catch de mis controladores`,titleEn:`My entire API error handling lives in two files: how I eliminated try-catch from my controllers`,date:`2026-07-15`,tags:[`arquitectura`,`.NET`,`ASP.NET Core`,`patrones`,`C#`],category:`arquitectura`,featured:!0,excerpt:`Cada controller tenía su propio try-catch, cada error devolvía un formato distinto, y los mensajes mezclaban detalles técnicos con reglas de negocio. Unificarlo todo en dos archivos — DomainExceptions.cs + ExceptionHandlingMiddleware — cambió la forma en que pensamos los errores.`,excerptEn:`Every controller had its own try-catch, each error returned a different format, and messages mixed technical details with business rules. Unifying it all in two files — DomainExceptions.cs + ExceptionHandlingMiddleware — changed how we think about errors.`,content:`**El problema: error handling en cada esquina**

Cuando heredé el código del ERP empresarial, cada controller manejaba errores a su manera. Algunos tenían try-catch que devolvían 200 con un flag "success: false". Otros lanzaban excepciones genéricas Exception que terminaban en 500. Y algunos directamente no manejaban nada — si el service fallaba, el usuario veía una página amarilla de error de ASP.NET. No había consistencia. Cada tres meses aparecía un bug donde un endpoint devolvía "Error: Object reference not set to an instance of an object" al cliente, filtrando detalles internos de infraestructura.

El problema raíz era que los errores de negocio (cliente no encontrado, crédito insuficiente) y los errores técnicos (timeout de base de datos, serialización JSON) se trataban exactamente igual: como excepciones sin tipo en el catch del controller.

**El approach equivocado**

Intentamos estandarizar con un helper estático \`ErrorResponseHelper\` que todos los controllers llamarían. El helper crecía sin control: cada nuevo caso de error agregaba un método más. Pronto teníamos treinta métodos estáticos, algunos con lógica de negocio hardcodeada, otros con traducciones de mensajes mezcladas con HTTP status codes. Era un cajón de sastre con dependencias de infrastructure y dominio al mismo tiempo.

**La solución: excepciones tipadas + middleware**

Reduje todo el error handling a dos archivos. El primero es DomainExceptions.cs, que contiene TODAS las excepciones de negocio como clases selladas tipadas:

\`\`\`csharp
public abstract class DomainException : Exception
{
    protected DomainException(string message) : base(message) { }
}

public sealed class CredencialesInvalidasException()
    : DomainException("Credenciales inválidas") { }

public sealed class NotFoundException(string message)
    : DomainException(message) { }

public sealed class ValidacionNegocioException(string message)
    : DomainException(message) { }

public sealed class IpNoAutorizadaException()
    : DomainException("IP no autorizada") { }
\`\`\`

El segundo archivo es ExceptionHandlingMiddleware, el único lugar donde las excepciones de dominio se convierten en respuestas HTTP:

\`\`\`csharp
public class ExceptionHandlingMiddleware
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (DomainException ex)
        {
            context.Response.StatusCode = ex switch
            {
                CredencialesInvalidasException => 401,
                IpNoAutorizadaException => 403,
                NotFoundException => 404,
                ValidacionNegocioException => 400,
                _ => 500
            };

            await context.Response.WriteAsJsonAsync(new ProblemDetails
            {
                Title = ex.GetType().Name.Replace("Exception", ""),
                Status = context.Response.StatusCode,
                Detail = _env.IsDevelopment() ? ex.Message : null
            });
        }
    }
}
\`\`\`

El patrón es simple: los servicios lanzan excepciones tipadas de dominio. El middleware las atrapa y las transforma a RFC 7807 ProblemDetails. Los controllers no tienen ni un solo try-catch:

\`\`\`csharp
[HttpPost("login")]
public async Task<ActionResult<LoginResponse>> Login(LoginRequest request)
{
    var usuario = await _authService.ValidarLoginAsync(request.User, request.Password);
    var token = await _authService.GenerarTokenAsync(usuario);
    return Ok(token);
}
\`\`\`

Flujo completo:

\`\`\`
AuthService.ValidarLoginAsync()
    throws CredencialesInvalidasException
        ↓
ExceptionHandlingMiddleware catches
        ↓
Switch expression → 401 + ProblemDetails
        ↓
Cliente recibe: {"title":"CredencialesInvalidas","status":401}
\`\`\`

**El impacto**

El cambio fue inmediato: cero try-catch en todos los controllers del ERP. Cualquier desarrollador nuevo entiende el error handling en cinco minutos abriendo dos archivos. Cuando el negocio pidió un nuevo tipo de error (ej: "cuenta bloqueada"), agregamos una clase de tres líneas en DomainExceptions.cs y su mapeo en el middleware — cero controllers modificados. En producción, los errores de dominio devuelven un título genérico sin detalles técnicos, pero en desarrollo el mensaje completo ayuda al debugging. El formato ProblemDetails (RFC 7807) es un estándar, no inventamos nada.

**Lecciones aprendidas**

El error handling no es responsabilidad de los controllers. Es un concern transversal que pertenece al middleware. Cada vez que veo un try-catch en un controller, sé que hay una abstracción faltante. Las excepciones de dominio tipadas son la mejor documentación viva de "qué puede salir mal" en el sistema: abres DomainExceptions.cs y ves todos los casos de error de negocio en una pantalla. El patrón middleware + excepciones tipadas es tan simple que cuesta creer que funcionó tan bien. Pero funcionó porque respeta la separación de capas: dominio define qué puede fallar, infraestructura decide cómo se expresa HTTP.`,contentEn:`**The problem: error handling everywhere**

When I inherited the ERP codebase, every controller handled errors differently. Some had try-catch blocks returning 200 with a "success: false" flag. Others threw generic Exception that ended up as 500. And some handled nothing at all — if the service failed, the user saw ASP.NET's yellow error page. There was no consistency. Every few months a bug surfaced where an endpoint returned "Error: Object reference not set to an instance of an object" to the client, leaking internal infrastructure details.

The root problem was that business errors (client not found, insufficient credit) and technical errors (database timeout, JSON serialization) were treated identically: as untyped exceptions in the controller's catch block.

**The wrong approach**

We tried standardizing with a static ErrorResponseHelper that all controllers would call. The helper grew uncontrollably: each new error case added another method. Soon we had thirty static methods, some with hardcoded business logic, others with message translations mixed with HTTP status codes. It was a catch-all with infrastructure and domain dependencies at the same time.

**The solution: typed exceptions + middleware**

I reduced all error handling to two files. The first is DomainExceptions.cs, containing ALL business exceptions as typed sealed classes:

\`\`\`csharp
public abstract class DomainException : Exception
{
    protected DomainException(string message) : base(message) { }
}

public sealed class CredencialesInvalidasException()
    : DomainException("Invalid credentials") { }

public sealed class NotFoundException(string message)
    : DomainException(message) { }

public sealed class ValidacionNegocioException(string message)
    : DomainException(message) { }

public sealed class IpNoAutorizadaException()
    : DomainException("Unauthorized IP") { }
\`\`\`

The second file is ExceptionHandlingMiddleware, the only place where domain exceptions become HTTP responses:

\`\`\`csharp
public class ExceptionHandlingMiddleware
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (DomainException ex)
        {
            context.Response.StatusCode = ex switch
            {
                CredencialesInvalidasException => 401,
                IpNoAutorizadaException => 403,
                NotFoundException => 404,
                ValidacionNegocioException => 400,
                _ => 500
            };

            await context.Response.WriteAsJsonAsync(new ProblemDetails
            {
                Title = ex.GetType().Name.Replace("Exception", ""),
                Status = context.Response.StatusCode,
                Detail = _env.IsDevelopment() ? ex.Message : null
            });
        }
    }
}
\`\`\`

The pattern is simple: services throw typed domain exceptions. The middleware catches them and transforms them into RFC 7807 ProblemDetails. Controllers have zero try-catch blocks:

\`\`\`csharp
[HttpPost("login")]
public async Task<ActionResult<LoginResponse>> Login(LoginRequest request)
{
    var usuario = await _authService.ValidarLoginAsync(request.User, request.Password);
    var token = await _authService.GenerarTokenAsync(usuario);
    return Ok(token);
}
\`\`\`

Complete flow:

\`\`\`
AuthService.ValidarLoginAsync()
    throws CredencialesInvalidasException
        ↓
ExceptionHandlingMiddleware catches
        ↓
Switch expression → 401 + ProblemDetails
        ↓
Client receives: {"title":"CredencialesInvalidas","status":401}
\`\`\`

**The impact**

The change was immediate: zero try-catch across all ERP controllers. Any new developer understands error handling in five minutes by opening two files. When the business requested a new error type ("account locked"), we added a three-line class in DomainExceptions.cs and its mapping in the middleware — zero controllers modified. In production, domain errors return a generic title without technical details, but in development the full message aids debugging. The ProblemDetails format (RFC 7807) is a standard — we didn't invent anything.

**Lessons learned**

Error handling is not a controller responsibility. It's a cross-cutting concern that belongs in middleware. Every time I see a try-catch in a controller, I know there's a missing abstraction. Typed domain exceptions are the best living documentation of "what can go wrong" in the system: open DomainExceptions.cs and see every business error case on one screen. The middleware-plus-typed-exceptions pattern is so simple it's hard to believe it worked this well. But it worked because it respects layer separation: domain defines what can fail, infrastructure decides how it's expressed over HTTP.`,relatedIds:[`dual-frontend-clean-architecture-dotnet-10`]},{id:`dapper-stored-procedures-why-how`,slug:`dapper-stored-procedures-en-lugar-de-ef-core`,title:`No uso Entity Framework. En 3 años de ERP, cero migraciones, cero N+1, cero sorpresas en producción`,titleEn:`I don't use Entity Framework. In 3 years of ERP development, zero migrations, zero N+1, zero production surprises`,date:`2026-08-01`,tags:[`Dapper`,`arquitectura`,`.NET`,`performance`,`patrones`],category:`arquitectura`,featured:!0,excerpt:`Cada vez que alguien dice "usa EF Core, es el estándar", me pregunto si su base de datos tiene 200 stored procedures legacy y un equipo de DBA. Te cuento por qué elegimos Dapper puro y cómo vivimos para contarlo.`,excerptEn:`Every time someone says "use EF Core, it's the standard", I wonder if their database has 200 legacy stored procedures and a DBA team. Here's why we chose pure Dapper and lived to tell the tale.`,content:`**El problema: 200 stored procedures no se migran a EF Core**

En nuestro ERP empresarial heredamos una base de datos con más de 200 stored procedures. Algunos con lógica compleja de varios resultsets, otros con parámetros de salida para códigos de estado, y varios con inserciones masivas mediante SqlBulkCopy. La base de datos no era un accesorio del código — era el activo principal, gestionado por un equipo de DBA que versionaba los SPs en control de fuentes independientemente del código C#.

El equipo de desarrollo propuso EF Core porque "es lo que usa todo el mundo". El problema: adoptar EF Core significaba elegir entre dos males: o code-first (ignorando 200 SPs existentes y pelearnos con los DBAs por cada migration), o database-first (generando un EDMX monstruoso que replicaba lo que ya teníamos en SQL).

**El approach equivocado**

Probamos database-first con EF Core. El modelo generado era enorme, las consultas que producía eran ineficientes para nuestros SPs existentes, y cada vez que un DBA modificaba un SP teníamos que regenerar el modelo. Además, varios SPs devolvían múltiples resultsets (ej: orden de trabajo + detalles + histórico), y mapear eso con EF Core requería hacks con \`SqlQuery\` raw que anulaban el propósito del ORM.

**La solución: Dapper puro con stored procedures**

Reemplazamos todo con Dapper, siguiendo un patrón consistente en cada repositorio. La pieza clave es la fábrica de conexiones:

\`\`\`csharp
public class SqlConnectionFactory : ISqlConnectionFactory
{
    private readonly string _connectionString;

    public SqlConnectionFactory(IConfiguration config)
    {
        DefaultTypeMap.MatchNamesWithUnderscores = true;
        _connectionString = config.GetConnectionString("DatabaseConnection");
    }

    public async Task<DbConnection> CreateConnectionAsync()
        => new SqlConnection(_connectionString);
}
\`\`\`

Cada repositorio sigue el mismo patrón: \`using var connection\`, stored procedure, Dapper mapea:

\`\`\`csharp
public async Task<ClienteDto> ObtenerPorIdAsync(int id)
{
    using var connection = await _connectionFactory.CreateConnectionAsync();
    return await connection.QueryFirstOrDefaultAsync<ClienteDto>(
        "sp_ObtenerCliente",
        new { Id = id },
        commandType: CommandType.StoredProcedure
    );
}
\`\`\`

Para consultas complejas con múltiples resultsets:

\`\`\`csharp
public async Task<OrdenDto> ObtenerOrdenConDetallesAsync(int ordenId)
{
    using var connection = await _connectionFactory.CreateConnectionAsync();
    using var multi = await connection.QueryMultipleAsync(
        "prod.GetOrdenCompleta",
        new { OrdenId = ordenId },
        commandType: CommandType.StoredProcedure
    );

    var orden = await multi.ReadFirstOrDefaultAsync<OrdenDto>();
    if (orden is null) return null;

    orden.Detalles = (await multi.ReadAsync<DetalleDto>()).ToList();
    return orden;
}
\`\`\`

Los parámetros de salida se manejan con DynamicParameters:

\`\`\`csharp
var parameters = new DynamicParameters();
parameters.Add("@Id", ordenId);
parameters.Add("@CodigoEstado", dbType: DbType.Int32,
    direction: ParameterDirection.Output);
await connection.ExecuteAsync("prod.MarcarEnviado", parameters,
    commandType: CommandType.StoredProcedure);
var estado = parameters.Get<int>("@CodigoEstado");
\`\`\`

Y el registro DI es mínimo:

\`\`\`csharp
services.AddSingleton<ISqlConnectionFactory, SqlConnectionFactory>();
services.AddScoped<IOrdenRepository, OrdenRepository>();
\`\`\`

**El impacto**

Cero migraciones en tres años. Cero N+1 queries. Cero sorpresas en producción donde el ORM generara SQL inesperado. Los DBAs pueden auditar cada llamada porque todo pasa por SPs con nombres predecibles. El overhead de Dapper es consistentemente inferior al milisegundo por operación. Las inserciones masivas (Formulario 220 DIAN) usan SqlBulkCopy y procesan miles de registros en segundos.

**Lecciones aprendidas**

Dapper no es una alternativa "menos capaz" a EF Core. Es la herramienta correcta cuando tu capa de datos está dominada por stored procedures y el rendimiento importa. EF Core brilla en aplicaciones code-first donde el ORM es dueño del esquema. En sistemas ERP donde la base de datos es un activo legacy gestionado por DBAs, forzar un ORM crea más fricción que valor. La clave está en preguntarse: ¿quién es dueño de la base de datos? Si es el equipo de desarrollo con code-first, EF Core. Si es un equipo de DBA con SPs versionados, Dapper.`,contentEn:`**The problem: 200 stored procedures don't migrate to EF Core**

In our enterprise ERP we inherited a database with over 200 stored procedures. Some with complex multi-resultset logic, others with output parameters for status codes, and several with bulk inserts using SqlBulkCopy. The database wasn't an accessory to the code — it was the primary asset, managed by a DBA team that versioned SPs in source control independently from the C# code.

The development team proposed EF Core because "that's what everyone uses." The problem: adopting EF Core meant choosing between two evils: either code-first (ignoring 200 existing SPs and fighting DBAs over every migration) or database-first (generating a monstrous EDMX that replicated what we already had in SQL).

**The wrong approach**

We tried database-first with EF Core. The generated model was enormous, the queries it produced were inefficient for our existing SPs, and every time a DBA modified an SP we had to regenerate the model. Plus, several SPs returned multiple resultsets (e.g., work order + details + history), and mapping that with EF Core required raw SqlQuery hacks that defeated the ORM's purpose.

**The solution: pure Dapper with stored procedures**

We replaced everything with Dapper, following a consistent pattern in every repository. The key piece is the connection factory:

\`\`\`csharp
public class SqlConnectionFactory : ISqlConnectionFactory
{
    private readonly string _connectionString;

    public SqlConnectionFactory(IConfiguration config)
    {
        DefaultTypeMap.MatchNamesWithUnderscores = true;
        _connectionString = config.GetConnectionString("DatabaseConnection");
    }

    public async Task<DbConnection> CreateConnectionAsync()
        => new SqlConnection(_connectionString);
}
\`\`\`

Every repository follows the same pattern: \`using var connection\`, stored procedure, Dapper maps:

\`\`\`csharp
public async Task<ClienteDto> ObtenerPorIdAsync(int id)
{
    using var connection = await _connectionFactory.CreateConnectionAsync();
    return await connection.QueryFirstOrDefaultAsync<ClienteDto>(
        "sp_ObtenerCliente",
        new { Id = id },
        commandType: CommandType.StoredProcedure
    );
}
\`\`\`

For complex queries with multiple resultsets:

\`\`\`csharp
public async Task<OrdenDto> ObtenerOrdenConDetallesAsync(int ordenId)
{
    using var connection = await _connectionFactory.CreateConnectionAsync();
    using var multi = await connection.QueryMultipleAsync(
        "prod.GetOrdenCompleta",
        new { OrdenId = ordenId },
        commandType: CommandType.StoredProcedure
    );

    var orden = await multi.ReadFirstOrDefaultAsync<OrdenDto>();
    if (orden is null) return null;

    orden.Detalles = (await multi.ReadAsync<DetalleDto>()).ToList();
    return orden;
}
\`\`\`

Output parameters are handled with DynamicParameters:

\`\`\`csharp
var parameters = new DynamicParameters();
parameters.Add("@Id", ordenId);
parameters.Add("@CodigoEstado", dbType: DbType.Int32,
    direction: ParameterDirection.Output);
await connection.ExecuteAsync("prod.MarcarEnviado", parameters,
    commandType: CommandType.StoredProcedure);
var estado = parameters.Get<int>("@CodigoEstado");
\`\`\`

And the DI registration is minimal:

\`\`\`csharp
services.AddSingleton<ISqlConnectionFactory, SqlConnectionFactory>();
services.AddScoped<IOrdenRepository, OrdenRepository>();
\`\`\`

**The impact**

Zero migrations in three years. Zero N+1 queries. Zero production surprises where the ORM generated unexpected SQL. DBAs can audit every call because everything goes through predictably named SPs. Dapper overhead is consistently sub-millisecond per operation. Bulk inserts (DIAN Form 220) use SqlBulkCopy and process thousands of records in seconds.

**Lessons learned**

Dapper isn't a "less capable" alternative to EF Core. It's the right tool when your data layer is dominated by stored procedures and performance matters. EF Core excels in code-first applications where the ORM owns the schema. In ERP systems where the database is a legacy asset managed by DBAs, forcing an ORM creates more friction than value. The key question is: who owns the database? If it's the dev team with code-first, use EF Core. If it's a DBA team with versioned SPs, use Dapper.`,relatedIds:[`clean-architecture-los`]},{id:`api-versioning-transparent-contract-evolution`,slug:`versionado-api-transparente-sin-romper-clientes`,title:`Versioné 24 controladores de una API en producción sin cambiar ni una sola URL existente`,titleEn:`I versioned 24 production API controllers without changing a single existing URL`,date:`2026-08-15`,tags:[`API`,`arquitectura`,`.NET`,`ASP.NET Core`,`patrones`],category:`arquitectura`,featured:!0,excerpt:`Cuando 24 controladores están en producción y los clientes no pueden actualizarse todos al mismo tiempo, romper URLs no es una opción. Así implementé versionado transparente con rutas duales sin que ningún consumidor legacy se enterara.`,excerptEn:`When 24 controllers are in production and clients can't all update simultaneously, breaking URLs is not an option. Here's how I implemented transparent versioning with dual routes without any legacy consumer noticing.`,content:`**El problema: evolucionar sin romper**

Nuestra API interna tenía 24 controladores en producción cuando llegó la necesidad de agregar funcionalidades nuevas: filtros avanzados, campos calculados, nuevos endpoints. Pero los consumidores eran heterogéneos: apps móviles que actualizaban cada dos semanas, apps web que actualizaban mensualmente, e integraciones legacy que no podían actualizarse por restricciones del cliente. Un flag day no era viable romper veinticuatro endpoints simultáneamente habría sido un desastre de soporte.

**El approach equivocado**

Consideramos tres opciones: (1) un flag day donde todos los clientes actualizaran al mismo tiempo — inviable por la diversidad de ciclos de release. (2) congelar la API para siempre — el negocio necesitaba nuevas features. (3) HATEOAS como mecanismo completo de descubrimiento — sobreingeniería que agregaba complejidad innecesaria para equipos frontend acostumbrados a contratos explícitos.

**La solución: Asp.Versioning.Mvc con rutas duales**

Usé Asp.Versioning.Mvc con versionado por segmento de URL. La clave fue mantener las rutas legacy funcionando mientras se agregaban las nuevas rutas versionadas:

\`\`\`csharp
// Program.cs
builder.Services.AddApiVersioning(options =>
{
    options.AssumeDefaultVersionWhenUnspecified = true;
    options.DefaultApiVersion = new ApiVersion(1, 0);
    options.ReportApiVersions = true;
    options.ApiVersionReader = new UrlSegmentApiVersionReader();
});
\`\`\`

Cada controlador existente recibió dos atributos de ruta — la legacy y la versionada:

\`\`\`csharp
[ApiVersion("1.0")]
[Route("api/v{version}/[controller]")]
[Route("api/[controller]")]
public class ClienteController : ControllerBase
{
    // El código no cambia — solo los atributos
}
\`\`\`

Aprovechamos que MyBaseController cubría 5 controladores. Un solo atributo \`[ApiVersion("1.0")]\` en la base cubrió 5 endpoints a la vez:

\`\`\`csharp
[ApiVersion("1.0")]
public class MyBaseController : ControllerBase
{
    // Lógica compartida para 5 controladores
}
\`\`\`

El outlier de autenticación usaba una ruta no estándar (\`[Route("[controller]")]\` sin \`api/\`). Lo manejamos explícitamente:

\`\`\`csharp
[ApiVersion("1.0")]
[Route("[controller]")]
[Route("api/v{version}/[controller]")]
public class AutenticacionController : ControllerBase { }
\`\`\`

Arquitectura de rutas:

\`\`\`
Clientes legacy:  GET /api/Cliente/{nit}     → V1 (sin cambios)
Clientes nuevos:  GET /api/v2/Cliente/{nit}   → V2 (nuevas features)
                  GET /api/v1/Cliente/{nit}   → V1 (mismo que legacy)
\`\`\`

**El impacto**

Cero cambios en clientes existentes. Las apps legacy siguen llamando exactamente a los mismos endpoints y reciben las mismas respuestas. Los clientes nuevos usan rutas versionadas para acceder a funcionalidades adicionales. Swagger muestra documentos separados por versión. Cuando necesitamos agregar un controller V2, lo creamos en \`Controllers/V2/\` con \`[ApiVersion("2.0")]\` y funciona. En total fueron veintisiete tareas implementadas y verificadas. Desde el deployment, cero incidentes atribuibles al versionado.

**Lecciones aprendidas**

El versionado de API exitoso no se trata de crear nuevas URLs, sino de dar tiempo a los consumidores para migrar. Un contrato transparente evoluciona respetando tanto la necesidad del producto de avanzar como la estabilidad que requieren los clientes. Identificar puntos de leverage como un base controller reduce drásticamente el trabajo mecánico. Y encontrar outliers temprano (como el controlador de autenticación con ruta no estándar) evita sorpresas en producción.`,contentEn:`**The problem: evolve without breaking**

Our internal API had 24 controllers in production when we needed to add new functionality: advanced filters, calculated fields, new endpoints. But our consumers were heterogeneous: mobile apps updating every two weeks, web apps updating monthly, and legacy integrations that couldn't be updated due to client restrictions. A flag day wasn't viable — breaking twenty-four endpoints simultaneously would have been a support disaster.

**The wrong approach**

We considered three options: (1) a flag day forcing all clients to update simultaneously — unworkable given diverse release cycles. (2) freezing the API forever — the business needed new features. (3) HATEOAS as a full discovery mechanism — overengineering that added unnecessary complexity for frontend teams accustomed to explicit contracts.

**The solution: Asp.Versioning.Mvc with dual routes**

I used Asp.Versioning.Mvc with URL-segment versioning. The key was keeping legacy routes working while adding new versioned routes:

\`\`\`csharp
// Program.cs
builder.Services.AddApiVersioning(options =>
{
    options.AssumeDefaultVersionWhenUnspecified = true;
    options.DefaultApiVersion = new ApiVersion(1, 0);
    options.ReportApiVersions = true;
    options.ApiVersionReader = new UrlSegmentApiVersionReader();
});
\`\`\`

Each existing controller received two route attributes — the legacy and the versioned one:

\`\`\`csharp
[ApiVersion("1.0")]
[Route("api/v{version}/[controller]")]
[Route("api/[controller]")]
public class ClienteController : ControllerBase
{
    // Code doesn't change — only the attributes
}
\`\`\`

We leveraged MyBaseController covering 5 controllers. A single \`[ApiVersion("1.0")]\` attribute on the base covered 5 endpoints at once:

\`\`\`csharp
[ApiVersion("1.0")]
public class MyBaseController : ControllerBase
{
    // Shared logic for 5 controllers
}
\`\`\`

The authentication outlier used a non-standard route (\`[Route("[controller]")]\` without \`api/\`). We handled it explicitly:

\`\`\`csharp
[ApiVersion("1.0")]
[Route("[controller]")]
[Route("api/v{version}/[controller]")]
public class AutenticacionController : ControllerBase { }
\`\`\`

Route architecture:

\`\`\`
Legacy clients:  GET /api/Cliente/{nit}     → V1 (unchanged)
New clients:     GET /api/v2/Cliente/{nit}   → V2 (new features)
                 GET /api/v1/Cliente/{nit}   → V1 (same as legacy)
\`\`\`

**The impact**

Zero changes to existing clients. Legacy apps continue calling exactly the same endpoints and receiving the same responses. New clients use versioned routes for additional functionality. Swagger shows separate documents per version. When we needed to add a V2 controller, we created it in \`Controllers/V2/\` with \`[ApiVersion("2.0")]\` and it worked. Twenty-seven tasks were implemented and verified. Since deployment, zero incidents attributable to versioning.

**Lessons learned**

Successful API versioning isn't about creating new URLs — it's about giving consumers time to migrate. A transparent contract evolves respecting both the product's need to advance and the stability clients require. Identifying leverage points like a base controller drastically reduces mechanical work. And finding outliers early (like the authentication controller with a non-standard route) prevents production surprises.`,relatedIds:[`dual-frontend-clean-architecture-dotnet-10`]},{id:`cross-system-orchestration-without-coupling`,slug:`orquestacion-cross-system-sin-acoplamiento`,title:`Una orden de trabajo recorre 3 sistemas sin que ninguno se acople al otro: el orquestador es un método, no un microservicio`,titleEn:`A work order travels through 3 systems without any coupling to each other: the orchestrator is a method, not a microservice`,date:`2026-09-01`,tags:[`arquitectura`,`.NET`,`patrones`,`orquestación`,`integraciones`],category:`arquitectura`,featured:!0,excerpt:`Cuando una orden de producción necesita notificar por email, guardar PDFs en la nube y actualizar el estado en otro sistema, la tentación es crear un orquestador. Pero a veces el orquestador correcto es un método de 30 líneas.`,excerptEn:`When a production order needs to notify by email, save PDFs to the cloud, and update status in another system, the temptation is to build an orchestrator service. But sometimes the right orchestrator is a 30-line method.`,content:`**El problema: una orden que no vive en un solo sistema**

En el flujo de producción, una orden de trabajo sigue este ciclo: el ERP empresarial la gestiona, el sistema de gestión notifica al proveedor via email con PDFs adjuntos, Azure Blob Storage guarda la documentación, y el sistema central marca la orden como enviada. Son tres sistemas diferentes, cada uno con su propia base de datos, su propio equipo, su propio ciclo de deploy. El desafío: coordinar todo esto sin crear un monstruo distribuido.

El síntoma más visible era que cuando un proveedor llamaba diciendo "no recibí la orden", nadie podía responder rápido. ¿Falló el email? ¿El PDF no se generó? ¿El sistema de almacenamiento devolvió error? Empezaba una ronda de revisiones en tres sistemas diferentes.

**El approach equivocado**

La primera idea fue construir un servicio orquestador dedicado, un nuevo proyecto con su propio deploy, su propia base de datos, su propio pipeline CI/CD. Un microservicio para "orquestar órdenes". Esto implicaba: (1) agregar latencia de red entre el orquestador y cada sistema, (2) duplicar lógica de negocio porque el orquestador necesitaba saber demasiado sobre cada sistema, (3) un nuevo punto de fallo en la cadena.

**La solución: orquestación en un service method**

En lugar de un nuevo servicio, implementé la orquestación dentro del Application Service existente. El método \`NotificarDespachoOrdenTrabajo\` encadena tres operaciones secuenciales usando interfaces desacopladas:

\`\`\`csharp
public async Task<ResultadoNotificacion> NotificarDespachoOrdenTrabajoAsync(
    NotificarDespachoRequest request)
{
    // 1. Enviar email con PDFs via Infobip
    var emailResult = await _emailService.EnviarCorreoConAdjuntosAsync(
        request.ToEmail, request.Subject, request.HtmlContent,
        request.Adjuntos);

    if (!emailResult.Exitoso) return Fallo(emailResult.Error);

    // 2. Subir PDFs a Azure Blob Storage
    foreach (var adjunto in request.Adjuntos)
    {
        adjunto.Contenido.Position = 0; // resetear stream
        await _azureStorage.GuardarAsync(
            $"ordenes/{request.OrdenId}/{adjunto.Nombre}",
            adjunto.Contenido);
    }

    // 3. Marcar orden como enviada en el ERP empresarial
    var codigoEstado = await _erpEmpresarialService.MarcarEnvioFormatoAsync(
        request.OrdenId);

    return Exito(codigoEstado);
}
\`\`\`

Cada integración se define como una interfaz independiente:

\`\`\`csharp
public interface IEmailService
{
    Task<EmailResult> EnviarCorreoConAdjuntosAsync(
        string to, string subject, string html,
        List<AttachmentDto> attachments);
}

public interface IAzureStorageService
{
    Task GuardarAsync(string blobName, Stream content);
}

public interface ISistemaCentralService
{
    Task<int> MarcarEnvioFormatoAsync(int ordenId);
}
\`\`\`

Los responsables del envío se cargan dinámicamente desde la API del ERP empresarial, en lugar de estar hardcodeados:

\`\`\`csharp
var responsables = await _erpEmpresarialApi.ObtenerResponsablesProcesoAsync(
    request.ProcesoId);
\`\`\`

Flujo completo:

\`\`\`
UI Submit → [Sistema de Gestión]
                ↓
         [Infobip Email] → notificar proveedor con PDFs
                ↓
         [Azure Blob] → almacenar documentos
                ↓
         [ERP empresarial] → MarcarEnvioFormato
\`\`\`

**El impacto**

Cero servicios nuevos que deployar. Cero archivos temporales en disco (los streams de PDF se resetean con Position = 0 en vez de guardarse). Trazabilidad completa porque cada paso se loguea con el mismo TransactionId del email. Si el paso 3 falla, el paso 2 puede revertirse. Los interfaces permiten mockear cada integración en tests unitarios. El método completo tiene menos de cuarenta líneas.

**Lecciones aprendidas**

Orquestación no requiere un microservicio dedicado ni una cola de mensajes. Un Application Service bien diseñado puede encadenar operaciones cross-system sin acoplar los sistemas entre sí. La clave está en los límites de interfaz, no en los límites físicos de servicio. Cada sistema expone una interfaz, el service method las orquesta. Los PDFs en memoria sin archivos temporales son un detalle que parece menor pero elimina toda una categoría de bugs (archivos huérfanos, permisos, limpieza). Y cargar dinámicamente los responsables desde la API en lugar de hardcodearlos significa que el negocio puede cambiar quién recibe cada notificación sin tocar una línea de código.`,contentEn:`**The problem: an order that lives in no single system**

In the production workflow, a work order follows this cycle: the central ERP manages it, the management system notifies the supplier via email with attached PDFs, Azure Blob Storage stores the documentation, and the central system marks the order as sent. Three different systems, each with its own database, its own team, its own deployment cycle. The challenge: coordinate all this without creating a distributed monster.

The most visible symptom was that when a supplier called saying "I didn't receive the order," no one could answer quickly. Did the email fail? Was the PDF not generated? Did the storage system return an error? A round of cross-system investigation would begin.

**The wrong approach**

The first idea was building a dedicated orchestrator service: a new project with its own deploy, its own database, its own CI/CD pipeline. A microservice to "orchestrate orders." This meant: (1) adding network latency between the orchestrator and each system, (2) duplicating business logic because the orchestrator needed to know too much about each system, (3) a new point of failure in the chain.

**The solution: orchestration in a service method**

Instead of a new service, I implemented orchestration inside the existing Application Service. The \`NotificarDespachoOrdenTrabajo\` method chains three sequential operations using decoupled interfaces:

\`\`\`csharp
public async Task<ResultadoNotificacion> NotificarDespachoOrdenTrabajoAsync(
    NotificarDespachoRequest request)
{
    // 1. Send email with PDFs via Infobip
    var emailResult = await _emailService.EnviarCorreoConAdjuntosAsync(
        request.ToEmail, request.Subject, request.HtmlContent,
        request.Adjuntos);

    if (!emailResult.Exitoso) return Fallo(emailResult.Error);

    // 2. Upload PDFs to Azure Blob Storage
    foreach (var adjunto in request.Adjuntos)
    {
        adjunto.Contenido.Position = 0; // reset stream position
        await _azureStorage.GuardarAsync(
            $"ordenes/{request.OrdenId}/{adjunto.Nombre}",
            adjunto.Contenido);
    }

    // 3. Mark order as sent in the central ERP
    var codigoEstado = await _erpEmpresarialService.MarcarEnvioFormatoAsync(
        request.OrdenId);

    return Exito(codigoEstado);
}
\`\`\`

Each integration is defined as its own interface:

\`\`\`csharp
public interface IEmailService
{
    Task<EmailResult> EnviarCorreoConAdjuntosAsync(
        string to, string subject, string html,
        List<AttachmentDto> attachments);
}

public interface IAzureStorageService
{
    Task GuardarAsync(string blobName, Stream content);
}

public interface ISistemaCentralService
{
    Task<int> MarcarEnvioFormatoAsync(int ordenId);
}
\`\`\`

The notification responsables are loaded dynamically from the central ERP API, rather than being hardcoded:

\`\`\`csharp
var responsables = await _erpEmpresarialApi.ObtenerResponsablesProcesoAsync(
    request.ProcesoId);
\`\`\`

Complete flow:

\`\`\`
UI Submit → [Sistema de Gestión]
                ↓
         [Infobip Email] → notify supplier with PDFs
                ↓
         [Azure Blob] → store documents
                ↓
         [Central ERP] → MarcarEnvioFormato
\`\`\`

**The impact**

Zero new services to deploy. Zero temporary files on disk (PDF streams are reset with Position = 0 instead of being saved). Full traceability because each step is logged with the same TransactionId from the email. If step 3 fails, step 2 can be rolled back. Interfaces allow mocking each integration for unit tests. The complete method is under forty lines.

**Lessons learned**

Orchestration doesn't require a dedicated microservice or a message queue. A well-designed Application Service method can chain cross-system operations without coupling the systems to each other. The key is interface boundaries, not physical service boundaries. Each system exposes an interface, the service method orchestrates them. PDFs in memory without temp files is a detail that seems minor but eliminates an entire category of bugs (orphan files, permissions, cleanup). And loading responsables dynamically from the API instead of hardcoding them means the business can change who receives each notification without touching a single line of code.`,relatedIds:[`comunicaciones-api-centralizada`]},{id:`inherited-oss-flutter-modernization`,slug:`heredar-proyecto-flutter-no-mantenido`,series:`OSS Maintenance`,title:`Lo que realmente heredas al hacer un fork de un proyecto Flutter "no mantenido"`,titleEn:`What you actually inherit when you fork an "unmaintained" Flutter project`,date:`2026-06-26`,tags:[`flutter`,`open-source`,`oss`,`maintenance`,`triage`,`build`,`deprecation`,`debugging`],category:`arquitectura`,featured:!0,excerpt:`Un repo "no mantenido" no significa "no compila". Significa: paquetes abandonados, flags de migrador olvidados, código que crashea en runtime con -1 fuera de rango, y cero herramientas de debugging. Cuando forké Harmony-Music en junio 2026, ese fue el estado real. Acá está la metodología de triage en 4 fases que usé para llevarlo de "no compila" a release v1.12.2.`,excerptEn:`An "unmaintained" repo does not mean "does not compile". It means: abandoned packages, forgotten migrator flags, code that crashes at runtime with -1 out of range, and zero debugging tools. When I forked Harmony-Music in June 2026, that was the real state. Here is the 4-phase triage methodology I used to take it from "does not compile" to release v1.12.2.`,content:'En diciembre 2025, el creador original de Harmony-Music (un app Flutter de música streaming para Android, Windows y Linux) marcó el repositorio como "no mantenido" y desapareció del mapa. En junio 2026 decidí hacer el fork y mantenerlo yo.\n\nLo que encontré no fue un proyecto listo para hacer feature work. Fue un proyecto con dependencias abandonadas, código que crasheaba en flujos básicos, y sin una sola pieza de observabilidad. La app seguía "funcionando" para quien la compilara en el ambiente exacto del autor original — pero ese ambiente dejó de existir.\n\n**El problema real de un proyecto "no mantenido"**\n\nEl README decía claramente: "This repository is no longer maintained". La primera lectura fue: "OK, no hay features nuevas, pero el código existente está sano". La segunda lectura (leyendo `pubspec.yaml`, `gradle.properties`, y `git log`) reveló otra cosa:\n\n1. `ionicons: ^0.2.2` en `pubspec.yaml` — paquete sin updates desde 2022, incompatible con la constraint `final class` de Dart 3.12. La app no compilaba.\n2. `android.builtInKotlin=false` y `android.newDsl=false` en `gradle.properties` — flags que el Flutter migrator agrega durante una migración, pero que deben removerse manualmente cuando la migración termina. El autor nunca los limpió.\n3. `TODO.md` con items como "Partially_completed" y "Housekeeping work" sin cerrar.\n4. Un bug latente en `home_screen_controller.dart`: `indexWhere` devolvía `-1` cuando no encontraba un elemento, y el código inmediatamente llamaba `removeAt(-1)` → `RangeError` → crash en cold start.\n5. Cero logging estructurado. Cero captura de respuestas API. Cuando algo fallaba en runtime, la única señal era un `print` en consola sin contexto.\n\n**El anti-patrón: empezar por los features**\n\nMi primer instinto fue agregar features nuevos. Resistir. Un feature sobre un build roto es deuda técnica disfrazada de progreso. Si no puedes compilar, no puedes testear. Si no puedes testear, no puedes saber si el feature nuevo funciona. Si el feature nuevo no funciona, agregas un bug encima de un proyecto que ya tiene bugs invisibles.\n\nLa decisión fue: cero features hasta tener build limpio, cero deprecaciones en analyzer, runtime sin crashes obvios, y herramientas mínimas de debugging.\n\n**La solución: triage en 4 fases**\n\nDividí el trabajo en 4 fases acopladas, con un commit por fase. Cada fase tiene un criterio de salida verificable.\n\n```\nFase 1: Build (compila + analyze limpio)\n    ↓\nFase 2: Deprecaciones (sin warnings de APIs próximas a removerse)\n    ↓\nFase 3: Runtime (sin crashes en flujos básicos)\n    ↓\nFase 4: Tooling (logging + response recorder + docs)\n```\n\n**Fase 1 — Build foundation**\n\nEl primer commit fue upgrade de Gradle 8.14, AGP 8.11.1, Kotlin 2.2.20, todos compatibles con Flutter 3.44+ que es el target. El segundo commit fue migración a Flutter built-in Kotlin (removí el plugin `kotlin-android` manual, moví la config a `kotlin { compilerOptions { jvmTarget = JvmTarget.JVM_17 } }`).\n\nCriterio de salida: `flutter analyze` devuelve 0 errores, `flutter build apk --debug` produce un APK funcional.\n\n**Fase 2 — Deprecation sweep**\n\n19 commits separados, uno por categoría. `withOpacity(x)` → `withValues(alpha: x)` (commit `2064daa`). `Color.value` → `toARGB32()` (commit `43bcead`). `ThemeData` getters → `colorScheme` (commit `097622f`). El más doloroso: reemplazar todos los usos de `Ionicons.foo` por `Icons.foo` de Material Icons (commit `4a7f2e0`).\n\n```dart\n// ANTES: package abandonado, no compatible con Dart 3.12\nIcon(Ionicons.logo_youtube)\n\n// DESPUÉS: Material Icons, mantenido por Flutter team\nIcon(Icons.smart_display)\n```\n\n`grep -r "Ionicons." lib/` devolvió 47 ocurrencias. La migración fue mecánica pero tediosa. Lo importante: un commit por categoría para que el reviewer (yo en 6 meses) pueda hacer rollback de una deprecación sin tocar las demás.\n\nCriterio de salida: `flutter analyze` devuelve 0 errores y 0 warnings.\n\n**Fase 3 — Runtime hardening**\n\nEl bug del `indexWhere` → `removeAt(-1)` (commit `d8d82d1`) fue el más visible. Pero encontré más: `firstWhere` sin `orElse`, casts sin checks, `null` en posiciones donde el código asumía no-null. Agregué guards en todos los puntos críticos.\n\n```dart\n// ANTES: indexWhere puede devolver -1\nquickPicksUpdate.value.contents.removeAt(quickPicksUpdate.value.contents\n    .indexWhere((e) => e.runtimeType.toString().contains("QuickPicksAlbum")));\n\n// DESPUÉS: guard explícito\nfinal idx = quickPicksUpdate.value.contents\n    .indexWhere((e) => e.runtimeType.toString().contains("QuickPicksAlbum"));\nif (idx != -1) quickPicksUpdate.value.contents.removeAt(idx);\n```\n\nCriterio de salida: cold start sin crashes, navegación básica sin errores en logs, búsqueda devuelve resultados correctos.\n\n**Fase 4 — Tooling y observabilidad**\n\nTres piezas nuevas:\n\n1. `debug_logger.dart` — logger estructurado con niveles (debug, info, warn, error) y colores ANSI para distinguir de un vistazo.\n2. `http_logger.dart` — Dio interceptor que loguea request/response con headers, body completo, y timing.\n3. `response_recorder.dart` — escribe cada respuesta cruda de InnerTube a disco en formato JSON, con un session ID. Para debuggear cambios de la API de YouTube offline.\n\nSin estas tres piezas, el fix de Fase 3 fue posible pero el próximo fix de InnerTube habría sido un juego de adivinanzas.\n\n**El impacto**\n\n```\n~36 commits en 3 días\nBuild limpio con Flutter 3.44+\n0 errores en flutter analyze\nApp release v1.12.2 con changelog\n```\n\nCada fase sumada a la anterior. Sin Fase 1, no podía verificar Fase 2. Sin Fase 2, no sabía si mis cambios rompían algo más. Sin Fase 3, los usuarios seguían viendo crashes. Sin Fase 4, el próximo bug sería invisible.\n\n**Lecciones aprendidas**\n\nUn fork de mantenimiento no es un proyecto personal. Es custodiar trabajo de otro. La metodología de triage en fases acopladas te da una baseline verificable antes de agregar valor nuevo. El "upgrade tax" (19 commits solo de deprecaciones) es real, pero hacerlo por categoría lo hace manejable. Y la herramienta más valiosa que construí no fue código nuevo: fue el ResponseRecorder, porque sin él no podía ver qué había cambiado.\n\nSi estás por hacer un fork de un proyecto "no mantenido", tu primera semana no debería tener features. Debería tener build limpio, analyzer limpio, runtime estable, y al menos un logger que te diga qué está pasando cuando algo falle. Después de eso, puedes pensar en features.',contentEn:'In December 2025, the original creator of Harmony-Music (a Flutter music streaming app for Android, Windows, and Linux) marked the repository as "unmaintained" and disappeared. In June 2026, I decided to fork it and maintain it myself.\n\nWhat I found was not a project ready for feature work. It was a project with abandoned dependencies, code that crashed on basic flows, and not a single piece of observability. The app "worked" for whoever compiled it in the original author\'s exact environment — but that environment no longer existed.\n\n**The real problem with an "unmaintained" project**\n\nThe README clearly said: "This repository is no longer maintained". The first reading was: "OK, no new features, but the existing code is healthy". The second reading (reading `pubspec.yaml`, `gradle.properties`, and `git log`) revealed something else:\n\n1. `ionicons: ^0.2.2` in `pubspec.yaml` — package with no updates since 2022, incompatible with Dart 3.12\'s `final class` constraint. The app did not compile.\n2. `android.builtInKotlin=false` and `android.newDsl=false` in `gradle.properties` — flags that the Flutter migrator adds during a migration, but must be removed manually when the migration completes. The author never cleaned them up.\n3. `TODO.md` with items like "Partially_completed" and "Housekeeping work" unchecked.\n4. A latent bug in `home_screen_controller.dart`: `indexWhere` returned `-1` when it did not find an element, and the code immediately called `removeAt(-1)` → `RangeError` → crash on cold start.\n5. Zero structured logging. Zero API response capture. When something failed at runtime, the only signal was a `print` in console without context.\n\n**The anti-pattern: starting with features**\n\nMy first instinct was to add new features. I resisted. A feature on a broken build is technical debt disguised as progress. If you cannot compile, you cannot test. If you cannot test, you cannot know if the new feature works. If the new feature does not work, you add a bug on top of a project that already has invisible bugs.\n\nThe decision was: zero features until there is a clean build, zero deprecations in the analyzer, runtime without obvious crashes, and minimum debugging tools.\n\n**The solution: 4-phase triage**\n\nI divided the work into 4 coupled phases, with one commit per phase. Each phase has a verifiable exit criterion.\n\n```\nPhase 1: Build (compiles + clean analyze)\n    ↓\nPhase 2: Deprecations (no warnings for soon-to-be-removed APIs)\n    ↓\nPhase 3: Runtime (no crashes in basic flows)\n    ↓\nPhase 4: Tooling (logging + response recorder + docs)\n```\n\n**Phase 1 — Build foundation**\n\nThe first commit was upgrading Gradle 8.14, AGP 8.11.1, Kotlin 2.2.20, all compatible with Flutter 3.44+ which is the target. The second commit was migration to Flutter built-in Kotlin (removed the manual `kotlin-android` plugin, moved config to `kotlin { compilerOptions { jvmTarget = JvmTarget.JVM_17 } }`).\n\nExit criterion: `flutter analyze` returns 0 errors, `flutter build apk --debug` produces a working APK.\n\n**Phase 2 — Deprecation sweep**\n\n19 separate commits, one per category. `withOpacity(x)` → `withValues(alpha: x)` (commit `2064daa`). `Color.value` → `toARGB32()` (commit `43bcead`). `ThemeData` getters → `colorScheme` (commit `097622f`). The most painful: replacing all `Ionicons.foo` usages with Material `Icons.foo` (commit `4a7f2e0`).\n\n```dart\n// BEFORE: abandoned package, incompatible with Dart 3.12\nIcon(Ionicons.logo_youtube)\n\n// AFTER: Material Icons, maintained by Flutter team\nIcon(Icons.smart_display)\n```\n\n`grep -r "Ionicons." lib/` returned 47 matches. The migration was mechanical but tedious. The important thing: one commit per category so the reviewer (me in 6 months) can roll back one deprecation without touching the rest.\n\nExit criterion: `flutter analyze` returns 0 errors and 0 warnings.\n\n**Phase 3 — Runtime hardening**\n\nThe `indexWhere` → `removeAt(-1)` bug (commit `d8d82d1`) was the most visible. But I found more: `firstWhere` without `orElse`, casts without checks, `null` in positions where the code assumed not-null. I added guards at all critical points.\n\n```dart\n// BEFORE: indexWhere can return -1\nquickPicksUpdate.value.contents.removeAt(quickPicksUpdate.value.contents\n    .indexWhere((e) => e.runtimeType.toString().contains("QuickPicksAlbum")));\n\n// AFTER: explicit guard\nfinal idx = quickPicksUpdate.value.contents\n    .indexWhere((e) => e.runtimeType.toString().contains("QuickPicksAlbum"));\nif (idx != -1) quickPicksUpdate.value.contents.removeAt(idx);\n```\n\nExit criterion: cold start without crashes, basic navigation without errors in logs, search returns correct results.\n\n**Phase 4 — Tooling and observability**\n\nThree new pieces:\n\n1. `debug_logger.dart` — structured logger with levels (debug, info, warn, error) and ANSI colors to distinguish at a glance.\n2. `http_logger.dart` — Dio interceptor that logs request/response with headers, full body, and timing.\n3. `response_recorder.dart` — writes every raw InnerTube response to disk in JSON format, with a session ID. For debugging YouTube API changes offline.\n\nWithout these three pieces, the Phase 3 fix was possible but the next InnerTube fix would have been a guessing game.\n\n**The impact**\n\n```\n~36 commits in 3 days\nClean build with Flutter 3.44+\n0 errors in flutter analyze\nRelease v1.12.2 with changelog\n```\n\nEach phase added to the previous one. Without Phase 1, I could not verify Phase 2. Without Phase 2, I did not know if my changes were breaking something else. Without Phase 3, users were still seeing crashes. Without Phase 4, the next bug would be invisible.\n\n**Lessons learned**\n\nA maintenance fork is not a personal project. It is custodianship of someone else\'s work. The coupled-phase triage methodology gives you a verifiable baseline before adding new value. The "upgrade tax" (19 commits of just deprecations) is real, but doing it by category makes it manageable. And the most valuable tool I built was not new code: it was the ResponseRecorder, because without it I could not see what had changed.\n\nIf you are about to fork an "unmaintained" project, your first week should not have features. It should have a clean build, clean analyzer, stable runtime, and at least one logger that tells you what is happening when something fails. After that, you can think about features.',relatedIds:[`flutter-cross-platform-audio-architecture`,`flutter-build-modernization-upgrade-mountain`,`youtube-innertube-api-resilience`]},{id:`flutter-cross-platform-audio-architecture`,slug:`audio-multiplataforma-flutter-arquitectura`,series:`OSS Maintenance`,title:`Audio multiplataforma en Flutter: dos engines, una API, tres plataformas`,titleEn:`Cross-platform audio in Flutter: two engines, one API, three platforms`,date:`2026-06-26`,tags:[`flutter`,`audio`,`just_audio`,`media_kit`,`audio_service`,`android`,`windows`,`linux`,`architecture`],category:`arquitectura`,featured:!0,excerpt:`No existe un solo engine de audio en Flutter que cubra Android, Windows y Linux con la misma calidad. La solución no es elegir uno: es componer. just_audio como API unificada, media_kit como backend en desktop, audio_service para lifecycle y notificación, SMTC para media keys en Windows. Acá está la arquitectura real, los offsets platform-specific, y los bugs que solo aparecen en desktop.`,excerptEn:`There is no single Flutter audio engine that covers Android, Windows, and Linux with the same quality. The solution is not to choose one: it is to compose. just_audio as the unified API, media_kit as the desktop backend, audio_service for lifecycle and notification, SMTC for media keys on Windows. Here is the real architecture, the platform-specific offsets, and the bugs that only appear on desktop.`,content:`Cuando empecé a mantener Harmony-Music (app Flutter de música streaming para Android, Windows y Linux), pensé que elegir un engine de audio era una decisión única. Después de tres releases y dos meses de testing en las tres plataformas, entendí: no existe un solo engine que cubra bien los tres. La única forma es componer.

**El problema de los engines únicos**

Tres candidatos obvios para Flutter:

- \`just_audio\`: excelente en Android (usa ExoPlayer nativo), funcional en desktop pero sin codecs avanzados, sin gapless, sin soporte robusto para HiFi.
- \`media_kit\`: excelente en desktop (mpv/libmpv), pero sin integración nativa con \`AudioService\`, sin Android Auto, sin lockscreen.
- \`audioplayers\`: simple pero limitado. No apto para streaming real.

El primer intento del autor original fue \`just_audio\` solo. Funcionaba en Android. En Windows la app reproducía pero sin integración con media keys del teclado. En Linux dependía de PulseAudio con resultados inconsistentes. El gap entre "reproduce audio" y "experiencia de música real multiplataforma" era enorme.

**La solución: composición de engines bajo una API única**

La arquitectura real tiene 4 capas, cada una resolviendo un problema específico:

\`\`\`
┌─────────────────────────────────────────────┐
│  UI (GetX controllers / widgets)            │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│  MyAudioHandler extends BaseAudioHandler    │  ← API única
│  (audio_service)                            │
└────┬─────────────────┬─────────────────┬─────┘
     │                 │                 │
┌────▼──────┐  ┌──────▼──────┐  ┌──────▼──────┐
│ just_audio│  │ just_audio  │  │    SMTC     │
│  (Dart)   │  │_media_kit   │  │  (Windows)  │
└────┬──────┘  └──────┬──────┘  └─────────────┘
     │                │
┌────▼──────┐  ┌──────▼──────┐
│ ExoPlayer │  │  media_kit  │
│ (Android) │  │ (Windows/   │
│           │  │  Linux)     │
└───────────┘  └─────────────┘
\`\`\`

\`audio_service\` provee la API Dart única (\`BaseAudioHandler\`) que toda la UI consume. Es owner del notification, lockscreen, Android Auto, y lifecycle en background. Los engines se enchufan debajo.

**Capa 1: audio_service como outer wrapper**

\`audio_service\` no es un engine de audio. Es un wrapper que maneja:

- Foreground service en Android (requerido para reproducir en background)
- Notification con controles (play/pause/skip)
- Lockscreen controls
- Android Auto browsing
- Bluetooth media keys
- MediaSession para integración con OS

La UI nunca toca \`just_audio\` directamente. Solo llama \`audioHandler.play()\`, \`audioHandler.pause()\`, \`audioHandler.skipToNext()\`. \`audio_service\` se encarga de propagar al engine subyacente.

**Capa 2: just_audio como Dart API unificada**

\`just_audio\` provee \`AudioPlayer\` con una API consistente. En Android usa ExoPlayer. En desktop, el paquete \`just_audio_media_kit\` (un bridge) traduce las llamadas de \`just_audio\` al backend \`media_kit\`.

\`\`\`dart
class MyAudioHandler extends BaseAudioHandler {
  final AudioPlayer _player = AudioPlayer();

  MyAudioHandler() {
    if (GetPlatform.isWindows || GetPlatform.isLinux) {
      JustAudioMediaKit.title = 'Harmony Music';
      JustAudioMediaKit.protocolWhitelist = const ['http', 'https', 'file'];
    }
    _player = AudioPlayer(
      audioLoadConfiguration: const AudioLoadConfiguration(
        androidLoadControl: AndroidLoadControl(
          minBufferDuration: Duration(seconds: 50),
          maxBufferDuration: Duration(seconds: 120),
          bufferForPlaybackDuration: Duration(milliseconds: 50),
          bufferForPlaybackAfterRebufferDuration: Duration(seconds: 2),
        ),
      ),
    );
  }
}
\`\`\`

Los parámetros de \`AndroidLoadControl\` importan para streaming: 50 segundos de buffer mínimo evitan stutter en redes lentas, 120 segundos de máximo evitan consumir RAM innecesariamente. Estos números los tuneé testeando con WiFi inestable y 4G.

**Capa 3: media_kit como backend de desktop**

En Windows y Linux, \`just_audio_media_kit\` traduce la API de \`just_audio\` a llamadas nativas de \`media_kit\`, que usa \`mpv\` (Windows) o \`libmpv\` (Linux). Esto da acceso a codecs avanzados (FLAC, Opus), gapless playback, y mejor manejo de redes lentas en desktop.

El trade-off: \`media_kit\` reporta \`duration\` de manera ligeramente diferente a ExoPlayer. En testing encontré que las últimas 2-3 segundos de una canción se cortaban en auto-advance a la siguiente. La solución fue un offset platform-specific:

\`\`\`dart
final playerDurationOffset = GetPlatform.isWindows
    ? 200  // ms
    : GetPlatform.isLinux
        ? 700  // ms
        : 0;  // Android (ExoPlayer) no necesita offset

// Usar el offset al calcular "tiempo restante" o auto-avanzar
final adjustedRemaining = actualRemaining - playerDurationOffset;
\`\`\`

Estos offsets son empíricos. No hay documentación oficial que diga "media_kit reporta duration con 200-700ms de delay". Los encontré testeando edge cases con 20+ canciones.

**Capa 4: SMTC para Windows media keys**

Windows tiene su propio sistema de media controls (System Media Transport Controls) separado de Android Auto / MPRIS. El paquete \`smtc_windows\` lo expone. Hay que integrarlo a mano con \`audio_service\` porque \`audio_service\` no tiene soporte nativo para SMTC.

\`\`\`dart
if (GetPlatform.isWindows) {
  final smtc = SMTCWindows.instance;
  smtc.enable();
  smtc.onButtonPressed.listen((button) {
    switch (button) {
      case SMTCWindowsButton.play:  _player.play();  break;
      case SMTCWindowsButton.pause: _player.pause(); break;
      case SMTCWindowsButton.next:  skipToNext();    break;
      case SMTCWindowsButton.prev:  skipToPrevious(); break;
    }
  });
}
\`\`\`

Sin esto, las teclas multimedia del teclado (las que tienen ícono de play/pause) no funcionaban en Windows. Funcionalidad básica esperada por cualquier usuario.

**El impacto**

La arquitectura final permite:

- Misma UI Flutter funcionando en 3 plataformas con misma API
- Android con ExoPlayer + audio_service + Android Auto + lockscreen
- Windows con mpv + audio_service + SMTC + media keys
- Linux con libmpv + audio_service (MPRIS cuando esté disponible)
- Background playback, lockscreen, y Android Auto funcionan en Android sin código platform-specific en UI

El precio: 4 capas de abstracción, debugging más complejo cuando algo falla (¿es \`audio_service\`? ¿es \`just_audio\`? ¿es \`media_kit\`?), y offsets platform-specific que necesitan testing empírico en cada release.

**Lecciones aprendidas**

La composición es la única forma seria de hacer audio cross-platform en Flutter. No existe el engine mágico que cubra todo. La clave es mantener \`BaseAudioHandler\` como único punto de contacto para la UI, y poner toda la complejidad platform-specific debajo de esa frontera. Los offsets de duration que encontré no están en ninguna doc — solo en el código de testing que escribí y nunca publiqué. Y la separación entre \`audio_service\` (lifecycle/OS integration) y \`just_audio\` (audio engine) es lo que hace que la arquitectura escale: si mañana sale un engine mejor que ExoPlayer, reemplazo \`just_audio\` sin tocar UI.

Si vas a hacer audio cross-platform, asumí que vas a componer. Y empieza con testing de edge cases de duration en desktop antes de pensar que "ya funciona en Android, listo".`,contentEn:`When I started maintaining Harmony-Music (a Flutter music streaming app for Android, Windows, and Linux), I thought choosing one audio engine was a one-time decision. After three releases and two months of testing on all three platforms, I understood: there is no single engine that covers all three well. The only way is to compose.

**The single-engine problem**

Three obvious candidates for Flutter:

- \`just_audio\`: excellent on Android (uses native ExoPlayer), functional on desktop but without advanced codecs, gapless, or robust HiFi support.
- \`media_kit\`: excellent on desktop (mpv/libmpv), but without native \`AudioService\` integration, Android Auto, or lockscreen.
- \`audioplayers\`: simple but limited. Not suitable for real streaming.

The original author's first attempt was \`just_audio\` alone. It worked on Android. On Windows the app played but without integration with keyboard media keys. On Linux it depended on PulseAudio with inconsistent results. The gap between "plays audio" and "real cross-platform music experience" was huge.

**The solution: engine composition under a single API**

The real architecture has 4 layers, each solving a specific problem:

\`\`\`
┌─────────────────────────────────────────────┐
│  UI (GetX controllers / widgets)            │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│  MyAudioHandler extends BaseAudioHandler    │  ← single API
│  (audio_service)                            │
└────┬─────────────────┬─────────────────┬─────┘
     │                 │                 │
┌────▼──────┐  ┌──────▼──────┐  ┌──────▼──────┐
│ just_audio│  │ just_audio  │  │    SMTC     │
│  (Dart)   │  │_media_kit   │  │  (Windows)  │
└────┬──────┘  └──────┬──────┘  └─────────────┘
     │                │
┌────▼──────┐  ┌──────▼──────┐
│ ExoPlayer │  │  media_kit  │
│ (Android) │  │ (Windows/   │
│           │  │  Linux)     │
└───────────┘  └─────────────┘
\`\`\`

\`audio_service\` provides the single Dart API (\`BaseAudioHandler\`) that the entire UI consumes. It owns the notification, lockscreen, Android Auto, and background lifecycle. The engines plug in underneath.

**Layer 1: audio_service as outer wrapper**

\`audio_service\` is not an audio engine. It is a wrapper that handles:

- Foreground service on Android (required for background playback)
- Notification with controls (play/pause/skip)
- Lockscreen controls
- Android Auto browsing
- Bluetooth media keys
- MediaSession for OS integration

The UI never touches \`just_audio\` directly. It only calls \`audioHandler.play()\`, \`audioHandler.pause()\`, \`audioHandler.skipToNext()\`. \`audio_service\` propagates to the underlying engine.

**Layer 2: just_audio as unified Dart API**

\`just_audio\` provides \`AudioPlayer\` with a consistent API. On Android it uses ExoPlayer. On desktop, the \`just_audio_media_kit\` package (a bridge) translates \`just_audio\` calls to the \`media_kit\` backend.

\`\`\`dart
class MyAudioHandler extends BaseAudioHandler {
  final AudioPlayer _player = AudioPlayer();

  MyAudioHandler() {
    if (GetPlatform.isWindows || GetPlatform.isLinux) {
      JustAudioMediaKit.title = 'Harmony Music';
      JustAudioMediaKit.protocolWhitelist = const ['http', 'https', 'file'];
    }
    _player = AudioPlayer(
      audioLoadConfiguration: const AudioLoadConfiguration(
        androidLoadControl: AndroidLoadControl(
          minBufferDuration: Duration(seconds: 50),
          maxBufferDuration: Duration(seconds: 120),
          bufferForPlaybackDuration: Duration(milliseconds: 50),
          bufferForPlaybackAfterRebufferDuration: Duration(seconds: 2),
        ),
      ),
    );
  }
}
\`\`\`

The \`AndroidLoadControl\` parameters matter for streaming: 50 seconds of minimum buffer prevent stutter on slow networks, 120 seconds of maximum prevent unnecessary RAM consumption. I tuned these numbers by testing with unstable WiFi and 4G.

**Layer 3: media_kit as desktop backend**

On Windows and Linux, \`just_audio_media_kit\` translates the \`just_audio\` API to native \`media_kit\` calls, which use \`mpv\` (Windows) or \`libmpv\` (Linux). This gives access to advanced codecs (FLAC, Opus), gapless playback, and better slow-network handling on desktop.

The trade-off: \`media_kit\` reports \`duration\` slightly differently from ExoPlayer. In testing I found that the last 2-3 seconds of a song were cut off during auto-advance to the next. The solution was a platform-specific offset:

\`\`\`dart
final playerDurationOffset = GetPlatform.isWindows
    ? 200  // ms
    : GetPlatform.isLinux
        ? 700  // ms
        : 0;  // Android (ExoPlayer) needs no offset

// Use the offset when calculating "time remaining" or auto-advance
final adjustedRemaining = actualRemaining - playerDurationOffset;
\`\`\`

These offsets are empirical. There is no official documentation saying "media_kit reports duration with 200-700ms delay". I found them by testing edge cases with 20+ songs.

**Layer 4: SMTC for Windows media keys**

Windows has its own media controls system (System Media Transport Controls) separate from Android Auto / MPRIS. The \`smtc_windows\` package exposes it. You have to integrate it manually with \`audio_service\` because \`audio_service\` has no native SMTC support.

\`\`\`dart
if (GetPlatform.isWindows) {
  final smtc = SMTCWindows.instance;
  smtc.enable();
  smtc.onButtonPressed.listen((button) {
    switch (button) {
      case SMTCWindowsButton.play:  _player.play();  break;
      case SMTCWindowsButton.pause: _player.pause(); break;
      case SMTCWindowsButton.next:  skipToNext();    break;
      case SMTCWindowsButton.prev:  skipToPrevious(); break;
    }
  });
}
\`\`\`

Without this, the multimedia keys on the keyboard (the ones with play/pause icon) did not work on Windows. Basic functionality expected by any user.

**The impact**

The final architecture allows:

- Same Flutter UI working on 3 platforms with the same API
- Android with ExoPlayer + audio_service + Android Auto + lockscreen
- Windows with mpv + audio_service + SMTC + media keys
- Linux with libmpv + audio_service (MPRIS when available)
- Background playback, lockscreen, and Android Auto work on Android with no platform-specific UI code

The cost: 4 abstraction layers, more complex debugging when something fails (is it \`audio_service\`? \`just_audio\`? \`media_kit\`?), and platform-specific offsets that need empirical testing on each release.

**Lessons learned**

Composition is the only serious way to do cross-platform audio in Flutter. There is no magic engine that covers everything. The key is to keep \`BaseAudioHandler\` as the only contact point for the UI, and put all platform-specific complexity below that boundary. The duration offsets I found are not in any docs — only in the testing code I wrote and never published. And the separation between \`audio_service\` (lifecycle/OS integration) and \`just_audio\` (audio engine) is what makes the architecture scale: if a better engine than ExoPlayer comes out tomorrow, I replace \`just_audio\` without touching the UI.

If you are going to do cross-platform audio, assume you will compose. And start with desktop duration edge case testing before thinking "it works on Android, done".`,relatedIds:[`inherited-oss-flutter-modernization`,`android-14-background-audio-modernization`,`youtube-innertube-api-resilience`]},{id:`youtube-innertube-api-resilience`,slug:`youtube-innertube-api-resiliencia`,series:`OSS Maintenance`,title:`Cuando tu app depende de una API que no controlas: reverse-engineering YouTube Music`,titleEn:`When your app depends on an API you don't control: reverse-engineering YouTube Music`,date:`2026-06-26`,tags:[`flutter`,`youtube`,`innertube`,`api-resilience`,`debugging`,`logging`,`resilience`],category:`arquitectura`,featured:!1,excerpt:`Harmony-Music no usa la API oficial de YouTube. Usa InnerTube, la API interna que YouTube Music expone a su propia web app, reverse-engineered desde hace años. Cuando YouTube cambia el formato de respuesta (sin changelog, sin docs, sin warning), 24 de 25 resultados de búsqueda caen en buckets huérfanos. Acá está la historia de reescribir el bucketing, clasificar por pageType, y construir un ResponseRecorder para diff offline.`,excerptEn:`Harmony-Music does not use the official YouTube API. It uses InnerTube, the internal API that YouTube Music exposes to its own web app, reverse-engineered for years. When YouTube changes the response format (no changelog, no docs, no warning), 24 of 25 search results fall into orphan buckets. Here is the story of rewriting the bucketing, classifying by pageType, and building a ResponseRecorder for offline diff.`,content:`La decisión más controversial de Harmony-Music es que no usa la YouTube Data API oficial. No usa OAuth, no tiene quota, no respeta ninguna TOS. Usa InnerTube: la API interna que YouTube Music expone a su propia web app, documentada a fuerza bruta por la comunidad durante años.

Es frágil por diseño. Pero es lo que permite que la app funcione sin login, sin API key del usuario, y sin pagar.

**El problema: una API que cambia sin avisar**

InnerTube no tiene versión. No tiene changelog. No tiene deprecation policy. YouTube puede cambiar el shape de cualquier respuesta un martes a las 3am, y tu app se entera cuando un usuario reporta "la búsqueda no muestra nada".

El caso concreto: a fines de mayo 2026, YouTube Music cambió el formato de respuesta de búsqueda. La estructura anterior era "shelves" (secciones con título como "Songs", "Albums", "Artists"):

\`\`\`json
{
  "contents": {
    "tabRenderer": {
      "content": {
        "sectionListRenderer": {
          "contents": [
            { "shelfRenderer": { "title": "Songs", ... } },
            { "shelfRenderer": { "title": "Albums", ... } },
            { "shelfRenderer": { "title": "Artists", ... } }
          ]
        }
      }
    }
  }
}
\`\`\`

El nuevo formato es "flat items" — una lista plana donde cada elemento puede ser un \`musicCardShelfRenderer\` (canción), un \`itemSectionRenderer\` (álbum), un \`musicResponsiveListItemRenderer\` (artista), o un wrapper. Sin títulos de sección. Sin grouping.

\`\`\`json
{
  "contents": {
    "tabRenderer": {
      "content": {
        "sectionListRenderer": {
          "contents": [
            { "musicCardShelfRenderer": { ... } },
            { "itemSectionRenderer": { ... } },
            { "musicResponsiveListItemRenderer": { ... } },
            { "musicCardShelfRenderer": { ... } }
          ]
        }
      }
    }
  }
}
\`\`\`

El código viejo esperaba shelves con título. Cuando llegó el formato nuevo, solo 1 de 25 resultados matcheaba el patrón esperado. Los otros 24 caían en un bucket genérico \`_orphan_*\` y la UI mostraba una pantalla casi vacía.

**El anti-patrón: parsear por posición o por título**

El código original tenía algo así:

\`\`\`dart
// FRÁGIL: depende de títulos que YouTube puede cambiar o eliminar
if (shelf.title == "Songs") {
  songs.addAll(shelf.items);
} else if (shelf.title == "Albums") {
  albums.addAll(shelf.items);
} else if (shelf.title == "Artists") {
  artists.addAll(shelf.items);
}
\`\`\`

Esto es frágil por diseño. Depende de:

1. Que YouTube mantenga títulos en inglés
2. Que YouTube mantenga exactamente esos strings
3. Que YouTube mantenga la estructura de shelves
4. Que YouTube no traduzca los títulos

Cualquiera de los 4 cambios rompe el código.

**La solución: clasificación por pageType + ResponseRecorder**

Dos cambios. Uno táctico, otro estratégico.

**Cambio táctico: reescribir bucketing por pageType**

YouTube incluye en cada item un campo \`pageType\` que es un signal estable del TIPO de contenido:

- \`MUSIC_PAGE_TYPE_ALBUM\` → álbum
- \`MUSIC_PAGE_TYPE_ARTIST\` → artista
- \`MUSIC_PAGE_TYPE_PLAYLIST\` → playlist
- canciones: detectables por \`musicResponsiveListItemRenderer\` con \`overlay.musicItemThumbnailOverlayRenderer\`

Reescribí el bucketing para iterar la lista plana y clasificar por \`pageType\` en lugar de por posición de shelf:

\`\`\`dart
void bucketSearchResults(List<dynamic> flatItems) {
  for (final item in flatItems) {
    final pageType = extractPageType(item);
    switch (pageType) {
      case 'MUSIC_PAGE_TYPE_ALBUM':
        albums.add(parseAlbum(item));
        if (albums.length >= 10) break;  // cap por bucket
      case 'MUSIC_PAGE_TYPE_ARTIST':
        artists.add(parseArtist(item));
        if (artists.length >= 10) break;
      case 'MUSIC_PAGE_TYPE_PLAYLIST':
        playlists.add(parsePlaylist(item));
        if (playlists.length >= 10) break;
      default:
        // intentar detectar canciones por shape
        if (looksLikeSong(item)) songs.add(parseSong(item));
    }
  }
}
\`\`\`

El cap de 10 por bucket es deliberado: evita que un solo tipo sature la UI, y limita el costo de parseo si YouTube duplica items.

**Cambio estratégico: ResponseRecorder para diff offline**

El fix táctico resolvió el problema inmediato. Pero sin observabilidad, el próximo cambio de InnerTube me iba a agarrar igual. Construí un \`ResponseRecorder\` que escribe cada respuesta cruda a disco:

\`\`\`dart
class ResponseRecorder {
  final String sessionId;
  final Directory sessionDir;

  void recordResponse(String endpoint, String requestBody, String responseBody) {
    final timestamp = DateTime.now().millisecondsSinceEpoch;
    final file = File('\${sessionDir.path}/\${timestamp}_\${endpoint.replaceAll("/", "_")}.json');
    file.writeAsStringSync(jsonEncode({
      'endpoint': endpoint,
      'request': requestBody,
      'response': responseBody,
      'timestamp': timestamp,
    }));
  }
}
\`\`\`

El recorder se integra como Dio interceptor. Cada request a \`music.youtube.com/youtubei/v1/*\` queda persistido. Cuando un usuario reporta "la búsqueda no anda", puedo pedirle que me envíe su carpeta de recordings, hacer diff contra una sesión que sí funcionaba, y ver exactamente qué cambió.

\`\`\`
session_2026-05-28_works/
  ├── 170000_search.json  ← shape viejo
  └── 170100_album.json

session_2026-06-15_broken/
  ├── 180000_search.json  ← shape nuevo
  └── 180100_album.json

diff:
  search.json → "sectionListRenderer.contents" ahora es flat
                sin "shelfRenderer" en absoluto
                "musicCardShelfRenderer" reemplaza a "shelfRenderer"
\`\`\`

Este recorder fue la pieza que me hizo darme cuenta de la magnitud del cambio. Sin él, habría leído logs con payloads truncados de 200 caracteres y adivinado.

**El impacto**

Antes: 1 de 25 resultados visibles, pantalla casi vacía, sin idea de qué había cambiado.

Después:

- 100% de resultados bucketed correctamente (con cap de 10 por categoría)
- Cambio de shape visible en diff de recordings
- Tiempo de diagnóstico: de "días" a "minutos" (abrir carpeta, diff, ver cambio)
- Recorder permite debuggear sin pedirle al usuario que instale debug builds

**Lecciones aprendidas**

Cuando tu app depende de una API que no controlas, los "fixes" sin observabilidad son temporales. Sí, clasificar por \`pageType\` resolvió el problema inmediato. Pero la inversión que más rindió fue el ResponseRecorder: me dio la capacidad de ver el cambio, no solo de reaccionar a él. Si vas a integrar con una API no documentada (InnerTube, scraping de cualquier web grande, etc.), construí el recorder ANTES del primer fix. La primera vez que InnerTube cambie de nuevo, te va a ahorrar horas.

Y la regla que aplica: nunca parsees por posición o por string de UI (títulos, labels). Siempre por un signal estable del schema (\`pageType\`, \`type\`, enums del backend). Los strings visibles son la primera cosa que cambia cuando alguien i18n el sistema o hace un rename cosmético.`,contentEn:`The most controversial decision in Harmony-Music is that it does not use the official YouTube Data API. No OAuth, no quota, no TOS compliance. It uses InnerTube: the internal API that YouTube Music exposes to its own web app, reverse-engineered by the community for years.

It is fragile by design. But it is what allows the app to work without login, without user API keys, and without payment.

**The problem: an API that changes without warning**

InnerTube has no version. No changelog. No deprecation policy. YouTube can change the shape of any response on a Tuesday at 3am, and your app finds out when a user reports "search shows nothing".

The concrete case: in late May 2026, YouTube Music changed the search response format. The previous structure was "shelves" (sections with title like "Songs", "Albums", "Artists"):

\`\`\`json
{
  "contents": {
    "tabRenderer": {
      "content": {
        "sectionListRenderer": {
          "contents": [
            { "shelfRenderer": { "title": "Songs", ... } },
            { "shelfRenderer": { "title": "Albums", ... } },
            { "shelfRenderer": { "title": "Artists", ... } }
          ]
        }
      }
    }
  }
}
\`\`\`

The new format is "flat items" — a flat list where each element can be a \`musicCardShelfRenderer\` (song), an \`itemSectionRenderer\` (album), a \`musicResponsiveListItemRenderer\` (artist), or a wrapper. No section titles. No grouping.

\`\`\`json
{
  "contents": {
    "tabRenderer": {
      "content": {
        "sectionListRenderer": {
          "contents": [
            { "musicCardShelfRenderer": { ... } },
            { "itemSectionRenderer": { ... } },
            { "musicResponsiveListItemRenderer": { ... } },
            { "musicCardShelfRenderer": { ... } }
          ]
        }
      }
    }
  }
}
\`\`\`

The old code expected shelves with title. When the new format arrived, only 1 of 25 results matched the expected pattern. The other 24 fell into a generic \`_orphan_*\` bucket and the UI showed an almost empty screen.

**The anti-pattern: parsing by position or title**

The original code had something like this:

\`\`\`dart
// FRAGILE: depends on titles YouTube can change or remove
if (shelf.title == "Songs") {
  songs.addAll(shelf.items);
} else if (shelf.title == "Albums") {
  albums.addAll(shelf.items);
} else if (shelf.title == "Artists") {
  artists.addAll(shelf.items);
}
\`\`\`

This is fragile by design. It depends on:

1. YouTube keeping titles in English
2. YouTube keeping exactly those strings
3. YouTube keeping the shelves structure
4. YouTube not translating the titles

Any of the 4 changes breaks the code.

**The solution: pageType classification + ResponseRecorder**

Two changes. One tactical, one strategic.

**Tactical change: rewrite bucketing by pageType**

YouTube includes a \`pageType\` field in each item that is a stable signal of the TYPE of content:

- \`MUSIC_PAGE_TYPE_ALBUM\` → album
- \`MUSIC_PAGE_TYPE_ARTIST\` → artist
- \`MUSIC_PAGE_TYPE_PLAYLIST\` → playlist
- songs: detectable by \`musicResponsiveListItemRenderer\` with \`overlay.musicItemThumbnailOverlayRenderer\`

I rewrote the bucketing to iterate the flat list and classify by \`pageType\` instead of by shelf position:

\`\`\`dart
void bucketSearchResults(List<dynamic> flatItems) {
  for (final item in flatItems) {
    final pageType = extractPageType(item);
    switch (pageType) {
      case 'MUSIC_PAGE_TYPE_ALBUM':
        albums.add(parseAlbum(item));
        if (albums.length >= 10) break;  // cap per bucket
      case 'MUSIC_PAGE_TYPE_ARTIST':
        artists.add(parseArtist(item));
        if (artists.length >= 10) break;
      case 'MUSIC_PAGE_TYPE_PLAYLIST':
        playlists.add(parsePlaylist(item));
        if (playlists.length >= 10) break;
      default:
        // try to detect songs by shape
        if (looksLikeSong(item)) songs.add(parseSong(item));
    }
  }
}
\`\`\`

The cap of 10 per bucket is deliberate: it prevents a single type from saturating the UI, and limits parsing cost if YouTube duplicates items.

**Strategic change: ResponseRecorder for offline diff**

The tactical fix solved the immediate problem. But without observability, the next InnerTube change would have caught me the same way. I built a \`ResponseRecorder\` that writes every raw response to disk:

\`\`\`dart
class ResponseRecorder {
  final String sessionId;
  final Directory sessionDir;

  void recordResponse(String endpoint, String requestBody, String responseBody) {
    final timestamp = DateTime.now().millisecondsSinceEpoch;
    final file = File('\${sessionDir.path}/\${timestamp}_\${endpoint.replaceAll("/", "_")}.json');
    file.writeAsStringSync(jsonEncode({
      'endpoint': endpoint,
      'request': requestBody,
      'response': responseBody,
      'timestamp': timestamp,
    }));
  }
}
\`\`\`

The recorder integrates as a Dio interceptor. Every request to \`music.youtube.com/youtubei/v1/*\` gets persisted. When a user reports "search is broken", I can ask them to send me their recordings folder, diff it against a working session, and see exactly what changed.

\`\`\`
session_2026-05-28_works/
  ├── 170000_search.json  ← old shape
  └── 170100_album.json

session_2026-06-15_broken/
  ├── 180000_search.json  ← new shape
  └── 180100_album.json

diff:
  search.json → "sectionListRenderer.contents" is now flat
                no "shelfRenderer" at all
                "musicCardShelfRenderer" replaces "shelfRenderer"
\`\`\`

This recorder was the piece that made me realize the magnitude of the change. Without it, I would have read logs with 200-character truncated payloads and guessed.

**The impact**

Before: 1 of 25 visible results, almost empty screen, no idea what had changed.

After:

- 100% of results bucketed correctly (with cap of 10 per category)
- Shape changes visible in recordings diff
- Diagnosis time: from "days" to "minutes" (open folder, diff, see change)
- Recorder enables debugging without asking the user to install debug builds

**Lessons learned**

When your app depends on an API you do not control, "fixes" without observability are temporary. Yes, classifying by \`pageType\` solved the immediate problem. But the best-returning investment was the ResponseRecorder: it gave me the ability to SEE the change, not just react to it. If you are going to integrate with an undocumented API (InnerTube, scraping any large web, etc.), build the recorder BEFORE the first fix. The first time InnerTube changes again, it will save you hours.

And the rule that applies: never parse by position or by UI string (titles, labels). Always by a stable schema signal (\`pageType\`, \`type\`, backend enums). Visible strings are the first thing that changes when someone i18n's the system or makes a cosmetic rename.`,relatedIds:[`inherited-oss-flutter-modernization`,`flutter-cross-platform-audio-architecture`]},{id:`flutter-build-modernization-upgrade-mountain`,slug:`modernizacion-build-flutter-upgrade`,series:`OSS Maintenance`,title:`El precio de la modernización: actualizar un proyecto Flutter abandonado a Flutter 3.5+`,titleEn:`The upgrade tax: modernizing an abandoned Flutter project to Flutter 3.5+`,date:`2026-06-26`,tags:[`flutter`,`gradle`,`agp`,`kotlin`,`deprecation`,`modernization`,`build`,`migrator`],category:`arquitectura`,featured:!1,excerpt:`Actualizar un proyecto Flutter que estuvo 6 meses sin mantenimiento no es un bump de versión. Es una cadena acoplada: SDK de Flutter, AGP, Gradle, Kotlin, plugins, deprecaciones de Dart, deprecaciones de Material, paquetes abandonados. Cuando forké Harmony-Music, el "upgrade tax" fue 19 commits separados. Acá está el orden correcto, los commits que rompieron todo, y la métrica que nadie te dice sobre migrar.`,excerptEn:`Upgrading a Flutter project that sat for 6 months without maintenance is not a version bump. It is a coupled chain: Flutter SDK, AGP, Gradle, Kotlin, plugins, Dart deprecations, Material deprecations, abandoned packages. When I forked Harmony-Music, the "upgrade tax" was 19 separate commits. Here is the correct order, the commits that broke everything, and the metric nobody tells you about migrating.`,content:`Cuando forké Harmony-Music, mi instinto fue: \`flutter upgrade\`, leerme los breaking changes, listo. Lo que pasó fue un mes de trabajo en cadena donde cada bump rompía algo que dependía del bump anterior. La lección: actualizar un Flutter project no es un commit, es una cascada.

**El problema: nada está solo**

Flutter no es un framework monolítico. Es una pirámide donde cada capa depende de la de abajo:

\`\`\`
                  Dart 3.12+ constraints
                        ↓
                 Flutter SDK 3.44
                        ↓
              Dart Material API 3.4x
                        ↓
              Kotlin 2.2.20 (Android)
                        ↓
              AGP 8.11.1 (Android)
                        ↓
              Gradle 8.14 (Android)
                        ↓
              JDK 17 (host)
                        ↓
              Plugins (audio_service, get, hive, etc.)
\`\`\`

Si haces bump de Flutter SDK sin bumpear Gradle, no compila. Si haces bump de AGP sin bumpear Gradle, falla. Si haces bump de Kotlin sin bumpear los plugins, los plugins crashean en runtime. Si haces bump de Dart a 3.12 y dejas un package que no soporta \`final class\`, no compila. Todo está acoplado.

**El anti-patrón: el "big bang upgrade"**

El anti-patrón clásico es un PR de 200+ archivos que bumpa SDK, AGP, Gradle, Kotlin, refactoriza todas las deprecaciones en un solo commit, y reza para que funcione. Lo he visto. Lo hice yo mismo en 2021 con un proyecto Xamarin. Resultado: 3 días debuggeando, 2 commits revertidos, y la mitad del equipo sin saber qué cambió.

**La solución: 10 pasos acoplados con un commit por paso**

El orden importa. Cada paso depende del anterior. Si intentas saltar, fallas.

\`\`\`
Paso 1:  Audit de pubspec.yaml (paquetes abandonados)
Paso 2:  Bump Flutter SDK en pubspec.yaml
Paso 3:  Bump Java target a 17
Paso 4:  Bump Gradle wrapper
Paso 5:  Bump AGP
Paso 6:  Bump Kotlin + migración a Flutter built-in Kotlin
Paso 7:  Remover flags del Flutter migrator
Paso 8:  Bump plugins a versiones compatibles
Paso 9:  Sweep de deprecaciones Dart (1 commit por categoría)
Paso 10: Verificación final (analyze + build + smoke test)
\`\`\`

**Paso 1: audit de pubspec.yaml**

Antes de tocar nada, abrí \`pubspec.yaml\` y busqué paquetes con updates de hace más de 1 año. Encontré dos bloqueadores:

- \`ionicons: ^0.2.2\` — sin updates desde 2022, incompatible con Dart 3.12
- \`youtube_explode_dart: github:anandnet/...\` — fork del autor original, sin updates en 1 año, pero crítico (la app no funciona sin él)

Para \`ionicons\`, el plan fue reemplazo con Material Icons (47 ocurrencias en el código, todas mecánicas). Para \`youtube_explode_dart\`, decisión de riesgo: pin el commit del fork, aceptar la deuda, y migrar a un wrapper alrededor de la API cuando haya tiempo.

**Paso 2: bump Flutter SDK**

Cambié \`environment: sdk: '>=3.1.5 <4.0.0'\` a \`'>=3.4.0 <4.0.0'\` (target 3.44). \`flutter pub get\` empezó a quejarse de paquetes incompatibles. Esperado. Anoté cada error y los resolví en pasos siguientes.

**Paso 3: bump Java target**

Flutter 3.5+ requiere JDK 17 como mínimo. \`android/app/build.gradle\`:

\`\`\`groovy
// ANTES
compileOptions { sourceCompatibility JavaVersion.VERSION_1_8 }

// DESPUÉS
compileOptions {
    sourceCompatibility JavaVersion.VERSION_17
    targetCompatibility JavaVersion.VERSION_17
}
\`\`\`

**Pasos 4-6: Gradle / AGP / Kotlin lockstep**

Los tres bumps son acoplados. No se puede bumpear AGP sin bumpear Gradle. La matriz de compatibilidad es:

| Gradle | AGP  | Kotlin |
|--------|------|--------|
| 8.14   | 8.11.1+ | 2.2.20+ |

Actualicé \`android/gradle/wrapper/gradle-wrapper.properties\` a \`distributionUrl=...gradle-8.14...\`, \`android/settings.gradle\` con \`agp = "8.11.1"\` y \`kotlin = "2.2.20"\`, y \`android/app/build.gradle\` con el plugin de Kotlin via Flutter built-in.

La migración a Flutter built-in Kotlin fue el commit más delicado:

\`\`\`groovy
// android/app/build.gradle — ANTES
plugins { id "kotlin-android" }
kotlinOptions { jvmTarget = '17' }

// android/app/build.gradle — DESPUÉS
import org.jetbrains.kotlin.gradle.dsl.JvmTarget
plugins { /* no kotlin-android — Flutter handles it */ }
kotlin { compilerOptions { jvmTarget = JvmTarget.JVM_17 } }
\`\`\`

\`flutter build apk --debug\` después de este commit: BUILD SUCCESSFUL. Pero tomó 4 reintentos porque había un plugin (no recuerdo cuál) que todavía esperaba la API vieja.

**Paso 7: remover flags del Flutter migrator**

\`android/gradle.properties\` tenía esto desde 2025:

\`\`\`properties
android.builtInKotlin=false
android.newDsl=false
\`\`\`

Estos flags los agrega el \`flutter migrate\` command durante una migración. Una vez completada, deben removerse manualmente. Dejarlos causa warnings confusos y eventualmente romperán builds futuros. Los borré. Commit aparte.

**Paso 8: bump plugins**

Cada plugin (audio_service, get, hive, dio, etc.) tiene su propia matriz de compatibilidad. La forma de verificar: leer el CHANGELOG.md de cada plugin, buscar compatibilidad con Flutter 3.4x+ y Dart 3.4+. Actualicé:

- \`audio_service: ^0.18.15\` → \`^0.18.17\`
- \`get: ^4.6.6\` → \`^4.7.1\`
- \`just_audio: ^0.9.40\` → \`^0.9.46\`
- \`permission_handler: ^11.0.1\` (sin cambio)

**Paso 9: sweep de deprecaciones (1 commit por categoría)**

Aquí es donde la cadena se vuelve dolorosa. 19 commits separados, uno por categoría. Los ordeno por impacto (los que más archivos tocan primero):

1. \`withOpacity(x)\` → \`withValues(alpha: x)\` — 23 archivos
2. \`Color.value\` → \`toARGB32()\` — 8 archivos
3. \`ThemeData\` getters → \`colorScheme\` — 12 archivos
4. \`SystemUiOverlayStyle\` boolean properties → methods — 5 archivos
5. \`Radio(groupValue:onChanged:)\` → \`RadioGroup<T>\` wrapper — 3 archivos
6. \`ReorderableListView.onReorder\` → \`onReorderItem\` — 2 archivos
7. \`Switch.activeColor\` → \`WidgetStateProperty\` — 4 archivos
8. \`Ionicons.foo\` → \`Icons.foo\` (Material) — 47 ocurrencias en 11 archivos

Cada commit fue:

\`\`\`bash
# Ejemplo: commit 2064daa
git checkout -b refactor/with-opacity-migration
grep -rln "withOpacity" lib/ | xargs sed -i 's/withOpacity(([^)]*))/withValues(alpha: \\1)/g'
flutter analyze  # esperar 0 errores de este tipo
git add -A
git commit -m "refactor: replace withOpacity with withValues(alpha:)"
\`\`\`

El orden de los commits importa: si haces commit de Material Icons antes que Material API deprecations, los archivos que tocas no están en el estado "limpio" todavía.

**Paso 10: verificación final**

\`\`\`bash
flutter analyze
# Expected: 0 errors, 0 warnings, < 5 info

flutter build apk --debug
# Expected: BUILD SUCCESSFUL, APK < 200MB

# Smoke test en device real
flutter install
# Probar: cold start, search, play song, background playback
\`\`\`

**El impacto**

\`\`\`
19 commits para build/deprecaciones
~70 archivos modificados
~3,500 líneas tocadas
\`\`\`

El "upgrade tax" real fue 19 commits en 4 días. Cada commit tardó entre 30 minutos (sweep mecánico) y 4 horas (Kotlin DSL migration con debugging de plugins). Sin el orden correcto, hubiera sido peor.

**Lecciones aprendidas**

El upgrade tax de un proyecto Flutter abandonado es real, medible, y merece ser planeado. La métrica que nadie te dice: aproximadamente 1 commit de deprecación por cada 1.5 años de gap, en un proyecto de tamaño medio. Si dejaste tu proyecto 1 año sin maintenance, esperá 5-8 commits solo de deprecaciones. Si dejaste 2 años, 15-20.

El orden importa más que la velocidad. Si intentas hacer todo en un commit, fallas. Si haces commits por categoría, puedes hacer rollback de uno sin romper los otros. Y antes de tocar el código, audita \`pubspec.yaml\` en busca de paquetes abandonados: un solo package roto te bloquea todo el upgrade.

Si vas a mantener un proyecto Flutter activo, no dejes pasar más de 6 meses entre upgrades. Cada mes adicional son 2-3 commits de deprecaciones futuras. La deuda técnica en Flutter es visible, predecible, y completamente evitable con un cronograma.`,contentEn:`When I forked Harmony-Music, my instinct was: \`flutter upgrade\`, read the breaking changes, done. What actually happened was a month of chained work where every bump broke something that depended on the previous bump. The lesson: upgrading a Flutter project is not a commit, it is a cascade.

**The problem: nothing is standalone**

Flutter is not a monolithic framework. It is a pyramid where each layer depends on the one below:

\`\`\`
                  Dart 3.12+ constraints
                        ↓
                 Flutter SDK 3.44
                        ↓
              Dart Material API 3.4x
                        ↓
              Kotlin 2.2.20 (Android)
                        ↓
              AGP 8.11.1 (Android)
                        ↓
              Gradle 8.14 (Android)
                        ↓
              JDK 17 (host)
                        ↓
              Plugins (audio_service, get, hive, etc.)
\`\`\`

If you bump Flutter SDK without bumping Gradle, it does not compile. If you bump AGP without bumping Gradle, it fails. If you bump Kotlin without bumping plugins, plugins crash at runtime. If you bump Dart to 3.12 and leave a package that does not support \`final class\`, it does not compile. Everything is coupled.

**The anti-pattern: the "big bang upgrade"**

The classic anti-pattern is a 200+ file PR that bumps SDK, AGP, Gradle, Kotlin, refactors all deprecations in one commit, and prays it works. I have seen it. I did it myself in 2021 with a Xamarin project. Result: 3 days of debugging, 2 reverted commits, and half the team not knowing what changed.

**The solution: 10 coupled steps with one commit per step**

Order matters. Each step depends on the previous one. If you try to skip, you fail.

\`\`\`
Step 1:  Audit pubspec.yaml (abandoned packages)
Step 2:  Bump Flutter SDK in pubspec.yaml
Step 3:  Bump Java target to 17
Step 4:  Bump Gradle wrapper
Step 5:  Bump AGP
Step 6:  Bump Kotlin + migrate to Flutter built-in Kotlin
Step 7:  Remove Flutter migrator flags
Step 8:  Bump plugins to compatible versions
Step 9:  Sweep Dart deprecations (1 commit per category)
Step 10: Final verification (analyze + build + smoke test)
\`\`\`

**Step 1: audit pubspec.yaml**

Before touching anything, I opened \`pubspec.yaml\` and looked for packages with no updates in 1+ year. I found two blockers:

- \`ionicons: ^0.2.2\` — no updates since 2022, incompatible with Dart 3.12
- \`youtube_explode_dart: github:anandnet/...\` — fork from original author, no updates in 1 year, but critical (app does not work without it)

For \`ionicons\`, the plan was replacement with Material Icons (47 occurrences in code, all mechanical). For \`youtube_explode_dart\`, a risk decision: pin the fork commit, accept the debt, and migrate to an API wrapper when time allows.

**Step 2: bump Flutter SDK**

Changed \`environment: sdk: '>=3.1.5 <4.0.0'\` to \`'>=3.4.0 <4.0.0'\` (target 3.44). \`flutter pub get\` started complaining about incompatible packages. Expected. I noted every error and resolved them in following steps.

**Step 3: bump Java target**

Flutter 3.5+ requires JDK 17 minimum. \`android/app/build.gradle\`:

\`\`\`groovy
// BEFORE
compileOptions { sourceCompatibility JavaVersion.VERSION_1_8 }

// AFTER
compileOptions {
    sourceCompatibility JavaVersion.VERSION_17
    targetCompatibility JavaVersion.VERSION_17
}
\`\`\`

**Steps 4-6: Gradle / AGP / Kotlin lockstep**

The three bumps are coupled. You cannot bump AGP without bumping Gradle. The compatibility matrix:

| Gradle | AGP  | Kotlin |
|--------|------|--------|
| 8.14   | 8.11.1+ | 2.2.20+ |

I updated \`android/gradle/wrapper/gradle-wrapper.properties\` to \`distributionUrl=...gradle-8.14...\`, \`android/settings.gradle\` with \`agp = "8.11.1"\` and \`kotlin = "2.2.20"\`, and \`android/app/build.gradle\` with the Kotlin plugin via Flutter built-in.

The migration to Flutter built-in Kotlin was the most delicate commit:

\`\`\`groovy
// android/app/build.gradle — BEFORE
plugins { id "kotlin-android" }
kotlinOptions { jvmTarget = '17' }

// android/app/build.gradle — AFTER
import org.jetbrains.kotlin.gradle.dsl.JvmTarget
plugins { /* no kotlin-android — Flutter handles it */ }
kotlin { compilerOptions { jvmTarget = JvmTarget.JVM_17 } }
\`\`\`

\`flutter build apk --debug\` after this commit: BUILD SUCCESSFUL. But it took 4 retries because there was a plugin (I do not remember which) that still expected the old API.

**Step 7: remove Flutter migrator flags**

\`android/gradle.properties\` had this since 2025:

\`\`\`properties
android.builtInKotlin=false
android.newDsl=false
\`\`\`

These flags are added by the \`flutter migrate\` command during a migration. Once completed, they must be removed manually. Leaving them causes confusing warnings and will eventually break future builds. I deleted them. Separate commit.

**Step 8: bump plugins**

Each plugin (audio_service, get, hive, dio, etc.) has its own compatibility matrix. How to verify: read each plugin's CHANGELOG.md, look for Flutter 3.4x+ and Dart 3.4+ compatibility. I updated:

- \`audio_service: ^0.18.15\` → \`^0.18.17\`
- \`get: ^4.6.6\` → \`^4.7.1\`
- \`just_audio: ^0.9.40\` → \`^0.9.46\`
- \`permission_handler: ^11.0.1\` (unchanged)

**Step 9: deprecation sweep (1 commit per category)**

This is where the chain gets painful. 19 separate commits, one per category. I ordered them by impact (the ones touching the most files first):

1. \`withOpacity(x)\` → \`withValues(alpha: x)\` — 23 files
2. \`Color.value\` → \`toARGB32()\` — 8 files
3. \`ThemeData\` getters → \`colorScheme\` — 12 files
4. \`SystemUiOverlayStyle\` boolean properties → methods — 5 files
5. \`Radio(groupValue:onChanged:)\` → \`RadioGroup<T>\` wrapper — 3 files
6. \`ReorderableListView.onReorder\` → \`onReorderItem\` — 2 files
7. \`Switch.activeColor\` → \`WidgetStateProperty\` — 4 files
8. \`Ionicons.foo\` → \`Icons.foo\` (Material) — 47 occurrences in 11 files

Each commit was:

\`\`\`bash
# Example: commit 2064daa
git checkout -b refactor/with-opacity-migration
grep -rln "withOpacity" lib/ | xargs sed -i 's/withOpacity(([^)]*))/withValues(alpha: \\1)/g'
flutter analyze  # expect 0 errors of this type
git add -A
git commit -m "refactor: replace withOpacity with withValues(alpha:)"
\`\`\`

The commit order matters: if you commit Material Icons before Material API deprecations, the files you touch are not in the "clean" state yet.

**Step 10: final verification**

\`\`\`bash
flutter analyze
# Expected: 0 errors, 0 warnings, < 5 info

flutter build apk --debug
# Expected: BUILD SUCCESSFUL, APK < 200MB

# Smoke test on real device
flutter install
# Test: cold start, search, play song, background playback
\`\`\`

**The impact**

\`\`\`
19 commits for build/deprecations
~70 files modified
~3,500 lines touched
\`\`\`

The real "upgrade tax" was 19 commits in 4 days. Each commit took between 30 minutes (mechanical sweep) and 4 hours (Kotlin DSL migration with plugin debugging). Without the correct order, it would have been worse.

**Lessons learned**

The upgrade tax of an abandoned Flutter project is real, measurable, and worth planning for. The metric nobody tells you: approximately 1 deprecation commit per 1.5 years of gap, on a medium-sized project. If you left your project for 1 year without maintenance, expect 5-8 commits of just deprecations. If you left 2 years, 15-20.

Order matters more than speed. If you try to do everything in one commit, you fail. If you do commits by category, you can roll back one without breaking the others. And before touching code, audit \`pubspec.yaml\` for abandoned packages: a single broken package blocks the entire upgrade.

If you are going to keep a Flutter project active, do not let more than 6 months pass between upgrades. Each additional month is 2-3 commits of future deprecations. Technical debt in Flutter is visible, predictable, and completely avoidable with a schedule.`,relatedIds:[`inherited-oss-flutter-modernization`,`android-14-background-audio-modernization`]},{id:`android-14-background-audio-modernization`,slug:`android-14-audio-background-modernizacion`,series:`OSS Maintenance`,title:`Audio en background en Android 14+ cuando heredaste código de Android 9`,titleEn:`Background audio on Android 14+ when you inherited Android 9 code`,date:`2026-06-26`,tags:[`flutter`,`android`,`audio_service`,`jni`,`equalizer`,`background-audio`,`modernization`,`permissions`],category:`arquitectura`,featured:!1,excerpt:`Una app de música que heredaste con código de Android 9 tiene tres problemas para correr en Android 14+: scoped storage mató Permission.storage, foreground service types son estrictos, y cualquier API nativa (como el equalizer) necesita un bridge JNI porque no hay package Dart. Acá está la solución completa: SDK-version-aware permissions, JNI para Equalizer, y la config de audio_service que mantiene la música viva en background.`,excerptEn:`A music app you inherited with Android 9 code has three problems running on Android 14+: scoped storage killed Permission.storage, foreground service types are strict, and any native API (like the equalizer) needs a JNI bridge because there is no Dart package. Here is the complete solution: SDK-version-aware permissions, JNI for Equalizer, and the audio_service config that keeps the music alive in background.`,content:`Una de las primeras cosas que noté cuando forké Harmony-Music fue que el código de permisos y audio background era de la era Android 9. La app "funcionaba" en Android 14+ por accidente — pero había tres bombas de tiempo esperando la primera oportunidad para romper.

**El problema: tres eras de Android en el mismo código**

\`lib/services/permission_service.dart\` tenía esto:

\`\`\`dart
// Código del autor original, circa 2019
var status = await Permission.storage.status;
if (status.isDenied) {
  await Permission.storage.request();
}
return status.isGranted;
\`\`\`

Esto funcionaba en Android 9 (API 28). En Android 10+ (API 29+), Google introdujo scoped storage, que cambió el significado de \`Permission.storage\`. En Android 11+ (API 30+), \`Permission.storage\` no existe para nada — tienes que usar \`Permission.manageExternalStorage\` con un flow especial de "All Files Access".

El resultado: la app no podía escribir descargas de canciones en Android 11+. En Android 13+ (API 33+), los media permissions se separaron en \`Permission.audio\`, \`Permission.video\`, \`Permission.images\`. En Android 14+ (API 34+), los foreground services requieren declarar el tipo (mediaPlayback, microphone, location, etc.) en el manifest.

**El anti-patrón: una rama de código para todos los SDKs**

El código viejo tenía un solo path: \`Permission.storage.request()\`. Cuando dejaba de funcionar en algún SDK, lo "arreglaban" agregando un if suelto en alguna parte del código, sin documentar. La densidad de bugs aumentaba con cada release de Android.

\`\`\`dart
// Anti-patrón: SDK checks dispersos
if (someCondition && sdkInt > 29 && someOtherCondition) { ... }
// Comentario: "esto lo arreglé para Pixel 5 con Android 11"
\`\`\`

Después de 3 años de parches así, la lógica de permisos era imposible de seguir.

**La solución: SDK-version-aware permissions centralizadas**

Reescribí \`permission_service.dart\` con un solo punto de entrada que decide qué pedir según SDK:

\`\`\`dart
class PermissionService {
  static Future<bool> getExtStoragePermission() async {
    if (GetPlatform.isDesktop) return Future.value(true);

    final sdkInt = SDKInt.Companion.getSDKInt();
    if (sdkInt < 30) {
      // Android 9 y anteriores: Permission.storage funciona
      var status = await Permission.storage.status;
      if (status.isDenied) {
        await [
          Permission.storage,
          Permission.accessMediaLocation,
          Permission.mediaLibrary,
        ].request();
      }
      return (await Permission.storage.status).isGranted;
    } else {
      // Android 10+: scoped storage
      if (!await Permission.manageExternalStorage.isGranted) {
        final permission = await Permission.manageExternalStorage.request();
        return permission.isGranted;
      }
      return true;
    }
  }
}
\`\`\`

El \`SDKInt.Companion.getSDKInt()\` viene del JNI bridge (siguiente sección). Es la única forma de tener el SDK int de Android en Dart sin pasar por un MethodChannel. Raro, pero funcional.

**Audio en background: AudioServiceConfig para Android 14+**

Android 14+ requiere que declares el tipo de foreground service en el AndroidManifest.xml Y que el config de audio_service coincida:

\`\`\`xml
<!-- android/app/src/main/AndroidManifest.xml -->
<service
    android:name="com.ryanheise.audioservice.AudioService"
    android:foregroundServiceType="mediaPlayback"
    android:exported="true"
    tools:ignore="Instantiatable">
    <intent-filter>
        <action android:name="androidx.media3.session.MediaSessionService"/>
        <action android:name="android.media.browse.MediaBrowserService"/>
    </intent-filter>
</service>
\`\`\`

Sin \`foregroundServiceType="mediaPlayback"\`, Android 14 mata la app cuando intenta ir a background. Es la primera línea de defensa.

Después, el \`AudioServiceConfig\` en Dart:

\`\`\`dart
static const _config = AudioServiceConfig(
  androidNotificationIcon: 'mipmap/ic_launcher_monochrome',
  androidNotificationChannelId: 'com.mycompany.myapp.audio',
  androidNotificationChannelName: 'Harmony Music Notification',
  androidNotificationOngoing: true,    // ← no dismissable durante playback
  androidStopForegroundOnPause: true,  // ← stops foreground cuando se pausa
  androidBrowsableRootExtras: { ... }, // ← para Android Auto browsing
);
AudioService.init<MyAudioHandler>(_builder, config: _config);
\`\`\`

\`androidNotificationOngoing: true\` significa que el usuario NO puede descartar la notificación con swipe. Es lo que esperas de un player de música: la notificación queda hasta que pausas o cierras la app. Si pones \`false\`, el usuario mata la música por accidente.

\`androidStopForegroundOnPause: true\` es la otra decisión clave: cuando el usuario pausa, el foreground service se detiene. Esto le dice a Android "no estoy haciendo nada en background, puedes matarme si necesitas memoria". Es el comportamiento correcto para batería.

**El JNI bridge: por qué no hay package Dart para el equalizer**

El equalizer de Android está en \`android.media.audiofx.Equalizer\`. Es una clase Java con métodos nativos. No hay un package Dart que la exponga. Hay dos opciones:

1. MethodChannel manual — escribir el código Java/Kotlin, escribir el código Dart, mantener ambos lados sincronizados
2. JNI con \`jni\` + \`jnigen\` — generar los bindings desde la clase Java/Kotlin existente

El autor original ya tenía un equalizer implementado via MethodChannel. Era 200 líneas de Kotlin + 150 líneas de Dart, sincronizadas a mano. Cuando algo cambiaba, se rompía en silencio.

Lo reemplacé con un bridge JNI usando \`jnigen\`, que lee la clase Java y genera los bindings Dart automáticamente:

\`\`\`dart
// lib/services/equalizer.dart
import 'package:jni/jni.dart';

class EqualizerService {
  static bool openEqualizer(int sessionId) {
    JObject activity = JObject.fromReference(Jni.getCurrentActivity());
    JObject context = JObject.fromReference(Jni.getCachedApplicationContext());
    final success = Equalizer().openEqualizer(sessionId, context, activity);
    return success;
  }
}

// jnigen lee com.mycompany.myapp.Equalizer.kt y genera los bindings Dart
// Cambios en Kotlin → regenerar bindings → no más drift
\`\`\`

El precio: agregas un step de generación de código al build. El beneficio: cero drift entre Kotlin y Dart. Si mañana cambia la firma de \`Equalizer.openEqualizer\`, el build falla inmediatamente, no en producción.

**El onTaskRemoved handler: ¿matar o continuar?**

Cuando el usuario swipea la app del recent apps tray, Android llama \`onTaskRemoved\`. La decisión: ¿seguir reproduciendo o parar? Depende de la preferencia del usuario y de la lógica de battery optimization.

\`\`\`dart
// audio_handler.dart
@override
Future<void> onTaskRemoved() async {
  if (await _userPrefs.shouldStopOnTaskRemoved()) {
    await super.onTaskRemoved();  // stops everything
  } else {
    // continuar reproducción (audio_service maneja el foreground service)
  }
}
\`\`\`

El default debería ser "continuar" para un music player (el usuario espera que la música siga cuando limpia las recientes). Pero algunos OEMs (Xiaomi, Huawei, OnePlus) matan agresivamente las apps en background — para esos usuarios, \`shouldStopOnTaskRemoved = true\` puede ser la única forma de evitar battery drain por música que "no debería estar sonando".

**El impacto**

\`\`\`
Permisos: funcionan en Android 9 → 14+
Audio background: estable en todas las versiones modernas
Equalizer: sin drift entre Kotlin y Dart (JNI)
Notificación: ongoing, no se mata por swipe
\`\`\`

El testing fue manual en 5 dispositivos físicos (Pixel 3 con Android 12, Pixel 6 con Android 14, Samsung A52 con Android 13, Xiaomi Redmi con Android 11, OnePlus 9 con Android 14). Cada uno con sus quirks de battery optimization.

**Lecciones aprendidas**

Una app de música para Android 14+ no es la misma app que para Android 9. Tres cosas son obligatorias: SDK-version-aware permissions en un solo lugar, \`foregroundServiceType="mediaPlayback"\` en el manifest, y un JNI bridge para cualquier API nativa sin package Dart.

El anti-patrón más común que veo: branches de SDK check dispersos por el código, cada uno con un comentario vago de cuándo se agregó. Centralizarlos en un \`PermissionService\` con un método por cada necesidad del usuario hace que el código sea mantenible por años.

Y la regla del JNI: si la API nativa cambia con frecuencia o tiene muchos métodos, usa \`jnigen\` para generar bindings. Si es estática y de 2-3 métodos, MethodChannel manual está bien. La diferencia es cuánto te dolerá cuando cambies la firma de un método.`,contentEn:`One of the first things I noticed when I forked Harmony-Music was that the permission and background audio code was from the Android 9 era. The app "worked" on Android 14+ by accident — but there were three time bombs waiting for the first chance to break.

**The problem: three Android eras in the same code**

\`lib/services/permission_service.dart\` had this:

\`\`\`dart
// Original author's code, circa 2019
var status = await Permission.storage.status;
if (status.isDenied) {
  await Permission.storage.request();
}
return status.isGranted;
\`\`\`

This worked on Android 9 (API 28). On Android 10+ (API 29+), Google introduced scoped storage, which changed the meaning of \`Permission.storage\`. On Android 11+ (API 30+), \`Permission.storage\` does not exist at all — you have to use \`Permission.manageExternalStorage\` with a special "All Files Access" flow.

The result: the app could not write song downloads on Android 11+. On Android 13+ (API 33+), media permissions split into \`Permission.audio\`, \`Permission.video\`, \`Permission.images\`. On Android 14+ (API 34+), foreground services require declaring the type (mediaPlayback, microphone, location, etc.) in the manifest.

**The anti-pattern: one code path for all SDKs**

The old code had a single path: \`Permission.storage.request()\`. When it stopped working on some SDK, they "fixed" it by adding a loose if somewhere in the code, without documentation. The bug density increased with each Android release.

\`\`\`dart
// Anti-pattern: scattered SDK checks
if (someCondition && sdkInt > 29 && someOtherCondition) { ... }
// Comment: "fixed this for Pixel 5 with Android 11"
\`\`\`

After 3 years of patches like this, the permission logic was impossible to follow.

**The solution: centralized SDK-version-aware permissions**

I rewrote \`permission_service.dart\` with a single entry point that decides what to ask for based on SDK:

\`\`\`dart
class PermissionService {
  static Future<bool> getExtStoragePermission() async {
    if (GetPlatform.isDesktop) return Future.value(true);

    final sdkInt = SDKInt.Companion.getSDKInt();
    if (sdkInt < 30) {
      // Android 9 and below: Permission.storage works
      var status = await Permission.storage.status;
      if (status.isDenied) {
        await [
          Permission.storage,
          Permission.accessMediaLocation,
          Permission.mediaLibrary,
        ].request();
      }
      return (await Permission.storage.status).isGranted;
    } else {
      // Android 10+: scoped storage
      if (!await Permission.manageExternalStorage.isGranted) {
        final permission = await Permission.manageExternalStorage.request();
        return permission.isGranted;
      }
      return true;
    }
  }
}
\`\`\`

The \`SDKInt.Companion.getSDKInt()\` comes from the JNI bridge (next section). It is the only way to have the Android SDK int in Dart without going through a MethodChannel. Weird, but functional.

**Background audio: AudioServiceConfig for Android 14+**

Android 14+ requires you to declare the foreground service type in AndroidManifest.xml AND that the audio_service config matches:

\`\`\`xml
<!-- android/app/src/main/AndroidManifest.xml -->
<service
    android:name="com.ryanheise.audioservice.AudioService"
    android:foregroundServiceType="mediaPlayback"
    android:exported="true"
    tools:ignore="Instantiatable">
    <intent-filter>
        <action android:name="androidx.media3.session.MediaSessionService"/>
        <action android:name="android.media.browse.MediaBrowserService"/>
    </intent-filter>
</service>
\`\`\`

Without \`foregroundServiceType="mediaPlayback"\`, Android 14 kills the app when it tries to go to background. It is the first line of defense.

Then the \`AudioServiceConfig\` in Dart:

\`\`\`dart
static const _config = AudioServiceConfig(
  androidNotificationIcon: 'mipmap/ic_launcher_monochrome',
  androidNotificationChannelId: 'com.mycompany.myapp.audio',
  androidNotificationChannelName: 'Harmony Music Notification',
  androidNotificationOngoing: true,    // ← not dismissable during playback
  androidStopForegroundOnPause: true,  // ← stops foreground when paused
  androidBrowsableRootExtras: { ... }, // ← for Android Auto browsing
);
AudioService.init<MyAudioHandler>(_builder, config: _config);
\`\`\`

\`androidNotificationOngoing: true\` means the user CANNOT dismiss the notification with a swipe. It is what you expect from a music player: the notification stays until you pause or close the app. If you set \`false\`, the user kills the music by accident.

\`androidStopForegroundOnPause: true\` is the other key decision: when the user pauses, the foreground service stops. This tells Android "I am not doing anything in background, you can kill me if you need memory". It is the correct behavior for battery.

**The JNI bridge: why there is no Dart package for the equalizer**

The Android equalizer lives at \`android.media.audiofx.Equalizer\`. It is a Java class with native methods. There is no Dart package that exposes it. There are two options:

1. Manual MethodChannel — write the Java/Kotlin code, write the Dart code, keep both sides in sync
2. JNI with \`jni\` + \`jnigen\` — generate bindings from the existing Java/Kotlin class

The original author already had an equalizer implemented via MethodChannel. It was 200 lines of Kotlin + 150 lines of Dart, manually synced. When something changed, it broke silently.

I replaced it with a JNI bridge using \`jnigen\`, which reads the Java class and generates the Dart bindings automatically:

\`\`\`dart
// lib/services/equalizer.dart
import 'package:jni/jni.dart';

class EqualizerService {
  static bool openEqualizer(int sessionId) {
    JObject activity = JObject.fromReference(Jni.getCurrentActivity());
    JObject context = JObject.fromReference(Jni.getCachedApplicationContext());
    final success = Equalizer().openEqualizer(sessionId, context, activity);
    return success;
  }
}

// jnigen reads com.mycompany.myapp.Equalizer.kt and generates Dart bindings
// Changes in Kotlin → regenerate bindings → no more drift
\`\`\`

The cost: you add a code generation step to the build. The benefit: zero drift between Kotlin and Dart. If \`Equalizer.openEqualizer\`'s signature changes tomorrow, the build fails immediately, not in production.

**The onTaskRemoved handler: kill or continue?**

When the user swipes the app from the recent apps tray, Android calls \`onTaskRemoved\`. The decision: keep playing or stop? Depends on user preference and battery optimization logic.

\`\`\`dart
// audio_handler.dart
@override
Future<void> onTaskRemoved() async {
  if (await _userPrefs.shouldStopOnTaskRemoved()) {
    await super.onTaskRemoved();  // stops everything
  } else {
    // continue playback (audio_service handles the foreground service)
  }
}
\`\`\`

The default should be "continue" for a music player (the user expects music to keep playing when they clear recents). But some OEMs (Xiaomi, Huawei, OnePlus) aggressively kill background apps — for those users, \`shouldStopOnTaskRemoved = true\` may be the only way to avoid battery drain from music that "should not be playing".

**The impact**

\`\`\`
Permissions: work on Android 9 → 14+
Background audio: stable on all modern versions
Equalizer: no drift between Kotlin and Dart (JNI)
Notification: ongoing, not killed by swipe
\`\`\`

Testing was manual on 5 physical devices (Pixel 3 with Android 12, Pixel 6 with Android 14, Samsung A52 with Android 13, Xiaomi Redmi with Android 11, OnePlus 9 with Android 14). Each with its own battery optimization quirks.

**Lessons learned**

A music app for Android 14+ is not the same app as for Android 9. Three things are mandatory: SDK-version-aware permissions in one place, \`foregroundServiceType="mediaPlayback"\` in the manifest, and a JNI bridge for any native API without a Dart package.

The most common anti-pattern I see: scattered SDK check branches throughout the code, each with a vague comment about when it was added. Centralizing them in a \`PermissionService\` with one method per user need makes the code maintainable for years.

And the JNI rule: if the native API changes frequently or has many methods, use \`jnigen\` to generate bindings. If it is static and 2-3 methods, manual MethodChannel is fine. The difference is how much it will hurt when you change a method signature.`,relatedIds:[`inherited-oss-flutter-modernization`,`flutter-cross-platform-audio-architecture`,`flutter-build-modernization-upgrade-mountain`]},{id:`bot-ubica-prueba-vida`,slug:`validacion-biometrica-geolocalizacion-credito`,series:`Fintech Patterns`,title:`BOT Ubica + Prueba de Vida: cómo validé identidad biométrica en tiempo real con fallback humano y catálogo de diagnósticos`,titleEn:`BOT Ubica + Proof of Life: how I validated biometric identity in real-time with human fallback and diagnostic catalog`,date:`2026-07-15`,tags:[`dotnet`,`biometrics`,`strategy-pattern`,`catalog-driven`,`fintech`,`orchestration`,`liveness-detection`,`geolocation`],category:`arquitectura`,featured:!0,excerpt:`En un sistema de originación de crédito, validar identidad no es solo confirmar un número de documento. Es probar que la persona está viva, está en el lugar que dice estar, y no es un deepfake. Acá está cómo diseñé BOT Ubica (bot de voz + geolocalización) más Prueba de Vida V2 (liveness detection con OAuth) más un motor de decisiones catalog-driven con 9 códigos de diagnóstico, fallback manual como ciudadano de primera clase, y un selector de buró de crédito configurable sin redeploy.`,excerptEn:`In a loan origination system, validating identity is not just confirming a document number. It is proving that the person is alive, is where they say they are, and is not a deepfake. Here is how I designed BOT Ubica (voice bot + geolocation) plus Proof of Life V2 (liveness detection with OAuth) plus a catalog-driven decision engine with 9 diagnostic codes, manual fallback as a first-class citizen, and a configurable credit bureau selector without redeploy.`,content:`Cuando te dan un caso de fraude de identidad en una originación de crédito, el problema no es solo "verificar que la persona existe". El problema es verificar cuatro cosas en simultáneo, en tiempo real, sin molestar al cliente legítimo, y dejando trazabilidad completa para auditoría:

1. **Que la persona está viva** (no es una foto robada, no es un video pregrabado)
2. **Que está donde dice estar** (no es un bot operando desde otro país)
3. **Que es quien dice ser** (no es un documento falsificado)
4. **Que toda la operación quede registrada** (para auditoría y replay)

**El problema de la validación manual**

El sistema de originación de crédito en el que trabajé procesaba solicitudes a alta velocidad. La validación de identidad era el cuello de botella: un asesor humano llamaba al cliente, le hacía 4 preguntas, validaba su voz contra una grabación previa, y aprobaba o rechazaba. Tres problemas:

- **Tiempo**: 8-12 minutos por validación. Multiplicado por cientos de solicitudes diarias, era un embudo.
- **Inconsistencia**: dos asesores diferentes aplicaban criterios diferentes. El mismo cliente podía ser aprobado por uno y rechazado por otro.
- **Cero trazabilidad**: cuando un caso se disputaba meses después, la única evidencia era "el asesor dijo que la voz no coincidía". Inútil para una disputa legal.

Necesitaba automatizar sin sacrificar el respaldo humano. Y necesitaba que el sistema se pudiera extender sin tocar código (cada mes se agregan nuevos patrones de fraude, no se puede hacer deploy por cada uno).

**El anti-patrón: if/switch con reglas hardcodeadas**

El primer intento fue lo obvio: una clase \`ValidadorIdentidad\` con un \`switch\` enorme:

\`\`\`csharp
// ANTI-PATRÓN: lógica hardcodeada, no extensible
public ResultadoValidacion Validar(Solicitud sol) {
    if (sol.EsClienteNuevo && sol.PaisOrigen == "CO") return LlamarBot(sol);
    if (sol.MontoSolicitado > 50_000_000) return LlamarBotYVideo(sol);
    if (sol.EsClienteNuevo) return LlamarAsesor(sol);
    return SoloOtp(sol);
    // ... 200 ramas más en producción ...
}
\`\`\`

Tres problemas:
- Cada nueva regla requiere deploy
- Imposible saber qué reglas se aplicaron a una solicitud específica
- El equipo de negocio no puede proponer cambios — depende del equipo de desarrollo

**La solución: Strategy Pattern + motor catalog-driven**

Reescribí el sistema en tres capas:

\`\`\`
┌──────────────────────────────────────────────┐
│   Capa de orquestación: SOVI (orquestador)   │
└────────────────┬─────────────────────────────┘
                 │
     ┌───────────┴───────────┐
     │                       │
┌────▼──────────┐    ┌───────▼────────┐
│ BOT Ubica     │    │ Validador      │
│ (bot voz +    │    │ Manual         │
│  geolocation) │    │ (asesor humano)│
└────┬──────────┘    └───────┬────────┘
     │                       │
     └───────────┬───────────┘
                 │
        ┌────────▼─────────┐
        │ Diagnostico      │
        │ Decision Engine  │
        │ (catálogo en BD) │
        └────────┬─────────┘
                 │
        ┌────────▼─────────┐
        │ CentralSelector  │
        │ (CIFIN/DATACRE-  │
        │  DITO por        │
        │  campaña)        │
        └────────┬─────────┘
                 │
        ┌────────▼─────────┐
        │ Prueba de Vida   │
        │ V2 (Face Liveness│
        │ con OAuth)       │
        └──────────────────┘
\`\`\`

**Capa 1: Strategy Pattern para BOT vs Manual**

Definí una interfaz \`IValidacionStrategy\` con dos implementaciones:

\`\`\`csharp
public interface IValidacionStrategy {
    Task<ResultadoValidacion> ValidarAsync(Solicitud solicitud);
    string NombreEstrategia { get; }
}
public class BotValidacionStrategy : IValidacionStrategy {
    public string NombreEstrategia => "BOT_UBICA";
    public async Task<ResultadoValidacion> ValidarAsync(Solicitud s)
        => _engine.Decidir(_engine.Clasificar(await _bot.EjecutarAsync(s)), s);
}
// ManualValidacionStrategy: misma interfaz, asigna asesor
\`\`\`

El orquestador SOVI decide cuál estrategia usar en runtime, basándose en reglas de negocio (campaña, monto, país, score de riesgo). Pero la decisión **de qué hacer con el resultado** vive en el motor de diagnósticos, no en el orquestador.

**Capa 2: Diagnostico Decision Engine (catalog-driven)**

El motor de decisiones no tiene un solo \`if\` hardcodeado. Toda la lógica vive en una tabla de catálogo en base de datos:

\`\`\`sql
CREATE TABLE cat.CatalogoDiagnosticosBot (
    CodigoDiagnostico VARCHAR(20) PRIMARY KEY,
    Descripcion NVARCHAR(200),
    AccionSistema VARCHAR(50),  -- APROBAR, RECHAZAR, ESCALAR_MANUAL, REINTENTAR
    RequiereCallback BIT,
    TiempoEsperaMinutos INT,
    Activo BIT
);
\`\`\`

Cuando el bot retorna, el motor clasifica la respuesta en uno de los 9 códigos de diagnóstico actuales y consulta el catálogo:

\`\`\`csharp
public class DiagnosticoDecisionEngine {
    public DecisionResultado Decidir(string codigo, Solicitud s) {
        var diag = _catalogo.ObtenerDiagnostico(codigo);
        return diag == null
            ? new DecisionResultado(ESCALAR_MANUAL, _paquete.Construir(codigo, s))  // Plan B
            : new DecisionResultado(diag.AccionSistema, diag.RequiereCallback);
    }
}
\`\`\`

El "Paquete de Inconsistencia" es un objeto con toda la información que el asesor humano necesita para resolver un caso que el bot no pudo clasificar. **No es un fallback afterthought**: es un ciudadano de primera clase, diseñado desde el día uno.

**Capa 3: CentralSelector (buró de crédito configurable por campaña)**

Cada campaña publicitaria usa un buró distinto (CIFIN, DATACREDITO, o ambos). El selector evita hardcodear esto:

\`\`\`csharp
public class CentralSelector {
    private readonly ICampanaRepository _campanas;
    public async Task<List<IConsultoraCredito>> SeleccionarAsync(int campanaId) {
        var campana = await _campanas.ObtenerConCentralesAsync(campanaId);
        return campana.Centrales.OrderBy(c => c.OrdenConsulta)
            .Select(c => c.Tipo == TipoCentral.CIFIN ? _cifinProvider : _datacreditoProvider)
            .ToList();
        // Agregar buró = una fila en la tabla, no un cambio de código
    }
}
\`\`\`

Cambiar de buró para una campaña es una fila en una tabla, no un cambio de código.

**Capa 4: Prueba de Vida V2 (Face Liveness OAuth)**

Para detectar deepfakes y videos pregrabados, agregué Face Liveness Detection con OAuth contra un proveedor externo. La integración usa un \`FaceLivenessClient\` con caché de tokens:

\`\`\`csharp
// En FaceLivenessClient: cache de token OAuth con double-checked locking
private static readonly SemaphoreSlim _lock = new(1, 1);
private static string? _token; private static DateTime _expiry;
public static async Task<string> GetTokenAsync() {
    if (_token != null && DateTime.UtcNow < _expiry) return _token;  // fast path
    await _lock.WaitAsync();
    if (_token != null && DateTime.UtcNow < _expiry) return _token;  // re-check
    _token = await _oauth.ObtenerAccessTokenAsync();
    _expiry = DateTime.UtcNow.AddMinutes(50); return _token;  // margen 10 min
}
\`\`\`

El \`SemaphoreSlim\` evita el thundering herd cuando múltiples validaciones concurrentes necesitan token al mismo tiempo. El margen de 10 minutos (token válido 60, caché 50) evita usar tokens expirados en el último segundo.

**El patrón hybrid sync/async**

El bot de voz opera en modo síncrono desde la perspectiva del cliente: el cliente espera en línea mientras el bot hace las preguntas. Pero internamente, algunas operaciones son asíncronas (consulta al buró, liveness check). El orquestador maneja esto con un patrón de callback híbrido:

\`\`\`
Cliente (síncrono) → BOT (síncrono) → SOVI (orquesta)
                                          │
                                          ├── CIFIN/DATACREDITO (async) ←┐
                                          ├── Face Liveness (async)      │
                                          └── [espera ambos resultados] ─┘
                                          │
                                          ← Respuesta consolidada
\`\`\`

El SOVI espera ambos resultados con un timeout, y si alguno falla, el motor de diagnósticos decide si escalar a manual o reintentar.

**El impacto**

- **9 códigos de diagnóstico** activos en el catálogo, cada uno con su acción específica
- **6 endpoints REST** expuestos: 3 para BOT, 2 para liveness, 1 para consulta de estado
- **9 stored procedures** dedicadas al módulo de validación (todas con prefijo \`sp_\`)
- **Feature flag rollout** gradual: 5% → 25% → 50% → 100% de las campañas nuevas
- **Cero código nuevo** para agregar un nuevo código de diagnóstico (es una fila en la tabla)
- **Fallback manual** con paquete de inconsistencia automático
- **Cero downtime** durante deploys: la tabla de catálogo se actualiza sin reiniciar el servicio

El feature flag es clave: cada nueva campaña entra al 5% de tráfico. Si la tasa de escalación a manual supera un umbral (definido por campaña), se detiene el rollout automáticamente.

**Lecciones aprendidas**

Tres lecciones que aplican a cualquier sistema de validación automatizada:

**1. Plan B como ciudadano de primera clase, no afterthought.** El paquete de inconsistencia y la estrategia manual están diseñados desde el inicio, no agregados cuando falla. Esto significa que cuando un caso no se puede resolver automáticamente, el asesor humano tiene TODO lo que necesita para resolverlo en segundos, no en minutos reconstruyendo contexto.

**2. Catalog-driven > if/switch hardcodeado.** Cualquier regla de decisión que pueda cambiar con frecuencia (códigos de fraude, acciones por tipo de validación, umbral de escalación) debe vivir en base de datos, no en código. El equipo de negocio puede proponer cambios, el equipo de desarrollo solo revisa la estructura del catálogo.

**3. El feature flag no es opcional.** El rollout gradual 5→25→50→100% con auto-rollback por umbral de escalación es lo que te permite dormir tranquilo. Si BOT Ubica funciona mal en el primer 5%, solo afecta al 5% — no a toda la producción.

Si estás diseñando un sistema de validación con fallback humano, asumí que el bot va a fallar. Diseñá para el fallo. Y la forma de diseñar para el fallo es tener el plan B como código de primera, no como una rama de \`catch\`.`,contentEn:`When you get an identity fraud case in a loan origination, the problem is not just "verify the person exists". The problem is verifying four things simultaneously, in real-time, without bothering the legitimate customer, and leaving complete traceability for auditing:

1. **That the person is alive** (not a stolen photo, not a pre-recorded video)
2. **That they are where they say they are** (not a bot operating from another country)
3. **That they are who they say they are** (not a forged document)
4. **That the entire operation is recorded** (for audit and replay)

**The manual validation problem**

The loan origination system I worked on processed applications at high speed. Identity validation was the bottleneck: a human advisor called the customer, asked 4 questions, validated their voice against a previous recording, and approved or rejected. Three problems:

- **Time**: 8-12 minutes per validation. Multiplied by hundreds of daily applications, it was a funnel.
- **Inconsistency**: two different advisors applied different criteria. The same customer could be approved by one and rejected by another.
- **Zero traceability**: when a case was disputed months later, the only evidence was "the advisor said the voice did not match". Useless for a legal dispute.

I needed to automate without sacrificing human backup. And I needed the system to be extendable without touching code (every month new fraud patterns are added, you cannot deploy for each one).

**The anti-pattern: if/switch with hardcoded rules**

The first attempt was the obvious one: a \`ValidadorIdentidad\` class with a huge \`switch\`:

\`\`\`csharp
// ANTI-PATTERN: hardcoded logic, not extendable
public ResultadoValidacion Validar(Solicitud sol) {
    if (sol.EsClienteNuevo && sol.PaisOrigen == "CO") return CallBot(sol);
    if (sol.MontoSolicitado > 50_000_000) return CallBotAndVideo(sol);
    if (sol.EsClienteNuevo) return CallAdvisor(sol);
    return OtpOnly(sol);
    // ... 200 more branches in production ...
}
\`\`\`

Three problems:
- Every new rule requires a deploy
- Impossible to know which rules were applied to a specific application
- The business team cannot propose changes — it depends on the development team

**The solution: Strategy Pattern + catalog-driven engine**

I rewrote the system in three layers:

\`\`\`
┌──────────────────────────────────────────────┐
│   Orchestration layer: SOVI (orchestrator)   │
└────────────────┬─────────────────────────────┘
                 │
     ┌───────────┴───────────┐
     │                       │
┌────▼──────────┐    ┌───────▼────────┐
│ BOT Ubica     │    │ Manual         │
│ (voice bot +  │    │ Validator      │
│  geolocation) │    │ (human advisor)│
└────┬──────────┘    └───────┬────────┘
     │                       │
     └───────────┬───────────┘
                 │
        ┌────────▼─────────┐
        │ Diagnostic       │
        │ Decision Engine  │
        │ (catalog in DB)  │
        └────────┬─────────┘
                 │
        ┌────────▼─────────┐
        │ CentralSelector  │
        │ (CIFIN/DATACRE-  │
        │  DITO per        │
        │  campaign)       │
        └────────┬─────────┘
                 │
        ┌────────▼─────────┐
        │ Proof of Life    │
        │ V2 (Face Liveness│
        │ with OAuth)      │
        └──────────────────┘
\`\`\`

**Layer 1: Strategy Pattern for BOT vs Manual**

I defined an \`IValidacionStrategy\` interface with two implementations:

\`\`\`csharp
public interface IValidacionStrategy {
    Task<ResultadoValidacion> ValidarAsync(Solicitud solicitud);
    string NombreEstrategia { get; }
}
public class BotValidacionStrategy : IValidacionStrategy {
    public string NombreEstrategia => "BOT_UBICA";
    public async Task<ResultadoValidacion> ValidarAsync(Solicitud s)
        => _engine.Decidir(_engine.Clasificar(await _bot.EjecutarAsync(s)), s);
}
// ManualValidacionStrategy: same interface, assigns advisor
\`\`\`

The SOVI orchestrator decides which strategy to use at runtime, based on business rules (campaign, amount, country, risk score). But the decision **of what to do with the result** lives in the diagnostic engine, not in the orchestrator.

**Layer 2: Diagnostic Decision Engine (catalog-driven)**

The decision engine does not have a single hardcoded \`if\`. All logic lives in a catalog table in the database:

\`\`\`sql
CREATE TABLE cat.CatalogoDiagnosticosBot (
    CodigoDiagnostico VARCHAR(20) PRIMARY KEY,
    Descripcion NVARCHAR(200),
    AccionSistema VARCHAR(50),  -- APROBAR, RECHAZAR, ESCALAR_MANUAL, REINTENTAR
    RequiereCallback BIT,
    TiempoEsperaMinutos INT,
    Activo BIT
);
\`\`\`

When the bot returns, the engine classifies the response into one of the 9 current diagnostic codes and queries the catalog:

\`\`\`csharp
public class DiagnosticoDecisionEngine {
    public DecisionResultado Decidir(string codigo, Solicitud s) {
        var diag = _catalogo.ObtenerDiagnostico(codigo);
        return diag == null
            ? new DecisionResultado(ESCALAR_MANUAL, _paquete.Construir(codigo, s))  // Plan B
            : new DecisionResultado(diag.AccionSistema, diag.RequiereCallback);
    }
}
\`\`\`

The "Inconsistency Package" is an object with all the information the human advisor needs to resolve a case the bot could not classify. **It is not an afterthought fallback**: it is a first-class citizen, designed from day one.

**Layer 3: CentralSelector (configurable credit bureau per campaign)**

Each advertising campaign uses a different bureau (CIFIN, DATACREDITO, or both). The selector avoids hardcoding this:

\`\`\`csharp
public class CentralSelector {
    private readonly ICampanaRepository _campanas;
    public async Task<List<IConsultoraCredito>> SeleccionarAsync(int campanaId) {
        var campana = await _campanas.ObtenerConCentralesAsync(campanaId);
        return campana.Centrales.OrderBy(c => c.OrdenConsulta)
            .Select(c => c.Tipo == TipoCentral.CIFIN ? _cifinProvider : _datacreditoProvider)
            .ToList();
        // Agregar buró = una fila en la tabla, no un cambio de código
    }
}
\`\`\`

Changing the bureau for a campaign is a row in a table, not a code change.

**Layer 4: Proof of Life V2 (Face Liveness OAuth)**

To detect deepfakes and pre-recorded videos, I added Face Liveness Detection with OAuth against an external provider. The integration uses a \`FaceLivenessClient\` with token caching:

\`\`\`csharp
// En FaceLivenessClient: cache de token OAuth con double-checked locking
private static readonly SemaphoreSlim _lock = new(1, 1);
private static string? _token; private static DateTime _expiry;
public static async Task<string> GetTokenAsync() {
    if (_token != null && DateTime.UtcNow < _expiry) return _token;  // fast path
    await _lock.WaitAsync();
    if (_token != null && DateTime.UtcNow < _expiry) return _token;  // re-check
    _token = await _oauth.ObtenerAccessTokenAsync();
    _expiry = DateTime.UtcNow.AddMinutes(50); return _token;  // margen 10 min
}
\`\`\`

The \`SemaphoreSlim\` prevents the thundering herd when multiple concurrent validations need the token at the same time. The 10-minute margin (token valid 60, cache 50) avoids using expired tokens at the last second.

**The hybrid sync/async pattern**

The voice bot operates in synchronous mode from the client perspective: the client waits on the line while the bot asks questions. But internally, some operations are async (bureau query, liveness check). The orchestrator handles this with a hybrid callback pattern:

\`\`\`
Client (sync) → BOT (sync) → SOVI (orchestrates)
                                          │
                                          ├── CIFIN/DATACREDITO (async) ←┐
                                          ├── Face Liveness (async)      │
                                          └── [waits for both results] ─┘
                                          │
                                          ← Consolidated response
\`\`\`

The SOVI waits for both results with a timeout, and if either fails, the diagnostic engine decides whether to escalate to manual or retry.

**The impact**

- **9 diagnostic codes** active in the catalog, each with its specific action
- **6 REST endpoints** exposed: 3 for BOT, 2 for liveness, 1 for status query
- **9 stored procedures** dedicated to the validation module (all with \`sp_\` prefix)
- **Feature flag rollout** gradual: 5% → 25% → 50% → 100% of new campaigns
- **Zero new code** to add a new diagnostic code (it is a row in the table)
- **Manual fallback** with automatic inconsistency package
- **Zero downtime** during deploys: the catalog table is updated without restarting the service

The feature flag is key: each new campaign enters at 5% of traffic. If the manual escalation rate exceeds a threshold (defined per campaign), the rollout stops automatically.

**Lessons learned**

Three lessons that apply to any automated validation system with human fallback:

**1. Plan B as first-class citizen, not afterthought.** The inconsistency package and the manual strategy are designed from the start, not added when things fail. This means that when a case cannot be resolved automatically, the human advisor has EVERYTHING they need to resolve it in seconds, not minutes reconstructing context.

**2. Catalog-driven > hardcoded if/switch.** Any decision rule that may change frequently (fraud codes, validation actions, escalation threshold) must live in the database, not in code. The business team can propose changes, the development team only reviews the catalog structure.

**3. The feature flag is not optional.** The gradual rollout 5→25→50→100% with auto-rollback by escalation threshold is what lets you sleep well. If BOT Ubica fails at the first 5%, it only affects 5% — not the entire production.

If you are designing a validation system with human fallback, assume the bot will fail. Design for failure. And the way to design for failure is to have plan B as first-class code, not as a \`catch\` branch.`,relatedIds:[`clean-architecture-los`,`catalog-driven-decision-engine`,`domain-exception-problemdetails-pipeline`]}].map(e=>({...e,readingTime:S(e.content)}));C.filter(e=>e.featured);function w(e,t){return e.filter(e=>{if(t.tags.length>0&&!t.tags.every(t=>e.tags.includes(t))||t.category&&e.category!==t.category)return!1;if(t.dateRange){let n=new Date(e.date),r=new Date(t.dateRange.start),i=new Date(t.dateRange.end);if(n<r||n>i)return!1}return!0})}var T=n(),E={tags:[],category:null,dateRange:null},D=(0,x.createContext)(null);function O({children:e}){let[t,n]=(0,x.useState)(E),[r,i]=(0,x.useState)(``),[a,o]=(0,x.useState)(null),[s,c]=(0,x.useState)(`list`),[l,u]=(0,x.useState)(1),d=(0,x.useCallback)(()=>{n(E),i(``),u(1)},[]),f={posts:C,filteredPosts:(0,x.useMemo)(()=>w([...C].sort((e,t)=>new Date(t.date).getTime()-new Date(e.date).getTime()),t),[t]),selectedPost:a,filter:t,searchQuery:r,currentRoute:s,page:l,setFilter:n,setSearchQuery:i,setSelectedPost:o,setCurrentRoute:c,setPage:u,clearFilters:d};return(0,T.jsx)(D.Provider,{value:f,children:e})}function k(){let e=(0,x.useContext)(D);if(!e)throw Error(`useBlogContext must be used within BlogProvider`);return e}function A(){let e=window.location.hash.slice(1);if(e===`blog/list`||e===`blog`||e===``)return{currentRoute:`list`,selectedSlug:null,currentParams:{}};let t=e.match(/^blog\/article\/(.+)$/);if(t)return{currentRoute:`article`,selectedSlug:t[1],currentParams:{}};let n=e.match(/^blog\/tag\/(.+)$/);if(n)return{currentRoute:`tag`,selectedSlug:n[1],currentParams:{tag:n[1]}};let r=e.match(/^blog\/search\?(.+)$/);if(r){let e=Object.fromEntries(new URLSearchParams(r[1]));return{currentRoute:`search`,selectedSlug:e.q??null,currentParams:e}}return{currentRoute:`list`,selectedSlug:null,currentParams:{}}}function ee(){let[e,t]=(0,x.useState)(A);(0,x.useEffect)(()=>{let e=()=>t(A());return window.addEventListener(`hashchange`,e),window.addEventListener(`popstate`,e),()=>{window.removeEventListener(`hashchange`,e),window.removeEventListener(`popstate`,e)}},[]);let n=(0,x.useCallback)(e=>{window.location.hash=e},[]);return{...e,navigate:n}}function j({context:e,searchQuery:t=``}){let{lang:n}=u(),{title:r,description:i}={filters:{title:n===`es`?`Sin resultados`:`No results`,description:n===`es`?`No hay artículos que coincidan con los filtros seleccionados. Probá ajustando los criterios.`:`No posts match your current filters. Try adjusting your criteria.`},search:{title:n===`es`?`Sin resultados para "${t}"`:`No results for "${t}"`,description:n===`es`?`No encontramos artículos con ese término. Probá con otras palabras.`:`We couldn't find posts matching that term. Try different keywords.`},none:{title:n===`es`?`Próximamente`:`Coming soon`,description:n===`es`?`Todavía no hay artículos publicados. Volvé pronto.`:`No articles published yet. Check back soon.`}}[e];return(0,T.jsx)(c,{children:(0,T.jsx)(`div`,{className:`border-2 border-rule bg-paper-dark p-8 md:p-12 text-center`,children:(0,T.jsxs)(`div`,{className:`max-w-md mx-auto`,children:[(0,T.jsx)(`h3`,{className:`font-headline text-xl md:text-2xl font-bold text-ink mb-3`,children:r}),(0,T.jsx)(`p`,{className:`font-sans text-sm text-ink-light leading-relaxed`,children:i})]})})})}var M=`portfolio-read-posts`,N=200,P=null;function F(){if(P)return P;try{let e=JSON.parse(localStorage.getItem(M)??`[]`);P=new Set(Array.isArray(e)?e.filter(e=>typeof e==`string`):[])}catch{P=new Set}return P}function I(e){let t=F();t.add(e);try{localStorage.setItem(M,JSON.stringify([...t].slice(-N)))}catch{}}var L=6;function te({post:e,index:t,onRead:n}){let{lang:r}=u(),{theme:i,stillness:a}=m(),o=f(),s=i===`book`,d=!!o||a,p=s&&F().has(e.slug),g=r===`es`?e.title:e.titleEn,_=r===`es`?e.excerpt:e.excerptEn;return(0,T.jsx)(c,{delay:t*.08,children:(0,T.jsx)(`article`,{className:`border-2 border-rule bg-paper shadow-pixel-sm hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all duration-75 flex flex-col h-full`,children:(0,T.jsxs)(`div`,{className:`p-5 flex-1 flex flex-col gap-3`,children:[(0,T.jsx)(`div`,{className:`flex flex-wrap gap-1`,children:e.tags.slice(0,3).map(e=>(0,T.jsxs)(`span`,{className:`skill-tag text-[9px] flex items-center gap-1`,children:[(0,T.jsx)(b,{size:7}),` `,e]},e))}),(0,T.jsxs)(`h3`,{className:`font-headline text-lg font-bold text-ink leading-tight line-clamp-2 flex items-center gap-1.5`,children:[p&&(0,T.jsx)(`span`,{className:`read-mark`,"aria-hidden":`true`}),(0,T.jsx)(l,{text:g,active:s,still:d,deciphered:p,delay:t%6*110}),p&&(0,T.jsx)(`span`,{className:`sr-only`,children:r===`es`?`Leído`:`Read`})]}),(0,T.jsx)(`p`,{className:`font-sans text-xs text-ink-light leading-relaxed line-clamp-3 flex-1`,children:_}),(0,T.jsxs)(`div`,{className:`flex items-center justify-between pt-3 border-t border-rule-light mt-auto`,children:[(0,T.jsxs)(`div`,{className:`flex items-center gap-3`,children:[(0,T.jsx)(`span`,{className:`font-mono text-[10px] text-ink-muted`,children:e.date}),(0,T.jsxs)(`span`,{className:`font-mono text-[10px] text-ink-muted flex items-center gap-1`,children:[(0,T.jsx)(v,{size:9}),` `,e.readingTime,` min`]})]}),(0,T.jsxs)(`button`,{onClick:n,className:`font-mono text-[10px] font-bold uppercase tracking-wider text-accent hover:text-accent-dark flex items-center gap-1 transition-colors cursor-pointer`,children:[r===`es`?`Leer`:`Read`,` `,(0,T.jsx)(h,{size:10})]})]})]})})})}function ne(){let{lang:e}=u(),{filteredPosts:t,page:n,setPage:r}=k(),[a,o]=(0,x.useState)(!1),s=t.length,c=a?s:Math.min(n*L,s),l=c<s,d=()=>{r(n+1)},f=()=>{o(!0)},p=e=>{I(e.slug),history.pushState(null,``,`#blog/article/${e.slug}`),window.dispatchEvent(new HashChangeEvent(`hashchange`))};return s===0?(0,T.jsx)(j,{context:`filters`}):(0,T.jsxs)(`div`,{children:[(0,T.jsx)(`div`,{className:`grid md:grid-cols-2 lg:grid-cols-3 gap-5`,children:t.slice(0,c).map((e,t)=>(0,T.jsx)(i.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.3,delay:t%L*.05},children:(0,T.jsx)(te,{post:e,index:t,onRead:()=>p(e)})},e.id))}),(0,T.jsxs)(`div`,{className:`flex justify-center gap-3 mt-8`,children:[l&&(0,T.jsxs)(T.Fragment,{children:[(0,T.jsx)(`button`,{onClick:d,className:`px-btn`,children:e===`es`?`Cargar más`:`Load more`}),(0,T.jsx)(`button`,{onClick:f,className:`px-btn px-btn-outline`,children:e===`es`?`Mostrar todos`:`Show all`})]}),!l&&s>L&&(0,T.jsxs)(`p`,{className:`font-mono text-[10px] text-ink-muted`,children:[s,` `,e===`es`?`artículos`:`articles`]})]})]})}var re=document.createElement(`i`);function ie(e){let t=`&`+e+`;`;re.innerHTML=t;let n=re.textContent;return n.charCodeAt(n.length-1)===59&&e!==`semi`||n===t?!1:n}function R(e,t,n,r){let i=e.length,a=0,o;if(t=t<0?-t>i?0:i+t:t>i?i:t,n=n>0?n:0,r.length<1e4)o=Array.from(r),o.unshift(t,n),e.splice(...o);else for(n&&e.splice(t,n);a<r.length;)o=r.slice(a,a+1e4),o.unshift(t,0),e.splice(...o),a+=1e4,t+=1e4}function z(e,t){return e.length>0?(R(e,e.length,0,t),e):t}var ae={}.hasOwnProperty;function oe(e){let t={},n=-1;for(;++n<e.length;)se(t,e[n]);return t}function se(e,t){let n;for(n in t){let r=(ae.call(e,n)?e[n]:void 0)||(e[n]={}),i=t[n],a;if(i)for(a in i){ae.call(r,a)||(r[a]=[]);let e=i[a];ce(r[a],Array.isArray(e)?e:e?[e]:[])}}}function ce(e,t){let n=-1,r=[];for(;++n<t.length;)(t[n].add===`after`?e:r).push(t[n]);R(e,0,0,r)}function le(e){let t={},n=-1;for(;++n<e.length;)ue(t,e[n]);return t}function ue(e,t){let n;for(n in t){let r=(ae.call(e,n)?e[n]:void 0)||(e[n]={}),i=t[n],a;if(i)for(a in i)r[a]=i[a]}}function de(e,t){let n=Number.parseInt(e,t);return n<9||n===11||n>13&&n<32||n>126&&n<160||n>55295&&n<57344||n>64975&&n<65008||(n&65535)==65535||(n&65535)==65534||n>1114111?`�`:String.fromCodePoint(n)}var fe={'"':`quot`,"&":`amp`,"<":`lt`,">":`gt`};function pe(e){return e.replace(/["&<>]/g,t);function t(e){return`&`+fe[e]+`;`}}function B(e){return e.replace(/[\t\n\r ]+/g,` `).replace(/^ | $/g,``).toLowerCase().toUpperCase()}var V=K(/[A-Za-z]/),H=K(/[\dA-Za-z]/),me=K(/[#-'*+\--9=?A-Z^-~]/);function he(e){return e!==null&&(e<32||e===127)}var ge=K(/\d/),_e=K(/[\dA-Fa-f]/),ve=K(/[!-/:-@[-`{-~]/);function U(e){return e!==null&&e<-2}function W(e){return e!==null&&(e<0||e===32)}function G(e){return e===-2||e===-1||e===32}var ye=K(/\p{P}|\p{S}/u),be=K(/\s/);function K(e){return t;function t(t){return t!==null&&t>-1&&e.test(String.fromCharCode(t))}}function xe(e,t){let n=pe(q(e||``));if(!t)return n;let r=n.indexOf(`:`),i=n.indexOf(`?`),a=n.indexOf(`#`),o=n.indexOf(`/`);return r<0||o>-1&&r>o||i>-1&&r>i||a>-1&&r>a||t.test(n.slice(0,r))?n:``}function q(e){let t=[],n=-1,r=0,i=0;for(;++n<e.length;){let a=e.charCodeAt(n),o=``;if(a===37&&H(e.charCodeAt(n+1))&&H(e.charCodeAt(n+2)))i=2;else if(a<128)/[!#$&-;=?-Z_a-z~]/.test(String.fromCharCode(a))||(o=String.fromCharCode(a));else if(a>55295&&a<57344){let t=e.charCodeAt(n+1);a<56320&&t>56319&&t<57344?(o=String.fromCharCode(a,t),i=1):o=`�`}else o=String.fromCharCode(a);o&&=(t.push(e.slice(r,n),encodeURIComponent(o)),r=n+i+1,``),i&&=(n+=i,0)}return t.join(``)+e.slice(r)}var Se={}.hasOwnProperty,Ce=/^(https?|ircs?|mailto|xmpp)$/i,we=/^https?$/i;function Te(e){let t=e||{},n=!0,r={},i=[[]],a=[],o=[],s=le([{enter:{blockQuote:A,codeFenced:N,codeFencedFenceInfo:h,codeFencedFenceMeta:h,codeIndented:I,codeText:Me,content:ve,definition:V,definitionDestinationString:me,definitionLabelString:h,definitionTitleString:h,emphasis:Ae,htmlFlow:De,htmlText:ke,image:te,label:h,link:ne,listItemMarker:E,listItemValue:T,listOrdered:C,listUnordered:w,paragraph:j,reference:h,resource:oe,resourceDestinationString:se,resourceTitleString:h,setextHeading:W,strong:je},exit:{atxHeading:ye,atxHeadingSequence:U,autolinkEmail:Y,autolinkProtocol:ze,blockQuote:ee,characterEscapeValue:q,characterReferenceMarkerHexadecimal:Le,characterReferenceMarkerNumeric:Le,characterReferenceValue:Re,codeFenced:L,codeFencedFence:F,codeFencedFenceInfo:P,codeFencedFenceMeta:S,codeFlowValue:J,codeIndented:L,codeText:Ne,codeTextData:q,data:q,definition:_e,definitionDestinationString:he,definitionLabelString:H,definitionTitleString:ge,emphasis:Pe,hardBreakEscape:Ee,hardBreakTrailing:Ee,htmlFlow:Oe,htmlFlowData:q,htmlText:Oe,htmlTextData:q,image:fe,label:R,labelText:re,lineEnding:Te,link:fe,listOrdered:D,listUnordered:O,paragraph:M,reference:S,referenceString:ae,resource:S,resourceDestinationString:ce,resourceTitleString:ue,setextHeading:K,setextHeadingLineSequence:be,setextHeadingText:G,strong:Fe,thematicBreak:Ie}},...t.htmlExtensions||[]]),c={definitions:r,tightStack:o},l={buffer:h,encode:x,getData:m,lineEndingIfNeeded:b,options:t,raw:v,resume:g,setData:p,tag:_},u=t.defaultLineEnding;return d;function d(e){let t=-1,n=0,r=[],a=[],o=[];for(;++t<e.length;)!u&&(e[t][1].type===`lineEnding`||e[t][1].type===`lineEndingBlank`)&&(u=e[t][2].sliceSerialize(e[t][1])),(e[t][1].type===`listOrdered`||e[t][1].type===`listUnordered`)&&(e[t][0]===`enter`?r.push(t):f(e.slice(r.pop(),t))),e[t][1].type===`definition`&&(e[t][0]===`enter`?(o=z(o,e.slice(n,t)),n=t):(a=z(a,e.slice(n,t+1)),n=t+1));a=z(a,o),a=z(a,e.slice(n)),t=-1;let c=a;for(s.enter.null&&s.enter.null.call(l);++t<e.length;){let e=s[c[t][0]],n=c[t][1].type,r=e[n];Se.call(e,n)&&r&&r.call({sliceSerialize:c[t][2].sliceSerialize,...l},c[t][1])}return s.exit.null&&s.exit.null.call(l),i[0].join(``)}function f(e){let t=e.length,n=0,r=0,i=!1,a;for(;++n<t;){let t=e[n];if(t[1]._container)a=void 0,t[0]===`enter`?r++:r--;else switch(t[1].type){case`listItemPrefix`:t[0]===`exit`&&(a=!0);break;case`linePrefix`:break;case`lineEndingBlank`:t[0]===`enter`&&!r&&(a?a=void 0:i=!0);break;default:a=void 0}}e[0][1]._loose=i}function p(e,t){c[e]=t}function m(e){return c[e]}function h(){i.push([])}function g(){return i.pop().join(``)}function _(e){n&&(p(`lastWasTag`,!0),i[i.length-1].push(e))}function v(e){p(`lastWasTag`),i[i.length-1].push(e)}function y(){v(u||`
`)}function b(){let e=i[i.length-1],t=e[e.length-1],n=t?t.charCodeAt(t.length-1):null;n===10||n===13||n===null||y()}function x(e){return m(`ignoreEncode`)?e:pe(e)}function S(){g()}function C(e){o.push(!e._loose),b(),_(`<ol`),p(`expectFirstItem`,!0)}function w(e){o.push(!e._loose),b(),_(`<ul`),p(`expectFirstItem`,!0)}function T(e){if(m(`expectFirstItem`)){let t=Number.parseInt(this.sliceSerialize(e),10);t!==1&&_(` start="`+x(String(t))+`"`)}}function E(){m(`expectFirstItem`)?_(`>`):k(),b(),_(`<li>`),p(`expectFirstItem`),p(`lastWasTag`)}function D(){k(),o.pop(),y(),_(`</ol>`)}function O(){k(),o.pop(),y(),_(`</ul>`)}function k(){m(`lastWasTag`)&&!m(`slurpAllLineEndings`)&&b(),_(`</li>`),p(`slurpAllLineEndings`)}function A(){o.push(!1),b(),_(`<blockquote>`)}function ee(){o.pop(),b(),_(`</blockquote>`),p(`slurpAllLineEndings`)}function j(){o[o.length-1]||(b(),_(`<p>`)),p(`slurpAllLineEndings`)}function M(){o[o.length-1]?p(`slurpAllLineEndings`,!0):_(`</p>`)}function N(){b(),_(`<pre><code`),p(`fencesCount`,0)}function P(){_(` class="language-`+g()+`"`)}function F(){let e=m(`fencesCount`)||0;e||(_(`>`),p(`slurpOneLineEnding`,!0)),p(`fencesCount`,e+1)}function I(){b(),_(`<pre><code>`)}function L(){let e=m(`fencesCount`);e!==void 0&&e<2&&c.tightStack.length>0&&!m(`lastWasTag`)&&y(),m(`flowCodeSeenData`)&&b(),_(`</code></pre>`),e!==void 0&&e<2&&b(),p(`flowCodeSeenData`),p(`fencesCount`),p(`slurpOneLineEnding`)}function te(){a.push({image:!0}),n=void 0}function ne(){a.push({})}function re(e){a[a.length-1].labelId=this.sliceSerialize(e)}function R(){a[a.length-1].label=g()}function ae(e){a[a.length-1].referenceId=this.sliceSerialize(e)}function oe(){h(),a[a.length-1].destination=``}function se(){h(),p(`ignoreEncode`,!0)}function ce(){a[a.length-1].destination=g(),p(`ignoreEncode`)}function ue(){a[a.length-1].title=g()}function fe(){let e=a.length-1,i=a[e],o=i.referenceId||i.labelId,s=i.destination===void 0?r[B(o)]:i;for(n=!0;e--;)if(a[e].image){n=void 0;break}i.image?(_(`<img src="`+xe(s.destination,t.allowDangerousProtocol?void 0:we)+`" alt="`),v(i.label),_(`"`)):_(`<a href="`+xe(s.destination,t.allowDangerousProtocol?void 0:Ce)+`"`),_(s.title?` title="`+s.title+`"`:``),i.image?_(` />`):(_(`>`),v(i.label),_(`</a>`)),a.pop()}function V(){h(),a.push({})}function H(e){g(),a[a.length-1].labelId=this.sliceSerialize(e)}function me(){h(),p(`ignoreEncode`,!0)}function he(){a[a.length-1].destination=g(),p(`ignoreEncode`)}function ge(){a[a.length-1].title=g()}function _e(){let e=a[a.length-1],t=B(e.labelId);g(),Se.call(r,t)||(r[t]=a[a.length-1]),a.pop()}function ve(){p(`slurpAllLineEndings`,!0)}function U(e){m(`headingRank`)||(p(`headingRank`,this.sliceSerialize(e).length),b(),_(`<h`+m(`headingRank`)+`>`))}function W(){h(),p(`slurpAllLineEndings`)}function G(){p(`slurpAllLineEndings`,!0)}function ye(){_(`</h`+m(`headingRank`)+`>`),p(`headingRank`)}function be(e){p(`headingRank`,this.sliceSerialize(e).charCodeAt(0)===61?1:2)}function K(){let e=g();b(),_(`<h`+m(`headingRank`)+`>`),v(e),_(`</h`+m(`headingRank`)+`>`),p(`slurpAllLineEndings`),p(`headingRank`)}function q(e){v(x(this.sliceSerialize(e)))}function Te(e){if(!m(`slurpAllLineEndings`)){if(m(`slurpOneLineEnding`)){p(`slurpOneLineEnding`);return}if(m(`inCodeText`)){v(` `);return}v(x(this.sliceSerialize(e)))}}function J(e){v(x(this.sliceSerialize(e))),p(`flowCodeSeenData`,!0)}function Ee(){_(`<br />`)}function De(){b(),ke()}function Oe(){p(`ignoreEncode`)}function ke(){t.allowDangerousHtml&&p(`ignoreEncode`,!0)}function Ae(){_(`<em>`)}function je(){_(`<strong>`)}function Me(){p(`inCodeText`,!0),_(`<code>`)}function Ne(){p(`inCodeText`),_(`</code>`)}function Pe(){_(`</em>`)}function Fe(){_(`</strong>`)}function Ie(){b(),_(`<hr />`)}function Le(e){p(`characterReferenceType`,e.type)}function Re(e){let t=this.sliceSerialize(e);v(x(m(`characterReferenceType`)?de(t,m(`characterReferenceType`)===`characterReferenceMarkerNumeric`?10:16):ie(t))),p(`characterReferenceType`)}function ze(e){let n=this.sliceSerialize(e);_(`<a href="`+xe(n,t.allowDangerousProtocol?void 0:Ce)+`">`),v(x(n)),_(`</a>`)}function Y(e){let t=this.sliceSerialize(e);_(`<a href="`+xe(`mailto:`+t)+`">`),v(x(t)),_(`</a>`)}}function J(e,t,n,r){let i=r?r-1:1/0,a=0;return o;function o(r){return G(r)?(e.enter(n),s(r)):t(r)}function s(r){return G(r)&&a++<i?(e.consume(r),s):(e.exit(n),t(r))}}var Ee={tokenize:De};function De(e){let t=e.attempt(this.parser.constructs.contentInitial,r,i),n;return t;function r(n){if(n===null){e.consume(n);return}return e.enter(`lineEnding`),e.consume(n),e.exit(`lineEnding`),J(e,t,`linePrefix`)}function i(t){return e.enter(`paragraph`),a(t)}function a(t){let r=e.enter(`chunkText`,{contentType:`text`,previous:n});return n&&(n.next=r),n=r,o(t)}function o(t){if(t===null){e.exit(`chunkText`),e.exit(`paragraph`),e.consume(t);return}return U(t)?(e.consume(t),e.exit(`chunkText`),a):(e.consume(t),o)}}var Oe={tokenize:Ae},ke={tokenize:je};function Ae(e){let t=this,n=[],r=0,i,a,o;return s;function s(i){if(r<n.length){let a=n[r];return t.containerState=a[1],e.attempt(a[0].continuation,c,l)(i)}return l(i)}function c(e){if(r++,t.containerState._closeFlow){t.containerState._closeFlow=void 0,i&&v();let n=t.events.length,a=n,o;for(;a--;)if(t.events[a][0]===`exit`&&t.events[a][1].type===`chunkFlow`){o=t.events[a][1].end;break}_(r);let s=n;for(;s<t.events.length;)t.events[s][1].end={...o},s++;return R(t.events,a+1,0,t.events.slice(n)),t.events.length=s,l(e)}return s(e)}function l(a){if(r===n.length){if(!i)return f(a);if(i.currentConstruct&&i.currentConstruct.concrete)return m(a);t.interrupt=!!(i.currentConstruct&&!i._gfmTableDynamicInterruptHack)}return t.containerState={},e.check(ke,u,d)(a)}function u(e){return i&&v(),_(r),f(e)}function d(e){return t.parser.lazy[t.now().line]=r!==n.length,o=t.now().offset,m(e)}function f(n){return t.containerState={},e.attempt(ke,p,m)(n)}function p(e){return r++,n.push([t.currentConstruct,t.containerState]),f(e)}function m(n){if(n===null){i&&v(),_(0),e.consume(n);return}return i||=t.parser.flow(t.now()),e.enter(`chunkFlow`,{_tokenizer:i,contentType:`flow`,previous:a}),h(n)}function h(n){if(n===null){g(e.exit(`chunkFlow`),!0),_(0),e.consume(n);return}return U(n)?(e.consume(n),g(e.exit(`chunkFlow`)),r=0,t.interrupt=void 0,s):(e.consume(n),h)}function g(e,n){let s=t.sliceStream(e);if(n&&s.push(null),e.previous=a,a&&(a.next=e),a=e,i.defineSkip(e.start),i.write(s),t.parser.lazy[e.start.line]){let e=i.events.length;for(;e--;)if(i.events[e][1].start.offset<o&&(!i.events[e][1].end||i.events[e][1].end.offset>o))return;let n=t.events.length,a=n,s,c;for(;a--;)if(t.events[a][0]===`exit`&&t.events[a][1].type===`chunkFlow`){if(s){c=t.events[a][1].end;break}s=!0}for(_(r),e=n;e<t.events.length;)t.events[e][1].end={...c},e++;R(t.events,a+1,0,t.events.slice(n)),t.events.length=e}}function _(r){let i=n.length;for(;i-- >r;){let r=n[i];t.containerState=r[1],r[0].exit.call(t,e)}n.length=r}function v(){i.write([null]),a=void 0,i=void 0,t.containerState._closeFlow=void 0}}function je(e,t,n){return J(e,e.attempt(this.parser.constructs.document,t,n),`linePrefix`,this.parser.constructs.disable.null.includes(`codeIndented`)?void 0:4)}function Me(e){if(e===null||W(e)||be(e))return 1;if(ye(e))return 2}function Ne(e,t,n){let r=[],i=-1;for(;++i<e.length;){let a=e[i].resolveAll;a&&!r.includes(a)&&(t=a(t,n),r.push(a))}return t}var Pe={name:`attention`,resolveAll:Fe,tokenize:Ie};function Fe(e,t){let n=-1,r,i,a,o,s,c,l,u;for(;++n<e.length;)if(e[n][0]===`enter`&&e[n][1].type===`attentionSequence`&&e[n][1]._close){for(r=n;r--;)if(e[r][0]===`exit`&&e[r][1].type===`attentionSequence`&&e[r][1]._open&&t.sliceSerialize(e[r][1]).charCodeAt(0)===t.sliceSerialize(e[n][1]).charCodeAt(0)){if((e[r][1]._close||e[n][1]._open)&&(e[n][1].end.offset-e[n][1].start.offset)%3&&!((e[r][1].end.offset-e[r][1].start.offset+e[n][1].end.offset-e[n][1].start.offset)%3))continue;c=e[r][1].end.offset-e[r][1].start.offset>1&&e[n][1].end.offset-e[n][1].start.offset>1?2:1;let d={...e[r][1].end},f={...e[n][1].start};Le(d,-c),Le(f,c),o={type:c>1?`strongSequence`:`emphasisSequence`,start:d,end:{...e[r][1].end}},s={type:c>1?`strongSequence`:`emphasisSequence`,start:{...e[n][1].start},end:f},a={type:c>1?`strongText`:`emphasisText`,start:{...e[r][1].end},end:{...e[n][1].start}},i={type:c>1?`strong`:`emphasis`,start:{...o.start},end:{...s.end}},e[r][1].end={...o.start},e[n][1].start={...s.end},l=[],e[r][1].end.offset-e[r][1].start.offset&&(l=z(l,[[`enter`,e[r][1],t],[`exit`,e[r][1],t]])),l=z(l,[[`enter`,i,t],[`enter`,o,t],[`exit`,o,t],[`enter`,a,t]]),l=z(l,Ne(t.parser.constructs.insideSpan.null,e.slice(r+1,n),t)),l=z(l,[[`exit`,a,t],[`enter`,s,t],[`exit`,s,t],[`exit`,i,t]]),e[n][1].end.offset-e[n][1].start.offset?(u=2,l=z(l,[[`enter`,e[n][1],t],[`exit`,e[n][1],t]])):u=0,R(e,r-1,n-r+3,l),n=r+l.length-u-2;break}}for(n=-1;++n<e.length;)e[n][1].type===`attentionSequence`&&(e[n][1].type=`data`);return e}function Ie(e,t){let n=this.parser.constructs.attentionMarkers.null,r=this.previous,i=Me(r),a;return o;function o(t){return a=t,e.enter(`attentionSequence`),s(t)}function s(o){if(o===a)return e.consume(o),s;let c=e.exit(`attentionSequence`),l=Me(o),u=!l||l===2&&i||n.includes(o),d=!i||i===2&&l||n.includes(r);return c._open=!!(a===42?u:u&&(i||!d)),c._close=!!(a===42?d:d&&(l||!u)),t(o)}}function Le(e,t){e.column+=t,e.offset+=t,e._bufferIndex+=t}var Re={name:`autolink`,tokenize:ze};function ze(e,t,n){let r=0;return i;function i(t){return e.enter(`autolink`),e.enter(`autolinkMarker`),e.consume(t),e.exit(`autolinkMarker`),e.enter(`autolinkProtocol`),a}function a(t){return V(t)?(e.consume(t),o):t===64?n(t):l(t)}function o(e){return e===43||e===45||e===46||H(e)?(r=1,s(e)):l(e)}function s(t){return t===58?(e.consume(t),r=0,c):(t===43||t===45||t===46||H(t))&&r++<32?(e.consume(t),s):(r=0,l(t))}function c(r){return r===62?(e.exit(`autolinkProtocol`),e.enter(`autolinkMarker`),e.consume(r),e.exit(`autolinkMarker`),e.exit(`autolink`),t):r===null||r===32||r===60||he(r)?n(r):(e.consume(r),c)}function l(t){return t===64?(e.consume(t),u):me(t)?(e.consume(t),l):n(t)}function u(e){return H(e)?d(e):n(e)}function d(n){return n===46?(e.consume(n),r=0,u):n===62?(e.exit(`autolinkProtocol`).type=`autolinkEmail`,e.enter(`autolinkMarker`),e.consume(n),e.exit(`autolinkMarker`),e.exit(`autolink`),t):f(n)}function f(t){if((t===45||H(t))&&r++<63){let n=t===45?f:d;return e.consume(t),n}return n(t)}}var Y={partial:!0,tokenize:Be};function Be(e,t,n){return r;function r(t){return G(t)?J(e,i,`linePrefix`)(t):i(t)}function i(e){return e===null||U(e)?t(e):n(e)}}var Ve={continuation:{tokenize:Ue},exit:We,name:`blockQuote`,tokenize:He};function He(e,t,n){let r=this;return i;function i(t){if(t===62){let n=r.containerState;return n.open||=(e.enter(`blockQuote`,{_container:!0}),!0),e.enter(`blockQuotePrefix`),e.enter(`blockQuoteMarker`),e.consume(t),e.exit(`blockQuoteMarker`),a}return n(t)}function a(n){return G(n)?(e.enter(`blockQuotePrefixWhitespace`),e.consume(n),e.exit(`blockQuotePrefixWhitespace`),e.exit(`blockQuotePrefix`),t):(e.exit(`blockQuotePrefix`),t(n))}}function Ue(e,t,n){let r=this;return i;function i(t){return G(t)?J(e,a,`linePrefix`,r.parser.constructs.disable.null.includes(`codeIndented`)?void 0:4)(t):a(t)}function a(r){return e.attempt(Ve,t,n)(r)}}function We(e){e.exit(`blockQuote`)}var Ge={name:`characterEscape`,tokenize:Ke};function Ke(e,t,n){return r;function r(t){return e.enter(`characterEscape`),e.enter(`escapeMarker`),e.consume(t),e.exit(`escapeMarker`),i}function i(r){return ve(r)?(e.enter(`characterEscapeValue`),e.consume(r),e.exit(`characterEscapeValue`),e.exit(`characterEscape`),t):n(r)}}var qe={name:`characterReference`,tokenize:Je};function Je(e,t,n){let r=this,i=0,a,o;return s;function s(t){return e.enter(`characterReference`),e.enter(`characterReferenceMarker`),e.consume(t),e.exit(`characterReferenceMarker`),c}function c(t){return t===35?(e.enter(`characterReferenceMarkerNumeric`),e.consume(t),e.exit(`characterReferenceMarkerNumeric`),l):(e.enter(`characterReferenceValue`),a=31,o=H,u(t))}function l(t){return t===88||t===120?(e.enter(`characterReferenceMarkerHexadecimal`),e.consume(t),e.exit(`characterReferenceMarkerHexadecimal`),e.enter(`characterReferenceValue`),a=6,o=_e,u):(e.enter(`characterReferenceValue`),a=7,o=ge,u(t))}function u(s){if(s===59&&i){let i=e.exit(`characterReferenceValue`);return o===H&&!ie(r.sliceSerialize(i))?n(s):(e.enter(`characterReferenceMarker`),e.consume(s),e.exit(`characterReferenceMarker`),e.exit(`characterReference`),t)}return o(s)&&i++<a?(e.consume(s),u):n(s)}}var Ye={partial:!0,tokenize:Qe},Xe={concrete:!0,name:`codeFenced`,tokenize:Ze};function Ze(e,t,n){let r=this,i={partial:!0,tokenize:x},a=0,o=0,s;return c;function c(e){return l(e)}function l(t){let n=r.events[r.events.length-1];return a=n&&n[1].type===`linePrefix`?n[2].sliceSerialize(n[1],!0).length:0,s=t,e.enter(`codeFenced`),e.enter(`codeFencedFence`),e.enter(`codeFencedFenceSequence`),u(t)}function u(t){return t===s?(o++,e.consume(t),u):o<3?n(t):(e.exit(`codeFencedFenceSequence`),G(t)?J(e,d,`whitespace`)(t):d(t))}function d(n){return n===null||U(n)?(e.exit(`codeFencedFence`),r.interrupt?t(n):e.check(Ye,h,b)(n)):(e.enter(`codeFencedFenceInfo`),e.enter(`chunkString`,{contentType:`string`}),f(n))}function f(t){return t===null||U(t)?(e.exit(`chunkString`),e.exit(`codeFencedFenceInfo`),d(t)):G(t)?(e.exit(`chunkString`),e.exit(`codeFencedFenceInfo`),J(e,p,`whitespace`)(t)):t===96&&t===s?n(t):(e.consume(t),f)}function p(t){return t===null||U(t)?d(t):(e.enter(`codeFencedFenceMeta`),e.enter(`chunkString`,{contentType:`string`}),m(t))}function m(t){return t===null||U(t)?(e.exit(`chunkString`),e.exit(`codeFencedFenceMeta`),d(t)):t===96&&t===s?n(t):(e.consume(t),m)}function h(t){return e.attempt(i,b,g)(t)}function g(t){return e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),_}function _(t){return a>0&&G(t)?J(e,v,`linePrefix`,a+1)(t):v(t)}function v(t){return t===null||U(t)?e.check(Ye,h,b)(t):(e.enter(`codeFlowValue`),y(t))}function y(t){return t===null||U(t)?(e.exit(`codeFlowValue`),v(t)):(e.consume(t),y)}function b(n){return e.exit(`codeFenced`),t(n)}function x(e,t,n){let i=0;return a;function a(t){return e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),c}function c(t){return e.enter(`codeFencedFence`),G(t)?J(e,l,`linePrefix`,r.parser.constructs.disable.null.includes(`codeIndented`)?void 0:4)(t):l(t)}function l(t){return t===s?(e.enter(`codeFencedFenceSequence`),u(t)):n(t)}function u(t){return t===s?(i++,e.consume(t),u):i>=o?(e.exit(`codeFencedFenceSequence`),G(t)?J(e,d,`whitespace`)(t):d(t)):n(t)}function d(r){return r===null||U(r)?(e.exit(`codeFencedFence`),t(r)):n(r)}}}function Qe(e,t,n){let r=this;return i;function i(t){return t===null?n(t):(e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),a)}function a(e){return r.parser.lazy[r.now().line]?n(e):t(e)}}var $e={name:`codeIndented`,tokenize:tt},et={partial:!0,tokenize:nt};function tt(e,t,n){let r=this;return i;function i(t){return e.enter(`codeIndented`),J(e,a,`linePrefix`,5)(t)}function a(e){let t=r.events[r.events.length-1];return t&&t[1].type===`linePrefix`&&t[2].sliceSerialize(t[1],!0).length>=4?o(e):n(e)}function o(t){return t===null?c(t):U(t)?e.attempt(et,o,c)(t):(e.enter(`codeFlowValue`),s(t))}function s(t){return t===null||U(t)?(e.exit(`codeFlowValue`),o(t)):(e.consume(t),s)}function c(n){return e.exit(`codeIndented`),t(n)}}function nt(e,t,n){let r=this;return i;function i(t){return r.parser.lazy[r.now().line]?n(t):U(t)?(e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),i):J(e,a,`linePrefix`,5)(t)}function a(e){let a=r.events[r.events.length-1];return a&&a[1].type===`linePrefix`&&a[2].sliceSerialize(a[1],!0).length>=4?t(e):U(e)?i(e):n(e)}}var rt={name:`codeText`,previous:at,resolve:it,tokenize:ot};function it(e){let t=e.length-4,n=3,r,i;if((e[n][1].type===`lineEnding`||e[n][1].type===`space`)&&(e[t][1].type===`lineEnding`||e[t][1].type===`space`)){for(r=n;++r<t;)if(e[r][1].type===`codeTextData`){e[n][1].type=`codeTextPadding`,e[t][1].type=`codeTextPadding`,n+=2,t-=2;break}}for(r=n-1,t++;++r<=t;)i===void 0?r!==t&&e[r][1].type!==`lineEnding`&&(i=r):(r===t||e[r][1].type===`lineEnding`)&&(e[i][1].type=`codeTextData`,r!==i+2&&(e[i][1].end=e[r-1][1].end,e.splice(i+2,r-i-2),t-=r-i-2,r=i+2),i=void 0);return e}function at(e){return e!==96||this.events[this.events.length-1][1].type===`characterEscape`}function ot(e,t,n){let r=0,i,a;return o;function o(t){return e.enter(`codeText`),e.enter(`codeTextSequence`),s(t)}function s(t){return t===96?(e.consume(t),r++,s):(e.exit(`codeTextSequence`),c(t))}function c(t){return t===null?n(t):t===32?(e.enter(`space`),e.consume(t),e.exit(`space`),c):t===96?(a=e.enter(`codeTextSequence`),i=0,u(t)):U(t)?(e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),c):(e.enter(`codeTextData`),l(t))}function l(t){return t===null||t===32||t===96||U(t)?(e.exit(`codeTextData`),c(t)):(e.consume(t),l)}function u(n){return n===96?(e.consume(n),i++,u):i===r?(e.exit(`codeTextSequence`),e.exit(`codeText`),t(n)):(a.type=`codeTextData`,l(n))}}var st=class{constructor(e){this.left=e?[...e]:[],this.right=[]}get(e){if(e<0||e>=this.left.length+this.right.length)throw RangeError("Cannot access index `"+e+"` in a splice buffer of size `"+(this.left.length+this.right.length)+"`");return e<this.left.length?this.left[e]:this.right[this.right.length-e+this.left.length-1]}get length(){return this.left.length+this.right.length}shift(){return this.setCursor(0),this.right.pop()}slice(e,t){let n=t??1/0;return n<this.left.length?this.left.slice(e,n):e>this.left.length?this.right.slice(this.right.length-n+this.left.length,this.right.length-e+this.left.length).reverse():this.left.slice(e).concat(this.right.slice(this.right.length-n+this.left.length).reverse())}splice(e,t,n){let r=t||0;this.setCursor(Math.trunc(e));let i=this.right.splice(this.right.length-r,1/0);return n&&X(this.left,n),i.reverse()}pop(){return this.setCursor(1/0),this.left.pop()}push(e){this.setCursor(1/0),this.left.push(e)}pushMany(e){this.setCursor(1/0),X(this.left,e)}unshift(e){this.setCursor(0),this.right.push(e)}unshiftMany(e){this.setCursor(0),X(this.right,e.reverse())}setCursor(e){if(!(e===this.left.length||e>this.left.length&&this.right.length===0||e<0&&this.left.length===0))if(e<this.left.length){let t=this.left.splice(e,1/0);X(this.right,t.reverse())}else{let t=this.right.splice(this.left.length+this.right.length-e,1/0);X(this.left,t.reverse())}}};function X(e,t){let n=0;if(t.length<1e4)e.push(...t);else for(;n<t.length;)e.push(...t.slice(n,n+1e4)),n+=1e4}function ct(e){let t={},n=-1,r,i,a,o,s,c,l,u=new st(e);for(;++n<u.length;){for(;n in t;)n=t[n];if(r=u.get(n),n&&r[1].type===`chunkFlow`&&u.get(n-1)[1].type===`listItemPrefix`&&(c=r[1]._tokenizer.events,a=0,a<c.length&&c[a][1].type===`lineEndingBlank`&&(a+=2),a<c.length&&c[a][1].type===`content`))for(;++a<c.length&&c[a][1].type!==`content`;)c[a][1].type===`chunkText`&&(c[a][1]._isInFirstContentOfListItem=!0,a++);if(r[0]===`enter`)r[1].contentType&&(Object.assign(t,lt(u,n)),n=t[n],l=!0);else if(r[1]._container){for(a=n,i=void 0;a--;)if(o=u.get(a),o[1].type===`lineEnding`||o[1].type===`lineEndingBlank`)o[0]===`enter`&&(i&&(u.get(i)[1].type=`lineEndingBlank`),o[1].type=`lineEnding`,i=a);else if(!(o[1].type===`linePrefix`||o[1].type===`listItemIndent`))break;i&&(r[1].end={...u.get(i)[1].start},s=u.slice(i,n),s.unshift(r),u.splice(i,n-i+1,s))}}return R(e,0,1/0,u.slice(0)),!l}function lt(e,t){let n=e.get(t)[1],r=e.get(t)[2],i=t-1,a=[],o=n._tokenizer;o||(o=r.parser[n.contentType](n.start),n._contentTypeTextTrailing&&(o._contentTypeTextTrailing=!0));let s=o.events,c=[],l={},u,d,f=-1,p=n,m=0,h=0,g=[h];for(;p;){for(;e.get(++i)[1]!==p;);a.push(i),p._tokenizer||(u=r.sliceStream(p),p.next||u.push(null),d&&o.defineSkip(p.start),p._isInFirstContentOfListItem&&(o._gfmTasklistFirstContentOfListItem=!0),o.write(u),p._isInFirstContentOfListItem&&(o._gfmTasklistFirstContentOfListItem=void 0)),d=p,p=p.next}for(p=n;++f<s.length;)s[f][0]===`exit`&&s[f-1][0]===`enter`&&s[f][1].type===s[f-1][1].type&&s[f][1].start.line!==s[f][1].end.line&&(h=f+1,g.push(h),p._tokenizer=void 0,p.previous=void 0,p=p.next);for(o.events=[],p?(p._tokenizer=void 0,p.previous=void 0):g.pop(),f=g.length;f--;){let t=s.slice(g[f],g[f+1]),n=a.pop();c.push([n,n+t.length-1]),e.splice(n,2,t)}for(c.reverse(),f=-1;++f<c.length;)l[m+c[f][0]]=m+c[f][1],m+=c[f][1]-c[f][0]-1;return l}var ut={resolve:ft,tokenize:pt},dt={partial:!0,tokenize:mt};function ft(e){return ct(e),e}function pt(e,t){let n;return r;function r(t){return e.enter(`content`),n=e.enter(`chunkContent`,{contentType:`content`}),i(t)}function i(t){return t===null?a(t):U(t)?e.check(dt,o,a)(t):(e.consume(t),i)}function a(n){return e.exit(`chunkContent`),e.exit(`content`),t(n)}function o(t){return e.consume(t),e.exit(`chunkContent`),n.next=e.enter(`chunkContent`,{contentType:`content`,previous:n}),n=n.next,i}}function mt(e,t,n){let r=this;return i;function i(t){return e.exit(`chunkContent`),e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),J(e,a,`linePrefix`)}function a(i){if(i===null||U(i))return n(i);let a=r.events[r.events.length-1];return!r.parser.constructs.disable.null.includes(`codeIndented`)&&a&&a[1].type===`linePrefix`&&a[2].sliceSerialize(a[1],!0).length>=4?t(i):e.interrupt(r.parser.constructs.flow,n,t)(i)}}function ht(e,t,n,r,i,a,o,s,c){let l=c||1/0,u=0;return d;function d(t){return t===60?(e.enter(r),e.enter(i),e.enter(a),e.consume(t),e.exit(a),f):t===null||t===32||t===41||he(t)?n(t):(e.enter(r),e.enter(o),e.enter(s),e.enter(`chunkString`,{contentType:`string`}),h(t))}function f(n){return n===62?(e.enter(a),e.consume(n),e.exit(a),e.exit(i),e.exit(r),t):(e.enter(s),e.enter(`chunkString`,{contentType:`string`}),p(n))}function p(t){return t===62?(e.exit(`chunkString`),e.exit(s),f(t)):t===null||t===60||U(t)?n(t):(e.consume(t),t===92?m:p)}function m(t){return t===60||t===62||t===92?(e.consume(t),p):p(t)}function h(i){return!u&&(i===null||i===41||W(i))?(e.exit(`chunkString`),e.exit(s),e.exit(o),e.exit(r),t(i)):u<l&&i===40?(e.consume(i),u++,h):i===41?(e.consume(i),u--,h):i===null||i===32||i===40||he(i)?n(i):(e.consume(i),i===92?g:h)}function g(t){return t===40||t===41||t===92?(e.consume(t),h):h(t)}}function gt(e,t,n,r,i,a){let o=this,s=0,c;return l;function l(t){return e.enter(r),e.enter(i),e.consume(t),e.exit(i),e.enter(a),u}function u(l){return s>999||l===null||l===91||l===93&&!c||l===94&&!s&&`_hiddenFootnoteSupport`in o.parser.constructs?n(l):l===93?(e.exit(a),e.enter(i),e.consume(l),e.exit(i),e.exit(r),t):U(l)?(e.enter(`lineEnding`),e.consume(l),e.exit(`lineEnding`),u):(e.enter(`chunkString`,{contentType:`string`}),d(l))}function d(t){return t===null||t===91||t===93||U(t)||s++>999?(e.exit(`chunkString`),u(t)):(e.consume(t),c||=!G(t),t===92?f:d)}function f(t){return t===91||t===92||t===93?(e.consume(t),s++,d):d(t)}}function _t(e,t,n,r,i,a){let o;return s;function s(t){return t===34||t===39||t===40?(e.enter(r),e.enter(i),e.consume(t),e.exit(i),o=t===40?41:t,c):n(t)}function c(n){return n===o?(e.enter(i),e.consume(n),e.exit(i),e.exit(r),t):(e.enter(a),l(n))}function l(t){return t===o?(e.exit(a),c(o)):t===null?n(t):U(t)?(e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),J(e,l,`linePrefix`)):(e.enter(`chunkString`,{contentType:`string`}),u(t))}function u(t){return t===o||t===null||U(t)?(e.exit(`chunkString`),l(t)):(e.consume(t),t===92?d:u)}function d(t){return t===o||t===92?(e.consume(t),u):u(t)}}function vt(e,t){let n;return r;function r(i){return U(i)?(e.enter(`lineEnding`),e.consume(i),e.exit(`lineEnding`),n=!0,r):G(i)?J(e,r,n?`linePrefix`:`lineSuffix`)(i):t(i)}}var yt={name:`definition`,tokenize:xt},bt={partial:!0,tokenize:St};function xt(e,t,n){let r=this,i;return a;function a(t){return e.enter(`definition`),o(t)}function o(t){return gt.call(r,e,s,n,`definitionLabel`,`definitionLabelMarker`,`definitionLabelString`)(t)}function s(t){return i=B(r.sliceSerialize(r.events[r.events.length-1][1]).slice(1,-1)),t===58?(e.enter(`definitionMarker`),e.consume(t),e.exit(`definitionMarker`),c):n(t)}function c(t){return W(t)?vt(e,l)(t):l(t)}function l(t){return ht(e,u,n,`definitionDestination`,`definitionDestinationLiteral`,`definitionDestinationLiteralMarker`,`definitionDestinationRaw`,`definitionDestinationString`)(t)}function u(t){return e.attempt(bt,d,d)(t)}function d(t){return G(t)?J(e,f,`whitespace`)(t):f(t)}function f(a){return a===null||U(a)?(e.exit(`definition`),r.parser.defined.push(i),t(a)):n(a)}}function St(e,t,n){return r;function r(t){return W(t)?vt(e,i)(t):n(t)}function i(t){return _t(e,a,n,`definitionTitle`,`definitionTitleMarker`,`definitionTitleString`)(t)}function a(t){return G(t)?J(e,o,`whitespace`)(t):o(t)}function o(e){return e===null||U(e)?t(e):n(e)}}var Ct={name:`hardBreakEscape`,tokenize:wt};function wt(e,t,n){return r;function r(t){return e.enter(`hardBreakEscape`),e.consume(t),i}function i(r){return U(r)?(e.exit(`hardBreakEscape`),t(r)):n(r)}}var Tt={name:`headingAtx`,resolve:Et,tokenize:Dt};function Et(e,t){let n=e.length-2,r=3,i,a;return e[r][1].type===`whitespace`&&(r+=2),n-2>r&&e[n][1].type===`whitespace`&&(n-=2),e[n][1].type===`atxHeadingSequence`&&(r===n-1||n-4>r&&e[n-2][1].type===`whitespace`)&&(n-=r+1===n?2:4),n>r&&(i={type:`atxHeadingText`,start:e[r][1].start,end:e[n][1].end},a={type:`chunkText`,start:e[r][1].start,end:e[n][1].end,contentType:`text`},R(e,r,n-r+1,[[`enter`,i,t],[`enter`,a,t],[`exit`,a,t],[`exit`,i,t]])),e}function Dt(e,t,n){let r=0;return i;function i(t){return e.enter(`atxHeading`),a(t)}function a(t){return e.enter(`atxHeadingSequence`),o(t)}function o(t){return t===35&&r++<6?(e.consume(t),o):t===null||W(t)?(e.exit(`atxHeadingSequence`),s(t)):n(t)}function s(n){return n===35?(e.enter(`atxHeadingSequence`),c(n)):n===null||U(n)?(e.exit(`atxHeading`),t(n)):G(n)?J(e,s,`whitespace`)(n):(e.enter(`atxHeadingText`),l(n))}function c(t){return t===35?(e.consume(t),c):(e.exit(`atxHeadingSequence`),s(t))}function l(t){return t===null||t===35||W(t)?(e.exit(`atxHeadingText`),s(t)):(e.consume(t),l)}}var Ot=`address.article.aside.base.basefont.blockquote.body.caption.center.col.colgroup.dd.details.dialog.dir.div.dl.dt.fieldset.figcaption.figure.footer.form.frame.frameset.h1.h2.h3.h4.h5.h6.head.header.hr.html.iframe.legend.li.link.main.menu.menuitem.nav.noframes.ol.optgroup.option.p.param.search.section.summary.table.tbody.td.tfoot.th.thead.title.tr.track.ul`.split(`.`),kt=[`pre`,`script`,`style`,`textarea`],At={concrete:!0,name:`htmlFlow`,resolveTo:Nt,tokenize:Pt},jt={partial:!0,tokenize:It},Mt={partial:!0,tokenize:Ft};function Nt(e){let t=e.length;for(;t--&&!(e[t][0]===`enter`&&e[t][1].type===`htmlFlow`););return t>1&&e[t-2][1].type===`linePrefix`&&(e[t][1].start=e[t-2][1].start,e[t+1][1].start=e[t-2][1].start,e.splice(t-2,2)),e}function Pt(e,t,n){let r=this,i,a,o,s,c;return l;function l(e){return u(e)}function u(t){return e.enter(`htmlFlow`),e.enter(`htmlFlowData`),e.consume(t),d}function d(s){return s===33?(e.consume(s),f):s===47?(e.consume(s),a=!0,h):s===63?(e.consume(s),i=3,r.interrupt?t:F):V(s)?(e.consume(s),o=String.fromCharCode(s),g):n(s)}function f(a){return a===45?(e.consume(a),i=2,p):a===91?(e.consume(a),i=5,s=0,m):V(a)?(e.consume(a),i=4,r.interrupt?t:F):n(a)}function p(i){return i===45?(e.consume(i),r.interrupt?t:F):n(i)}function m(i){return i===`CDATA[`.charCodeAt(s++)?(e.consume(i),s===6?r.interrupt?t:O:m):n(i)}function h(t){return V(t)?(e.consume(t),o=String.fromCharCode(t),g):n(t)}function g(s){if(s===null||s===47||s===62||W(s)){let c=s===47,l=o.toLowerCase();return!c&&!a&&kt.includes(l)?(i=1,r.interrupt?t(s):O(s)):Ot.includes(o.toLowerCase())?(i=6,c?(e.consume(s),_):r.interrupt?t(s):O(s)):(i=7,r.interrupt&&!r.parser.lazy[r.now().line]?n(s):a?v(s):y(s))}return s===45||H(s)?(e.consume(s),o+=String.fromCharCode(s),g):n(s)}function _(i){return i===62?(e.consume(i),r.interrupt?t:O):n(i)}function v(t){return G(t)?(e.consume(t),v):E(t)}function y(t){return t===47?(e.consume(t),E):t===58||t===95||V(t)?(e.consume(t),b):G(t)?(e.consume(t),y):E(t)}function b(t){return t===45||t===46||t===58||t===95||H(t)?(e.consume(t),b):x(t)}function x(t){return t===61?(e.consume(t),S):G(t)?(e.consume(t),x):y(t)}function S(t){return t===null||t===60||t===61||t===62||t===96?n(t):t===34||t===39?(e.consume(t),c=t,C):G(t)?(e.consume(t),S):w(t)}function C(t){return t===c?(e.consume(t),c=null,T):t===null||U(t)?n(t):(e.consume(t),C)}function w(t){return t===null||t===34||t===39||t===47||t===60||t===61||t===62||t===96||W(t)?x(t):(e.consume(t),w)}function T(e){return e===47||e===62||G(e)?y(e):n(e)}function E(t){return t===62?(e.consume(t),D):n(t)}function D(t){return t===null||U(t)?O(t):G(t)?(e.consume(t),D):n(t)}function O(t){return t===45&&i===2?(e.consume(t),j):t===60&&i===1?(e.consume(t),M):t===62&&i===4?(e.consume(t),I):t===63&&i===3?(e.consume(t),F):t===93&&i===5?(e.consume(t),P):U(t)&&(i===6||i===7)?(e.exit(`htmlFlowData`),e.check(jt,L,k)(t)):t===null||U(t)?(e.exit(`htmlFlowData`),k(t)):(e.consume(t),O)}function k(t){return e.check(Mt,A,L)(t)}function A(t){return e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),ee}function ee(t){return t===null||U(t)?k(t):(e.enter(`htmlFlowData`),O(t))}function j(t){return t===45?(e.consume(t),F):O(t)}function M(t){return t===47?(e.consume(t),o=``,N):O(t)}function N(t){if(t===62){let n=o.toLowerCase();return kt.includes(n)?(e.consume(t),I):O(t)}return V(t)&&o.length<8?(e.consume(t),o+=String.fromCharCode(t),N):O(t)}function P(t){return t===93?(e.consume(t),F):O(t)}function F(t){return t===62?(e.consume(t),I):t===45&&i===2?(e.consume(t),F):O(t)}function I(t){return t===null||U(t)?(e.exit(`htmlFlowData`),L(t)):(e.consume(t),I)}function L(n){return e.exit(`htmlFlow`),t(n)}}function Ft(e,t,n){let r=this;return i;function i(t){return U(t)?(e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),a):n(t)}function a(e){return r.parser.lazy[r.now().line]?n(e):t(e)}}function It(e,t,n){return r;function r(r){return e.enter(`lineEnding`),e.consume(r),e.exit(`lineEnding`),e.attempt(Y,t,n)}}var Lt={name:`htmlText`,tokenize:Rt};function Rt(e,t,n){let r=this,i,a,o;return s;function s(t){return e.enter(`htmlText`),e.enter(`htmlTextData`),e.consume(t),c}function c(t){return t===33?(e.consume(t),l):t===47?(e.consume(t),x):t===63?(e.consume(t),y):V(t)?(e.consume(t),w):n(t)}function l(t){return t===45?(e.consume(t),u):t===91?(e.consume(t),a=0,m):V(t)?(e.consume(t),v):n(t)}function u(t){return t===45?(e.consume(t),p):n(t)}function d(t){return t===null?n(t):t===45?(e.consume(t),f):U(t)?(o=d,M(t)):(e.consume(t),d)}function f(t){return t===45?(e.consume(t),p):d(t)}function p(e){return e===62?j(e):e===45?f(e):d(e)}function m(t){return t===`CDATA[`.charCodeAt(a++)?(e.consume(t),a===6?h:m):n(t)}function h(t){return t===null?n(t):t===93?(e.consume(t),g):U(t)?(o=h,M(t)):(e.consume(t),h)}function g(t){return t===93?(e.consume(t),_):h(t)}function _(t){return t===62?j(t):t===93?(e.consume(t),_):h(t)}function v(t){return t===null||t===62?j(t):U(t)?(o=v,M(t)):(e.consume(t),v)}function y(t){return t===null?n(t):t===63?(e.consume(t),b):U(t)?(o=y,M(t)):(e.consume(t),y)}function b(e){return e===62?j(e):y(e)}function x(t){return V(t)?(e.consume(t),S):n(t)}function S(t){return t===45||H(t)?(e.consume(t),S):C(t)}function C(t){return U(t)?(o=C,M(t)):G(t)?(e.consume(t),C):j(t)}function w(t){return t===45||H(t)?(e.consume(t),w):t===47||t===62||W(t)?T(t):n(t)}function T(t){return t===47?(e.consume(t),j):t===58||t===95||V(t)?(e.consume(t),E):U(t)?(o=T,M(t)):G(t)?(e.consume(t),T):j(t)}function E(t){return t===45||t===46||t===58||t===95||H(t)?(e.consume(t),E):D(t)}function D(t){return t===61?(e.consume(t),O):U(t)?(o=D,M(t)):G(t)?(e.consume(t),D):T(t)}function O(t){return t===null||t===60||t===61||t===62||t===96?n(t):t===34||t===39?(e.consume(t),i=t,k):U(t)?(o=O,M(t)):G(t)?(e.consume(t),O):(e.consume(t),A)}function k(t){return t===i?(e.consume(t),i=void 0,ee):t===null?n(t):U(t)?(o=k,M(t)):(e.consume(t),k)}function A(t){return t===null||t===34||t===39||t===60||t===61||t===96?n(t):t===47||t===62||W(t)?T(t):(e.consume(t),A)}function ee(e){return e===47||e===62||W(e)?T(e):n(e)}function j(r){return r===62?(e.consume(r),e.exit(`htmlTextData`),e.exit(`htmlText`),t):n(r)}function M(t){return e.exit(`htmlTextData`),e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),N}function N(t){return G(t)?J(e,P,`linePrefix`,r.parser.constructs.disable.null.includes(`codeIndented`)?void 0:4)(t):P(t)}function P(t){return e.enter(`htmlTextData`),o(t)}}var zt={name:`labelEnd`,resolveAll:Ut,resolveTo:Wt,tokenize:Gt},Bt={tokenize:Kt},Vt={tokenize:qt},Ht={tokenize:Jt};function Ut(e){let t=-1,n=[];for(;++t<e.length;){let r=e[t][1];if(n.push(e[t]),r.type===`labelImage`||r.type===`labelLink`||r.type===`labelEnd`){let e=r.type===`labelImage`?4:2;r.type=`data`,t+=e}}return e.length!==n.length&&R(e,0,e.length,n),e}function Wt(e,t){let n=e.length,r=0,i,a,o,s;for(;n--;)if(i=e[n][1],a){if(i.type===`link`||i.type===`labelLink`&&i._inactive)break;e[n][0]===`enter`&&i.type===`labelLink`&&(i._inactive=!0)}else if(o){if(e[n][0]===`enter`&&(i.type===`labelImage`||i.type===`labelLink`)&&!i._balanced&&(a=n,i.type!==`labelLink`)){r=2;break}}else i.type===`labelEnd`&&(o=n);let c={type:e[a][1].type===`labelLink`?`link`:`image`,start:{...e[a][1].start},end:{...e[e.length-1][1].end}},l={type:`label`,start:{...e[a][1].start},end:{...e[o][1].end}},u={type:`labelText`,start:{...e[a+r+2][1].end},end:{...e[o-2][1].start}};return s=[[`enter`,c,t],[`enter`,l,t]],s=z(s,e.slice(a+1,a+r+3)),s=z(s,[[`enter`,u,t]]),s=z(s,Ne(t.parser.constructs.insideSpan.null,e.slice(a+r+4,o-3),t)),s=z(s,[[`exit`,u,t],e[o-2],e[o-1],[`exit`,l,t]]),s=z(s,e.slice(o+1)),s=z(s,[[`exit`,c,t]]),R(e,a,e.length,s),e}function Gt(e,t,n){let r=this,i=r.events.length,a,o;for(;i--;)if((r.events[i][1].type===`labelImage`||r.events[i][1].type===`labelLink`)&&!r.events[i][1]._balanced){a=r.events[i][1];break}return s;function s(t){return a?a._inactive?d(t):(o=r.parser.defined.includes(B(r.sliceSerialize({start:a.end,end:r.now()}))),e.enter(`labelEnd`),e.enter(`labelMarker`),e.consume(t),e.exit(`labelMarker`),e.exit(`labelEnd`),c):n(t)}function c(t){return t===40?e.attempt(Bt,u,o?u:d)(t):t===91?e.attempt(Vt,u,o?l:d)(t):o?u(t):d(t)}function l(t){return e.attempt(Ht,u,d)(t)}function u(e){return t(e)}function d(e){return a._balanced=!0,n(e)}}function Kt(e,t,n){return r;function r(t){return e.enter(`resource`),e.enter(`resourceMarker`),e.consume(t),e.exit(`resourceMarker`),i}function i(t){return W(t)?vt(e,a)(t):a(t)}function a(t){return t===41?u(t):ht(e,o,s,`resourceDestination`,`resourceDestinationLiteral`,`resourceDestinationLiteralMarker`,`resourceDestinationRaw`,`resourceDestinationString`,32)(t)}function o(t){return W(t)?vt(e,c)(t):u(t)}function s(e){return n(e)}function c(t){return t===34||t===39||t===40?_t(e,l,n,`resourceTitle`,`resourceTitleMarker`,`resourceTitleString`)(t):u(t)}function l(t){return W(t)?vt(e,u)(t):u(t)}function u(r){return r===41?(e.enter(`resourceMarker`),e.consume(r),e.exit(`resourceMarker`),e.exit(`resource`),t):n(r)}}function qt(e,t,n){let r=this;return i;function i(t){return gt.call(r,e,a,o,`reference`,`referenceMarker`,`referenceString`)(t)}function a(e){return r.parser.defined.includes(B(r.sliceSerialize(r.events[r.events.length-1][1]).slice(1,-1)))?t(e):n(e)}function o(e){return n(e)}}function Jt(e,t,n){return r;function r(t){return e.enter(`reference`),e.enter(`referenceMarker`),e.consume(t),e.exit(`referenceMarker`),i}function i(r){return r===93?(e.enter(`referenceMarker`),e.consume(r),e.exit(`referenceMarker`),e.exit(`reference`),t):n(r)}}var Yt={name:`labelStartImage`,resolveAll:zt.resolveAll,tokenize:Xt};function Xt(e,t,n){let r=this;return i;function i(t){return e.enter(`labelImage`),e.enter(`labelImageMarker`),e.consume(t),e.exit(`labelImageMarker`),a}function a(t){return t===91?(e.enter(`labelMarker`),e.consume(t),e.exit(`labelMarker`),e.exit(`labelImage`),o):n(t)}function o(e){return e===94&&`_hiddenFootnoteSupport`in r.parser.constructs?n(e):t(e)}}var Zt={name:`labelStartLink`,resolveAll:zt.resolveAll,tokenize:Qt};function Qt(e,t,n){let r=this;return i;function i(t){return e.enter(`labelLink`),e.enter(`labelMarker`),e.consume(t),e.exit(`labelMarker`),e.exit(`labelLink`),a}function a(e){return e===94&&`_hiddenFootnoteSupport`in r.parser.constructs?n(e):t(e)}}var $t={name:`lineEnding`,tokenize:en};function en(e,t){return n;function n(n){return e.enter(`lineEnding`),e.consume(n),e.exit(`lineEnding`),J(e,t,`linePrefix`)}}var tn={name:`thematicBreak`,tokenize:nn};function nn(e,t,n){let r=0,i;return a;function a(t){return e.enter(`thematicBreak`),o(t)}function o(e){return i=e,s(e)}function s(a){return a===i?(e.enter(`thematicBreakSequence`),c(a)):r>=3&&(a===null||U(a))?(e.exit(`thematicBreak`),t(a)):n(a)}function c(t){return t===i?(e.consume(t),r++,c):(e.exit(`thematicBreakSequence`),G(t)?J(e,s,`whitespace`)(t):s(t))}}var Z={continuation:{tokenize:sn},exit:ln,name:`list`,tokenize:on},rn={partial:!0,tokenize:un},an={partial:!0,tokenize:cn};function on(e,t,n){let r=this,i=r.events[r.events.length-1],a=i&&i[1].type===`linePrefix`?i[2].sliceSerialize(i[1],!0).length:0,o=0;return s;function s(t){let i=r.containerState.type||(t===42||t===43||t===45?`listUnordered`:`listOrdered`);if(i===`listUnordered`?!r.containerState.marker||t===r.containerState.marker:ge(t)){if(r.containerState.type||(r.containerState.type=i,e.enter(i,{_container:!0})),i===`listUnordered`)return e.enter(`listItemPrefix`),t===42||t===45?e.check(tn,n,l)(t):l(t);if(!r.interrupt||t===49)return e.enter(`listItemPrefix`),e.enter(`listItemValue`),c(t)}return n(t)}function c(t){return ge(t)&&++o<10?(e.consume(t),c):(!r.interrupt||o<2)&&(r.containerState.marker?t===r.containerState.marker:t===41||t===46)?(e.exit(`listItemValue`),l(t)):n(t)}function l(t){return e.enter(`listItemMarker`),e.consume(t),e.exit(`listItemMarker`),r.containerState.marker=r.containerState.marker||t,e.check(Y,r.interrupt?n:u,e.attempt(rn,f,d))}function u(e){return r.containerState.initialBlankLine=!0,a++,f(e)}function d(t){return G(t)?(e.enter(`listItemPrefixWhitespace`),e.consume(t),e.exit(`listItemPrefixWhitespace`),f):n(t)}function f(n){return r.containerState.size=a+r.sliceSerialize(e.exit(`listItemPrefix`),!0).length,t(n)}}function sn(e,t,n){let r=this;return r.containerState._closeFlow=void 0,e.check(Y,i,a);function i(n){return r.containerState.furtherBlankLines=r.containerState.furtherBlankLines||r.containerState.initialBlankLine,J(e,t,`listItemIndent`,r.containerState.size+1)(n)}function a(n){return r.containerState.furtherBlankLines||!G(n)?(r.containerState.furtherBlankLines=void 0,r.containerState.initialBlankLine=void 0,o(n)):(r.containerState.furtherBlankLines=void 0,r.containerState.initialBlankLine=void 0,e.attempt(an,t,o)(n))}function o(i){return r.containerState._closeFlow=!0,r.interrupt=void 0,J(e,e.attempt(Z,t,n),`linePrefix`,r.parser.constructs.disable.null.includes(`codeIndented`)?void 0:4)(i)}}function cn(e,t,n){let r=this;return J(e,i,`listItemIndent`,r.containerState.size+1);function i(e){let i=r.events[r.events.length-1];return i&&i[1].type===`listItemIndent`&&i[2].sliceSerialize(i[1],!0).length===r.containerState.size?t(e):n(e)}}function ln(e){e.exit(this.containerState.type)}function un(e,t,n){let r=this;return J(e,i,`listItemPrefixWhitespace`,r.parser.constructs.disable.null.includes(`codeIndented`)?void 0:5);function i(e){let i=r.events[r.events.length-1];return!G(e)&&i&&i[1].type===`listItemPrefixWhitespace`?t(e):n(e)}}var dn={name:`setextUnderline`,resolveTo:fn,tokenize:pn};function fn(e,t){let n=e.length,r,i,a;for(;n--;)if(e[n][0]===`enter`){if(e[n][1].type===`content`){r=n;break}e[n][1].type===`paragraph`&&(i=n)}else e[n][1].type===`content`&&e.splice(n,1),!a&&e[n][1].type===`definition`&&(a=n);let o={type:`setextHeading`,start:{...e[r][1].start},end:{...e[e.length-1][1].end}};return e[i][1].type=`setextHeadingText`,a?(e.splice(i,0,[`enter`,o,t]),e.splice(a+1,0,[`exit`,e[r][1],t]),e[r][1].end={...e[a][1].end}):e[r][1]=o,e.push([`exit`,o,t]),e}function pn(e,t,n){let r=this,i;return a;function a(t){let a=r.events.length,s;for(;a--;)if(r.events[a][1].type!==`lineEnding`&&r.events[a][1].type!==`linePrefix`&&r.events[a][1].type!==`content`){s=r.events[a][1].type===`paragraph`;break}return!r.parser.lazy[r.now().line]&&(r.interrupt||s)?(e.enter(`setextHeadingLine`),i=t,o(t)):n(t)}function o(t){return e.enter(`setextHeadingLineSequence`),s(t)}function s(t){return t===i?(e.consume(t),s):(e.exit(`setextHeadingLineSequence`),G(t)?J(e,c,`lineSuffix`)(t):c(t))}function c(r){return r===null||U(r)?(e.exit(`setextHeadingLine`),t(r)):n(r)}}var mn={tokenize:hn};function hn(e){let t=this,n=e.attempt(Y,r,e.attempt(this.parser.constructs.flowInitial,i,J(e,e.attempt(this.parser.constructs.flow,i,e.attempt(ut,i)),`linePrefix`)));return n;function r(r){if(r===null){e.consume(r);return}return e.enter(`lineEndingBlank`),e.consume(r),e.exit(`lineEndingBlank`),t.currentConstruct=void 0,n}function i(r){if(r===null){e.consume(r);return}return e.enter(`lineEnding`),e.consume(r),e.exit(`lineEnding`),t.currentConstruct=void 0,n}}var gn={resolveAll:bn()},_n=yn(`string`),vn=yn(`text`);function yn(e){return{resolveAll:bn(e===`text`?xn:void 0),tokenize:t};function t(t){let n=this,r=this.parser.constructs[e],i=t.attempt(r,a,o);return a;function a(e){return c(e)?i(e):o(e)}function o(e){if(e===null){t.consume(e);return}return t.enter(`data`),t.consume(e),s}function s(e){return c(e)?(t.exit(`data`),i(e)):(t.consume(e),s)}function c(e){if(e===null)return!0;let t=r[e],i=-1;if(t)for(;++i<t.length;){let e=t[i];if(!e.previous||e.previous.call(n,n.previous))return!0}return!1}}}function bn(e){return t;function t(t,n){let r=-1,i;for(;++r<=t.length;)i===void 0?t[r]&&t[r][1].type===`data`&&(i=r,r++):(!t[r]||t[r][1].type!==`data`)&&(r!==i+2&&(t[i][1].end=t[r-1][1].end,t.splice(i+2,r-i-2),r=i+2),i=void 0);return e?e(t,n):t}}function xn(e,t){let n=0;for(;++n<=e.length;)if((n===e.length||e[n][1].type===`lineEnding`)&&e[n-1][1].type===`data`){let r=e[n-1][1],i=t.sliceStream(r),a=i.length,o=-1,s=0,c;for(;a--;){let e=i[a];if(typeof e==`string`){for(o=e.length;e.charCodeAt(o-1)===32;)s++,o--;if(o)break;o=-1}else if(e===-2)c=!0,s++;else if(e!==-1){a++;break}}if(t._contentTypeTextTrailing&&n===e.length&&(s=0),s){let i={type:n===e.length||c||s<2?`lineSuffix`:`hardBreakTrailing`,start:{_bufferIndex:a?o:r.start._bufferIndex+o,_index:r.start._index+a,line:r.end.line,column:r.end.column-s,offset:r.end.offset-s},end:{...r.end}};r.end={...i.start},r.start.offset===r.end.offset?Object.assign(r,i):(e.splice(n,0,[`enter`,i,t],[`exit`,i,t]),n+=2)}n++}return e}var Sn=t({attentionMarkers:()=>An,contentInitial:()=>wn,disable:()=>jn,document:()=>Cn,flow:()=>En,flowInitial:()=>Tn,insideSpan:()=>kn,string:()=>Dn,text:()=>On}),Cn={42:Z,43:Z,45:Z,48:Z,49:Z,50:Z,51:Z,52:Z,53:Z,54:Z,55:Z,56:Z,57:Z,62:Ve},wn={91:yt},Tn={[-2]:$e,[-1]:$e,32:$e},En={35:Tt,42:tn,45:[dn,tn],60:At,61:dn,95:tn,96:Xe,126:Xe},Dn={38:qe,92:Ge},On={[-5]:$t,[-4]:$t,[-3]:$t,33:Yt,38:qe,42:Pe,60:[Re,Lt],91:Zt,92:[Ct,Ge],93:zt,95:Pe,96:rt},kn={null:[Pe,gn]},An={null:[42,95]},jn={null:[]};function Mn(e,t,n){let r={_bufferIndex:-1,_index:0,line:n&&n.line||1,column:n&&n.column||1,offset:n&&n.offset||0},i={},a=[],o=[],s=[],c={attempt:C(x),check:C(S),consume:v,enter:y,exit:b,interrupt:C(S,{interrupt:!0})},l={code:null,containerState:{},defineSkip:h,events:[],now:m,parser:e,previous:null,sliceSerialize:f,sliceStream:p,write:d},u=t.tokenize.call(l,c);return t.resolveAll&&a.push(t),l;function d(e){return o=z(o,e),g(),o[o.length-1]===null?(w(t,0),l.events=Ne(a,l.events,l),l.events):[]}function f(e,t){return Pn(p(e),t)}function p(e){return Nn(o,e)}function m(){let{_bufferIndex:e,_index:t,line:n,column:i,offset:a}=r;return{_bufferIndex:e,_index:t,line:n,column:i,offset:a}}function h(e){i[e.line]=e.column,E()}function g(){let e;for(;r._index<o.length;){let t=o[r._index];if(typeof t==`string`)for(e=r._index,r._bufferIndex<0&&(r._bufferIndex=0);r._index===e&&r._bufferIndex<t.length;)_(t.charCodeAt(r._bufferIndex));else _(t)}}function _(e){u=u(e)}function v(e){U(e)?(r.line++,r.column=1,r.offset+=e===-3?2:1,E()):e!==-1&&(r.column++,r.offset++),r._bufferIndex<0?r._index++:(r._bufferIndex++,r._bufferIndex===o[r._index].length&&(r._bufferIndex=-1,r._index++)),l.previous=e}function y(e,t){let n=t||{};return n.type=e,n.start=m(),l.events.push([`enter`,n,l]),s.push(n),n}function b(e){let t=s.pop();return t.end=m(),l.events.push([`exit`,t,l]),t}function x(e,t){w(e,t.from)}function S(e,t){t.restore()}function C(e,t){return n;function n(n,r,i){let a,o,s,u;return Array.isArray(n)?f(n):`tokenize`in n?f([n]):d(n);function d(e){return t;function t(t){let n=t!==null&&e[t],r=t!==null&&e.null;return f([...Array.isArray(n)?n:n?[n]:[],...Array.isArray(r)?r:r?[r]:[]])(t)}}function f(e){return a=e,o=0,e.length===0?i:p(e[o])}function p(e){return n;function n(n){return u=T(),s=e,e.partial||(l.currentConstruct=e),e.name&&l.parser.constructs.disable.null.includes(e.name)?h(n):e.tokenize.call(t?Object.assign(Object.create(l),t):l,c,m,h)(n)}}function m(t){return e(s,u),r}function h(e){return u.restore(),++o<a.length?p(a[o]):i}}}function w(e,t){e.resolveAll&&!a.includes(e)&&a.push(e),e.resolve&&R(l.events,t,l.events.length-t,e.resolve(l.events.slice(t),l)),e.resolveTo&&(l.events=e.resolveTo(l.events,l))}function T(){let e=m(),t=l.previous,n=l.currentConstruct,i=l.events.length,a=Array.from(s);return{from:i,restore:o};function o(){r=e,l.previous=t,l.currentConstruct=n,l.events.length=i,s=a,E()}}function E(){r.line in i&&r.column<2&&(r.column=i[r.line],r.offset+=i[r.line]-1)}}function Nn(e,t){let n=t.start._index,r=t.start._bufferIndex,i=t.end._index,a=t.end._bufferIndex,o;if(n===i)o=[e[n].slice(r,a)];else{if(o=e.slice(n,i),r>-1){let e=o[0];typeof e==`string`?o[0]=e.slice(r):o.shift()}a>0&&o.push(e[i].slice(0,a))}return o}function Pn(e,t){let n=-1,r=[],i;for(;++n<e.length;){let a=e[n],o;if(typeof a==`string`)o=a;else switch(a){case-5:o=`\r`;break;case-4:o=`
`;break;case-3:o=`\r
`;break;case-2:o=t?` `:`	`;break;case-1:if(!t&&i)continue;o=` `;break;default:o=String.fromCharCode(a)}i=a===-2,r.push(o)}return r.join(``)}function Fn(e){let t={constructs:oe([Sn,...(e||{}).extensions||[]]),content:n(Ee),defined:[],document:n(Oe),flow:n(mn),lazy:{},string:n(_n),text:n(vn)};return t;function n(e){return n;function n(n){return Mn(t,e,n)}}}function In(e){for(;!ct(e););return e}var Ln=/[\0\t\n\r]/g;function Rn(){let e=1,t=``,n=!0,r;return i;function i(i,a,o){let s=[],c,l,u,d,f;for(i=t+(typeof i==`string`?i.toString():new TextDecoder(a||void 0).decode(i)),u=0,t=``,n&&=(i.charCodeAt(0)===65279&&u++,void 0);u<i.length;){if(Ln.lastIndex=u,c=Ln.exec(i),d=c&&c.index!==void 0?c.index:i.length,f=i.charCodeAt(d),!c){t=i.slice(u);break}if(f===10&&u===d&&r)s.push(-3),r=void 0;else switch(r&&=(s.push(-5),void 0),u<d&&(s.push(i.slice(u,d)),e+=d-u),f){case 0:s.push(65533),e++;break;case 9:for(l=Math.ceil(e/4)*4,s.push(-2);e++<l;)s.push(-1);break;case 10:s.push(-4),e=1;break;default:r=!0,e=1}u=d+1}return o&&(r&&s.push(-5),t&&s.push(t),s.push(null)),s}}function zn(e,t,n){return typeof t!=`string`&&(n=t,t=void 0),Te(n)(In(Fn(n).document().write(Rn()(e,t,!0))))}function Bn(e){return zn(e,{allowDangerousHtml:!1})}function Vn(e,t,n=3){let r=t.filter(t=>t.id!==e.id).map(t=>{let n=t.tags.filter(t=>e.tags.includes(t)).length,r=(Date.now()-new Date(t.date).getTime())/(1e3*60*60*24),i=Math.max(0,14-r)*.1;return{...t,score:n+i}});return r.sort((e,t)=>t.score-e.score),r.slice(0,n)}function Hn(e,t,n=3){return(0,x.useMemo)(()=>Vn(e,t,n),[e,t,n])}function Un({currentPost:e}){let{lang:t}=u(),{posts:n}=k(),r=Hn(e,n,3);if(n.length<2||r.length===0)return null;let{setSelectedPost:a}=k(),o=e=>{a(e),history.pushState(null,``,`#blog/article/${e.slug}`)};return(0,T.jsx)(c,{children:(0,T.jsxs)(`div`,{className:`border-t-4 border-rule pt-6 mt-10 mb-8`,children:[(0,T.jsx)(`h3`,{className:`font-headline text-xl md:text-2xl font-bold text-ink mb-5`,children:t===`es`?`Artículos relacionados`:`Related posts`}),(0,T.jsx)(`div`,{className:`grid md:grid-cols-3 gap-4`,children:r.map((e,n)=>{let r=t===`es`?e.title:e.titleEn,a=t===`es`?e.excerpt:e.excerptEn;return(0,T.jsx)(i.article,{initial:{opacity:0,y:12},animate:{opacity:1,y:0},transition:{duration:.25,delay:n*.08},className:`border-2 border-rule bg-paper shadow-pixel-sm hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all duration-75 flex flex-col`,children:(0,T.jsxs)(`button`,{onClick:()=>o(e),className:`flex flex-col h-full text-left cursor-pointer p-4 gap-2`,children:[(0,T.jsx)(`div`,{className:`flex flex-wrap gap-1`,children:e.tags.slice(0,2).map(e=>(0,T.jsxs)(`span`,{className:`skill-tag text-[8px] flex items-center gap-1`,children:[(0,T.jsx)(b,{size:6}),` `,e]},e))}),(0,T.jsx)(`h4`,{className:`font-headline text-sm font-bold text-ink leading-tight line-clamp-2`,children:r}),(0,T.jsx)(`p`,{className:`font-sans text-[11px] text-ink-light leading-relaxed line-clamp-2 flex-1`,children:a}),(0,T.jsxs)(`span`,{className:`font-mono text-[9px] font-bold uppercase tracking-wider text-accent hover:text-accent-dark flex items-center gap-1 mt-auto pt-2 transition-colors`,children:[t===`es`?`Leer`:`Read`,` `,(0,T.jsx)(h,{size:9})]})]})},e.id)})})]})})}function Wn(){let{lang:e}=u(),{filteredPosts:t,selectedPost:n,setSelectedPost:r}=k(),a=(0,x.useRef)(null),s=n,c=t.findIndex(e=>e.id===s?.id),l=c>0?t[c-1]:null,d=c>=0&&c<t.length-1?t[c+1]:null;(0,x.useEffect)(()=>{a.current&&a.current.scrollIntoView({block:`start`,behavior:`smooth`}),window.scrollTo({top:0,behavior:`smooth`})},[s?.id]);let f=()=>{history.pushState(null,``,`#blog`),window.dispatchEvent(new HashChangeEvent(`hashchange`))},p=()=>{l&&(r(l),history.pushState(null,``,`#blog/article/${l.slug}`))},m=()=>{d&&(r(d),history.pushState(null,``,`#blog/article/${d.slug}`))};if(!s)return null;let _=e===`es`?s.title:s.titleEn,y=e===`es`?s.content:s.contentEn,b=e===`es`?`Volver a artículos`:`Back to articles`;return(0,T.jsx)(i.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},exit:{opacity:0,y:-20},transition:{duration:.25},ref:a,children:(0,T.jsxs)(`article`,{className:`max-w-4xl mx-auto`,children:[(0,T.jsxs)(`button`,{onClick:f,className:`flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-ink-muted hover:text-accent transition-colors mb-6 cursor-pointer`,children:[(0,T.jsx)(o,{size:14}),b]}),(0,T.jsx)(`div`,{className:`border-t-4 border-rule mb-1`}),(0,T.jsx)(`div`,{className:`border-t border-rule mb-6`}),(0,T.jsx)(`h1`,{className:`font-headline text-3xl md:text-5xl lg:text-6xl font-black text-ink leading-[1.05] tracking-tight mb-4`,children:_}),(0,T.jsxs)(`div`,{className:`flex flex-wrap items-center gap-x-4 gap-y-1 mb-6 pb-4 border-b border-rule-light`,children:[(0,T.jsxs)(`span`,{className:`font-mono text-xs text-ink-muted flex items-center gap-1.5`,children:[(0,T.jsx)(g,{size:12}),s.date]}),(0,T.jsxs)(`span`,{className:`font-mono text-xs text-ink-muted flex items-center gap-1.5`,children:[(0,T.jsx)(v,{size:12}),s.readingTime,` min `,e===`es`?`de lectura`:`read`]}),(0,T.jsx)(`span`,{className:`hidden md:inline font-mono text-[10px] text-ink-muted uppercase tracking-wider`,children:`Por Edwin Trigos`})]}),(0,T.jsx)(`div`,{className:`flex flex-wrap gap-1.5 mb-8`,children:s.tags.map(e=>(0,T.jsx)(`span`,{className:`skill-tag text-[10px]`,children:e},e))}),(0,T.jsx)(`div`,{className:`
            blog-article-body
            font-sans text-sm md:text-base text-ink-light leading-[1.75] space-y-5 max-w-3xl
            [&_pre]:border-2 [&_pre]:border-rule [&_pre]:bg-paper-dark [&_pre]:p-4 [&_pre]:md:p-5
            [&_pre]:overflow-x-auto [&_pre]:font-mono [&_pre]:text-[11px] [&_pre]:md:text-xs
            [&_pre]:leading-relaxed [&_pre]:shadow-pixel-sm [&_pre]:my-6 [&_pre]:-mx-2 [&_pre]:md:mx-0
            [&_pre_code]:whitespace-pre-wrap [&_pre_code]:break-words
            [&_code]:bg-paper-dark [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-xs
            [&_code]:border [&_code]:border-rule-light
            [&_h2]:font-headline [&_h2]:text-xl [&_h2]:md:text-2xl [&_h2]:font-bold [&_h2]:text-ink [&_h2]:leading-tight [&_h2]:mt-8 [&_h2]:mb-3
            [&_h3]:font-headline [&_h3]:text-lg [&_h3]:md:text-xl [&_h3]:font-bold [&_h3]:text-ink [&_h3]:mt-6 [&_h3]:mb-2
            [&_strong]:font-bold [&_strong]:text-ink
            [&_blockquote]:border-l-4 [&_blockquote]:border-rule [&_blockquote]:pl-4 [&_blockquote]:italic
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1
            [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-1
            [&_li]:text-sm [&_li]:md:text-base [&_li]:leading-relaxed
            [&_a]:text-accent [&_a]:underline [&_a]:hover:text-accent-dark [&_a]:transition-colors
            [&_p:first-of-type::first-letter]:font-headline
            [&_p:first-of-type::first-letter]:text-5xl [&_p:first-of-type::first-letter]:md:text-6xl
            [&_p:first-of-type::first-letter]:font-black [&_p:first-of-type::first-letter]:float-left
            [&_p:first-of-type::first-letter]:mr-2 [&_p:first-of-type::first-letter]:mt-1
            [&_p:first-of-type::first-letter]:leading-[0.8] [&_p:first-of-type::first-letter]:text-ink
            [&_hr]:border-t-4 [&_hr]:border-rule [&_hr]:my-8
          `,dangerouslySetInnerHTML:{__html:Bn(y)}}),(0,T.jsx)(`div`,{className:`border-t-4 border-rule mt-12 mb-1`}),(0,T.jsx)(`div`,{className:`border-t border-rule mb-6`}),(0,T.jsxs)(`nav`,{className:`flex justify-between items-stretch gap-4 mb-10`,children:[l?(0,T.jsxs)(`button`,{onClick:p,className:`flex-1 flex flex-col items-start gap-1 border-2 border-rule bg-paper p-4 shadow-pixel-sm hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all duration-75 text-left cursor-pointer`,children:[(0,T.jsxs)(`span`,{className:`font-mono text-[9px] uppercase tracking-wider text-ink-muted flex items-center gap-1`,children:[(0,T.jsx)(o,{size:10}),` `,e===`es`?`Anterior`:`Previous`]}),(0,T.jsx)(`span`,{className:`font-headline text-sm font-bold text-ink leading-tight line-clamp-2`,children:e===`es`?l.title:l.titleEn})]}):(0,T.jsx)(`div`,{className:`flex-1`}),d?(0,T.jsxs)(`button`,{onClick:m,className:`flex-1 flex flex-col items-end gap-1 border-2 border-rule bg-paper p-4 shadow-pixel-sm hover:shadow-none hover:-translate-x-0.5 hover:translate-y-0.5 active:shadow-none active:-translate-x-0.5 active:translate-y-0.5 transition-all duration-75 text-right cursor-pointer`,children:[(0,T.jsxs)(`span`,{className:`font-mono text-[9px] uppercase tracking-wider text-ink-muted flex items-center gap-1`,children:[e===`es`?`Siguiente`:`Next`,` `,(0,T.jsx)(h,{size:10})]}),(0,T.jsx)(`span`,{className:`font-headline text-sm font-bold text-ink leading-tight line-clamp-2`,children:e===`es`?d.title:d.titleEn})]}):(0,T.jsx)(`div`,{className:`flex-1`})]}),(0,T.jsxs)(`button`,{onClick:f,className:`flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-ink-muted hover:text-accent transition-colors mb-6 cursor-pointer`,children:[(0,T.jsx)(o,{size:14}),b]}),s&&(0,T.jsx)(Un,{currentPost:s})]})},`article-${s.id}`)}var Gn=[{name:`arquitectura`,label:`Arquitectura`,labelEn:`Architecture`,color:`red`},{name:`.NET`,label:`.NET`,labelEn:`.NET`,color:`blue`},{name:`clean architecture`,label:`Clean Architecture`,labelEn:`Clean Architecture`,color:`green`},{name:`DDD`,label:`DDD`,labelEn:`DDD`,color:`purple`},{name:`patrones`,label:`Patrones`,labelEn:`Patterns`,color:`orange`},{name:`C#`,label:`C#`,labelEn:`C#`,color:`blue`},{name:`design patterns`,label:`Design Patterns`,labelEn:`Design Patterns`,color:`green`}],Kn=[`arquitectura`];function qn(){let{lang:e}=u(),{filter:t,setFilter:n,clearFilters:r}=k(),[a,o]=(0,x.useState)(!1),[c,l]=(0,x.useState)(!1),d=(t.tags?.length??0)+ +!!t.category+ +!!t.dateRange,f=e=>{let r=t.tags??[],i=r.includes(e)?r.filter(t=>t!==e):[...r,e];n({...t,tags:i})},m=e=>{n({...t,category:e}),o(!1)},h=e=>{n({...t,dateRange:{start:e,end:t.dateRange?.end??``}})},g=e=>{n({...t,dateRange:{start:t.dateRange?.start??``,end:e}})},v=()=>{n({...t,dateRange:null}),l(!1)},y=e=>Gn.find(t=>t.name===e)??{name:e,label:e,labelEn:e,color:`purple`};return(0,T.jsxs)(`div`,{className:`mb-8`,children:[d>0&&(0,T.jsxs)(`div`,{className:`flex flex-wrap items-center gap-2 mb-4`,children:[t.tags?.map(t=>{let n=y(t),r=e===`es`?n.label:n.labelEn;return(0,T.jsxs)(i.span,{initial:{opacity:0,scale:.9},animate:{opacity:1,scale:1},exit:{opacity:0,scale:.9},className:`skill-tag text-[10px] flex items-center gap-1.5 pr-1`,children:[r,(0,T.jsx)(`button`,{onClick:()=>f(t),className:`hover:text-accent transition-colors cursor-pointer`,"aria-label":`Remove ${r} filter`,children:(0,T.jsx)(s,{size:10})})]},`tag-${t}`)}),t.category&&(0,T.jsxs)(i.span,{initial:{opacity:0,scale:.9},animate:{opacity:1,scale:1},exit:{opacity:0,scale:.9},className:`skill-tag text-[10px] flex items-center gap-1.5 pr-1`,children:[t.category,(0,T.jsx)(`button`,{onClick:()=>m(null),className:`hover:text-accent transition-colors cursor-pointer`,"aria-label":`Remove category filter`,children:(0,T.jsx)(s,{size:10})})]},`cat-chip`),t.dateRange&&(0,T.jsxs)(i.span,{initial:{opacity:0,scale:.9},animate:{opacity:1,scale:1},exit:{opacity:0,scale:.9},className:`skill-tag text-[10px] flex items-center gap-1.5 pr-1`,children:[t.dateRange.start,` – `,t.dateRange.end,(0,T.jsx)(`button`,{onClick:v,className:`hover:text-accent transition-colors cursor-pointer`,"aria-label":`Remove date range filter`,children:(0,T.jsx)(s,{size:10})})]},`date-chip`),(0,T.jsx)(`button`,{onClick:r,className:`font-mono text-[9px] uppercase tracking-wider text-accent hover:text-accent-dark underline transition-colors cursor-pointer`,children:e===`es`?`Limpiar todo`:`Clear all`})]}),(0,T.jsxs)(`div`,{className:`flex flex-wrap items-center gap-3`,children:[(0,T.jsx)(`div`,{className:`flex flex-wrap gap-1.5`,children:Gn.map(n=>{let r=t.tags?.includes(n.name)??!1,i=e===`es`?n.label:n.labelEn;return(0,T.jsx)(`button`,{onClick:()=>f(n.name),className:`
                  skill-tag text-[10px] cursor-pointer transition-all duration-75
                  ${r?`bg-ink text-paper hover:bg-ink hover:text-paper`:``}
                `,children:i},n.name)})}),(0,T.jsxs)(`div`,{className:`relative`,children:[(0,T.jsxs)(`button`,{onClick:()=>{o(!a),l(!1)},className:`skill-tag text-[10px] flex items-center gap-1 cursor-pointer`,children:[t.category?t.category:e===`es`?`Categoría`:`Category`,(0,T.jsx)(_,{size:10})]}),(0,T.jsx)(p,{children:a&&(0,T.jsxs)(i.div,{initial:{opacity:0,y:-4},animate:{opacity:1,y:0},exit:{opacity:0,y:-4},transition:{duration:.15},className:`absolute top-full left-0 mt-1 z-20 border-2 border-rule bg-paper shadow-pixel-sm min-w-[140px]`,children:[(0,T.jsx)(`button`,{onClick:()=>m(null),className:`block w-full text-left font-mono text-[10px] px-3 py-2 hover:bg-paper-dark transition-colors cursor-pointer`,children:e===`es`?`Todas`:`All`}),Kn.map(e=>(0,T.jsx)(`button`,{onClick:()=>m(e),className:`block w-full text-left font-mono text-[10px] px-3 py-2 hover:bg-paper-dark transition-colors cursor-pointer ${t.category===e?`bg-ink text-paper`:``}`,children:e},e))]})})]}),(0,T.jsxs)(`div`,{className:`relative`,children:[(0,T.jsx)(`button`,{onClick:()=>{l(!c),o(!1)},className:`skill-tag text-[10px] flex items-center gap-1 cursor-pointer`,children:t.dateRange?`${t.dateRange.start} – ${t.dateRange.end}`:e===`es`?`Fechas`:`Dates`}),(0,T.jsx)(p,{children:c&&(0,T.jsxs)(i.div,{initial:{opacity:0,y:-4},animate:{opacity:1,y:0},exit:{opacity:0,y:-4},transition:{duration:.15},className:`absolute top-full left-0 mt-1 z-20 border-2 border-rule bg-paper shadow-pixel-sm p-3 flex flex-col gap-2`,children:[(0,T.jsx)(`label`,{className:`font-mono text-[9px] uppercase tracking-wider text-ink-muted`,children:e===`es`?`Desde`:`From`}),(0,T.jsx)(`input`,{type:`date`,value:t.dateRange?.start??``,onChange:e=>h(e.target.value),className:`border-2 border-rule bg-paper-dark font-mono text-[10px] px-2 py-1`}),(0,T.jsx)(`label`,{className:`font-mono text-[9px] uppercase tracking-wider text-ink-muted`,children:e===`es`?`Hasta`:`To`}),(0,T.jsx)(`input`,{type:`date`,value:t.dateRange?.end??``,onChange:e=>g(e.target.value),className:`border-2 border-rule bg-paper-dark font-mono text-[10px] px-2 py-1`}),t.dateRange&&(0,T.jsx)(`button`,{onClick:v,className:`font-mono text-[9px] text-accent hover:text-accent-dark underline mt-1 cursor-pointer`,children:e===`es`?`Limpiar`:`Clear`})]})})]})]})]})}var Jn=`ENTRIES`,Yn=`KEYS`,Xn=`VALUES`,Q=``,Zn=class{constructor(e,t){let n=e._tree,r=Array.from(n.keys());this.set=e,this._type=t,this._path=r.length>0?[{node:n,keys:r}]:[]}next(){let e=this.dive();return this.backtrack(),e}dive(){if(this._path.length===0)return{done:!0,value:void 0};let{node:e,keys:t}=$(this._path);if($(t)===Q)return{done:!1,value:this.result()};let n=e.get($(t));return this._path.push({node:n,keys:Array.from(n.keys())}),this.dive()}backtrack(){if(this._path.length===0)return;let e=$(this._path).keys;e.pop(),!(e.length>0)&&(this._path.pop(),this.backtrack())}key(){return this.set._prefix+this._path.map(({keys:e})=>$(e)).filter(e=>e!==Q).join(``)}value(){return $(this._path).node.get(Q)}result(){switch(this._type){case Xn:return this.value();case Yn:return this.key();default:return[this.key(),this.value()]}}[Symbol.iterator](){return this}},$=e=>e[e.length-1],Qn=(e,t,n)=>{let r=new Map;if(t===void 0)return r;let i=t.length+1,a=i+n,o=new Uint8Array(a*i).fill(n+1);for(let e=0;e<i;++e)o[e]=e;for(let e=1;e<a;++e)o[e*i]=e;return $n(e,t,n,r,o,1,i,``),r},$n=(e,t,n,r,i,a,o,s)=>{let c=a*o;key:for(let l of e.keys())if(l===Q){let t=i[c-1];t<=n&&r.set(s,[e.get(l),t])}else{let c=a;for(let e=0;e<l.length;++e,++c){let r=l[e],a=o*c,s=a-o,u=i[a],d=Math.max(0,c-n-1),f=Math.min(o-1,c+n);for(let e=d;e<f;++e){let n=r!==t[e],o=i[s+e]+ +n,c=i[s+e+1]+1,l=i[a+e]+1,d=i[a+e+1]=Math.min(o,c,l);d<u&&(u=d)}if(u>n)continue key}$n(e.get(l),t,n,r,i,c,o,s+l)}},er=class e{constructor(e=new Map,t=``){this._size=void 0,this._tree=e,this._prefix=t}atPrefix(t){if(!t.startsWith(this._prefix))throw Error(`Mismatched prefix`);let[n,r]=tr(this._tree,t.slice(this._prefix.length));if(n===void 0){let[n,i]=sr(r);for(let r of n.keys())if(r!==Q&&r.startsWith(i)){let a=new Map;return a.set(r.slice(i.length),n.get(r)),new e(a,t)}}return new e(n,t)}clear(){this._size=void 0,this._tree.clear()}delete(e){return this._size=void 0,ir(this._tree,e)}entries(){return new Zn(this,Jn)}forEach(e){for(let[t,n]of this)e(t,n,this)}fuzzyGet(e,t){return Qn(this._tree,e,t)}get(e){let t=nr(this._tree,e);return t===void 0?void 0:t.get(Q)}has(e){let t=nr(this._tree,e);return t!==void 0&&t.has(Q)}keys(){return new Zn(this,Yn)}set(e,t){if(typeof e!=`string`)throw Error(`key must be a string`);return this._size=void 0,rr(this._tree,e).set(Q,t),this}get size(){if(this._size)return this._size;this._size=0;let e=this.entries();for(;!e.next().done;)this._size+=1;return this._size}update(e,t){if(typeof e!=`string`)throw Error(`key must be a string`);this._size=void 0;let n=rr(this._tree,e);return n.set(Q,t(n.get(Q))),this}fetch(e,t){if(typeof e!=`string`)throw Error(`key must be a string`);this._size=void 0;let n=rr(this._tree,e),r=n.get(Q);return r===void 0&&n.set(Q,r=t()),r}values(){return new Zn(this,Xn)}[Symbol.iterator](){return this.entries()}static from(t){let n=new e;for(let[e,r]of t)n.set(e,r);return n}static fromObject(t){return e.from(Object.entries(t))}},tr=(e,t,n=[])=>{if(t.length===0||e==null)return[e,n];for(let r of e.keys())if(r!==Q&&t.startsWith(r))return n.push([e,r]),tr(e.get(r),t.slice(r.length),n);return n.push([e,t]),tr(void 0,``,n)},nr=(e,t)=>{if(t.length===0||e==null)return e;for(let n of e.keys())if(n!==Q&&t.startsWith(n))return nr(e.get(n),t.slice(n.length))},rr=(e,t)=>{let n=t.length;outer:for(let r=0;e&&r<n;){for(let i of e.keys())if(i!==Q&&t[r]===i[0]){let a=Math.min(n-r,i.length),o=1;for(;o<a&&t[r+o]===i[o];)++o;let s=e.get(i);if(o===i.length)e=s;else{let n=new Map;n.set(i.slice(o),s),e.set(t.slice(r,r+o),n),e.delete(i),e=n}r+=o;continue outer}let i=new Map;return e.set(t.slice(r),i),i}return e},ir=(e,t)=>{let[n,r]=tr(e,t);if(n!==void 0){if(n.delete(Q),n.size===0)ar(r);else if(n.size===1){let[e,t]=n.entries().next().value;or(r,e,t)}}},ar=e=>{if(e.length===0)return;let[t,n]=sr(e);if(t.delete(n),t.size===0)ar(e.slice(0,-1));else if(t.size===1){let[n,r]=t.entries().next().value;n!==Q&&or(e.slice(0,-1),n,r)}},or=(e,t,n)=>{if(e.length===0)return;let[r,i]=sr(e);r.set(i+t,n),r.delete(i)},sr=e=>e[e.length-1],cr=`or`,lr=`and`,ur=`and_not`,dr=class e{constructor(e){if(e?.fields==null)throw Error(`MiniSearch: option "fields" must be provided`);let t=e.autoVacuum==null||e.autoVacuum===!0?Sr:e.autoVacuum;this._options={..._r,...e,autoVacuum:t,searchOptions:{...vr,...e.searchOptions||{}},autoSuggestOptions:{...yr,...e.autoSuggestOptions||{}}},this._index=new er,this._documentCount=0,this._documentIds=new Map,this._idToShortId=new Map,this._fieldIds={},this._fieldLength=new Map,this._avgFieldLength=[],this._nextId=0,this._storedFields=new Map,this._dirtCount=0,this._currentVacuum=null,this._enqueuedVacuum=null,this._enqueuedVacuumConditions=xr,this.addFields(this._options.fields)}add(e){let{extractField:t,stringifyField:n,tokenize:r,processTerm:i,fields:a,idField:o}=this._options,s=t(e,o);if(s==null)throw Error(`MiniSearch: document does not have ID field "${o}"`);if(this._idToShortId.has(s))throw Error(`MiniSearch: duplicate ID ${s}`);let c=this.addDocumentId(s);this.saveStoredFields(c,e);for(let o of a){let a=t(e,o);if(a==null)continue;let s=r(n(a,o),o),l=this._fieldIds[o],u=new Set(s).size;this.addFieldLength(c,l,this._documentCount-1,u);for(let e of s){let t=i(e,o);if(Array.isArray(t))for(let e of t)this.addTerm(l,c,e);else t&&this.addTerm(l,c,t)}}}addAll(e){for(let t of e)this.add(t)}addAllAsync(e,t={}){let{chunkSize:n=10}=t,r={chunk:[],promise:Promise.resolve()},{chunk:i,promise:a}=e.reduce(({chunk:e,promise:t},r,i)=>(e.push(r),(i+1)%n===0?{chunk:[],promise:t.then(()=>new Promise(e=>setTimeout(e,0))).then(()=>this.addAll(e))}:{chunk:e,promise:t}),r);return a.then(()=>this.addAll(i))}remove(e){let{tokenize:t,processTerm:n,extractField:r,stringifyField:i,fields:a,idField:o}=this._options,s=r(e,o);if(s==null)throw Error(`MiniSearch: document does not have ID field "${o}"`);let c=this._idToShortId.get(s);if(c==null)throw Error(`MiniSearch: cannot remove document with ID ${s}: it is not in the index`);for(let o of a){let a=r(e,o);if(a==null)continue;let s=t(i(a,o),o),l=this._fieldIds[o],u=new Set(s).size;this.removeFieldLength(c,l,this._documentCount,u);for(let e of s){let t=n(e,o);if(Array.isArray(t))for(let e of t)this.removeTerm(l,c,e);else t&&this.removeTerm(l,c,t)}}this._storedFields.delete(c),this._documentIds.delete(c),this._idToShortId.delete(s),this._fieldLength.delete(c),--this._documentCount}removeAll(e){if(e)for(let t of e)this.remove(t);else if(arguments.length>0)throw Error(`Expected documents to be present. Omit the argument to remove all documents.`);else this._index=new er,this._documentCount=0,this._documentIds=new Map,this._idToShortId=new Map,this._fieldLength=new Map,this._avgFieldLength=[],this._storedFields=new Map,this._nextId=0}discard(e){let t=this._idToShortId.get(e);if(t==null)throw Error(`MiniSearch: cannot discard document with ID ${e}: it is not in the index`);this._idToShortId.delete(e),this._documentIds.delete(t),this._storedFields.delete(t),(this._fieldLength.get(t)||[]).forEach((e,n)=>{this.removeFieldLength(t,n,this._documentCount,e)}),this._fieldLength.delete(t),--this._documentCount,this._dirtCount+=1,this.maybeAutoVacuum()}maybeAutoVacuum(){if(this._options.autoVacuum===!1)return;let{minDirtFactor:e,minDirtCount:t,batchSize:n,batchWait:r}=this._options.autoVacuum;this.conditionalVacuum({batchSize:n,batchWait:r},{minDirtCount:t,minDirtFactor:e})}discardAll(e){let t=this._options.autoVacuum;try{this._options.autoVacuum=!1;for(let t of e)this.discard(t)}finally{this._options.autoVacuum=t}this.maybeAutoVacuum()}replace(e){let{idField:t,extractField:n}=this._options,r=n(e,t);this.discard(r),this.add(e)}vacuum(e={}){return this.conditionalVacuum(e)}conditionalVacuum(e,t){return this._currentVacuum?(this._enqueuedVacuumConditions=this._enqueuedVacuumConditions&&t,this._enqueuedVacuum??=this._currentVacuum.then(()=>{let t=this._enqueuedVacuumConditions;return this._enqueuedVacuumConditions=xr,this.performVacuuming(e,t)}),this._enqueuedVacuum):this.vacuumConditionsMet(t)===!1?Promise.resolve():(this._currentVacuum=this.performVacuuming(e),this._currentVacuum)}async performVacuuming(e,t){let n=this._dirtCount;if(this.vacuumConditionsMet(t)){let t=e.batchSize||br.batchSize,r=e.batchWait||br.batchWait,i=1;for(let[e,n]of this._index){for(let[e,t]of n)for(let[r]of t)this._documentIds.has(r)||(t.size<=1?n.delete(e):t.delete(r));this._index.get(e).size===0&&this._index.delete(e),i%t===0&&await new Promise(e=>setTimeout(e,r)),i+=1}this._dirtCount-=n}await null,this._currentVacuum=this._enqueuedVacuum,this._enqueuedVacuum=null}vacuumConditionsMet(e){if(e==null)return!0;let{minDirtCount:t,minDirtFactor:n}=e;return t||=Sr.minDirtCount,n||=Sr.minDirtFactor,this.dirtCount>=t&&this.dirtFactor>=n}get isVacuuming(){return this._currentVacuum!=null}get dirtCount(){return this._dirtCount}get dirtFactor(){return this._dirtCount/(1+this._documentCount+this._dirtCount)}has(e){return this._idToShortId.has(e)}getStoredFields(e){let t=this._idToShortId.get(e);if(t!=null)return this._storedFields.get(t)}search(t,n={}){let{searchOptions:r}=this._options,i={...r,...n},a=this.executeQuery(t,n),o=[];for(let[e,{score:t,terms:n,match:r}]of a){let a=n.length||1,s={id:this._documentIds.get(e),score:t*a,terms:Object.keys(r),queryTerms:n,match:r};Object.assign(s,this._storedFields.get(e)),(i.filter==null||i.filter(s))&&o.push(s)}return t===e.wildcard&&i.boostDocument==null||o.sort(Tr),o}autoSuggest(e,t={}){t={...this._options.autoSuggestOptions,...t};let n=new Map;for(let{score:r,terms:i}of this.search(e,t)){let e=i.join(` `),t=n.get(e);t==null?n.set(e,{score:r,terms:i,count:1}):(t.score+=r,t.count+=1)}let r=[];for(let[e,{score:t,terms:i,count:a}]of n)r.push({suggestion:e,terms:i,score:t/a});return r.sort(Tr),r}get documentCount(){return this._documentCount}get termCount(){return this._index.size}static loadJSON(e,t){if(t==null)throw Error(`MiniSearch: loadJSON should be given the same options used when serializing the index`);return this.loadJS(JSON.parse(e),t)}static async loadJSONAsync(e,t){if(t==null)throw Error(`MiniSearch: loadJSON should be given the same options used when serializing the index`);return this.loadJSAsync(JSON.parse(e),t)}static getDefault(e){if(_r.hasOwnProperty(e))return fr(_r,e);throw Error(`MiniSearch: unknown option "${e}"`)}static loadJS(e,t){let{index:n,documentIds:r,fieldLength:i,storedFields:a,serializationVersion:o}=e,s=this.instantiateMiniSearch(e,t);s._documentIds=Dr(r),s._fieldLength=Dr(i),s._storedFields=Dr(a);for(let[e,t]of s._documentIds)s._idToShortId.set(t,e);for(let[e,t]of n){let n=new Map;for(let e of Object.keys(t)){let r=t[e];o===1&&(r=r.ds),n.set(parseInt(e,10),Dr(r))}s._index.set(e,n)}return s}static async loadJSAsync(e,t){let{index:n,documentIds:r,fieldLength:i,storedFields:a,serializationVersion:o}=e,s=this.instantiateMiniSearch(e,t);s._documentIds=await Or(r),s._fieldLength=await Or(i),s._storedFields=await Or(a);for(let[e,t]of s._documentIds)s._idToShortId.set(t,e);let c=0;for(let[e,t]of n){let n=new Map;for(let e of Object.keys(t)){let r=t[e];o===1&&(r=r.ds),n.set(parseInt(e,10),await Or(r))}++c%1e3==0&&await kr(0),s._index.set(e,n)}return s}static instantiateMiniSearch(t,n){let{documentCount:r,nextId:i,fieldIds:a,averageFieldLength:o,dirtCount:s,serializationVersion:c}=t;if(c!==1&&c!==2)throw Error(`MiniSearch: cannot deserialize an index created with an incompatible version`);let l=new e(n);return l._documentCount=r,l._nextId=i,l._idToShortId=new Map,l._fieldIds=a,l._avgFieldLength=o,l._dirtCount=s||0,l._index=new er,l}executeQuery(t,n={}){if(t===e.wildcard)return this.executeWildcardQuery(n);if(typeof t!=`string`){let e={...n,...t,queries:void 0},r=t.queries.map(t=>this.executeQuery(t,e));return this.combineResults(r,e.combineWith)}let{tokenize:r,processTerm:i,searchOptions:a}=this._options,o={tokenize:r,processTerm:i,...a,...n},{tokenize:s,processTerm:c}=o,l=s(t).flatMap(e=>c(e)).filter(e=>!!e).map(gr(o)).map(e=>this.executeQuerySpec(e,o));return this.combineResults(l,o.combineWith)}executeQuerySpec(e,t){let n={...this._options.searchOptions,...t},r=(n.fields||this._options.fields).reduce((e,t)=>({...e,[t]:fr(n.boost,t)||1}),{}),{boostDocument:i,weights:a,maxFuzzy:o,bm25:s}=n,{fuzzy:c,prefix:l}={...vr.weights,...a},u=this._index.get(e.term),d=this.termResults(e.term,e.term,1,e.termBoost,u,r,i,s),f,p;if(e.prefix&&(f=this._index.atPrefix(e.term)),e.fuzzy){let t=e.fuzzy===!0?.2:e.fuzzy,n=t<1?Math.min(o,Math.round(e.term.length*t)):t;n&&(p=this._index.fuzzyGet(e.term,n))}if(f)for(let[t,n]of f){let a=t.length-e.term.length;if(!a)continue;p?.delete(t);let o=l*t.length/(t.length+.3*a);this.termResults(e.term,t,o,e.termBoost,n,r,i,s,d)}if(p)for(let t of p.keys()){let[n,a]=p.get(t);if(!a)continue;let o=c*t.length/(t.length+a);this.termResults(e.term,t,o,e.termBoost,n,r,i,s,d)}return d}executeWildcardQuery(e){let t=new Map,n={...this._options.searchOptions,...e};for(let[e,r]of this._documentIds){let i=n.boostDocument?n.boostDocument(r,``,this._storedFields.get(e)):1;t.set(e,{score:i,terms:[],match:{}})}return t}combineResults(e,t=cr){if(e.length===0)return new Map;let n=pr[t.toLowerCase()];if(!n)throw Error(`Invalid combination operator: ${t}`);return e.reduce(n)||new Map}toJSON(){let e=[];for(let[t,n]of this._index){let r={};for(let[e,t]of n)r[e]=Object.fromEntries(t);e.push([t,r])}return{documentCount:this._documentCount,nextId:this._nextId,documentIds:Object.fromEntries(this._documentIds),fieldIds:this._fieldIds,fieldLength:Object.fromEntries(this._fieldLength),averageFieldLength:this._avgFieldLength,storedFields:Object.fromEntries(this._storedFields),dirtCount:this._dirtCount,index:e,serializationVersion:2}}termResults(e,t,n,r,i,a,o,s,c=new Map){if(i==null)return c;for(let l of Object.keys(a)){let u=a[l],d=this._fieldIds[l],f=i.get(d);if(f==null)continue;let p=f.size,m=this._avgFieldLength[d];for(let i of f.keys()){if(!this._documentIds.has(i)){this.removeTerm(d,i,t),--p;continue}let a=o?o(this._documentIds.get(i),t,this._storedFields.get(i)):1;if(!a)continue;let h=f.get(i),g=this._fieldLength.get(i)[d],_=hr(h,p,this._documentCount,g,m,s),v=n*r*u*a*_,y=c.get(i);if(y){y.score+=v,Cr(y.terms,e);let n=fr(y.match,t);n?n.push(l):y.match[t]=[l]}else c.set(i,{score:v,terms:[e],match:{[t]:[l]}})}}return c}addTerm(e,t,n){let r=this._index.fetch(n,Er),i=r.get(e);if(i==null)i=new Map,i.set(t,1),r.set(e,i);else{let e=i.get(t);i.set(t,(e||0)+1)}}removeTerm(e,t,n){if(!this._index.has(n)){this.warnDocumentChanged(t,e,n);return}let r=this._index.fetch(n,Er),i=r.get(e);i==null||i.get(t)==null?this.warnDocumentChanged(t,e,n):i.get(t)<=1?i.size<=1?r.delete(e):i.delete(t):i.set(t,i.get(t)-1),this._index.get(n).size===0&&this._index.delete(n)}warnDocumentChanged(e,t,n){for(let r of Object.keys(this._fieldIds))if(this._fieldIds[r]===t){this._options.logger(`warn`,`MiniSearch: document with ID ${this._documentIds.get(e)} has changed before removal: term "${n}" was not present in field "${r}". Removing a document after it has changed can corrupt the index!`,`version_conflict`);return}}addDocumentId(e){let t=this._nextId;return this._idToShortId.set(e,t),this._documentIds.set(t,e),this._documentCount+=1,this._nextId+=1,t}addFields(e){for(let t=0;t<e.length;t++)this._fieldIds[e[t]]=t}addFieldLength(e,t,n,r){let i=this._fieldLength.get(e);i??this._fieldLength.set(e,i=[]),i[t]=r;let a=(this._avgFieldLength[t]||0)*n+r;this._avgFieldLength[t]=a/(n+1)}removeFieldLength(e,t,n,r){if(n===1){this._avgFieldLength[t]=0;return}let i=this._avgFieldLength[t]*n-r;this._avgFieldLength[t]=i/(n-1)}saveStoredFields(e,t){let{storeFields:n,extractField:r}=this._options;if(n==null||n.length===0)return;let i=this._storedFields.get(e);i??this._storedFields.set(e,i={});for(let e of n){let n=r(t,e);n!==void 0&&(i[e]=n)}}};dr.wildcard=Symbol(`*`);var fr=(e,t)=>Object.prototype.hasOwnProperty.call(e,t)?e[t]:void 0,pr={[cr]:(e,t)=>{for(let n of t.keys()){let r=e.get(n);if(r==null)e.set(n,t.get(n));else{let{score:e,terms:i,match:a}=t.get(n);r.score+=e,r.match=Object.assign(r.match,a),wr(r.terms,i)}}return e},[lr]:(e,t)=>{let n=new Map;for(let r of t.keys()){let i=e.get(r);if(i==null)continue;let{score:a,terms:o,match:s}=t.get(r);wr(i.terms,o),n.set(r,{score:i.score+a,terms:i.terms,match:Object.assign(i.match,s)})}return n},[ur]:(e,t)=>{for(let n of t.keys())e.delete(n);return e}},mr={k:1.2,b:.7,d:.5},hr=(e,t,n,r,i,a)=>{let{k:o,b:s,d:c}=a;return Math.log(1+(n-t+.5)/(t+.5))*(c+e*(o+1)/(e+o*(1-s+s*r/i)))},gr=e=>(t,n,r)=>({term:t,fuzzy:typeof e.fuzzy==`function`?e.fuzzy(t,n,r):e.fuzzy||!1,prefix:typeof e.prefix==`function`?e.prefix(t,n,r):e.prefix===!0,termBoost:typeof e.boostTerm==`function`?e.boostTerm(t,n,r):1}),_r={idField:`id`,extractField:(e,t)=>e[t],stringifyField:(e,t)=>e.toString(),tokenize:e=>e.split(Ar),processTerm:e=>e.toLowerCase(),fields:void 0,searchOptions:void 0,storeFields:[],logger:(e,t)=>{typeof(console==null?void 0:console[e])==`function`&&console[e](t)},autoVacuum:!0},vr={combineWith:cr,prefix:!1,fuzzy:!1,maxFuzzy:6,boost:{},weights:{fuzzy:.45,prefix:.375},bm25:mr},yr={combineWith:lr,prefix:(e,t,n)=>t===n.length-1},br={batchSize:1e3,batchWait:10},xr={minDirtFactor:.1,minDirtCount:20},Sr={...br,...xr},Cr=(e,t)=>{e.includes(t)||e.push(t)},wr=(e,t)=>{for(let n of t)e.includes(n)||e.push(n)},Tr=({score:e},{score:t})=>t-e,Er=()=>new Map,Dr=e=>{let t=new Map;for(let n of Object.keys(e))t.set(parseInt(n,10),e[n]);return t},Or=async e=>{let t=new Map,n=0;for(let r of Object.keys(e))t.set(parseInt(r,10),e[r]),++n%1e3==0&&await kr(0);return t},kr=e=>new Promise(t=>setTimeout(t,e)),Ar=/[\n\r\p{Z}\p{P}]+/u;function jr(e){return e.replace(/[.*+?^${}()|[\]\\]/g,`\\$&`)}function Mr(e,t){if(!t.trim())return[e];let n=jr(t);return e.split(RegExp(`(${n})`,`gi`)).map((e,n)=>e.toLowerCase()===t.toLowerCase()?(0,T.jsx)(`mark`,{className:`bg-accent/20 text-ink font-bold px-0.5 rounded-none`,children:e},n):e)}function Nr(e,t){let[n,r]=(0,x.useState)(e);return(0,x.useEffect)(()=>{let n=setTimeout(()=>r(e),t);return()=>clearTimeout(n)},[e,t]),n}function Pr({defaultQuery:e=``}){let{lang:t}=u(),{posts:n}=k(),[r,a]=(0,x.useState)(e),[o,c]=(0,x.useState)([]),[l,d]=(0,x.useState)(!1),f=(0,x.useRef)(null),m=(0,x.useRef)(null);(0,x.useEffect)(()=>{e&&a(e)},[e]);let h=Nr(r,200);(0,x.useEffect)(()=>{let e=new dr({fields:[`title`,`titleEn`,`tags`,`excerpt`,`excerptEn`],storeFields:[`id`,`slug`,`title`,`titleEn`,`excerpt`,`excerptEn`,`tags`,`date`,`readingTime`],searchOptions:{boost:{title:3,titleEn:3,tags:2,excerpt:1,excerptEn:1},fuzzy:.2,prefix:!0}});return e.addAll(n),f.current=e,d(!0),()=>{f.current=null}},[n]),(0,x.useEffect)(()=>{if(!h.trim()||!f.current){c([]);return}c(f.current.search(h).map(e=>n.find(t=>t.id===e.id)).filter(e=>e!==void 0))},[h,n]);let g=(0,x.useCallback)(()=>{a(``),c([]),m.current?.focus()},[]),_=(0,x.useCallback)(e=>{window.location.hash=`#blog/article/${e.slug}`,a(``),c([])},[]),v=r.trim().length>0,b=o.length>0;return(0,T.jsxs)(`div`,{className:`mb-8`,children:[(0,T.jsxs)(`div`,{className:`relative`,children:[(0,T.jsx)(y,{size:14,className:`absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none`}),(0,T.jsx)(`input`,{ref:m,type:`text`,value:r,onChange:e=>a(e.target.value),placeholder:t===`es`?`Buscar artículos…`:`Search articles…`,className:`w-full border-2 border-rule bg-paper px-9 py-2.5 font-mono text-xs text-ink placeholder:text-ink-muted outline-none focus:bg-paper-dark transition-colors`,"aria-label":t===`es`?`Buscar artículos`:`Search articles`}),v&&(0,T.jsx)(`button`,{onClick:g,className:`absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-accent transition-colors cursor-pointer`,"aria-label":`Clear search`,children:(0,T.jsx)(s,{size:14})})]}),(0,T.jsx)(p,{children:v&&(0,T.jsx)(i.div,{initial:{opacity:0,y:-8},animate:{opacity:1,y:0},exit:{opacity:0,y:-8},transition:{duration:.15},className:`border-x-2 border-b-2 border-rule bg-paper shadow-pixel-sm mt-0`,children:l?b?(0,T.jsx)(`ul`,{className:`divide-y divide-rule-light`,children:o.map(e=>{let n=t===`es`?e.title:e.titleEn,r=t===`es`?e.excerpt:e.excerptEn;return(0,T.jsx)(`li`,{children:(0,T.jsxs)(`button`,{onClick:()=>_(e),className:`w-full text-left px-4 py-3 hover:bg-paper-dark transition-colors cursor-pointer`,children:[(0,T.jsx)(`h4`,{className:`font-headline text-sm font-bold text-ink leading-tight mb-1`,children:Mr(n,h)}),(0,T.jsx)(`p`,{className:`font-sans text-[11px] text-ink-light leading-relaxed line-clamp-2`,children:Mr(r,h)}),(0,T.jsxs)(`div`,{className:`flex items-center gap-2 mt-1.5`,children:[(0,T.jsx)(`span`,{className:`font-mono text-[9px] text-ink-muted`,children:e.date}),(0,T.jsxs)(`span`,{className:`font-mono text-[9px] text-ink-muted`,children:[e.readingTime,` min`]})]})]})},e.id)})}):(0,T.jsx)(`div`,{className:`p-4`,children:(0,T.jsx)(j,{context:`search`,searchQuery:h})}):(0,T.jsx)(`div`,{className:`p-4 text-center`,children:(0,T.jsx)(`p`,{className:`font-mono text-[10px] text-ink-muted`,children:t===`es`?`Indexando…`:`Indexing…`})})})})]})}function Fr(){let{t:e}=u(),t=ee(),{posts:n,selectedPost:r,setSelectedPost:a,setFilter:o}=k(),s=t.currentRoute===`article`&&t.selectedSlug?n.find(e=>e.slug===t.selectedSlug)??null:null;(0,x.useLayoutEffect)(()=>{t.currentRoute===`tag`&&t.currentParams.tag?o({tags:[t.currentParams.tag],category:null,dateRange:null}):(t.currentRoute===`list`||t.currentRoute===`search`)&&o({tags:[],category:null,dateRange:null}),t.currentRoute!==`article`&&a(null)},[t.currentRoute,t.selectedSlug,t.currentParams.tag]),(0,x.useLayoutEffect)(()=>{s&&s!==r&&a(s)},[s]);let c=t.currentRoute===`article`?`article-${t.selectedSlug}`:t.currentRoute;return(0,T.jsxs)(`section`,{id:`blog`,className:`py-20 px-6 max-w-7xl mx-auto`,children:[(0,T.jsx)(`div`,{className:`mb-10`,children:(0,T.jsx)(d,{section:`blog`,title:e(`blog.title`),subtitle:e(`blog.subtitle`)})}),(0,T.jsx)(p,{mode:`sync`,children:(0,T.jsx)(i.div,{initial:{opacity:0,y:10},animate:{opacity:1,y:0},exit:{opacity:0,y:-10},transition:{duration:.2},children:t.currentRoute===`article`?r||s?(0,T.jsx)(Wn,{}):null:(0,T.jsxs)(T.Fragment,{children:[(0,T.jsx)(qn,{}),(0,T.jsx)(Pr,{defaultQuery:t.currentRoute===`search`?t.currentParams.q??``:``}),(0,T.jsx)(ne,{})]})},c)})]})}function Ir(){return(0,T.jsx)(O,{children:(0,T.jsx)(Fr,{})})}export{Ir as BlogRoot};