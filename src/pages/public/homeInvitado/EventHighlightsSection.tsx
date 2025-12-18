import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEventos } from '../../../services/eventos.service';
import type { Evento } from '../../../types/api.types';

export const EventHighlightsSection = (): JSX.Element => {
  const navigate = useNavigate();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());

  const colors = [
    'from-emerald-500 to-emerald-700',
    'from-blue-500 to-blue-700',
    'from-purple-500 to-purple-700',
    'from-orange-500 to-orange-700',
    'from-pink-500 to-pink-700',
    'from-red-500 to-red-700',
  ];

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const data = await getEventos();
        // Filtrar solo eventos PUBLICADOS y tomar los primeros 6
        const eventosPublicados = data.filter((e) => e.estado === 'PUBLICADO').slice(0, 6);
        setEventos(eventosPublicados);
      } catch (error) {
        console.error('Error al cargar eventos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventos();
  }, []);

  if (loading) {
    return (
      <section className="w-full bg-white dark:bg-slate-900 py-16 px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-slate-600 dark:text-slate-400">Cargando eventos...</p>
        </div>
      </section>
    );
  }

  if (eventos.length === 0) {
    return (
      <section className="w-full bg-white dark:bg-slate-900 py-16 px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Próximos Eventos
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            No hay eventos disponibles en este momento.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-white dark:bg-slate-900 py-16 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-4 mb-12">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white font-['Arimo-Bold',Helvetica]">
            Próximos Eventos
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base font-['Arimo-Regular',Helvetica]">
            Descubre todas las formas de apoyar a Fundación Cudeca
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {eventos.map((evento) => (
            <article
              key={evento.id}
              className="flex flex-col gap-3 p-0 bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all"
            >
              <div
                className={`w-full h-48 bg-linear-to-br ${colors[evento.id % colors.length]} flex items-center justify-center text-5xl relative`}
              >
                {evento.imagenUrl && !failedImages.has(evento.id) ? (
                  <img
                    src={evento.imagenUrl}
                    alt={evento.nombre}
                    className="w-full h-full object-cover"
                    onError={() => setFailedImages((prev) => new Set(prev).add(evento.id))}
                  />
                ) : (
                  <span className="text-white/30">🎭</span>
                )}
              </div>

              <div className="flex flex-col gap-3 p-4">
                <h3 className="font-bold text-slate-900 dark:text-white text-base font-['Arimo-Bold',Helvetica]">
                  {evento.nombre}
                </h3>

                <div className="flex flex-col gap-2 text-sm text-slate-600 dark:text-slate-400 font-['Arimo-Regular',Helvetica]">
                  <div className="flex items-center gap-2">
                    <span>📅</span>
                    <time>
                      {new Date(evento.fechaInicio).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </time>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📍</span>
                    <address className="not-italic">{evento.lugar}</address>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                  {evento.objetivoRecaudacion && evento.objetivoRecaudacion > 0 ? (
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      Meta:{' '}
                      {new Intl.NumberFormat('es-ES', {
                        style: 'currency',
                        currency: 'EUR',
                        maximumFractionDigits: 0,
                      }).format(evento.objetivoRecaudacion)}
                    </span>
                  ) : (
                    <span className="text-slate-600 dark:text-slate-400 text-sm">
                      Evento benéfico
                    </span>
                  )}
                  <button
                    onClick={() => navigate(`/evento/${evento.id}`)}
                    className="px-4 py-2 bg-[#00753e] dark:bg-[#00a651] hover:bg-[#006835] dark:hover:bg-[#008a43] text-white font-semibold rounded-lg transition-all text-sm font-['Arimo-Regular',Helvetica] cursor-pointer"
                    aria-label={`Comprar entradas para ${evento.nombre}`}
                  >
                    Entradas
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
