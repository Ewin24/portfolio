import type { CaseStudy } from '../types'

/**
 * INSTRUCCIONES PARA AGREGAR UN NUEVO CASO DE ESTUDIO
 * ────────────────────────────────────────────────────
 * 1. Copia el bloque de ejemplo y pégalo al final del array
 * 2. Cambia el `id` y `slug` por algo único (ej: "crm-inmobiliario")
 * 3. Rellena TODOS los campos en ES y EN
 * 4. Si el proyecto es privado: hasNDA: true, githubUrl: undefined
 * 5. Para subir al tope: featured: true, order: 1
 *
 * FÓRMULA para `impact`:
 * ✅ "Reducimos el tiempo de procesamiento de 48h a 5min (reducción del 98%)"
 * ❌ "Mejoré el rendimiento del sistema"
 *
 * FÓRMULA para `problem`:
 * ✅ "El cliente gestionaba 500 clientes en Excel. Cada consulta tomaba 2 horas
 *    manualmente. Los errores costaban ~$2,000/mes en reprocesos."
 * ❌ "No tenían sistema"
 */

export const caseStudies: CaseStudy[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // PROYECTO 1 — Rellena con tu proyecto más impactante (puede ser NDA)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'project-1',
    slug: 'sistema-gestion-empresarial',
    featured: true,
    order: 1,

    title: 'Sistema de Gestión Empresarial Integral',
    titleEn: 'Enterprise Resource Planning System',

    company: 'Empresa Confidencial',
    companyAnon: true,
    industry: 'Manufactura / B2B',

    period: '2022 – 2024',
    role: 'Desarrollador Full Stack Senior',
    roleEn: 'Senior Full Stack Developer',

    problem:
      'La empresa procesaba pedidos, inventario y facturación en hojas de cálculo desconectadas. Cada cierre mensual tomaba 3 días de trabajo manual y presentaba errores de conciliación constantes que generaban pérdidas estimadas de $5,000/mes.',
    problemEn:
      'The company managed orders, inventory, and invoicing through disconnected spreadsheets. Each monthly close took 3 days of manual work and produced constant reconciliation errors causing ~$5,000/month in losses.',

    solution:
      'Diseñé e implementé un ERP modular usando arquitectura de microservicios con .NET 6 y React. Cada módulo (pedidos, inventario, facturación, reportes) se comunicaba via API REST con autenticación JWT centralizada. Implementé un dashboard en tiempo real con SignalR para visibilidad del inventario.',
    solutionEn:
      'Designed and implemented a modular ERP using microservices architecture with .NET 6 and React. Each module (orders, inventory, billing, reports) communicated via REST API with centralized JWT authentication. Implemented a real-time dashboard with SignalR for inventory visibility.',

    impact:
      'Reducción del cierre mensual de 3 días a 4 horas (↓87%). Eliminación del 100% de errores de conciliación. ROI positivo en 6 meses.',
    impactEn:
      'Monthly close reduced from 3 days to 4 hours (↓87%). 100% elimination of reconciliation errors. Positive ROI in 6 months.',

    stack: ['.NET 6', 'React', 'TypeScript', 'SQL Server', 'SignalR', 'Docker', 'Azure'],
    hasNDA: true,
    tags: ['erp', 'microservices', 'enterprise', 'fullstack'],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // PROYECTO 2 — Segundo proyecto (público OK)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'project-2',
    slug: 'api-integracion-financiera',
    featured: true,
    order: 2,

    title: 'API de Integración con Burós de Crédito',
    titleEn: 'Credit Bureau Integration API',

    company: 'Empresa Confidencial',
    companyAnon: true,
    industry: 'Fintech / Banca',

    period: '2021 – 2022',
    role: 'Backend Developer',
    roleEn: 'Backend Developer',

    problem:
      'El proceso de consulta crediticia requería intervención humana y tomaba hasta 24 horas. El 30% de las consultas fallaban por errores de formato en la integración legacy con los burós.',
    problemEn:
      'The credit inquiry process required human intervention and took up to 24 hours. 30% of queries failed due to format errors in the legacy integration with credit bureaus.',

    solution:
      'Construí una API REST en Java Spring Boot que estandarizó y automatizó la comunicación con múltiples burós de crédito. Implementé un sistema de reintentos con circuit breaker (Resilience4j) y caché distribuida con Redis para reducir llamadas redundantes.',
    solutionEn:
      'Built a REST API in Java Spring Boot that standardized and automated communication with multiple credit bureaus. Implemented a retry system with circuit breaker (Resilience4j) and distributed cache with Redis to reduce redundant calls.',

    impact:
      'Consultas automatizadas al 100% (de 24h a 2 segundos promedio). Tasa de fallo reducida del 30% al 0.3%. Procesamiento de 10,000+ consultas/día sin intervención manual.',
    impactEn:
      '100% automated queries (from 24h to 2-second average). Failure rate reduced from 30% to 0.3%. Processing 10,000+ queries/day without manual intervention.',

    stack: ['Java', 'Spring Boot', 'Redis', 'Docker', 'PostgreSQL', 'Resilience4j'],
    hasNDA: true,
    tags: ['api', 'fintech', 'backend', 'integration'],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // PROYECTO 3 — Proyecto público (con repo GitHub)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'project-3',
    slug: 'portfolio-personal',
    featured: true,
    order: 3,

    title: 'Portfolio Personal con Arquitectura Híbrida',
    titleEn: 'Personal Portfolio with Hybrid Architecture',

    company: 'Proyecto Personal',
    companyAnon: false,

    period: '2024 – Presente',
    role: 'Frontend Developer & Designer',
    roleEn: 'Frontend Developer & Designer',

    problem:
      'Los portfolios de desarrolladores muestran código pero no el impacto de negocio. Necesitaba una plataforma que combinara datos dinámicos de GitHub con casos de estudio curados que demuestren criterio de ingeniería.',
    problemEn:
      'Developer portfolios show code but not business impact. I needed a platform that combines dynamic GitHub data with curated case studies that demonstrate engineering judgment.',

    solution:
      'Desarrollé una arquitectura híbrida en React 19 + Vite: la capa de contenido curado (casos de estudio, experiencia) vive en TypeScript tipado localmente, mientras que la actividad técnica se consume via GitHub API. El resultado es un portfolio que vende ingeniería, no solo código.',
    solutionEn:
      'Developed a hybrid architecture in React 19 + Vite: the curated content layer (case studies, experience) lives in typed TypeScript locally, while technical activity is consumed via GitHub API. The result is a portfolio that sells engineering, not just code.',

    impact:
      'Arquitectura escalable: agregar un nuevo caso de estudio = 1 objeto TypeScript. i18n (ES/EN) nativo. Design system pixel-art editorial que diferencia visualmente.',
    impactEn:
      'Scalable architecture: adding a new case study = 1 TypeScript object. Native i18n (ES/EN). Pixel-art editorial design system that visually differentiates.',

    stack: ['React 19', 'TypeScript', 'Vite', 'Tailwind CSS v4', 'GitHub API'],
    githubUrl: 'https://github.com/Ewin24',
    hasNDA: false,
    tags: ['frontend', 'portfolio', 'architecture', 'react'],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // PLANTILLA — Copia esto para agregar un nuevo proyecto
  // ─────────────────────────────────────────────────────────────────────────
  // {
  //   id: 'project-N',
  //   slug: 'nombre-del-proyecto',
  //   featured: false,
  //   order: 99,
  //   title: 'Título en Español',
  //   titleEn: 'English Title',
  //   company: 'Nombre Empresa',
  //   companyAnon: false,
  //   industry: 'Industria',
  //   period: '2024 – Presente',
  //   role: 'Tu rol',
  //   roleEn: 'Your role',
  //   problem: 'El problema de negocio que resolviste...',
  //   problemEn: 'The business problem you solved...',
  //   solution: 'Tu solución y arquitectura...',
  //   solutionEn: 'Your solution and architecture...',
  //   impact: 'El impacto medible con métricas...',
  //   impactEn: 'Measurable impact with metrics...',
  //   stack: ['Tech1', 'Tech2'],
  //   githubUrl: undefined,
  //   demoUrl: undefined,
  //   hasNDA: true,
  //   tags: ['tag1', 'tag2'],
  // },
]

/** Solo los proyectos destacados, ordenados */
export const featuredCaseStudies = caseStudies
  .filter((p) => p.featured)
  .sort((a, b) => a.order - b.order)
