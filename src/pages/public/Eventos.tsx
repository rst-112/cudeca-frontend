import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronDown, Calendar, MapPin } from 'lucide-react';
import { getEventos } from '../../services/eventos.service';
import type { Evento } from '../../types/api.types';

const Eventos: React.FC = () => {
  const navigate = useNavigate();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const data = await getEventos();
        // Ordenar: PUBLICADOS primero, luego el resto
        const sorted = data.sort((a, b) => {
          if (a.estado === 'PUBLICADO' && b.estado !== 'PUBLICADO') return -1;
          if (a.estado !== 'PUBLICADO' && b.estado === 'PUBLICADO') return 1;
          return 0;
        });
        setEventos(sorted);
      } catch (error) {
        console.error('Error al cargar eventos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventos();
  }, []);

  // Filtrar eventos por búsqueda
  const eventosFiltrados = eventos.filter(evento =>
    evento.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    evento.lugar.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Array de colores
  const colors = ['bg-emerald-500', 'bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500', 'bg-red-500', 'bg-teal-500', 'bg-indigo-500'];

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-900">
      <section
        className="w-full bg-slate-50 dark:bg-slate-900 py-8 px-8 border-y border-slate-200 dark:border-slate-700"
        aria-label="Upcoming Events Filter Section"
      >
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 items-center">
          <div className="flex-1 flex items-center gap-3 bg-white dark:bg-slate-800 px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600">
            <Search className="text-slate-500 dark:text-slate-400" />
            <input
              type="search"
              placeholder="Buscar evento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 outline-none"
              aria-label="Buscar evento"
            />
          </div>

          <nav
            className="flex flex-wrap gap-3"
            aria-label="Event category filters"
          >
            <button
              className="px-6 py-2 rounded-full font-semibold transition-all bg-[#00753e] dark:bg-[#00a651] text-white shadow-lg"
              aria-pressed="true"
              aria-label="Filter by Todos"
            >
              Todos
            </button>
            <button
              className="px-6 py-2 rounded-full font-semibold transition-all bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:shadow-md"
              aria-pressed="false"
              aria-label="Filter by Conciertos"
            >
              Conciertos
            </button>
            <button
              className="px-6 py-2 rounded-full font-semibold transition-all bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:shadow-md"
              aria-pressed="false"
              aria-label="Filter by Cenas"
            >
              Cenas
            </button>
            <button
              className="px-6 py-2 rounded-full font-semibold transition-all bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:shadow-md"
              aria-pressed="false"
              aria-label="Filter by Rifas"
            >
              Rifas
            </button>
            <button
              className="px-6 py-2 rounded-full font-semibold transition-all bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:shadow-md"
              aria-pressed="false"
              aria-label="Filter by Otros"
            >
              Otros
            </button>
          </nav>

          <button
            className="px-6 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 rounded-lg font-semibold hover:shadow-md transition-all flex items-center gap-2"
            aria-label="Filtrar por fecha: Próximos eventos"
            aria-haspopup="listbox"
            aria-expanded="false"
          >
            Fecha: Próximos <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </section>
      <section className="w-full bg-white dark:bg-slate-900 py-16 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-4 mb-8 text-center items-center">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
              Próximos Eventos
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Descubre todas las formas de apoyar a Fundación Cudeca
            </p>
          </div>

          {loading ? (
            <div className="text-center p-12">
              <p className="text-slate-600 dark:text-slate-400 text-lg">Cargando eventos...</p>
            </div>
          ) : eventosFiltrados.length === 0 ? (
            <div className="text-center p-12">
              <p className="text-slate-600 dark:text-slate-400 text-lg">No se encontraron eventos.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {eventosFiltrados.map((evento, index) => (
                <div key={evento.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all flex flex-col">
                  <div className={`w-full h-48 ${colors[index % colors.length]} flex items-center justify-center rounded-t-xl`}>
                    {evento.imagenUrl ? (
                      <img src={evento.imagenUrl} alt={evento.nombre} className="w-full h-full object-cover rounded-t-xl" />
                    ) : (
                      <Calendar size={64} className="text-white/30" />
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-grow text-center items-center">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{evento.nombre}</h3>
                    <div className="flex items-center justify-center text-sm text-slate-600 dark:text-slate-400 mb-2">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{new Date(evento.fechaInicio).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center justify-center text-sm text-slate-600 dark:text-slate-400 mb-4">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{evento.lugar}</span>
                    </div>

                    {/* Mostrar objetivo de recaudación si existe */}
                    {evento.objetivoRecaudacion && evento.objetivoRecaudacion > 0 && (
                      <div className="mb-4 w-full">
                        <div className="flex justify-between items-center text-xs text-slate-600 dark:text-slate-400 uppercase mb-1">
                          <span>Objetivo</span>
                          <span className="text-slate-900 dark:text-white font-bold">
                            {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(evento.objetivoRecaudacion)}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full">
                          <div className="h-2 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full" style={{ width: '0%' }} />
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col items-center gap-3 border-t border-slate-200 dark:border-slate-700 pt-4 mt-auto w-full">
                      <button
                        onClick={() => navigate(`/evento/${evento.id}`)}
                        className="px-6 py-2 bg-[#00a651] text-white text-sm rounded-full font-semibold hover:bg-[#00753e] transition-all w-full max-w-[200px]"
                      >
                        Ver Detalles
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Eventos;
