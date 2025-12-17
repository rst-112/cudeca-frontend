import React from "react";

export const FeaturedEventSection = (): JSX.Element => {
  return (
    <section className="w-full bg-slate-50 dark:bg-slate-900 py-16 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-4 mb-8">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white [font-family:'Arimo-Bold',Helvetica]">
            Tu Centro de Eventos
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg [font-family:'Arimo-Regular',Helvetica]">
            Explora todos los eventos y mantente actualizado con nuestras actividades solidarias
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all">
            <div className="text-4xl mb-3">📅</div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 [font-family:'Arimo-Bold',Helvetica]">
              Próximos Eventos
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm [font-family:'Arimo-Regular',Helvetica]">
              Descubre todas las formas de apoyar a Fundación Cudeca
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all">
            <div className="text-4xl mb-3">🎫</div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 [font-family:'Arimo-Bold',Helvetica]">
              Mis Entradas
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm [font-family:'Arimo-Regular',Helvetica]">
              Gestiona y consulta tus entradas compradas
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all">
            <div className="text-4xl mb-3">❤️</div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 [font-family:'Arimo-Bold',Helvetica]">
              Mis Donaciones
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm [font-family:'Arimo-Regular',Helvetica]">
              Ver el historial de tus contribuciones
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

