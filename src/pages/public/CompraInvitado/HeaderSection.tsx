import { Link } from 'react-router-dom';
import { ShoppingCart, User, LogOut } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

const navigationItems = [
  { label: 'Inicio', isActive: false, path: '/' },
  { label: 'Eventos', isActive: true, path: '/eventos' },
  { label: 'Contacto', isActive: false, path: '/contacto' },
];

export const HeaderSection = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const cartItemCount = 2;

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="w-full h-20 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-8 h-full flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white font-['Arimo']">
              Fundación Cudeca
            </h1>
          </Link>
        </div>

        {/* Navegación */}
        <nav className="flex items-center gap-8" aria-label="Main navigation">
          {navigationItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`flex flex-col items-center gap-1 pb-1 ${
                item.isActive
                  ? 'font-bold text-slate-900 dark:text-white border-b-2 border-[#00753e]'
                  : 'font-normal text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              } text-base transition-colors`}
              aria-current={item.isActive ? 'page' : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Acciones */}
        <div className="flex items-center gap-4">
          <button
            className="relative p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Carrito de compras, 2 artículos"
          >
            <ShoppingCart className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            <span className="absolute top-1 right-1 w-4 h-4 bg-[#00a651] text-white text-xs rounded-full flex items-center justify-center">
              {cartItemCount}
            </span>
          </button>

          {isAuthenticated ? (
            <>
              <Link
                to="/perfil"
                className="flex items-center gap-2 px-4 py-2 bg-[#00753e] text-white rounded-lg hover:bg-[#005a2e] transition-colors"
              >
                <User size={18} />
                <span className="text-sm font-medium">
                  {user?.nombre?.split(' ')[0] || 'Perfil'}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                aria-label="Cerrar sesión"
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium text-sm"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/registro"
                className="px-4 py-2 bg-[#00a651] text-white rounded-lg hover:bg-[#008a43] transition-colors font-medium text-sm"
              >
                Regístrate
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
