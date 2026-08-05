// Easing propio del sistema — "precisión industrial": arranque decidido, freno
// duro, sin rebote ni overshoot orgánico (nada de back/elastic). Pensado para
// que el movimiento en JS lea como una máquina posicionándose, no como una
// interfaz "blanda" tipo SaaS. Requiere que CustomEase (GSAP) ya esté cargado
// como global (ver BaseLayout.astro) — se registra una sola vez.
//
// - INDUSTRIAL_OUT: entradas / reveals de una sola vez (expo-out marcado).
// - INDUSTRIAL_IN_OUT: transiciones simétricas — crossfades, toggles.
export const INDUSTRIAL_OUT = 'industrialOut';
export const INDUSTRIAL_IN_OUT = 'industrialInOut';

let registered = false;

export function registerIndustrialEases() {
  if (registered || !window.gsap || !window.CustomEase) return false;
  window.gsap.registerPlugin(window.CustomEase);
  window.CustomEase.create(INDUSTRIAL_OUT, '0.19, 1, 0.22, 1');
  window.CustomEase.create(INDUSTRIAL_IN_OUT, '0.83, 0, 0.17, 1');
  registered = true;
  return true;
}
