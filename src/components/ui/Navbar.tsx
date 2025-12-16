import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, LayoutDashboard, User, ShoppingCart, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './Button';
import logoLight from '../../assets/ImagenLogoCudecaLigth.png';
import logoDark from '../../assets/ImagenLogoCudecaDark.png';

export const Navbar = () => {
  const { isAuthenticated, user } = useAuth();
  const { items, getTotalItems, getTotalPrice, removeItem } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Verificamos si tiene acceso al Dashboard (Backoffice)
  const canAccessDashboard = user?.roles?.some((r) =>
    ['ADMINISTRADOR', 'PERSONAL_EVENTO'].includes(r),
  );

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

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

          {/* Cart Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="relative p-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#00A651] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Cart Dropdown Menu */}
            {isCartOpen && (
              <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    Carrito ({totalItems} {totalItems === 1 ? 'entrada' : 'entradas'})
                  </h3>
                </div>

                {items.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>Tu carrito está vacío</p>
                  </div>
                ) : (
                  <>
                    <div className="max-h-96 overflow-y-auto">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="p-4 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                        >
                          <div className="flex gap-3">
                            {item.eventoImagen && (
                              <img
                                src={item.eventoImagen}
                                alt={item.eventoNombre}
                                className="w-16 h-16 rounded object-cover"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                                {item.eventoNombre}
                              </h4>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {item.tipoEntradaNombre}
                                {item.asientoEtiqueta && ` • ${item.asientoEtiqueta}`}
                              </p>
                              <p className="text-sm font-bold text-[#00A651] mt-1">
                                {item.precio.toFixed(2)}€ x {item.cantidad}
                              </p>
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                      <div className="flex justify-between mb-4">
                        <span className="font-semibold text-slate-900 dark:text-white">Total</span>
                        <span className="text-xl font-bold text-[#00A651]">
                          {totalPrice.toFixed(2)}€
                        </span>
                      </div>
                      <Button
                        asChild
                        className="w-full bg-[#00A651] hover:bg-[#008a43] h-12"
                        onClick={() => setIsCartOpen(false)}
                      >
                        <Link to="/checkout">Ir al Checkout</Link>
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

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
