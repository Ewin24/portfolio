import type { BlogPost } from '../types'

function calcReadingTime(text: string): number {
  const words = text.split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}

// ═══════════════════════════════════════════════════════════════════════════════
// Blog posts — sorted is handled by BlogContext, NOT here (fixes bug #1).
// ═══════════════════════════════════════════════════════════════════════════════

export const blogPosts: BlogPost[] = [
  // ═════════════════════════════════════════════════════════════════════════
  // Artículo 1 — LOS Architecture
  // ═════════════════════════════════════════════════════════════════════════
  {
    id: 'clean-architecture-los',
    slug: 'arquitectura-limpa-sistema-originacion-credito',
    title: 'Clean Architecture en un Sistema de Originación de Crédito: Cómo evité el caos antes de escribir la primera línea de código',
    titleEn: 'Clean Architecture in a Loan Origination System: How I avoided chaos before writing the first line of code',
    date: '2026-01-15',
    tags: ['arquitectura', '.NET', 'clean architecture', 'DDD'],
    category: 'arquitectura',
    featured: true,
    excerpt:
      'Cuando te dan un proyecto desde cero, la tentación es abrir Visual Studio y empezar a escribir controladores. Pero sin una estructura clara, en 3 meses tienes un Big Ball of Mud. Así diseñé la arquitectura del LOS Fábricas de Crédito QUAC antes de escribir una línea de código de producción.',
    excerptEn:
      'When you get a greenfield project, the temptation is to open Visual Studio and start writing controllers. But without a clear structure, in 3 months you have a Big Ball of Mud. Here\'s how I designed the LOS Fábricas de Crédito QUAC architecture before writing a single line of production code.',
    content: `Cuando asumí el diseño del Sistema de Originación de Crédito para Fábricas de Crédito QUAC, sabía que este no sería un proyecto más. Era un sistema completo desde cero: base de datos transaccional, API REST con múltiples canales de consumo, integración con burós de crédito, verificación biométrica, y un flujo de 23 estados que un préstamo recorre desde la solicitud hasta el desembolso.

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

La arquitectura no es un lujo, es una decisión de negocio. Cada hora invertida diseñando capas antes de escribir código de producción se paga 10 veces cuando evitas tener que reescribir todo en el futuro.`,
    contentEn: `When I took on the design of the Loan Origination System for Fábricas de Crédito QUAC, I knew this wouldn't be just another project. It was a complete system from scratch: transactional database, REST API with multiple consumption channels, credit bureau integration, biometric verification, and a 23-state workflow that a loan travels through from application to disbursement.

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

Architecture is not a luxury, it's a business decision. Every hour invested in designing layers before writing production code pays back 10x when you avoid having to rewrite everything in the future.`,
    relatedIds: ['catalog-driven-decision-engine'],
  },

  // ═════════════════════════════════════════════════════════════════════════
  // Artículo 2 — Strategy Pattern y motor catalog-driven
  // ═════════════════════════════════════════════════════════════════════════
  {
    id: 'catalog-driven-decision-engine',
    slug: 'motor-decisiones-catalog-driven-sin-if',
    title: 'Eliminé todos los if/switch de mi motor de decisiones (y por qué deberías hacer lo mismo)',
    titleEn: 'I eliminated every if/switch from my decision engine (and why you should too)',
    date: '2026-03-20',
    tags: ['arquitectura', 'patrones', 'C#', 'design patterns'],
    category: 'arquitectura',
    featured: true,
    excerpt:
      'Cuando construyes un sistema que toma decisiones basadas en diagnósticos externos (un bot de voz, un servicio de validación), la tentación es escribir switch(mensaje) { case "ERROR": ... }. Eso es deuda técnica inmediata. Te cuento cómo lo evité con un motor catalog-driven.',
    excerptEn:
      'When you build a system that makes decisions based on external diagnoses (a voice bot, a validation service), the temptation is to write switch(message) { case "ERROR": ... }. That\'s immediate technical debt. Let me tell you how I avoided it with a catalog-driven engine.',
    content: `El SOVI (Sistema Orquestador de Validación de Identidad) nació de un requisito aparentemente simple: "validar que la persona que solicita el crédito es quien dice ser". Pero la implementación tenía una complejidad oculta.

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

Si tu motor de decisiones tiene ifs o switches con lógica de negocio, los estás acoplando al código. La base de datos no es solo para datos transaccionales — también es el mejor lugar para tus reglas de decisión cuando la frecuencia de cambio es alta.`,
    contentEn: `SOVI (Identity Validation Orchestrator System) was born from a seemingly simple requirement: "verify that the person requesting the loan is who they say they are." But the implementation had hidden complexity.

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

If your decision engine has ifs or switches with business logic, you are coupling them to code. The database is not just for transactional data — it's also the best place for your decision rules when the change frequency is high.`,
    relatedIds: ['clean-architecture-los'],
  },

  // ═════════════════════════════════════════════════════════════════════════
  // Artículo 3 — API Centralizada de Comunicaciones
  // ═════════════════════════════════════════════════════════════════════════
  {
    id: 'comunicaciones-api-centralizada',
    slug: 'api-centralizada-comunicaciones',
    title: 'Centralicé todos los correos de la empresa en una API con Clean Architecture (y dejé de preguntarle al proveedor qué pasó)',
    titleEn: 'I centralized every corporate email into a single Clean Architecture API (and stopped asking the provider what happened)',
    date: '2026-06-15',
    tags: ['arquitectura', '.NET', 'clean architecture', 'API', 'patrones'],
    category: 'arquitectura',
    featured: true,
    excerpt:
      'Cada área de la empresa gestionaba el correo por su cuenta, con su propia implementación, su propia clave API, y su propia definición de "éxito". Hasta que el proveedor decía "no me llegó el comprobante" y nadie sabía qué pasó. Así diseñé una API centralizada que eliminó el black box de las comunicaciones empresariales.',
    excerptEn:
      'Every business area managed email on its own —its own implementation, its own API key, its own definition of "success." Until the provider said "I didn\'t get the receipt" and no one knew what happened. Here\'s how I designed a centralized API that eliminated the enterprise communications black box.',
    content: `"El correo se envió correctamente". Esa frase aparecía en el log de nuestro sistema de gestión de proveedores, pero el destinatario —un proveedor externo esperando su registro— juraba que nunca llegó. ¿Spam? ¿Rebote? ¿La IP del servidor en una blacklist? ¿Un error interno que el aplicación se tragó sin registrar? Nadie podía responder. Empezaba la ronda de correos: "revisá si te llegó", "¿está en spam?", "¿lo reenviamos?". Horas perdidas. En una ocasión, un comprobante fiscal que debía enviarse a un proveedor nunca llegó a su destino. El equipo de soporte pasó tres horas revisando logs, verificando la configuración anti-spam del destinatario, y reenviando el correo manualmente. Al final descubrimos que la API key de Sendinblue en ese repositorio tenía un typo en la variable de entorno de producción —pero como nadie la monitoreaba, nadie se dio cuenta hasta que el cliente llamó por tercera vez. Y no era la primera vez que pasaba.

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
var sql = "EXEC SBERP_InsertInfobipEmailLog @Id, @OriginContext, @Status, @RequestPayload, @ResponsePayload";
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

**Tres. Clean Architecture no es solo para dominios complejos.** El correo electrónico es infraestructura pura y se beneficia IGUAL que un dominio financiero. Las capas no son un adorno: son lo que permite cambiar una implementación completa sin que el resto del sistema se entere. Si alguien te dice que Clean Architecture es overkill para "solo enviar emails", no le creas. El email es el mejor caso de uso para capas bien definidas, porque TODO cambia alrededor del email: el proveedor, los templates, las políticas de envío, los requisitos de auditoría.`,
    contentEn: `"The email was sent successfully." That message appeared in our vendor management system's logs, yet the recipient —an external vendor waiting to complete registration— swore it never arrived. Spam? Bounce? Server IP on a blacklist? An internal error the application swallowed without logging? No one could answer. The email chain would start: "did you get it?", "check your spam folder", "should I resend it?". Hours wasted. In one case, a fiscal receipt that was supposed to reach a vendor never arrived. The support team spent three hours digging through logs, checking the recipient's anti-spam config, and manually resending the email. It turned out the Sendinblue API key in that repo had a typo in the production environment variable —but since no one monitored it, nobody noticed until the client called for the third time. And it wasn't the first time it happened.

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
var sql = "EXEC SBERP_InsertInfobipEmailLog @Id, @OriginContext, @Status, @RequestPayload, @ResponsePayload";
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

**Three. Clean Architecture isn't just for complex domains.** Email is pure infrastructure and it benefits JUST AS MUCH as a financial domain. The layers aren't decoration — they're what let you swap an entire implementation without the rest of the system knowing. If someone tells you Clean Architecture is overkill for "just sending emails," don't believe them. Email is the best use case for well-defined layers, because EVERYTHING changes around email: the provider, the templates, the sending policies, the audit requirements. And when something changes, you want to change one file, not five.`,
    relatedIds: ['clean-architecture-los'],
  },
].map((post) => ({
  ...post,
  readingTime: calcReadingTime(post.content),
}))

export const featuredPosts = blogPosts.filter((p) => p.featured)
