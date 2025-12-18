import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User, LayoutDashboard, ShoppingCart, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Button } from '../ui/Button';
import logoLight from '../../assets/ImagenLogoCudecaLigth.png';
import logoDark from '../../assets/ImagenLogoCudecaDark.png';

interface HeaderProps {
  isLoggedIn?: boolean;
}

export const Header = ({ isLoggedIn }: HeaderProps) => {
  const { isAuthenticated: authState, user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Determinar estado de autenticación (prop forzada o contexto real)
  const authenticated = isLoggedIn !== undefined ? isLoggedIn : authState;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo - Siempre lleva al inicio unificado */}
        <Link to="/" className="relative h-12 w-40 group transition-transform hover:scale-105">
          <img
            src={logoLight}
            alt="Fundación Cudeca"
            className="absolute inset-0 h-full w-full object-contain transition-opacity duration-300 opacity-100 dark:opacity-0"
          />
          <img
            src={logoDark}
            alt="Fundación Cudeca"
            className="absolute inset-0 h-full w-full object-contain transition-opacity duration-300 opacity-0 dark:opacity-100"
          />
        </Link>

        {/* Navegación Desktop - Enlaces UNIFICADOS */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className="text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-[#00A651] dark:hover:text-[#00A651] transition-colors"
          >
            Inicio
          </Link>
          <Link
            to="/eventos"
            className="text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-[#00A651] dark:hover:text-[#00A651] transition-colors"
          >
            Eventos
          </Link>
        </div>

        {/* Acciones (Auth + Tema) */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />

          {/* Carrito */}
          <Link
            to="/checkout"
            className="relative p-2 text-slate-700 dark:text-slate-200 hover:text-[#00A651] dark:hover:text-[#00A651] transition-colors"
          >
            <ShoppingCart className="h-5 w-5" />
          </Link>

          {authenticated ? (
            <div className="flex items-center gap-2">
              {/* Botón Panel de Gestión (Admin / Staff) */}
              {(user?.roles?.includes('ADMINISTRADOR') ||
                user?.roles?.includes('PERSONAL_EVENTO') ||
                user?.email === 'admin@test.com' ||
                user?.email === 'staff@test.com') && (
                <Button
                  asChild
                  variant="outline"
                  className="gap-2 border-slate-300 dark:border-slate-700"
                >
                  <Link
                    to={
                      user?.roles?.includes('ADMINISTRADOR') || user?.email === 'admin@test.com'
                        ? '/admin'
                        : '/staff'
                    }
                    className="flex items-center gap-2"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Panel Gestión</span>
                  </Link>
                </Button>
              )}

              {/* Perfil de Usuario */}
              <Button
                asChild
                variant="default"
                className="bg-[#00A651] hover:bg-[#008a43] text-white shadow-md hover:shadow-lg"
              >
                <Link to="/perfil" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Hola, {user?.nombre?.split(' ')[0] || 'Usuario'}</span>
                </Link>
              </Button>
            </div>
          ) : (
            <>
              <Button asChild variant="outline" className="gap-2">
                <Link to="/login" className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Iniciar sesión
                </Link>
              </Button>
              <Button
                asChild
                variant="default"
                className="shadow-md hover:shadow-lg bg-[#00A651] hover:bg-[#008a43] gap-2"
              >
                <Link to="/registro" className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Regístrate
                </Link>
              </Button>
            </>
          )}
        </div>

        {/* Botón Menú Móvil */}
        <button
          className="md:hidden p-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Menu"
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Menú Móvil Desplegable */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 space-y-4 animate-in slide-in-from-top-5">
          <Link
            to="/"
            className="block px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-md"
            onClick={() => setIsMenuOpen(false)}
          >
            Inicio
          </Link>
          <Link
            to="/eventos"
            className="block px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-md"
            onClick={() => setIsMenuOpen(false)}
          >
            Eventos
          </Link>
          {/* Enlace móvil al carrito */}
          <Link
            to="/checkout"
            className="block px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-md"
            onClick={() => setIsMenuOpen(false)}
          >
            Carrito
          </Link>

          <div className="flex flex-col gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center px-4">
              <span className="text-sm text-slate-500">Tema</span>
              <ThemeToggle />
            </div>
            {authenticated ? (
              <>
                {(user?.roles?.includes('ADMINISTRADOR') ||
                  user?.roles?.includes('PERSONAL_EVENTO') ||
                  user?.email === 'admin@test.com' ||
                  user?.email === 'staff@test.com') && (
                  <Button asChild variant="outline" className="w-full">
                    <Link
                      to={
                        user?.roles?.includes('ADMINISTRADOR') || user?.email === 'admin@test.com'
                          ? '/admin'
                          : '/staff'
                      }
                      className="flex items-center gap-2"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Panel Gestión
                    </Link>
                  </Button>
                )}
                <Button asChild className="w-full bg-[#00A651]">
                  <Link to="/perfil" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Mi Perfil
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="outline" className="w-full gap-2">
                  <Link to="/login" className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    Iniciar sesión
                  </Link>
                </Button>
                <Button asChild className="w-full bg-[#00A651] gap-2">
                  <Link to="/registro" className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Regístrate
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
