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
      'Cuando te dan un proyecto desde cero, la tentación es abrir Visual Studio y empezar a escribir controladores. Pero sin una estructura clara, en 3 meses tienes un Big Ball of Mud. Así diseñé la arquitectura del LOS antes de escribir una línea de código de producción.',
    excerptEn:
      'When you get a greenfield project, the temptation is to open Visual Studio and start writing controllers. But without a clear structure, in 3 months you have a Big Ball of Mud. Here\'s how I designed the LOS architecture before writing a single line of production code.',
    content: `Cuando asumí el diseño del Sistema de Originación de Crédito, sabía que este no sería un proyecto más. Era un sistema completo desde cero: base de datos transaccional, API REST con múltiples canales de consumo, integración con burós de crédito, verificación biométrica, y un flujo de 23 estados que un préstamo recorre desde la solicitud hasta el desembolso.

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
    contentEn: `When I took on the design of the Loan Origination System, I knew this wouldn't be just another project. It was a complete system from scratch: transactional database, REST API with multiple consumption channels, credit bureau integration, biometric verification, and a 23-state workflow that a loan travels through from application to disbursement.

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

**Three. Clean Architecture isn't just for complex domains.** Email is pure infrastructure and it benefits JUST AS MUCH as a financial domain. The layers aren't decoration — they're what let you swap an entire implementation without the rest of the system knowing. If someone tells you Clean Architecture is overkill for "just sending emails," don't believe them. Email is the best use case for well-defined layers, because EVERYTHING changes around email: the provider, the templates, the sending policies, the audit requirements. And when something changes, you want to change one file, not five.`,
    relatedIds: ['clean-architecture-los'],
  },

  // ═════════════════════════════════════════════════════════════════════════
  // Artículo 4 — Dual-frontend Clean Architecture (.NET 10 + Blazor)
  // ═════════════════════════════════════════════════════════════════════════
  {
    id: 'dual-frontend-clean-architecture-dotnet-10',
    slug: 'dual-frontend-clean-architecture-dotnet-10',
    title: 'Diseñé un ERP donde la capa de presentación (Blazor) y la REST API son intercambiables gracias a Clean Architecture',
    titleEn: 'I Designed an ERP Where the Presentation Layer (Blazor) and REST API Are Interchangeable Thanks to Clean Architecture',
    date: '2026-07-01',
    tags: ['.NET', 'clean architecture', 'Blazor', 'ASP.NET Core', 'C#'],
    category: 'arquitectura',
    featured: true,
    excerpt:
      'Cómo logré que Blazor y la API compartieran exactamente la misma lógica de negocio en un ERP de producción mediante inyección de dependencias en Clean Architecture, eliminando duplicación y acelerando el desarrollo de características.',
    excerptEn:
      'How I made Blazor and the API share identical business logic in a production ERP through dependency injection in Clean Architecture, eliminating duplication and accelerating feature development.',
    content: `**El problema: dos frontends para el mismo ERP**

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

El verdadero valor de Clean Architecture no reside principalmente en la testabilidad (aunque es un beneficio importante), sino en su capacidad para hacer que la lógica de negocio sea verdaderamente compartible entre múltiples consumidores. Cuando diseñamos pensando en múltiples puntos de entrada (web, API, workers) desde el inicio, evitamos el costo oculto de la duplicación que surge cuando se añaden nuevos canales después. La clave técnica fue reconocer que la capa de aplicación no debe conocer nada sobre el mecanismo de entrega (HTTP, SignalR, cola) sino enfocarse exclusivamente en orquestar reglas de dominio. Esta separación permitió que Blazor operara con latencia interna mínima mientras la API mantenía su contrato externo estable, todo usando exactamente el mismo código de negocio.`,
    contentEn: `**The problem: two frontends for the same ERP**

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

Clean Architecture's true value isn't primarily testability (though it's an important benefit) but its ability to make business logic genuinely shareable across multiple consumers. When designing for multiple entry points (web, API, workers) from the outset, we avoid the hidden cost of duplication that arises when adding channels later. The technical key was recognizing that the application layer must know nothing about the delivery mechanism (HTTP, SignalR, queue) and focus solely on orchestrating domain rules. This separation allowed Blazor to operate with minimal internal latency while the API maintained its external contract stable, using identical business logic.`,
    relatedIds: ['clean-architecture-los'],
  },

  // ═════════════════════════════════════════════════════════════════════════
  // Artículo 5 — Domain Exception → ProblemDetails Pipeline
  // ═════════════════════════════════════════════════════════════════════════
  {
    id: 'domain-exception-problemdetails-pipeline',
    slug: 'error-handling-middleware-pipeline',
    title: 'Todo el error handling de mi API se reduce a dos archivos: así eliminé los try-catch de mis controladores',
    titleEn: 'My entire API error handling lives in two files: how I eliminated try-catch from my controllers',
    date: '2026-07-15',
    tags: ['arquitectura', '.NET', 'ASP.NET Core', 'patrones', 'C#'],
    category: 'arquitectura',
    featured: true,
    excerpt:
      'Cada controller tenía su propio try-catch, cada error devolvía un formato distinto, y los mensajes mezclaban detalles técnicos con reglas de negocio. Unificarlo todo en dos archivos — DomainExceptions.cs + ExceptionHandlingMiddleware — cambió la forma en que pensamos los errores.',
    excerptEn:
      'Every controller had its own try-catch, each error returned a different format, and messages mixed technical details with business rules. Unifying it all in two files — DomainExceptions.cs + ExceptionHandlingMiddleware — changed how we think about errors.',
    content: `**El problema: error handling en cada esquina**

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

El error handling no es responsabilidad de los controllers. Es un concern transversal que pertenece al middleware. Cada vez que veo un try-catch en un controller, sé que hay una abstracción faltante. Las excepciones de dominio tipadas son la mejor documentación viva de "qué puede salir mal" en el sistema: abrís DomainExceptions.cs y ves todos los casos de error de negocio en una pantalla. El patrón middleware + excepciones tipadas es tan simple que cuesta creer que funcionó tan bien. Pero funcionó porque respeta la separación de capas: dominio define qué puede fallar, infraestructura decide cómo se expresa HTTP.`,
    contentEn: `**The problem: error handling everywhere**

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

Error handling is not a controller responsibility. It's a cross-cutting concern that belongs in middleware. Every time I see a try-catch in a controller, I know there's a missing abstraction. Typed domain exceptions are the best living documentation of "what can go wrong" in the system: open DomainExceptions.cs and see every business error case on one screen. The middleware-plus-typed-exceptions pattern is so simple it's hard to believe it worked this well. But it worked because it respects layer separation: domain defines what can fail, infrastructure decides how it's expressed over HTTP.`,
    relatedIds: ['dual-frontend-clean-architecture-dotnet-10'],
  },

  // ═════════════════════════════════════════════════════════════════════════
  // Artículo 6 — Dapper + Stored Procedures
  // ═════════════════════════════════════════════════════════════════════════
  {
    id: 'dapper-stored-procedures-why-how',
    slug: 'dapper-stored-procedures-en-lugar-de-ef-core',
    title: 'No uso Entity Framework. En 3 años de ERP, cero migraciones, cero N+1, cero sorpresas en producción',
    titleEn: 'I don\'t use Entity Framework. In 3 years of ERP development, zero migrations, zero N+1, zero production surprises',
    date: '2026-08-01',
    tags: ['Dapper', 'arquitectura', '.NET', 'performance', 'patrones'],
    category: 'arquitectura',
    featured: true,
    excerpt:
      'Cada vez que alguien dice "usa EF Core, es el estándar", me pregunto si su base de datos tiene 200 stored procedures legacy y un equipo de DBA. Te cuento por qué elegimos Dapper puro y cómo vivimos para contarlo.',
    excerptEn:
      'Every time someone says "use EF Core, it\'s the standard", I wonder if their database has 200 legacy stored procedures and a DBA team. Here\'s why we chose pure Dapper and lived to tell the tale.',
    content: `**El problema: 200 stored procedures no se migran a EF Core**

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

Dapper no es una alternativa "menos capaz" a EF Core. Es la herramienta correcta cuando tu capa de datos está dominada por stored procedures y el rendimiento importa. EF Core brilla en aplicaciones code-first donde el ORM es dueño del esquema. En sistemas ERP donde la base de datos es un activo legacy gestionado por DBAs, forzar un ORM crea más fricción que valor. La clave está en preguntarse: ¿quién es dueño de la base de datos? Si es el equipo de desarrollo con code-first, EF Core. Si es un equipo de DBA con SPs versionados, Dapper.`,
    contentEn: `**The problem: 200 stored procedures don't migrate to EF Core**

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

Dapper isn't a "less capable" alternative to EF Core. It's the right tool when your data layer is dominated by stored procedures and performance matters. EF Core excels in code-first applications where the ORM owns the schema. In ERP systems where the database is a legacy asset managed by DBAs, forcing an ORM creates more friction than value. The key question is: who owns the database? If it's the dev team with code-first, use EF Core. If it's a DBA team with versioned SPs, use Dapper.`,
    relatedIds: ['clean-architecture-los'],
  },

  // ═════════════════════════════════════════════════════════════════════════
  // Artículo 7 — API Versioning Transparent Contract Evolution
  // ═════════════════════════════════════════════════════════════════════════
  {
    id: 'api-versioning-transparent-contract-evolution',
    slug: 'versionado-api-transparente-sin-romper-clientes',
    title: 'Versioné 24 controladores de una API en producción sin cambiar ni una sola URL existente',
    titleEn: 'I versioned 24 production API controllers without changing a single existing URL',
    date: '2026-08-15',
    tags: ['API', 'arquitectura', '.NET', 'ASP.NET Core', 'patrones'],
    category: 'arquitectura',
    featured: true,
    excerpt:
      'Cuando 24 controladores están en producción y los clientes no pueden actualizarse todos al mismo tiempo, romper URLs no es una opción. Así implementé versionado transparente con rutas duales sin que ningún consumidor legacy se enterara.',
    excerptEn:
      'When 24 controllers are in production and clients can\'t all update simultaneously, breaking URLs is not an option. Here\'s how I implemented transparent versioning with dual routes without any legacy consumer noticing.',
    content: `**El problema: evolucionar sin romper**

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

El versionado de API exitoso no se trata de crear nuevas URLs, sino de dar tiempo a los consumidores para migrar. Un contrato transparente evoluciona respetando tanto la necesidad del producto de avanzar como la estabilidad que requieren los clientes. Identificar puntos de leverage como un base controller reduce drásticamente el trabajo mecánico. Y encontrar outliers temprano (como el controlador de autenticación con ruta no estándar) evita sorpresas en producción.`,
    contentEn: `**The problem: evolve without breaking**

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

Successful API versioning isn't about creating new URLs — it's about giving consumers time to migrate. A transparent contract evolves respecting both the product's need to advance and the stability clients require. Identifying leverage points like a base controller drastically reduces mechanical work. And finding outliers early (like the authentication controller with a non-standard route) prevents production surprises.`,
    relatedIds: ['dual-frontend-clean-architecture-dotnet-10'],
  },

  // ═════════════════════════════════════════════════════════════════════════
  // Artículo 8 — Cross-system orchestration without coupling
  // ═════════════════════════════════════════════════════════════════════════
  {
    id: 'cross-system-orchestration-without-coupling',
    slug: 'orquestacion-cross-system-sin-acoplamiento',
    title: 'Una orden de trabajo recorre 3 sistemas sin que ninguno se acople al otro: el orquestador es un método, no un microservicio',
    titleEn: 'A work order travels through 3 systems without any coupling to each other: the orchestrator is a method, not a microservice',
    date: '2026-09-01',
    tags: ['arquitectura', '.NET', 'patrones', 'orquestación', 'integraciones'],
    category: 'arquitectura',
    featured: true,
    excerpt:
      'Cuando una orden de producción necesita notificar por email, guardar PDFs en la nube y actualizar el estado en otro sistema, la tentación es crear un orquestador. Pero a veces el orquestador correcto es un método de 30 líneas.',
    excerptEn:
      'When a production order needs to notify by email, save PDFs to the cloud, and update status in another system, the temptation is to build an orchestrator service. But sometimes the right orchestrator is a 30-line method.',
    content: `**El problema: una orden que no vive en un solo sistema**

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

    // 3. Marcar orden como enviada en BG360
    var codigoEstado = await _bg360Service.MarcarEnvioFormatoAsync(
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

Los responsables del envío se cargan dinámicamente desde la API Atlas de BG360, en lugar de estar hardcodeados:

\`\`\`csharp
var responsables = await _bg360Api.ObtenerResponsablesProcesoAsync(
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
         [BG360 API] → MarcarEnvioFormato
\`\`\`

**El impacto**

Cero servicios nuevos que deployar. Cero archivos temporales en disco (los streams de PDF se resetean con Position = 0 en vez de guardarse). Trazabilidad completa porque cada paso se loguea con el mismo TransactionId del email. Si el paso 3 falla, el paso 2 puede revertirse. Los interfaces permiten mockear cada integración en tests unitarios. El método completo tiene menos de cuarenta líneas.

**Lecciones aprendidas**

Orquestación no requiere un microservicio dedicado ni una cola de mensajes. Un Application Service bien diseñado puede encadenar operaciones cross-system sin acoplar los sistemas entre sí. La clave está en los límites de interfaz, no en los límites físicos de servicio. Cada sistema expone una interfaz, el service method las orquesta. Los PDFs en memoria sin archivos temporales son un detalle que parece menor pero elimina toda una categoría de bugs (archivos huérfanos, permisos, limpieza). Y cargar dinámicamente los responsables desde la API en lugar de hardcodearlos significa que el negocio puede cambiar quién recibe cada notificación sin tocar una línea de código.`,
    contentEn: `**The problem: an order that lives in no single system**

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

    // 3. Mark order as sent in BG360
    var codigoEstado = await _bg360Service.MarcarEnvioFormatoAsync(
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

The notification responsables are loaded dynamically from the BG360 Atlas API, rather than being hardcoded:

\`\`\`csharp
var responsables = await _bg360Api.ObtenerResponsablesProcesoAsync(
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
         [BG360 API] → MarcarEnvioFormato
\`\`\`

**The impact**

Zero new services to deploy. Zero temporary files on disk (PDF streams are reset with Position = 0 instead of being saved). Full traceability because each step is logged with the same TransactionId from the email. If step 3 fails, step 2 can be rolled back. Interfaces allow mocking each integration for unit tests. The complete method is under forty lines.

**Lessons learned**

Orchestration doesn't require a dedicated microservice or a message queue. A well-designed Application Service method can chain cross-system operations without coupling the systems to each other. The key is interface boundaries, not physical service boundaries. Each system exposes an interface, the service method orchestrates them. PDFs in memory without temp files is a detail that seems minor but eliminates an entire category of bugs (orphan files, permissions, cleanup). And loading responsables dynamically from the API instead of hardcoding them means the business can change who receives each notification without touching a single line of code.`,
    relatedIds: ['comunicaciones-api-centralizada'],
  },
].map((post) => ({
  ...post,
  readingTime: calcReadingTime(post.content),
}))

export const featuredPosts = blogPosts.filter((p) => p.featured)
