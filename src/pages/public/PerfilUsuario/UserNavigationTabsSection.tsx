import { useState } from 'react';

interface Tab {
  id: string;
  label: string;
}

const tabs: Tab[] = [
  { id: 'perfil', label: 'Información del Perfil' },
  { id: 'entradas', label: 'Mis Entradas' },
  { id: 'historial', label: 'Historial de Compras' },
];

export const UserNavigationTabsSection = () => {
  const [activeTab, setActiveTab] = useState<string>('perfil');

  return (
    <section className="w-full max-w-[1136px] mx-auto mt-8 px-4">
      <nav className="flex border-b-2 border-[#00753e]" aria-label="Navegación de perfil">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 text-base font-bold transition-colors font-['Arimo'] ${
              activeTab === tab.id
                ? 'text-[#00753e] border-b-2 border-[#00753e] -mb-[2px]'
                : 'text-slate-600 dark:text-slate-400 hover:text-[#00753e]'
            }`}
            aria-current={activeTab === tab.id ? 'page' : undefined}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </section>
  );
};
