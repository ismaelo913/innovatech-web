export const SITE = {
  name: 'Innovatech',
  tagline: 'Calidad que se ve, seguridad que se siente',
  description:
    'Innovatech es una empresa subcontratista de construcción en Santiago de Chile. Calidad que se ve, seguridad que se siente. Mano de obra cualificada, equipada y supervisada.',
  url: 'https://innovatech.cl',
  phone: '+56 9 3890 5488',
  email: 'contacto@innovatech.cl',
  address: 'Santiago, Región Metropolitana, Chile',
  whatsapp: '56938905488',
} as const;

export const NAV_LINKS = [
  { label: 'Inicio', href: '/' },
  { label: 'Servicios', href: '/servicios' },
  { label: 'Proyectos', href: '/proyectos' },
  { label: 'Nosotros', href: '/nosotros' },
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

