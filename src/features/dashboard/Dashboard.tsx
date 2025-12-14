import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { LogOut, User, Calendar, Ticket, Home as HomeIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navbar } from '../../components/ui/Navbar';

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300 font-['Arimo']">
      {/* Navbar Sticky - Igual que MainLayout */}
      <Navbar />

      <div className="flex flex-1 bg-slate-50 dark:bg-slate-950">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 hidden md:flex flex-col">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Mi Panel</h3>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            <Link
              to="/dashboard"
              className="flex items-center gap-3 px-4 py-3 text-[#00A651] bg-[#00A651]/10 rounded-lg font-medium transition-colors"
            >
              <HomeIcon size={20} />
              Inicio
            </Link>
            <Link
              to="/eventos"
              className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg font-medium transition-colors"
            >
              <Calendar size={20} />
              Eventos
            </Link>
            <Link
              to="/dev/perfil-compras"
              className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg font-medium transition-colors"
            >
              <Ticket size={20} />
              Mis Entradas
            </Link>
            <Link
              to="/dev/perfil-usuario"
              className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg font-medium transition-colors"
            >
              <User size={20} />
              Mi Perfil
            </Link>
          </nav>

          <div className="p-4 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={logout}
              className="flex items-center gap-3 px-4 py-3 w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg font-medium transition-colors"
            >
              <LogOut size={20} />
              Cerrar Sesión
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col">

          {/* Dashboard Content */}
          <div className="p-6 md:p-8 overflow-y-auto">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Panel de Control
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Stats Cards */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-slate-500 dark:text-slate-400 font-medium">Eventos Próximos</h3>
                  <Calendar className="text-[#00A651]" size={24} />
                </div>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">3</p>
              </div>
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-slate-500 dark:text-slate-400 font-medium">Mis Entradas</h3>
                  <Ticket className="text-blue-500" size={24} />
                </div>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">12</p>
              </div>
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-slate-500 dark:text-slate-400 font-medium">Donaciones</h3>
                  <div className="text-purple-500 font-bold">€</div>
                </div>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">150€</p>
              </div>
            </div>

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
        </main>
      </div>
    </div>
  );
}
