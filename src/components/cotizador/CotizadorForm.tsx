import { useState } from 'react';
import CotizadorSimple from './CotizadorSimple';
import CotizadorAvanzado from './CotizadorAvanzado';
import type { CatalogItem } from './catalog';

type Mode = 'simple' | 'advanced';

interface CartItem {
  item: CatalogItem;
  quantity: number;
}

type AppState = 'form' | 'success-simple' | 'success-advanced';

export default function CotizadorForm() {
  const [mode, setMode] = useState<Mode>('simple');
  const [appState, setAppState] = useState<AppState>('form');
  const [submittedItems, setSubmittedItems] = useState<CartItem[]>([]);

  function handleSimpleSuccess() {
    setAppState('success-simple');
  }

  function handleAdvancedSuccess(items: CartItem[]) {
    setSubmittedItems(items);
    setAppState('success-advanced');
  }

  function reset() {
    setAppState('form');
    setSubmittedItems([]);
  }

  if (appState === 'success-simple') {
    return (
      <div className="text-center py-16 px-6 border-2 border-green-700 bg-green-50">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h3 className="text-2xl font-black uppercase text-green-900 mb-2">¡Solicitud recibida!</h3>
        <p className="text-green-700 mb-1">Te contactaremos dentro de 24 horas hábiles.</p>
        <p className="text-sm text-green-600 mb-8">Coordinaremos una visita técnica en terreno para evaluar tu proyecto y preparar la cotización real.</p>
        <button type="button" onClick={reset} className="text-sm font-medium text-green-700 hover:text-green-900 underline underline-offset-4 transition-colors cursor-pointer">
          Enviar otra cotización
        </button>
      </div>
    );
  }

  if (appState === 'success-advanced') {
    return (
      <div className="py-12 px-6 border-2 border-green-700 bg-green-50">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h3 className="text-2xl font-black uppercase text-green-900 mb-2">¡Estimación enviada!</h3>
          <p className="text-green-700">Te contactamos dentro de 24 horas hábiles para afinar los detalles y coordinar la visita en terreno.</p>
        </div>

        {submittedItems.length > 0 && (
          <div className="bg-white border border-green-700 p-5 mb-6 max-w-md mx-auto">
            <h4 className="font-bold text-green-900 mb-3 text-sm uppercase tracking-wider">Trabajos solicitados</h4>
            <div className="space-y-1.5">
              {submittedItems.map((c, i) => (
                <div key={c.item.id} className="flex items-center gap-2 text-sm">
                  <span className="text-green-400 font-mono text-xs">{String(i + 1).padStart(2, '0')}</span>
                  <span className="flex-1 text-neutral-700">{c.item.name}</span>
                  <span className="text-neutral-500 font-medium">{c.quantity} {c.item.unit}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-center">
          <button type="button" onClick={reset} className="text-sm font-medium text-green-700 hover:text-green-900 underline underline-offset-4 transition-colors cursor-pointer">
            Enviar otra cotización
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Mode selector */}
      <div className="mb-8 border-brutal flex">
        <button
          type="button"
          onClick={() => setMode('simple')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-bold uppercase tracking-wide transition-colors duration-200 cursor-pointer ${
            mode === 'simple'
              ? 'bg-primary-600 text-white'
              : 'text-neutral-500 hover:bg-neutral-100'
          }`}
        >
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>
          Solicitar visita
        </button>
        <button
          type="button"
          onClick={() => setMode('advanced')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-bold uppercase tracking-wide transition-colors duration-200 cursor-pointer border-l-brutal ${
            mode === 'advanced'
              ? 'bg-primary-600 text-white'
              : 'text-neutral-500 hover:bg-neutral-100'
          }`}
        >
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          Estimación por trabajos
        </button>
      </div>

      {/* Mode description */}
      <div className="mb-8 p-4 border-brutal bg-surface-alt">
        {mode === 'simple' ? (
          <p className="text-sm text-accent-500">
            <span className="font-bold text-neutral-950">Solicitud de visita técnica:</span>{' '}
            Cuéntanos tu proyecto. Coordinamos una visita en terreno sin costo para evaluar el alcance y entregarte una cotización real.
          </p>
        ) : (
          <p className="text-sm text-accent-500">
            <span className="font-bold text-neutral-950">Estimación por trabajos:</span>{' '}
            Selecciona cada trabajo desde el catálogo —cuadrillas, remodelaciones, terminaciones, obra gruesa y más— para armar una estimación de referencia orientativa.
          </p>
        )}
      </div>

      {mode === 'simple'
        ? <CotizadorSimple onSuccess={handleSimpleSuccess} />
        : <CotizadorAvanzado onSuccess={handleAdvancedSuccess} />
      }
    </div>
  );
}
