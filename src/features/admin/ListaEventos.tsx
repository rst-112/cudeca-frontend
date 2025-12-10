import { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Progress } from '../../components/ui/Progress';
import { Badge } from '../../components/ui/Badge';
import { MoreVertical, Edit, Trash2, Eye } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/DropdownMenu';
import { getEventos } from '../../services/eventos.service';
import { Evento, EstadoEvento } from '../../types/api.types';

const getBadgeVariant = (estado: EstadoEvento) => {
  switch (estado) {
    case 'PUBLICADO':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'BORRADOR':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'CANCELADO':
      return 'bg-red-100 text-red-800 border-red-300';
    case 'FINALIZADO':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

const EventoCard = ({ evento }: { evento: Evento }) => {
  const progreso = (evento.recaudado / evento.objetivo) * 100;

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <CardContent className="p-0">
        <div className="flex items-center gap-6">
          <img src={evento.imagenUrl} alt={evento.nombre} className="h-32 w-40 object-cover" />
          <div className="flex-1 py-4">
            <h3 className="font-bold text-lg">{evento.nombre}</h3>
            <p className="text-sm text-gray-500">
              {new Date(evento.fecha).toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}h
            </p>
          </div>
          <div className="px-6">
            <Badge variant="outline" className={`font-semibold ${getBadgeVariant(evento.estado)}`}>
              {evento.estado}
            </Badge>
          </div>
          <div className="w-64 px-6">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>{new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(evento.recaudado)}</span>
              <span className="text-gray-400">{new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(evento.objetivo)}</span>
            </div>
            <Progress value={progreso} />
          </div>
          <div className="px-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Eye className="mr-2 h-4 w-4" /> Ver
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Edit className="mr-2 h-4 w-4" /> Editar
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-500">
                  <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
    return <div className="text-center p-8">Cargando lista de eventos...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-8">{error}</div>;
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
