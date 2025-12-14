import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Progress } from '../../components/ui/Progress';
import { Badge } from '../../components/ui/Badge';
import { Edit, Trash2, Eye } from 'lucide-react';
import { getEventos } from '../../services/eventos.service';
import type { Evento, EstadoEvento } from '../../types/api.types';

const getBadgeVariant = (estado: EstadoEvento) => {
  switch (estado) {
    case 'PUBLICADO':
      return 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700';
    case 'BORRADOR':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700';
    case 'CANCELADO':
      return 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700';
    case 'FINALIZADO':
      return 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-700/50 dark:text-gray-300 dark:border-gray-600';
  }
};

const EventoCard = ({ evento }: { evento: Evento }) => {
  const navigate = useNavigate();
  const progreso = (evento.recaudado / evento.objetivo) * 100;

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg bg-white dark:bg-slate-800 border-0 dark:border-slate-700">
      <CardContent className="p-0">
        <div className="flex items-center gap-0 h-32">
          {/* Imagen */}
          <img src={evento.imagenUrl} alt={evento.nombre} className="h-full w-40 object-cover flex-shrink-0" />

          {/* Contenido principal */}
          <div className="flex-1 px-6 py-4 flex flex-col justify-center">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">{evento.nombre}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {new Date(evento.fecha).toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}h
            </p>
          </div>

          {/* Badge de estado */}
          <div className="flex-shrink-0 px-4">
            <Badge variant="outline" className={`font-semibold text-xs ${getBadgeVariant(evento.estado)}`}>
              {evento.estado}
            </Badge>
          </div>

          {/* Progreso de recaudación */}
          <div className="flex-shrink-0 w-56 px-4">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-gray-600 dark:text-gray-300 font-medium">
                {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(evento.recaudado)}
              </span>
              <span className="text-gray-400 dark:text-gray-500">
                {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(evento.objetivo)}
              </span>
            </div>
            <Progress value={progreso} className="h-2" />
          </div>

          {/* Botones de acciones */}
          <div className="flex-shrink-0 px-4 flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-slate-700"
              title="Editar evento"
              onClick={() => navigate('/editar-entrada')}
            >
              <Edit className="h-4 w-4 text-slate-600 dark:text-gray-400" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-slate-700"
              title="Ver evento"
            >
              <Eye className="h-4 w-4 text-slate-600 dark:text-gray-400" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-slate-700"
              title="Eliminar evento"
            >
              <Trash2 className="h-4 w-4 text-red-500 dark:text-red-400" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ListaEventos = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        setLoading(true);
        const data = await getEventos();
        setEventos(data);
      } catch (err) {
        setError('No se pudieron cargar los eventos.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventos();
  }, []);

  if (loading) {
    return <div className="text-center p-8 text-slate-900 dark:text-white">Cargando lista de eventos...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 dark:text-red-400 p-8">{error}</div>;
  }

  return (
    <div className="space-y-4">
      {eventos.map((evento) => (
        <EventoCard key={evento.id} evento={evento} />
      ))}
    </div>
  );
};

export default ListaEventos;
