// Autocontenido a propósito (sin imports): así Astro lo incrusta en el HTML
// en vez de sumar dos archivos de JS en cada página. La condición es la misma
// de wantsDesktopMotion() en load-vendor.js — si cambia una, cambiar la otra.
const wantsSmoothScroll =
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
  window.matchMedia('(hover: hover) and (min-width: 768px)').matches;

function loadLenis() {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = '/vendor/lenis.min.js';
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

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
window.__lenisReady = wantsSmoothScroll
  ? loadLenis().then(setupLenis).catch(() => null)
  : Promise.resolve(null);
