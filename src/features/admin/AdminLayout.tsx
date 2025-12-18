import { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LogOut,
  Home as HomeIcon,
  ScanLine,
  ArrowLeft,
  Settings,
  Menu,
  X,
  Grid3x3,
  Users,
} from 'lucide-react';
import { Header } from '../../components/layout/Header';

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getLinkClass = ({ isActive }: { isActive: boolean }) => {
    const base =
      'flex items-center gap-3 px-4 py-3 w-full rounded-lg font-medium transition-colors cursor-pointer';
    const active = 'text-[#00A651] bg-[#00A651]/10 dark:bg-[#00A651]/20';
    const inactive =
      'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800';
    return `${base} ${isActive ? active : inactive}`;
  };

  // Estilo para items deshabilitados
  const disabledLinkClass =
    'flex items-center gap-3 px-4 py-3 w-full rounded-lg font-medium text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-60';

  const handleLinkClick = () => setIsMobileMenuOpen(false);
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 font-['Arimo']">
      <div className="sticky top-0 z-50">
        <Header isLoggedIn={true} />
      </div>

      <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between sticky top-20 z-40">
        <h2 className="font-bold text-slate-900 dark:text-white">Admin Panel</h2>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        <aside
          className={`fixed md:relative top-[140px] md:top-0 left-0 h-[calc(100vh-140px)] md:h-[calc(100vh-80px)] w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0 z-50 transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
        >
          <div className="hidden md:block p-6 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Administración</h2>
            <p className="text-xs text-slate-500 mt-1">Gestión Global</p>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <NavLink to="/admin" end className={getLinkClass} onClick={handleLinkClick}>
              <HomeIcon size={20} /> Dashboard
            </NavLink>

            <NavLink to="/admin/asientos" className={getLinkClass} onClick={handleLinkClick}>
              <Grid3x3 size={20} /> Mapas de Asientos
            </NavLink>

            <NavLink to="/admin/scanner" className={getLinkClass} onClick={handleLinkClick}>
              <ScanLine size={20} /> Escáner QR
            </NavLink>

            {/* Opciones Deshabilitadas (Visualmente claras) */}
            <div className={disabledLinkClass}>
              <Users size={20} />
              <span className="flex-1">Usuarios</span>
              <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                Próx
              </span>
            </div>

            <div className={disabledLinkClass}>
              <Settings size={20} />
              <span className="flex-1">Configuración</span>
              <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                Próx
              </span>
            </div>
          </nav>

          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <button
              onClick={handleLogout}
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
            {location.pathname !== '/admin' && (
              <button
                onClick={() => navigate('/admin')}
                className="flex items-center text-slate-500 hover:text-[#00A651] transition-colors"
              >
                <ArrowLeft className="mr-2" size={20} /> Volver al panel
              </button>
            )}
          </div>
          <div className="animate-in fade-in zoom-in-95 duration-300 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
