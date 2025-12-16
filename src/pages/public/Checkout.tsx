import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Switch } from '../../components/ui/Switch';
import { Card } from '../../components/ui/Card';
import {
  procesarCheckout,
  confirmarPago,
  obtenerDatosFiscalesUsuario,
} from '../../services/checkout.service';
import type { AsientoSeleccionado, DatosFiscales } from '../../types/checkout.types';
import {
  ShoppingCart,
  FileText,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export default function Checkout() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { items: cartItems, clearCart } = useCart();

  const [asientosSeleccionados, setAsientosSeleccionados] = useState<AsientoSeleccionado[]>([]);
  const [solicitarCertificado, setSolicitarCertificado] = useState(false);
  const [datosFiscales, setDatosFiscales] = useState<DatosFiscales[]>([]);
  const [datosFiscalesSeleccionado, setDatosFiscalesSeleccionado] = useState<number | null>(null);
  const [mostrarFormularioNuevo, setMostrarFormularioNuevo] = useState(false);

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'resumen' | 'confirmado'>('resumen');

  const [nuevosDatos, setNuevosDatos] = useState<DatosFiscales>({
    nif: '',
    nombre: '',
    direccion: '',
    ciudad: '',
    codigoPostal: '',
    pais: 'España',
  });

  // 1. Efecto de Protección de Ruta
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.error('Debes iniciar sesión para realizar la compra');
      navigate('/login?redirect=/checkout'); // Redirigir al login
    }
  }, [authLoading, isAuthenticated, navigate]);

  // 2. Efecto de Carga de Datos (Solo si hay usuario)
  useEffect(() => {
    if (user?.id) {
      cargarDatosFiscales(user.id);
    }

    // Convertir items del carrito a asientos seleccionados
    const asientos: AsientoSeleccionado[] = cartItems.map((item) => ({
      id: item.id,
      etiqueta: item.asientoEtiqueta || item.tipoEntradaNombre,
      precio: item.precio,
      zonaId: item.tipoEntradaId,
      zonaNombre: item.zonaNombre || item.eventoNombre,
    }));
    setAsientosSeleccionados(asientos);

    // Si el carrito está vacío, redirigir
    if (cartItems.length === 0) {
      toast.error('No hay entradas en el carrito');
      navigate('/');
    }
  }, [user, cartItems, navigate]);

  const cargarDatosFiscales = async (usuarioId: number) => {
    try {
      const datos = await obtenerDatosFiscalesUsuario(usuarioId);
      setDatosFiscales(datos);

      // Seleccionar el principal por defecto
      const principal = datos.find((d: DatosFiscales) => d.esPrincipal);
      if (principal?.id) {
        setDatosFiscalesSeleccionado(principal.id);
      }
    } catch (error) {
      console.error('Error al cargar datos fiscales:', error);
      toast.error('No se pudieron cargar tus datos fiscales');
    }
  };

  const calcularTotal = () => {
    const subtotal = asientosSeleccionados.reduce((sum, asiento) => sum + asiento.precio, 0);
    const comision = subtotal * 0.05; // 5% de comisión
    return {
      subtotal,
      comision,
      total: subtotal + comision,
    };
  };

  const handleSolicitarCertificadoChange = (checked: boolean) => {
    setSolicitarCertificado(checked);

    // Si no tiene datos fiscales guardados, mostrar formulario automáticamente
    if (checked && datosFiscales.length === 0) {
      setMostrarFormularioNuevo(true);
    }
  };

  const validarDatosFiscales = (): boolean => {
    if (!solicitarCertificado) return true;

    if (mostrarFormularioNuevo) {
      // Validar formulario de nuevos datos
      if (
        !nuevosDatos.nif ||
        !nuevosDatos.nombre ||
        !nuevosDatos.direccion ||
        !nuevosDatos.ciudad ||
        !nuevosDatos.codigoPostal
      ) {
        toast.error('Completa todos los campos de datos fiscales');
        return false;
      }

      // Validar formato NIF (básico)
      const nifRegex = /^[0-9]{8}[A-Z]$/;
      if (!nifRegex.test(nuevosDatos.nif)) {
        toast.error('El NIF debe tener 8 números seguidos de una letra');
        return false;
      }

      return true;
    } else {
      // Verificar que haya seleccionado datos fiscales existentes
      if (!datosFiscalesSeleccionado) {
        toast.error('Selecciona datos fiscales o crea unos nuevos');
        return false;
      }
      return true;
    }
  };

  const handleConfirmarCompra = async () => {
    if (!validarDatosFiscales()) return;
    if (!user?.id) {
      toast.error('Sesión no válida');
      return;
    }

    setLoading(true);
    try {
      // 1. Procesar checkout (crear compra)
      const response = await procesarCheckout({
        usuarioId: user.id,
        // CORRECCIÓN AQUÍ: Mapear al formato correcto ItemCheckout
        items: asientosSeleccionados.map((a) => ({
          tipo: 'ENTRADA', // <--- Añadido
          referenciaId: parseInt(a.id) || 0, // <--- Ahora es referenciaId, no asientoId
          cantidad: 1, // <--- Añadido
          precio: a.precio,
        })),
        donacionExtra: 0,
        solicitarCertificado,
        datosFiscalesId: mostrarFormularioNuevo
          ? undefined
          : (datosFiscalesSeleccionado ?? undefined),
      });

      toast.success('Compra procesada correctamente');

      // 2. Simulación de Pago (En real aquí redirigirías a Stripe/Redsys)
      // await iniciarPago(response.urlPago);

      // Confirmación directa para demo
      await confirmarPago(response.compraId, {
        transaccionId: 'DEMO-' + Date.now(),
        estado: 'COMPLETADO',
      });

      toast.success('¡Compra confirmada! Redirigiendo...');
      setStep('confirmado');
      clearCart(); // Limpiar el carrito después de la compra exitosa

      // Redirigir al perfil después de 3 segundos
      setTimeout(() => {
        navigate('/perfil?tab=entradas');
      }, 3000);
    } catch (error) {
      console.error('Error en checkout:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al procesar la compra';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const totales = calcularTotal();

  // Mostrar spinner mientras verificamos autenticación
  if (authLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#00A651]" />
      </div>
    );
  }

  // Si no hay usuario (y el useEffect aún no redirigió), no renderizar nada sensible
  if (!user) return null;

  if (step === 'confirmado') {
    return (
      <div className="container mx-auto px-4 py-12 max-w-2xl animate-in fade-in zoom-in duration-500">
        <Card className="p-8 text-center border-green-500/20 shadow-lg shadow-green-500/10">
          <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
            ¡Compra Confirmada!
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
            Gracias por tu colaboración, <span className="font-semibold">{user.nombre}</span>.<br />
            Hemos enviado las entradas a tu correo electrónico.
          </p>
          <Button
            onClick={() => navigate('/perfil?tab=entradas')}
            size="lg"
            className="w-full sm:w-auto"
          >
            Ver mis entradas
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">Checkout</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Completa tu compra y descarga tus entradas
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna Izquierda: Formulario */}
        <div className="lg:col-span-2 space-y-6">
          {/* Resumen de Asientos */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4 border-b border-gray-100 dark:border-slate-800 pb-3">
              <ShoppingCart className="w-5 h-5 text-[#00A651]" />
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Asientos Seleccionados
              </h2>
            </div>

            <div className="space-y-3">
              {asientosSeleccionados.map((asiento) => (
                <div
                  key={asiento.id}
                  className="flex justify-between items-center p-4 bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700 rounded-lg"
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-800 dark:text-white">
                      {asiento.zonaNombre}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Fila/Asiento: {asiento.etiqueta}
                    </span>
                  </div>
                  <p className="font-bold text-[#00A651]">{asiento.precio.toFixed(2)} €</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Datos Fiscales */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4 border-b border-gray-100 dark:border-slate-800 pb-3">
              <FileText className="w-5 h-5 text-[#00A651]" />
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Datos Fiscales
              </h2>
            </div>

            {/* Toggle Solicitar Certificado */}
            <div className="flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50 rounded-lg mb-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-500" />
                <div className="flex flex-col">
                  <Label
                    htmlFor="certificado"
                    className="cursor-pointer text-gray-800 dark:text-white font-medium"
                  >
                    Solicitar Certificado de Donación
                  </Label>
                  <span className="text-xs text-amber-700 dark:text-amber-500">
                    Necesario para deducciones fiscales
                  </span>
                </div>
              </div>
              <Switch
                id="certificado"
                checked={solicitarCertificado}
                onCheckedChange={handleSolicitarCertificadoChange}
              />
            </div>

            {/* Formulario de Datos Fiscales */}
            {solicitarCertificado && (
              <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                {datosFiscales.length > 0 && !mostrarFormularioNuevo && (
                  <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-lg">
                    <Label className="mb-2 block">Selecciona tus Datos Fiscales guardados:</Label>
                    <select
                      className="w-full p-2.5 border rounded-md bg-white dark:bg-slate-900 dark:border-slate-700 focus:ring-2 focus:ring-[#00A651] outline-none transition-all"
                      value={datosFiscalesSeleccionado ?? ''}
                      onChange={(e) => setDatosFiscalesSeleccionado(Number(e.target.value))}
                    >
                      <option value="">-- Selecciona --</option>
                      {datosFiscales.map((datos) => (
                        <option key={datos.id} value={datos.id}>
                          {datos.alias ? datos.alias : datos.nombre} ({datos.nif})
                        </option>
                      ))}
                    </select>

                    <div className="mt-3 flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[#00A651] hover:text-[#008a43] hover:bg-[#00A651]/10"
                        onClick={() => setMostrarFormularioNuevo(true)}
                      >
                        + Añadir una dirección diferente
                      </Button>
                    </div>
                  </div>
                )}

                {(mostrarFormularioNuevo || datosFiscales.length === 0) && (
                  <div className="space-y-4 border-l-2 border-[#00A651] pl-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-gray-700 dark:text-gray-300">
                        Nuevos Datos
                      </h3>
                      {datosFiscales.length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setMostrarFormularioNuevo(false)}
                        >
                          Cancelar
                        </Button>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="nif">NIF / CIF *</Label>
                      <Input
                        id="nif"
                        placeholder="12345678A"
                        value={nuevosDatos.nif}
                        onChange={(e) =>
                          setNuevosDatos({ ...nuevosDatos, nif: e.target.value.toUpperCase() })
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="nombre">Nombre Completo / Razón Social *</Label>
                      <Input
                        id="nombre"
                        placeholder="Nombre Apellidos"
                        value={nuevosDatos.nombre}
                        onChange={(e) => setNuevosDatos({ ...nuevosDatos, nombre: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="direccion">Dirección *</Label>
                      <Input
                        id="direccion"
                        placeholder="Calle, Número, Piso..."
                        value={nuevosDatos.direccion}
                        onChange={(e) =>
                          setNuevosDatos({ ...nuevosDatos, direccion: e.target.value })
                        }
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="ciudad">Ciudad *</Label>
                        <Input
                          id="ciudad"
                          placeholder="Málaga"
                          value={nuevosDatos.ciudad}
                          onChange={(e) =>
                            setNuevosDatos({ ...nuevosDatos, ciudad: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="codigoPostal">Código Postal *</Label>
                        <Input
                          id="codigoPostal"
                          placeholder="29000"
                          value={nuevosDatos.codigoPostal}
                          onChange={(e) =>
                            setNuevosDatos({ ...nuevosDatos, codigoPostal: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="pais">País *</Label>
                      <Input
                        id="pais"
                        value={nuevosDatos.pais}
                        onChange={(e) => setNuevosDatos({ ...nuevosDatos, pais: e.target.value })}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>

        {/* Columna Derecha: Resumen de Compra */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-24 border-[#00A651]/20 shadow-lg">
            <div className="flex items-center gap-2 mb-6 border-b border-gray-100 dark:border-slate-800 pb-3">
              <CreditCard className="w-5 h-5 text-[#00A651]" />
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Resumen</h2>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal ({asientosSeleccionados.length} entradas)</span>
                <span>{totales.subtotal.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Gastos de gestión (5%)</span>
                <span>{totales.comision.toFixed(2)} €</span>
              </div>
              <div className="border-t border-gray-200 dark:border-slate-700 pt-3 mt-3">
                <div className="flex justify-between text-2xl font-bold text-gray-800 dark:text-white">
                  <span>Total</span>
                  <span className="text-[#00A651]">{totales.total.toFixed(2)} €</span>
                </div>
              </div>
            </div>

            <Button
              className="w-full bg-[#00A651] hover:bg-[#008a43] h-12 text-lg shadow-lg hover:shadow-[#00A651]/20 transition-all"
              size="lg"
              onClick={handleConfirmarCompra}
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin" /> Procesando...
                </div>
              ) : (
                'Confirmar y Pagar'
              )}
            </Button>

            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
              Pagos procesados de forma segura. Al confirmar, aceptas nuestros términos de venta.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
