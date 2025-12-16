import { Link } from 'react-router-dom';
import { Heart, Instagram, Facebook, Twitter } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8 font-['Arimo']">
      <div className="container mx-auto px-4">
        {/* Grid Principal de 4 Columnas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Columna 1: Información */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Heart className="text-[#00A651] fill-current" size={20} /> Fundación Cudeca
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Cuidamos al final de la vida. Añadimos vida a los días. Tu ayuda hace posible nuestra
              labor asistencial gratuita.
            </p>
          </div>

          {/* Columna 2: Enlaces Rápidos */}
          <div className="space-y-4">
            <h4 className="font-bold text-slate-900 dark:text-white">Enlaces Rápidos</h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <a
                  href="https://www.cudeca.org/quienes-somos/nuestra-historia/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#00A651] transition-colors inline-flex items-center gap-1"
                >
                  Sobre Nosotros
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                  </svg>
                </a>
              </li>
              <li>
                <Link to="/eventos" className="hover:text-[#00A651] transition-colors">
                  Eventos Solidarios
                </Link>
              </li>
              <li>
                <a
                  href="https://www.cudeca.org/como-puedes-ayudarnos/tiendas-beneficas-cudeca/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#00A651] transition-colors inline-flex items-center gap-1"
                >
                  Tiendas Benéficas
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                  </svg>
                </a>
              </li>
              <li>
                <a
                  href="https://www.cudeca.org/como-puedes-ayudarnos/hazte-voluntario/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#00A651] transition-colors inline-flex items-center gap-1"
                >
                  Hazte Voluntario
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                  </svg>
                </a>
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

          {/* Columna 4: Redes Sociales */}
          <div className="space-y-4">
            <h4 className="font-bold text-slate-900 dark:text-white">Síguenos</h4>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/Cudeca/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="p-2 rounded-full bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-[#00A651] hover:text-white dark:hover:bg-[#00A651] dark:hover:text-white transition-all duration-300"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://www.instagram.com/voluntariadocudeca/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="p-2 rounded-full bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-[#00A651] hover:text-white dark:hover:bg-[#00A651] dark:hover:text-white transition-all duration-300"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://x.com/cudeca"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter/X"
                className="p-2 rounded-full bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-[#00A651] hover:text-white dark:hover:bg-[#00A651] dark:hover:text-white transition-all duration-300"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 text-center">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Fundación Cudeca. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};
