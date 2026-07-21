export interface CatalogItem {
  id: string;
  name: string;
  description: string;
  unit: string;
}

export interface CatalogCategory {
  id: string;
  name: string;
  items: CatalogItem[];
}

export const CATALOG: CatalogCategory[] = [
  {
    id: 'cuadrillas',
    name: 'Cuadrillas',
    items: [
      { id: 'squad-obra-gruesa', name: 'Cuadrilla Obra Gruesa', description: 'Maestro albañil + 1 ayudante', unit: 'días' },
      { id: 'squad-terminaciones', name: 'Cuadrilla Terminaciones', description: 'Maestro terminaciones + 1 ayudante', unit: 'días' },
      { id: 'squad-carpinteria', name: 'Cuadrilla Carpintería', description: 'Maestro carpintero + 1 ayudante', unit: 'días' },
      { id: 'squad-acero', name: 'Cuadrilla Montaje de Acero', description: 'Soldador certificado + montador estructural', unit: 'días' },
      { id: 'supervisor', name: 'Supervisor de obra', description: 'Coordinación y control diario de avance', unit: 'días' },
    ],
  },
  {
    id: 'remodelaciones',
    name: 'Remodelaciones',
    items: [
      { id: 'remod-cocina', name: 'Remodelación Cocina', description: 'Desmontaje + instalación completa, incluye clóset', unit: 'm²' },
      { id: 'remod-bano', name: 'Remodelación Baño', description: 'Desmontaje + instalación completa', unit: 'unidad' },
      { id: 'remod-dormitorio', name: 'Remodelación Dormitorio', description: 'Pintura, piso y terminaciones interiores', unit: 'm²' },
      { id: 'remod-living', name: 'Remodelación Living / Comedor', description: 'Terminaciones interiores completas', unit: 'm²' },
    ],
  },
  {
    id: 'terminaciones',
    name: 'Terminaciones',
    items: [
      { id: 'pintura-int', name: 'Pintura Interior', description: 'Preparación de superficie + 2 manos látex', unit: 'm²' },
      { id: 'pintura-ext', name: 'Pintura Exterior', description: 'Limpieza + sellador + 2 manos', unit: 'm²' },
      { id: 'ceramico', name: 'Instalación Cerámico / Porcelanato', description: 'Fraguado y sellado incluido', unit: 'm²' },
      { id: 'piso-flotante', name: 'Instalación Piso Flotante', description: 'Con zócalo y nivelación de base', unit: 'm²' },
      { id: 'cielo', name: 'Cielo Americano (Metalcon)', description: 'Estructura + planchas + empaste + pintura', unit: 'm²' },
      { id: 'revestimiento', name: 'Revestimiento de Muros', description: 'Estuco delgado o revestimiento decorativo', unit: 'm²' },
    ],
  },
  {
    id: 'obra-gruesa',
    name: 'Obra Gruesa',
    items: [
      { id: 'tabiqueria', name: 'Tabiquería Metalcon', description: 'Estructura + planchas Volcaplac + empaste', unit: 'm²' },
      { id: 'radier', name: 'Radier', description: 'Hormigón H-15, e=10cm, malla C-92', unit: 'm²' },
      { id: 'albanileria', name: 'Albañilería (muro bloque)', description: 'Bloque 15×20×40 con mortero 1:4', unit: 'm²' },
      { id: 'fundacion', name: 'Fundación corrida', description: 'Excavación + hormigón H-20 + armadura', unit: 'm lineal' },
      { id: 'losa', name: 'Losa hormigón armado', description: 'Moldaje + armadura + hormigón H-25', unit: 'm²' },
    ],
  },
  {
    id: 'estructura',
    name: 'Estructura / Techado',
    items: [
      { id: 'techumbre', name: 'Cubierta de Techumbre', description: 'Estructura de madera + zinc prepintado', unit: 'm²' },
      { id: 'estructura-acero', name: 'Estructura Metálica', description: 'Corte, armado, soldadura y montaje', unit: 'kg' },
      { id: 'cubierta-liviana', name: 'Cubierta Policarbonato / Malla', description: 'Estructura metálica + cubierta liviana', unit: 'm²' },
    ],
  },
  {
    id: 'ampliaciones',
    name: 'Ampliaciones',
    items: [
      { id: 'ampliacion', name: 'Ampliación Obra Completa', description: 'Obra gruesa + terminaciones básicas', unit: 'm²' },
      { id: 'segundo-piso', name: 'Segundo Piso', description: 'Estructura + losa + tabiques + terminaciones', unit: 'm²' },
      { id: 'terraza', name: 'Terraza / Deck', description: 'Estructura + cubierta + terminaciones', unit: 'm²' },
    ],
  },
];

export const COMUNAS = [
  'Santiago Centro', 'Providencia', 'Las Condes', 'Vitacura', 'Lo Barnechea',
  'Ñuñoa', 'La Reina', 'Macul', 'Peñalolén', 'La Florida',
  'San Miguel', 'San Joaquín', 'Maipú', 'Pudahuel', 'Cerrillos',
  'Estación Central', 'Quinta Normal', 'Recoleta', 'Independencia', 'Huechuraba',
  'Otra comuna',
];

export const INPUT_CLASS =
  'w-full px-4 py-2.5 border border-neutral-900 bg-white text-neutral-950 text-sm placeholder:text-neutral-400 focus:ring-2 focus:ring-primary-400 transition-colors outline-none';
