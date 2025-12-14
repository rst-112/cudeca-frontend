import React from "react";
import { useNavigate } from "react-router-dom";

export const FeaturedEventSection = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <section className="w-full bg-white dark:bg-slate-800 py-16 px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full w-fit">
            <span className="text-sm font-bold text-[#016630] dark:text-[#00a651] [font-family:'Arimo-Bold',Helvetica]">
              ⭐ Evento Destacado
            </span>
          </div>

          <h2 className="text-5xl font-bold text-slate-900 dark:text-white leading-tight [font-family:'Arimo-Bold',Helvetica]">
            Gala Benéfica Anual: Eres Pieza Clave
          </h2>

          <p className="text-xl text-slate-600 dark:text-slate-400 [font-family:'Arimo-Regular',Helvetica]">
            Únete a una noche mágica para apoyar los cuidados paliativos.
          </p>

          <button
            onClick={() => navigate("/evento-invitado")}
            className="px-8 py-3 bg-[#00753e] dark:bg-[#00a651] hover:bg-[#006835] dark:hover:bg-[#008a43] text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg w-fit [font-family:'Arimo-Regular',Helvetica]"
            type="button"
            aria-label="Comprar entradas para la Gala Benéfica Anual"
          >
            🎫 Comprar Entradas
          </button>
        </div>

        <div className="relative h-96 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-2xl shadow-lg flex items-center justify-center text-6xl overflow-hidden">
          🎭
        </div>
      </div>
    </section>
  );
};

