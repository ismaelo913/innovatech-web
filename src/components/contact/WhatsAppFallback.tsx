import { useEffect, useRef } from 'react';
import { SITE } from '../../lib/constants';
import { whatsappUrl } from '../../lib/utils';

interface Props {
  /** Mensaje ya redactado con los datos del formulario. */
  message: string;
  /** Origen del lead en GA4 si la persona abre WhatsApp desde aquí. */
  leadSource: string;
}

// Se muestra cuando EmailJS no pudo enviar un formulario (servicio caído,
// cuota agotada, bloqueador). Antes el formulario abría WhatsApp por su
// cuenta y mostraba "¡Mensaje enviado!", pero el mensaje recién llega cuando
// la persona toca Enviar en WhatsApp, y el navegador puede bloquear esa
// ventana abierta después del intento fallido. Aquí se le pide ese paso con
// un enlace (un clic no lo bloquea nadie) y el formulario conserva los datos.
export default function WhatsAppFallback({ message, leadSource }: Props) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <div className="p-6 border border-neutral-900 border-l-4 border-l-[#25D366] bg-surface-alt">
      <h3 ref={headingRef} tabIndex={-1} className="font-bold uppercase text-neutral-950 mb-2 outline-none">
        Falta un paso: envíanos el mensaje por WhatsApp
      </h3>
      <p className="text-sm text-accent-500 mb-4">
        No pudimos enviar el formulario por correo. Tu mensaje ya va escrito: abre WhatsApp y toca Enviar.
      </p>
      <a
        href={whatsappUrl(SITE.whatsapp, message)}
        target="_blank"
        rel="noopener noreferrer"
        data-lead-source={leadSource}
        className="inline-flex items-center gap-2 px-5 py-2.5 border-brutal bg-[#25D366] text-neutral-950 font-bold text-sm hover:bg-neutral-950 hover:text-white transition-colors"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        Abrir WhatsApp y enviar
      </a>
      <p className="text-xs text-neutral-600 mt-4">
        ¿Prefieres otra vía? Llámanos al{' '}
        <a href={`tel:${SITE.phone}`} className="font-bold text-neutral-950 underline">{SITE.phone}</a>{' '}
        o escríbenos a{' '}
        <a href={`mailto:${SITE.email}`} className="font-bold text-neutral-950 underline wrap-anywhere">{SITE.email}</a>.
      </p>
    </div>
  );
}
