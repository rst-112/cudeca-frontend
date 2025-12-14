import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getEventoById } from '../../services/eventos.service';
import type { Evento } from '../../types/api.types';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Progress } from '../../components/ui/Progress';
import { Input } from '../../components/ui/Input';
import { Checkbox } from '../../components/ui/Checkbox';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';

const DetallesEvento = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const [evento, setEvento] = useState<Evento | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvento = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await getEventoById(Number(id));
        setEvento(data);
      } catch (err) {
        setError('No se pudo cargar el evento.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvento();
  }, [id]);

  if (loading) {
    return <div className="container mx-auto text-center py-24">Cargando evento...</div>;
  }

  if (error || !evento) {
    return <div className="container mx-auto text-center py-24 text-red-500">{error || 'Evento no encontrado.'}</div>;
  }

  const progreso = (evento.recaudado / evento.objetivo) * 100;

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Columna Izquierda: Detalles del Evento */}
          <div className="lg:col-span-2 space-y-8">
            {/* Encabezado */}
            <div>
              <h1 className="text-4xl font-bold text-gray-800 dark:text-white">{evento.nombre}</h1>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4 text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2"><Calendar size={18} /> {new Date(evento.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                <div className="flex items-center gap-2"><Clock size={18} /> {new Date(evento.fecha).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}h</div>
                <div className="flex items-center gap-2"><MapPin size={18} /> {evento.ubicacion}</div>
              </div>
            </div>

            {/* Barra de Progreso */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">Objetivo de recaudación</h3>
                <span className="font-bold text-green-600">{progreso.toFixed(0)}%</span>
              </div>
              <Progress value={progreso} />
              <div className="flex justify-between items-center mt-2 text-sm">
                <span className="font-bold">{new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(evento.recaudado)}</span>
                <span className="text-gray-500">de {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(evento.objetivo)}</span>
              </div>
              <p className="text-center mt-4 text-gray-600 dark:text-gray-400">¡Ayúdanos a llegar a la meta para cuidados paliativos!</p>
            </div>

            {/* Sobre el evento */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4">Sobre el evento</h2>
              <div className="prose dark:prose-invert max-w-none">
                <p>{evento.descripcion}</p>
                <p>Esta noche mágica contará con una cena de gala, actuaciones en vivo, subastas solidarias y la oportunidad de conocer las historias inspiradoras de quienes se benefician directamente de tu generosidad. Cada entrada vendida y cada euro donado representa esperanza, dignidad y acompañamiento en los momentos más difíciles.</p>
                <h3 className="font-semibold">¿Por qué asistir?</h3>
                <ul>
                  <li><strong>Impacto directo:</strong> El 100% de los fondos recaudados se destinan a cuidados paliativos domiciliarios.</li>
                  <li><strong>Velada inolvidable:</strong> Disfruta de una cena gourmet, música en vivo y un ambiente elegante.</li>
                  <li><strong>Comunidad solidaria:</strong> Conecta con personas que comparten tu pasión por marcar la diferencia.</li>
                  <li><strong>Subastas exclusivas:</strong> Participa en subastas de arte, experiencias únicas y artículos de colección.</li>
                </ul>
                <p><strong>Tu presencia importa.</strong> Cada asiento ocupado es un paso más hacia nuestro objetivo.</p>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Entradas y Donación */}
          <div className="sticky top-24 h-fit">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <img src={evento.imagenUrl} alt={evento.nombre} className="w-full h-56 object-cover rounded-lg mb-6" />

              {isAuthenticated ? (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Selecciona tu entrada</h2>
                  {/* Tipos de entrada (hardcodeado por ahora) */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 border rounded-lg bg-gray-100 dark:bg-gray-700 opacity-60">
                      <div>
                        <p className="font-bold">Entrada VIP</p>
                      </div>
                      <Badge variant="destructive">Agotado</Badge>
                    </div>
                    <div className="flex justify-between items-center p-4 border-2 border-green-500 rounded-lg">
                      <div>
                        <p className="font-bold">Entrada General</p>
                        <p className="text-sm text-gray-500">15€ Base + 5€ Donación</p>
                      </div>
                      <p className="text-xl font-bold">20€</p>
                    </div>
                  </div>

                  {/* Donación adicional */}
                  <div className="space-y-4 pt-6 border-t">
                     <div className="flex items-center space-x-2">
                        <Checkbox id="donacion" />
                        <label htmlFor="donacion" className="font-semibold">Añadir donación adicional</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input type="number" placeholder="0" className="w-24" />
                        <span>€</span>
                        <Button variant="outline" size="sm">+5€</Button>
                        <Button variant="outline" size="sm">+10€</Button>
                      </div>
                  </div>

                  {/* Total y Comprar */}
                  <div className="space-y-4 pt-6 border-t">
                    <div className="flex justify-between items-center text-xl font-bold">
                      <span>Total</span>
                      <span>20€</span>
                    </div>
                    <Button size="lg" className="w-full bg-green-600 hover:bg-green-700">Comprar Entradas</Button>
                  </div>
                </div>
              ) : (
                <div className="text-center p-8 border-dashed border-2 rounded-lg">
                  <h3 className="font-bold mb-2">¿Quieres comprar una entrada?</h3>
                  <p className="text-gray-600 mb-4">Inicia sesión o crea una cuenta para continuar.</p>
                  <Button asChild className="w-full">
                    <Link to="/login">Iniciar Sesión</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetallesEvento;
