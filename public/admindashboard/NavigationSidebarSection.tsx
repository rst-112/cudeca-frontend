import React from "react";
import { useNavigate } from "react-router-dom";

interface NavItem {
  id: string;
  title: string;
  subItems: string[];
}

export const NavigationSidebarSection = (): JSX.Element => {
  const navigate = useNavigate();

  const navigationItems: NavItem[] = [
    {
      id: "eventos",
      title: "Eventos",
      subItems: ["Gestión de eventos"],
    },
    {
      id: "ventas",
      title: "Ventas",
      subItems: ["Ver Compras", "Reembolsos Manuales", "Más +"],
    },
    {
      id: "configuracion",
      title: "Configuración",
      subItems: ["Gestión de usuarios", "Exportar Datos"],
    },
  ];

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <nav
      className="w-[350px] h-full relative bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col"
      aria-label="Navegación principal"
    >
      {/* Header */}
      <header className="h-[140px] flex flex-col gap-2.5 border-b border-slate-200 dark:border-slate-700 p-8">
        <h1 className="text-2xl font-normal text-black dark:text-white [font-family:'Arimo-Regular',Helvetica]">
          Fundación Cudeca
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 [font-family:'Arimo-Regular',Helvetica]">
          Cudeca Admin
        </p>
      </header>

      {/* Navegación */}
      <div className="flex-1 flex flex-col gap-6 p-8 overflow-y-auto">
        {navigationItems.map((item) => (
          <div key={item.id} className="flex flex-col gap-2">
            <h3 className="text-base font-semibold text-[#00a651] dark:text-[#00d66a] flex items-center gap-2 [font-family:'Arimo-Regular',Helvetica]">
              <div className="w-5 h-5 bg-[#00a651] dark:bg-[#00d66a] rounded" />
              {item.title}
            </h3>
            <ul className="flex flex-col gap-2 ml-7">
              {item.subItems.map((subItem, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-[#00a651] dark:hover:text-[#00d66a] transition-colors [font-family:'Arimo-Regular',Helvetica]"
                  >
                    {subItem}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Footer - Botón Salir */}
      <footer className="border-t border-slate-200 dark:border-slate-700 p-8">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-3 flex gap-2 items-center justify-center rounded-lg border-2 border-[#00a651] dark:border-[#00d66a] text-[#00a651] dark:text-[#00d66a] hover:bg-[#00a651] hover:bg-opacity-10 dark:hover:bg-[#00d66a] dark:hover:bg-opacity-10 transition-colors font-bold [font-family:'Arimo-Regular',Helvetica]"
          type="button"
          aria-label="Volver a inicio"
        >
          ← Salir
        </button>
      </footer>
    </nav>
  );
};

