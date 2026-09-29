// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import keystatic from '@keystatic/astro';

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
