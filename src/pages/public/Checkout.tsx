import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
import type { DatosFiscales } from '../../types/checkout.types';
import {
  ShoppingCart,
  FileText,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Loader2,
  User,
  Mail,
  LogIn,
  ShieldCheck,
  Smartphone,
  Wallet,
  Trash2,
  Ticket,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// --- ARREGLO DEL ERROR ---
// Importamos el hook normalmente
import { useCart } from '../../context/CartContext';
// Importamos la interfaz COMO TIPO explícitamente para que Vite no falle
import type { CartItem } from '../../context/CartContext';

export default function Checkout() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { items: cartItems, clearCart, getTotalPrice, removeItem } = useCart();

  // Estados de Compra
  const [solicitarCertificado, setSolicitarCertificado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'resumen' | 'confirmado'>('resumen');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('tarjeta');

  // Estados de Datos (Usuario Logueado)
  const [datosFiscales, setDatosFiscales] = useState<DatosFiscales[]>([]);
  const [datosFiscalesSeleccionado, setDatosFiscalesSeleccionado] = useState<number | null>(null);
  const [mostrarFormularioNuevo, setMostrarFormularioNuevo] = useState(false);

  // Estados de Datos (Invitado)
  const [guestForm, setGuestForm] = useState({
    nombre: '',
    email: '',
    // DNI eliminado para invitado básico
    direccion: '',
    ciudad: '',
    codigoPostal: '',
    pais: 'España',
  });

  // --- LÓGICA DE AGRUPACIÓN DE ITEMS ---
  const groupedItems = useMemo(() => {
    const groups: Record<
      string,
      CartItem & { count: number; originalIds: string[]; asientos: string[] }
    > = {};

    cartItems.forEach((item) => {
      // Clave única para agrupar: Evento + TipoEntrada + Precio
      const key = `${item.eventoId}-${item.tipoEntradaId}-${item.precio}`;

      if (!groups[key]) {
        groups[key] = {
          ...item,
          count: 0,
          originalIds: [],
          asientos: [],
        };
      }

      groups[key].count += item.cantidad;
      groups[key].originalIds.push(item.id);

      // Si tiene asiento asignado, lo guardamos para mostrarlo
      if (item.asientoEtiqueta) {
        groups[key].asientos.push(item.asientoEtiqueta);
      }
    });

    return Object.values(groups);
  }, [cartItems]);

  const removeGroup = (originalIds: string[]) => {
    originalIds.forEach((id) => removeItem(id));
  };

  // --- EFECTOS ---

  useEffect(() => {
    // Si no hay items y no estamos en la pantalla de éxito, redirigir
    if (cartItems.length === 0 && step !== 'confirmado') {
      toast.error('No hay entradas en el carrito');
      navigate('/eventos');
      return;
    }

    if (isAuthenticated && user?.id) {
      cargarDatosFiscales(user.id);
    }
  }, [cartItems, isAuthenticated, user, navigate, step]);

  const cargarDatosFiscales = async (usuarioId: number) => {
    try {
      const datos = await obtenerDatosFiscalesUsuario(usuarioId);
      setDatosFiscales(datos);
      const principal = datos.find((d) => d.esPrincipal);
      if (principal?.id) setDatosFiscalesSeleccionado(principal.id);
    } catch (error) {
      console.error('Error cargando datos fiscales', error);
    }
  };

  // --- HANDLERS ---

  const handleGuestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGuestForm({ ...guestForm, [e.target.name]: e.target.value });
  };

  const handleSolicitarCertificadoChange = (checked: boolean) => {
    setSolicitarCertificado(checked);
    if (isAuthenticated && checked && datosFiscales.length === 0) {
      setMostrarFormularioNuevo(true);
    }
  };

  const validarFormulario = (): boolean => {
    if (!isAuthenticated) {
      // Validación simplificada Invitado: Solo Nombre y Email
      if (!guestForm.nombre || !guestForm.email) {
        toast.error('Por favor completa Nombre y Email');
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(guestForm.email)) {
        toast.error('Email inválido');
        return false;
      }
    }

    if (solicitarCertificado) {
      if (!isAuthenticated || mostrarFormularioNuevo) {
        // Si pide certificado, necesitamos dirección completa
        if (!guestForm.direccion || !guestForm.ciudad || !guestForm.codigoPostal) {
          toast.error('Para el certificado fiscal necesitamos tu dirección completa');
          return false;
        }
      } else if (isAuthenticated && !datosFiscalesSeleccionado) {
        toast.error('Selecciona una dirección fiscal guardada');
        return false;
      }
    }

    return true;
  };

  const handleConfirmarCompra = async () => {
    if (!validarFormulario()) return;

    setLoading(true);
    try {
      // Preparamos los items desagrupados para el backend
      const itemsCheckout = cartItems.map((item) => ({
        tipo: 'ENTRADA' as const,
        referenciaId: parseInt(item.id) || 0,
        cantidad: item.cantidad,
        precio: item.precio,
      }));

      const response = await procesarCheckout({
        usuarioId: user?.id || 0,
        metodoPago: selectedPaymentMethod.toUpperCase(),
        donacionExtra: 0,
        items: itemsCheckout,
        solicitarCertificado,
        datosFiscalesId:
          isAuthenticated && !mostrarFormularioNuevo
            ? datosFiscalesSeleccionado || undefined
            : undefined,
      });

      // Simulación de espera de pago
      await new Promise((resolve) => setTimeout(resolve, 1500));

      await confirmarPago(response.compraId, {
        transaccionId: 'DEMO-' + Date.now(),
        estado: 'COMPLETADO',
      });

      setStep('confirmado');
      clearCart();
      toast.success('¡Compra realizada con éxito!');
    } catch (error) {
      console.error(error);
      toast.error('Error al procesar la compra. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const total = getTotalPrice();
  const comision = total * 0.05;
  const totalFinal = total + comision;

  if (authLoading)
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="animate-spin text-[#00A651]" />
      </div>
    );

  // --- VISTA ÉXITO ---
  if (step === 'confirmado') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
        <Card className="max-w-xl w-full p-10 text-center border-green-500/20 shadow-2xl shadow-green-500/10 bg-white dark:bg-slate-900 animate-in fade-in zoom-in duration-500">
          <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            ¡Gracias por tu apoyo!
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mb-8 text-lg leading-relaxed">
            Hemos enviado tus entradas a{' '}
            <strong className="text-slate-900 dark:text-white">
              {isAuthenticated ? user?.email : guestForm.email}
            </strong>
            .
            <br />
            Disfruta del evento.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              size="lg"
              className="border-slate-300 dark:border-slate-700 dark:text-white dark:hover:bg-slate-800"
            >
              Volver al inicio
            </Button>
            {isAuthenticated && (
              <Button
                onClick={() => navigate('/perfil?tab=entradas')}
                size="lg"
                className="bg-[#00A651] hover:bg-[#008a43] text-white"
              >
                Ver mis entradas
              </Button>
            )}
          </div>
        </Card>
      </div>
    );
  }

  // --- VISTA FORMULARIO ---
  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-12 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Cabecera */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Finalizar Compra</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Revisa tus entradas y completa el pago
            </p>
          </div>
          {!isAuthenticated && (
            <Button
              variant="ghost"
              className="text-[#00A651] hover:bg-[#00A651]/10 self-start sm:self-auto"
              asChild
            >
              <Link to="/login?redirect=/checkout">
                <LogIn className="w-4 h-4 mr-2" /> ¿Tienes cuenta? Inicia sesión
              </Link>
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* --- COLUMNA IZQUIERDA (Formularios) --- */}
          <div className="lg:col-span-2 space-y-6">
            {/* 1. TUS DATOS */}
            <Card className="p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                <User className="w-5 h-5 text-[#00A651]" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Tus Datos</h2>
              </div>

              {isAuthenticated ? (
                <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-xl border border-green-100 dark:border-green-900/30 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#00A651] flex items-center justify-center text-white shrink-0">
                    <span className="font-bold text-lg">{user?.nombre?.charAt(0)}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 dark:text-white truncate">
                      {user?.nombre}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                      {user?.email}
                    </p>
                  </div>
                  <div className="ml-auto shrink-0">
                    <ShieldCheck className="text-[#00A651] w-5 h-5" />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="g-nombre" className="text-slate-700 dark:text-slate-300">
                        Nombre Completo
                      </Label>
                      <Input
                        id="g-nombre"
                        name="nombre"
                        placeholder="Ej: María García"
                        value={guestForm.nombre}
                        onChange={handleGuestChange}
                        className="bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-[#00A651]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="g-email" className="text-slate-700 dark:text-slate-300">
                        Correo Electrónico
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 " />
                        <Input
                          id="g-email"
                          name="email"
                          type="email"
                          placeholder="maria@ejemplo.com"
                          className="pl-10 bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-[#00A651]"
                          value={guestForm.email}
                          onChange={handleGuestChange}
                        />
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-500">
                        Aquí enviaremos tus entradas.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* 2. CERTIFICADO FISCAL */}
            <Card className="p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-[#00A651]" />
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Certificado de Donación
                  </h2>
                </div>
                <Switch
                  checked={solicitarCertificado}
                  onCheckedChange={handleSolicitarCertificadoChange}
                />
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg text-sm text-amber-800 dark:text-amber-400 flex gap-2 items-start mb-4 border border-amber-100 dark:border-amber-900/30">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <p>
                  Activa esta opción si deseas recibir un certificado fiscal para desgravar esta
                  donación.
                </p>
              </div>

              {solicitarCertificado && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                  {isAuthenticated && datosFiscales.length > 0 && !mostrarFormularioNuevo ? (
                    <div className="space-y-3">
                      <Label className="text-slate-700 dark:text-slate-300">
                        Dirección Fiscal Guardada
                      </Label>
                      <select
                        className="w-full p-2.5 rounded-lg border bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#00A651] cursor-pointer"
                        value={datosFiscalesSeleccionado || ''}
                        onChange={(e) => setDatosFiscalesSeleccionado(Number(e.target.value))}
                      >
                        {datosFiscales.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.direccion}, {d.ciudad} ({d.nif})
                          </option>
                        ))}
                      </select>
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => setMostrarFormularioNuevo(true)}
                        className="text-[#00A651] p-0 h-auto"
                      >
                        + Usar otra dirección
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2 space-y-2">
                        <Label className="text-slate-700 dark:text-slate-300">
                          Dirección Fiscal
                        </Label>
                        <Input
                          name="direccion"
                          placeholder="Calle Mayor, 123"
                          value={guestForm.direccion}
                          onChange={handleGuestChange}
                          className="bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-700 dark:text-slate-300">Ciudad</Label>
                        <Input
                          name="ciudad"
                          placeholder="Málaga"
                          value={guestForm.ciudad}
                          onChange={handleGuestChange}
                          className="bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-700 dark:text-slate-300">Código Postal</Label>
                        <Input
                          name="codigoPostal"
                          placeholder="29000"
                          value={guestForm.codigoPostal}
                          onChange={handleGuestChange}
                          className="bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                        />
                      </div>
                      {isAuthenticated && (
                        <div className="md:col-span-2 flex justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setMostrarFormularioNuevo(false)}
                            className="text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            Cancelar
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </Card>

            {/* 3. PAGO */}
            <Card className="p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                <CreditCard className="w-5 h-5 text-[#00A651]" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Pago Seguro</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div
                  className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all ${selectedPaymentMethod === 'tarjeta' ? 'border-[#00A651] bg-[#00A651]/5 dark:bg-[#00A651]/10' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-950'}`}
                  onClick={() => setSelectedPaymentMethod('tarjeta')}
                >
                  <CreditCard
                    className={
                      selectedPaymentMethod === 'tarjeta' ? 'text-[#00A651]' : 'text-slate-400'
                    }
                    size={28}
                  />
                  <span className="font-medium text-sm text-slate-900 dark:text-white">
                    Tarjeta
                  </span>
                </div>
                <div
                  className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all ${selectedPaymentMethod === 'bizum' ? 'border-[#00A651] bg-[#00A651]/5 dark:bg-[#00A651]/10' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-950'}`}
                  onClick={() => setSelectedPaymentMethod('bizum')}
                >
                  <Smartphone
                    className={
                      selectedPaymentMethod === 'bizum' ? 'text-[#00A651]' : 'text-slate-400'
                    }
                    size={28}
                  />
                  <span className="font-medium text-sm text-slate-900 dark:text-white">Bizum</span>
                </div>
                <div
                  className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all ${selectedPaymentMethod === 'paypal' ? 'border-[#00A651] bg-[#00A651]/5 dark:bg-[#00A651]/10' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-950'}`}
                  onClick={() => setSelectedPaymentMethod('paypal')}
                >
                  <Wallet
                    className={
                      selectedPaymentMethod === 'paypal' ? 'text-[#00A651]' : 'text-slate-400'
                    }
                    size={28}
                  />
                  <span className="font-medium text-sm text-slate-900 dark:text-white">PayPal</span>
                </div>
              </div>
            </Card>
          </div>

          {/* --- COLUMNA DERECHA (Resumen) --- */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-none">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
                <ShoppingCart className="w-5 h-5 text-[#00A651]" />
                Tu Pedido
              </h3>

              <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                {groupedItems.map((group, idx) => (
                  <div
                    key={idx}
                    className="flex gap-3 text-sm group p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800"
                  >
                    {group.eventoImagen ? (
                      <img
                        src={group.eventoImagen}
                        alt=""
                        className="w-12 h-12 rounded object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded shrink-0 flex items-center justify-center">
                        <Ticket size={20} className="text-slate-400" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 dark:text-white truncate max-w-[180px]">
                        {group.count} x {group.tipoEntradaNombre}
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 text-xs truncate">
                        {group.eventoNombre}
                      </p>
                      {group.asientos.length > 0 && (
                        <p className="text-[10px] text-[#00A651] mt-1 wrap-break-word leading-tight">
                          Asientos: {group.asientos.join(', ')}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col items-end justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {(group.precio * group.count).toFixed(2)}€
                      </span>
                      <button
                        onClick={() => removeGroup(group.originalIds)}
                        className="text-slate-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                        title="Eliminar todo"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 py-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between text-slate-600 dark:text-slate-400 text-sm">
                  <span>Subtotal</span>
                  <span>{total.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400 text-sm">
                  <span>Gastos de gestión (5%)</span>
                  <span>{comision.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between font-bold text-xl text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span>Total</span>
                  <span className="text-[#00A651]">{totalFinal.toFixed(2)}€</span>
                </div>
              </div>

              <Button
                className="w-full mt-6 bg-[#00A651] hover:bg-[#008a43] text-white font-bold h-12 shadow-lg shadow-green-900/10 hover:shadow-green-900/20 transition-all rounded-xl"
                onClick={handleConfirmarCompra}
                disabled={loading}
              >
                {loading ? <Loader2 className="animate-spin" /> : `Pagar ${totalFinal.toFixed(2)}€`}
              </Button>

              <p className="text-xs text-center text-slate-400 dark:text-slate-500 mt-4 flex items-center justify-center gap-1">
                <ShieldCheck size={12} /> Compra 100% segura
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
