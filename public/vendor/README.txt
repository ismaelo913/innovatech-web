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
  vanilla-tilt.min.js    vanilla-tilt@1.8.1

Dónde se cargan (2026-09-30; antes, las cinco en todas las páginas):

  gsap, ScrollTrigger, CustomEase  <script defer> en BaseLayout.astro, solo
                                   en páginas con el prop `gsap` (la home).
  lenis, vanilla-tilt              bajo demanda desde src/scripts/load-vendor.js,
                                   solo en escritorio con mouse y sin "reducir
                                   movimiento" (lenis-init.js y los scripts de
                                   animación de la home y /servicios).

Splitting.js (splitting.min.js + splitting.css) se eliminó el 2026-09-28:
solo dividía el titular del hero, que ahora se divide al compilar
(src/components/home/Hero.astro) y se anima con CSS para no retrasar el LCP.

Para actualizar una versión: `npm install <paquete>@<nueva-version> --no-save`
en un scratch dir, copiar el nuevo dist/*.min.js aquí y anotar la versión en
este README (las rutas de los scripts no la llevan).
