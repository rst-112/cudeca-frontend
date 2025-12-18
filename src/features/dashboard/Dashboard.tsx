import { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LogOut,
  Calendar,
  Home as HomeIcon,
  ScanLine,
  ArrowLeft,
  ExternalLink,
  Settings,
  Menu,
  X,
} from 'lucide-react';
import { QrScannerFAB } from '../../components/QrScannerFAB';
import { Header } from '../../components/layout/Header';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isStaff = user?.roles?.includes('PERSONAL_EVENTO') || user?.email === 'staff@test.com';
  const isAdmin = user?.roles?.includes('ADMINISTRADOR') || user?.email === 'admin@test.com';

  // Base path dinámico según el rol (generalmente /staff para operaciones de evento)
  // Si es solo admin gestionando, podría ser diferente, pero unifiquemos a /staff para la vista operativa
  const basePath = '/staff';

  const getLinkClass = ({ isActive }: { isActive: boolean }) => {
    const base =
      'flex items-center gap-3 px-4 py-3 w-full rounded-lg font-medium transition-colors cursor-pointer';
    const active = 'text-[#00A651] bg-[#00A651]/10';
    const inactive =
      'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800';
    return `${base} ${isActive ? active : inactive}`;
  };

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 font-['Arimo']">
      <div className="sticky top-0 z-50">
        <Header isLoggedIn={true} />
      </div>

      {/* HEADER MÓVIL */}
      <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between sticky top-20 z-40">
        <h2 className="font-bold text-slate-900 dark:text-white">Panel de Gestión</h2>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* SIDEBAR */}
        <aside
          className={`
          fixed md:relative top-[140px] md:top-0 left-0 h-[calc(100vh-140px)] md:h-[calc(100vh-80px)] 
          w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 
          flex flex-col shrink-0 z-50 transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
        >
          <div className="hidden md:block p-6 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Panel de Gestión</h2>
            <p className="text-xs text-slate-500 mt-1">
              {isAdmin ? 'Administrador' : 'Staff Eventos'}
            </p>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {/* CORREGIDO: to="/staff" */}
            <NavLink to={basePath} end className={getLinkClass} onClick={handleLinkClick}>
              <HomeIcon size={20} /> Resumen
            </NavLink>

            {isAdmin && (
              <NavLink to="/admin" className={getLinkClass} onClick={handleLinkClick}>
                <Calendar size={20} /> Gestionar Eventos
              </NavLink>
            )}

            {(isStaff || isAdmin) && (
              /* CORREGIDO: to="/staff/scanner" */
              <NavLink
                to={`${basePath}/scanner`}
                className={getLinkClass}
                onClick={handleLinkClick}
              >
                <ScanLine size={20} /> Escáner QR
              </NavLink>
            )}

            {isAdmin && (
              <NavLink to="/admin/config" className={getLinkClass} onClick={handleLinkClick}>
                <Settings size={20} /> Configuración
              </NavLink>
            )}
          </nav>

          <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2 bg-white dark:bg-slate-900">
            <Link
              to="/perfil"
              onClick={handleLinkClick}
              className="flex items-center gap-3 px-4 py-3 w-full text-slate-600 dark:text-slate-400 hover:text-[#00A651] hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg font-medium transition-colors"
            >
              <ExternalLink size={20} /> Mi Cuenta
            </Link>

            <button
              onClick={() => {
                logout();
                handleLinkClick();
              }}
              className="flex items-center gap-3 px-4 py-3 w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg font-medium transition-colors cursor-pointer"
            >
              <LogOut size={20} /> Cerrar Sesión
            </button>
          </div>
        </aside>

        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        <main className="flex-1 overflow-y-auto h-[calc(100vh-140px)] md:h-[calc(100vh-80px)] p-4 md:p-8 bg-slate-50 dark:bg-slate-950 w-full">
          <div className="md:hidden mb-6">
            {/* CORREGIDO: Comprobación de ruta y redirección a /staff */}
            {location.pathname !== basePath && (
              <button
                onClick={() => navigate(basePath)}
                className="flex items-center text-slate-500 hover:text-[#00A651] transition-colors"
              >
                <ArrowLeft className="mr-2" size={20} /> Volver al menú
              </button>
            )}
          </div>
          <div className="animate-in fade-in zoom-in-95 duration-300">
            <Outlet />
          </div>
        </main>
      </div>

      {(isStaff || isAdmin) && <QrScannerFAB />}
    </div>
  );
}
