import type { CaseStudy } from '../types'

/**
 * CASOS DE ESTUDIO REALES — extraídos de sistemas en producción.
 * ───────────────────────────────────────────────────────────
 * Cada entrada representa un proyecto real con datos factuales
 * extraídos de la documentación técnica y decisiones de arquitectura.
 *
 * FÓRMULA para `impact`:
 * ✅ "Redujimos el tiempo de procesamiento de 48h a 5min (↓98%)"
 * ❌ "Mejoré el rendimiento"
 *
 * FÓRMULA para `problem`:
 * ✅ "10,000 facturas diarias con cuello de botella de 48h en pagos"
 * ❌ "No tenían sistema"
 */

export const caseStudies: CaseStudy[] = [
  // ═════════════════════════════════════════════════════════════════════════
  // PROYECTO 1 — Fábricas de Crédito QUAC (LOS)
  // Sistema de Originación de Crédito completo
  // ═════════════════════════════════════════════════════════════════════════
  {
    id: 'fabricas-credit-los',
    slug: 'sistema-originacion-credito-los',
    featured: true,
    lead: true,
    order: 1,

    title: 'Sistema de Originación de Crédito (LOS) — Fábricas de Crédito QUAC',
    titleEn: 'Loan Origination System (LOS) — Fábricas de Crédito QUAC',

    company: 'Fábricas de Crédito QUAC',
    companyAnon: false,
    industry: 'Fintech / Crédito',

    period: '2025 – 2026',
    role: 'Arquitecto de Software / Desarrollador Full Stack',
    roleEn: 'Software Architect / Full Stack Developer',

    problem:
      'La empresa no contaba con un sistema digital de originación de crédito. Las solicitudes se procesaban de forma manual, tomando días en completarse, sin validación de identidad ni detección de fraude. Cada solicitud requería revisión humana sin automatización, generando demoras, errores de conciliación y exposición a suplantación de identidad.',
    problemEn:
      'The company had no digital loan origination system. Applications were processed manually, taking days to complete, with no identity verification or fraud detection. Each application required human review without automation, causing delays, reconciliation errors, and exposure to identity theft.',

    solution:
      'Diseñé y construí el sistema completo desde cero. En la capa de datos: DDL con 4 esquemas lógicos (cfg/cat/fab/aud), 30+ tablas transaccionales, máquina de estados de 23 estados, y 27 stored procedures optimizados. En la capa de servicios: API REST en .NET con Clean Architecture — repositorios por esquema, servicios por dominio funcional (Estudio, Tercero, OTP, Biometría) y controladores por canal (Admin/Tienda/Web/Handoff). Implementé el SOVI (Sistema Orquestador de Validación de Identidad) con patrón Strategy para verificación por bot de voz + validación manual, con motor de decisiones catalog-driven (sin if/switch hardcodeados). Integré detección de fraude con análisis biométrico de fotografías y un flujo completo de auditoría INSERT-ONLY. Más adelante hice configurable el proveedor de datos de riesgo mediante una interfaz de estrategia (`IProveedorContactos`) y un resolvedor que mapea por diccionario el proveedor configurado a su implementación —sumar un tercer proveedor es una clase nueva y un registro de inyección de dependencias, cero `if`—, detrás de un feature flag que funciona como kill switch sin redespliegue y con un stub de falla explícita para la rama cuyo mapeo semántico todavía no está definido: nunca aprueba ni niega en silencio, y nunca cae de vuelta al otro proveedor.',
    solutionEn:
      'Designed and built the complete system from scratch. Data layer: DDL with 4 logical schemas (cfg/cat/fab/aud), 30+ transactional tables, 23-state state machine, and 27 optimized stored procedures. Service layer: REST API in .NET with Clean Architecture — repositories per schema, services per functional domain (Study, ThirdParty, OTP, Biometrics), controllers per channel (Admin/Store/Web/Handoff). Implemented SOVI (Identity Validation Orchestrator System) with Strategy pattern for voice bot verification + manual validation, with a catalog-driven decision engine (no hardcoded if/switch). Integrated fraud detection with biometric photo analysis and a complete INSERT-ONLY audit trail. Later I made the risk-data provider configurable through a strategy interface (`IProveedorContactos`) and a resolver that maps the configured provider to its implementation by dictionary —adding a third provider is one new class and one dependency-injection registration, zero `if`— behind a feature flag that acts as a kill switch without redeployment, and with an explicit-fail stub for the branch whose semantic mapping is not defined yet: it never silently approves or denies, and never falls back to the other provider.',

    impact:
      '114+ endpoints API en 6 capas BFF (Admin/Core/Tienda/Web/Handoff/Util). 27 stored procedures en producción. 23 estados de ciclo de vida de crédito con trazabilidad completa. Verificación de identidad automatizada vía bot de voz con plan B manual como ciudadano de primera clase. Auditoría inmutable de todas las operaciones. 474/474 pruebas verdes tras hacer configurable el proveedor de datos de riesgo, entregado como 3 PRs encadenados.',
    impactEn:
      '114+ API endpoints across 6 BFF layers (Admin/Core/Store/Web/Handoff/Util). 27 stored procedures in production. 23-state loan lifecycle with full traceability. Automated identity verification via voice bot with manual Plan B as a first-class citizen. Immutable audit trail of all operations. 474/474 tests green after making the risk-data provider configurable, delivered as 3 chained PRs.',

    stack: ['.NET 8+', 'C#', 'Dapper', 'SQL Server', 'Clean Architecture', 'REST API', 'JWT', 'Strategy Pattern'],
    architectureDiagram: 'Arquitectura en 3 capas: BFFs (Admin/Tienda/Web/Handoff/Util) → Domain Services (Estudio, Tercero, OTP, Biometría) → Repositories por Schema (cfg/cat/fab/aud). Cada BFF inyecta los mismos servicios de dominio. Sin duplicación entre canales.',
    hasNDA: true,
    tags: ['fintech', 'architecture', 'fullstack', 'los', 'ddd', 'dotnet', 'strategy', 'feature-flags'],
  },

  // ═════════════════════════════════════════════════════════════════════════
  // PROYECTO 2 — SOVI (Sistema Orquestador de Validación de Identidad)
  // Módulo de verificación biométrica + bot de voz
  // ═════════════════════════════════════════════════════════════════════════
  {
    id: 'sovi-identity-verification',
    slug: 'sistema-orquestador-validacion-identidad',
    featured: true,
    order: 2,

    title: 'SOVI — Sistema Orquestador de Validación de Identidad',
    titleEn: 'SOVI — Identity Validation Orchestrator System',

    company: 'Fábricas de Crédito QUAC',
    companyAnon: false,
    industry: 'Fintech / Seguridad',

    period: '2026',
    role: 'Arquitecto de Software',
    roleEn: 'Software Architect',

    problem:
      'El sistema de originación de crédito (LOS) requería validar la identidad del cliente en tiempo real mientras estaba activo en el flujo de solicitud. Sin esta validación, el riesgo de suplantación de identidad era crítico. Necesitaba un sistema que funcionara tanto automatizado (bot de voz) como con respaldo manual, con trazabilidad completa de cada intento.',
    problemEn:
      'The loan origination system (LOS) needed to validate borrower identity in real-time while the client was active in the application flow. Without this validation, the risk of identity theft was critical. It needed to work both automated (voice bot) and with manual backup, with full traceability of each attempt.',

    solution:
      'Diseñé el SOVI con tres tablas especializadas (catálogo de diagnósticos, campañas por estudio, intentos con biometría). Implementé el patrón Strategy con dos estrategias: BotValidacionStrategy (automático vía bot de voz) y ManualValidacionStrategy (asesor humano como plan B). El motor de decisiones no tiene if/switch hardcodeados — cada diagnóstico del bot dispara una AccionSistema desde el catálogo en base de datos. Cada intento registra timestamps, URL de audio y datos biométricos para auditoría completa.',
    solutionEn:
      'Designed SOVI with three specialized tables (diagnosis catalog, campaigns per study, attempts with biometrics). Implemented the Strategy pattern with two strategies: BotValidacionStrategy (automatic via voice bot) and ManualValidacionStrategy (human advisor as Plan B). The decision engine has no hardcoded if/switch — each bot diagnosis triggers a SystemAction from the database catalog. Each attempt logs timestamps, audio URL, and biometric data for complete audit trail.',

    impact:
      'Validación de identidad en tiempo real sin intervención humana en el flujo estándar. Plan B manual como ciudadano de primera clase (no un fallback after-thought). Motor de decisiones catalog-driven: agregar nuevos diagnósticos no requiere cambios de código. Trazabilidad completa por estudio con 10+ diagnósticos de bot categorizados.',
    impactEn:
      'Real-time identity validation without human intervention in the standard flow. Manual Plan B as a first-class citizen (not a fallback after-thought). Catalog-driven decision engine: adding new diagnoses requires no code changes. Full traceability per study with 10+ categorized bot diagnoses.',

    stack: ['.NET', 'C#', 'SQL Server', 'Strategy Pattern', 'REST API'],
    architectureDiagram: 'Strategy Pattern: IValidacionStrategy → BotValidacionStrategy + ManualValidacionStrategy. Motor de decisiones catalog-driven: cat.CatalogoDiagnosticosBot.AccionSistema determina el flujo. Cada intento registra timestamp + UrlAudio + biometría en fab.IntentosValidacionBot.',
    hasNDA: true,
    tags: ['identity', 'security', 'architecture', 'fintech', 'strategy-pattern'],
  },

  // ═════════════════════════════════════════════════════════════════════════
  // PROYECTO 3 — ApiDatacreditoV2 — Buró de Crédito
  // API de consulta a centrales de riesgo
  // ═════════════════════════════════════════════════════════════════════════
  {
    id: 'datacredito-api',
    slug: 'api-buro-credito-datacredito',
    featured: true,
    order: 3,

    title: 'API de Integración con Burós de Crédito — Datacredito',
    titleEn: 'Credit Bureau Integration API — Datacredito',

    company: 'Baguer Software',
    companyAnon: false,
    industry: 'Fintech / Riesgo Crediticio',

    period: '2024 – 2025',
    role: 'Desarrollador Backend',
    roleEn: 'Backend Developer',

    problem:
      'El proceso de consulta a centrales de riesgo (Datacredito) requería integración manual con formatos legacy. Las consultas tardaban más de 3 segundos en promedio por falta de índices optimizados, las credenciales de cada servicio estaban hardcodeadas en código y archivos de configuración dispersos, y cuando una consulta fallaba no había forma de saber si el problema era del proveedor, de la red, o de los datos de entrada. Sin trazabilidad: cero registro de respuestas, cero auditoría de fallos, cero posibilidad de reproducir un error reportado por un usuario.',
    problemEn:
      'The credit bureau query process (Datacredito) required manual integration with legacy formats. Queries took over 3 seconds on average due to missing optimized indexes, each service\'s credentials were hardcoded in code and scattered across config files, and when a query failed there was no way to know if the problem was the provider, the network, or the input data. Zero traceability: no response logging, no failure audit, no way to reproduce a user-reported error.',

    solution:
      'Construí una API REST en .NET 8 con Dapper + SQL Server. Para la resiliencia: Polly con circuit breaker (separa fallos del proveedor del resto del sistema) + retry policy exponencial. Para las credenciales: diseñé un patrón de CredentialFactory con interfaz ICredentialProvider (las credenciales se consultan desde base de datos, no del código), con caché por servicio y expiración automática — agregar un nuevo proveedor es una fila en una tabla, no un cambio de código. Para la trazabilidad: middleware de request/response logging con sanitización de campos sensibles (números de documento, claves), Serilog con tres pipelines (consola + archivo + base de datos), y el patrón always-register que persiste el resultado de cada consulta con su campo FueExitoso tanto en éxito como en fallo. Arquitectura en 3 capas (Web/Data/Common) con inyección de dependencias, optimización de índices en las tablas de historial, y procedimientos almacenados específicos por cada uno de los 5 servicios del proveedor (Preselecta, CrossCore, Historia, Evidente, Reconocer).',
    solutionEn:
      'Built a REST API in .NET 8 with Dapper + SQL Server. For resilience: Polly with circuit breaker (isolates provider failures from the rest of the system) + exponential retry policy. For credentials: designed a CredentialFactory pattern with an ICredentialProvider interface (credentials are queried from the database, not from code), with per-service caching and automatic expiration — adding a new provider is a row in a table, not a code change. For traceability: request/response logging middleware with sensitive field sanitization (document numbers, keys), Serilog with three pipelines (console + file + database), and the always-register pattern that persists every query result with its FueExitoso field for both success and failure. 3-layer architecture (Web/Data/Common) with dependency injection, index optimization on history tables, and specific stored procedures for each of the 5 provider services (Preselecta, CrossCore, Historia, Evidente, Reconocer).',

    impact:
      'Reducción drástica de tiempos de consulta (de 3+ segundos a sub-segundo) mediante índices optimizados y caché de credenciales. CredentialFactory centralizado: cero duplicación de claves, agregar un nuevo proveedor sin desplegar código. Resiliencia operativa: circuit breaker aísla fallos del proveedor sin afectar otras integraciones. Trazabilidad completa: cada consulta queda registrada con su respuesta real del proveedor — cuando un analista reporta un fallo, se reproduce en segundos abriendo la tabla de auditoría. Patrón always-register: FueExitoso=true/false para todos los servicios, sin excepciones. Arquitectura preparada para migración a .NET 10 sin cambios estructurales.',
    impactEn:
      'Drastic query time reduction (from 3+ seconds to sub-second) through optimized indexes and credential caching. Centralized CredentialFactory: zero key duplication, adding a new provider without deploying code. Operational resilience: circuit breaker isolates provider failures without affecting other integrations. Complete traceability: every query is logged with its real provider response — when an analyst reports a failure, it is reproduced in seconds by opening the audit table. Always-register pattern: FueExitoso=true/false for all services, no exceptions. Architecture ready for .NET 10 migration without structural changes.',

    stack: ['.NET 8', 'C#', 'Dapper', 'SQL Server', 'Polly', 'Serilog', 'JWT', 'REST API', 'Strategy Pattern', 'Factory Pattern'],
    architectureDiagram:
      'Flujo: Cliente → [Controller] → [CredentialFactory] → ICredentialProvider (BD) → Token con caché por servicio\n                                              ↓\n                                     [Polly: retry + circuit breaker]\n                                              ↓\n                                     [5 Servicios del proveedor]\n                                              ↓\n                          Preselecta | CrossCore | Historia | Evidente | Reconocer\n                                              ↓\n                                     [Dapper] → SQL Server (con índices optimizados)\n                                              ↓\n                                     [Always-Register: FueExitoso + response payload]\n                                              ↓\n                                     [Serilog: console + file + BD] ← auditoría completa',
    hasNDA: true,
    tags: ['fintech', 'api', 'backend', 'resilience', 'dotnet', 'credentials', 'audit'],
  },

  // ═════════════════════════════════════════════════════════════════════════
  // PROYECTO 4 — Extensión de Nóminas para Cadena de Franquicias
  // Sistema de generación de documentos de nómina
  // ═════════════════════════════════════════════════════════════════════════
  {
    id: 'nominas-franquicias',
    slug: 'extension-plantillas-nomina-franquicias',
    featured: true,
    order: 4,

    title: 'Sistema de Nómina — Generación de Documentos para Franquicias',
    titleEn: 'Payroll System — Document Generation for Franchise Chain',

    company: 'Baguer Software',
    companyAnon: false,
    industry: 'ERP / RRHH',

    period: '2025 – 2026',
    role: 'Desarrollador Full Stack',
    roleEn: 'Full Stack Developer',

    problem:
      'El ERP manejaba 45+ tipos de nómina (contratos, terminaciones, cartas) con rutas de documentos estáticas. Una cadena de franquicias de tiendas de ropa requería 3 nuevos tipos de nómina (Comercial, Administrativa, Temporada) con sus propias plantillas Crystal Reports, pero el sistema existente usaba rutas compartidas que no permitían personalización por tipo.',
    problemEn:
      'The ERP handled 45+ payroll types (contracts, terminations, letters) with static document routes. A clothing franchise chain required 3 new payroll types (Commercial, Administrative, Seasonal) with their own Crystal Reports templates, but the existing system used shared routes that did not allow per-type customization.',

    solution:
      'Extendí el sistema de enrutamiento de documentos del CRM para soportar los 3 nuevos tipos de nómina de la cadena de franquicias. Modifiqué el controlador para actualizar la lógica de enrutamiento dinámico: añadí los IDs 46/47/48 al array de nóminas por cuotas, agregué casos específicos en el método de resolución de nombres, y creé 21 archivos .rpt (7 por nómina) en una nueva carpeta dedicada. Todo siguiendo el patrón existente sin afectar las 45+ nóminas legacy.',
    solutionEn:
      'Extended the CRM document routing system to support the 3 new franchise chain payroll types. Modified the controller to update dynamic routing logic: added IDs 46/47/48 to the installments array, added specific cases in the name resolution method, and created 21 .rpt files (7 per payroll type) in a new dedicated folder. All following the existing pattern without affecting 45+ legacy payroll types.',

    impact:
      'Extensión no-invasiva: 0 breaks en nóminas legacy. 21 plantillas Crystal Reports organizadas por tipo de nómina. Patrón reusable para futuros tipos de contrato. Sistema de enrutamiento dinámico probado con 48 tipos de nómina.',
    impactEn:
      'Non-invasive extension: zero breaks in legacy payroll types. 21 Crystal Reports templates organized by payroll type. Reusable pattern for future contract types. Dynamic routing system tested with 48 payroll types.',

    stack: ['C#', '.NET Framework', 'Crystal Reports', 'SQL Server', 'ERP'],
    hasNDA: true,
    tags: ['erp', 'crm', 'reports', 'dotnet', 'payroll'],
  },

  // ═════════════════════════════════════════════════════════════════════════
  // PROYECTO 5 — apiquac Admin Module
  // UI/UX realignment para sistema de originación de crédito
  // ═════════════════════════════════════════════════════════════════════════
  {
    id: 'apiquac-admin-ui',
    slug: 'admin-module-realignment-los',
    featured: true,
    order: 5,

    title: 'Arquitectura UI para Módulo Administrativo de LOS',
    titleEn: 'UI Architecture for LOS Admin Module',

    company: 'Baguer Software',
    companyAnon: false,
    industry: 'Fintech / SaaS',

    period: '2026',
    role: 'Arquitecto Frontend',
    roleEn: 'Frontend Architect',

    problem:
      'La API V2 del sistema de originación de crédito tenía dominios backend bien estructurados (AUD, CAT, CFG, FAB), pero la interfaz de administración no reflejaba esta separación. El monitoreo en tiempo real (auditoría, colas de crédito) estaba mezclado con la configuración CRUD (catálogos, reglas de negocio), creando una experiencia confusa para el operador.',
    problemEn:
      'The V2 API of the loan origination system had well-structured backend domains (AUD, CAT, CFG, FAB), but the admin interface did not reflect this separation. Real-time monitoring (audit, credit queues) was mixed with CRUD configuration (catalogs, business rules), creating a confusing operator experience.',

    solution:
      'Diseñé la reestructuración del módulo Admin en dos macro-módulos: "Panel de Control" (dashboard de monitoreo consumiendo endpoints AUD + FAB read-only) y "Módulo Administrar" (interfaz tipo navegador con tabs: Catálogos/CAT, Workflow/CFG, Operación/FAB). Mapeé cada área del backend a su macro-módulo correspondiente, delegando la gestión de roles/permisos a la aplicación host. La navegación refleja la arquitectura limpia del backend.',
    solutionEn:
      'Designed the restructuring of the Admin module into two macro-modules: "Panel de Control" (monitoring dashboard consuming AUD + FAB read-only endpoints) and "Módulo Administrar" (browser-like interface with tabs: Catalogs/CAT, Workflow/CFG, Operations/FAB). Mapped each backend area to its corresponding macro-module, delegating role/permission management to the host application. Navigation reflects the clean backend architecture.',

    impact:
      'Separación clara de responsabilidades UI (monitoreo vs. configuración). Arquitectura escalable: agregar nuevas capacidades solo requiere crear un nuevo tab en el macro-módulo correspondiente. Sin duplicación de lógica de permisos. Consistencia con la arquitectura limpia del backend.',
    impactEn:
      'Clear separation of UI responsibilities (monitoring vs. configuration). Scalable architecture: adding new capabilities only requires creating a new tab in the corresponding macro-module. No permission logic duplication. Consistency with the clean backend architecture.',

    stack: ['React', 'TypeScript', 'REST API', 'UI Architecture'],
    hasNDA: true,
    tags: ['frontend', 'architecture', 'ui', 'fintech'],
  },

  // ═════════════════════════════════════════════════════════════════════════
  // PROYECTO 6 — Portfolio Personal (público)
  // ═════════════════════════════════════════════════════════════════════════
  {
    id: 'portfolio-hybrid',
    slug: 'portfolio-arquitectura-hibrida',
    featured: true,
    order: 6,

    title: 'Portfolio con Arquitectura Híbrida (React 19 + Vite)',
    titleEn: 'Hybrid Architecture Portfolio (React 19 + Vite)',

    company: 'Proyecto Personal',
    companyAnon: false,
    industry: 'Desarrollo Web',

    period: '2026 – Presente',
    role: 'Desarrollador Frontend y Diseñador',
    roleEn: 'Frontend Developer & Designer',

    problem:
      'Los portfolios de desarrolladores muestran código pero no el impacto de negocio. Depender exclusivamente de la API de GitHub para mostrar proyectos oculta el trabajo más valioso: sistemas privados empresariales bajo NDA. Necesitaba una plataforma que vendiera ingeniería, no solo repositorios públicos.',
    problemEn:
      'Developer portfolios show code but not business impact. Relying exclusively on the GitHub API to showcase projects hides the most valuable work: private enterprise systems under NDA. I needed a platform that sells engineering, not just public repositories.',

    solution:
      'Diseñé una arquitectura híbrida: capa de contenido curado (casos de estudio en TypeScript con formato STAR, experiencia laboral, blog) como fuente principal de verdad, y API de GitHub como widget secundario de actividad. Implementé i18n nativo (ES/EN), design system editorial pixel-art con sombras pixeladas y tipografía de periódico, y animaciones con Framer Motion. Construido con React 19 + Vite + TypeScript + Tailwind CSS v4. Sobre esa base sumé un segundo tema seleccionable por `data-theme` —del periódico editorial a un escritorio interactivo estilo XP— con un WindowManager que es dueño de cada rectángulo, clamp y orden Z: ventanas arrastrables, redimensionado por 8 asas, menú de inicio, barra de tareas con bandeja de utilidades, pestañas dentro de una misma ventana y una ventana de ayuda fuera del registro visible.',
    solutionEn:
      'Designed a hybrid architecture: curated content layer (STAR-format case studies in TypeScript, work experience, blog) as the primary source of truth, and GitHub API as a secondary activity widget. Implemented native i18n (ES/EN), pixel-art editorial design system with pixel shadows and newspaper typography, and Framer Motion animations. Built with React 19 + Vite + TypeScript + Tailwind CSS v4. On top of that I added a second theme selected through `data-theme` —from the editorial newspaper to an interactive XP-style desktop— driven by a WindowManager that owns every rect, clamp and z-order: draggable windows, 8-handle resizing, a Start menu, a taskbar with a utilities tray, tabs inside a single window, and a Help window kept out of the visible registry.',

    impact:
      'Arquitectura que prioriza el impacto de negocio sobre el código fuente. Casos de estudio con NDA sin exponer información confidencial. i18n nativo sin librerías externas. Design system propio que diferencia visualmente de portfolios genéricos. Agregar un caso de estudio = 1 objeto TypeScript. El escritorio XP se construyó con TDD estricto contra un driver Playwright versionado —98/98 verificaciones, RED antes que GREEN en cada unidad de trabajo—, y un segundo driver versionado compara el tema periódico píxel a píxel en 4 viewports × 2 idiomas contra líneas base versionadas: exige 0 píxeles de diferencia, así que el diseño editorial no puede desviarse mientras evoluciona el segundo tema.',
    impactEn:
      'Architecture that prioritizes business impact over source code. NDA-compliant case studies without exposing confidential information. Native i18n without external libraries. Custom design system that visually stands out from generic portfolios. Adding a case study = 1 TypeScript object. The XP desktop was built with strict TDD against a committed Playwright driver —98/98 checks, RED before GREEN on every work unit— and a second committed driver pixel-diffs the newspaper theme across 4 viewports × 2 locales against committed baselines: it demands 0 differing pixels, so the editorial design cannot drift while the second theme evolves.',

    stack: ['React 19', 'TypeScript', 'Vite', 'Tailwind CSS v4', 'Framer Motion', 'GitHub API', 'Playwright'],
    githubUrl: 'https://github.com/Ewin24',
    hasNDA: false,
    tags: ['frontend', 'portfolio', 'architecture', 'react', 'testing', 'tdd', 'design-system'],
  },

  // ═════════════════════════════════════════════════════════════════════════
  // PROYECTO INTERMEDIO — API Centralizada de Comunicaciones (Infobip)
  // Unifica envío de email en 4 capas, 7 controladores, 8 cuentas multi-tenant
  // ═════════════════════════════════════════════════════════════════════════
  {
    id: 'infobip-email-api',
    slug: 'api-centralizada-comunicaciones-infobip',
    featured: true,
    order: 7,

    title: 'API Centralizada de Comunicaciones por Email — Infobip como Proveedor Único',
    titleEn: 'Centralized Email Communications API — Infobip as Single Provider',

    company: 'la empresa',
    companyAnon: true,
    industry: 'Communications / SaaS B2B',

    period: '2024',
    role: 'Arquitecto Backend / Diseñador de APIs',
    roleEn: 'Backend Architect / API Designer',

    problem:
      'La empresa operaba con 5 silos independientes de envío de emails: cada sistema (ERP, CRM, portal de proveedores, sistema de originación de crédito, portal de empleados) llamaba directo al proveedor con sus propias credenciales, su propia lógica de retry, y su propio formato. Cuando un email no llegaba, el tiempo medio de diagnóstico era de 30 minutos — había que revisar logs en 5 servidores distintos, identificar cuál de los 8 buzones falló, y reconstruir la petición a mano. Los nombres de stored procedures internos (prefijo sp_ interno) filtraban contexto de negocio en logs compartidos con proveedores externos, comprometiendo la separación de responsabilidades. Cero trazabilidad cross-system: no se podía responder "¿cuántos emails se enviaron a proveedores en las últimas 24 horas?" sin escribir una query nueva cada vez.',
    problemEn:
      'The company operated with 5 independent email sending silos: each system (ERP, CRM, supplier portal, loan origination system, employee portal) called the provider directly with its own credentials, its own retry logic, and its own format. When an email did not arrive, the average diagnosis time was 30 minutes — logs had to be reviewed across 5 different servers, identify which of the 8 mailboxes failed, and reconstruct the request manually. Internal stored procedure name prefixes leaked business context into logs shared with external providers, compromising responsibility separation. Zero cross-system traceability: it was not possible to answer "how many emails were sent to suppliers in the last 24 hours?" without writing a new query each time.',

    solution:
      'Diseñé una API REST unificadora en .NET 8 con Clean Architecture estricta en 4 capas (Api / Application / Domain / Infrastructure). En la capa de Dominio definí la interfaz IEmailProvider con un único método EnviarCorreoConAdjuntosAsync, abstracta sobre cualquier proveedor. En la capa de Application implementé el EmailService que orquesta: validación, plantillas por contexto, persistencia de la transacción con GUID propio antes de llamar al proveedor, y reintento exponencial. En Infrastructure implementé el adaptador InfobipProvider con HttpClient tipado y Polly para circuit breaker. Las 8 cuentas multi-tenant se configuran en appsettings.json con nombres genéricos por contexto de negocio (no por sistema origen), permitiendo ruteo por contexto sin hardcodear. Cada transacción de email se persiste con un GUID como identidad propia — el nuestro, no el del proveedor — trazable desde el log de aplicación hasta la respuesta HTTP. Serilog con 3 pipelines (consola + archivo rotativo + tabla de auditoría en BD) con sanitización de adjuntos, PII y credenciales. Implementé el patrón de plantilla-por-contexto: cada tipo de email (notificación a proveedor, recordatorio a cliente, alerta interna) tiene su template con tokens tipados en lugar de string interpolation, eliminando errores de placeholder.',
    solutionEn:
      'Designed a unifying REST API in .NET 8 with strict Clean Architecture in 4 layers (Api / Application / Domain / Infrastructure). In the Domain layer I defined the IEmailProvider interface with a single EnviarCorreoConAdjuntosAsync method, abstract over any provider. In the Application layer I implemented the EmailService that orchestrates: validation, per-context templates, transaction persistence with its own GUID before calling the provider, and exponential retry. In Infrastructure I implemented the InfobipProvider adapter with typed HttpClient and Polly for circuit breaker. The 8 multi-tenant accounts are configured in appsettings.json with generic names per business context (not per source system), enabling context-based routing without hardcoding. Each email transaction is persisted with a GUID as its own identity — ours, not the provider\'s — traceable from the application log to the HTTP response. Serilog with 3 pipelines (console + rotating file + audit table in DB) with sanitization of attachments, PII, and credentials. Implemented the per-context template pattern: each email type (supplier notification, customer reminder, internal alert) has its template with typed tokens instead of string interpolation, eliminating placeholder errors.',

    impact:
      'Tiempo medio de diagnóstico de email no entregado: de 30 minutos a 5 segundos (búsqueda por GUID en la tabla de auditoría). Cero credenciales hardcodeadas: las 8 cuentas viven en BD con encriptación, rotables sin redeploy. Cambio de proveedor de email: de "reescribir 5 integraciones" a "implementar un nuevo IEmailProvider" — medido en horas, no semanas. Cero emails huérfanos: cada transacción tiene estado persistido antes de llamar al proveedor, no se pierde traceability si el request falla a mitad de camino. Logs de proveedor compartidos sin filtrar contexto de negocio: nombres de sp_ internos ofuscados, prefijos de negocio en mensajes de log removidos. 7 controladores REST (uno por canal de consumo: admin, suppliers, employees, batch, webhooks, monitoring, admin-tools) consumiendo el mismo servicio de aplicación — cero duplicación de lógica entre canales.',
    impactEn:
      'Average diagnosis time for undelivered email: from 30 minutes to 5 seconds (GUID search in the audit table). Zero hardcoded credentials: the 8 accounts live in the DB with encryption, rotatable without redeploy. Email provider change: from "rewrite 5 integrations" to "implement a new IEmailProvider" — measured in hours, not weeks. Zero orphan emails: every transaction has persisted state before calling the provider, no traceability loss if the request fails mid-way. Shared provider logs without leaking business context: internal sp_ names obfuscated, business prefixes in log messages removed. 7 REST controllers (one per consumption channel: admin, suppliers, employees, batch, webhooks, monitoring, admin-tools) consuming the same application service — zero logic duplication between channels.',

    stack: ['.NET 8', 'C#', 'Clean Architecture', 'Infobip Email API', 'Dapper', 'SQL Server', 'Serilog', 'Polly', 'Azure Blob Storage', 'JWT'],
    architectureDiagram:
      '4 Capas de Clean Architecture:\n[API: 7 Controllers] → [Application: EmailService + retry + audit] → [Domain: IEmailProvider + entities] → [Infrastructure: InfobipProvider + AzureBlobStorage]\n\nFlujo de transacción:\nController → GUID generado → Persist en BD (estado: Pending) → EmailService → IEmailProvider → Infobip API → respuesta → actualizar BD (estado: Sent/Failed) → Serilog (3 pipelines)\n\nMulti-tenant: 8 cuentas en BD indexadas por contexto de negocio (no por sistema origen). Ruteo automático sin hardcodear.',
    hasNDA: true,
    tags: ['api', 'architecture', 'clean-architecture', 'dotnet', 'communications', 'integration', 'multi-tenant', 'audit'],
  },

  // ═════════════════════════════════════════════════════════════════════════
  // PROYECTO 8 — Harmony-Music (Open Source)
  // Mantenedor independiente de app Flutter de música streaming
  // ═════════════════════════════════════════════════════════════════════════
  {
    id: 'harmony-music-oss',
    slug: 'harmony-music-flutter-open-source-maintainer',
    featured: true,
    order: -1,

    title: 'Harmony-Music — Mantenedor de App Flutter Open Source de Música Multiplataforma',
    titleEn: 'Harmony-Music — Maintainer of Cross-Platform Flutter Open Source Music App',

    company: 'Harmony-Music (Fork OSS)',
    companyAnon: false,
    industry: 'Open Source / Mobile & Desktop',

    period: '2026 – Presente',
    role: 'Mantenedor Open Source & Desarrollador Flutter',
    roleEn: 'Open Source Maintainer & Flutter Developer',

    problem:
      'El creador original marcó el repositorio como "no mantenido" en diciembre 2025, dejando una app Flutter cross-platform (Android, Windows, Linux) con dependencias abandonadas (ionicons roto con Dart 3.12), flags de migrador de Gradle sin limpiar, código que crasheaba en runtime (RangeError por indexWhere devolviendo -1), y sin herramientas de debugging. La app usaba una API no documentada (InnerTube de YouTube Music) que cambiaba sin aviso, rompiendo búsquedas y bucketing de resultados.',
    problemEn:
      'The original creator marked the repository as "unmaintained" in December 2025, leaving a cross-platform Flutter app (Android, Windows, Linux) with abandoned dependencies (ionicons broken with Dart 3.12), leftover Gradle migrator flags, code that crashed at runtime (RangeError from indexWhere returning -1), and no debugging tools. The app used an undocumented API (YouTube Music InnerTube) that changed without notice, breaking search and result bucketing.',

    solution:
      'Apliqué una metodología de triage en 4 fases: (1) Build primero — Gradle 8.14, AGP 8.11.1, Kotlin 2.2.20 con DSL moderno, removí flags del migrador, migré a Flutter built-in Kotlin. (2) Deprecaciones — 19 commits reemplazando withOpacity por withValues(alpha:), Color.value por toARGB32(), ThemeData getters por colorScheme, removí ionicons. (3) Runtime — reescribí el bucketing de búsqueda para responder al nuevo formato plano de InnerTube (24/25 resultados caían en buckets huérfanos), agregué guardas de indexWhere, mejoré el logging estructurado de HTTP. (4) Tooling — construí un ResponseRecorder que captura respuestas crudas a disco y un logger con colores ANSI para inspeccionar cambios de API offline. La arquitectura de audio usa just_audio + media_kit + audio_service + SMTC para cubrir 3 plataformas con una sola API Dart.',
    solutionEn:
      'Applied a 4-phase triage methodology: (1) Build first — Gradle 8.14, AGP 8.11.1, Kotlin 2.2.20 with modern DSL, removed migrator flags, migrated to Flutter built-in Kotlin. (2) Deprecations — 19 commits replacing withOpacity with withValues(alpha:), Color.value with toARGB32(), ThemeData getters with colorScheme, removed ionicons. (3) Runtime — rewrote search bucketing to handle the new flat InnerTube format (24/25 results fell into orphan buckets), added indexWhere guards, improved structured HTTP logging. (4) Tooling — built a ResponseRecorder that captures raw responses to disk and a logger with ANSI colors to inspect API changes offline. The audio architecture uses just_audio + media_kit + audio_service + SMTC to cover 3 platforms with a single Dart API.',

    impact:
      '~36 commits en 3 días que llevaron la app de "no compila" a "release v1.12.2" con toolchain moderno. Búsqueda funcional con nuevo formato de InnerTube (clasificación por pageType, top 10 por bucket). Build limpio con Flutter 3.44+. Audio funcional en 3 plataformas con engines separados pero API unificada. Documentación completa (setup, contributing, API surface map, Postman collection). App mantenida activamente en GitHub con releases y changelog.',
    impactEn:
      '~36 commits in 3 days that took the app from "does not compile" to "release v1.12.2" with modern toolchain. Working search with new InnerTube format (pageType classification, top 10 per bucket). Clean build with Flutter 3.44+. Working audio on 3 platforms with separate engines but unified API. Complete documentation (setup, contributing, API surface map, Postman collection). Actively maintained app on GitHub with releases and changelog.',

    stack: ['Flutter 3.44+', 'Dart', 'GetX', 'just_audio', 'media_kit', 'audio_service', 'youtube_explode_dart', 'Hive', 'Dio', 'JNI'],
    architectureDiagram: 'Capa de UI (GetX controllers) → Capa de Servicios (MusicService/InnerTube, StreamService/youtube_explode, AudioHandler/audio_service) → Storage local (Hive boxes: AppPrefs, SongsCache, SongDownloads, SongsUrlCache) → Engines de audio: just_audio (Android/ExoPlayer) + just_audio_media_kit (Windows/Linux/mpv) + SMTC (Windows media keys). Aíslates para URL fetch. Debug overlay con ResponseRecorder + structured logger.',
    githubUrl: 'https://github.com/Ewin24/Harmony-Music',
    hasNDA: false,
    tags: ['flutter', 'open-source', 'oss', 'maintenance', 'mobile', 'desktop', 'audio', 'build', 'api-resilience'],
  },

  // ═════════════════════════════════════════════════════════════════════════
  // PROYECTO 7 — STARSOL (SaaS Riesgos Financieros)
  // Plataforma B2B para el sector solidario
  // ═════════════════════════════════════════════════════════════════════════
  {
    id: 'starsol-saas',
    slug: 'starsol-saas-riesgos-financieros',
    featured: true,
    order: 0,

    title: 'STARSOL — Plataforma SaaS para Gestión Integral de Riesgos',
    titleEn: 'STARSOL — SaaS Platform for Integrated Risk Management',

    company: 'STARSOL',
    companyAnon: false,
    industry: 'Fintech / Riesgos',

    period: '2024 – Presente',
    role: 'Arquitecto de Software Cloud & Desarrollador Independiente',
    roleEn: 'Cloud Software Architect & Independent Developer',

    problem:
      'Las entidades del sector solidario (cooperativas, fondos de empleados) enfrentaban procesos manuales para la gestión de riesgos SARLAFT, SARC y SIAR, con flujos de originación de crédito y monitoreo normativo sin digitalizar. El servidor web monolítico se convertía en cuello de botella al procesar archivos financieros pesados de forma sincrónica, degradando la experiencia del usuario.',
    problemEn:
      'Entities in the solidarity sector (cooperatives, employee funds) faced manual processes for SARLAFT, SARC, and SIAR risk management, with undigitized loan origination flows and regulatory monitoring. The monolithic web server became a bottleneck when processing heavy financial files synchronously, degrading the user experience.',

    solution:
      'Diseñé y construí STARSOL desde cero como plataforma SaaS B2B en PHP con Laravel, implementando una arquitectura asíncrona con 3 background workers que procesan jobs simultáneamente, desacoplando completamente la carga de archivos del hilo principal del servidor web. Para la gestión avanzada de archivos, desarrollé una aplicación cliente en .NET MAUI con capacidad offline que se sincroniza con el backend en la nube. A nivel de infraestructura, aprovisioné entornos de alta disponibilidad en AWS con prácticas CI/CD, garantizando escalabilidad para el procesamiento de datos financieros sensibles. En la v2 construí un módulo dedicado de ingesta regulatoria ADA/SICSES cuyo CsvStructureValidator detecta marcador, separador y fila de encabezado antes de validar —cuenta la fila de encabezado, nunca una fila de datos—, y en la v3 reestructuré la interfaz en 3 módulos.',
    solutionEn:
      'Designed and built STARSOL from scratch as a B2B SaaS platform in PHP with Laravel, implementing an asynchronous architecture with 3 background workers processing jobs simultaneously, completely decoupling file uploads from the main web server thread. For advanced file management, developed a .NET MAUI client application with offline capability that syncs with the cloud backend. At the infrastructure level, provisioned high-availability environments on AWS with CI/CD practices, ensuring scalability for sensitive financial data processing. In v2 I built a dedicated ADA/SICSES regulatory ingestion module whose CsvStructureValidator detects marker, separator and header row before validating —it counts the header row, never a data row— and in v3 I restructured the interface into 3 modules.',

    impact:
      'Arquitectura asíncrona que eliminó cuellos de botella del servidor web mediante 3 workers simultáneos. Aplicación cliente .NET MAUI con sincronización offline para gestión de archivos financieros. Infraestructura cloud en AWS con alta disponibilidad y CI/CD. Plataforma SaaS B2B completa para el sector solidario cubriendo SARLAFT, SARC y SIAR. El validador de estructura acepta 12 archivos reales de cliente (7 ADA + 5 SICSES) sin errores bloqueantes; activar una rama de validación de campos que nunca se había alcanzado en producción sacó a la luz tres desajustes de formato reales —fechas de 7 dígitos que perdían el cero inicial por coerción numérica, un valor monetario decimal contra una regla `integer`, y números de crédito con un espacio incrustado en uno de los formatos—, todos normalizados antes de validar para que el mismo crédito cargado por cualquiera de los dos formatos resuelva a un único identificador.',
    impactEn:
      'Asynchronous architecture eliminated web server bottlenecks through 3 simultaneous workers. .NET MAUI client application with offline sync for financial file management. AWS cloud infrastructure with high availability and CI/CD. Complete B2B SaaS platform for the solidarity sector covering SARLAFT, SARC, and SIAR. The structure validator accepts 12 real client files (7 ADA + 5 SICSES) with no blocking errors; switching on a field-validation branch that had never been reached in production surfaced three real format mismatches —7-digit dates losing their leading zero to numeric coercion, a decimal monetary value checked against an `integer` rule, and credit numbers carrying an embedded space in one of the formats— all normalized before validation so the same credit loaded through either format resolves to a single identifier.',

    stack: ['PHP', 'Laravel', 'AWS', '.NET MAUI', 'MySQL', 'Docker', 'CI/CD'],
    hasNDA: false,
    tags: ['saas', 'fintech', 'architecture', 'cloud', 'laravel', 'regulatory', 'data-ingestion'],
  },

  // ═════════════════════════════════════════════════════════════════════════
  // PROYECTO 8 — ReaderSS (Lector RSS offline)
  // Puertos y adaptadores en el navegador + relay en el borde
  // ═════════════════════════════════════════════════════════════════════════
  {
    id: 'readerss',
    slug: 'readerss-lector-rss-offline',
    featured: true,
    order: 8,

    title: 'ReaderSS — Lector RSS con lectura offline y relay en el borde',
    titleEn: 'ReaderSS — RSS Reader with Offline Reading and an Edge Relay',

    company: 'Proyecto Personal (OSS)',
    companyAnon: false,
    industry: 'Open Source / Web',

    period: '2026',
    role: 'Arquitecto y Desarrollador Full Stack',
    roleEn: 'Architect & Full Stack Developer',

    problem:
      'Los navegadores retiraron el soporte nativo de RSS y los lectores que sobrevivieron son servicios en la nube que se quedan con tu lista de fuentes. Una página en el navegador tampoco puede pedir un feed arbitrario: CORS lo bloquea. Y nada de eso funciona sin conexión, justo cuando más se lee.',
    problemEn:
      'Browsers dropped native RSS support, and the readers that survived are cloud services that keep your feed list for you. A browser page cannot fetch an arbitrary feed either: CORS blocks it. And none of it works offline, which is exactly when reading happens.',

    solution:
      'Construí el cliente con dominio, puertos y adaptadores tras un composition root, con IndexedDB como capa de datos. El acceso a los feeds pasa por un relay en Cloudflare Workers que resuelve CORS y agrega GET condicional, límites de tamaño y de tiempo, una guarda SSRF reaplicada en cada salto de redirección y una guarda de origen documentada explícitamente como no autenticante. Los parsers de RSS 2.0, RDF, Atom y JSON Feed normalizan todo a un único modelo de entrada; la sanitización con DOMPurify vive en un único punto de estrangulamiento antes de renderizar. Incluye importación y exportación OPML, estados de leído/no leído/destacado con marcas de tiempo por campo, y un refresco que reporta el fallo real de cada feed en lugar de un único error agregado.',
    solutionEn:
      'Built the client with a domain, ports and adapters behind a composition root, using IndexedDB as the data layer. Feed access goes through a Cloudflare Workers relay that solves CORS and adds conditional GET, size and time limits, an SSRF guard re-applied on every redirect hop, and an origin guard documented explicitly as non-authenticating. Parsers for RSS 2.0, RDF, Atom and JSON Feed normalize everything onto a single entry model; DOMPurify sanitisation lives at a single choke point before rendering. It ships OPML import and export, read/unread/starred state with per-field change timestamps, and a refresh that reports each feed\'s real failure instead of one aggregate error.',

    impact:
      '426 pruebas con ~95% de cobertura de sentencias contra una puerta exigida del 70%. Bundle de 248 kB en crudo y 88 kB comprimido. GitHub Actions ejecuta lint, typecheck y pruebas antes de desplegar a Cloudflare Workers. Repositorio público con licencia MIT.',
    impactEn:
      '426 tests at ~95% statement coverage against an enforced 70% gate. A 248 kB raw bundle, 88 kB gzipped. GitHub Actions runs lint, typecheck and tests before deploying to Cloudflare Workers. Public MIT-licensed repository.',

    stack: ['TypeScript', 'Preact', 'Vite', 'IndexedDB', 'Cloudflare Workers', 'DOMPurify', 'Vitest', 'GitHub Actions'],
    architectureDiagram: 'UI → services → ports → adapters (store IndexedDB, cliente del relay) → relay en Cloudflare Workers (CORS + GET condicional + guarda SSRF por salto) → origen del feed. Sanitización DOMPurify en un único punto de estrangulamiento antes de renderizar.',
    githubUrl: 'https://github.com/Ewin24/ReaderSS',
    hasNDA: false,
    tags: ['open-source', 'oss', 'typescript', 'preact', 'offline-first', 'cloudflare-workers', 'indexeddb', 'testing'],
  },
]

/** Solo proyectos destacados, ordenados por prioridad */
export const featuredCaseStudies = [...caseStudies].sort(
  (a, b) => a.order - b.order
)
  .filter((p) => p.featured)
  .sort((a, b) => a.order - b.order)
