import { useEffect, useRef, useState } from 'react';

// Elemento Three.js acotado — solo para la página de Electricidad y Montaje
// Eléctrico. Un torus-knot en wireframe con partículas que recorren la malla
// simulando corriente. Deliberadamente pequeño y decorativo, no un hero 3D:
// la idea es reforzar el mensaje de la sección sin competir con el copy.
//
// Reglas de esta pieza:
// - Respeta prefers-reduced-motion: si está activo, se renderiza un frame
//   estático (sin rotación ni animación de partículas).
// - Si WebGL no está disponible o three.js falla al inicializar, el
//   componente no rompe la página: retorna null y no deja un hueco visual
//   (el contenedor padre no depende de que esto renderice algo).
// - Carga solo en cliente vía client:visible (ver ServiceLayout.astro), así
//   que three.js nunca se empaqueta para el entrypoint del servidor.

export default function ElectricalPulseScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Chequeo de soporte WebGL antes de tocar three.js
    const testCanvas = document.createElement('canvas');
    const gl =
      testCanvas.getContext('webgl2') ||
      testCanvas.getContext('webgl') ||
      testCanvas.getContext('experimental-webgl');
    if (!gl) {
      setSupported(false);
      return;
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let cleanup = () => {};
    let cancelled = false;

    import('three')
      .then((THREE) => {
        if (cancelled || !container) return;

        const width = container.clientWidth;
        const height = container.clientHeight;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        camera.position.set(0, 0, 8);

        let renderer: InstanceType<typeof THREE.WebGLRenderer>;
        try {
          renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        } catch {
          setSupported(false);
          return;
        }
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        // Malla — torus knot en wireframe, evoca un conductor bobinado
        const geometry = new THREE.TorusKnotGeometry(2, 0.35, 180, 20, 2, 3);
        const material = new THREE.MeshBasicMaterial({
          color: 0xf97316, // primary-500 (naranjo Innovatech)
          wireframe: true,
          transparent: true,
          opacity: 0.55,
        });
        const knot = new THREE.Mesh(geometry, material);
        scene.add(knot);

        // Partículas que recorren la curva del torus knot simulando corriente
        const particleCount = reduceMotion ? 0 : 24;
        const particlesGeo = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const particlesMat = new THREE.PointsMaterial({
          color: 0x2563eb, // primary-600 (azul Innovatech)
          size: 0.12,
          transparent: true,
          opacity: 0.9,
        });
        const particles = new THREE.Points(particlesGeo, particlesMat);
        scene.add(particles);

        // three.js no expone directamente la curva del TorusKnotGeometry, así
        // que se recalculan puntos con la misma parametrización que usa
        // internamente TorusKnotGeometry (p=2, q=3) — mantiene las partículas
        // pegadas a la malla visible en vez de flotar sueltas.
        function torusKnotPoint(t: number, out: { x: number; y: number; z: number }) {
          const p = 2;
          const q = 3;
          const radius = 2;
          const tubeRadius = 0.35;
          const angle = t * Math.PI * 2;
          const r = radius * (2 + Math.cos((q * angle) / p));
          out.x = r * Math.cos(angle) * (1 + tubeRadius * 0.1);
          out.y = r * Math.sin(angle) * (1 + tubeRadius * 0.1);
          out.z = radius * Math.sin((q * angle) / p) * 1.2;
        }

        const particleOffsets = Array.from({ length: particleCount }, (_, i) => i / particleCount);
        const tmp = { x: 0, y: 0, z: 0 };

        let frameId: number;
        let t = 0;
        const clock = new THREE.Clock();

        // Elemento "acotado": no debe seguir consumiendo CPU/GPU cuando la
        // pestaña está oculta o cuando el panel salió del viewport (el
        // usuario ya hizo scroll más abajo). Ambas condiciones detienen el
        // loop de requestAnimationFrame por completo, no solo la rotación.
        let isRunning = true;

        function render() {
          if (!isRunning) return;
          const delta = clock.getDelta();
          if (!reduceMotion) {
            t += delta * 0.15;
            knot.rotation.x += delta * 0.12;
            knot.rotation.y += delta * 0.18;

            const posAttr = particlesGeo.getAttribute('position') as InstanceType<
              typeof THREE.BufferAttribute
            >;
            for (let i = 0; i < particleCount; i++) {
              const offset = (particleOffsets[i] + t * 0.3) % 1;
              torusKnotPoint(offset, tmp);
              posAttr.setXYZ(i, tmp.x, tmp.y, tmp.z);
            }
            posAttr.needsUpdate = true;
            particles.rotation.copy(knot.rotation);
          }
          renderer.render(scene, camera);
          frameId = requestAnimationFrame(render);
        }
        render();

        function handleResize() {
          if (!container) return;
          const w = container.clientWidth;
          const h = container.clientHeight;
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
        window.addEventListener('resize', handleResize);

        function handleVisibilityChange() {
          setRunning(document.visibilityState === 'visible' && inViewport);
        }
        document.addEventListener('visibilitychange', handleVisibilityChange);

        let inViewport = true;
        function setRunning(next: boolean) {
          if (next === isRunning) return;
          isRunning = next;
          if (isRunning) {
            clock.getDelta(); // descarta el tiempo acumulado mientras estuvo pausado
            frameId = requestAnimationFrame(render);
          } else {
            cancelAnimationFrame(frameId);
          }
        }

        const io = new IntersectionObserver(
          ([entry]) => {
            inViewport = entry.isIntersecting;
            setRunning(document.visibilityState === 'visible' && inViewport);
          },
          { threshold: 0.05 },
        );
        io.observe(container);

        cleanup = () => {
          cancelAnimationFrame(frameId);
          window.removeEventListener('resize', handleResize);
          document.removeEventListener('visibilitychange', handleVisibilityChange);
          io.disconnect();
          geometry.dispose();
          material.dispose();
          particlesGeo.dispose();
          particlesMat.dispose();
          renderer.dispose();
          if (renderer.domElement.parentNode === container) {
            container.removeChild(renderer.domElement);
          }
        };
      })
      .catch(() => {
        // three.js no cargó (red, error de módulo, etc.) — degradar en silencio
        setSupported(false);
      });

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  if (!supported) return null;

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      role="img"
      aria-label="Visualización decorativa de una bobina eléctrica en 3D"
    />
  );
}
