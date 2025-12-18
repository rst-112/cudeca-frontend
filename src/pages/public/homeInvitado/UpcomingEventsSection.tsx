import React, { useState } from 'react';

export const UpcomingEventsSection = (): JSX.Element => {
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');

  const filterButtons = [
    { id: 'todos', label: 'Todos' },
    { id: 'conciertos', label: 'Conciertos' },
    { id: 'cenas', label: 'Cenas' },
    { id: 'rifas', label: 'Rifas' },
    { id: 'otros', label: 'Otros' },
  ];

  return (
    <section
      className="w-full bg-slate-50 dark:bg-slate-900 py-8 px-8 border-y border-slate-200 dark:border-slate-700"
      aria-label="Upcoming Events Filter Section"
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 items-center">
        <div className="flex-1 flex items-center gap-3 bg-white dark:bg-slate-800 px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600">
          <span className="text-xl">🔍</span>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar evento..."
            className="flex-1 bg-transparent text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 outline-none font-['Arimo-Regular',Helvetica]"
            aria-label="Buscar evento"
          />
        </div>

        <nav className="flex flex-wrap gap-3" aria-label="Event category filters">
          {filterButtons.map((filter) => {
            const isActive = activeFilter === filter.label;

            return (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.label)}
                className={`px-6 py-2 rounded-full font-semibold transition-all font-['Arimo-Regular',Helvetica] ${
                  isActive
                    ? 'bg-[#00753e] dark:bg-[#00a651] text-white shadow-lg'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:shadow-md'
                }`}
                aria-pressed={isActive}
                aria-label={`Filter by ${filter.label}`}
              >
                {filter.label}
              </button>
            );
          })}
        </nav>

        <button
          className="px-6 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 rounded-lg font-semibold hover:shadow-md transition-all font-['Arimo-Regular',Helvetica]"
          aria-label="Filtrar por fecha: Próximos eventos"
          aria-haspopup="listbox"
          aria-expanded="false"
        >
          📅 Fecha: Próximos
        </button>
      </div>
    </section>
  );
};
