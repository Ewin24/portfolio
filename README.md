# Edwin Trigos — Ingeniero de Software Full Stack

Arquitecto y desarrollador con experiencia en sistemas empresariales de producción. Especializado en **arquitecturas backend .NET**, **sistemas de originación de crédito (LOS)**, **APIs de integración financiera**, **Clean Architecture**, **UI engineering con React + TypeScript**, **mantenimiento de proyectos open source** y **disciplina de pruebas** (TDD estricto, regresión visual por píxel contra líneas base versionadas).

## Enfoque

No escribo código porque sí. Construyo sistemas que:

- **Resuelven problemas de negocio reales** — originación de crédito, validación de identidad, integración con burós de riesgo
- **Reducen costos operativos** — automatización de procesos manuales, eliminación de cuellos de botella
- **Escalan sin reescribir** — arquitecturas limpias, patrones de diseño, separación de dominios
- **Son mantenibles** — código que otro ingeniero puede leer sin llamarme a las 2 AM

## Stack Principal

| Área | Tecnologías |
|------|------------|
| Backend | .NET 8+, C#, ASP.NET Core, Dapper, REST APIs, Clean Architecture, PHP 8 / Laravel |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS v4, Framer Motion |
| Base de Datos | SQL Server, DDL/DML, Stored Procedures, Esquemas lógicos, IndexedDB |
| Infraestructura | Docker, Git, GitHub Actions, SQL Server, Linux, Cloudflare Workers |
| Testing | Vitest, Playwright, TDD estricto, regresión visual por píxel |
| Patrones | DDD, Strategy, Repository, BFF, Circuit Breaker, INSERT-ONLY Audit |
| Integraciones | Burós de crédito (Datacredito, CIFIN), APIs REST, Infobip, Crystal Reports |

## Proyectos Relevantes

### 🏦 Sistema de Originación de Crédito (LOS) — Fábricas de Crédito QUAC
Sistema completo de originación de crédito desde cero: base de datos transaccional (DDL, 30+ tablas, 4 esquemas, 23 estados), 27 stored procedures, API REST .NET con Clean Architecture (repositorios por esquema, servicios por dominio, controladores por canal), 114+ endpoints en 6 capas BFF.

### 🎙️ SOVI — Sistema Orquestador de Validación de Identidad
Módulo de verificación de identidad con patrón Strategy: bot de voz + validación manual como plan B de primera clase. Motor de decisiones catalog-driven (sin if/switch hardcodeados). Trazabilidad completa por estudio con diagnósticos categorizados.

### 🔐 API de Integración con Burós de Crédito (Datacredito)
API REST en .NET 8 con Dapper + SQL Server. Patrones de resiliencia con Polly (circuit breaker + retry). Autenticación JWT, logging estructurado con Serilog, middleware de request/response logging.

### 📄 Sistema de Gestión de Nóminas (ERP Baguer / Cadena de Franquicias)
Extensión del sistema de generación de documentos del ERP para 3 nuevos tipos de nómina de la cadena de franquicias. 21 plantillas Crystal Reports, enrutamiento dinámico, cero impacto en 45+ tipos de nómina legacy.

### 🖥️ Arquitectura UI para Módulo Administrativo (LOS)
Reestructuración del módulo Admin en Panel de Control (monitoreo) + Módulo Administrar (configuración CRUD). Separación de responsabilidades alineada con la arquitectura limpia del backend.

### ☁️ STARSOL — Plataforma SaaS para Gestión Integral de Riesgos
SaaS B2B para el sector solidario (SARLAFT, SARC, SIAR) en PHP/Laravel sobre AWS. Arquitectura asíncrona con 3 workers en segundo plano, módulo de ingesta regulatoria ADA/SICSES con validador de estructura CSV, y cliente .NET MAUI con sincronización offline.

### 🎵 Harmony-Music — Mantenedor de app Flutter open source
Fork mantenido de una app de música multiplataforma abandonada por su autor. Triage en 4 fases (build, deprecaciones, runtime, tooling) hasta la release v1.12.2 con toolchain moderno y búsqueda funcional sobre un formato de API que cambió sin aviso.

### 📬 API Centralizada de Comunicaciones (Infobip)
Unificación de 5 silos de envío de correo en una sola API, con diagnóstico de entregas que pasó de 30 minutos a 5 segundos.

### 📰 ReaderSS — Lector RSS con lectura offline
Lector RSS en el navegador con dominio, puertos y adaptadores sobre IndexedDB, y un relay en Cloudflare Workers que resuelve CORS con GET condicional y guarda SSRF por salto de redirección. 426 pruebas, repositorio público con licencia MIT.

> ℹ️ Varios proyectos contienen información confidencial (NDA). Los casos de estudio completos con detalle de arquitectura, diagramas e impacto están disponibles en el portafolio en vivo.

## Experiencia Profesional

| Período | Rol | Empresa |
|---------|-----|---------|
| Jun 2026 → Presente | Mantenedor Open Source (Fork) & Desarrollador Flutter | Harmony-Music |
| Ene 2024 → Presente | Arquitecto de Software Cloud & Desarrollador Independiente | STARSOL |
| 2024 → Presente | Programador Full Stack C# .NET & Mobile | BAGUER S.A.S |
| 2025 → 2026 | Desarrollador Full Stack .NET | Cliente — Franquicias de Ropa |
| Feb 2023 → Ene 2024 | Desarrollador Full Stack (.NET & JavaScript) | CAMPUSLANDS |
| 2021 → 2023 | Desarrollador Backend .NET | BAGUER S.A.S |
| Ene 2022 → Ene 2023 | Programador Web | ESPEJOS GLAM |

**~5 años** construyendo sistemas en producción (desde 2021).

> Fuente de verdad: `src/content/experience.ts`.

## Lo que busco

Roles donde pueda:
- Diseñar y liderar arquitecturas de software (no solo implementar tickets)
- Trabajar en sistemas que resuelvan problemas reales de negocio
- Mentorizar desarrolladores y establecer estándares técnicos
- Construir APIs y sistemas que escalen sin dolor

---

**Construyamos algo que importe.**  
[GitHub](https://github.com/Ewin24) · [LinkedIn](https://www.linkedin.com/in/edwintrigosguevara/) · edwintrigos24@gmail.com

*Portfolio construido con React 19 + Vite + TypeScript + Tailwind CSS v4, con dos temas seleccionables (periódico editorial y escritorio interactivo estilo XP). Casos de estudio extraídos de documentación técnica de proyectos en producción. Dos drivers Playwright versionados cuidan el resultado: uno verifica el comportamiento del escritorio y otro compara el tema periódico píxel a píxel contra líneas base versionadas.*
