import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Progress } from '../../components/ui/Progress';
import { Edit, CheckCircle } from 'lucide-react';
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
    <div className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-[#00A651] dark:hover:border-[#00A651] transition-all hover:shadow-xl overflow-hidden">
      <div className="flex items-center gap-0 h-40">
        {/* Imagen mejorada */}
        <div className="relative h-full w-56 shrink-0 overflow-hidden">
          <img
            src={evento.imagenUrl || 'https://via.placeholder.com/224x160'}
            alt={evento.nombre}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-linear-to-r from-transparent to-black/10 dark:to-black/30" />
        </div>

        {/* Contenido principal mejorado */}
        <div className="flex-1 px-6 py-4 flex flex-col justify-center gap-2">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-xl text-slate-900 dark:text-white truncate group-hover:text-[#00A651] dark:group-hover:text-[#00A651] transition-colors">
                {evento.nombre}
              </h3>
              <div className="flex items-center gap-3 mt-2.5">
                <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <span className="text-lg">📅</span>
                  <span className="font-medium">
                    {new Date(evento.fechaInicio).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                  <span className="text-slate-400 dark:text-slate-500">·</span>
                  <span>
                    {new Date(evento.fechaInicio).toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </p>
                <span className="text-slate-300 dark:text-slate-600">|</span>
                <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2 truncate">
                  <span className="text-lg">📍</span>
                  <span className="font-medium">{evento.lugar}</span>
                </p>
              </div>
            </div>

            {/* Badge de estado mejorado */}
            <Badge
              variant="outline"
              className={`font-bold text-sm px-3 py-1 shrink-0 ${getBadgeVariant(evento.estado)}`}
            >
              {evento.estado}
            </Badge>
          </div>

          {/* Progreso de recaudación mejorado */}
          {evento.objetivoRecaudacion && evento.objetivoRecaudacion > 0 && (
            <div className="mt-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3">
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-slate-900 dark:text-slate-100 font-bold">
                  {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(
                    recaudadoActual,
                  )}
                </span>
                <span className="text-slate-600 dark:text-slate-400 font-medium">
                  de{' '}
                  {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(
                    evento.objetivoRecaudacion,
                  )}
                </span>
              </div>
              <Progress value={progreso} className="h-2.5" />
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 font-medium">
                {progreso.toFixed(1)}% del objetivo alcanzado
              </p>
            </div>
          )}
        </div>

        {/* Botones de acciones mejorados */}
        <div className="shrink-0 px-6 flex items-center gap-2 border-l border-slate-200 dark:border-slate-700 h-full">
          <div className="flex flex-col gap-2.5">
            <Button
              variant="outline"
              size="sm"
              className="h-10 px-4 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-400 dark:hover:border-slate-500 group/btn font-semibold"
              title="Editar evento"
              onClick={() => navigate('/editar-entrada')}
            >
              <Edit className="h-4 w-4 text-slate-600 dark:text-slate-400 group-hover/btn:text-[#00A651] mr-2" />
              Editar
            </Button>
            {evento.estado === 'BORRADOR' && (
              <Button
                variant="outline"
                size="sm"
                className="h-10 px-4 hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-400 dark:hover:border-green-600 group/btn font-semibold border-green-300 dark:border-green-700"
                title="Publicar evento"
                onClick={() => onPublish(evento.id)}
              >
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mr-2" />
                <span className="text-green-600 dark:text-green-400">Publicar</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
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
    <div className="space-y-3">
      {eventos.map((evento) => (
        <EventoCard key={evento.id} evento={evento} onPublish={handlePublish} />
      ))}
    </div>
  );
};

export default ListaEventos;
