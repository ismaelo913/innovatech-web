// Clientes reales — fuente: Portafolio Innovatech.pdf. Se muestran en la home
// y en /empresas.
//
// Los logos están en src/assets/clientes recortados al borde del dibujo (sin
// márgenes propios): cada archivo traía márgenes distintos y por eso unos se
// veían diminutos y otros enormes. El tamaño en pantalla lo calcula logoSize().
import type { ImageMetadata } from 'astro';
import cmp from '../assets/clientes/cmp.png';
import codelco from '../assets/clientes/codelco.png';
import concreta from '../assets/clientes/concreta.png';
import eaton from '../assets/clientes/eaton.png';
import eecol from '../assets/clientes/eecol.png';
import gpr from '../assets/clientes/gpr.png';
import inproco from '../assets/clientes/inproco.png';
import mipss from '../assets/clientes/mipss.png';
import schneider from '../assets/clientes/schneider.png';
import sonepar from '../assets/clientes/sonepar.png';

export interface Client {
  nombre: string;
  logo: ImageMetadata;
}

export const CLIENTS: Client[] = [
  { nombre: 'Concreta — Grupo Inmobiliario', logo: concreta },
  { nombre: 'GPR Constructora & Inmobiliaria', logo: gpr },
  { nombre: 'Codelco — División El Teniente', logo: codelco },
  { nombre: 'EECOL', logo: eecol },
  { nombre: 'Sonepar', logo: sonepar },
  { nombre: 'Schneider Electric', logo: schneider },
  { nombre: 'Inproco', logo: inproco },
  { nombre: 'CMP', logo: cmp },
  { nombre: 'MIPSS', logo: mipss },
  { nombre: 'Eaton', logo: eaton },
];

/**
 * Tamaño en pantalla con la misma superficie para todos los logos: uno
 * cuadrado mide `side` × `side` y uno muy ancho queda más ancho y más bajo,
 * así ninguno se ve más grande que otro. `maxWidth` pone tope a los muy anchos.
 */
export function logoSize(logo: ImageMetadata, side: number, maxWidth: number) {
  const ratio = logo.width / logo.height;
  let width = side * Math.sqrt(ratio);
  let height = side / Math.sqrt(ratio);
  if (width > maxWidth) {
    height *= maxWidth / width;
    width = maxWidth;
  }
  return { width: Math.round(width), height: Math.round(height) };
}
