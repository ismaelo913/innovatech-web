# Testimonios — cómo agregar uno

Esta carpeta está **vacía a propósito**. `TestimonialsSection.astro` no
renderiza nada si no hay archivos aquí, así que el sitio funciona
perfectamente sin testimonios hasta que existan citas reales.

## Regla no negociable

**No se publica ningún testimonio sin consentimiento explícito del cliente**
para usar su nombre, cargo y empresa en el sitio. Idealmente por escrito
(email o WhatsApp basta, no se necesita un contrato). No inventar citas, no
usar clientes reales sin haberles preguntado, y no publicar contenido que
provenga de notas internas privadas sin autorización — aunque el proyecto
mismo ya esté documentado como caso público en `src/content/projects/`.

## Cómo agregar un testimonio real

1. Pide la cita al cliente (o pídele que la revise si la redactas tú a partir
   de una conversación) y confirma por escrito que autoriza publicarla con su
   nombre/cargo/empresa.
2. Crea un archivo `<slug-cliente>.md` en esta carpeta con este formato:

```md
---
author: "Nombre Apellido"
role: "Cargo, ej. Jefe de Proyectos"
company: "Empresa Mandante"
consentObtained: true
consentDate: 2026-08-15
projectRef: "condominio-las-condes" # opcional, slug de src/content/projects
featured: true
---

Texto del testimonio, en primera persona, tal como lo aprobó el cliente.
```

3. `consentObtained` debe ser literalmente `true` — es un campo obligatorio
   en el schema (`src/content.config.ts`) para que quede explícito que esta
   condición se revisó antes de publicar, no para saltarla.

## Sobre DICOMEX

Durante la auditoría de agosto 2026 se identificó un caso de cliente real
(DICOMEX) documentado en notas internas de negocio, pero **no se redactó ni
publicó** como testimonio ni como caso de estudio porque esas notas son
privadas y no hay constancia de que el cliente haya autorizado su uso
público. Si se quiere usar ese caso, el primer paso es pedir autorización
explícita al cliente — no redactar el contenido primero y pedir permiso
después.
