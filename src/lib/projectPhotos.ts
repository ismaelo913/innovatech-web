// Fotos de obra en src/assets/projects. Antes vivían en public/images/projects
// y se servían tal cual (JPEG a tamaño original, ~1,2 MB en la galería de
// Mina CMP); desde aquí Astro las convierte a WebP y genera varios anchos al
// compilar.
//
// Se referencian por nombre de archivo ('mina-cmp-1.jpeg'). También se acepta
// la ruta antigua ('/images/projects/mina-cmp-1.jpeg'), que sigue escrita en
// el frontmatter de algunos contenidos.
import type { ImageMetadata } from 'astro';
import { getImage } from 'astro:assets';

const files = import.meta.glob<{ default: ImageMetadata }>('../assets/projects/*.{jpeg,jpg,png}', {
  eager: true,
});
const photos = new Map(Object.entries(files).map(([path, mod]) => [path.split('/').pop()!, mod.default]));

export function projectPhoto(file: string): ImageMetadata {
  const photo = photos.get(file.split('/').pop()!);
  if (!photo) throw new Error(`Foto de proyecto no encontrada en src/assets/projects: ${file}`);
  return photo;
}

// Parte de la foto que queda a la vista cuando un marco la recorta
// (object-position). Casi todas son fotos verticales de celular que se
// muestran en marcos horizontales, así que por defecto se ve el centro;
// aquí van las que necesitan otro encuadre.
const focus: Record<string, string> = {
  'colina-1.jpeg': '50% 22%', // la casa y la compactadora; el centro es solo suelo
};

/** Foto ya optimizada para islas React, que no pueden usar <Image>. */
export interface ResponsivePhoto {
  src: string;
  srcset: string;
  width: number;
  height: number;
  /** object-position para los marcos que recortan la foto (ver `focus`). */
  position?: string;
}

export async function responsivePhoto(file: string, widths: number[]): Promise<ResponsivePhoto> {
  const photo = projectPhoto(file);
  const image = await getImage({ src: photo, widths });
  return {
    src: image.src,
    srcset: image.srcSet.attribute,
    width: photo.width,
    height: photo.height,
    position: focus[file.split('/').pop()!],
  };
}
