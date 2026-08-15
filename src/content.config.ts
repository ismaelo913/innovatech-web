import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string(),
    image: z.string().optional(),
    order: z.number(),
    features: z.array(z.string()),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    client: z.string().optional(),
    category: z.enum([
      'remodelacion-residencial',
      'remodelacion-comercial',
      'obra-gruesa',
      'terminaciones',
      'ampliacion',
      'montaje-electrico',
    ]),
    location: z.string().optional(),
    area: z.string().optional(),
    duration: z.string().optional(),
    featured: z.boolean().default(false),
    date: z.coerce.date(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    author: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()),
    image: z.string().optional(),
  }),
});

// Testimonios — SOLO publicar citas reales de clientes con consentimiento
// explícito (idealmente por escrito) para usar su nombre/cargo/empresa en el
// sitio. No crear entradas de ejemplo ni citas inventadas: una colección
// vacía simplemente no renderiza la sección (ver TestimonialsSection.astro).
// Ver src/content/testimonials/README.md para el procedimiento de alta.
const testimonials = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/testimonials' }),
  schema: z.object({
    author: z.string(), // Nombre de la persona que da el testimonio
    role: z.string().optional(), // Cargo, ej. "Jefe de Proyectos"
    company: z.string(), // Empresa mandante
    consentObtained: z.literal(true), // Obliga a confirmar consentimiento al crear el archivo
    consentDate: z.coerce.date(), // Fecha en que se obtuvo el consentimiento
    projectRef: z.string().optional(), // slug de src/content/projects relacionado, si aplica
    featured: z.boolean().default(false),
  }),
});

export const collections = { services, projects, blog, testimonials };
