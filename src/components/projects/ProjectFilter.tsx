import { useState } from 'react';

interface Project {
  id: string;
  title: string;
  category: string;
  location?: string;
  image: string;
}

interface Props {
  projects: Project[];
  categoryLabels: Record<string, string>;
}

export default function ProjectFilter({ projects, categoryLabels }: Props) {
  const [activeFilter, setActiveFilter] = useState('todos');

  const categories = ['todos', ...Object.keys(categoryLabels)];

  const filtered = activeFilter === 'todos'
    ? projects
    : projects.filter((p) => p.category === activeFilter);

  return (
    <div>
      {/* Filter bar */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => {
          const label = cat === 'todos' ? 'Todos' : categoryLabels[cat] || cat;
          const isActive = activeFilter === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-[oklch(50%_0.22_250)] text-white shadow-md'
                  : 'bg-white text-neutral-600 border border-neutral-200 hover:border-[oklch(78%_0.10_250)] hover:text-[oklch(50%_0.22_250)]'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Project grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((project) => (
          <a key={project.id} href={`/proyectos/${project.id}`} className="group block">
            <div className="rounded-xl overflow-hidden border border-neutral-200/60 bg-white shadow-sm transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-0.5">
              <div className="aspect-[4/3] relative overflow-hidden bg-neutral-200">
                <img
                  src={project.image}
                  alt={project.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-[oklch(50%_0.22_250/0)] group-hover:bg-[oklch(50%_0.22_250/0.1)] transition-colors duration-300" />
              </div>
              <div className="p-5">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[oklch(97%_0.01_250)] text-[oklch(50%_0.22_250)] border border-[oklch(88%_0.06_250)] mb-3">
                  {categoryLabels[project.category] || project.category}
                </span>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2 group-hover:text-[oklch(50%_0.22_250)] transition-colors">
                  {project.title}
                </h3>
                {project.location && (
                  <div className="flex items-center gap-1.5 text-sm text-neutral-500">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    {project.location}
                  </div>
                )}
              </div>
            </div>
          </a>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-neutral-500">
          <p className="text-lg font-medium">No hay proyectos en esta categoría.</p>
          <p className="text-sm mt-1">Prueba con otro filtro.</p>
        </div>
      )}
    </div>
  );
}
