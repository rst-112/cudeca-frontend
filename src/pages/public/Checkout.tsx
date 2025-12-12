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
import { ShoppingCart, FileText, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';

export default function Checkout() {
  const navigate = useNavigate();

  // Simulación: IDs de asientos desde URL o localStorage
  const [asientosSeleccionados, setAsientosSeleccionados] = useState<AsientoSeleccionado[]>([]);
  const [solicitarCertificado, setSolicitarCertificado] = useState(false);
  const [datosFiscales, setDatosFiscales] = useState<DatosFiscales[]>([]);
  const [datosFiscalesSeleccionado, setDatosFiscalesSeleccionado] = useState<number | null>(null);
  const [mostrarFormularioNuevo, setMostrarFormularioNuevo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'resumen' | 'confirmado'>('resumen');

  // Formulario de nuevos datos fiscales
  const [nuevosDatos, setNuevosDatos] = useState<DatosFiscales>({
    nif: '',
    nombre: '',
    direccion: '',
    ciudad: '',
    codigoPostal: '',
    pais: 'España',
  });

  useEffect(() => {
    // Cargar datos fiscales del usuario
    cargarDatosFiscales();

    // Simular asientos seleccionados (por ahora hardcodeado)
    // En producción, estos vendrían de la página de selección de asientos
    const asientosDemo: AsientoSeleccionado[] = [
      { id: 'A1', etiqueta: 'A-1', precio: 25, zonaId: 1, zonaNombre: 'Platea' },
      { id: 'A2', etiqueta: 'A-2', precio: 25, zonaId: 1, zonaNombre: 'Platea' },
    ];
    setAsientosSeleccionados(asientosDemo);
  }, []);

  const cargarDatosFiscales = async () => {
    try {
      // TODO: Obtener usuarioId del contexto de autenticación
      const usuarioId = 1; // Temporal
      const datos = await obtenerDatosFiscalesUsuario(usuarioId);
      setDatosFiscales(datos);

      // Seleccionar el principal por defecto
      const principal = datos.find((d: DatosFiscales) => d.esPrincipal);
      if (principal?.id) {
        setDatosFiscalesSeleccionado(principal.id);
      }
    } catch (error) {
      console.error('Error al cargar datos fiscales:', error);
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

    // Si no tiene datos fiscales, mostrar formulario
    if (checked && datosFiscales.length === 0) {
      setMostrarFormularioNuevo(true);
    }
  };

  const validarDatosFiscales = (): boolean => {
    if (!solicitarCertificado) return true;

    if (mostrarFormularioNuevo) {
      // Validar formulario de nuevos datos
      if (!nuevosDatos.nif || !nuevosDatos.nombre || !nuevosDatos.direccion ||
          !nuevosDatos.ciudad || !nuevosDatos.codigoPostal) {
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

    setLoading(true);
    try {
      // TODO: Obtener usuarioId del contexto de autenticación
      const usuarioId = 1; // Temporal

      // 1. Procesar checkout (crear compra)
      const response = await procesarCheckout({
        usuarioId,
        items: asientosSeleccionados.map(a => ({
          asientoId: parseInt(a.id) || 0,
          precio: a.precio,
        })),
        donacionExtra: 0,
        solicitarCertificado,
        datosFiscalesId: mostrarFormularioNuevo ? undefined : datosFiscalesSeleccionado ?? undefined,
      });

      toast.success('Compra procesada correctamente');

      // 2. En un escenario real, redirigir a la URL de pago
      // window.location.href = response.urlPago;

      // Para simulación, confirmar el pago directamente
      await confirmarPago(response.compraId, {
        transaccionId: 'DEMO-' + Date.now(),
        estado: 'COMPLETADO',
      });

      toast.success('¡Compra confirmada! Redirigiendo...');
      setStep('confirmado');

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

  if (step === 'confirmado') {
    return (
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <Card className="p-8 text-center">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
            ¡Compra Confirmada!
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Recibirás un correo electrónico con tus entradas.
          </p>
          <Button onClick={() => navigate('/perfil?tab=entradas')}>
            Ver mis entradas
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
          Checkout
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Completa tu compra y descarga tus entradas
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna Izquierda: Formulario */}
        <div className="lg:col-span-2 space-y-6">
          {/* Resumen de Asientos */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingCart className="w-5 h-5 text-[#00A651]" />
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Asientos Seleccionados
              </h2>
            </div>

            <div className="space-y-3">
              {asientosSeleccionados.map((asiento) => (
                <div
                  key={asiento.id}
                  className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-800 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white">
                      {asiento.zonaNombre} - {asiento.etiqueta}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-800 dark:text-white">
                    {asiento.precio.toFixed(2)} €
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* Datos Fiscales */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-[#00A651]" />
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Datos Fiscales
              </h2>
            </div>

            {/* Toggle Solicitar Certificado */}
            <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg mb-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                <Label htmlFor="certificado" className="cursor-pointer text-gray-800 dark:text-white">
                  Solicitar Certificado de Donación
                </Label>
              </div>
              <Switch
                id="certificado"
                checked={solicitarCertificado}
                onCheckedChange={handleSolicitarCertificadoChange}
              />
            </div>

            {/* Formulario de Datos Fiscales */}
            {solicitarCertificado && (
              <div className="space-y-4">
                {datosFiscales.length > 0 && !mostrarFormularioNuevo && (
                  <div>
                    <Label>Selecciona Datos Fiscales</Label>
                    <select
                      className="w-full mt-2 p-2 border rounded-md dark:bg-slate-800 dark:border-slate-700"
                      value={datosFiscalesSeleccionado ?? ''}
                      onChange={(e) => setDatosFiscalesSeleccionado(Number(e.target.value))}
                    >
                      <option value="">-- Selecciona --</option>
                      {datosFiscales.map((datos) => (
                        <option key={datos.id} value={datos.id}>
                          {datos.nombre} - {datos.nif}
                        </option>
                      ))}
                    </select>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => setMostrarFormularioNuevo(true)}
                    >
                      + Añadir nuevos datos fiscales
                    </Button>
                  </div>
                )}

                {(mostrarFormularioNuevo || datosFiscales.length === 0) && (
                  <div className="space-y-4">
                    {datosFiscales.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setMostrarFormularioNuevo(false)}
                      >
                        ← Volver a seleccionar
                      </Button>
                    )}

                    <div>
                      <Label htmlFor="nif">NIF *</Label>
                      <Input
                        id="nif"
                        placeholder="12345678A"
                        value={nuevosDatos.nif}
                        onChange={(e) => setNuevosDatos({ ...nuevosDatos, nif: e.target.value.toUpperCase() })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="nombre">Nombre Completo *</Label>
                      <Input
                        id="nombre"
                        placeholder="Juan Pérez García"
                        value={nuevosDatos.nombre}
                        onChange={(e) => setNuevosDatos({ ...nuevosDatos, nombre: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="direccion">Dirección *</Label>
                      <Input
                        id="direccion"
                        placeholder="Calle Principal, 123"
                        value={nuevosDatos.direccion}
                        onChange={(e) => setNuevosDatos({ ...nuevosDatos, direccion: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="ciudad">Ciudad *</Label>
                        <Input
                          id="ciudad"
                          placeholder="Málaga"
                          value={nuevosDatos.ciudad}
                          onChange={(e) => setNuevosDatos({ ...nuevosDatos, ciudad: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="codigoPostal">Código Postal *</Label>
                        <Input
                          id="codigoPostal"
                          placeholder="29001"
                          value={nuevosDatos.codigoPostal}
                          onChange={(e) => setNuevosDatos({ ...nuevosDatos, codigoPostal: e.target.value })}
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
          <Card className="p-6 sticky top-24">
            <div className="flex items-center gap-2 mb-6">
              <CreditCard className="w-5 h-5 text-[#00A651]" />
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Resumen
              </h2>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span>{totales.subtotal.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Comisión (5%)</span>
                <span>{totales.comision.toFixed(2)} €</span>
              </div>
              <div className="border-t border-gray-200 dark:border-slate-700 pt-3 mt-3">
                <div className="flex justify-between text-xl font-bold text-gray-800 dark:text-white">
                  <span>Total</span>
                  <span>{totales.total.toFixed(2)} €</span>
                </div>
              </div>
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={handleConfirmarCompra}
              disabled={loading}
            >
              {loading ? 'Procesando...' : 'Confirmar Compra'}
            </Button>

            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
              Al confirmar, aceptas nuestros términos y condiciones
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
