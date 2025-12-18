import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronDown, ChevronUp, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { getEventos } from '../../services/eventos.service';
import type { Evento } from '../../types/api.types';

const Eventos: React.FC = () => {
  const navigate = useNavigate();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);

  // ESTADOS PARA FILTROS Y ORDENAMIENTO
  const [searchTerm, setSearchTerm] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todos');
  const [ordenFecha, setOrdenFecha] = useState<'asc' | 'desc'>('asc'); // 'asc' = Próximos, 'desc' = Lejanos
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());

  // Definimos las categorías disponibles
  const categorias = ['Todos', 'Concierto', 'Cena', 'Rifa', 'Otro'];

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const data = await getEventos();
        // Carga inicial: Priorizamos PUBLICADOS para la consistencia
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

  // --- LÓGICA DE FILTRADO Y ORDENAMIENTO ---
  const eventosProcesados = eventos
    .filter((evento) => {
      // 1. Filtro por Texto
      const coincideTexto =
        evento.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evento.lugar.toLowerCase().includes(searchTerm.toLowerCase());

      // 2. Filtro por Categoría
      const coincideCategoria = categoriaSeleccionada === 'Todos';
      // || evento.categoria === categoriaSeleccionada; // Descomentar cuando el backend tenga categorías

      return coincideTexto && coincideCategoria;
    })
    .sort((a, b) => {
      // 3. Ordenamiento por Fecha
      const fechaA = new Date(a.fechaInicio).getTime();
      const fechaB = new Date(b.fechaInicio).getTime();

      return ordenFecha === 'asc'
        ? fechaA - fechaB // Próximos primero
        : fechaB - fechaA; // Lejanos primero
    });

  // Array de colores decorativos
  const colors = [
    'bg-emerald-500',
    'bg-blue-500',
    'bg-purple-500',
    'bg-orange-500',
    'bg-pink-500',
    'bg-red-500',
    'bg-teal-500',
    'bg-indigo-500',
  ];

  const toggleOrden = () => {
    setOrdenFecha((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-900 min-h-screen">
      {/* SECCIÓN DE FILTROS */}
      <section
        className="w-full bg-white dark:bg-slate-950 py-8 px-4 border-b border-slate-200 dark:border-slate-800 sticky top-20 z-30 shadow-sm"
        aria-label="Filtros de eventos"
      >
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 items-center">
          {/* Barra de Búsqueda */}
          <div className="w-full lg:flex-1 flex items-center gap-3 bg-slate-100 dark:bg-slate-900 px-4 py-3 rounded-full border border-slate-200 dark:border-slate-700 focus-within:ring-2 focus-within:ring-[#00a651] transition-all">
            <Search className="text-slate-400" />
            <input
              type="search"
              placeholder="Buscar por nombre o lugar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent text-slate-900 dark:text-white placeholder-slate-500 outline-none"
            />
          </div>

          {/* Botones de Categorías */}
          <nav className="flex flex-wrap justify-center gap-2">
            {categorias.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoriaSeleccionada(cat)}
                className={`px-5 py-2 rounded-full font-medium transition-all text-sm cursor-pointer ${
                  categoriaSeleccionada === cat
                    ? 'bg-[#00a651] text-white shadow-md transform scale-105'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </nav>

          {/* Filtro de Fecha (AHORA FUNCIONAL) */}
          <button
            onClick={toggleOrden}
            className="hidden lg:flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-[#00a651] dark:hover:text-[#00a651] hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700 cursor-pointer"
          >
            <span>Fecha: {ordenFecha === 'asc' ? 'Próximos' : 'Lejanos'}</span>
            {ordenFecha === 'asc' ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
          </button>
        </div>
      </section>

      {/* LISTADO DE EVENTOS */}
      <section className="w-full py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-2 mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
              {categoriaSeleccionada === 'Todos'
                ? 'Todos los Eventos'
                : `Eventos de ${categoriaSeleccionada}`}
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Mostrando {eventosProcesados.length} evento(s) ordenados por fecha{' '}
              {ordenFecha === 'asc' ? 'más próxima' : 'más lejana'}
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00a651]"></div>
            </div>
          ) : eventosProcesados.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
              <p className="text-slate-500 text-lg">No se encontraron eventos con tu búsqueda.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setCategoriaSeleccionada('Todos');
                }}
                className="mt-4 text-[#00a651] font-semibold hover:underline"
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {eventosProcesados.map((evento, index) => (
                <div
                  key={evento.id}
                  className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
                >
                  {/* Imagen */}
                  <div
                    className={`relative w-full h-48 ${colors[index % colors.length]} flex items-center justify-center overflow-hidden`}
                  >
                    {evento.imagenUrl && !failedImages.has(evento.id) ? (
                      <img
                        src={evento.imagenUrl}
                        alt={evento.nombre}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={() => setFailedImages((prev) => new Set(prev).add(evento.id))}
                      />
                    ) : (
                      <Calendar size={48} className="text-white/40" />
                    )}
                    {/* Badge de estado si no es publicado */}
                    {evento.estado !== 'PUBLICADO' && (
                      <div className="absolute top-3 right-3 px-3 py-1 bg-black/50 backdrop-blur-md text-white text-xs font-bold rounded-full">
                        {evento.estado}
                      </div>
                    )}
                  </div>

                  {/* Contenido */}
                  <div className="p-5 flex flex-col grow">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-[#00a651] transition-colors">
                      {evento.nombre}
                    </h3>

                    <div className="space-y-2 mb-6">
                      <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                        <Calendar className="w-4 h-4 mr-2 text-[#00a651]" />
                        <span>
                          {new Date(evento.fechaInicio).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                        <MapPin className="w-4 h-4 mr-2 text-[#00a651]" />
                        <span className="line-clamp-1">{evento.lugar}</span>
                      </div>
                    </div>

                    {/* Objetivo (si existe) */}
                    {evento.objetivoRecaudacion && evento.objetivoRecaudacion > 0 && (
                      <div className="mt-auto mb-4">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-500 font-medium">Objetivo</span>
                          <span className="text-slate-900 dark:text-white font-bold">
                            {new Intl.NumberFormat('es-ES', {
                              style: 'currency',
                              currency: 'EUR',
                              maximumFractionDigits: 0,
                            }).format(evento.objetivoRecaudacion)}
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#00a651] w-0 animate-pulse"
                            style={{ width: '0%' }}
                          />
                          {/* Nota: Aquí podrías conectar el % real si el backend lo devuelve */}
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => navigate(`/evento/${evento.id}`)}
                      className="mt-auto w-full py-2.5 bg-[#00753e] dark:bg-[#00a651] hover:bg-[#006835] dark:hover:bg-[#008a43] text-white font-semibold rounded-lg transition-all text-sm font-['Arimo-Regular',Helvetica] cursor-pointer flex items-center justify-center gap-2"
                    >
                      Ver Detalles <ArrowRight size={16} />
                    </button>
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
