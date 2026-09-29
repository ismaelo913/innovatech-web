// Conversiones para Google Analytics 4. Se envían solo si la etiqueta de GA4
// está cargada (PUBLIC_GA4_MEASUREMENT_ID configurada en Vercel, ver
// BaseLayout.astro); si no, estas funciones no hacen nada.
//
// `generate_lead` es el evento recomendado de GA4 para contactos: en GA4
// (Administrar → Eventos) hay que marcarlo como evento clave para verlo como
// conversión y usarlo en Google Ads.
type Gtag = (command: 'event', name: string, params?: Record<string, unknown>) => void;

export function trackLead(source: string): void {
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  gtag?.('event', 'generate_lead', { lead_source: source });
}

/** Clics a WhatsApp, teléfono y email en cualquier enlace del sitio. */
export function trackContactLinks(): void {
  document.addEventListener('click', (event) => {
    const link = (event.target as Element | null)?.closest?.('a[href]');
    const href = link?.getAttribute('href') ?? '';
    if (href.startsWith('https://wa.me/')) trackLead('whatsapp');
    else if (href.startsWith('tel:')) trackLead('telefono');
    else if (href.startsWith('mailto:')) trackLead('email');
  });
}
