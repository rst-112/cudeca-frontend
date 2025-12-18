import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Progress } from '../../components/ui/Progress';
import { Edit, Trash2, CheckCircle } from 'lucide-react';
import { getEventos, publicarEvento } from '../../services/eventos.service';
import type { Evento, EstadoEvento } from '../../types/api.types';
import { toast } from 'sonner';

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

const EventoCard = ({ evento, onPublish }: { evento: Evento; onPublish: (id: number) => void }) => {
  const navigate = useNavigate();
  // Recaudado inicial en 0
  const recaudadoActual = 0;
  const progreso = evento.objetivoRecaudacion
    ? (recaudadoActual / evento.objetivoRecaudacion) * 100
    : 0;

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg bg-white dark:bg-slate-800 border-0 dark:border-slate-700">
      <CardContent className="p-0">
        <div className="flex items-center gap-0 h-32">
          {/* Imagen */}
          <img
            src={evento.imagenUrl || 'https://via.placeholder.com/160x128'}
            alt={evento.nombre}
            className="h-full w-40 object-cover shrink-0"
          />

          {/* Contenido principal */}
          <div className="flex-1 px-6 py-4 flex flex-col justify-center">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">{evento.nombre}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {new Date(evento.fechaInicio).toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">📍 {evento.lugar}</p>
          </div>

          {/* Badge de estado */}
          <div className="shrink-0 px-4">
            <Badge
              variant="outline"
              className={`font-semibold text-xs ${getBadgeVariant(evento.estado)}`}
            >
              {evento.estado}
            </Badge>
          </div>

          {/* Progreso de recaudación */}
          {evento.objetivoRecaudacion && evento.objetivoRecaudacion > 0 && (
            <div className="shrink-0 w-56 px-4">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-gray-600 dark:text-gray-300 font-medium">
                  {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(
                    recaudadoActual,
                  )}
                </span>
                <span className="text-gray-400 dark:text-gray-500">
                  {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(
                    evento.objetivoRecaudacion,
                  )}
                </span>
              </div>
              <Progress value={progreso} className="h-2" />
            </div>
          )}

          {/* Botones de acciones */}
          <div className="shrink-0 px-4 flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-slate-700"
              title="Editar evento"
              onClick={() => navigate('/editar-entrada')}
            >
              <Edit className="h-4 w-4 text-slate-600 dark:text-gray-400" />
            </Button>
            {evento.estado === 'BORRADOR' && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-green-100 dark:hover:bg-green-900/30"
                title="Publicar evento"
                onClick={() => onPublish(evento.id)}
              >
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              </Button>
            )}
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

  const confirmPublish = async (id: number) => {
    const toastId = toast.loading('Publicando evento...');

    try {
      console.log('Iniciando publicación de evento:', id);
      // Llamada real al backend para publicar el evento
      await publicarEvento(id);

      console.log('Evento publicado exitosamente:', id);

      // Recargar la lista de eventos para obtener el estado actualizado
      const data = await getEventos();
      setEventos(data);

      toast.success('¡Evento publicado!', {
        id: toastId,
        description: 'El evento ahora es visible para todos los usuarios.',
      });
    } catch (err) {
      console.error('Error al publicar evento:', err);
      toast.error('Error al publicar evento', {
        id: toastId,
        description: 'Por favor, inténtalo de nuevo.',
      });
    }
  };

  const handlePublish = (id: number) => {
    console.log('Click en publicar evento:', id);
    toast('¿Publicar este evento?', {
      description: 'Será visible para todos los usuarios.',
      action: {
        label: 'Confirmar',
        onClick: () => confirmPublish(id),
      },
      cancel: {
        label: 'Cancelar',
        onClick: () => console.log('Publicación cancelada'),
      },
    });
  };

  if (loading) {
    return (
      <div className="text-center p-8 text-slate-900 dark:text-white">
        Cargando lista de eventos...
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 dark:text-red-400 p-8">{error}</div>;
  }

  if (eventos.length === 0) {
    return (
      <div className="text-center p-12">
        <p className="text-slate-600 dark:text-slate-400 text-lg">No hay eventos creados aún.</p>
        <p className="text-slate-500 dark:text-slate-500 text-sm mt-2">
          Crea tu primer evento usando el botón "Crear Evento"
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {eventos.map((evento) => (
        <EventoCard key={evento.id} evento={evento} onPublish={handlePublish} />
      ))}
    </div>
  );
};

export default ListaEventos;
