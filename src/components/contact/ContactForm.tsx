import { useRef, useState, type FormEvent } from 'react';
import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG, isEmailConfigured } from '../../lib/emailjs';

const services = [
  'Remodelación Residencial',
  'Remodelación Comercial',
  'Obra Gruesa',
  'Terminaciones',
  'Ampliación',
  'Otro',
];

type FormStatus = 'idle' | 'sending' | 'success' | 'error';

export default function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<FormStatus>('idle');

  const inputClass =
    'w-full px-4 py-2.5 rounded-lg border border-neutral-300 bg-white text-neutral-900 text-sm placeholder:text-neutral-400 focus:border-[oklch(50%_0.22_250)] focus:ring-2 focus:ring-[oklch(50%_0.22_250/0.2)] transition-colors outline-none';

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!formRef.current) return;

    // Honeypot check
    const honey = formRef.current.querySelector<HTMLInputElement>('[name="_honey"]');
    if (honey?.value) return;

    setStatus('sending');

    // Build WhatsApp message from form data
    const fd = new FormData(formRef.current);
    const name = fd.get('name') as string;
    const phone = fd.get('phone') as string;
    const email = fd.get('email') as string;
    const service = fd.get('service') as string;
    const message = fd.get('message') as string;

    // Try EmailJS first
    if (isEmailConfigured()) {
      try {
        await emailjs.sendForm(
          EMAILJS_CONFIG.serviceId,
          EMAILJS_CONFIG.contactTemplateId,
          formRef.current,
          { publicKey: EMAILJS_CONFIG.publicKey },
        );
        setStatus('success');
        formRef.current.reset();
        return;
      } catch {
        // Fall through to WhatsApp
      }
    }

    // Fallback: open WhatsApp with pre-filled message
    const waMsg = `Hola Innovatech, soy ${name}.\n\n📋 Servicio: ${service}\n📧 Email: ${email}\n📱 Teléfono: ${phone}\n\n💬 Mensaje:\n${message}`;
    const waUrl = `https://wa.me/569XXXXXXXX?text=${encodeURIComponent(waMsg)}`;
    window.open(waUrl, '_blank');
    setStatus('success');
    formRef.current.reset();
  }

  if (status === 'success') {
    return (
      <div className="text-center py-12 px-6 rounded-xl border-2 border-green-200 bg-green-50">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-green-900 mb-2">¡Mensaje enviado!</h3>
        <p className="text-green-700 mb-6">Te responderemos en menos de 24 horas.</p>
        <button
          onClick={() => setStatus('idle')}
          className="text-sm font-medium text-green-700 hover:text-green-900 underline underline-offset-4 transition-colors"
        >
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
      {/* Honeypot */}
      <div className="hidden" aria-hidden="true">
        <input type="text" name="_honey" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="cf-name" className="block text-sm font-medium text-neutral-700 mb-1.5">
            Nombre completo
          </label>
          <input
            type="text" id="cf-name" name="name" required className={inputClass}
            placeholder="Juan Pérez"
          />
        </div>
        <div>
          <label htmlFor="cf-phone" className="block text-sm font-medium text-neutral-700 mb-1.5">
            Teléfono
          </label>
          <input
            type="tel" id="cf-phone" name="phone" required className={inputClass}
            placeholder="+56 9 1234 5678"
          />
        </div>
      </div>

      <div>
        <label htmlFor="cf-email" className="block text-sm font-medium text-neutral-700 mb-1.5">
          Email
        </label>
        <input
          type="email" id="cf-email" name="email" required className={inputClass}
          placeholder="juan@email.com"
        />
      </div>

      <div>
        <label htmlFor="cf-service" className="block text-sm font-medium text-neutral-700 mb-1.5">
          Servicio de interés
        </label>
        <select id="cf-service" name="service" required className={inputClass}>
          <option value="" disabled selected>Selecciona un servicio</option>
          {services.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="cf-message" className="block text-sm font-medium text-neutral-700 mb-1.5">
          Mensaje
        </label>
        <textarea
          id="cf-message" name="message" rows={4} required className={`${inputClass} resize-y`}
          placeholder="Cuéntanos sobre tu proyecto: ubicación, tipo de trabajo, metros cuadrados aproximados..."
        />
      </div>

      <button
        type="submit"
        disabled={status === 'sending'}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[oklch(50%_0.22_250)] text-white font-semibold text-sm hover:bg-[oklch(44%_0.20_250)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
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
            Enviar mensaje
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </>
        )}
      </button>

      {status === 'error' && (
        <p className="text-sm text-red-600 mt-2">
          Hubo un error al enviar. Intenta de nuevo o escríbenos por WhatsApp.
        </p>
      )}
    </form>
  );
}
