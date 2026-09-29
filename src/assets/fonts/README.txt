Fuentes auto-hospedadas (2026-09-29)
====================================

Antes se pedían a fonts.googleapis.com (CSS cargado de forma diferida y dos
orígenes externos extra por página). Ahora Astro las sirve desde el propio
dominio: se declaran en `fonts` de astro.config.mjs y se incrustan con
<Font /> en src/layouts/BaseLayout.astro.

Son los mismos archivos que entregaba Google Fonts: fuentes variables,
subconjunto "latin" (cubre todo el español), descargadas de
fonts.gstatic.com con un navegador moderno (woff2):

  inter-latin.woff2                          Inter v20                (wght 100–900)
  big-shoulders-display-latin.woff2          Big Shoulders Display v24         (wght 100–900)
  big-shoulders-stencil-display-latin.woff2  Big Shoulders Stencil Display v30 (wght 100–900)
  jetbrains-mono-latin.woff2                 JetBrains Mono v24       (wght 400–800)

Licencia: las cuatro se distribuyen bajo la SIL Open Font License 1.1
(https://openfontlicense.org), que permite alojarlas y servirlas en el sitio.

Para actualizar una fuente: pedir el CSS de Google Fonts con un User-Agent de
Chrome (ej. https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800),
descargar el archivo del bloque /* latin */, reemplazarlo aquí y actualizar la
versión en este README.
