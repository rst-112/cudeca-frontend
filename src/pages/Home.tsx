import { Link } from 'react-router-dom';
import campaignImage from '../assets/FotoLogin.png';
import { ThemeToggle } from '../components/ui/ThemeToggle';

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Navigation */}
      <nav className="absolute top-0 w-full z-50 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-[#00A651] flex items-center justify-center text-white font-bold shadow-sm">
            C
          </div>
          <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight font-['Arimo']">
            cudeca <span className="font-light">FUNDACIÓN</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link
            to="/login"
            className="px-4 py-2 text-slate-700 dark:text-slate-200 font-medium hover:text-[#00A651] dark:hover:text-[#00A651] transition-colors font-['Arimo']"
          >
            Iniciar sesión
          </Link>
          <Link
            to="/registro"
            className="px-4 py-2 bg-[#00A651] hover:bg-[#008a43] text-white font-bold rounded-lg transition-all shadow-sm hover:shadow-md font-['Arimo']"
          >
            Regístrate
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img src={campaignImage} alt="Cudeca Campaign" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 dark:bg-black/60" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg font-['Arimo']">
            Eres pieza clave
          </h1>
          <p className="text-xl md:text-2xl text-slate-100 mb-8 max-w-2xl mx-auto drop-shadow-md font-['Arimo']">
            Cada cuidado cuenta. Cada pieza suma. Únete a nosotros para hacer la diferencia en la
            vida de quienes más lo necesitan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/registro"
              className="px-8 py-4 bg-[#00A651] hover:bg-[#008a43] text-white text-lg font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105 font-['Arimo']"
            >
              Únete ahora
            </Link>
            <Link
              to="/about"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white text-lg font-bold rounded-xl transition-all border border-white/30 hover:border-white/50 font-['Arimo']"
            >
              Saber más
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-50 dark:bg-slate-900 py-8 text-center text-slate-500 dark:text-slate-400 text-sm font-['Arimo']">
        <p>© {new Date().getFullYear()} Fundación Cudeca. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
