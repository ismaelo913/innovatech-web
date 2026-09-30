import { loadVendor, wantsDesktopMotion } from './load-vendor.js';

function setupLenis() {
  const lenis = new window.Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
    infinite: false,
  });
  window.__lenis = lenis;
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
  return lenis;
}

// Scroll suave solo en escritorio con mouse y sin "reducir movimiento"; en el
// resto Lenis ni se descarga. window.__lenisReady resuelve con la instancia
// (o null) para que GSAP ScrollTrigger se sincronice con Lenis cuando exista
// (ver home-animations.js).
window.__lenisReady = wantsDesktopMotion()
  ? loadVendor('lenis.min.js').then(setupLenis).catch(() => null)
  : Promise.resolve(null);
