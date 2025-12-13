import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import campaignImage from '../assets/FotoLogin.png';
import { ArrowRight, Heart, Calendar, Users, Sparkles, TestTube } from 'lucide-react';
import { EventCarousel } from '../components/EventCarousel';

export default function Home() {
  const navigate = useNavigate();

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

      {/* === ACCESOS RÁPIDOS (Todas las herramientas disponibles) === */}
      <section className="py-16 bg-slate-100 dark:bg-slate-900 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 font-['Arimo']">
              Accesos Rápidos
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Herramientas administrativas y de gestión
            </p>
          </div>

          <div className="space-y-3 max-w-4xl mx-auto">
            {/* Admin Dashboard */}
            <div className="flex items-start justify-between p-4 border-l-4 border-l-[#00A651] bg-white dark:bg-slate-800 rounded">
              <div className="flex flex-col gap-1">
                <h3 className="text-base font-bold text-[#00A651] dark:text-[#00d66a]">
                  Admin Dashboard
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-['Arimo']">
                  Gestión completa de eventos, usuarios y administración
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="px-4 py-2 bg-[#00A651] hover:bg-[#008a43] text-white font-bold rounded transition-all duration-200 hover:shadow-lg text-sm whitespace-nowrap ml-4"
                title="Ir al admin dashboard"
              >
                Ver Admin →
              </button>
            </div>

            {/* Crear Evento */}
            <div className="flex items-start justify-between p-4 border-l-4 border-l-green-600 bg-white dark:bg-slate-800 rounded">
              <div className="flex flex-col gap-1">
                <h3 className="text-base font-bold text-green-600 dark:text-green-400">
                  Crear Evento
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-['Arimo']">
                  Formulario para crear nuevos eventos
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/creacion-eventos')}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded transition-all duration-200 hover:shadow-lg text-sm whitespace-nowrap ml-4"
                title="Ir a creación de eventos"
              >
                Crear →
              </button>
            </div>

            {/* Editar Entrada */}
            <div className="flex items-start justify-between p-4 border-l-4 border-l-cyan-600 bg-white dark:bg-slate-800 rounded">
              <div className="flex flex-col gap-1">
                <h3 className="text-base font-bold text-cyan-600 dark:text-cyan-400">
                  Editar Entrada
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-['Arimo']">
                  Edición y gestión de entradas individuales
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/editar-entrada')}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded transition-all duration-200 hover:shadow-lg text-sm whitespace-nowrap ml-4"
                title="Ir a editar entrada"
              >
                Editar →
              </button>
            </div>

            {/* Editor de Asientos */}
            <div className="flex items-start justify-between p-4 border-l-4 border-l-orange-500 bg-white dark:bg-slate-800 rounded">
              <div className="flex flex-col gap-1">
                <h3 className="text-base font-bold text-orange-600 dark:text-orange-400">
                  Editor de Asientos
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-['Arimo']">
                  Editar mapa de asientos interactivo
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/dev/mapa/editor')}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded transition-all duration-200 hover:shadow-lg text-sm whitespace-nowrap ml-4"
                title="Editar mapa de asientos"
              >
                Ver Editor →
              </button>
            </div>

            {/* Home Evento Logeado */}
            <div className="flex items-start justify-between p-4 border-l-4 border-l-pink-500 bg-white dark:bg-slate-800 rounded">
              <div className="flex flex-col gap-1">
                <h3 className="text-base font-bold text-pink-600 dark:text-pink-400">
                  Home Evento Logeado
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-['Arimo']">
                  Página principal de eventos para usuarios registrados
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/home-logeado')}
                className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded transition-all duration-200 hover:shadow-lg text-sm whitespace-nowrap ml-4"
                title="Ir a home evento logeado"
              >
                Ver →
              </button>
            </div>

            {/* Home Invitado */}
            <div className="flex items-start justify-between p-4 border-l-4 border-l-rose-500 bg-white dark:bg-slate-800 rounded">
              <div className="flex flex-col gap-1">
                <h3 className="text-base font-bold text-rose-600 dark:text-rose-400">
                  Home Invitado
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-['Arimo']">
                  Página principal de eventos para usuarios no registrados
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/home-invitado')}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded transition-all duration-200 hover:shadow-lg text-sm whitespace-nowrap ml-4"
                title="Ir a home invitado"
              >
                Ver →
              </button>
            </div>

            {/* Info Evento Invitado */}
            <div className="flex items-start justify-between p-4 border-l-4 border-l-violet-600 bg-white dark:bg-slate-800 rounded">
              <div className="flex flex-col gap-1">
                <h3 className="text-base font-bold text-violet-600 dark:text-violet-400">
                  Info Evento Invitado
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-['Arimo']">
                  Página de información y venta de entradas para invitados
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/evento-invitado')}
                className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded transition-all duration-200 hover:shadow-lg text-sm whitespace-nowrap ml-4"
                title="Ir a info evento invitado"
              >
                Ver →
              </button>
            </div>

            {/* Info Evento Logeado */}
            <div className="flex items-start justify-between p-4 border-l-4 border-l-indigo-500 bg-white dark:bg-slate-800 rounded">
              <div className="flex flex-col gap-1">
                <h3 className="text-base font-bold text-indigo-600 dark:text-indigo-400">
                  Info Evento Logeado
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-['Arimo']">
                  Página de información y venta de entradas para usuarios logeados
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/info-evento-logeado')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded transition-all duration-200 hover:shadow-lg text-sm whitespace-nowrap ml-4"
                title="Ir a info evento logeado"
              >
                Ver →
              </button>
            </div>

            {/* Mapa de Asientos */}
            <div className="flex items-start justify-between p-4 border-l-4 border-l-purple-500 bg-white dark:bg-slate-800 rounded">
              <div className="flex flex-col gap-1">
                <h3 className="text-base font-bold text-purple-600 dark:text-purple-400">
                  Mapa de Asientos
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-['Arimo']">
                  Visualizar mapa de asientos
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/dev/mapa')}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded transition-all duration-200 hover:shadow-lg text-sm whitespace-nowrap ml-4"
                title="Ver mapa de asientos"
              >
                Ver Mapa →
              </button>
            </div>

            {/* Tipos de Entrada */}
            <div className="flex items-start justify-between p-4 border-l-4 border-l-blue-600 bg-white dark:bg-slate-800 rounded">
              <div className="flex flex-col gap-1">
                <h3 className="text-base font-bold text-blue-600 dark:text-blue-400">
                  Tipos de Entrada
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-['Arimo']">
                  Gestión de entradas y tipos de tickets
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/tipos-entrada')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded transition-all duration-200 hover:shadow-lg text-sm whitespace-nowrap ml-4"
                title="Ir a tipos de entrada"
              >
                Entradas →
              </button>
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
