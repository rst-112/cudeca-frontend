import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, LayoutDashboard, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './Button';
import logoLight from '../../assets/ImagenLogoCudecaLigth.png';
import logoDark from '../../assets/ImagenLogoCudecaDark.png';

export const Navbar = () => {
  const { isAuthenticated, user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Verificamos si tiene acceso al Dashboard (Backoffice)
  const canAccessDashboard = user?.roles?.some((r) =>
    ['ADMINISTRADOR', 'PERSONAL_EVENTO'].includes(r),
  );

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo */}
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

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className="text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-[#00A651] transition-colors"
          >
            Inicio
          </Link>
          <Link
            to="/eventos"
            className="text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-[#00A651] transition-colors"
          >
            Eventos
          </Link>
          <Link
            to="/donar"
            className="text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-[#00A651] transition-colors"
          >
            Donar
          </Link>
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              {/* Botón Exclusivo Staff/Admin */}
              {canAccessDashboard && (
                <Button
                  asChild
                  variant="outline"
                  className="border-amber-500 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                >
                  <Link to="/dashboard">
                    <LayoutDashboard size={16} className="mr-2" /> Panel Gestión
                  </Link>
                </Button>
              )}

              {/* Botón Mi Perfil (Para todos) */}
              <Button
                asChild
                variant="default"
                className="bg-[#00A651] hover:bg-[#008a43] shadow-md"
              >
                <Link to="/perfil">
                  <User size={16} className="mr-2" /> Hola, {user?.nombre?.split(' ')[0]}
                </Link>
              </Button>
            </div>
          ) : (
            <>
              <Button asChild variant="outline">
                <Link to="/login">Iniciar sesión</Link>
              </Button>
              <Button asChild variant="default" className="bg-[#00A651] hover:bg-[#008a43]">
                <Link to="/registro">Regístrate</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 space-y-4 animate-in slide-in-from-top-5">
          <Link
            to="/"
            className="block px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200"
            onClick={() => setIsMenuOpen(false)}
          >
            Inicio
          </Link>
          <Link
            to="/eventos"
            className="block px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200"
            onClick={() => setIsMenuOpen(false)}
          >
            Eventos
          </Link>

          <div className="flex flex-col gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center px-4">
              <span className="text-sm text-slate-500">Tema</span>
              <ThemeToggle />
            </div>

            {isAuthenticated ? (
              <>
                {canAccessDashboard && (
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-amber-500 text-amber-600"
                  >
                    <Link to="/dashboard">Panel de Gestión</Link>
                  </Button>
                )}
                <Button asChild className="w-full bg-[#00A651]">
                  <Link to="/perfil">Mi Perfil</Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/login">Iniciar sesión</Link>
                </Button>
                <Button asChild className="w-full bg-[#00A651]">
                  <Link to="/registro">Regístrate</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
