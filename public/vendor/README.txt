Librerías de animación auto-hospedadas (2026-08-15)
====================================================

Estos archivos se sirven como estáticos desde /vendor/ en vez de cargarse
desde cdnjs.cloudflare.com / cdn.jsdelivr.net. Motivo: eliminar la
dependencia de un CDN externo (punto único de falla + riesgo de que un
bloqueador de contenido filtre el dominio) SIN tocar el pipeline de build
de Vercel — siguen siendo <script src="..."> clásicos, no imports npm
empaquetados por esbuild (eso fue lo que causaba fallos de build
intermitentes según el comentario original en BaseLayout.astro).

Origen de cada archivo (copiados desde node_modules/<paquete>/dist/ tras
`npm install <paquete>@<version>`, mismos binarios que servía el CDN):

  gsap.min.js            gsap@3.12.5
  ScrollTrigger.min.js   gsap@3.12.5      (plugin, mismo paquete)
  CustomEase.min.js      gsap@3.12.5      (plugin, mismo paquete)
  lenis.min.js           lenis@1.1.13
  splitting.min.js       splitting@1.1.0
  splitting.css          splitting@1.1.0
  vanilla-tilt.min.js    vanilla-tilt@1.8.1

Para actualizar una versión: `npm install <paquete>@<nueva-version> --no-save`
en un scratch dir, copiar el nuevo dist/*.min.js aquí, actualizar este
README y las referencias de versión en BaseLayout.astro.
