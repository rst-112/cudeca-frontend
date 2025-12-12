import { Link } from "react-router-dom";
import { Bell, User } from "lucide-react";

const navigationItems = [
  { label: "Inicio", isActive: false, path: "/" },
  { label: "Eventos", isActive: false, path: "/eventos" },
  { label: "Contacto", isActive: false, path: "/contacto" },
];

export const HeaderSection = () => {
  const notificationCount = 2;

  return (
    <header className="w-full h-20 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-8 h-full flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white font-['Arimo']">
              Fundación Cudeca
            </h1>
          </Link>
        </div>

        {/* Navegación */}
        <nav className="flex items-center gap-8" aria-label="Main navigation">
          {navigationItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`flex flex-col items-center gap-1 pb-1 ${
                item.isActive
                  ? "font-bold text-slate-900 dark:text-white border-b-2 border-[#00753e]"
                  : "font-normal text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              } text-base transition-colors`}
              aria-current={item.isActive ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Acciones */}
        <div className="flex items-center gap-4">
          {/* Notificaciones */}
          <button
            className="relative p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            aria-label={`Notificaciones, ${notificationCount} sin leer`}
          >
            <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#00a651] text-white text-xs rounded-full flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </button>

          {/* Mi Perfil */}
          <Link
            to="/perfil"
            className="flex items-center gap-2 px-6 py-2 bg-[#00753e] hover:bg-[#00a651] text-white rounded-lg transition-colors"
          >
            <User className="w-4 h-4" />
            <span className="text-base">Mi Perfil</span>
          </Link>
        </div>
      </div>
    </header>
  );
};



