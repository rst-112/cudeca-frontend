import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import {
  LogOut,
  User,
  Calendar,
  Ticket,
  Home as HomeIcon,
  Info,
  ArrowLeft,
  Menu,
  X,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import QrReaderComponent from '../../components/QrReaderComponent';
import { QrScannerFAB } from '../../components/QrScannerFAB';

type DashboardView = 'home' | 'scanner';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [activeView, setActiveView] = useState<DashboardView>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Verificar si se navegó aquí con una vista específica
  useEffect(() => {
    const state = location.state as { view?: DashboardView } | null;
    if (state?.view) {
      setActiveView(state.view);
    }
  }, [location.state]);

  // Verificar si el usuario es personal de evento (staff)
  const isStaff = user?.roles?.includes('PERSONAL_EVENTO');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 hidden md:flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-[#00A651] flex items-center justify-center text-white font-bold shadow-sm">
              C
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight font-['Arimo']">
              cudeca
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <button
            onClick={() => setActiveView('home')}
            className={`flex items-center gap-3 px-4 py-3 w-full rounded-lg font-medium transition-colors ${
              activeView === 'home'
                ? 'text-[#00A651] bg-[#00A651]/10'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            } cursor-pointer`}
          >
            <HomeIcon size={20} />
            Inicio
          </button>
          <Link
            to="/events"
            className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg font-medium transition-colors cursor-pointer"
          >
            <Calendar size={20} />
            Eventos
          </Link>
          <Link
            to="/tickets"
            className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg font-medium transition-colors cursor-pointer"
          >
            <Ticket size={20} />
            Mis Entradas
          </Link>
          <Link
            to="/profile"
            className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg font-medium transition-colors cursor-pointer"
          >
            <User size={20} />
            Mi Perfil
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg font-medium transition-colors cursor-pointer"
          >
            <LogOut size={20} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-3">
            {/* Botón menú móvil */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {activeView === 'scanner' && (
              <button
                onClick={() => setActiveView('home')}
                className="md:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <h1 className="text-xl font-bold text-slate-900 dark:text-white font-['Arimo']">
              {activeView === 'home' ? 'Panel de Control' : 'Escanear entradas'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600 dark:text-slate-400 hidden sm:block">
              Hola,{' '}
              <span className="font-bold text-slate-900 dark:text-white">
                {user?.nombre || 'Usuario'}
              </span>
            </span>
            <ThemeToggle />
            <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold">
              {user?.nombre?.charAt(0) || 'U'}
            </div>
          </div>
        </header>

        {/* Menú Móvil Desplegable */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 space-y-2 animate-in slide-in-from-top-5">
            <button
              onClick={() => {
                setActiveView('home');
                setIsMobileMenuOpen(false);
              }}
              className={`flex items-center gap-3 px-4 py-3 w-full rounded-lg font-medium transition-colors ${
                activeView === 'home'
                  ? 'text-[#00A651] bg-[#00A651]/10'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              } cursor-pointer`}
            >
              <HomeIcon size={20} />
              Inicio
            </button>
            <Link
              to="/events"
              className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg font-medium transition-colors cursor-pointer"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Calendar size={20} />
              Eventos
            </Link>
            <Link
              to="/tickets"
              className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg font-medium transition-colors cursor-pointer"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Ticket size={20} />
              Mis Entradas
            </Link>
            <Link
              to="/profile"
              className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg font-medium transition-colors cursor-pointer"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <User size={20} />
              Mi Perfil
            </Link>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-3 w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg font-medium transition-colors cursor-pointer"
              >
                <LogOut size={20} />
                Cerrar Sesión
              </button>
            </div>
          </div>
        )}

        {/* Dashboard Content */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1">
          {activeView === 'home' ? (
            /* Home View */
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Stats Cards */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-slate-500 dark:text-slate-400 font-medium">
                      Eventos Próximos
                    </h3>
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
            </>
          ) : (
            /* Scanner View */
            <div className="max-w-lg mx-auto">
              {/* Instructions Card */}
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 p-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-lg shrink-0">
                    <Info className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-amber-800 dark:text-amber-300 mb-1">
                      Instrucciones de uso
                    </h3>
                    <p className="text-sm text-amber-700 dark:text-amber-400">
                      Apunta la cámara hacia el código QR de la entrada del asistente. El sistema
                      validará automáticamente la entrada.
                    </p>
                  </div>
                </div>
              </div>

              {/* Scanner Component */}
              <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Cámara activa
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded-full">
                      Modo Staff
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <QrReaderComponent />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Floating Action Button (FAB) - Solo visible para Personal de Evento */}
      {isStaff && (
        <QrScannerFAB
          onClick={() => setActiveView(activeView === 'scanner' ? 'home' : 'scanner')}
        />
      )}
    </div>
  );
}
