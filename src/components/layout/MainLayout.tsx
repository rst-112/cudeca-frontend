import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Menu, X, Heart, Instagram, Facebook, Twitter } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Button } from '../ui/Button';
import logoLight from '../../assets/ImagenLogoCudecaLigth.png';
import logoDark from '../../assets/ImagenLogoCudecaDark.png';

const MainLayout = () => {
  const { isAuthenticated, user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300 font-['Arimo']">
      {/* Navbar Sticky con efecto blur */}
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
            {isAuthenticated ? (
              <Button asChild variant="default" className="shadow-md hover:shadow-lg">
                <Link to="/dashboard">Hola, {user?.nombre?.split(' ')[0]}</Link>
              </Button>
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
            <div className="flex flex-col gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-center px-4">
                <span className="text-sm text-slate-500">Tema</span>
                <ThemeToggle />
              </div>
              {isAuthenticated ? (
                <Button asChild className="w-full bg-[#00A651]">
                  <Link to="/dashboard">Ir al Dashboard</Link>
                </Button>
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

      {/* Contenido Principal */}
      <main className="grow">
        <Outlet />
      </main>

      {/* Footer Mejorado */}
      <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Columna 1: Info */}
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <Heart className="text-[#00A651] fill-current" size={20} /> Fundación Cudeca
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Cuidamos al final de la vida. Añadimos vida a los días. Tu ayuda hace posible
                nuestra labor asistencial gratuita.
              </p>
            </div>

            {/* Columna 2: Enlaces */}
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 dark:text-white">Enlaces Rápidos</h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>
                  <Link to="/about" className="hover:text-[#00A651] transition-colors">
                    Sobre Nosotros
                  </Link>
                </li>
                <li>
                  <Link to="/eventos" className="hover:text-[#00A651] transition-colors">
                    Eventos Solidarios
                  </Link>
                </li>
                <li>
                  <Link to="/tiendas" className="hover:text-[#00A651] transition-colors">
                    Tiendas Benéficas
                  </Link>
                </li>
              </ul>
            </div>

            {/* Columna 3: Legal */}
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 dark:text-white">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>
                  <Link to="/privacidad" className="hover:text-[#00A651] transition-colors">
                    Política de Privacidad
                  </Link>
                </li>
                <li>
                  <Link to="/cookies" className="hover:text-[#00A651] transition-colors">
                    Política de Cookies
                  </Link>
                </li>
                <li>
                  <Link to="/terminos" className="hover:text-[#00A651] transition-colors">
                    Términos de Uso
                  </Link>
                </li>
              </ul>
            </div>

            {/* Columna 4: Social */}
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 dark:text-white">Síguenos</h4>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="p-2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-[#00A651] hover:text-white transition-all"
                >
                  <Facebook size={20} />
                </a>
                <a
                  href="#"
                  className="p-2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-[#00A651] hover:text-white transition-all"
                >
                  <Instagram size={20} />
                </a>
                <a
                  href="#"
                  className="p-2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-[#00A651] hover:text-white transition-all"
                >
                  <Twitter size={20} />
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-200 dark:border-slate-800 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-500">
              © {new Date().getFullYear()} Fundación Cudeca. Todos los derechos reservados.
              Desarrollado con ❤️ por Sapitos Team.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
