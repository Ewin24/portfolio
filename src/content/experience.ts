import type { WorkExperience } from '../types'

/**
 * INSTRUCCIONES PARA AGREGAR EXPERIENCIA LABORAL
 * ───────────────────────────────────────────────
 * 1. Copia el bloque de ejemplo, pégalo al final del array
 * 2. Ordena por `order` (el número MÁS ALTO = más reciente)
 * 3. El trabajo actual: current: true
 *
 * REGLA de achievements:
 * ✅ "Lideré la migración a microservicios, reduciendo el deploy de 2h a 8 min"
 * ❌ "Trabajé con microservicios"
 *
 * Si no tienes métricas exactas, usa rangos o porcentajes estimados
 * y añade "aproximadamente" — es mejor que no decir nada.
 */

export const workExperience: WorkExperience[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // Trabajo actual / más reciente (order más alto)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'job-1',
    company: 'Tu Empresa Actual',
    companyUrl: 'https://empresa.com',
    role: 'Desarrollador Full Stack Senior',
    roleEn: 'Senior Full Stack Developer',
    period: 'Mar 2022 – Presente',
    current: true,
    location: 'Colombia (Remoto)',
    locationEn: 'Colombia (Remote)',
    achievements: [
      'Diseñé la arquitectura de microservicios que soporta 50,000 transacciones/día con 99.9% de disponibilidad',
      'Lideré la migración de un monolito legacy a servicios desacoplados, reduciendo el tiempo de deploy de 2h a 8min',
      'Implementé CI/CD con GitHub Actions + Docker, eliminando el 100% de los deploys manuales',
      'Mentoricé a 2 desarrolladores Junior, acelerando su rampa de productividad en ~40%',
    ],
    achievementsEn: [
      'Designed microservices architecture supporting 50,000 transactions/day with 99.9% uptime',
      'Led migration from legacy monolith to decoupled services, reducing deploy time from 2h to 8min',
      'Implemented CI/CD with GitHub Actions + Docker, eliminating 100% of manual deploys',
      'Mentored 2 Junior developers, accelerating their productivity ramp-up by ~40%',
    ],
    stack: ['.NET', 'React', 'TypeScript', 'Docker', 'SQL Server', 'Azure'],
    order: 3,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Trabajo anterior
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'job-2',
    company: 'Empresa Anterior',
    companyUrl: undefined,
    role: 'Desarrollador Backend',
    roleEn: 'Backend Developer',
    period: 'Jun 2020 – Feb 2022',
    current: false,
    location: 'Colombia',
    achievements: [
      'Desarrollé integraciones con APIs de terceros (burós de crédito, pasarelas de pago) procesando 10,000+ transacciones/día',
      'Reduje los tiempos de respuesta del servicio principal de 3s a 400ms mediante optimización de queries SQL y caching con Redis',
      'Construí un sistema de reportes automatizado que eliminó 20h/semana de trabajo manual del equipo de análisis',
    ],
    achievementsEn: [
      'Developed third-party API integrations (credit bureaus, payment gateways) processing 10,000+ transactions/day',
      'Reduced main service response times from 3s to 400ms through SQL query optimization and Redis caching',
      'Built an automated reporting system that eliminated 20h/week of manual work from the analytics team',
    ],
    stack: ['Java', 'Spring Boot', 'PostgreSQL', 'Redis', 'Docker'],
    order: 2,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Primer trabajo / más antiguo
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'job-3',
    company: 'Primera Empresa',
    role: 'Desarrollador Junior',
    roleEn: 'Junior Developer',
    period: 'Ene 2019 – May 2020',
    current: false,
    location: 'Colombia',
    achievements: [
      'Desarrollé y mantuve módulos del sistema de nómina usado por 200+ empleados',
      'Participé en la migración de aplicaciones .NET Framework a .NET Core',
      'Implementé tests unitarios que alcanzaron 70% de cobertura en módulos críticos',
    ],
    achievementsEn: [
      'Developed and maintained payroll system modules used by 200+ employees',
      'Participated in migration from .NET Framework to .NET Core applications',
      'Implemented unit tests reaching 70% coverage on critical modules',
    ],
    stack: ['C#', '.NET', 'SQL Server', 'JavaScript'],
    order: 1,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // PLANTILLA — Copia esto para agregar un nuevo trabajo
  // ─────────────────────────────────────────────────────────────────────────
  // {
  //   id: 'job-N',
  //   company: 'Nombre Empresa',
  //   companyUrl: 'https://empresa.com',
  //   role: 'Tu Rol en Español',
  //   roleEn: 'Your Role in English',
  //   period: 'Mes Año – Mes Año',
  //   current: false,
  //   location: 'Ciudad, País',
  //   achievements: [
  //     'Logro 1 con métrica...',
  //     'Logro 2 con métrica...',
  //   ],
  //   achievementsEn: [
  //     'Achievement 1 with metric...',
  //     'Achievement 2 with metric...',
  //   ],
  //   stack: ['Tech1', 'Tech2'],
  //   order: 99,
  // },
]

/** Ordenado del más reciente al más antiguo */
export const sortedExperience = [...workExperience].sort((a, b) => b.order - a.order)
