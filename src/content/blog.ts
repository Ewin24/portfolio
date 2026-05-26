import type { BlogPost } from '../types'

function calcReadingTime(text: string): number {
  const words = text.split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}

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
  },
]
  .map((post) => ({
    ...post,
    readingTime: calcReadingTime(post.content),
  }))
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

export const featuredPosts = blogPosts.filter((p) => p.featured)
