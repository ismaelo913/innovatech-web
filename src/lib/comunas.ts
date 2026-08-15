// Landing pages servicio × comuna — combinaciones curadas (no todas las
// comunas x todos los servicios, para evitar contenido delgado/duplicado).
// Cada entrada tiene contexto genuino de la comuna (zona industrial, tipo de
// construcción predominante) para que el contenido sea realmente distinto
// entre páginas, no un find-replace del nombre de la comuna.
//
// Para agregar una comuna nueva a un servicio: sumar una entrada aquí con
// `serviceSlug` + `comuna` + el contexto. La página se genera sola en
// src/pages/servicios/[slug]/[comuna].astro vía getStaticPaths.

export interface ComunaLanding {
  serviceSlug: string;
  comuna: string;
  comunaSlug: string;
  context: string; // 1-2 frases: por qué este servicio calza con esta comuna
  projectTypes: string[]; // tipos de proyecto típicos en la zona para este servicio
}

export const COMUNA_LANDINGS: ComunaLanding[] = [
  {
    serviceSlug: 'electricidad-montaje-electrico',
    comuna: 'Pudahuel',
    comunaSlug: 'pudahuel',
    context:
      'Pudahuel concentra bodegas logísticas, centros de distribución y naves industriales por su cercanía al Aeropuerto Arturo Merino Benítez y a la Ruta 68. Ese tipo de instalación exige salas eléctricas y tableros de distribución dimensionados para operación continua.',
    projectTypes: [
      'Salas eléctricas para centros de distribución y bodegas logísticas',
      'Tableros de distribución y fuerza para naves industriales',
      'Instalaciones de baja y media tensión en parques industriales',
    ],
  },
  {
    serviceSlug: 'electricidad-montaje-electrico',
    comuna: 'Cerrillos',
    comunaSlug: 'cerrillos',
    context:
      'Cerrillos es uno de los polos industriales históricos de Santiago poniente, con bodegas, talleres y plantas de proceso que conviven con proyectos inmobiliarios nuevos en el ex-aeródromo. La demanda eléctrica va desde habilitaciones industriales hasta instalaciones para edificios en construcción.',
    projectTypes: [
      'Montaje de tableros eléctricos en bodegas y talleres industriales',
      'Canalización y bandejas portacables en naves de proceso',
      'Instalaciones de baja tensión para proyectos inmobiliarios nuevos',
    ],
  },
  {
    serviceSlug: 'obra-gruesa',
    comuna: 'Maipú',
    comunaSlug: 'maipu',
    context:
      'Maipú ha sido una de las comunas con más crecimiento inmobiliario de la Región Metropolitana en la última década, con loteos nuevos y proyectos de mediana escala que requieren obra gruesa ejecutada con cuadrillas propias y plazos comprometidos.',
    projectTypes: [
      'Fundaciones y estructura para proyectos residenciales de mediana escala',
      'Albañilería y hormigón armado en ampliaciones de loteos',
      'Obra gruesa para proyectos comerciales de barrio',
    ],
  },
  {
    serviceSlug: 'remodelaciones-comerciales',
    comuna: 'Providencia',
    comunaSlug: 'providencia',
    context:
      'Providencia concentra un alto volumen de oficinas corporativas y locales comerciales en edificios ya operativos, donde remodelar sin detener la actividad del negocio — o coordinando con la administración del edificio — es la principal restricción del proyecto.',
    projectTypes: [
      'Remodelación de oficinas corporativas en edificios operativos',
      'Habilitación de locales comerciales y coworking',
      'Proyectos por fases para minimizar tiempo de detención del negocio',
    ],
  },
  {
    serviceSlug: 'remodelaciones-residenciales',
    comuna: 'Las Condes',
    comunaSlug: 'las-condes',
    context:
      'Las Condes tiene el parque de viviendas de mayor estándar de la Región Metropolitana, lo que eleva la exigencia en terminaciones, materiales y coordinación con administraciones de edificios y comunidades.',
    projectTypes: [
      'Remodelación integral de cocinas y baños con terminaciones de calidad',
      'Renovación de departamentos en edificios con reglamento de copropiedad',
      'Proyectos residenciales que requieren coordinación con administración',
    ],
  },
];

export function findComunaLanding(serviceSlug: string, comunaSlug: string) {
  return COMUNA_LANDINGS.find(
    (l) => l.serviceSlug === serviceSlug && l.comunaSlug === comunaSlug,
  );
}
