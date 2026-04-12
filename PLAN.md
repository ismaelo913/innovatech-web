# Innovatech - Plan de Ejecucion

> Sitio web corporativo para Innovatech, startup subcontratista de construccion en Santiago de Chile.
> Stack: Astro 6.1.5 + Tailwind CSS 4.2 + TypeScript strict | Deploy: Vercel (free tier)
>
> **Estado**: Fase 1 completada (2026-04-12) | Fase 2 pendiente

---

## Como Usar Este Plan

Cada fase es un sprint independiente. Ejecutar en orden. Cada tarea tiene:
- **Skill recomendada** entre parentesis - invocar antes de implementar
- **Criterio de aceptacion** para verificar completitud

Comando sugerido para iniciar cada fase:
```
"Ejecuta la Fase N del PLAN.md de Innovatech"
```

---

## Fase 1: Fundacion — COMPLETADA 2026-04-12

> **Objetivo**: Proyecto funcional con layout base desplegado en Vercel
> **Skills**: `design-system`, `frontend-design`, `deployment-patterns`
> **Resultado**: Build exitoso (2.48s). Falta deploy en Vercel (requiere git repo).

### 1.1 Inicializar proyecto
```bash
npm create astro@latest -- --template minimal
npx astro add tailwind
npx astro add vercel
```
- Configurar TypeScript strict
- Configurar Prettier + ESLint (eslint-plugin-astro)
- Crear `.gitignore`, `README.md`

**Aceptacion**: `npm run dev` levanta sin errores

### 1.2 Design System (`design-system`)
- Definir tokens CSS en `src/styles/global.css`:
  - Colores: primary (#2563EB), accent (#F97316), neutrales
  - Tipografia: Inter (Google Fonts), escalas responsivas con clamp()
  - Espaciado: escala 4px base
  - Sombras, radios, transiciones
- Crear componentes UI base:
  - `Button.astro` (variantes: primary, secondary, outline, ghost)
  - `Badge.astro` (categorias de servicio)
  - `Card.astro` (con hover state)
  - `SectionHeading.astro` (titulo + subtitulo + linea accent)
- Crear pagina `/design-system` temporal para preview

**Aceptacion**: Todos los componentes UI renderizados con variantes visibles

### 1.3 Layout Base (`frontend-design`)
- `BaseLayout.astro`: HTML head (meta, fonts, favicon), slot
- `Header.astro`: Logo + nav desktop + hamburger mobile
- `Navigation.astro`: Links a todas las paginas
- `MobileMenu.astro`: Slide-in menu (CSS + JS vanilla, sin framework)
- `Footer.astro`: Links, contacto, redes, copyright
- `WhatsAppButton.astro`: Boton flotante esquina inferior derecha

**Aceptacion**: Navegacion funcional en desktop y mobile, WhatsApp visible

### 1.4 Deploy Inicial (`deployment-patterns`)
- Conectar repo a Vercel
- Configurar dominio temporal (*.vercel.app)
- Verificar build en produccion

**Aceptacion**: Sitio accesible publicamente con layout base

---

## Fase 2: Paginas Core

> **Objetivo**: Las 4 paginas principales completas y navegables
> **Skills**: `frontend-design`, `frontend-patterns`, `brand-voice`

### 2.1 Home / Landing (`frontend-design`, `brand-voice`)

**Hero Section**
- Headline: Frase potente sobre modernizar la construccion
- Subtitulo: Propuesta de valor en 1 linea
- CTA principal: "Cotiza tu proyecto" → /cotizador
- CTA secundario: "Conoce nuestros servicios" → /servicios
- Background: Gradiente sutil o imagen con overlay

**Stats Bar**
- 3-4 metricas: Proyectos completados, anos experiencia, m2 construidos, clientes
- Numeros grandes con monospace font
- Animacion de conteo al scroll (IntersectionObserver)

**Services Preview**
- Grid 2x3 o bento layout
- Cards con icono + titulo + descripcion corta + link
- Hover: elevacion + color accent

**Projects Showcase**
- 3 proyectos destacados (featured: true)
- Cards grandes con imagen, titulo, categoria, ubicacion
- Link a /proyectos

**Testimonials**
- Carousel simple (CSS scroll-snap)
- Quote + nombre + empresa + avatar placeholder
- 3-5 testimonios

**CTA Final**
- Fondo oscuro (--color-dark-bg)
- Headline motivacional
- Formulario rapido inline: nombre + telefono + servicio → WhatsApp/email
- O boton directo a /cotizador

**Aceptacion**: Landing completa, todos los sections visibles, CTAs funcionales, responsive 320-1920px

### 2.2 Pagina Servicios

**Listado** (`/servicios`)
- Grid de ServiceCards
- Cada card: icono, titulo, descripcion, imagen, link a detalle
- Content collection para datos

**Detalle** (`/servicios/[slug]`)
- Contenido markdown renderizado
- Imagen principal
- Lista de lo que incluye
- CTA a cotizador con servicio pre-seleccionado
- Servicios relacionados

Servicios a crear:
1. Remodelaciones Residenciales
2. Remodelaciones Comerciales
3. Obra Gruesa
4. Terminaciones
5. Ampliaciones

**Aceptacion**: 5 paginas de servicio con contenido, navegacion entre ellas

### 2.3 Pagina Nosotros (`/nosotros`)
- Historia de Innovatech (como startup)
- Mision / Vision / Valores
- Diferenciadores (personal con EPP, herramientas propias, supervision)
- Equipo (cards con foto placeholder + nombre + rol)
- Timeline de la empresa (opcional)
- CTA a contacto

**Aceptacion**: Pagina completa que transmite confianza y profesionalismo

### 2.4 Pagina Contacto (`/contacto`)
- Formulario: nombre, email, telefono, servicio, mensaje
- Validacion client-side (HTML5 + JS)
- Mapa Google Maps embed (Santiago centro o direccion real)
- Info directa: telefono, email, direccion, horarios
- Links a redes sociales
- Integracion temporal con Formspree o EmailJS

**Aceptacion**: Formulario envia correctamente, mapa visible, info completa

---

## Fase 3: Features Avanzados

> **Objetivo**: Cotizador funcional, portafolio con galeria, integraciones
> **Skills**: `frontend-patterns`, `api-design`, `security-review`

### 3.1 Cotizador Multi-Step (`/cotizador`)

Formulario React (island: `client:visible`):

**Paso 1 - Tipo de Servicio**
- Cards seleccionables con icono por servicio
- Seleccion unica

**Paso 2 - Detalles del Proyecto**
- Metros cuadrados (input numerico)
- Ubicacion/comuna (select con comunas de RM)
- Descripcion breve (textarea)
- Urgencia (selector: flexible / 1-3 meses / urgente)

**Paso 3 - Datos de Contacto**
- Nombre completo
- Telefono
- Email
- Preferencia de contacto (WhatsApp / llamada / email)

**Submit**
- Envio por email (Resend API via Astro endpoint)
- Notificacion WhatsApp (link wa.me con mensaje pre-armado)
- Pantalla de confirmacion con resumen
- Validacion con Zod en cada paso

**Aceptacion**: Flujo completo funcional, email recibido, WhatsApp abre correctamente

### 3.2 Portafolio de Proyectos

**Listado** (`/proyectos`)
- Grid responsivo de ProjectCards
- Filtro por categoria (React island)
- Card: imagen principal, titulo, categoria badge, ubicacion
- Hover: overlay con "Ver proyecto"

**Detalle** (`/proyectos/[slug]`)
- Galeria de imagenes (React island con lightbox)
- Datos: cliente, categoria, ubicacion, m2, duracion
- Descripcion del proyecto
- Antes/despues (si aplica)
- Proyectos relacionados

Content collection con imagenes placeholder por ahora.

**Aceptacion**: Filtros funcionan, galeria abre lightbox, navegacion fluida

### 3.3 Integracion Email
- Astro API route: `src/pages/api/contact.ts`
- Resend SDK para envio de emails
- Template HTML para email de contacto
- Template HTML para email de cotizacion
- Rate limiting basico
- Honeypot anti-spam

**Aceptacion**: Emails llegan con formato correcto, spam bloqueado

---

## Fase 4: Contenido y SEO

> **Objetivo**: Blog funcional, SEO optimizado, analytics
> **Skills**: `seo`, `content-engine`, `brand-voice`

### 4.1 Blog
- Content collection para posts
- `BlogLayout.astro` con sidebar (categorias, posts recientes)
- Pagina de listado con paginacion
- Tags y categorias
- Tiempo de lectura calculado
- Share buttons (copiar link, WhatsApp, LinkedIn)
- 3 articulos iniciales de ejemplo:
  1. "Como elegir un subcontratista confiable"
  2. "5 errores comunes en remodelaciones"
  3. "Guia de permisos de construccion en Santiago"

**Aceptacion**: Blog navegable, articulos renderizados, paginacion funcional

### 4.2 SEO Tecnico (`seo`)
- Meta title y description unicos por pagina
- Open Graph + Twitter Cards
- Schema.org:
  - `LocalBusiness` en home
  - `Service` en cada servicio
  - `Article` en cada blog post
  - `BreadcrumbList` en todas las paginas
- Sitemap XML (astro-sitemap)
- robots.txt configurado
- Canonical URLs
- Alt text en todas las imagenes
- Heading hierarchy correcta (h1 > h2 > h3)

**Aceptacion**: Lighthouse SEO 95+, structured data validada en Google Rich Results Test

### 4.3 Performance Audit
- Lighthouse Performance 90+
- Imagenes optimizadas (Astro Image)
- Fonts preloaded
- CSS/JS minificado (Astro built-in)
- Lazy loading en imagenes below-the-fold

**Aceptacion**: Lighthouse Performance 90+, FCP < 1.5s, LCP < 2.5s

### 4.4 Analytics
- Plausible Analytics (privacy-friendly) o Google Analytics 4
- Eventos: click CTA, envio formulario, click WhatsApp
- Configurar goals: contacto enviado, cotizacion solicitada

**Aceptacion**: Dashboard con datos reales de visitas y conversiones

---

## Fase 5: Polish y Launch

> **Objetivo**: QA completo, animaciones, listo para produccion
> **Skills**: `e2e-testing`, `browser-qa`, `ui-demo`, `verification-before-completion`

### 5.1 Responsive QA
- Test en: 320, 375, 768, 1024, 1440, 1920
- Verificar: no overflow, touch targets 44px+, texto legible
- Fix cualquier issue de layout

### 5.2 Cross-Browser
- Chrome, Firefox, Safari, Edge
- Verificar: scroll, animaciones, formularios, galeria

### 5.3 Accesibilidad
- WCAG AA compliance
- Keyboard navigation completa
- Skip to content link
- Color contrast ratios
- ARIA labels donde necesario
- Reduced motion support

### 5.4 Animaciones y Polish
- Fade-in al scroll (IntersectionObserver)
- Hover transitions en cards y botones (300ms ease)
- Page transitions suaves
- Loading states en formularios
- Smooth scroll en anchor links
- Animacion sutil en hero

### 5.5 Dominio y Go Live
- Configurar dominio final en Vercel
- SSL automatico
- Redirect www → apex (o viceversa)
- Verificar Google Search Console
- Submit sitemap

**Aceptacion**: Sitio 100% funcional, responsive, accesible, performant, desplegado

---

## Fase 6: Post-Launch (Futuro)

### 6.1 CMS Headless
- Keystatic o Tina CMS
- Gestion de proyectos y blog sin tocar codigo
- Autenticacion basica

### 6.2 Growth
- Google My Business optimizado
- Local SEO (comunas de Santiago)
- A/B testing en landing (CTAs, headlines)
- Integracion redes sociales automatizada

### 6.3 Features Adicionales
- Chat en vivo (Tawk.to o Crisp)
- Calculadora de costos interactiva
- Area de clientes (seguimiento de proyecto)
- Integracion con CRM

---

## Referencia Rapida de Skills

```
# Fase 1
/design-system      → Generar tokens y componentes base
/frontend-design    → Disenar layout y componentes con calidad
/deployment-patterns → Configurar Vercel deploy

# Fase 2
/frontend-design    → Disenar cada pagina
/brand-voice        → Definir tono de comunicacion
/frontend-patterns  → Patrones de componentes

# Fase 3
/frontend-patterns  → Formularios multi-step, estado
/api-design         → Endpoints de contacto/cotizador
/security-review    → Revisar formularios y API

# Fase 4
/seo               → Auditoria SEO tecnico
/content-engine    → Generar contenido blog
/brand-voice       → Consistencia en textos

# Fase 5
/e2e-testing       → Tests automatizados
/browser-qa        → QA visual
/ui-demo           → Grabar demo video
/verification-before-completion → Checklist final
```
