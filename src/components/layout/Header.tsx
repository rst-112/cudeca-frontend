import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User, ShoppingCart } from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Button } from '../ui/Button';
import logoLight from '../../assets/ImagenLogoCudecaLigth.png';
import logoDark from '../../assets/ImagenLogoCudecaDark.png';

interface HeaderProps {
  isLoggedIn: boolean;
}

export const Header = ({ isLoggedIn }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const inicioPath = isLoggedIn ? '/home-logeado' : '/home-invitado';
  const eventosPath = isLoggedIn ? '/eventos-logeado' : '/eventos';

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo Dinámico */}
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

        {/* Navegación Desktop */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to={inicioPath}
            className="text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-[#00A651] dark:hover:text-[#00A651] transition-colors"
          >
            Inicio
          </Link>
          <Link
            to={eventosPath}
            className="text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-[#00A651] dark:hover:text-[#00A651] transition-colors"
          >
            Eventos
          </Link>
          <Link
            to="/donar"
            className="text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-[#00A651] dark:hover:text-[#00A651] transition-colors"
          >
            Donar
          </Link>
        </div>

        {/* Acciones (Auth + Tema) */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          {isLoggedIn ? (
            <>
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  3
                </span>
              </Button>
              <Button
                asChild
                variant="default"
                className="shadow-md hover:shadow-lg bg-[#00A651] hover:bg-[#008a43]"
              >
                <Link to="/mi-perfil">
                  <User className="mr-2 h-4 w-4" />
                  Mi Perfil
                </Link>
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="outline">
                <Link to="/login">Iniciar sesión</Link>
              </Button>
              <Button
                asChild
                variant="default"
                className="shadow-md hover:shadow-lg bg-[#00A651] hover:bg-[#008a43]"
              >
                <Link to="/registro">Regístrate</Link>
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
            to={inicioPath}
            className="block px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-md"
            onClick={() => setIsMenuOpen(false)}
          >
            Inicio
          </Link>
          <Link
            to={eventosPath}
            className="block px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-md"
            onClick={() => setIsMenuOpen(false)}
          >
            Eventos
          </Link>
          <Link
            to="/donar"
            className="block px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-md"
            onClick={() => setIsMenuOpen(false)}
          >
            Donar
          </Link>
          <div className="flex flex-col gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center px-4">
              <span className="text-sm text-slate-500">Tema</span>
              <ThemeToggle />
            </div>
            {isLoggedIn ? (
              <>
                <Button asChild className="w-full bg-[#00A651]">
                  <Link to="/mi-perfil">Mi Perfil</Link>
                </Button>
                <Button variant="outline" className="w-full">
                  Cerrar Sesión
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
