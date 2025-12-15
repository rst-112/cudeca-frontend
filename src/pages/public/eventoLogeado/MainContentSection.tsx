import React from "react";
import { useNavigate } from "react-router-dom";

export const MainContentSection = (): JSX.Element => {
  const navigate = useNavigate();

  const navigationItems = [
    { label: "Inicio", isActive: false },
    { label: "Eventos", isActive: true },
    { label: "Contacto", isActive: false },
  ];

  const cartItemCount = 2;

  return (
    <>
      <header className="w-full bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-20">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white [font-family:'Arimo-Bold',Helvetica]">
              Fundación Cudeca
            </h1>
          </div>

          <nav
            className="flex items-center gap-8"
            role="navigation"
            aria-label="Navegación principal"
          >
            <button
              onClick={() => navigate("/home-invitado")}
              className="pb-2 text-base transition-colors text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              aria-label="Ir a inicio"
            >
              Inicio
            </button>
            <button
              className="pb-2 text-base font-bold text-slate-900 dark:text-white border-b-2 border-[#00753e] dark:border-[#00a651] transition-colors [font-family:'Arimo-Regular',Helvetica]"
              aria-current="page"
              disabled
            >
              Eventos
            </button>
            <button
              onClick={() => navigate("/home-invitado")}
              className="pb-2 text-base transition-colors text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              aria-label="Ir a contacto"
            >
              Contacto
            </button>
          </nav>

          <div className="flex items-center gap-4">
            <button
              className="relative p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              aria-label={`Carrito de compras, ${cartItemCount} artículos`}
            >
              <span className="text-2xl">🛒</span>
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 bg-[#00a651] dark:bg-[#00d66a] text-white dark:text-slate-900 text-xs font-bold rounded-full">
                  {cartItemCount}
                </span>
              )}
            </button>

            <button
              onClick={() => navigate("/login")}
              className="px-6 py-2 bg-[#00753e] dark:bg-[#00a651] hover:bg-[#006633] dark:hover:bg-[#008a43] text-white font-semibold rounded-lg transition-colors text-sm [font-family:'Arimo-Regular',Helvetica]"
              aria-label="Iniciar sesión"
            >
              INICIAR SESIÓN
            </button>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <nav className="w-full bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm">
          <button
            onClick={() => navigate("/home-invitado")}
            className="text-[#00753e] dark:text-[#00a651] hover:underline font-medium [font-family:'Arimo-Regular',Helvetica]"
            aria-label="Ir a inicio"
          >
            Home
          </button>
          <span className="text-slate-500 dark:text-slate-400">/</span>
          <span className="text-slate-600 dark:text-slate-400 font-medium [font-family:'Arimo-Regular',Helvetica]">
            Información del evento
          </span>
        </div>
      </nav>
    </>
  );
};

