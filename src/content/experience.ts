import type { WorkExperience } from '../types'

/**
 * EXPERIENCIA LABORAL REAL — basada en sistemas en producción.
 * ─────────────────────────────────────────────────────────
 * Cada entrada representa empleadores y proyectos reales.
 *
 * REGLA de achievements:
 * ✅ "Diseñé arquitectura de microservicios que soporta X transacciones/día"
 * ❌ "Trabajé con microservicios"
 *
 * Si no tienes la métrica exacta, usa rangos — es mejor que no decir nada.
 */

export const workExperience: WorkExperience[] = [
  // ═════════════════════════════════════════════════════════════════════════
  // Trabajo actual — Baguer Software
  // ═════════════════════════════════════════════════════════════════════════
  {
    id: 'baguer-software',
    company: 'Baguer Software',
    companyUrl: undefined,
    role: 'Arquitecto de Software / Full Stack Senior',
    roleEn: 'Software Architect / Senior Full Stack',
    period: '2023 – Presente',
    current: true,
    location: 'Colombia (Remoto)',
    achievements: [
      'Diseñé y lideré la construcción del Sistema de Originación de Crédito (LOS) Fábricas de Crédito QUAC desde cero — DDL con 30+ tablas y 4 esquemas lógicos, 27 stored procedures, API REST .NET con Clean Architecture, y 114+ endpoints en 6 capas BFF',
      'Diseñé el SOVI (Sistema Orquestador de Validación de Identidad) con patrón Strategy para verificación por bot de voz + validación manual, con motor de decisiones catalog-driven que eliminó lógica hardcodeada',
      'Implementé la API de integración con burós de crédito (Datacredito) en .NET 8 con patrones de resiliencia (Polly circuit breaker), autenticación JWT y logging estructurado con Serilog',
      'Diseñé la reestructuración del módulo Admin del LOS separando monitoreo en tiempo real de configuración CRUD, alineando la UI con la arquitectura limpia del backend',
      'Extendí el sistema de generación de documentos del ERP Baguer para soportar 3 nuevos tipos de nómina Kampot, creando 21 plantillas Crystal Reports sin afectar 45+ tipos legacy',
    ],
    achievementsEn: [
      'Designed and led the construction of the Loan Origination System (LOS) Fábricas de Crédito QUAC from scratch — DDL with 30+ tables and 4 logical schemas, 27 stored procedures, .NET REST API with Clean Architecture, and 114+ endpoints across 6 BFF layers',
      'Designed SOVI (Identity Validation Orchestrator System) with Strategy pattern for voice bot verification + manual validation, with catalog-driven decision engine that eliminated hardcoded logic',
      'Implemented credit bureau integration API (Datacredito) in .NET 8 with resilience patterns (Polly circuit breaker), JWT authentication, and structured logging with Serilog',
      'Designed the LOS Admin module restructuring separating real-time monitoring from CRUD configuration, aligning the UI with the clean backend architecture',
      'Extended the ERP Baguer document generation system to support 3 new Kampot payroll types, creating 21 Crystal Reports templates without affecting 45+ legacy types',
    ],
    stack: ['.NET 8+', 'C#', 'SQL Server', 'Clean Architecture', 'REST API', 'Dapper', 'React', 'TypeScript', 'Docker'],
    order: 3,
  },

  // ═════════════════════════════════════════════════════════════════════════
  // Trabajo anterior — Baguer Software (rol previo)
  // ═════════════════════════════════════════════════════════════════════════
  {
    id: 'baguer-software-backend',
    company: 'Baguer Software',
    companyUrl: undefined,
    role: 'Desarrollador Backend .NET',
    roleEn: '.NET Backend Developer',
    period: '2021 – 2023',
    current: false,
    location: 'Colombia (Remoto)',
    achievements: [
      'Desarrollé y mantuve integraciones con APIs de terceros (burós de crédito CIFIN, pasarelas de pago, servicios de mensajería Infobip) procesando miles de transacciones diarias',
      'Implementé APIs REST en .NET con Dapper y SQL Server, optimizando queries que redujeron tiempos de respuesta de 3s a 400ms mediante índices y caching',
      'Construí sistemas de reportes automatizados con Crystal Reports integrados al ERP, eliminando horas de trabajo manual del equipo de análisis',
      'Participé en la migración de aplicaciones .NET Framework a .NET Core, aplicando inyección de dependencias y patrones modernos',
    ],
    achievementsEn: [
      'Developed and maintained third-party API integrations (CIFIN credit bureaus, payment gateways, Infobip messaging services) processing thousands of daily transactions',
      'Implemented REST APIs in .NET with Dapper and SQL Server, optimizing queries that reduced response times from 3s to 400ms through indexes and caching',
      'Built automated reporting systems with Crystal Reports integrated into the ERP, eliminating hours of manual work from the analytics team',
      'Participated in migration from .NET Framework to .NET Core applications, applying dependency injection and modern patterns',
    ],
    stack: ['C#', '.NET Core', 'Dapper', 'SQL Server', 'REST API', 'Crystal Reports'],
    order: 2,
  },

  // ═════════════════════════════════════════════════════════════════════════
  // Primer trabajo
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
      'Implementé pruebas unitarias que alcanzaron 70%+ de cobertura en módulos críticos',
    ],
    achievementsEn: [
      'Developed and maintained enterprise system modules (payroll, billing, inventory) used by internal teams',
      'Implemented optimized SQL queries and stored procedures for financial reporting',
      'Participated in migration from ASP.NET Web Forms to ASP.NET Core MVC',
      'Implemented unit tests reaching 70%+ coverage on critical modules',
    ],
    stack: ['C#', 'ASP.NET', 'SQL Server', 'JavaScript', 'HTML/CSS'],
    order: 1,
  },
]

/** Ordenado del más reciente al más antiguo */
export const sortedExperience = [...workExperience].sort((a, b) => b.order - a.order)
