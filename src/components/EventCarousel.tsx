import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { getEventos } from '../services/eventos.service';
import type { Evento } from '../types/api.types';

export function EventCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  // Cambiar a un Set de IDs para rastrear errores de imagen por evento
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  const colors = [
    'from-emerald-500 to-emerald-700',
    'from-blue-500 to-blue-700',
    'from-purple-500 to-purple-700',
    'from-orange-500 to-orange-700',
    'from-pink-500 to-pink-700',
  ];
  const getErrorColor = (id: number) => colors[id % colors.length];

  // Cargar eventos del backend
  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const data = await getEventos();
        // Filtrar solo eventos PUBLICADOS, ordenar por fecha (más recientes primero) y tomar los primeros 5
        const eventosPublicados = data
          .filter((e) => e.estado === 'PUBLICADO')
          .sort((a, b) => b.id - a.id)
          .slice(0, 5); // Primeros 5 (más recientemente agregados)
        setEventos(eventosPublicados);
      } catch (error) {
        console.error('Error al cargar eventos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventos();
  }, []);

  // Auto-play functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isAutoPlaying && eventos.length > 0) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % eventos.length);
      }, 5000);
    }

    return () => clearInterval(interval);
  }, [isAutoPlaying, eventos.length]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % eventos.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + eventos.length) % eventos.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  // Función para marcar un evento con error de imagen
  const handleImageError = (eventId: number) => {
    setImageErrors((prev) => new Set(prev).add(eventId));
  };

  if (loading) {
    return (
      <div className="relative w-full max-w-7xl mx-auto rounded-2xl bg-white dark:bg-slate-800 h-[400px] md:h-[500px] flex items-center justify-center">
        <p className="text-slate-600 dark:text-slate-400">Cargando eventos...</p>
      </div>
    );
  }

  if (eventos.length === 0) {
    return (
      <div className="relative w-full max-w-7xl mx-auto rounded-2xl bg-white dark:bg-slate-800 h-[400px] md:h-[500px] flex items-center justify-center">
        <p className="text-slate-600 dark:text-slate-400">No hay eventos publicados disponibles</p>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-7xl mx-auto overflow-hidden rounded-2xl bg-white dark:bg-slate-800 shadow-2xl dark:shadow-none border border-slate-100 dark:border-slate-800">
      {/* Contenedor de Slides */}
      <div
        className="flex transition-transform duration-500 ease-out h-[500px] md:h-[600px]"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {eventos.map((event) => (
          <div key={event.id} className="w-full shrink-0 flex flex-col md:flex-row h-full">
            {/* Imagen */}
            <div className="w-full md:w-3/5 h-48 md:h-full relative overflow-hidden group">
              {event.imagenUrl && !imageErrors.has(event.id) ? (
                <img
                  src={event.imagenUrl}
                  alt={event.nombre}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={() => handleImageError(event.id)}
                />
              ) : (
                <div
                  className={`w-full h-full bg-linear-to-br ${getErrorColor(event.id)} flex items-center justify-center`}
                >
                  <Calendar size={120} className="text-white/20" />
                </div>
              )}
              {/* Overlay gradiente sutil */}
              <div className="absolute inset-0 bg-linear-to-r from-black/10 to-transparent pointer-events-none" />
            </div>

            {/* Contenido */}
            <div className="w-full md:w-2/5 p-8 md:p-12 flex flex-col justify-center bg-white dark:bg-slate-900 border-l border-slate-100 dark:border-slate-800 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full text-sm font-semibold mb-6 w-fit">
                <Calendar size={16} />
                <span>
                  {new Date(event.fechaInicio).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>

              <h3 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 leading-tight font-heading">
                {event.nombre}
              </h3>

              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-6 text-lg">
                <MapPin size={20} className="text-slate-400" />
                <span>{event.lugar}</span>
              </div>

              {event.descripcion && (
                <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed line-clamp-3 md:line-clamp-4 text-base md:text-lg opacity-90">
                  {event.descripcion}
                </p>
              )}

              {event.objetivoRecaudacion && event.objetivoRecaudacion > 0 && (
                <div className="mb-8">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Objetivo
                  </p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-500">
                    {new Intl.NumberFormat('es-ES', {
                      style: 'currency',
                      currency: 'EUR',
                      maximumFractionDigits: 0,
                    }).format(event.objetivoRecaudacion)}
                  </p>
                </div>
              )}

              {/* Link directo sin Button wrapper para evitar doble click */}
              <Link
                to={`/evento/${event.id}`}
                className="self-start inline-flex items-center gap-2 px-8 h-12 bg-green-600 hover:bg-green-700 text-white rounded-full text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all font-medium"
              >
                Ver Detalles <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Controles de Navegación (Flechas) */}
      {eventos.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/90 dark:bg-slate-700/90 hover:bg-white dark:hover:bg-slate-600 text-slate-800 dark:text-white shadow-lg transition-all z-10 cursor-pointer"
            aria-label="Anterior evento"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/90 dark:bg-slate-700/90 hover:bg-white dark:hover:bg-slate-600 text-slate-800 dark:text-white shadow-lg transition-all z-10 cursor-pointer"
            aria-label="Siguiente evento"
          >
            <ChevronRight size={24} />
          </button>

          {/* Indicadores (Puntos) */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {eventos.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  currentIndex === index
                    ? 'bg-green-600 w-8'
                    : 'bg-slate-300 dark:bg-slate-600 hover:bg-green-400 cursor-pointer'
                }`}
                aria-label={`Ir a diapositiva ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
