// Carga bajo demanda de las librerías de /public/vendor (scripts clásicos,
// ver public/vendor/README.txt): así solo se descargan en las páginas y
// dispositivos que las usan. Cada archivo se pide una sola vez.
const pending = new Map();

export function loadVendor(file) {
  if (!pending.has(file)) {
    pending.set(file, new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `/vendor/${file}`;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`No se pudo cargar /vendor/${file}`));
      document.head.appendChild(script);
    }));
  }
  return pending.get(file);
}

/**
 * Escritorio con mouse y sin "reducir movimiento": el único caso en que se
 * usan el scroll suave (Lenis) y el tilt 3D (VanillaTilt). En táctil ninguno
 * de los dos aporta, así que ahí ni se descargan.
 */
export function wantsDesktopMotion() {
  return (
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
    window.matchMedia('(hover: hover) and (min-width: 768px)').matches
  );
}
