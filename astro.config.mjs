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
  adapter: vercel(),
  integrations: [
    react(),
    // /index-b es la variante B del test A/B de la home: su canónica apunta
    // a / y no debe declararse como página propia en el sitemap.
    sitemap({ filter: (page) => !page.includes('/index-b') }),
    keystatic(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
