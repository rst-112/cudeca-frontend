import { Calendar, Users, TrendingUp } from 'lucide-react';

export default function DashboardHome() {
  return (
    <div className="grid grid-cols-1 gap-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Resumen de Actividad</h1>
        <span className="text-sm text-slate-500">Última actualización: Hoy</span>
      </div>

      {/* Stats Cards (Datos Globales del Evento, NO personales) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-500 dark:text-slate-400 font-medium">Asistentes Hoy</h3>
            <Users className="text-[#00A651]" size={24} />
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">124</p>
          <span className="text-xs text-green-600 font-medium">+12% vs ayer</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-500 dark:text-slate-400 font-medium">Entradas Vendidas</h3>
            <TrendingUp className="text-blue-500" size={24} />
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">1,450</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-500 dark:text-slate-400 font-medium">Próximo Evento</h3>
            <Calendar className="text-purple-500" size={24} />
          </div>
          <p className="text-lg font-bold text-slate-900 dark:text-white">Gala Benéfica</p>
          <p className="text-xs text-slate-500">En 2 días</p>
        </div>
      </div>

      {/* Actividad Reciente del Sistema */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
          Registros Recientes
        </h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50"
            >
              <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                <Users size={20} />
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-white">
                  Entrada validada - Puerta Norte
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Hace {i * 5} minutos</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
