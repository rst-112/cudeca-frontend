import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getEventoById } from '../../services/eventos.service';
import { getMapaAsientosByEventoId } from '../../services/asientos.service';
import type { Evento } from '../../types/api.types';
import type { MapaAsientos, Asiento } from '../../types/seatmap.types';
import { useCart } from '../../context/CartContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import SelectorAsientos from '../../components/SelectorAsientos';
import {
  Calendar,
  MapPin,
  Clock,
  ShoppingCart,
  Ticket,
  Trophy,
  Info,
  Check,
  AlertCircle,
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { toast } from 'sonner';
import { Progress } from '../../components/ui/Progress';

const DetallesEvento = () => {
  const { id } = useParams<{ id: string }>();
  const [evento, setEvento] = useState<Evento | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para selector de asientos
  const [selectorAbierto, setSelectorAbierto] = useState(false);
  const [mapaAsientos, setMapaAsientos] = useState<MapaAsientos | null>(null);
  const [tipoEntradaSeleccionado, setTipoEntradaSeleccionado] = useState<number | null>(null);
  const [cantidad, setCantidad] = useState<number | string>(1);

  const { addItem, addItemWithSeat } = useCart();

  useEffect(() => {
    const fetchEvento = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await getEventoById(Number(id));
        setEvento(data);

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

  const isPublicado = evento?.estado === 'PUBLICADO';

  const getMaxAvailable = () => {
    if (!tipoEntradaSeleccionado || !evento?.tiposEntrada) return 10;
    const tipo = evento.tiposEntrada.find((t) => t.id === tipoEntradaSeleccionado);
    if (!tipo) return 1;
    // Límite real: Total - Vendidas
    return Math.max(0, tipo.cantidadTotal - tipo.cantidadVendida);
  };

  const handleCantidadChange = (val: string) => {
    // Permitir vacío para poder borrar y escribir
    if (val === '') {
      setCantidad('');
      return;
    }

    const num = parseInt(val);
    const max = getMaxAvailable();

    if (isNaN(num)) return;

    if (num < 1) {
      setCantidad(1);
    } else if (num > max) {
      setCantidad(max);
      toast.warning(`Solo quedan ${max} entradas disponibles.`);
    } else {
      setCantidad(num);
    }
  };

  const incrementCantidad = () => {
    const max = getMaxAvailable();
    const current = typeof cantidad === 'string' ? parseInt(cantidad) || 0 : cantidad;
    if (current < max) {
      setCantidad(current + 1);
    } else {
      toast.warning(`Has alcanzado el límite disponible.`);
    }
  };

  const decrementCantidad = () => {
    const current = typeof cantidad === 'string' ? parseInt(cantidad) || 0 : cantidad;
    if (current > 1) {
      setCantidad(current - 1);
    }
  };

  const handleComprar = () => {
    if (!isPublicado) {
      toast.error('La venta no está habilitada.');
      return;
    }

    if (!tipoEntradaSeleccionado || !evento) {
      toast.error('Selecciona un tipo de entrada');
      return;
    }

    const tipoEntrada = evento.tiposEntrada?.find((t) => t.id === tipoEntradaSeleccionado);
    if (!tipoEntrada) return;

    const cantidadFinal = typeof cantidad === 'string' ? parseInt(cantidad) || 1 : cantidad;

    if (mapaAsientos) {
      setTimeout(() => setSelectorAbierto(true), 0);
    } else {
      try {
        for (let i = 0; i < cantidadFinal; i++) {
          addItem(
            {
              id: `evento-${evento.id}-tipo-${tipoEntradaSeleccionado}-${Date.now()}-${i}`,
              eventoId: evento.id,
              eventoNombre: evento.nombre,
              eventoImagen: evento.imagenUrl,
              eventoFecha: evento.fechaInicio,
              tipoEntradaId: tipoEntradaSeleccionado,
              tipoEntradaNombre: tipoEntrada.nombre,
              precio: tipoEntrada.costeBase + tipoEntrada.donacionImplicita,
            },
            true,
          );
        }
        toast.success(`${cantidadFinal} entrada(s) añadida(s) al carrito`);
      } catch (error) {
        console.error('Error adding to cart:', error);
        toast.error('Error al añadir al carrito');
      }
    }
  };

  const handleConfirmarAsientos = (asientos: Asiento[]) => {
    if (!evento || !tipoEntradaSeleccionado) return;
    const tipoEntrada = evento.tiposEntrada?.find((t) => t.id === tipoEntradaSeleccionado);
    if (!tipoEntrada) return;

    asientos.forEach((asiento) => {
      addItemWithSeat(
        {
          id: `evento-${evento.id}-asiento-${asiento.id}`,
          eventoId: evento.id,
          eventoNombre: evento.nombre,
          eventoImagen: evento.imagenUrl,
          eventoFecha: evento.fechaInicio,
          tipoEntradaId: tipoEntradaSeleccionado,
          tipoEntradaNombre: tipoEntrada.nombre,
          asientoId: asiento.id,
          asientoEtiqueta: asiento.etiqueta,
          precio: tipoEntrada.costeBase + tipoEntrada.donacionImplicita,
        },
        true,
      );
    });

    setSelectorAbierto(false);
    toast.success(`${asientos.length} asiento(s) añadido(s) al carrito`);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
        Cargando evento...
      </div>
    );
  if (error || !evento)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-red-500">
        {error || 'Evento no encontrado.'}
      </div>
    );

  const tipoEntrada = evento.tiposEntrada?.find((t) => t.id === tipoEntradaSeleccionado);
  const precioUnitario = tipoEntrada ? tipoEntrada.costeBase + tipoEntrada.donacionImplicita : 0;
  const cantidadNumerica = typeof cantidad === 'string' ? parseInt(cantidad) || 0 : cantidad;
  const precioTotal = precioUnitario * cantidadNumerica;

  const recaudado = evento.recaudacionActual || 0;
  const objetivo = evento.objetivoRecaudacion || 0;
  const porcentaje = objetivo > 0 ? Math.min((recaudado / objetivo) * 100, 100) : 0;

  return (
    <>
      <div className="bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
        {/* Banner Imagen */}
        <div className="relative h-[300px] w-full bg-slate-900 overflow-hidden">
          {evento.imagenUrl ? (
            <>
              <img
                src={evento.imagenUrl}
                alt="Background"
                className="absolute inset-0 w-full h-full object-cover opacity-40 blur-sm"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-transparent" />
            </>
          ) : (
            <div className="absolute inset-0 bg-slate-800" />
          )}
        </div>

        <div className="container mx-auto px-4 -mt-32 relative z-10 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* --- DETALLES --- */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden p-6 md:p-8 border border-slate-200 dark:border-slate-800">
                <div className="flex flex-col md:flex-row gap-6">
                  {evento.imagenUrl && (
                    <img
                      src={evento.imagenUrl}
                      alt={evento.nombre}
                      className="w-full md:w-48 h-48 object-cover rounded-xl shadow-md shrink-0"
                    />
                  )}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between">
                      <Badge variant={evento.estado === 'PUBLICADO' ? 'default' : 'secondary'}>
                        {evento.estado}
                      </Badge>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
                      {evento.nombre}
                    </h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-600 dark:text-slate-300 pt-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-[#00A651]" />
                        <span className="font-medium">
                          {new Date(evento.fechaInicio).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-[#00A651]" />
                        <span className="font-medium">
                          {new Date(evento.fechaInicio).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 sm:col-span-2">
                        <MapPin className="h-5 w-5 text-[#00A651]" />
                        <span className="font-medium">{evento.lugar}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recaudación */}
              {objetivo > 0 && (
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-6 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg text-yellow-600 dark:text-yellow-400">
                        <Trophy size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                          Objetivo Solidario
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Tu entrada ayuda a esta causa
                        </p>
                      </div>
                    </div>
                    <span className="text-2xl font-bold text-[#00A651]">
                      {porcentaje.toFixed(0)}%
                    </span>
                  </div>
                  <div className="space-y-2">
                    <Progress value={porcentaje} className="h-4 bg-slate-100 dark:bg-slate-800" />
                    <div className="flex justify-between text-sm font-medium mt-2">
                      <span className="text-slate-700 dark:text-slate-300">
                        Recaudado:{' '}
                        <span className="text-[#00A651] font-bold">
                          {new Intl.NumberFormat('es-ES', {
                            style: 'currency',
                            currency: 'EUR',
                            maximumFractionDigits: 0,
                          }).format(recaudado)}
                        </span>
                      </span>
                      <span className="text-slate-500 dark:text-slate-500">
                        Meta:{' '}
                        {new Intl.NumberFormat('es-ES', {
                          style: 'currency',
                          currency: 'EUR',
                          maximumFractionDigits: 0,
                        }).format(objetivo)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Descripción */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-6 md:p-8 border border-slate-200 dark:border-slate-800 space-y-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <Info size={20} className="text-[#00A651]" /> Sobre este evento
                </h2>
                <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {evento.descripcion || 'No hay descripción disponible.'}
                </div>
              </div>
            </div>

            {/* --- COMPRA (STICKY) --- */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6 sticky top-24 border border-slate-200 dark:border-slate-800">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                  <Ticket className="text-[#00A651]" /> Comprar Entradas
                </h3>

                {!isPublicado ? (
                  <div className="flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 text-center space-y-4">
                    <div className="p-3 bg-slate-200 dark:bg-slate-700 rounded-full text-slate-500 dark:text-slate-400">
                      <AlertCircle size={32} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-lg">
                        Venta no disponible
                      </h4>
                      <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                        Estado actual: <strong>{evento.estado}</strong>
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* TIPOS DE ENTRADA */}
                    {evento.tiposEntrada && evento.tiposEntrada.length > 0 ? (
                      <div className="space-y-4">
                        {evento.tiposEntrada.map((tipo) => (
                          <div
                            key={tipo.id}
                            className={`relative border rounded-xl p-4 cursor-pointer transition-all duration-200 group ${
                              tipoEntradaSeleccionado === tipo.id
                                ? 'border-[#00A651] bg-green-50/50 dark:bg-green-900/10 ring-1 ring-[#00A651]'
                                : 'border-slate-200 dark:border-slate-700 hover:border-[#00A651]/50 hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                            onClick={() => {
                              setTipoEntradaSeleccionado(tipo.id);
                              setCantidad(1);
                            }}
                          >
                            {/* Flexbox con gap para evitar solapamientos */}
                            <div className="flex justify-between items-start gap-4">
                              <div className="flex-1">
                                <p className="font-bold text-slate-900 dark:text-white text-base leading-tight">
                                  {tipo.nombre}
                                </p>
                                <div className="mt-2">
                                  <Badge
                                    variant="outline"
                                    className="text-[10px] px-1.5 py-0.5 border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400"
                                  >
                                    {tipo.cantidadTotal - tipo.cantidadVendida} disp.
                                  </Badge>
                                </div>
                              </div>

                              {/* Columna derecha con Precio y Check */}
                              <div className="flex items-center gap-3">
                                <div className="text-right">
                                  <p className="text-lg font-bold text-[#00A651]">
                                    {tipo.costeBase + tipo.donacionImplicita}€
                                  </p>
                                  {tipo.donacionImplicita > 0 && (
                                    <span className="text-[10px] text-slate-400 block whitespace-nowrap">
                                      + {tipo.donacionImplicita}€ donación
                                    </span>
                                  )}
                                </div>
                                {/* Checkmark sin solapamiento */}
                                <div
                                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
                                    tipoEntradaSeleccionado === tipo.id
                                      ? 'border-[#00A651] bg-[#00A651]'
                                      : 'border-slate-300 dark:border-slate-600'
                                  }`}
                                >
                                  {tipoEntradaSeleccionado === tipo.id && (
                                    <Check size={14} className="text-white" />
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                        <p className="text-slate-500 dark:text-slate-400">
                          No hay entradas configuradas.
                        </p>
                      </div>
                    )}

                    {/* SELECTOR CANTIDAD */}
                    {tipoEntradaSeleccionado && !mapaAsientos && (
                      <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-top-2">
                        <div className="flex justify-between items-center mb-3">
                          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Cantidad
                          </label>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            Máx: {getMaxAvailable()}
                          </span>
                        </div>

                        <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={decrementCantidad}
                            className="h-10 w-12 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600 transition-all border border-slate-200 dark:border-slate-600"
                            disabled={typeof cantidad !== 'number' || cantidad <= 1}
                          >
                            -
                          </Button>

                          <Input
                            type="number"
                            value={cantidad}
                            onChange={(e) => handleCantidadChange(e.target.value)}
                            className="flex-1 text-center border-none bg-transparent text-xl font-bold text-slate-900 dark:text-white focus-visible:ring-0 p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            min={1}
                            max={getMaxAvailable()}
                          />

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={incrementCantidad}
                            className="h-10 w-12 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600 transition-all border border-slate-200 dark:border-slate-600"
                            disabled={typeof cantidad === 'number' && cantidad >= getMaxAvailable()}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* INFO MAPA */}
                    {tipoEntradaSeleccionado && mapaAsientos && (
                      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-xl text-sm flex items-start gap-3 border border-blue-100 dark:border-blue-800">
                        <Info size={18} className="mt-0.5 shrink-0" />
                        <p>
                          Este evento tiene asientos numerados. Podrás elegir tu ubicación exacta en
                          el siguiente paso.
                        </p>
                      </div>
                    )}

                    {/* RESUMEN */}
                    {tipoEntradaSeleccionado && (
                      <div className="mt-6 bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3 animate-in fade-in slide-in-from-top-2">
                        <div className="flex justify-between items-start text-sm">
                          <span className="text-slate-600 dark:text-slate-400">
                            {mapaAsientos
                              ? 'Selección:'
                              : `${cantidadNumerica} x ${tipoEntrada?.nombre}`}
                          </span>
                          <span className="font-medium text-slate-900 dark:text-white">
                            {mapaAsientos ? '---' : `${precioTotal.toFixed(2)}€`}
                          </span>
                        </div>
                        <div className="border-t border-slate-200 dark:border-slate-700 pt-3 flex justify-between items-end">
                          <span className="text-slate-600 dark:text-slate-400 font-medium">
                            Total estimado
                          </span>
                          <span className="text-2xl font-bold text-[#00A651]">
                            {mapaAsientos ? '---' : `${precioTotal.toFixed(2)}€`}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="mt-6">
                      <Button
                        size="lg"
                        className="w-full bg-[#00A651] hover:bg-[#008a43] text-white font-bold h-14 text-lg shadow-lg rounded-xl transition-all"
                        onClick={handleComprar}
                        disabled={!tipoEntradaSeleccionado}
                      >
                        {mapaAsientos ? (
                          <>
                            Seleccionar Asientos <MapPin className="ml-2 h-5 w-5" />
                          </>
                        ) : (
                          <>
                            Añadir al Carrito <ShoppingCart className="ml-2 h-5 w-5" />
                          </>
                        )}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {mapaAsientos && tipoEntrada && (
        <SelectorAsientos
          isOpen={selectorAbierto}
          onClose={() => setSelectorAbierto(false)}
          mapaAsientos={mapaAsientos}
          cantidadRequerida={cantidadNumerica}
          onConfirmar={handleConfirmarAsientos}
          tipoEntradaNombre={tipoEntrada.nombre}
        />
      )}
    </>
  );
};

export default DetallesEvento;
