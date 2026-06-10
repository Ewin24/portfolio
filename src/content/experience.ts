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
      'Desarrollé una aplicación cliente en .NET MAUI para la gestión y carga avanzada de archivos integrada al ecosistema STARSOL, permitiendo el procesamiento offline y la sincronización con el backend en la nube',
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
    order: 2,
  },

  // ═════════════════════════════════════════════════════════════════════════
  // Primer rol
  // ═════════════════════════════════════════════════════════════════════════
  {
    id: 'desarrollador-junior',
    company: 'Empresa de Desarrollo de Software',
    companyUrl: undefined,
    role: 'Desarrollador Junior',
    roleEn: 'Junior Developer',
    period: '2019 – 2021',
    current: false,
    location: 'Colombia',
    achievements: [
      'Desarrollé y mantuve módulos de sistemas empresariales (nómina, facturación, inventario) usados por equipos internos',
      'Implementé consultas SQL optimizadas y stored procedures para reportes financieros',
      'Participé en la migración de aplicaciones web de ASP.NET Web Forms a ASP.NET Core MVC',
      'Implementé pruebas unitarias que alcanzaron 70%+ de cobertura en módulos críticos del sistema',
    ],
    achievementsEn: [
      'Developed and maintained enterprise system modules (payroll, billing, inventory) used by internal teams',
      'Implemented optimized SQL queries and stored procedures for financial reporting',
      'Participated in migration from ASP.NET Web Forms to ASP.NET Core MVC',
      'Implemented unit tests reaching 70%+ coverage on critical system modules',
    ],
    stack: ['C#', 'ASP.NET', 'SQL Server', 'JavaScript', 'HTML/CSS'],
    order: 1,
  },
]

/** Ordenado del más reciente al más antiguo */
export const sortedExperience = [...workExperience].sort((a, b) => b.order - a.order)
