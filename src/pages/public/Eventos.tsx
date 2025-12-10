import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent } from '../../components/ui/Card';
import { Calendar, MapPin, Search, ChevronDown } from 'lucide-react';
import { getEventos } from '../../services/eventos.service';
import { Evento, CategoriaEvento } from '../../types/api.types';

const EventoCard = ({ evento }: { evento: Evento }) => (
  <Card className="group overflow-hidden rounded-lg shadow-lg transition-transform hover:-translate-y-2 duration-300">
    <div className="relative">
      <img src={evento.imagenUrl} alt={evento.nombre} className="h-56 w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
    </div>
    <CardContent className="p-6 bg-white dark:bg-gray-800">
      <h3 className="text-xl font-bold mb-2">{evento.nombre}</h3>
      <div className="flex items-center text-gray-500 dark:text-gray-400 space-x-4 mb-4">
        <div className="flex items-center gap-2">
          <Calendar size={16} />
          <span>{new Date(evento.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={16} />
          <span>{evento.ubicacion}</span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-lg font-bold text-green-600">Desde 20€</p> {/* Precio hardcodeado por ahora */}
        <Button asChild>
          <Link to={`/evento/${evento.id}`}>Entradas</Link>
        </Button>
      </div>
    </CardContent>
  </Card>
);

const Eventos = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para los filtros
  const [filtroCategoria, setFiltroCategoria] = useState<CategoriaEvento>('Todos');
  const [terminoBusqueda, setTerminoBusqueda] = useState('');

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        setLoading(true);
        const data = await getEventos();
        setEventos(data);
      } catch (err) {
        setError('No se pudieron cargar los eventos. Por favor, inténtalo de nuevo más tarde.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventos();
  }, []);

  // Memoizamos los eventos filtrados para que no se recalculen en cada render
  const eventosFiltrados = useMemo(() => {
    return eventos.filter((evento) => {
      const coincideCategoria = filtroCategoria === 'Todos' || evento.categoria === filtroCategoria;
      const coincideBusqueda = evento.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase());
      return coincideCategoria && coincideBusqueda;
    });
  }, [eventos, filtroCategoria, terminoBusqueda]);

  const categorias: CategoriaEvento[] = ['Todos', 'Concierto', 'Cena', 'Rifa', 'Otro'];

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center text-white">
        <img
          src="https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=2070&auto=format&fit=crop"
          alt="Gala Benéfica"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 text-center space-y-4 animate-in fade-in duration-1000">
          <span className="text-green-400 font-semibold">Evento Destacado</span>
          <h1 className="text-5xl font-bold">Gala Benéfica Anual: Eres Pieza Clave</h1>
          <p className="text-xl text-gray-200">Únete a una noche mágica para apoyar los cuidados paliativos.</p>
          <Button size="lg" className="bg-green-600 hover:bg-green-700">
            Comprar Entradas
          </Button>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="sticky top-20 z-40 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-sm py-4">
        <div className="container mx-auto px-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {categorias.map((cat) => (
              <Button
                key={cat}
                variant={filtroCategoria === cat ? 'secondary' : 'ghost'}
                onClick={() => setFiltroCategoria(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Input
                placeholder="Buscar evento..."
                className="pr-10"
                value={terminoBusqueda}
                onChange={(e) => setTerminoBusqueda(e.target.value)}
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              Fecha: Próximos <ChevronDown size={16} />
            </Button>
          </div>
        </div>
      </section>

      {/* Event List */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold">Próximos Eventos</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Descubre todas las formas de apoyar a Fundación Cudeca
            </p>
          </div>

          {loading && <div className="text-center text-lg text-gray-500">Cargando eventos...</div>}
          {error && <div className="text-center text-lg text-red-500 bg-red-100 p-4 rounded-md">{error}</div>}

          {!loading && !error && (
            <>
              {eventosFiltrados.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {eventosFiltrados.map((evento) => (
                    <EventoCard key={evento.id} evento={evento} />
                  ))}
                </div>
              ) : (
                <div className="text-center text-lg text-gray-500 py-16">
                  <p>No se encontraron eventos que coincidan con tu búsqueda.</p>
                </div>
              )}
              <div className="text-center mt-12">
                <Button variant="outline" size="lg">
                  Ver más eventos
                </Button>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Eventos;
