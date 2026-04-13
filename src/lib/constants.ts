export const SITE = {
  name: 'Innovatech',
  tagline: 'Calidad que se ve, seguridad que se siente',
  description:
    'Innovatech es una empresa subcontratista de construcción en Santiago de Chile. Mano de obra cualificada, equipada y supervisada para remodelaciones, obra gruesa, terminaciones y ampliaciones.',
  url: 'https://innovatech.cl',
  phone: '+56 9 XXXX XXXX',
  email: 'contacto@innovatech.cl',
  address: 'Santiago, Región Metropolitana, Chile',
  whatsapp: '569XXXXXXXX',
} as const;

export const NAV_LINKS = [
  { label: 'Inicio', href: '/' },
  { label: 'Servicios', href: '/servicios' },
  { label: 'Proyectos', href: '/proyectos' },
  { label: 'Nosotros', href: '/nosotros' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contacto', href: '/contacto' },
] as const;

export const SERVICES = [
  {
    slug: 'remodelaciones-residenciales',
    title: 'Remodelaciones Residenciales',
    short: 'Cocinas, baños y espacios interiores con acabados de calidad.',
    icon: 'home',
  },
  {
    slug: 'remodelaciones-comerciales',
    title: 'Remodelaciones Comerciales',
    short: 'Oficinas, locales y espacios corporativos funcionales.',
    icon: 'building',
  },
  {
    slug: 'obra-gruesa',
    title: 'Obra Gruesa',
    short: 'Fundaciones, estructura, albañilería y hormigón armado.',
    icon: 'hard-hat',
  },
  {
    slug: 'terminaciones',
    title: 'Terminaciones',
    short: 'Revestimientos, pintura, pisos y cielos con precisión.',
    icon: 'paint-roller',
  },
  {
    slug: 'ampliaciones',
    title: 'Ampliaciones',
    short: 'Segundos pisos, extensiones y nuevas áreas construidas.',
    icon: 'expand',
  },
] as const;

export const STATS = [
  { value: '150+', label: 'Proyectos completados' },
  { value: '8', label: 'Años de experiencia' },
  { value: '50k+', label: 'm2 construidos' },
  { value: '98%', label: 'Clientes satisfechos' },
] as const;
