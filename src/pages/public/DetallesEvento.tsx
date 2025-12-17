import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getEventoById } from '../../services/eventos.service';
import { getMapaAsientosByEventoId } from '../../services/asientos.service';
import type { Evento } from '../../types/api.types';
import type { MapaAsientos, Asiento } from '../../types/seatmap.types';
import { useCart } from '../../context/CartContext';
import { Button } from '../../components/ui/Button';
import SelectorAsientos from '../../components/SelectorAsientos';
import { Calendar, MapPin, Clock, ShoppingCart, Ticket } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { toast } from 'sonner';

const DetallesEvento = () => {
  const { id } = useParams<{ id: string }>();
  const [evento, setEvento] = useState<Evento | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para selector de asientos
  const [selectorAbierto, setSelectorAbierto] = useState(false);
  const [mapaAsientos, setMapaAsientos] = useState<MapaAsientos | null>(null);
  const [tipoEntradaSeleccionado, setTipoEntradaSeleccionado] = useState<number | null>(null);
  const [cantidad, setCantidad] = useState(1);

  const { addItem, addItemWithSeat } = useCart();

  useEffect(() => {
    const fetchEvento = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await getEventoById(Number(id));
        setEvento(data);

        // Cargar mapa de asientos si existe
        const mapa = await getMapaAsientosByEventoId(Number(id));
        setMapaAsientos(mapa);

      } catch (err) {
        setError('No se pudo cargar el evento.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvento();
  }, [id]);

  const handleComprar = () => {
    if (!tipoEntradaSeleccionado || !evento) {
      toast.error('Selecciona un tipo de entrada');
      return;
    }

    const tipoEntrada = evento.tiposEntrada?.find(t => t.id === tipoEntradaSeleccionado);

    if (!tipoEntrada) {
      toast.error('No se encontró el tipo de entrada seleccionado');
      return;
    }

    // Si hay mapa de asientos, abrir selector
    if (mapaAsientos) {
      // Usar setTimeout para evitar que el click se propague al backdrop del modal
      setTimeout(() => {
        setSelectorAbierto(true);
      }, 0);
    } else {
      // Si no hay mapa, añadir directo al carrito (entrada general sin asiento)
      try {
        for (let i = 0; i < cantidad; i++) {
          addItem({
            id: `evento-${evento.id}-tipo-${tipoEntradaSeleccionado}-${Date.now()}-${i}`,
            eventoId: evento.id,
            eventoNombre: evento.nombre,
            eventoImagen: evento.imagenUrl,
            eventoFecha: evento.fechaInicio,
            tipoEntradaId: tipoEntradaSeleccionado,
            tipoEntradaNombre: tipoEntrada.nombre,
            precio: tipoEntrada.costeBase + tipoEntrada.donacionImplicita,
          });
        }
        toast.success(`${cantidad} entrada(s) añadida(s) al carrito`);
      } catch (error) {
        console.error('Error adding to cart:', error);
        toast.error('Error al añadir al carrito');
      }
    }
  };

  const handleConfirmarAsientos = (asientos: Asiento[]) => {
    if (!evento || !tipoEntradaSeleccionado) return;

    const tipoEntrada = evento.tiposEntrada?.find(t => t.id === tipoEntradaSeleccionado);
    if (!tipoEntrada) return;

    // Añadir cada asiento al carrito
    asientos.forEach((asiento) => {
      addItemWithSeat({
        id: `evento - ${evento.id} -asiento - ${asiento.id} `,
        eventoId: evento.id,
        eventoNombre: evento.nombre,
        eventoImagen: evento.imagenUrl,
        eventoFecha: evento.fechaInicio,
        tipoEntradaId: tipoEntradaSeleccionado,
        tipoEntradaNombre: tipoEntrada.nombre,
        asientoId: asiento.id,
        asientoEtiqueta: asiento.etiqueta,
        precio: tipoEntrada.costeBase + tipoEntrada.donacionImplicita,
      });
    });

    setSelectorAbierto(false);
    toast.success(`${asientos.length} asiento(s) añadido(s) al carrito`);
  };

  if (loading) {
    return <div className="container mx-auto text-center py-24">Cargando evento...</div>;
  }

  if (error || !evento) {
    return <div className="container mx-auto text-center py-24 text-red-500">{error || 'Evento no encontrado.'}</div>;
  }

  // Calcular precio total y tipo de entrada seleccionado
  const tipoEntrada = evento.tiposEntrada?.find(t => t.id === tipoEntradaSeleccionado);
  const precioTotal = tipoEntrada ? (tipoEntrada.costeBase + tipoEntrada.donacionImplicita) * cantidad : 0;

  return (
    <>
      <div className="bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto py-12 px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Columna Izquierda: Detalles del Evento */}
            <div className="lg:col-span-2 space-y-8">
              {/* Imagen */}
              {evento.imagenUrl && (
                <img
                  src={evento.imagenUrl}
                  alt={evento.nombre}
                  className="w-full h-96 object-cover rounded-xl shadow-lg"
                />
              )}

              {/* Encabezado */}
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {evento.nombre}
                </h1>
                <Badge variant={evento.estado === 'PUBLICADO' ? 'default' : 'secondary'}>
                  {evento.estado}
                </Badge>
              </div>

              {/* Información básica */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Calendar className="h-5 w-5" />
                  <span>{new Date(evento.fechaInicio).toLocaleDateString('es-ES')}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Clock className="h-5 w-5" />
                  <span>{new Date(evento.fechaInicio).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <MapPin className="h-5 w-5" />
                  <span>{evento.lugar}</span>
                </div>
              </div>

              {/* Descripción */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Sobre este evento</h2>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{evento.descripcion}</p>
              </div>

              {/* Progreso de Recaudación */}
              {evento.objetivoRecaudacion && evento.objetivoRecaudacion > 0 && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border-2 border-green-200 dark:border-green-800">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <span className="text-2xl">🎯</span>
                    Objetivo de Recaudación
                  </h3>

                  {/* Barra de progreso */}
                  <div className="mb-4">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Recaudado
                      </span>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {(((evento.recaudacionActual || 0) / evento.objetivoRecaudacion) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-500 rounded-full"
                        style={{ width: `${Math.min(((evento.recaudacionActual || 0) / evento.objetivoRecaudacion) * 100, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Estadísticas */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Recaudado</p>
                      <p className="text-xl font-bold text-green-600 dark:text-green-500">
                        {new Intl.NumberFormat('es-ES', {
                          style: 'currency',
                          currency: 'EUR',
                          maximumFractionDigits: 0
                        }).format(evento.recaudacionActual || 0)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Objetivo</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {new Intl.NumberFormat('es-ES', {
                          style: 'currency',
                          currency: 'EUR',
                          maximumFractionDigits: 0
                        }).format(evento.objetivoRecaudacion)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Columna Derecha: Compra */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-6 space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Comprar Entradas</h3>

                {/* Tipos de Entrada */}
                {evento.tiposEntrada && evento.tiposEntrada.length > 0 ? (
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Ticket className="h-4 w-4" />
                      Selecciona el tipo de entrada
                    </label>
                    {evento.tiposEntrada.map((tipo) => (
                      <div
                        key={tipo.id}
                        className={`relative border-2 rounded-xl p-5 cursor-pointer transition-all duration-200 ${tipoEntradaSeleccionado === tipo.id
                          ? 'border-green-600 bg-green-50 dark:bg-green-900/20 shadow-md ring-2 ring-green-600 ring-offset-2 dark:ring-offset-gray-800'
                          : 'border-gray-200 dark:border-gray-700 hover:border-green-400 hover:shadow-sm'
                          }`}
                        onClick={() => setTipoEntradaSeleccionado(tipo.id)}
                      >
                        {/* Checkmark cuando está seleccionado */}
                        {tipoEntradaSeleccionado === tipo.id && (
                          <div className="absolute -top-2 -right-2 bg-green-600 rounded-full p-1 shadow-lg">
                            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}

                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <p className="font-bold text-lg text-gray-900 dark:text-white">{tipo.nombre}</p>
                            <div className="flex gap-2 mt-1 text-xs text-gray-600 dark:text-gray-400">
                              <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">
                                Coste: {tipo.costeBase}€
                              </span>
                              <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded">
                                + Donación: {tipo.donacionImplicita}€
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-green-600 dark:text-green-500">
                              {tipo.costeBase + tipo.donacionImplicita}€
                            </p>
                          </div>
                        </div>

                        {/* Disponibilidad */}
                        <div className="flex items-center gap-2 text-sm">
                          <div className={`flex-1 h-2 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700`}>
                            <div
                              className="h-full bg-green-500 transition-all"
                              style={{ width: `${((tipo.cantidadTotal - tipo.cantidadVendida) / tipo.cantidadTotal) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                            {tipo.cantidadTotal - tipo.cantidadVendida} disponibles
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No hay entradas disponibles</p>
                )}

                {/* Cantidad - Siempre mostrar cuando hay tipo seleccionado */}
                {tipoEntradaSeleccionado && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Cantidad de entradas
                    </label>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-10 w-10 p-0"
                        onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                      >
                        -
                      </Button>
                      <span className="text-xl font-bold w-16 text-center text-gray-900 dark:text-white">{cantidad}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-10 w-10 p-0"
                        onClick={() => {
                          const tipoEnt = evento.tiposEntrada?.find(t => t.id === tipoEntradaSeleccionado);
                          if (tipoEnt && cantidad < (tipoEnt.cantidadTotal - tipoEnt.cantidadVendida)) {
                            setCantidad(cantidad + 1);
                          }
                        }}
                      >
                        +
                      </Button>
                    </div>
                    {mapaAsientos && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        💺 Podrás elegir tus asientos en el siguiente paso
                      </p>
                    )}
                  </div>
                )}

                {/* Total y Comprar */}
                <div className="space-y-4 pt-6 border-t">
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span>Total</span>
                    <span>{precioTotal.toFixed(2)}€</span>
                  </div>
                  <Button
                    size="lg"
                    className="w-full bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2"
                    onClick={handleComprar}
                    disabled={!tipoEntradaSeleccionado}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {mapaAsientos ? 'Seleccionar Asientos' : 'Añadir al Carrito'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Selector de Asientos */}
      {mapaAsientos && tipoEntrada && (
        <SelectorAsientos
          isOpen={selectorAbierto}
          onClose={() => setSelectorAbierto(false)}
          mapaAsientos={mapaAsientos}
          cantidadRequerida={cantidad}
          onConfirmar={handleConfirmarAsientos}
          tipoEntradaNombre={tipoEntrada.nombre}
        />
      )}
    </>
  );
};

export default DetallesEvento;
