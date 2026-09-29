// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import keystatic from '@keystatic/astro';

/**
 * Fuente servida desde el propio dominio. Los archivos de src/assets/fonts
 * son los mismos que entregaba Google Fonts (variables, subconjunto latin;
 * ver el README de esa carpeta) y los pesos replican los que se le pedían,
 * así que el sitio se ve igual pero sin depender de fonts.googleapis.com.
 * @param {string} name
 * @param {`--${string}`} cssVariable
 * @param {string} file
 * @param {number[]} weights
 * @param {string[]} fallbacks
 */
function localFont(name, cssVariable, file, weights, fallbacks) {
  return {
    provider: fontProviders.local(),
    name,
    cssVariable,
    fallbacks,
    options: {
      variants: /** @type {[any, ...any[]]} */ (
        weights.map((weight) => ({ weight, style: 'normal', src: [`./src/assets/fonts/${file}`] }))
      ),
    },
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://innovatechconstrucciones.cl',
  // Una sola forma de URL, sin slash final: así coinciden los enlaces internos,
  // las canónicas y el sitemap, y Vercel redirige /ruta/ → /ruta (308).
  // Antes ('ignore') ambas versiones respondían 200 y Search Console las
  // reportaba como duplicadas / alternativas con canónica.
  trailingSlash: 'never',
  // CSS incrustado en cada página: el navegador no espera una petición aparte
  // para el primer pintado (~14 KB gzip; Lighthouse estimaba ~200 ms en móvil).
  build: {
    inlineStylesheets: 'always',
  },
  // /index-b era la variante B de un test A/B de la home que nunca llegó a
  // correr (la home es estática y el middleware no se ejecutaba). Google ya
  // conocía la URL, así que se redirige en vez de dejarla en 404.
  redirects: {
    '/index-b': '/',
  },
  fonts: [
    localFont('Inter', '--font-inter', 'inter-latin.woff2', [400, 500, 600, 700, 800], ['sans-serif']),
    localFont('Big Shoulders Display', '--font-big-shoulders', 'big-shoulders-display-latin.woff2', [700, 800, 900], ['sans-serif']),
    localFont('Big Shoulders Stencil Display', '--font-big-shoulders-stencil', 'big-shoulders-stencil-display-latin.woff2', [700, 900], ['monospace']),
    localFont('JetBrains Mono', '--font-jetbrains-mono', 'jetbrains-mono-latin.woff2', [500, 700], ['monospace']),
  ],
  adapter: vercel(),
  integrations: [
    react(),
    sitemap(),
    keystatic(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
