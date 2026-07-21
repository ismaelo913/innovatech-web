export const SITE = {
  name: 'Innovatech',
  tagline: 'Calidad que se ve, seguridad que se siente',
  description:
    'Innovatech es una empresa subcontratista de construcción y montaje eléctrico en Santiago de Chile. Calidad que se ve, seguridad que se siente. Mano de obra cualificada, equipada y supervisada.',
  url: 'https://innovatechconstrucciones.cl',
  phone: '+56 9 3890 5488',
  email: 'administracion@innovatechconstrucciones.cl',
  address: 'Santiago, Región Metropolitana, Chile',
  whatsapp: '56938905488',
} as const;

export const NAV_LINKS = [
  { label: 'Inicio', href: '/' },
  { label: 'Servicios', href: '/servicios' },
  { label: 'Proyectos', href: '/proyectos' },
  { label: 'Blog', href: '/blog' },
  { label: 'Empresas', href: '/empresas' },
  { label: 'Nosotros', href: '/nosotros' },
  { label: 'Contacto', href: '/contacto' },
] as const;

export const SERVICES = [
  {
    slug: 'electricidad-montaje-electrico',
    title: 'Electricidad y Montaje Eléctrico',
    short: 'Salas eléctricas, tableros, baja y media tensión para proyectos industriales.',
    icon: 'zap',
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
  {
    slug: 'remodelaciones-comerciales',
    title: 'Remodelaciones Comerciales',
    short: 'Oficinas, locales y espacios corporativos funcionales.',
    icon: 'building',
  },
  {
    slug: 'remodelaciones-residenciales',
    title: 'Remodelaciones Residenciales',
    short: 'Cocinas, baños y espacios interiores con acabados de calidad.',
    icon: 'home',
  },
] as const;

