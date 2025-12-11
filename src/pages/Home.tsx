import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import campaignImage from '../assets/FotoLogin.png';
import { ArrowRight, Heart, Calendar, Users, Sparkles, TestTube } from 'lucide-react';
import { EventCarousel } from '../components/EventCarousel';

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* === HERO SECTION === */}
      <section className="relative h-[calc(100vh-5rem)] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Fondo con Imagen y Gradiente */}
        <div className="absolute inset-0 z-0">
          <img
            src={campaignImage}
            alt="Campaña Cudeca - Eres pieza clave"
            className="w-full h-full object-cover object-top animate-in fade-in duration-1000"
          />
          {/* Gradiente mejorado para legibilidad */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/20 dark:from-black/90 dark:via-black/70" />
        </div>

        {/* Contenido Hero */}
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-3xl text-white space-y-8 animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-150">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 border border-green-400/50 backdrop-blur-sm text-green-300 font-semibold text-sm mb-2">
              <Sparkles size={16} />
              <span>Campaña 2025</span>
            </div>

            {/* Título simplificado */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold leading-tight tracking-tighter">
              Eres pieza <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
                clave
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-100 font-light leading-relaxed max-w-2xl">
              Cada cuidado cuenta. Cada pieza suma. Únete a nosotros para hacer la diferencia en la
              vida de quienes más lo necesitan.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                asChild
                size="lg"
                className="text-lg px-8 h-14 bg-green-600 hover:bg-green-500 border-none shadow-lg hover:shadow-green-500/20 hover:scale-105 transition-all duration-300"
              >
                <Link to="/registro" className="flex items-center gap-2"> {/* Añadido flex items-center gap-2 */}
                  Únete ahora <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-lg px-8 h-14 bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-sm hover:border-white/50 transition-all duration-300"
              >
                <Link to="/about">Saber más</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* === SECCIÓN INFORMATIVA === */}
      <section className="py-24 bg-white dark:bg-slate-950 relative overflow-hidden">
        {/* Decoración de fondo */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent" />

        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              ¿Cómo puedes ayudar?
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Tu compromiso es vital para mantener nuestra "forma especial de cuidar".
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="group p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all duration-300 hover:-translate-y-1">
              <div className="h-14 w-14 rounded-2xl bg-green-100 dark:bg-green-900/20 flex items-center justify-center text-green-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                <Heart size={28} className="fill-current" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                Hazte Socio
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                Tu apoyo constante nos permite planificar y mantener nuestros cuidados paliativos
                gratuitos.
              </p>
              <Link
                to="/registro"
                className="inline-flex items-center text-green-600 font-semibold hover:underline underline-offset-4"
              >
                Colaborar <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>

            {/* Card 2 */}
            <div className="group p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all duration-300 hover:-translate-y-1">
              <div className="h-14 w-14 rounded-2xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                <Calendar size={28} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                Eventos Solidarios
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                Participa en nuestros conciertos, cenas y marchas solidarias. Diviértete mientras
                ayudas.
              </p>
              <Link
                to="/eventos"
                className="inline-flex items-center text-blue-600 font-semibold hover:underline underline-offset-4"
              >
                Ver agenda <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>

            {/* Card 3 */}
            <div className="group p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all duration-300 hover:-translate-y-1">
              <div className="h-14 w-14 rounded-2xl bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users size={28} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                Voluntariado
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                Dona tu tiempo y talento. Hay muchas formas de colaborar en nuestras tiendas y
                eventos.
              </p>
              <Link
                to="/voluntariado"
                className="inline-flex items-center text-purple-600 font-semibold hover:underline underline-offset-4"
              >
                Infórmate <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* === SECCIÓN CARRUSEL DE EVENTOS === */}
      <section className="py-24 bg-slate-100 dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Próximos Eventos
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              ¡No te pierdas nuestras próximas actividades! Tu participación es fundamental.
            </p>
          </div>
          <EventCarousel />
        </div>
      </section>

      {/* === SANDBOX DEV (TEMPORAL) === */}
      {import.meta.env.DEV && (
        <section className="py-8 bg-amber-50 dark:bg-amber-950/20 border-y border-amber-200 dark:border-amber-900">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TestTube className="text-amber-600" size={24} />
                <div>
                  <h3 className="font-bold text-amber-900 dark:text-amber-400">Modo Desarrollo</h3>
                  <p className="text-sm text-amber-700 dark:text-amber-500">
                    Sistema de Mapa de Asientos Interactivo (Viewer + Editor)
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="gap-2 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30"
                >
                  <Link to="/dev/mapa">Viewer</Link>
                </Button>
                <Button
                  asChild
                  variant="default"
                  size="sm"
                  className="gap-2 bg-amber-600 hover:bg-amber-700 text-white"
                >
                  <Link to="/dev/mapa/editor">
                    Editor
                    <ArrowRight size={16} />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
