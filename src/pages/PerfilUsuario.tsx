import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';

// --- SERVICIOS ---
import {
  obtenerEntradasUsuario,
  descargarPdfEntrada,
  obtenerHistorialCompras,
  type CompraResumen,
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
  Star,
  ShoppingBag,
  User,
  Save,
  Loader2,
  CreditCard,
  MapPin,
  Calendar,
  Heart,
  Check,
  LogOut,
} from 'lucide-react';

export default function PerfilUsuario() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isLoading: authLoading, isAuthenticated, logout } = useAuth();

  const tabActual = searchParams.get('tab') || 'entradas';

  // --- ESTADOS DE DATOS ---
  const [entradas, setEntradas] = useState<Entrada[]>([]);
  const [datosFiscales, setDatosFiscales] = useState<DatosFiscales[]>([]);
  const [compras, setCompras] = useState<CompraResumen[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  // --- ESTADOS MONEDERO ---
  const [saldo, setSaldo] = useState(36.0);
  const [recargaCantidad, setRecargaCantidad] = useState('');
  const [showRecargaForm, setShowRecargaForm] = useState(false);

  // --- ESTADOS EDICIÓN PERFIL ---
  const [editandoPerfil, setEditandoPerfil] = useState(false);
  const [datosPerfil, setDatosPerfil] = useState({ nombre: '', email: '' });

  // --- ESTADOS GESTIÓN DATOS FISCALES ---
  const [modoEdicion, setModoEdicion] = useState<number | null>(null);
  const [mostrarFormularioNuevo, setMostrarFormularioNuevo] = useState(false);
  const [formularioDatos, setFormularioDatos] = useState<DatosFiscales>({
    nif: '',
    nombre: '',
    direccion: '',
    ciudad: '',
    codigoPostal: '',
    pais: 'España',
    alias: '',
  });

  // --- DATOS VISUALES DE PLANES ---
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
    if (!authLoading && !isAuthenticated) {
      toast.error('Debes iniciar sesión para ver tu perfil');
      navigate('/login');
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      if (tabActual === 'entradas') cargarEntradas(user.id);
      else if (tabActual === 'fiscales') cargarDatosFiscales(user.id);
      else if (tabActual === 'compras') cargarHistorialCompras(user.id);
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

  // --- HANDLERS MONEDERO ---
  const handleRecargarSaldo = async (e: React.FormEvent) => {
    e.preventDefault();
    const cantidad = parseFloat(recargaCantidad);
    if (isNaN(cantidad) || cantidad <= 0) return toast.error('Cantidad inválida');

    const promise = new Promise((resolve) => setTimeout(resolve, 2000));
    toast.promise(promise, {
      loading: 'Procesando pago seguro...',
      success: () => {
        setSaldo((prev) => prev + cantidad);
        setShowRecargaForm(false);
        setRecargaCantidad('');
        return `¡Recarga de ${cantidad.toFixed(2)}€ completada!`;
      },
      error: 'Error en el pago',
    });
  };

  const quickAmounts = [10, 25, 50, 100];

  // --- HANDLERS GENÉRICOS ---
  const handleDescargarPdf = async (id: number) => {
    if (!user?.id) return;
    try {
      const blob = await descargarPdfEntrada(user.id, id);
      window.open(URL.createObjectURL(blob));
      toast.success('PDF descargado');
    } catch {
      toast.error('Error PDF');
    }
  };

  const handleGuardarDatos = async () => {
    if (!user?.id) return;
    try {
      if (modoEdicion) await actualizarDatosFiscales(modoEdicion, user.id, formularioDatos);
      else await crearDatosFiscales(user.id, formularioDatos);
      toast.success('Datos guardados');
      setMostrarFormularioNuevo(false);
      setFormularioDatos({
        nif: '',
        nombre: '',
        direccion: '',
        ciudad: '',
        codigoPostal: '',
        pais: 'España',
        alias: '',
      });
      cargarDatosFiscales(user.id);
    } catch {
      toast.error('Error al guardar');
    }
  };

  const handleEliminarDatos = async (id: number) => {
    if (!user?.id || !confirm('¿Eliminar?')) return;
    try {
      await eliminarDatosFiscales(id, user.id);
      toast.success('Eliminado');
      cargarDatosFiscales(user.id);
    } catch {
      toast.error('Error');
    }
  };

  const handleSetPrincipal = async (id: number) => {
    if (!user?.id) return;
    try {
      await actualizarDatosFiscales(id, user.id, { esPrincipal: true });
      toast.success('Actualizado');
      cargarDatosFiscales(user.id);
    } catch {
      toast.error('Error');
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
      nombre: '',
      direccion: '',
      ciudad: '',
      codigoPostal: '',
      pais: 'España',
      alias: '',
    });
  };
  const handleGuardarPerfil = async () => {
    toast.success('Perfil actualizado');
    setEditandoPerfil(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Sesión cerrada correctamente');
  };

  if (authLoading)
    return (
      <div className="flex justify-center h-screen items-center">
        <Loader2 className="animate-spin text-[#00A651]" />
      </div>
    );
  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl animate-in fade-in duration-500">
      {/* === HEADER DE PERFIL === */}
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
                variant="ghost"
                onClick={() => setEditandoPerfil(false)}
                className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white"
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

      {/* === NAVEGACIÓN === */}
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

        {/* --- 1. ENTRADAS --- */}
        <TabsContent
          value="entradas"
          className="animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          {dataLoading ? (
            <div className="py-20 flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-[#00A651]" />
            </div>
          ) : entradas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-slate-50 dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
              <Ticket className="w-12 h-12 text-slate-300 mb-4" />
              <p className="text-slate-500 font-medium">No tienes entradas activas próximamente.</p>
              <Button variant="link" className="text-[#00A651]" onClick={() => navigate('/')}>
                Ver eventos disponibles
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {entradas.map((entrada) => (
                <Card
                  key={entrada.id}
                  className="p-6 flex flex-col md:flex-row justify-between gap-6 border-l-4 border-l-[#00753e] hover:shadow-md transition-shadow"
                >
                  <div>
                    <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-2">
                      {entrada.eventoNombre}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <Calendar size={16} /> {new Date(entrada.fechaEvento).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin size={16} /> {entrada.asientoNumero}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => handleDescargarPdf(entrada.id)}
                    className="shrink-0"
                  >
                    <Download className="w-4 h-4 mr-2" /> Descargar PDF
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* --- 2. HISTORIAL COMPRAS --- */}
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
              // ✅ CORRECCIÓN 1: Fondo y texto corregidos para modo oscuro en estado vacío
              <div className="p-12 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900">
                No hay historial de compras disponible.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {compras.map((compra) => (
                  <div
                    key={compra.id}
                    className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors bg-white dark:bg-slate-900"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-bold text-slate-900 dark:text-white">{compra.title}</h4>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            compra.status === 'COMPLETADA'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                              : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                          }`}
                        >
                          {compra.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                        REF: {compra.id} • {compra.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-8 text-sm">
                      <div className="text-center hidden sm:block">
                        <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500">
                          ENTRADAS
                        </span>
                        <span className="font-medium text-slate-900 dark:text-white">
                          {compra.tickets}
                        </span>
                      </div>
                      <div className="text-center min-w-20">
                        <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500">
                          TOTAL
                        </span>
                        <span className="font-bold text-[#00753e] dark:text-[#00d66a] text-lg">
                          {compra.total}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
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

        {/* --- 3. DATOS FISCALES --- */}
        <TabsContent
          value="fiscales"
          className="animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Mis Direcciones de Facturación
            </h2>
            {!mostrarFormularioNuevo && (
              <Button
                onClick={() => setMostrarFormularioNuevo(true)}
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
                <div className="col-span-1">
                  <Label>Alias (Ej: Empresa)</Label>
                  <Input
                    value={formularioDatos.alias || ''}
                    onChange={(e) =>
                      setFormularioDatos({ ...formularioDatos, alias: e.target.value })
                    }
                    placeholder="Opcional"
                  />
                </div>
                <div className="col-span-1">
                  <Label>NIF/CIF *</Label>
                  <Input
                    value={formularioDatos.nif}
                    onChange={(e) =>
                      setFormularioDatos({ ...formularioDatos, nif: e.target.value.toUpperCase() })
                    }
                    placeholder="12345678A"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Nombre / Razón Social *</Label>
                  <Input
                    value={formularioDatos.nombre}
                    onChange={(e) =>
                      setFormularioDatos({ ...formularioDatos, nombre: e.target.value })
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Dirección *</Label>
                  <Input
                    value={formularioDatos.direccion}
                    onChange={(e) =>
                      setFormularioDatos({ ...formularioDatos, direccion: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Ciudad *</Label>
                  <Input
                    value={formularioDatos.ciudad}
                    onChange={(e) =>
                      setFormularioDatos({ ...formularioDatos, ciudad: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>C. Postal *</Label>
                  <Input
                    value={formularioDatos.codigoPostal}
                    onChange={(e) =>
                      setFormularioDatos({ ...formularioDatos, codigoPostal: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                <Button
                  variant="ghost"
                  onClick={handleCancelarEdicion}
                  // ✅ CORRECCIÓN 2: Texto visible en dark mode
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
              <p className="text-slate-500">
                No tienes direcciones guardadas. Añade una para agilizar tus compras.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {datosFiscales.map((item) => (
                <div
                  key={item.id}
                  className={`group relative border rounded-xl p-6 transition-all hover:shadow-lg ${item.esPrincipal ? 'border-[#00753e] bg-[#00753e]/5 ring-1 ring-[#00753e]/20' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900'}`}
                >
                  {item.esPrincipal && (
                    <div className="absolute top-4 right-4 text-[#00753e] flex items-center gap-1 text-[10px] font-bold bg-white dark:bg-slate-950 px-2 py-1 rounded-full shadow-sm border border-[#00753e]/20">
                      <Star size={10} fill="currentColor" /> PRINCIPAL
                    </div>
                  )}

                  <div className="pb-4 border-b border-slate-200 dark:border-slate-700 mb-4">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                      {item.alias || 'Dirección Personal'}
                    </h3>
                    <span className="text-xs font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      {item.nif}
                    </span>
                  </div>

                  <div className="space-y-1 text-sm text-slate-600 dark:text-slate-300 mb-6">
                    <p className="font-medium text-slate-900 dark:text-white">{item.nombre}</p>
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
                  {!item.esPrincipal && (
                    <button
                      onClick={() => handleSetPrincipal(item.id!)}
                      className="w-full text-center text-xs text-slate-400 hover:text-[#00753e] mt-3 hover:underline"
                    >
                      Establecer como principal
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* --- 4. MONEDERO --- */}
        <TabsContent
          value="monedero"
          className="animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          {!showRecargaForm ? (
            <Card className="p-12 text-center border-dashed bg-slate-50/50 dark:bg-slate-900/50">
              <div className="inline-flex p-5 bg-green-100 dark:bg-green-900/20 rounded-full mb-6 ring-8 ring-green-50 dark:ring-green-900/10">
                <Wallet className="w-12 h-12 text-[#00753e]" />
              </div>
              <h3 className="text-4xl font-bold mb-2 text-slate-900 dark:text-white">
                {saldo.toFixed(2)} €
              </h3>
              <p className="text-gray-500 mb-8">
                Saldo disponible para donaciones rápidas y entradas
              </p>
              <Button
                onClick={() => setShowRecargaForm(true)}
                className="bg-[#00753e] hover:bg-[#005a2e] text-white px-8 h-12 text-lg shadow-lg hover:shadow-green-900/20 transition-all hover:-translate-y-1"
              >
                Recargar Saldo
              </Button>
            </Card>
          ) : (
            <div className="max-w-lg mx-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-xl animate-in fade-in zoom-in-95">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Añadir Saldo</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowRecargaForm(false)}
                  className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                >
                  Cancelar
                </Button>
              </div>

              <form onSubmit={handleRecargarSaldo} className="space-y-8">
                <div>
                  <Label className="mb-3 block text-sm font-semibold">Cantidad a añadir</Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                      €
                    </span>
                    <Input
                      type="number"
                      // ✅ CORRECCIÓN 4: step="1" para flechas, min="0" para evitar scroll negativo, y onKeyDown para bloquear el guión "-"
                      step="1"
                      min="0"
                      value={recargaCantidad}
                      onChange={(e) => {
                        // Validación extra por si acaso
                        const val = parseFloat(e.target.value);
                        if (!isNaN(val) && val < 0) return;
                        setRecargaCantidad(e.target.value);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === '-' || e.key === 'e') {
                          e.preventDefault();
                        }
                      }}
                      className="pl-10 h-14 text-2xl font-bold border-slate-300 focus:border-[#00753e] focus:ring-[#00753e]"
                      style={{ cursor: 'text' }}
                      placeholder="0.00"
                      autoFocus
                    />
                    {/* Hack CSS para las flechas (webkit) */}
                    <style>{`
                      input[type=number]::-webkit-inner-spin-button, 
                      input[type=number]::-webkit-outer-spin-button { 
                        opacity: 1;
                        cursor: pointer;
                        height: 30px;
                      }
                    `}</style>
                  </div>
                </div>

                <div>
                  <Label className="mb-3 block text-xs font-bold uppercase text-slate-400 tracking-wider">
                    Cantidades Rápidas
                  </Label>
                  <div className="grid grid-cols-4 gap-3">
                    {quickAmounts.map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setRecargaCantidad(amt.toString())}
                        // ✅ CORRECCIÓN 3: Texto visible en dark mode (slate-600 / slate-300) y cursor-pointer
                        className={`cursor-pointer py-3 rounded-lg text-sm font-bold border transition-all duration-200 hover:shadow-md ${
                          recargaCantidad === amt.toString()
                            ? 'border-[#00753e] bg-[#00753e] text-white shadow-md transform scale-105'
                            : 'border-slate-200 bg-white text-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 hover:border-[#00753e] hover:text-[#00753e]'
                        }`}
                      >
                        {amt}€
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Método de pago
                    </span>
                    <span className="text-xs font-bold text-[#00753e] cursor-pointer hover:underline">
                      Cambiar
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-6 bg-slate-200 rounded flex items-center justify-center text-xs font-bold text-slate-500">
                      VISA
                    </div>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      •••• 4242
                    </span>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-14 text-lg font-bold bg-[#00753e] hover:bg-[#005a2e] text-white shadow-lg hover:shadow-green-900/20"
                >
                  Pagar {recargaCantidad ? `${parseFloat(recargaCantidad).toFixed(2)}€` : ''}
                </Button>
              </form>
            </div>
          )}
        </TabsContent>

        {/* --- 5. SUSCRIPCIÓN --- */}
        <TabsContent
          value="suscripcion"
          className="animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
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

            <Card className="mt-12 p-8 border border-slate-200 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <h3 className="font-bold text-xl mb-1 text-slate-900 dark:text-white">
                    Tu Suscripción Activa
                  </h3>
                  <p className="text-slate-500 text-sm">Gestiona tu método de pago y renovación.</p>
                </div>
                <div className="flex gap-4 text-sm">
                  <div className="px-4 py-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="block text-slate-400 text-xs font-bold uppercase mb-1">
                      Próxima cuota
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      15 Enero, 2025
                    </span>
                  </div>
                  <div className="px-4 py-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="block text-slate-400 text-xs font-bold uppercase mb-1">
                      Pago
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <CreditCard size={14} /> •••• 4242
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                <Button
                  variant="ghost"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/10"
                >
                  Cancelar suscripción
                </Button>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
