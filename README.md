# Edwin Trigos — Ingeniero de Software Full Stack

Arquitecto y desarrollador con experiencia en sistemas empresariales de producción. Especializado en **arquitecturas backend .NET**, **sistemas de originación de crédito (LOS)**, **APIs de integración financiera**, **Clean Architecture** y **UI engineering con React + TypeScript**.

## Enfoque

No escribo código porque sí. Construyo sistemas que:

- **Resuelven problemas de negocio reales** — originación de crédito, validación de identidad, integración con burós de riesgo
- **Reducen costos operativos** — automatización de procesos manuales, eliminación de cuellos de botella
- **Escalan sin reescribir** — arquitecturas limpias, patrones de diseño, separación de dominios
- **Son mantenibles** — código que otro ingeniero puede leer sin llamarme a las 2 AM

## Stack Principal

| Área | Tecnologías |
|------|------------|
| Backend | .NET 8+, C#, ASP.NET Core, Dapper, REST APIs, Clean Architecture |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS v4, Framer Motion |
| Base de Datos | SQL Server, DDL/DML, Stored Procedures, Esquemas lógicos |
| Infraestructura | Docker, Git, GitHub Actions, SQL Server, Linux |
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
Extensión del sistema de generación de documentos del ERP para 3 nuevos tipos de nómina cliente de franquicias. 21 plantillas Crystal Reports, enrutamiento dinámico, cero impacto en 45+ tipos de nómina legacy.

### 🖥️ Arquitectura UI para Módulo Administrativo (LOS)
Reestructuración del módulo Admin en Panel de Control (monitoreo) + Módulo Administrar (configuración CRUD). Separación de responsabilidades alineada con la arquitectura limpia del backend.

> ℹ️ Varios proyectos contienen información confidencial (NDA). Los casos de estudio completos con detalle de arquitectura, diagramas e impacto están disponibles en el portafolio en vivo.

## Experiencia Profesional

| Período | Rol | Empresa |
|---------|-----|---------|
| 2023 → Presente | Arquitecto de Software / Full Stack Senior | Baguer Software |
| 2021 → 2023 | Desarrollador Backend .NET | Baguer Software |
| 2019 → 2021 | Desarrollador Junior | Empresa de Desarrollo |
| **~7+ años** de experiencia construyendo sistemas en producción |

## Lo que busco

Roles donde pueda:
- Diseñar y liderar arquitecturas de software (no solo implementar tickets)
- Trabajar en sistemas que resuelvan problemas reales de negocio
- Mentorizar desarrolladores y establecer estándares técnicos
- Construir APIs y sistemas que escalen sin dolor

---

**Construyamos algo que importe.**  
[GitHub](https://github.com/Ewin24) · [LinkedIn](https://linkedin.com/in/Ewin24) · edwintrigos24@gmail.com

*Portfolio construido con React 19 + Vite + TypeScript + Tailwind CSS v4. Casos de estudio extraídos de documentación técnica de proyectos en producción.*
