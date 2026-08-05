import { useRef, useState, type FormEvent } from 'react';
import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG, isEmailConfigured } from '../../lib/emailjs';
import { COMUNAS, INPUT_CLASS } from './catalog';

const SERVICES = [
  { title: 'Remodelaciones Residenciales', short: 'Cocinas, baños y espacios interiores.' },
  { title: 'Remodelaciones Comerciales', short: 'Oficinas, locales y espacios corporativos.' },
  { title: 'Obra Gruesa', short: 'Fundaciones, estructura, albañilería y hormigón.' },
  { title: 'Terminaciones', short: 'Revestimientos, pintura, pisos y cielos.' },
  { title: 'Ampliaciones', short: 'Segundos pisos, extensiones y nuevas áreas.' },
];

type Status = 'idle' | 'sending' | 'error';

interface Props {
  onSuccess: () => void;
}

export default function CotizadorSimple({ onSuccess }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [selectedService, setSelectedService] = useState('');

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
    const comuna = fd.get('comuna') as string;
    const description = fd.get('description') as string;
    const urgency = fd.get('urgency') as string;
    const contactPref = fd.get('contact_preference') as string;

    const message = `Servicio: ${service}\nComuna: ${comuna}\nUrgencia: ${urgency || 'Flexible'}\nContactar por: ${contactPref}\n\nDescripción:\n${description || 'Sin descripción'}`;

    if (isEmailConfigured()) {
      try {
        await emailjs.send(
          EMAILJS_CONFIG.serviceId,
          EMAILJS_CONFIG.contactTemplateId,
          { name, phone, email, service, message },
          { publicKey: EMAILJS_CONFIG.publicKey },
        );
        formRef.current.reset();
        setSelectedService('');
        onSuccess();
        return;
      } catch {
        // Fall through to WhatsApp
      }
    }

    const waMsg = `Hola Innovatech, solicito una visita técnica.\n\n👤 ${name}\n📱 ${phone}\n📧 ${email}\n\n🔧 Servicio: ${service}\n📍 Comuna: ${comuna}\n⏰ Urgencia: ${urgency || 'Flexible'}\n✉️ Contactar por: ${contactPref}\n\n📝 Descripción:\n${description || 'Sin descripción'}`;
    window.open(`https://wa.me/56938905488?text=${encodeURIComponent(waMsg)}`, '_blank');
    formRef.current.reset();
    setSelectedService('');
    onSuccess();
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-10">
      <div className="hidden" aria-hidden="true">
        <input type="text" name="_honey" tabIndex={-1} autoComplete="off" />
      </div>

      {/* Step 1: Service */}
      <div>
        <h2 className="text-lg font-bold text-neutral-900 mb-1">1. ¿Qué tipo de trabajo necesitas?</h2>
        <p className="text-sm text-neutral-500 mb-4">Selecciona el servicio que mejor describe tu proyecto.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {SERVICES.map((s) => (
            <label key={s.title} className="relative cursor-pointer">
              <input
                type="radio" name="service" value={s.title} required
                className="peer sr-only"
                checked={selectedService === s.title}
                onChange={() => setSelectedService(s.title)}
              />
              <div className="p-4 border-2 border-neutral-300 bg-white hover:border-primary-400 peer-checked:border-primary-600 peer-checked:bg-primary-50 transition-all">
                <div className="font-bold text-neutral-950 text-sm">{s.title}</div>
                <div className="text-xs text-neutral-500 mt-1">{s.short}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Step 2: Details */}
      <div>
        <h2 className="text-lg font-bold text-neutral-900 mb-1">2. Detalles del proyecto</h2>
        <p className="text-sm text-neutral-500 mb-4">Con esta información coordinamos la visita técnica al lugar.</p>
        <div>
          <label htmlFor="cs-comuna" className="block text-sm font-medium text-neutral-700 mb-1.5">
            Comuna
          </label>
          <select id="cs-comuna" name="comuna" required className={INPUT_CLASS}>
            <option value="" disabled>Selecciona tu comuna</option>
            {COMUNAS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="mt-5">
          <label htmlFor="cs-desc" className="block text-sm font-medium text-neutral-700 mb-1.5">
            Descripción del proyecto
          </label>
          <textarea
            id="cs-desc" name="description" rows={3} className={`${INPUT_CLASS} resize-y`}
            placeholder="Estado actual del espacio, alcance del trabajo, requerimientos especiales..."
          />
        </div>
        <div className="mt-5">
          <label className="block text-sm font-medium text-neutral-700 mb-2">Urgencia</label>
          <div className="flex flex-wrap gap-3">
            {['Flexible', '1–3 meses', 'Urgente'].map((u) => (
              <label key={u} className="cursor-pointer">
                <input type="radio" name="urgency" value={u} className="peer sr-only" />
                <span className="inline-flex px-4 py-2 border-2 border-neutral-300 text-sm font-bold text-neutral-700 hover:border-primary-400 peer-checked:border-primary-600 peer-checked:bg-primary-50 peer-checked:text-primary-700 transition-all cursor-pointer">
                  {u}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Step 3: Contact */}
      <div>
        <h2 className="text-lg font-bold text-neutral-900 mb-1">3. Datos de contacto</h2>
        <p className="text-sm text-neutral-500 mb-4">Un asesor te contactará para coordinar la visita.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="cs-name" className="block text-sm font-medium text-neutral-700 mb-1.5">Nombre completo</label>
            <input type="text" id="cs-name" name="name" required className={INPUT_CLASS} placeholder="Juan Pérez" />
          </div>
          <div>
            <label htmlFor="cs-phone" className="block text-sm font-medium text-neutral-700 mb-1.5">Teléfono</label>
            <input type="tel" id="cs-phone" name="phone" required className={INPUT_CLASS} placeholder="+56 9 1234 5678" />
          </div>
          <div>
            <label htmlFor="cs-email" className="block text-sm font-medium text-neutral-700 mb-1.5">Email</label>
            <input type="email" id="cs-email" name="email" required className={INPUT_CLASS} placeholder="juan@email.com" />
          </div>
          <div>
            <label htmlFor="cs-pref" className="block text-sm font-medium text-neutral-700 mb-1.5">Prefiero contacto por</label>
            <select id="cs-pref" name="contact_preference" className={INPUT_CLASS}>
              <option value="whatsapp">WhatsApp</option>
              <option value="llamada">Llamada telefónica</option>
              <option value="email">Email</option>
            </select>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t-brutal">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-none border-brutal bg-primary-600 text-white font-bold text-sm shadow-[4px_4px_0_0_var(--color-neutral-950)] hover:bg-neutral-950 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_var(--color-neutral-950)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0_0_var(--color-neutral-950)] transition-[background-color,transform,box-shadow] duration-200 ease-[var(--ease-out)] cursor-pointer"
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
              Solicitar visita técnica
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </>
          )}
        </button>
        <p className="text-xs text-neutral-500 mt-3">
          Sin costo ni compromiso. Respondemos dentro de 24 horas hábiles.
        </p>
        <p className="text-xs text-neutral-400 mt-1">
          No pedimos anticipo hasta evaluar la obra en terreno contigo.
        </p>
      </div>

      {status === 'error' && (
        <p className="text-sm text-red-600">Hubo un error. Intenta de nuevo o escríbenos por WhatsApp.</p>
      )}
    </form>
  );
}
