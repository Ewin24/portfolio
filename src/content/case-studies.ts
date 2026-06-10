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
      'Diseñé y construí el sistema completo desde cero. En la capa de datos: DDL con 4 esquemas lógicos (cfg/cat/fab/aud), 30+ tablas transaccionales, máquina de estados de 23 estados, y 27 stored procedures optimizados. En la capa de servicios: API REST en .NET con Clean Architecture — repositorios por esquema, servicios por dominio funcional (Estudio, Tercero, OTP, Biometría) y controladores por canal (Admin/Tienda/Web/Handoff). Implementé el SOVI (Sistema Orquestador de Validación de Identidad) con patrón Strategy para verificación por bot de voz + validación manual, con motor de decisiones catalog-driven (sin if/switch hardcodeados). Integré detección de fraude con análisis biométrico de fotografías y un flujo completo de auditoría INSERT-ONLY.',
    solutionEn:
      'Designed and built the complete system from scratch. Data layer: DDL with 4 logical schemas (cfg/cat/fab/aud), 30+ transactional tables, 23-state state machine, and 27 optimized stored procedures. Service layer: REST API in .NET with Clean Architecture — repositories per schema, services per functional domain (Study, ThirdParty, OTP, Biometrics), controllers per channel (Admin/Store/Web/Handoff). Implemented SOVI (Identity Validation Orchestrator System) with Strategy pattern for voice bot verification + manual validation, with a catalog-driven decision engine (no hardcoded if/switch). Integrated fraud detection with biometric photo analysis and a complete INSERT-ONLY audit trail.',

    impact:
      '114+ endpoints API en 6 capas BFF (Admin/Core/Tienda/Web/Handoff/Util). 27 stored procedures en producción. 23 estados de ciclo de vida de crédito con trazabilidad completa. Verificación de identidad automatizada vía bot de voz con plan B manual como ciudadano de primera clase. Auditoría inmutable de todas las operaciones.',
    impactEn:
      '114+ API endpoints across 6 BFF layers (Admin/Core/Store/Web/Handoff/Util). 27 stored procedures in production. 23-state loan lifecycle with full traceability. Automated identity verification via voice bot with manual Plan B as a first-class citizen. Immutable audit trail of all operations.',

    stack: ['.NET 8+', 'C#', 'Dapper', 'SQL Server', 'Clean Architecture', 'REST API', 'JWT', 'Strategy Pattern'],
    architectureDiagram: 'Arquitectura en 3 capas: BFFs (Admin/Tienda/Web/Handoff/Util) → Domain Services (Estudio, Tercero, OTP, Biometría) → Repositories por Schema (cfg/cat/fab/aud). Cada BFF inyecta los mismos servicios de dominio. Sin duplicación entre canales.',
    hasNDA: true,
    tags: ['fintech', 'architecture', 'fullstack', 'los', 'ddd', 'dotnet'],
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
    role: 'Backend Developer',
    roleEn: 'Backend Developer',

    problem:
      'El proceso de consulta a centrales de riesgo (Datacredito) requería integración manual con formatos legacy. Las consultas fallaban frecuentemente por errores de formato, y no había resiliencia ante fallos de red del proveedor externo. No existía trazabilidad de las consultas realizadas.',
    problemEn:
      'The process of querying credit bureaus (Datacredito) required manual integration with legacy formats. Queries frequently failed due to format errors, and there was no resilience against external provider network failures. No query traceability existed.',

    solution:
      'Construí una API REST en .NET 8 con Dapper + SQL Server, implementando patrones de resiliencia con Polly (circuit breaker + retry policy), autenticación JWT, y logging estructurado con Serilog. Implementé un middleware de request/response logging con sanitización de campos sensibles. Arquitectura en 3 capas (Web/Data/Common) con inyección de dependencias.',
    solutionEn:
      'Built a REST API in .NET 8 with Dapper + SQL Server, implementing resilience patterns with Polly (circuit breaker + retry policy), JWT authentication, and structured logging with Serilog. Implemented a request/response logging middleware with sensitive field sanitization. 3-layer architecture (Web/Data/Common) with dependency injection.',

    impact:
      'Consultas automatizadas al 100%. Resiliencia ante fallos del proveedor externo con circuit breaker y retry policy. Trazabilidad completa via Serilog. Arquitectura preparada para migración a .NET 10 sin cambios estructurales.',
    impactEn:
      '100% automated queries. Resilience against external provider failures with circuit breaker and retry policy. Full traceability via Serilog. Architecture ready for .NET 10 migration without structural changes.',

    stack: ['.NET 8', 'C#', 'Dapper', 'SQL Server', 'Polly', 'Serilog', 'JWT', 'REST API'],
    hasNDA: true,
    tags: ['fintech', 'api', 'backend', 'resilience', 'dotnet'],
  },

  // ═════════════════════════════════════════════════════════════════════════
  // PROYECTO 4 — ErpBaguer / Kampot Nominas
  // Sistema de generación de documentos de nómina
  // ═════════════════════════════════════════════════════════════════════════
  {
    id: 'kampot-nominas',
    slug: 'integracion-nominas-kampot-erp',
    featured: true,
    order: 4,

    title: 'Sistema de Nómina Kampot — Generación de Documentos ERP',
    titleEn: 'Kampot Payroll System — ERP Document Generation',

    company: 'Baguer Software',
    companyAnon: false,
    industry: 'ERP / RRHH',

    period: '2025 – 2026',
    role: 'Desarrollador Full Stack',
    roleEn: 'Full Stack Developer',

    problem:
      'El ERP manejaba 45+ tipos de nómina (contratos, terminaciones, cartas) con rutas de documentos estáticas. Tres nuevos tipos de nómina Kampot (Comercial, Administrativa, Temporada) requerían sus propias plantillas Crystal Reports, y el sistema existente usaba rutas compartidas que no permitían personalización por tipo.',
    problemEn:
      'The ERP handled 45+ payroll types (contracts, terminations, letters) with static document routes. Three new Kampot payroll types (Commercial, Administrative, Seasonal) required their own Crystal Reports templates, and the existing system used shared routes that did not allow per-type customization.',

    solution:
      'Extendí el sistema de enrutamiento de documentos del CRM para soportar los 3 nuevos tipos de nómina Kampot. Modifiqué el CrmController.cs para actualizar la lógica de enrutamiento dinámico: añadí los IDs 46/47/48 al array de nóminas por cuotas, agregué casos específicos en ObtenerNombreContrato(), y creé 21 archivos .rpt (7 por nómina) en una nueva carpeta CReports/Kampot/. Todo siguiendo el patrón existente sin afectar las 45+ nóminas legacy.',
    solutionEn:
      'Extended the CRM document routing system to support the 3 new Kampot payroll types. Modified CrmController.cs to update dynamic routing logic: added IDs 46/47/48 to the installments array, added specific cases in ObtenerNombreContrato(), and created 21 .rpt files (7 per payroll type) in a new CReports/Kampot/ folder. All following the existing pattern without affecting 45+ legacy payroll types.',

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

    period: '2024 – Presente',
    role: 'Frontend Developer & Designer',
    roleEn: 'Frontend Developer & Designer',

    problem:
      'Los portfolios de desarrolladores muestran código pero no el impacto de negocio. Depender exclusivamente de la API de GitHub para mostrar proyectos oculta el trabajo más valioso: sistemas privados empresariales bajo NDA. Necesitaba una plataforma que vendiera ingeniería, no solo repositorios públicos.',
    problemEn:
      'Developer portfolios show code but not business impact. Relying exclusively on the GitHub API to showcase projects hides the most valuable work: private enterprise systems under NDA. I needed a platform that sells engineering, not just public repositories.',

    solution:
      'Diseñé una arquitectura híbrida: capa de contenido curado (casos de estudio en TypeScript con formato STAR, experiencia laboral, blog) como fuente principal de verdad, y API de GitHub como widget secundario de actividad. Implementé i18n nativo (ES/EN), design system editorial pixel-art con sombras pixeladas y tipografía de periódico, y animaciones con Framer Motion. Construido con React 19 + Vite + TypeScript + Tailwind CSS v4.',
    solutionEn:
      'Designed a hybrid architecture: curated content layer (STAR-format case studies in TypeScript, work experience, blog) as the primary source of truth, and GitHub API as a secondary activity widget. Implemented native i18n (ES/EN), pixel-art editorial design system with pixel shadows and newspaper typography, and Framer Motion animations. Built with React 19 + Vite + TypeScript + Tailwind CSS v4.',

    impact:
      'Arquitectura que prioriza el impacto de negocio sobre el código fuente. Casos de estudio con NDA sin exponer información confidencial. i18n nativo sin librerías externas. Design system propio que diferencia visualmente de portfolios genéricos. Agregar un caso de estudio = 1 objeto TypeScript.',
    impactEn:
      'Architecture that prioritizes business impact over source code. NDA-compliant case studies without exposing confidential information. Native i18n without external libraries. Custom design system that visually stands out from generic portfolios. Adding a case study = 1 TypeScript object.',

    stack: ['React 19', 'TypeScript', 'Vite', 'Tailwind CSS v4', 'Framer Motion', 'GitHub API'],
    githubUrl: 'https://github.com/Ewin24',
    hasNDA: false,
    tags: ['frontend', 'portfolio', 'architecture', 'react'],
  },

  // ═════════════════════════════════════════════════════════════════════════
  // PROYECTO 7 — STARSOL (SaaS Riesgos Financieros)
  // Plataforma B2B para el sector solidario
  // ═════════════════════════════════════════════════════════════════════════
  {
    id: 'starsol-saas',
    slug: 'starsol-saas-riesgos-financieros',
    featured: true,
    order: 1,

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
      'Diseñé y construí STARSOL desde cero como plataforma SaaS B2B en PHP con Laravel, implementando una arquitectura asíncrona con 3 background workers que procesan jobs simultáneamente, desacoplando completamente la carga de archivos del hilo principal del servidor web. Para la gestión avanzada de archivos, desarrollé una aplicación cliente en .NET MAUI con capacidad offline que se sincroniza con el backend en la nube. A nivel de infraestructura, aprovisioné entornos de alta disponibilidad en AWS con prácticas CI/CD, garantizando escalabilidad para el procesamiento de datos financieros sensibles.',
    solutionEn:
      'Designed and built STARSOL from scratch as a B2B SaaS platform in PHP with Laravel, implementing an asynchronous architecture with 3 background workers processing jobs simultaneously, completely decoupling file uploads from the main web server thread. For advanced file management, developed a .NET MAUI client application with offline capability that syncs with the cloud backend. At the infrastructure level, provisioned high-availability environments on AWS with CI/CD practices, ensuring scalability for sensitive financial data processing.',

    impact:
      'Arquitectura asíncrona que eliminó cuellos de botella del servidor web mediante 3 workers simultáneos. Aplicación cliente .NET MAUI con sincronización offline para gestión de archivos financieros. Infraestructura cloud en AWS con alta disponibilidad y CI/CD. Plataforma SaaS B2B completa para el sector solidario cubriendo SARLAFT, SARC y SIAR.',
    impactEn:
      'Asynchronous architecture eliminated web server bottlenecks through 3 simultaneous workers. .NET MAUI client application with offline sync for financial file management. AWS cloud infrastructure with high availability and CI/CD. Complete B2B SaaS platform for the solidarity sector covering SARLAFT, SARC, and SIAR.',

    stack: ['PHP', 'Laravel', 'AWS', '.NET MAUI', 'MySQL', 'Docker', 'CI/CD'],
    hasNDA: false,
    tags: ['saas', 'fintech', 'architecture', 'cloud', 'laravel'],
  },
]

/** Solo proyectos destacados, ordenados por prioridad */
export const featuredCaseStudies = caseStudies
  .filter((p) => p.featured)
  .sort((a, b) => a.order - b.order)
