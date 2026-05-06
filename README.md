# Portfolio

Portafolio personal interactivo construido con **React 19**, **Vite**, **TypeScript** y **Tailwind CSS 4**. Una experiencia moderna con temática cyberpunk/neon y animaciones fluidas.

## Características Principales

### Integración con GitHub API

El proyecto se conecta directamente a la API pública de GitHub para mostrar:

- **Datos del perfil**: nombre, avatar, seguidores, repositorios públicos
- **Proyectos en vivo**: los 6 proyectos más relevantes (calculados por estrellas, forks y tamaño)
- **Stack tecnológico automático**: detecta los lenguajes más usados en tus repositorios y los muestra con barras de progreso

```typescript
// src/services/github.ts
const GITHUB_USERNAME = 'Ewin24'

//Fetching user profile + all repos (paginated)
const [userData, repoData] = await Promise.all([getUser(), getRepos()])

// Top languages auto-detected from your real repos
const languages = getLanguageStats(repos) // { "TypeScript": 15, "Python": 8, ... }
```

### Internacionalización (i18n)

Soporte completo para **español** e **inglés**:

- Detección automática del idioma del navegador
- Persistencia en `localStorage` para recordar la preferencia
- Toggle en el Header para cambiar idiomas al instante

```typescript
// src/hooks/useTranslation.ts
const { t, lang, setLang, toggleLang } = useTranslation()

t('hero.role') // "Desarrollador Full Stack" | "Full Stack Developer"
```

### Animaciones con Framer Motion

- **FadeIn**: componentes reutilizables con entrada progresiva
- **Scroll indicators**: animaciones al hacer scroll
- **Hover effects**: transiciones suaves en botones y tarjetas
- **Orbs decorativos**: efectos de fondo con blur y pulse

### Diseño UI/UX

- **Temática cyberpunk/neon**: colores neón sobre fondo oscuro
- **Glassmorphism**: tarjetas con efecto vidrio (`backdrop-blur`)
- **Totalmente responsive**: móvil, tablet y desktop
- **Barra de navegación fija**: con scroll spy y transición de fondo

## Estructura del Proyecto

```
src/
├── App.tsx                    # Componente raíz + manejo de errores
├── main.tsx                  # Entry point de React
├── index.css                 # Estilos globales + custom properties
├── types.ts                  # TypeScript interfaces
│
├── components/
│   ├── Header.tsx            # Navbar con links + toggle idioma
│   ├── ui/
│   │   ├── FadeIn.tsx        # Componente animable
│   │   ├── Loading.tsx      # Pantalla de carga
│   │   └── SectionHeader.tsx # Títulos de sección
│   └── sections/
│       ├── Hero.tsx         # Landing con stats de GitHub
│       ├── About.tsx         # Sobre mí
│       ├── Projects.tsx     # Repo cards desde GitHub
│       ├── Skills.tsx        # Tech stack auto-detectado
│       ├── Experience.tsx  # Trayectoria profesional
│       ├── Contact.tsx       # Links de contacto
│       └── Footer.tsx        # Credits + datos dinámicos
│
├── context/
│   └── AppContext.tsx        # Estado global (user, repos, lang)
│
├── hooks/
│   └── useTranslation.ts     # Hook de traducciones
│
├── i18n/
│   └── translations.ts      # Todas las strings (ES + EN)
│
└── services/
    └── github.ts           # API calls a GitHub
```

## Stack Tecnológico

| Categoría | Tecnología |
|----------|-------------|
| Framework | React 19 |
| Build | Vite 8 |
| Lenguaje | TypeScript 6 |
| Estilos | Tailwind CSS 4 |
| Animaciones | Framer Motion 12 |
| Iconos | Lucide React |
| Utilidades | clsx, tailwind-merge |

## Scripts

```bash
npm install     # Instalar dependencias
npm run dev    # Servidor de desarrollo (http://localhost:5173)
npm run build  # Compilar para producción
npm run preview  # Previsualizar build
npm run lint   # ESLint
```

## Cómo Funciona

### 1. Carga Inicial

```
App.tsx → AppProvider (context)
           ↓
GitHub API: GET /users/Ewin24
GitHub API: GET /users/Ewin24/repos?sort=updated
           ↓
Loading screen mientras carga
           ↓
Render de secciones
```

### 2. Datos Dinámicos

- **Hero**: muestra tu nombre real (desde GitHub), repos públicos, seguidores, años en GitHub
- **Projects**: tus 6 proyectos más populares (ordenados por score: `stars*3 + forks*2 + size`)
- **Skills**: lenguajes detectados automáticamente desde tus repos (top 8)

### 3. Cambio de Idioma

```typescript
// Toggle instantáneo sin reload
toggleLang() // ES ↔ EN

// Se persiste en localStorage
localStorage.setItem('portfolio-lang', 'es'|'en')
```

## Personalización

### Cambiar el usuario de GitHub

Edita `src/services/github.ts`:

```typescript
const GITHUB_USERNAME = 'tu-usuario-aqui'
```

### Modificar textos

Edita `src/i18n/translations.ts` — ambos idiomas:

```typescript
es: { 'hero.role': 'Desarrollador Full Stack', ... },
en: { 'hero.role': 'Full Stack Developer', ... }
```

### Agregar nuevas secciones

1. Crea el componente en `src/components/sections/`
2. Impórtalo en `App.tsx`
3. Añádelo al JSX dentro de `<main>`

### Añadir servicios externos

Crea nuevas funciones en `src/services/` y consúmelos desde el contexto.

## Contribuciones

Ideas para mejorar:

- [ ] Tests unitarios con Vitest
- [ ] Modo claro / oscuro
- [ ] Más animaciones Framer Motion
- [ ] Blog o artículos integrados
- [ ] Sistema de proyectos destacados manual
- [ ] SEO y meta tags
- [ ] Mode toggle (light/dark)

## Licencia

MIT — usa este código como quieras.