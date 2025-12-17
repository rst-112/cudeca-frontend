import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import { StripePaymentModal } from '../components/payment/StripePaymentModal';

// --- SERVICIOS ---
import {
  obtenerEntradasUsuario,
  descargarPdfEntrada,
  obtenerHistorialCompras,
  actualizarPerfil,
  descargarPdfCompra,
  obtenerMonedero,
  obtenerMovimientosMonedero,
  formatearSaldo,
  type CompraResumen,
  type Monedero,
  type MovimientoMonedero,
} from '../services/perfil.service';

import {
  obtenerDatosFiscalesUsuario,
  crearDatosFiscales,
  actualizarDatosFiscales,
  eliminarDatosFiscales,
} from '../services/checkout.service';

// --- TIPOS Y CONTEXTO ---
import type { Entrada, DatosFiscales } from '../types/checkout.types';
import { useAuth } from '../context/AuthContext';

// --- ICONOS ---
import {
  Ticket,
  FileText,
  Wallet,
  Download,
  Edit2,
  Trash2,
  Plus,
  ShoppingBag,
  User,
  Save,
  Loader2,
  MapPin,
  Calendar,
  LogOut,
  Check,
  Heart,
  ArrowDownLeft,
  ArrowUpRight,
} from 'lucide-react';

// =============================================================================
// UTILIDADES Y VALIDACIONES
// =============================================================================

// Regex para NIF/NIE (Básico: 8 números + letra o Letra + 7 números + letra)
const NIF_REGEX = /^[XYZ0-9][0-9]{7}[A-Z]$/i;

function esNifValido(nif: string): boolean {
  return NIF_REGEX.test(nif);
}

interface FormErrors {
  nombreCompleto?: string;
  nif?: string;
  direccion?: string;
  ciudad?: string;
  codigoPostal?: string;
  pais?: string;
}

// =============================================================================
// COMPONENTE AUXILIAR: INPUT DE FORMULARIO CON ERROR
// =============================================================================
function FormField({
  label,
  value,
  onChange,
  error,
  placeholder,
  className,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  error?: string;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label className={`mb-1.5 block ${error ? 'text-red-500' : ''}`}>{label}</Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={
          error ? 'border-red-500 focus-visible:ring-red-500 bg-red-50 dark:bg-red-900/10' : ''
        }
      />
      {error && (
        <p className="text-xs text-red-500 mt-1 font-medium animate-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
}

// =============================================================================
// COMPONENTE: TARJETA DE ENTRADA
// =============================================================================
function TicketCard({
  entrada,
  onDownload,
  isPast,
}: {
  entrada: Entrada;
  onDownload: (id: number) => void;
  isPast: boolean;
}) {
  const cardBorderClass = isPast
    ? 'border-l-slate-400 dark:border-l-slate-600'
    : 'border-l-[#00A651]';

  const badgeClass = isPast
    ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
    : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';

  const iconColorClass = isPast ? 'text-slate-400' : 'text-[#00A651]';

  return (
    <Card
      className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg border-l-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 ${cardBorderClass}`}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 pr-4">
            <span
              className={`inline-block text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider mb-2 ${badgeClass}`}
            >
              {entrada.estadoEntrada}
            </span>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight line-clamp-2">
              {entrada.eventoNombre}
            </h3>
          </div>

          <div className="w-16 h-16 bg-white p-1 rounded-lg shadow-sm shrink-0 border border-slate-100">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${entrada.codigoQR}`}
              alt="QR"
              className="w-full h-full object-contain mix-blend-multiply opacity-90"
            />
          </div>
        </div>

        <div className="space-y-3 text-sm mb-6">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <Calendar size={16} className={iconColorClass} />
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {new Date(entrada.fechaEvento).toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <MapPin size={16} className={iconColorClass} />
            <span className="text-slate-700 dark:text-slate-300">
              Asiento:{' '}
              <strong className="text-slate-900 dark:text-white font-semibold">
                {entrada.asientoNumero}
              </strong>
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button
            variant="outline"
            size="sm"
            className={`w-full font-medium transition-colors ${
              isPast
                ? 'text-slate-500 border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800'
                : 'border-[#00A651] text-[#00A651] hover:bg-[#00A651]/10 dark:hover:bg-[#00A651]/20'
            }`}
            onClick={() => onDownload(entrada.id)}
          >
            <Download className="w-4 h-4 mr-2" /> Descargar Entrada PDF
          </Button>
        </div>
      </div>

      <div className="absolute top-1/2 -left-3 w-6 h-6 rounded-full bg-[#f8fafc] dark:bg-[#020617] border-r border-slate-200 dark:border-slate-800 z-10" />
      <div className="absolute top-1/2 -right-3 w-6 h-6 rounded-full bg-[#f8fafc] dark:bg-[#020617] border-l border-slate-200 dark:border-slate-800 z-10" />
    </Card>
  );
}

// =============================================================================
// COMPONENTE: MODAL DETALLES COMPRA
// =============================================================================
function DetallesCompraModal({ compra, onClose }: { compra: CompraResumen; onClose: () => void }) {
  const { user } = useAuth();

  if (!compra) return null;

  const handleDescargarResumen = async () => {
    if (!user?.id) return;
    try {
      const toastId = toast.loading('Generando documento...');
      const blob = await descargarPdfCompra(user.id, compra.id);

      const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `resumen_compra_${compra.id}.pdf`);
      document.body.appendChild(link);
      link.click();

      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.dismiss(toastId);
      toast.success('Resumen descargado correctamente');
    } catch (error) {
      console.error(error);
      toast.dismiss();
      toast.error('Error al descargar el resumen');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 p-4">
      <Card className="w-full max-w-md bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Detalles de Compra</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <span className="text-xl leading-none">×</span>
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="flex justify-between items-center py-2 border-b border-dashed border-slate-200 dark:border-slate-800">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Estado del pedido
            </span>
            <span
              className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${
                compra.status === 'COMPLETADA'
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                  : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400'
              }`}
            >
              {compra.status}
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Concepto
              </span>
              <p className="text-slate-900 dark:text-slate-200 font-medium mt-1">{compra.title}</p>
            </div>
            <div className="flex justify-between text-sm pt-2">
              <span className="text-slate-500">Cantidad</span>
              <span className="text-slate-900 dark:text-white font-medium">{compra.tickets}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Fecha</span>
              <span className="text-slate-900 dark:text-white font-medium">{compra.date}</span>
            </div>
          </div>

          <div className="pt-4 mt-2 border-t-2 border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <span className="font-bold text-lg text-slate-900 dark:text-white">Total Pagado</span>
            <span className="text-2xl font-extrabold text-[#00753e]">{compra.total}</span>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-950/30 border-t border-slate-100 dark:border-slate-800 flex gap-3">
          <Button
            variant="outline"
            className="flex-1 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={onClose}
          >
            Cerrar
          </Button>
          <Button
            className="flex-1 bg-[#00753e] hover:bg-[#005a2e] text-white shadow-md hover:shadow-lg transition-all"
            onClick={handleDescargarResumen}
          >
            <Download size={16} className="mr-2" /> Descargar Resumen PDF
          </Button>
        </div>
      </Card>
    </div>
  );
}

// =============================================================================
// COMPONENTE PRINCIPAL
// =============================================================================
export default function PerfilUsuario() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isLoading: authLoading, isAuthenticated, logout, updateUser } = useAuth();

  const tabActual = searchParams.get('tab') || 'entradas';

  // --- ESTADOS ---
  const [entradas, setEntradas] = useState<Entrada[]>([]);
  const [datosFiscales, setDatosFiscales] = useState<DatosFiscales[]>([]);
  const [compras, setCompras] = useState<CompraResumen[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [compraSeleccionada, setCompraSeleccionada] = useState<CompraResumen | null>(null);

  // Monedero Real
  const [monedero, setMonedero] = useState<Monedero | null>(null);
  const [movimientos, setMovimientos] = useState<MovimientoMonedero[]>([]);
  const [recargaCantidad, setRecargaCantidad] = useState('');
  const [showRecargaForm, setShowRecargaForm] = useState(false);

  // Estados para Stripe
  const [showStripeModal, setShowStripeModal] = useState(false);
  const [amountToPay, setAmountToPay] = useState(0);

  // Perfil
  const [editandoPerfil, setEditandoPerfil] = useState(false);
  const [datosPerfil, setDatosPerfil] = useState({ nombre: '', email: '' });

  // Datos Fiscales
  const [modoEdicion, setModoEdicion] = useState<number | null>(null);
  const [mostrarFormularioNuevo, setMostrarFormularioNuevo] = useState(false);
  const [formularioDatos, setFormularioDatos] = useState<DatosFiscales>({
    nif: '',
    nombreCompleto: '',
    direccion: '',
    ciudad: '',
    codigoPostal: '',
    pais: 'España',
    alias: '',
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const planesSuscripcion = [
    {
      id: 1,
      name: 'Socio Amigo',
      price: 10,
      billing: 'mes',
      desc: 'Colaboración básica',
      features: ['Acceso a eventos exclusivos', 'Boletín mensual', 'Certificado de donación'],
      isActive: true,
      ctaText: 'Plan Actual',
    },
    {
      id: 2,
      name: 'Socio Protector',
      price: 25,
      billing: 'mes',
      desc: 'Mayor impacto',
      features: [
        'Todo de Socio Amigo',
        'Invitaciones a eventos VIP',
        '10% descuento en tienda',
        'Reconocimiento en web',
      ],
      isActive: false,
      ctaText: 'Mejorar Plan',
    },
    {
      id: 3,
      name: 'Socio Benefactor',
      price: 50,
      billing: 'mes',
      desc: 'Máximo compromiso',
      features: ['Todo de Socio Protector', 'Cena anual privada', 'Asesoramiento personalizado'],
      isActive: false,
      ctaText: 'Mejorar Plan',
    },
  ];

  // --- EFECTOS ---
  useEffect(() => {
    if (user) setDatosPerfil({ nombre: user.nombre || '', email: user.email || '' });
  }, [user]);

  useEffect(() => {
    if (!mostrarFormularioNuevo) setFormErrors({});
  }, [mostrarFormularioNuevo]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.error('Debes iniciar sesión para ver tu perfil');
      navigate('/login');
    }
  }, [authLoading, isAuthenticated, navigate]);

  // Carga de datos según la pestaña activa
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      if (tabActual === 'entradas') cargarEntradas(user.id);
      else if (tabActual === 'fiscales') cargarDatosFiscales(user.id);
      else if (tabActual === 'compras') cargarHistorialCompras(user.id);
      else if (tabActual === 'monedero') cargarMonederoYMovimientos(user.id);
    }
  }, [tabActual, isAuthenticated, user]);

  // --- CARGAS ASÍNCROAS ---
  const cargarEntradas = async (id: number) => {
    setDataLoading(true);
    try {
      setEntradas(await obtenerEntradasUsuario(id));
    } catch {
      toast.error('Error al cargar entradas');
    } finally {
      setDataLoading(false);
    }
  };

  const cargarDatosFiscales = async (id: number) => {
    setDataLoading(true);
    try {
      setDatosFiscales(await obtenerDatosFiscalesUsuario(id));
    } catch {
      toast.error('Error al cargar datos fiscales');
    } finally {
      setDataLoading(false);
    }
  };

  const cargarHistorialCompras = async (id: number) => {
    setDataLoading(true);
    try {
      setCompras(await obtenerHistorialCompras(id));
    } catch {
      toast.error('Error al cargar historial');
    } finally {
      setDataLoading(false);
    }
  };

  const cargarMonederoYMovimientos = async (id: number) => {
    setDataLoading(true);
    try {
      const datosMonedero = await obtenerMonedero(id);
      setMonedero(datosMonedero);
      const datosMovimientos = await obtenerMovimientosMonedero(id);
      setMovimientos(datosMovimientos);
    } catch (error) {
      console.error(error);
      toast.error('Error al cargar información del monedero');
    } finally {
      setDataLoading(false);
    }
  };

  // --- HANDLERS (Perfil, Pdf, Monedero) ---

  const handleRecargarSaldo = (e: React.FormEvent) => {
    e.preventDefault();
    const cantidad = parseFloat(recargaCantidad);

    if (isNaN(cantidad) || cantidad <= 0) {
      toast.error('Cantidad inválida');
      return;
    }

    // Configurar y abrir el modal de Stripe
    setAmountToPay(cantidad);
    setShowStripeModal(true);
  };

  const handlePaymentSuccess = useCallback(async () => {
    if (user?.id) {
      // Refrescar datos del backend tras el pago exitoso
      await cargarMonederoYMovimientos(user.id);
      toast.success('¡Saldo recargado correctamente!');
    }

    // Limpiar estados de UI
    setShowRecargaForm(false);
    setRecargaCantidad('');
    setShowStripeModal(false);
  }, [user]);

  const handleDescargarPdf = async (id: number) => {
    if (!user?.id) return;
    try {
      const blob = await descargarPdfEntrada(user.id, id);
      const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `entrada_cudeca_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Entrada descargada correctamente');
    } catch {
      toast.error('Error al descargar la entrada');
    }
  };

  const handleGuardarPerfil = async () => {
    if (!user?.id) return;
    if (!datosPerfil.nombre.trim()) {
      toast.error('El nombre no puede estar vacío');
      return;
    }
    try {
      const toastId = toast.loading('Guardando cambios...');
      await actualizarPerfil(user.id, { nombre: datosPerfil.nombre });
      updateUser({ nombre: datosPerfil.nombre });
      toast.dismiss(toastId);
      toast.success('Perfil actualizado correctamente');
      setEditandoPerfil(false);
    } catch {
      toast.dismiss();
      toast.error('Error al actualizar el perfil');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Sesión cerrada correctamente');
  };

  // --- HANDLERS DATOS FISCALES ---
  const handleGuardarDatos = async () => {
    if (!user?.id) return;

    // Validación Inline
    const newErrors: FormErrors = {};
    let hasError = false;

    if (!formularioDatos.nif?.trim()) {
      newErrors.nif = 'El NIF es obligatorio';
      hasError = true;
    } else if (!esNifValido(formularioDatos.nif)) {
      newErrors.nif = 'Formato de NIF/NIE inválido';
      hasError = true;
    }

    if (!formularioDatos.nombreCompleto?.trim()) {
      newErrors.nombreCompleto = 'El nombre es obligatorio';
      hasError = true;
    }
    if (!formularioDatos.direccion?.trim()) {
      newErrors.direccion = 'La dirección es obligatoria';
      hasError = true;
    }
    if (!formularioDatos.ciudad?.trim()) {
      newErrors.ciudad = 'La ciudad es obligatoria';
      hasError = true;
    }

    const cpRegex = /^[0-9]{5}$/;
    if (!formularioDatos.codigoPostal?.trim()) {
      newErrors.codigoPostal = 'El C.Postal es obligatorio';
      hasError = true;
    } else if (!cpRegex.test(formularioDatos.codigoPostal)) {
      newErrors.codigoPostal = 'Debe tener 5 dígitos';
      hasError = true;
    }

    setFormErrors(newErrors);

    if (hasError) return;

    try {
      const toastId = toast.loading('Guardando datos...');

      if (modoEdicion && modoEdicion !== null) {
        await actualizarDatosFiscales(modoEdicion, user.id, formularioDatos);
      } else {
        await crearDatosFiscales(user.id, formularioDatos);
      }

      toast.dismiss(toastId);
      toast.success('Datos guardados correctamente');

      setMostrarFormularioNuevo(false);
      setFormularioDatos({
        nif: '',
        nombreCompleto: '',
        direccion: '',
        ciudad: '',
        codigoPostal: '',
        pais: 'España',
        alias: '',
      });
      setModoEdicion(null);
      setFormErrors({});
      cargarDatosFiscales(user.id);
    } catch (error) {
      console.error(error);
      toast.dismiss();
      const msg =
        error instanceof Error && 'response' in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message ||
            'Error al guardar'
          : 'Error al guardar';
      toast.error(msg);
    }
  };

  const handleEliminarDatos = async (id: number) => {
    if (!user?.id || !confirm('¿Eliminar esta dirección?')) return;
    try {
      await eliminarDatosFiscales(id, user.id);
      toast.success('Eliminado');
      cargarDatosFiscales(user.id);
    } catch {
      toast.error('Error al eliminar');
    }
  };

  const handleEditarDatos = (d: DatosFiscales) => {
    setFormularioDatos(d);
    setModoEdicion(d.id || null);
    setMostrarFormularioNuevo(true);
  };

  const handleCancelarEdicion = () => {
    setModoEdicion(null);
    setMostrarFormularioNuevo(false);
    setFormularioDatos({
      nif: '',
      nombreCompleto: '',
      direccion: '',
      ciudad: '',
      codigoPostal: '',
      pais: 'España',
      alias: '',
    });
  };

  const quickAmounts = [10, 25, 50, 100];

  if (authLoading)
    return (
      <div className="flex justify-center h-screen items-center">
        <Loader2 className="animate-spin text-[#00A651]" />
      </div>
    );
  if (!user) return null;

  const entradasActivas = entradas.filter((e) => e.estadoEntrada === 'VALIDA');
  const entradasHistorial = entradas.filter((e) => e.estadoEntrada !== 'VALIDA');

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl animate-in fade-in duration-500">
      {/* HEADER DE PERFIL */}
      <div className="mb-12 bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-[#00A651] shadow-inner">
            <User size={40} />
          </div>
          <div>
            {editandoPerfil ? (
              <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-left-2">
                <Input
                  value={datosPerfil.nombre}
                  onChange={(e) => setDatosPerfil({ ...datosPerfil, nombre: e.target.value })}
                  className="text-2xl font-bold h-10 w-full md:w-[300px]"
                  placeholder="Tu nombre completo"
                />
                <Input
                  value={datosPerfil.email}
                  disabled
                  className="bg-slate-50 dark:bg-slate-800 text-slate-500"
                />
              </div>
            ) : (
              <>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-1">
                  {user.nombre}
                </h1>
                <p className="text-gray-500 dark:text-gray-400 font-medium">{user.email}</p>
                <div className="mt-3 flex gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    Socio Amigo
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex gap-3">
          {editandoPerfil ? (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setEditandoPerfil(false)}
                className="border-slate-300 text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleGuardarPerfil}
                className="bg-[#00753e] hover:bg-[#005a2e] text-white shadow-md"
              >
                <Save size={16} className="mr-2" /> Guardar
              </Button>
            </div>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => setEditandoPerfil(true)}
                className="border-slate-300 dark:border-slate-700 hover:border-[#00753e] dark:hover:border-[#00753e]"
              >
                <Edit2 size={16} className="mr-2" /> Editar Perfil
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:border-red-800"
              >
                <LogOut size={16} className="mr-2" /> Cerrar Sesión
              </Button>
            </>
          )}
        </div>
      </div>

      <Tabs
        value={tabActual}
        onValueChange={(value) => setSearchParams({ tab: value })}
        className="w-full"
      >
        <TabsList className="mb-8 w-full justify-start overflow-x-auto bg-transparent border-b border-slate-200 dark:border-slate-800 rounded-none h-auto p-0 scrollbar-hide">
          {[
            { value: 'entradas', icon: Ticket, label: 'Mis Entradas' },
            { value: 'compras', icon: ShoppingBag, label: 'Historial' },
            { value: 'fiscales', icon: FileText, label: 'Datos Fiscales' },
            { value: 'monedero', icon: Wallet, label: 'Monedero' },
            { value: 'suscripcion', icon: Heart, label: 'Suscripción' },
          ].map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="cursor-pointer px-6 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-[#00753e] data-[state=active]:text-[#00753e] data-[state=active]:bg-transparent shadow-none transition-all hover:text-[#00753e]/80"
            >
              <tab.icon className="w-4 h-4 mr-2" /> {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* ... TABS DE ENTRADAS, COMPRAS Y FISCALES IGUALES ... */}

        <TabsContent
          value="entradas"
          className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-12"
        >
          {dataLoading ? (
            <div className="py-20 flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-[#00A651]" />
            </div>
          ) : entradas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-slate-50 dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
              <Ticket className="w-12 h-12 text-slate-300 mb-4" />
              <p className="text-slate-500 font-medium">No tienes entradas activas.</p>
              <Button variant="link" className="text-[#00A651]" onClick={() => navigate('/')}>
                Ver eventos disponibles
              </Button>
            </div>
          ) : (
            <>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                  <Ticket className="text-[#00A651]" /> Próximos Eventos
                </h3>
                {entradasActivas.length === 0 ? (
                  <p className="text-slate-500 italic mb-8">No tienes entradas válidas.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {entradasActivas.map((e) => (
                      <TicketCard
                        key={e.id}
                        entrada={e}
                        onDownload={handleDescargarPdf}
                        isPast={false}
                      />
                    ))}
                  </div>
                )}
              </div>
              {entradasHistorial.length > 0 && (
                <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-400 mb-6 flex items-center gap-2 opacity-80">
                    <Calendar className="text-slate-400" /> Historial
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 opacity-75">
                    {entradasHistorial.map((e) => (
                      <TicketCard
                        key={e.id}
                        entrada={e}
                        onDownload={handleDescargarPdf}
                        isPast={true}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent
          value="compras"
          className="animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          <Card className="overflow-hidden border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
              <h3 className="font-bold text-slate-700 dark:text-slate-200">
                Últimas Transacciones
              </h3>
            </div>
            {dataLoading ? (
              <div className="py-20 flex justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#00A651]" />
              </div>
            ) : compras.length === 0 ? (
              <div className="p-12 text-center text-slate-500 dark:text-slate-400">
                <p>No hay compras.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {compras.map((compra) => (
                  <div
                    key={compra.id}
                    className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors bg-white dark:bg-slate-900"
                  >
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900 dark:text-white text-lg">
                        {compra.title}
                      </h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-mono mt-1">
                        {compra.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-8">
                      <span className="font-bold text-[#00753e] text-lg">{compra.total}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCompraSeleccionada(compra)}
                        className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                      >
                        Ver Detalles
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent
          value="fiscales"
          className="animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          {/* ... Contenido Fiscales (sin cambios estructurales mayores, solo integración de servicios) ... */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Mis Direcciones de Facturación
            </h2>
            {!mostrarFormularioNuevo && (
              <Button
                onClick={() => {
                  setModoEdicion(null);
                  setFormularioDatos({
                    nif: '',
                    nombreCompleto: '',
                    direccion: '',
                    ciudad: '',
                    codigoPostal: '',
                    pais: 'España',
                    alias: '',
                  });
                  setFormErrors({});
                  setMostrarFormularioNuevo(true);
                }}
                className="bg-[#00753e] hover:bg-[#005a2e] text-white shadow-md"
              >
                <Plus size={20} className="mr-2" /> Añadir Nueva
              </Button>
            )}
          </div>

          {mostrarFormularioNuevo && (
            <Card className="mb-8 p-6 border-2 border-[#00753e]/20 animate-in fade-in zoom-in-95 bg-slate-50 dark:bg-slate-900">
              <h3 className="font-bold text-lg mb-4 text-[#00753e] flex items-center gap-2">
                {modoEdicion ? <Edit2 size={18} /> : <Plus size={18} />}
                {modoEdicion ? 'Editar Dirección' : 'Nueva Dirección Fiscal'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <FormField
                  label="Alias (Opcional)"
                  value={formularioDatos.alias || ''}
                  onChange={(val) => setFormularioDatos({ ...formularioDatos, alias: val })}
                  placeholder="Ej: Oficina, Casa..."
                  className="col-span-1"
                />
                <FormField
                  label="NIF/CIF *"
                  value={formularioDatos.nif}
                  onChange={(val) => {
                    setFormularioDatos({ ...formularioDatos, nif: val.toUpperCase() });
                    if (formErrors.nif) setFormErrors({ ...formErrors, nif: undefined });
                  }}
                  error={formErrors.nif}
                  placeholder="12345678A"
                  className="col-span-1"
                />
                <FormField
                  label="Nombre / Razón Social *"
                  value={formularioDatos.nombreCompleto}
                  onChange={(val) => {
                    setFormularioDatos({ ...formularioDatos, nombreCompleto: val });
                    if (formErrors.nombreCompleto)
                      setFormErrors({ ...formErrors, nombreCompleto: undefined });
                  }}
                  error={formErrors.nombreCompleto}
                  className="md:col-span-2"
                />
                <FormField
                  label="Dirección *"
                  value={formularioDatos.direccion}
                  onChange={(val) => {
                    setFormularioDatos({ ...formularioDatos, direccion: val });
                    if (formErrors.direccion)
                      setFormErrors({ ...formErrors, direccion: undefined });
                  }}
                  error={formErrors.direccion}
                  className="md:col-span-2"
                />
                <FormField
                  label="Ciudad *"
                  value={formularioDatos.ciudad}
                  onChange={(val) => {
                    setFormularioDatos({ ...formularioDatos, ciudad: val });
                    if (formErrors.ciudad) setFormErrors({ ...formErrors, ciudad: undefined });
                  }}
                  error={formErrors.ciudad}
                />
                <FormField
                  label="C. Postal *"
                  value={formularioDatos.codigoPostal}
                  onChange={(val) => {
                    setFormularioDatos({ ...formularioDatos, codigoPostal: val });
                    if (formErrors.codigoPostal)
                      setFormErrors({ ...formErrors, codigoPostal: undefined });
                  }}
                  error={formErrors.codigoPostal}
                />
              </div>
              <div className="flex justify-end gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                <Button
                  variant="outline"
                  onClick={handleCancelarEdicion}
                  className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleGuardarDatos}
                  className="bg-[#00753e] hover:bg-[#005a2e] text-white"
                >
                  Guardar Dirección
                </Button>
              </div>
            </Card>
          )}

          {dataLoading ? (
            <div className="py-20 flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-[#00A651]" />
            </div>
          ) : datosFiscales.length === 0 && !mostrarFormularioNuevo ? (
            <div className="text-center py-20 bg-slate-50 dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
              <FileText className="mx-auto h-12 w-12 text-slate-300 mb-3" />
              <p className="text-slate-500">No tienes direcciones guardadas.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {datosFiscales.map((item) => (
                <div
                  key={item.id}
                  className="relative border rounded-xl p-6 transition-all hover:shadow-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                >
                  <div className="pb-4 border-b border-slate-200 dark:border-slate-700 mb-4">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                      {item.alias || item.nombreCompleto}
                    </h3>
                    <span className="text-xs font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      {item.nif}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm text-slate-600 dark:text-slate-300 mb-6">
                    <p className="font-medium text-slate-900 dark:text-white">
                      {item.nombreCompleto}
                    </p>
                    <p>{item.direccion}</p>
                    <p>
                      {item.ciudad}, {item.codigoPostal}
                    </p>
                    <p>{item.pais}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditarDatos(item)}
                      className="flex-1 hover:border-[#00753e] hover:text-[#00753e]"
                    >
                      <Edit2 size={14} className="mr-2" /> Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEliminarDatos(item.id!)}
                      className="w-10 px-0 text-red-500 hover:bg-red-50 hover:border-red-200"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent
          value="monedero"
          className="animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          {!showRecargaForm ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Tarjeta de Saldo */}
              <Card className="lg:col-span-1 p-8 text-center border-dashed bg-slate-50/50 dark:bg-slate-900/50 h-fit">
                <div className="inline-flex p-5 bg-green-100 dark:bg-green-900/20 rounded-full mb-6 ring-8 ring-green-50 dark:ring-green-900/10">
                  <Wallet className="w-12 h-12 text-[#00753e]" />
                </div>
                <h3 className="text-4xl font-bold mb-2 text-slate-900 dark:text-white">
                  {monedero ? (
                    formatearSaldo(monedero)
                  ) : (
                    <Loader2 className="animate-spin inline" />
                  )}
                </h3>
                <p className="text-gray-500 mb-8">Saldo disponible.</p>
                <Button
                  onClick={() => setShowRecargaForm(true)}
                  className="bg-[#00753e] hover:bg-[#005a2e] text-white px-8 h-12 text-lg w-full"
                >
                  Recargar Saldo
                </Button>
              </Card>

              {/* Historial de Movimientos */}
              <Card className="lg:col-span-2 p-6 bg-white dark:bg-slate-900">
                <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">
                  Movimientos Recientes
                </h3>
                {dataLoading ? (
                  <div className="py-10 flex justify-center">
                    <Loader2 className="animate-spin text-[#00A651]" />
                  </div>
                ) : movimientos.length === 0 ? (
                  <p className="text-slate-500 text-center py-8">No hay movimientos recientes.</p>
                ) : (
                  <div className="space-y-4">
                    {movimientos.map((mov) => {
                      // 1. Normalizamos la lógica: Es ingreso si el tipo es 'ABONO'
                      const esIngreso = mov.tipo === 'ABONO';

                      return (
                        <div
                          key={mov.id}
                          className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 rounded-full ${
                                esIngreso
                                  ? 'bg-green-100 text-green-600'
                                  : 'bg-red-100 text-red-600'
                              }`}
                            >
                              {esIngreso ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                            </div>
                            <div>
                              <p className="font-medium text-slate-900 dark:text-white">
                                {/* Usamos 'referencia' en lugar de 'descripcion' */}
                                {mov.referencia ||
                                  (esIngreso ? 'Recarga de saldo' : 'Pago de entrada')}
                              </p>
                              <p className="text-xs text-slate-500">
                                {new Date(mov.fecha).toLocaleDateString()} •{' '}
                                {new Date(mov.fecha).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>

                          {/* AQUÍ ESTABA EL ERROR: Cambiamos mov.monto por mov.importe */}
                          <span
                            className={`font-bold ${
                              esIngreso ? 'text-green-600' : 'text-slate-900 dark:text-white'
                            }`}
                          >
                            {esIngreso ? '+' : '-'}
                            {/* Protección adicional: si importe es null, muestra 0 */}
                            {mov.importe ? mov.importe.toFixed(2) : '0.00'}€
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            </div>
          ) : (
            <div className="max-w-lg mx-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-xl animate-in fade-in zoom-in-95">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Añadir Saldo</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowRecargaForm(false)}
                  className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                >
                  Cancelar
                </Button>
              </div>
              <form onSubmit={handleRecargarSaldo} className="space-y-8">
                <div>
                  <Label>Cantidad</Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      €
                    </span>
                    <Input
                      type="number"
                      step="1"
                      min="5"
                      value={recargaCantidad}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        if (!isNaN(val) && val < 0) return;
                        setRecargaCantidad(e.target.value);
                      }}
                      className="pl-10 h-14 text-2xl font-bold [&::-webkit-inner-spin-button]:cursor-pointer [&::-webkit-outer-spin-button]:cursor-pointer"
                      placeholder="5.00"
                      autoFocus
                    />
                  </div>
                </div>
                <div>
                  <Label>Rápido</Label>
                  <div className="grid grid-cols-4 gap-3">
                    {quickAmounts.map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setRecargaCantidad(amt.toString())}
                        className={`py-3 rounded-lg border cursor-pointer transition-all ${recargaCantidad === amt.toString() ? 'border-[#00753e] bg-[#00753e] text-white' : 'border-slate-200 bg-white text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 hover:border-[#00753e] dark:hover:border-[#00753e]'}`}
                      >
                        {amt}€
                      </button>
                    ))}
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full h-14 text-lg font-bold bg-[#00753e] text-white hover:bg-[#005a2e]"
                >
                  Pagar con Tarjeta (Stripe)
                </Button>
              </form>
            </div>
          )}
        </TabsContent>

        <TabsContent
          value="suscripcion"
          className="animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          {/* ... (Contenido suscripción igual) ... */}
          <div className="space-y-10">
            <div className="text-center max-w-2xl mx-auto py-4">
              <h2 className="text-3xl font-bold mb-3 text-slate-900 dark:text-white">
                Planes de Colaboración
              </h2>
              <p className="text-slate-500 text-lg">
                Tu ayuda constante nos permite seguir cuidando. Elige el plan que mejor se adapte a
                ti.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {planesSuscripcion.map((plan) => (
                <div
                  key={plan.id}
                  className={`flex flex-col relative rounded-2xl overflow-hidden border transition-all duration-300 ${plan.isActive ? 'border-[#00753e] ring-2 ring-[#00753e] shadow-xl scale-105 z-10' : 'border-slate-200 dark:border-slate-800 hover:shadow-lg hover:-translate-y-1 bg-white dark:bg-slate-900'}`}
                >
                  {plan.isActive && (
                    <div className="bg-[#00753e] text-white text-xs font-bold text-center py-2 uppercase tracking-widest">
                      Plan Actual
                    </div>
                  )}
                  <div className="p-8 flex flex-col h-full">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                      {plan.name}
                    </h3>
                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="text-4xl font-extrabold text-[#00753e]">{plan.price}€</span>
                      <span className="text-sm text-slate-500 font-medium">/{plan.billing}</span>
                    </div>
                    <p className="text-sm text-slate-500 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                      {plan.desc}
                    </p>
                    <ul className="space-y-4 mb-8 flex-1">
                      {plan.features.map((f, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300"
                        >
                          <div className="mt-0.5 rounded-full bg-green-100 p-0.5 text-[#00753e]">
                            <Check size={12} strokeWidth={3} />
                          </div>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={`w-full h-12 font-bold ${plan.isActive ? 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200' : 'bg-[#00753e] text-white hover:bg-[#005a2e] shadow-lg hover:shadow-green-900/20'}`}
                      disabled={plan.isActive}
                    >
                      {plan.ctaText}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {compraSeleccionada && (
        <DetallesCompraModal
          compra={compraSeleccionada}
          onClose={() => setCompraSeleccionada(null)}
        />
      )}

      {/* --- INTEGRACIÓN STRIPE --- */}
      {showStripeModal && user?.id && (
        <StripePaymentModal
          isOpen={showStripeModal}
          onClose={() => setShowStripeModal(false)}
          usuarioId={user.id}
          amount={amountToPay}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
