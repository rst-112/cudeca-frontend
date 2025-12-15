import { Link } from 'react-router-dom';
import { Heart, Instagram, Facebook, Twitter } from 'lucide-react';

const Footer = () => {
  return (
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
  );
};

export default Footer;
