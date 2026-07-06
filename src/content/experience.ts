import type { WorkExperience } from '../types'

/**
 * EXPERIENCIA LABORAL REAL — sistemas en producción.
 * ─────────────────────────────────────────────────────
 * Cada entrada representa empleadores y proyectos reales con
 * métricas verificables y decisiones arquitectónicas documentadas.
 *
 * REGLA de achievements:
 * ✅ "Lideré el diseño del LOS desde cero — 114+ endpoints, 27 SP, 6 capas BFF"
 * ❌ "Trabajé con .NET"
 */

export const workExperience: WorkExperience[] = [
  // ═════════════════════════════════════════════════════════════════════════
  // HARMONY-MUSIC — Open Source Maintainer
  // ═════════════════════════════════════════════════════════════════════════
  {
    id: 'harmony-music-maintainer',
    company: 'Harmony-Music',
    companyUrl: 'https://github.com/Ewin24/Harmony-Music',
    role: 'Mantenedor Open Source (Fork) & Desarrollador Flutter',
    roleEn: 'Open Source Maintainer (Fork) & Flutter Developer',
    period: 'Jun 2026 – Presente',
    current: true,
    location: 'Colombia (Remoto)',
    achievements: [
      'Tomé el mantenimiento del fork de Harmony-Music (app Flutter de música streaming para Android, Windows y Linux) tras el abandono del creador original en diciembre 2025, aplicando una metodología de triage en 4 fases que llevó la app de "no compila" a release v1.12.2 con toolchain moderno',
      'Modernicé el stack de build completo — Gradle 8.14, AGP 8.11.1, Kotlin 2.2.20 con DSL moderno — removiendo flags residuales del Flutter migrator y migrando al Kotlin built-in de Flutter para preparar la app para Flutter 3.5+',
      'Resolví 19 olas de deprecaciones de Flutter 3.4x+ (withOpacity→withValues, Color.value→toARGB32, ThemeData getters→colorScheme, ionicons→Material Icons) en 19 commits separados, demostrando capacidad de ejecutar auditorías de código a gran escala',
      'Reescribí el bucketing de búsqueda de YouTube Music cuando InnerTube cambió su formato de respuesta (24/25 resultados caían en buckets huérfanos), implementando clasificación por pageType con límite de 10 por bucket y construyendo un ResponseRecorder para diff de respuestas crudas',
    ],
    achievementsEn: [
      'Took over maintenance of the Harmony-Music fork (Flutter music streaming app for Android, Windows, and Linux) after the original creator abandoned it in December 2025, applying a 4-phase triage methodology that took the app from "does not compile" to release v1.12.2 with modern toolchain',
      'Modernized the complete build stack — Gradle 8.14, AGP 8.11.1, Kotlin 2.2.20 with modern DSL — removing residual Flutter migrator flags and migrating to Flutter built-in Kotlin to prepare the app for Flutter 3.5+',
      'Resolved 19 waves of Flutter 3.4x+ deprecations (withOpacity→withValues, Color.value→toARGB32, ThemeData getters→colorScheme, ionicons→Material Icons) in 19 separate commits, demonstrating ability to execute large-scale code audits',
      'Rewrote YouTube Music search bucketing when InnerTube changed its response format (24/25 results fell into orphan buckets), implementing pageType classification with a 10-per-bucket limit and building a ResponseRecorder for raw response diffing',
    ],
    stack: ['Flutter 3.44+', 'Dart', 'GetX', 'just_audio', 'media_kit', 'audio_service', 'youtube_explode_dart', 'Hive', 'Dio', 'JNI', 'Gradle', 'AGP', 'Kotlin DSL'],
    order: 5,
  },

  // ═════════════════════════════════════════════════════════════════════════
  // STARSOL — SaaS Financiero (Independiente)
  // ═════════════════════════════════════════════════════════════════════════
  {
    id: 'starsol',
    company: 'STARSOL',
    companyUrl: undefined,
    role: 'Arquitecto de Software Cloud & Desarrollador Independiente',
    roleEn: 'Cloud Software Architect & Independent Developer',
    period: 'Ene 2024 – Presente',
    current: true,
    location: 'Colombia (Remoto)',
    achievements: [
      'Lideré el diseño arquitectónico, desarrollo end-to-end y despliegue en la nube de STARSOL, una plataforma SaaS B2B para el sector solidario que gestiona el Sistema Integral de Administración de Riesgos (SARLAFT, SARC, SIAR), digitalizando y automatizando flujos complejos de originación de crédito y monitoreo normativo',
      'Diseñé una arquitectura asíncrona con 3 background workers procesando jobs simultáneamente para desacoplar tareas pesadas del hilo principal del servidor web (PHP/Laravel), eliminando cuellos de botella en el procesamiento de archivos financieros',      
      'Orquesté el aprovisionamiento de entornos de alta disponibilidad en AWS con prácticas CI/CD, garantizando escalabilidad y seguridad para el procesamiento de datos financieros sensibles',
    ],
    achievementsEn: [
      'Led the architectural design, end-to-end development, and cloud deployment of STARSOL, a B2B SaaS platform for the solidarity sector managing the Integral Risk Management System (SARLAFT, SARC, SIAR), digitizing and automating complex loan origination and regulatory monitoring workflows',
      'Designed an asynchronous architecture with 3 background workers processing jobs simultaneously to decouple heavy tasks from the main web server thread (PHP/Laravel), eliminating bottlenecks in financial file processing',
      'Developed a .NET MAUI client application for advanced file management integrated with the STARSOL ecosystem, enabling offline processing and cloud backend synchronization',
      'Orchestrated high-availability environment provisioning on AWS with CI/CD practices, ensuring scalability and security for sensitive financial data processing',
    ],
    stack: ['PHP', 'Laravel', 'AWS', '.NET MAUI', 'MySQL', 'Docker', 'CI/CD'],
    order: 4,
  },

  // ═════════════════════════════════════════════════════════════════════════
  // BAGUER S.A.S — Full Stack .NET & Mobile
  // ═════════════════════════════════════════════════════════════════════════
  {
    id: 'baguer-software',
    company: 'BAGUER S.A.S',
    companyUrl: undefined,
    role: 'Programador Full Stack C# .NET & Mobile',
    roleEn: 'Full Stack C# .NET & Mobile Developer',
    period: '2024 – Presente',
    current: true,
    location: 'Colombia (Remoto)',
    achievements: [
      'Construí desde cero el Sistema de Originación de Crédito (LOS) con Clean Architecture en .NET 8 — DDL con 30+ tablas y 4 esquemas lógicos, 27 stored procedures, API REST con 114+ endpoints organizados en 6 capas BFF sin duplicación de lógica entre canales',
      'Diseñé el SOVI (Sistema Orquestador de Validación de Identidad) con patrón Strategy para verificación por bot de voz + respaldo manual, implementando un motor de decisiones catalog-driven que eliminó todo if/switch hardcodeado del flujo de validación',
      'Implementé la API de integración con burós de crédito (Datacredito) en .NET 8 con patrones de resiliencia (Polly circuit breaker + retry policy), autenticación JWT y logging estructurado con Serilog, reduciendo tiempos de consulta de 3s a 400ms mediante optimización de índices y queries',
      'Lideré la migración forzada de la aplicación móvil empresarial de Xamarin Forms a Flutter tras la depreciación de Xamarin por Microsoft, restaurando la disponibilidad en App Store y dotando al proyecto de un stack móvil moderno, fluido y mantenible',
    ],
    achievementsEn: [
      'Built the Loan Origination System (LOS) from scratch with Clean Architecture in .NET 8 — DDL with 30+ tables and 4 logical schemas, 27 stored procedures, REST API with 114+ endpoints organized across 6 BFF layers with zero logic duplication between channels',
      'Designed SOVI (Identity Validation Orchestrator System) with Strategy pattern for voice bot verification + manual backup, implementing a catalog-driven decision engine that eliminated all hardcoded if/switch from the validation flow',
      'Implemented credit bureau integration API (Datacredito) in .NET 8 with resilience patterns (Polly circuit breaker + retry policy), JWT authentication, and structured logging with Serilog, reducing query times from 3s to 400ms through index and query optimization',
      'Led the forced migration of the enterprise mobile application from Xamarin Forms to Flutter following Microsoft\'s Xamarin deprecation, restoring App Store availability and delivering a modern, fluid, and maintainable mobile stack',
    ],
    stack: ['.NET 8', 'C#', 'SQL Server', 'Clean Architecture', 'Flutter', 'Dapper', 'React', 'TypeScript'],
    order: 3,
  },

  // ═════════════════════════════════════════════════════════════════════════
  // BAGUER S.A.S — Rol Backend previo
  // ═════════════════════════════════════════════════════════════════════════
  {
    id: 'baguer-software-backend',
    company: 'BAGUER S.A.S',
    companyUrl: undefined,
    role: 'Desarrollador Backend .NET',
    roleEn: '.NET Backend Developer',
    period: '2021 – 2023',
    current: false,
    location: 'Colombia (Remoto)',
    achievements: [
      'Desarrollé y mantuve integraciones con APIs de terceros (burós de crédito CIFIN, pasarelas de pago, servicios de mensajería Infobip) procesando miles de transacciones diarias',
      'Implementé APIs REST en .NET con Dapper y SQL Server, optimizando consultas mediante índices y caching que redujeron tiempos de respuesta de 3s a 400ms',
      'Construí sistemas de reportes automatizados con Crystal Reports integrados al ERP, eliminando horas de trabajo manual del equipo de análisis',
      'Participé en la migración de aplicaciones .NET Framework a .NET Core, aplicando inyección de dependencias y patrones modernos de arquitectura',
    ],
    achievementsEn: [
      'Developed and maintained third-party API integrations (CIFIN credit bureaus, payment gateways, Infobip messaging services) processing thousands of daily transactions',
      'Implemented REST APIs in .NET with Dapper and SQL Server, optimizing queries through indexes and caching that reduced response times from 3s to 400ms',
      'Built automated reporting systems with Crystal Reports integrated into the ERP, eliminating hours of manual work from the analytics team',
      'Participated in migration from .NET Framework to .NET Core applications, applying dependency injection and modern architecture patterns',
    ],
    stack: ['C#', '.NET Core', 'Dapper', 'SQL Server', 'REST API', 'Crystal Reports'],
    order: 1,
  },

  // ═════════════════════════════════════════════════════════════════════════
  // Cliente — Franquicias de Ropa
  // ═════════════════════════════════════════════════════════════════════════
  {
    id: 'cliente-franquicias',
    company: 'Cliente — Franquicias de Ropa',
    role: 'Desarrollador Full Stack .NET',
    roleEn: 'Full Stack .NET Developer',
    period: '2025 – 2026',
    current: false,
    location: 'Colombia (Remoto)',
    achievements: [
      'Extendí el sistema de enrutamiento de documentos del CRM corporativo para soportar 3 nuevos tipos de nómina (Comercial, Administrativa, Temporada) para una cadena de franquicias de tiendas de ropa, agregando IDs y casos específicos sin afectar los 45+ tipos legacy existentes',
      'Diseñé e implementé 21 plantillas Crystal Reports (7 por tipo de nómina) organizadas en una estructura de carpetas dedicada, siguiendo el patrón del sistema existente para mantener consistencia',
      'Implementé enrutamiento dinámico de documentos modificando la lógica de generación de contratos, cartas y terminaciones, logrando una extensión no-invasiva sin regressiones en la operación existente',
    ],
    achievementsEn: [
      'Extended the corporate CRM document routing system to support 3 new payroll types (Commercial, Administrative, Seasonal) for a clothing franchise chain, adding IDs and specific cases without affecting 45+ existing legacy types',
      'Designed and implemented 21 Crystal Reports templates (7 per payroll type) organized in a dedicated folder structure, following the existing system pattern for consistency',
      'Implemented dynamic document routing by modifying contract, letter, and termination generation logic, achieving a non-invasive extension with zero regressions on existing operations',
    ],
    stack: ['C#', '.NET Framework', 'Crystal Reports', 'SQL Server', 'ERP', 'CRM'],
    order: 2,
  },

  // ═════════════════════════════════════════════════════════════════════════
  // CAMPUSLANDS — Full Stack
  // ═════════════════════════════════════════════════════════════════════════
  {
    id: 'campuslands',
    company: 'CAMPUSLANDS',
    companyUrl: undefined,
    role: 'Desarrollador Full Stack (.NET & JavaScript)',
    roleEn: 'Full Stack Developer (.NET & JavaScript)',
    period: 'Feb 2023 – Ene 2024',
    current: false,
    location: 'Colombia',
    achievements: [
      'Desarrollé una solución de software integral bajo metodología ágil Scrum para la gestión operativa de un modelo logístico',
      'Diseñé un backend altamente escalable en .NET fundamentado en principios SOLID con Fluent API para mapeo de datos',
      'Orquesté el diseño, normalización y administración de la base de datos relacional en MySQL',
      'Consumí los servicios backend a través de un frontend dinámico e interactivo construido con JavaScript, asegurando calidad y mantenibilidad del código a largo plazo',
    ],
    achievementsEn: [
      'Developed a comprehensive software solution under Scrum agile methodology for operational management of a logistics model',
      'Designed a highly scalable backend in .NET grounded in SOLID principles with Fluent API for data mapping',
      'Orchestrated the design, normalization, and administration of the MySQL relational database',
      'Consumed backend services through a dynamic and interactive frontend built with JavaScript, ensuring long-term code quality and maintainability',
    ],
    stack: ['C#', '.NET', 'MySQL', 'JavaScript', 'HTML/CSS', 'Scrum'],
    order: 2,
  },

  // ═════════════════════════════════════════════════════════════════════════
  // ESPEJOS GLAM — Web Developer
  // ═════════════════════════════════════════════════════════════════════════
  {
    id: 'espejos-glam',
    company: 'ESPEJOS GLAM',
    companyUrl: undefined,
    role: 'Programador Web',
    roleEn: 'Web Developer',
    period: 'Ene 2022 – Ene 2023',
    current: false,
    location: 'Colombia',
    achievements: [
      'Fui responsable del desarrollo end-to-end de la plataforma web comercial, gestionando todo el ciclo de vida del producto: desde la toma de requerimientos y diseño de interfaces (UI/UX) mediante mockups, hasta la implementación técnica utilizando PHP, JavaScript, HTML y CSS',
      'Ejecuté la integración de la lógica de negocio, la optimización de contenidos y el despliegue automatizado en servidores de producción, garantizando la estabilidad del sitio',
    ],
    achievementsEn: [
      'Responsible for end-to-end development of the commercial web platform, managing the full product lifecycle: from requirements gathering and UI/UX mockup design to technical implementation using PHP, JavaScript, HTML, and CSS',
      'Executed business logic integration, content optimization, and automated deployment to production servers, ensuring site stability',
    ],
    stack: ['PHP', 'JavaScript', 'HTML', 'CSS', 'UI/UX', 'Deployment'],
    order: 0,
  },
]

/** Ordenado del más reciente al más antiguo */
export const sortedExperience = [...workExperience].sort((a, b) => b.order - a.order)
