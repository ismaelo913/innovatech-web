import { useRef, useState, type FormEvent } from 'react';
import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG, isEmailConfigured } from '../../lib/emailjs';

const SERVICES = [
  { title: 'Remodelaciones Residenciales', short: 'Cocinas, baños y espacios interiores con acabados de calidad.' },
  { title: 'Remodelaciones Comerciales', short: 'Oficinas, locales y espacios corporativos funcionales.' },
  { title: 'Obra Gruesa', short: 'Fundaciones, estructura, albañilería y hormigón armado.' },
  { title: 'Terminaciones', short: 'Revestimientos, pintura, pisos y cielos con precisión.' },
  { title: 'Ampliaciones', short: 'Segundos pisos, extensiones y nuevas áreas construidas.' },
];

const COMUNAS = [
  'Santiago Centro', 'Providencia', 'Las Condes', 'Vitacura', 'Lo Barnechea',
  'Ñuñoa', 'La Reina', 'Macul', 'Peñalolén', 'La Florida',
  'San Miguel', 'San Joaquín', 'Maipú', 'Pudahuel', 'Cerrillos',
  'Estación Central', 'Quinta Normal', 'Recoleta', 'Independencia', 'Huechuraba',
  'Otra comuna',
];

type FormStatus = 'idle' | 'sending' | 'success' | 'error';

export default function CotizadorForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<FormStatus>('idle');
  const [selectedService, setSelectedService] = useState('');

  const inputClass =
    'w-full px-4 py-2.5 rounded-lg border border-neutral-300 bg-white text-neutral-900 text-sm placeholder:text-neutral-400 focus:border-[oklch(70%_0.18_50)] focus:ring-2 focus:ring-[oklch(70%_0.18_50/0.2)] transition-colors outline-none';

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!formRef.current) return;

    const honey = formRef.current.querySelector<HTMLInputElement>('[name="_honey"]');
    if (honey?.value) return;

    setStatus('sending');

    const fd = new FormData(formRef.current);
    const name = fd.get('name') as string;
    const phone = fd.get('phone') as string;
    const email = fd.get('email') as string;
    const service = fd.get('service') as string;
    const area = fd.get('area') as string;
    const comuna = fd.get('comuna') as string;
    const description = fd.get('description') as string;
    const urgency = fd.get('urgency') as string;
    const contactPref = fd.get('contact_preference') as string;

    if (isEmailConfigured()) {
      try {
        await emailjs.sendForm(
          EMAILJS_CONFIG.serviceId,
          EMAILJS_CONFIG.cotizadorTemplateId,
          formRef.current,
          { publicKey: EMAILJS_CONFIG.publicKey },
        );
        setStatus('success');
        formRef.current.reset();
        setSelectedService('');
        return;
      } catch {
        // Fall through to WhatsApp
      }
    }

    // Fallback: WhatsApp
    const waMsg = `Hola Innovatech, solicito cotización.\n\n👤 ${name}\n📱 ${phone}\n📧 ${email}\n\n🔧 Servicio: ${service}\n📐 m²: ${area}\n📍 Comuna: ${comuna}\n⏰ Urgencia: ${urgency || 'No especificada'}\n✉️ Contactar por: ${contactPref || 'WhatsApp'}\n\n📝 Descripción:\n${description || 'Sin descripción'}`;
    const waUrl = `https://wa.me/569XXXXXXXX?text=${encodeURIComponent(waMsg)}`;
    window.open(waUrl, '_blank');
    setStatus('success');
    formRef.current.reset();
    setSelectedService('');
  }

  if (status === 'success') {
    return (
      <div className="text-center py-16 px-6 rounded-2xl border-2 border-green-200 bg-green-50">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-green-900 mb-2">¡Solicitud enviada!</h3>
        <p className="text-green-700 mb-2">Hemos recibido tu solicitud de cotización.</p>
        <p className="text-sm text-green-600 mb-8">Te contactaremos en menos de 24 horas.</p>
        <button
          onClick={() => setStatus('idle')}
          className="text-sm font-medium text-green-700 hover:text-green-900 underline underline-offset-4 transition-colors"
        >
          Enviar otra cotización
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-10">
      {/* Honeypot */}
      <div className="hidden" aria-hidden="true">
        <input type="text" name="_honey" tabIndex={-1} autoComplete="off" />
      </div>

      {/* Step 1: Service */}
      <div>
        <h2 className="text-xl font-bold text-neutral-900 mb-1">1. Tipo de servicio</h2>
        <p className="text-sm text-neutral-500 mb-5">Selecciona el servicio que mejor se ajuste a tu necesidad.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {SERVICES.map((service) => (
            <label key={service.title} className="relative cursor-pointer">
              <input
                type="radio" name="service" value={service.title} required
                className="peer sr-only"
                checked={selectedService === service.title}
                onChange={() => setSelectedService(service.title)}
              />
              <div className="p-4 rounded-xl border-2 border-neutral-200 bg-white hover:border-[oklch(79%_0.14_55)] peer-checked:border-[oklch(70%_0.18_50)] peer-checked:bg-[oklch(97%_0.02_65)] transition-all">
                <div className="font-medium text-neutral-900 text-sm">{service.title}</div>
                <div className="text-xs text-neutral-500 mt-1">{service.short}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Step 2: Details */}
      <div>
        <h2 className="text-xl font-bold text-neutral-900 mb-1">2. Detalles del proyecto</h2>
        <p className="text-sm text-neutral-500 mb-5">Cuéntanos un poco más sobre lo que necesitas.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="cot-area" className="block text-sm font-medium text-neutral-700 mb-1.5">
              Metros cuadrados aproximados
            </label>
            <input type="number" id="cot-area" name="area" min="1" required className={inputClass} placeholder="Ej: 80" />
          </div>
          <div>
            <label htmlFor="cot-comuna" className="block text-sm font-medium text-neutral-700 mb-1.5">
              Comuna
            </label>
            <select id="cot-comuna" name="comuna" required className={inputClass}>
              <option value="" disabled selected>Selecciona tu comuna</option>
              {COMUNAS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="mt-5">
          <label htmlFor="cot-desc" className="block text-sm font-medium text-neutral-700 mb-1.5">
            Descripción del proyecto
          </label>
          <textarea
            id="cot-desc" name="description" rows={3} className={`${inputClass} resize-y`}
            placeholder="Describe brevemente lo que necesitas: tipo de trabajo, estado actual del espacio, requerimientos especiales..."
          />
        </div>
        <div className="mt-5">
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">Urgencia</label>
          <div className="flex flex-wrap gap-3">
            {['Flexible', '1-3 meses', 'Urgente'].map((u) => (
              <label key={u} className="cursor-pointer">
                <input type="radio" name="urgency" value={u} className="peer sr-only" />
                <span className="inline-flex px-4 py-2 rounded-lg border-2 border-neutral-200 text-sm font-medium text-neutral-700 hover:border-[oklch(79%_0.14_55)] peer-checked:border-[oklch(70%_0.18_50)] peer-checked:bg-[oklch(97%_0.02_65)] peer-checked:text-[oklch(53%_0.16_42)] transition-all">
                  {u}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Step 3: Contact */}
      <div>
        <h2 className="text-xl font-bold text-neutral-900 mb-1">3. Datos de contacto</h2>
        <p className="text-sm text-neutral-500 mb-5">Para enviarte la cotización lo antes posible.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="cot-name" className="block text-sm font-medium text-neutral-700 mb-1.5">Nombre completo</label>
            <input type="text" id="cot-name" name="name" required className={inputClass} placeholder="Juan Pérez" />
          </div>
          <div>
            <label htmlFor="cot-phone" className="block text-sm font-medium text-neutral-700 mb-1.5">Teléfono</label>
            <input type="tel" id="cot-phone" name="phone" required className={inputClass} placeholder="+56 9 1234 5678" />
          </div>
          <div>
            <label htmlFor="cot-email" className="block text-sm font-medium text-neutral-700 mb-1.5">Email</label>
            <input type="email" id="cot-email" name="email" required className={inputClass} placeholder="juan@email.com" />
          </div>
          <div>
            <label htmlFor="cot-pref" className="block text-sm font-medium text-neutral-700 mb-1.5">Prefiero que me contacten por</label>
            <select id="cot-pref" name="contact_preference" className={inputClass}>
              <option value="whatsapp">WhatsApp</option>
              <option value="llamada">Llamada telefónica</option>
              <option value="email">Email</option>
            </select>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="pt-4 border-t border-neutral-200">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[oklch(65%_0.20_45)] text-white font-semibold text-sm hover:bg-[oklch(58%_0.20_40)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          {status === 'sending' ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Enviando...
            </>
          ) : (
            <>
              Enviar solicitud de cotización
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </>
          )}
        </button>
        <p className="text-xs text-neutral-500 mt-3">
          Al enviar este formulario aceptas que te contactemos para darte una cotización. No compartimos tus datos.
        </p>
      </div>

      {status === 'error' && (
        <p className="text-sm text-red-600">
          Hubo un error al enviar. Intenta de nuevo o escríbenos por WhatsApp.
        </p>
      )}
    </form>
  );
}
