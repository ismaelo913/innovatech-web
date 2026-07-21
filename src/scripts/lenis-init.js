const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function setupLenis() {
  if (!window.Lenis) return;
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
  // Expuesto globalmente para que otros componentes (GSAP ScrollTrigger)
  // sincronicen su posición de scroll con Lenis.
  window.__lenis = lenis;
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

if (!prefersReducedMotion && window.matchMedia('(hover: hover) and (min-width: 768px)').matches) {
  if (window.Lenis) {
    setupLenis();
  } else {
    document.addEventListener('DOMContentLoaded', setupLenis);
  }
}
