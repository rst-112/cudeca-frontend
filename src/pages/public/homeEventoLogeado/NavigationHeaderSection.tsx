import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export const NavigationHeaderSection = (): JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationLinks = [
    { id: 1, label: "Inicio", href: "/home-logeado" },
    { id: 2, label: "Eventos", href: "/eventos" },
    { id: 3, label: "Contacto", href: "#contacto" },
  ];

  const [notificationCount] = React.useState(2);

  return (
    <header className="w-full bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-8 flex items-center justify-between h-20">
        <div className="flex items-center gap-2">
          <Link to="/home-logeado" className="text-xl font-bold text-slate-900 dark:text-white">
            Fundación Cudeca
          </Link>
        </div>

        <nav
          className="flex items-center gap-8"
          role="navigation"
          aria-label="Navegación principal"
        >
          {navigationLinks.map((link) => {
            const isActive = location.pathname === link.href;

            if (link.href.startsWith("#")) {
              return (
                <a
                  key={link.id}
                  href={link.href}
                  className="pb-2 text-base transition-colors text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  {link.label}
                </a>
              );
            }

            return (
              <Link
                key={link.id}
                to={link.href}
                className={`pb-2 text-base transition-colors ${isActive
                  ? "font-bold text-slate-900 dark:text-white border-b-2 border-[#00753e] dark:border-[#00a651]"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                aria-current={isActive ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <button
            className="relative p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            aria-label={`Carrito de compras, ${notificationCount} artículos`}
            title="Carrito de compras"
          >
            <span className="text-xl">🛒</span>
            {notificationCount > 0 && (
              <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 bg-[#00a651] dark:bg-[#00d66a] text-white dark:text-slate-900 text-xs font-bold rounded-full">
                {notificationCount}
              </span>
            )}
          </button>

          <button
            onClick={() => navigate("/mi-perfil")}
            className="px-6 py-2 bg-[#00753e] dark:bg-[#00a651] hover:bg-[#006835] dark:hover:bg-[#008a43] text-white font-semibold rounded-lg transition-colors text-sm flex items-center gap-2"
            aria-label="Mi Perfil"
            title="Mi Perfil"
          >
            <span>👤</span>
            Mi Perfil
          </button>
        </div>
      </div>
    </header>
  );
};
