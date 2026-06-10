import type { Education } from '../types'

/**
 * FORMACIÓN ACADÉMICA — títulos, bootcamps y certificaciones.
 * Orden cronológico inverso (más reciente primero).
 */
export const education: Education[] = [
  {
    id: 'uts-ingenieria',
    institution: 'Unidades Tecnológicas de Santander (UTS)',
    degree: 'Ingeniería en Desarrollo de Sistemas',
    degreeEn: 'Systems Development Engineering',
    period: '2024 – Presente',
    current: true,
    description:
      'Formación en ingeniería de software, arquitectura de sistemas, bases de datos avanzadas y gestión de proyectos tecnológicos.',
    descriptionEn:
      'Education in software engineering, systems architecture, advanced databases, and technology project management.',
    order: 3,
  },
  {
    id: 'uts-tecnologia',
    institution: 'Unidades Tecnológicas de Santander (UTS)',
    degree: 'Tecnología en Sistemas',
    degreeEn: 'Systems Technology',
    period: '2024 – 2026',
    current: false,
    order: 2,
  },
  {
    id: 'sena-adsi',
    institution: 'SENA — Centro de Producción Limpia (LOPE), Nariño',
    degree: 'Tecnología en Análisis y Desarrollo de Sistemas de Información (ADSI)',
    degreeEn: 'Analysis and Development of Information Systems Technology (ADSI)',
    period: '2022 – 2024',
    current: false,
    order: 1,
  },
  {
    id: 'campuslands-bootcamp',
    institution: 'Campuslands',
    degree: 'Entrenamiento Intensivo en Desarrollo de Software (Bootcamp)',
    degreeEn: 'Intensive Software Development Training (Bootcamp)',
    period: '2023 – 2024',
    current: false,
    description:
      'Bootcamp de 10 meses con formación intensiva en .NET, Java, Spring Boot, SQL, arquitectura limpia y metodologías ágiles.',
    descriptionEn:
      '10-month bootcamp with intensive training in .NET, Java, Spring Boot, SQL, clean architecture, and agile methodologies.',
    order: 0,
  },
]
