// Animaciones para /servicios: VanillaTilt 3D en tarjetas — sutil y mate,
// sin glare (el brillo especular lee como plástico pulido, no concreto/acero;
// ver home-animations.js para el mismo criterio) — + scroll reveal
{
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion && window.matchMedia('(hover: hover) and (min-width: 768px)').matches && window.VanillaTilt) {
    const cards = document.querySelectorAll('.service-tilt-card');
    if (cards.length > 0) {
      window.VanillaTilt.init(cards, {
        max: 4,
        speed: 250,
        glare: false,
        scale: 1.01,
        perspective: 1000,
      });
    }
  }
}
