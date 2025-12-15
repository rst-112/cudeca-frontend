import { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import {
  LogOut,
  User,
  Calendar,
  Ticket,
  Home as HomeIcon,
  Menu,
  X,
  ArrowLeft,
  ScanLine,
} from 'lucide-react';
import { QrScannerFAB } from '../../components/QrScannerFAB';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Verificamos si es personal
  const isStaff = user?.roles?.includes('PERSONAL_EVENTO');

  // Determinar título basado en la ruta actual
  const getTitle = () => {
    if (location.pathname.includes('/tickets')) return 'Mis Entradas';
    if (location.pathname.includes('/events')) return 'Eventos';
    if (location.pathname.includes('/profile')) return 'Mi Perfil';
    if (location.pathname.includes('/scanner')) return 'Escanear Entradas';
    return 'Panel de Control';
  };

  // Helper para estilos de links activos
  const getLinkClass = ({ isActive }: { isActive: boolean }) => {
    const base =
      'flex items-center gap-3 px-4 py-3 w-full rounded-lg font-medium transition-colors cursor-pointer';
    const active = 'text-[#00A651] bg-[#00A651]/10';
    const inactive =
      'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800';
    return `${base} ${isActive ? active : inactive}`;
  };

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
          <NavLink to="/dashboard" end className={getLinkClass}>
            <HomeIcon size={20} /> Inicio
          </NavLink>

          <NavLink to="/dashboard/tickets" className={getLinkClass}>
            <Ticket size={20} /> Mis Entradas
          </NavLink>

          <NavLink to="/dashboard/events" className={getLinkClass}>
            <Calendar size={20} /> Eventos
          </NavLink>

          <NavLink to="/dashboard/profile" className={getLinkClass}>
            <User size={20} /> Mi Perfil
          </NavLink>

          {/* Opción de Escáner en el menú lateral (Solo Staff) */}
          {isStaff && (
            <>
              <div className="my-2 h-px bg-slate-200 dark:bg-slate-800" />
              <NavLink to="/dashboard/scanner" className={getLinkClass}>
                <ScanLine size={20} /> Escáner QR
              </NavLink>
            </>
          )}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg font-medium transition-colors cursor-pointer"
          >
            <LogOut size={20} /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Botón Volver inteligente */}
            {location.pathname !== '/dashboard' && (
              <button
                onClick={() => navigate('/dashboard')}
                className="md:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                <ArrowLeft size={20} />
              </button>
            )}

            <h1 className="text-xl font-bold text-slate-900 dark:text-white font-['Arimo']">
              {getTitle()}
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
            <Link
              to="/dashboard/profile"
              className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold hover:ring-2 hover:ring-[#00A651] transition-all"
            >
              {user?.nombre?.charAt(0) || 'U'}
            </Link>
          </div>
        </header>

        {/* Menú Móvil */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 space-y-2 animate-in slide-in-from-top-5 absolute w-full z-50 shadow-xl">
            <NavLink
              to="/dashboard"
              end
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 w-full rounded-lg font-medium ${isActive ? 'text-[#00A651] bg-[#00A651]/10' : 'text-slate-600 dark:text-slate-400'}`
              }
            >
              <HomeIcon size={20} /> Inicio
            </NavLink>
            <NavLink
              to="/dashboard/tickets"
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 w-full rounded-lg font-medium ${isActive ? 'text-[#00A651] bg-[#00A651]/10' : 'text-slate-600 dark:text-slate-400'}`
              }
            >
              <Ticket size={20} /> Mis Entradas
            </NavLink>

            {isStaff && (
              <NavLink
                to="/dashboard/scanner"
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 w-full rounded-lg font-medium ${isActive ? 'text-[#00A651] bg-[#00A651]/10' : 'text-slate-600 dark:text-slate-400'}`
                }
              >
                <ScanLine size={20} /> Escáner QR
              </NavLink>
            )}

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-3 w-full text-red-500 font-medium"
              >
                <LogOut size={20} /> Cerrar Sesión
              </button>
            </div>
          </div>
        )}

        {/* ÁREA DE CONTENIDO DINÁMICO */}
        <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 p-6 md:p-8">
          <Outlet />
        </div>
      </main>

      {/* FAB: Se usa sin onClick, aprovechando la lógica interna del componente */}
      {isStaff && <QrScannerFAB />}
    </div>
  );
}
