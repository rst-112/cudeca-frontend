import { Link } from 'react-router-dom';
import { Ticket, Calendar } from 'lucide-react';

export default function DashboardHome() {
  return (
    <div className="grid grid-cols-1 gap-6 animate-in fade-in duration-300">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-500 dark:text-slate-400 font-medium">Eventos Próximos</h3>
            <Calendar className="text-[#00A651]" size={24} />
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">3</p>
        </div>

        {/* Card Enlazada a Mis Entradas */}
        <Link to="/dashboard/tickets" className="block group">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 cursor-pointer group-hover:border-[#00A651] transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-500 dark:text-slate-400 font-medium group-hover:text-[#00A651]">
                Mis Entradas
              </h3>
              <Ticket className="text-blue-500 group-hover:text-[#00A651]" size={24} />
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">12</p>
          </div>
        </Link>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-500 dark:text-slate-400 font-medium">Donaciones</h3>
            <div className="text-purple-500 font-bold">€</div>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">150€</p>
        </div>
      </div>

      {/* Actividad Reciente */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
          Actividad Reciente
        </h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50"
            >
              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Ticket size={20} />
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-white">
                  Compra de entradas - Concierto Benéfico
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Hace {i} días</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
