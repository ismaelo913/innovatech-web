import { config, collection, fields } from '@keystatic/core';

export default config({
  storage: {
    kind: 'github',
    repo: 'ismaelo913/innovatech-web',
  },
  ui: {
    brand: { name: 'Innovatech CMS' },
  },
  collections: {
    blog: collection({
      label: 'Blog',
      slugField: 'title',
      path: 'src/content/blog/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Título' } }),
        description: fields.text({ label: 'Descripción', multiline: true }),
        author: fields.text({ label: 'Autor', defaultValue: 'Equipo Innovatech' }),
        date: fields.date({ label: 'Fecha de publicación' }),
        tags: fields.array(
          fields.text({ label: 'Tag' }),
          { label: 'Tags', itemLabel: (props) => props.value }
        ),
        content: fields.markdoc({
          label: 'Contenido',
          options: {
            bold: true,
            italic: true,
            heading: true,
            table: true,
            link: true,
            image: false,
          },
        }),
      },
    }),

    projects: collection({
      label: 'Proyectos',
      slugField: 'title',
      path: 'src/content/projects/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Título del proyecto' } }),
        category: fields.select({
          label: 'Categoría',
          options: [
            { label: 'Remodelación Residencial', value: 'remodelacion-residencial' },
            { label: 'Remodelación Comercial', value: 'remodelacion-comercial' },
            { label: 'Obra Gruesa', value: 'obra-gruesa' },
            { label: 'Terminaciones', value: 'terminaciones' },
            { label: 'Ampliación', value: 'ampliacion' },
            { label: 'Montaje Eléctrico', value: 'montaje-electrico' },
          ],
          defaultValue: 'terminaciones',
        }),
        location: fields.text({ label: 'Ubicación', validation: { isRequired: false } }),
        date: fields.date({ label: 'Fecha de ejecución' }),
        featured: fields.checkbox({ label: 'Proyecto destacado', defaultValue: false }),
        content: fields.markdoc({ label: 'Descripción del proyecto' }),
      },
    }),
  },
});
