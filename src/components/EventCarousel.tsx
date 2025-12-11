import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { Button } from './ui/Button';

// Datos mock para el carrusel con colores planos
const CAROUSEL_EVENTS = [
  {
    id: 1,
    title: 'Gala Benéfica de Primavera',
    date: '15 de Abril, 2025',
    location: 'Jardines del Botánico',
    color: 'bg-emerald-500',
    description: 'Una noche mágica bajo las estrellas para apoyar nuestros cuidados paliativos.'
  },
  {
    id: 2,
    title: 'Carrera Solidaria "Marcha por la Vida"',
    date: '22 de Mayo, 2025',
    location: 'Paseo Marítimo de Málaga',
    color: 'bg-blue-500',
    description: 'Corre, camina o simplemente acompáñanos en este evento deportivo familiar.'
  },
  {
    id: 3,
    title: 'Concierto Acústico: Voces por Cudeca',
    date: '10 de Junio, 2025',
    location: 'Teatro Cervantes',
    color: 'bg-purple-500',
    description: 'Artistas locales se unen para ofrecer un espectáculo inolvidable.'
  },
  {
    id: 4,
    title: 'Mercadillo Vintage Solidario',
    date: 'Todos los sábados de Julio',
    location: 'Centro Cudeca Benalmádena',
    color: 'bg-orange-500',
    description: 'Encuentra tesoros únicos y colabora con nuestra causa.'
  }
];

export function EventCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isAutoPlaying) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % CAROUSEL_EVENTS.length);
      }, 5000); // Cambia cada 5 segundos
    }

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % CAROUSEL_EVENTS.length);
    setIsAutoPlaying(false); // Pausar auto-play al interactuar
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + CAROUSEL_EVENTS.length) % CAROUSEL_EVENTS.length);
    setIsAutoPlaying(false); // Pausar auto-play al interactuar
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto overflow-hidden rounded-2xl shadow-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
      {/* Contenedor de Slides */}
      <div
        className="flex transition-transform duration-500 ease-out h-[400px] md:h-[500px]"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {CAROUSEL_EVENTS.map((event) => (
          <div key={event.id} className="w-full flex-shrink-0 flex flex-col md:flex-row h-full">
            {/* Imagen (Color Plano) */}
            <div className={`w-full md:w-1/2 h-48 md:h-full ${event.color} flex items-center justify-center p-8`}>
              <div className="text-white/20">
                <Calendar size={120} />
              </div>
            </div>

            {/* Contenido */}
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white dark:bg-slate-800">
              <div className="inline-flex items-center gap-2 text-green-600 font-semibold mb-4">
                <Calendar size={18} />
                <span>{event.date}</span>
              </div>

              <h3 className="text-2xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 leading-tight tracking-tight">
                {event.title}
              </h3>

              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-6">
                <MapPin size={18} />
                <span>{event.location}</span>
              </div>

              <p className="text-slate-600 dark:text-slate-300 mb-8 text-lg leading-relaxed">
                {event.description}
              </p>

              <Button asChild size="lg" className="self-start bg-green-600 hover:bg-green-700 text-white">
                <Link to={`/eventos`} className="flex items-center gap-2">
                  Ver Detalles <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Controles de Navegación (Flechas) - Centrado puro con Flexbox */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/80 dark:bg-black/50 hover:bg-white dark:hover:bg-black/70 text-slate-800 dark:text-white shadow-lg transition-all z-10 p-0"
        aria-label="Anterior evento"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/80 dark:bg-black/50 hover:bg-white dark:hover:bg-black/70 text-slate-800 dark:text-white shadow-lg transition-all z-10 p-0"
        aria-label="Siguiente evento"
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicadores (Puntos) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {CAROUSEL_EVENTS.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              currentIndex === index
                ? 'bg-green-600 w-8'
                : 'bg-slate-300 dark:bg-slate-600 hover:bg-green-400'
            }`}
            aria-label={`Ir a diapositiva ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
