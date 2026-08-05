// Animaciones de la home: Hero (reveal + counters + parallax), Process
// (blueprint SVG), Services (tilt 3D), Projects (crossfade). GSAP/Splitting/
// VanillaTilt se cargan por CDN (ver BaseLayout.astro) y quedan disponibles
// como globals (window.gsap, window.ScrollTrigger, window.Splitting,
// window.VanillaTilt) — así esbuild nunca tiene que empaquetarlas para el
// entrypoint del servidor.
import { INDUSTRIAL_OUT, INDUSTRIAL_IN_OUT, registerIndustrialEases } from './eases.js';

const easesReady = registerIndustrialEases();
const easeOut = easesReady ? INDUSTRIAL_OUT : 'power4.out';
const easeInOut = easesReady ? INDUSTRIAL_IN_OUT : 'power2.inOut';

{
  // --- Hero: headline reveal + stat counters ---
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initHeadlineReveal() {
    const headline = document.getElementById('hero-headline');
    const sub = document.getElementById('hero-sub');
    if (!headline) return;

    if (reduceMotion || !window.gsap || !window.Splitting) {
      headline.style.opacity = '1';
      if (sub) sub.style.opacity = '1';
      return;
    }

    const gsap = window.gsap;
    window.Splitting({ target: headline, by: 'words' });

    // El <h1> mismo queda oculto (style="opacity:0") hasta que Splitting.js
    // termine de envolver cada palabra — recién ahí lo mostramos y dejamos que
    // las .word individuales animen su propia entrada.
    headline.style.opacity = '1';

    gsap.set(sub, { opacity: 0, y: 16 });
    gsap
      .timeline({ delay: 0.1 })
      .from(headline.querySelectorAll('.word'), {
        opacity: 0,
        y: 30,
        rotateX: -35,
        stagger: 0.05,
        duration: 0.65,
        ease: easeOut,
      })
      .to(sub, { opacity: 1, y: 0, duration: 0.5, ease: easeOut }, '-=0.3');
  }
  initHeadlineReveal();

  // Parallax sutil en el collage de fotos: las dos imágenes se desplazan a
  // velocidades distintas ligadas al scroll — la sensación de profundidad
  // que el CSS .reveal-scale (una sola vez, al entrar) no puede dar.
  function initHeroParallax() {
    if (reduceMotion || !window.gsap || !window.ScrollTrigger) return;
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);

    const heroSection = document.getElementById('hero-headline')?.closest('section');
    const mainPhoto = heroSection?.querySelector('[data-hero-parallax="main"]');
    const cornerPhoto = heroSection?.querySelector('[data-hero-parallax="corner"]');
    if (!heroSection || !mainPhoto) return;

    gsap.to(mainPhoto, {
      yPercent: 8,
      ease: 'none',
      scrollTrigger: { trigger: heroSection, start: 'top top', end: 'bottom top', scrub: 0.6 },
    });
    if (cornerPhoto) {
      gsap.to(cornerPhoto, {
        yPercent: -10,
        ease: 'none',
        scrollTrigger: { trigger: heroSection, start: 'top top', end: 'bottom top', scrub: 0.6 },
      });
    }

    const lenis = window.__lenis;
    if (lenis) lenis.on('scroll', ScrollTrigger.update);
  }
  initHeroParallax();

  const countEls = document.querySelectorAll('.countup');
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target || '0', 10);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';

      if (reduceMotion) {
        el.textContent = `${prefix}${target}${suffix}`;
        return;
      }

      const duration = 1200;
      const start = performance.now();

      function step(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);
        el.textContent = prefix + current + suffix;
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.classList.add('countup-done');
        }
      }

      requestAnimationFrame(step);
      countObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  countEls.forEach((el) => countObserver.observe(el));

  document.getElementById('hero-a-cta-primary')?.addEventListener('click', () => {
    if (typeof window.va === 'function') {
      window.va('event', { name: 'hero_cta_click', data: { variant: 'a', cta: 'primary' } });
    }
  });
  document.getElementById('hero-a-cta-secondary')?.addEventListener('click', () => {
    if (typeof window.va === 'function') {
      window.va('event', { name: 'hero_cta_click', data: { variant: 'a', cta: 'secondary' } });
    }
  });
}

{
  // --- Process: SVG blueprint que se dibuja con el scroll ---
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const path = document.getElementById('blueprint-path');
  const steps = Array.from(document.querySelectorAll('.process-step'));

  if (path) {
    if (reduceMotion || !window.gsap || !window.ScrollTrigger) {
      steps.forEach((s) => s.classList.add('is-active'));
    } else {
      const gsap = window.gsap;
      const ScrollTrigger = window.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      const wrapper = document.querySelector('.process-pin-wrapper');
      if (wrapper) {
        const len = path.getTotalLength();
        path.style.strokeDasharray = String(len);
        path.style.strokeDashoffset = String(len);

        gsap.to(path, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: wrapper,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
          },
        });

        steps.forEach((step, i) => {
          ScrollTrigger.create({
            trigger: wrapper,
            start: () => `top+=${i * (window.innerHeight * 0.95)} top`,
            end: () => `top+=${(i + 1) * (window.innerHeight * 0.95)} top`,
            onToggle: (self) => step.classList.toggle('is-active', self.isActive),
          });
        });

        const lenis = window.__lenis;
        if (lenis) {
          lenis.on('scroll', ScrollTrigger.update);
        }
      }
    }
  }
}

{
  // --- Services: tilt 3D en las tarjetas — sutil y mate, sin glare
  // (el brillo especular lee como plástico pulido, no concreto/acero) ---
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

{
  // --- Projects: crossfade de fotos anclado al scroll ---
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const frames = Array.from(document.querySelectorAll('.project-frame'));
  const dots = Array.from(document.querySelectorAll('.project-dot'));

  function setActiveDot(i) {
    dots.forEach((dot, di) => {
      dot.style.width = di === i ? '2rem' : '0.75rem';
      dot.style.backgroundColor = di === i ? 'oklch(64% 0.19 40)' : '';
    });
  }

  if (!reduceMotion && frames.length > 1 && window.gsap && window.ScrollTrigger) {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);

    const wrapper = document.querySelector('.projects-pin-wrapper');
    if (wrapper) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
          onUpdate: (self) => {
            const idx = Math.min(frames.length - 1, Math.floor(self.progress * frames.length));
            setActiveDot(idx);
          },
        },
      });

      frames.forEach((frame, i) => {
        const img = frame.querySelector('img');
        if (img) {
          gsap.to(img, {
            yPercent: 6,
            ease: 'none',
            scrollTrigger: {
              trigger: wrapper,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 0.5,
            },
          });
        }
        if (i > 0) {
          tl.to(frames[i - 1], { opacity: 0, duration: 0.3, ease: easeInOut }, i - 0.15).to(frame, { opacity: 1, duration: 0.3, ease: easeInOut }, i - 0.15);
        }
      });

      const lenis = window.__lenis;
      if (lenis) {
        lenis.on('scroll', ScrollTrigger.update);
      }
    }
  }
}
