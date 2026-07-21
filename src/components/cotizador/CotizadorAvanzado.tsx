import { useState, type FormEvent } from 'react';
import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG, isEmailConfigured } from '../../lib/emailjs';
import { CATALOG, COMUNAS, INPUT_CLASS, type CatalogItem } from './catalog';

interface CartItem {
  item: CatalogItem;
  quantity: number;
}

type Status = 'idle' | 'sending' | 'success';

interface Props {
  onSuccess: (items: CartItem[]) => void;
}

function ItemCard({
  item,
  cartItem,
  onAdd,
  onRemove,
  onQtyChange,
}: {
  item: CatalogItem;
  cartItem?: CartItem;
  onAdd: (item: CatalogItem) => void;
  onRemove: (id: string) => void;
  onQtyChange: (id: string, qty: number) => void;
}) {
  const inCart = Boolean(cartItem);

  return (
    <div
      className={`p-4 border-2 transition-colors duration-200 ${
        inCart
          ? 'border-primary-600 bg-primary-50'
          : 'border-neutral-300 bg-white hover:border-primary-400'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="font-bold text-neutral-950 text-sm leading-snug">{item.name}</div>
          <div className="text-xs text-neutral-500 mt-0.5 leading-snug">{item.description}</div>
          <div className="text-xs text-neutral-400 mt-1">
            Unidad: <span className="font-medium text-neutral-600">{item.unit}</span>
          </div>
        </div>
        {inCart && (
          <div className="w-5 h-5 rounded-full bg-primary-600 flex items-center justify-center shrink-0 mt-0.5">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
        )}
      </div>

      {!inCart ? (
        <button
          type="button"
          onClick={() => onAdd(item)}
          className="mt-3 w-full py-1.5 text-xs font-bold uppercase tracking-wide border border-primary-300 text-primary-700 hover:bg-primary-100 hover:border-primary-600 transition-colors cursor-pointer"
        >
          + Agregar
        </button>
      ) : (
        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (cartItem!.quantity > 1) onQtyChange(item.id, cartItem!.quantity - 1);
              else onRemove(item.id);
            }}
            className="w-7 h-7 border border-neutral-400 text-neutral-700 hover:border-primary-600 hover:text-primary-700 transition-colors flex items-center justify-center text-sm font-bold leading-none cursor-pointer"
          >
            {cartItem!.quantity === 1 ? '×' : '−'}
          </button>
          <input
            type="number"
            value={cartItem!.quantity}
            min={1}
            onChange={(e) => {
              const v = parseInt(e.target.value);
              if (v >= 1) onQtyChange(item.id, v);
            }}
            className="w-12 text-center py-1 text-sm font-semibold border border-neutral-400 focus:border-primary-600 outline-none bg-white"
          />
          <span className="text-xs text-neutral-500 flex-1">{item.unit}</span>
          <button
            type="button"
            onClick={() => onQtyChange(item.id, cartItem!.quantity + 1)}
            className="w-7 h-7 border border-neutral-400 text-neutral-700 hover:border-primary-600 hover:text-primary-700 transition-colors flex items-center justify-center text-sm font-bold leading-none cursor-pointer"
          >
            +
          </button>
        </div>
      )}
    </div>
  );
}

export default function CotizadorAvanzado({ onSuccess }: Props) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [status, setStatus] = useState<Status>('idle');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [comuna, setComuna] = useState('');
  const [notes, setNotes] = useState('');
  const [contactPref, setContactPref] = useState('whatsapp');

  const categories = ['Todos', ...CATALOG.map((c) => c.name)];

  const visibleItems =
    activeCategory === 'Todos'
      ? CATALOG.flatMap((c) => c.items)
      : (CATALOG.find((c) => c.name === activeCategory)?.items ?? []);

  function addItem(item: CatalogItem) {
    setCart((prev) => [...prev, { item, quantity: 1 }]);
  }

  function removeItem(id: string) {
    setCart((prev) => prev.filter((c) => c.item.id !== id));
  }

  function updateQty(id: string, qty: number) {
    setCart((prev) => prev.map((c) => (c.item.id === id ? { ...c, quantity: qty } : c)));
  }

  function cartItem(id: string) {
    return cart.find((c) => c.item.id === id);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (cart.length === 0) return;

    setStatus('sending');

    const itemsList = cart
      .map((c, i) => `${i + 1}. ${c.item.name} — ${c.quantity} ${c.item.unit}`)
      .join('\n');

    const message = `COTIZACIÓN AVANZADA\n${'─'.repeat(30)}\n${itemsList}\n${'─'.repeat(30)}\nComuna: ${comuna}\nNotas adicionales: ${notes || 'Ninguna'}`;

    if (isEmailConfigured()) {
      try {
        await emailjs.send(
          EMAILJS_CONFIG.serviceId,
          EMAILJS_CONFIG.cotizadorTemplateId,
          { name, phone, email, service: 'Cotización Avanzada', comuna, description: message, urgency: 'No especificada', contact_preference: contactPref },
          { publicKey: EMAILJS_CONFIG.publicKey },
        );
        setStatus('success');
        onSuccess(cart);
        return;
      } catch {
        // Fall through to WhatsApp
      }
    }

    const waMsg = `Hola Innovatech, quiero cotizar los siguientes trabajos:\n\n📋 *TRABAJOS SOLICITADOS:*\n${itemsList}\n\n📍 Comuna: ${comuna}\n👤 ${name}\n📱 ${phone}\n📧 ${email}\n✉️ Contactar por: ${contactPref}${notes ? `\n\n💬 Notas: ${notes}` : ''}`;
    window.open(`https://wa.me/56938905488?text=${encodeURIComponent(waMsg)}`, '_blank');
    setStatus('success');
    onSuccess(cart);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Category filter */}
      <div>
        <h2 className="text-lg font-bold text-neutral-950 mb-1">1. Selecciona los trabajos</h2>
        <p className="text-sm text-neutral-500 mb-4">
          Agrega cada trabajo que necesitas. Puedes combinar varias categorías.
        </p>

        <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 border border-neutral-900 text-xs font-bold uppercase tracking-wide whitespace-nowrap transition-colors cursor-pointer ${
                activeCategory === cat
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {visibleItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              cartItem={cartItem(item.id)}
              onAdd={addItem}
              onRemove={removeItem}
              onQtyChange={updateQty}
            />
          ))}
        </div>
      </div>

      {/* Cart summary */}
      {cart.length > 0 && (
        <div className="border-brutal bg-surface-alt p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-neutral-950">
              Mi lista de trabajos
              <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary-600 text-white text-xs font-bold">
                {cart.length}
              </span>
            </h3>
            <button
              type="button"
              onClick={() => setCart([])}
              className="text-xs text-neutral-400 hover:text-red-500 transition-colors cursor-pointer"
            >
              Limpiar todo
            </button>
          </div>
          <div className="space-y-2">
            {cart.map((c, i) => (
              <div key={c.item.id} className="flex items-center gap-3 py-2 border-b border-neutral-300 last:border-0">
                <span className="text-xs font-mono text-neutral-400 w-5 text-center">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-neutral-900 truncate">{c.item.name}</div>
                  <div className="text-xs text-neutral-500">{c.quantity} {c.item.unit}</div>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(c.item.id)}
                  className="text-neutral-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                  aria-label={`Eliminar ${c.item.name}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {cart.length === 0 && (
        <div className="border-2 border-dashed border-neutral-300 p-8 text-center text-neutral-400">
          <svg className="w-8 h-8 mx-auto mb-2 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-sm font-medium">Sin trabajos agregados</p>
          <p className="text-xs mt-0.5">Haz clic en "+ Agregar" en cualquier trabajo de arriba</p>
        </div>
      )}

      {/* Contact */}
      <div>
        <h2 className="text-lg font-bold text-neutral-950 mb-1">2. Datos de contacto</h2>
        <p className="text-sm text-neutral-500 mb-4">Te enviamos la cotización detallada a la brevedad.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="ca-name" className="block text-sm font-medium text-neutral-700 mb-1.5">Nombre completo</label>
            <input
              type="text" id="ca-name" required className={INPUT_CLASS}
              placeholder="Juan Pérez" value={name} onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="ca-phone" className="block text-sm font-medium text-neutral-700 mb-1.5">Teléfono</label>
            <input
              type="tel" id="ca-phone" required className={INPUT_CLASS}
              placeholder="+56 9 1234 5678" value={phone} onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="ca-email" className="block text-sm font-medium text-neutral-700 mb-1.5">Email</label>
            <input
              type="email" id="ca-email" required className={INPUT_CLASS}
              placeholder="juan@email.com" value={email} onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="ca-comuna" className="block text-sm font-medium text-neutral-700 mb-1.5">Comuna</label>
            <select id="ca-comuna" required className={INPUT_CLASS} value={comuna} onChange={(e) => setComuna(e.target.value)}>
              <option value="" disabled>Selecciona tu comuna</option>
              {COMUNAS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="mt-5">
          <label htmlFor="ca-notes" className="block text-sm font-medium text-neutral-700 mb-1.5">
            Notas adicionales <span className="text-neutral-400 font-normal">(opcional)</span>
          </label>
          <textarea
            id="ca-notes" rows={2} className={`${INPUT_CLASS} resize-y`}
            placeholder="Plazos, condiciones especiales, referencias del lugar..."
            value={notes} onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <div className="mt-5">
          <label className="block text-sm font-medium text-neutral-700 mb-2">Prefiero contacto por</label>
          <div className="flex flex-wrap gap-3">
            {[{ v: 'whatsapp', label: 'WhatsApp' }, { v: 'llamada', label: 'Llamada' }, { v: 'email', label: 'Email' }].map(({ v, label }) => (
              <label key={v} className="cursor-pointer">
                <input type="radio" name="ca-pref" value={v} className="peer sr-only" checked={contactPref === v} onChange={() => setContactPref(v)} readOnly />
                <span className={`inline-flex px-4 py-2 border-2 text-sm font-bold transition-all cursor-pointer ${
                  contactPref === v
                    ? 'border-primary-600 bg-primary-50 text-primary-700'
                    : 'border-neutral-300 text-neutral-700 hover:border-primary-400'
                }`}>
                  {label}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Disclaimer profesional */}
      <div className="border border-neutral-900 border-l-4 border-l-primary-600 bg-surface-alt p-5">
        <div className="flex gap-3">
          <svg className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
          <div>
            <p className="text-sm font-bold text-neutral-950 mb-1">Sobre los valores estimados</p>
            <p className="text-sm text-accent-500 leading-relaxed">
              La lista que estás armando es una <strong>referencia orientativa</strong> basada en unidades de trabajo estándar. Los precios reales dependen de las condiciones de tu proyecto —materiales seleccionados, acceso al lugar y estado de las superficies— y se determinan con precisión tras la <strong>evaluación en terreno</strong> realizada por nuestro equipo.
            </p>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t-brutal">
        {cart.length === 0 && (
          <p className="text-sm text-primary-700 mb-3 flex items-center gap-1.5">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            Agrega al menos un trabajo antes de enviar.
          </p>
        )}
        <button
          type="submit"
          disabled={status === 'sending' || cart.length === 0}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary-600 text-white font-bold text-sm hover:bg-neutral-950 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          {status === 'sending' ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Enviando solicitud...
            </>
          ) : (
            <>
              Enviar estimación ({cart.length} {cart.length === 1 ? 'trabajo' : 'trabajos'})
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </>
          )}
        </button>
        <p className="text-xs text-neutral-500 mt-3">
          Te contactamos en menos de 24 horas hábiles para afinar los detalles y coordinar la visita en terreno.
        </p>
      </div>
    </form>
  );
}
