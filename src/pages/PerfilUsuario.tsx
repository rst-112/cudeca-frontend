import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import {
  obtenerMisEntradas,
  obtenerDatosFiscales,
  crearDatosFiscales,
  actualizarDatosFiscales,
  eliminarDatosFiscales,
  establecerDatosFiscalesPrincipal,
  descargarPdfEntrada,
} from '../services/checkout.service';
import type { Entrada, DatosFiscales } from '../types/checkout.types';
import {
  Ticket,
  FileText,
  Wallet,
  Download,
  Edit,
  Trash2,
  Plus,
  Star,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
} from 'lucide-react';

export default function PerfilUsuario() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabActual = searchParams.get('tab') || 'entradas';

  const [entradas, setEntradas] = useState<Entrada[]>([]);
  const [datosFiscales, setDatosFiscales] = useState<DatosFiscales[]>([]);
  const [loading, setLoading] = useState(false);
  const [modoEdicion, setModoEdicion] = useState<number | null>(null);
  const [mostrarFormularioNuevo, setMostrarFormularioNuevo] = useState(false);

  const [formularioDatos, setFormularioDatos] = useState<DatosFiscales>({
    nif: '',
    nombreCompleto: '',
    direccion: '',
    ciudad: '',
    codigoPostal: '',
    pais: 'España',
  });

  useEffect(() => {
    if (tabActual === 'entradas') {
      cargarEntradas();
    } else if (tabActual === 'fiscales') {
      cargarDatosFiscales();
    }
  }, [tabActual]);

  const cargarEntradas = async () => {
    setLoading(true);
    try {
      const data = await obtenerMisEntradas();
      setEntradas(data);
    } catch (error: any) {
      toast.error('Error al cargar entradas: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const cargarDatosFiscales = async () => {
    setLoading(true);
    try {
      const data = await obtenerDatosFiscales();
      setDatosFiscales(data);
    } catch (error: any) {
      toast.error('Error al cargar datos fiscales: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDescargarPdf = async (entradaId: number) => {
    try {
      const url = await descargarPdfEntrada(entradaId);
      toast.success('PDF descargado (simulado)');
      // En producción: window.open(url, '_blank');
      console.log('URL PDF:', url);
    } catch (error: any) {
      toast.error('Error al descargar PDF: ' + error.message);
    }
  };

  const handleGuardarDatosFiscales = async () => {
    try {
      if (modoEdicion !== null) {
        // Actualizar existente
        await actualizarDatosFiscales(modoEdicion, formularioDatos);
        toast.success('Datos fiscales actualizados');
        setModoEdicion(null);
      } else {
        // Crear nuevo
        await crearDatosFiscales(formularioDatos);
        toast.success('Datos fiscales creados');
        setMostrarFormularioNuevo(false);
      }

      // Resetear formulario
      setFormularioDatos({
        nif: '',
        nombreCompleto: '',
        direccion: '',
        ciudad: '',
        codigoPostal: '',
        pais: 'España',
      });

      cargarDatosFiscales();
    } catch (error: any) {
      toast.error('Error al guardar: ' + error.message);
    }
  };

  const handleEliminarDatosFiscales = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar estos datos fiscales?')) return;

    try {
      await eliminarDatosFiscales(id);
      toast.success('Datos fiscales eliminados');
      cargarDatosFiscales();
    } catch (error: any) {
      toast.error('Error al eliminar: ' + error.message);
    }
  };

  const handleEstablecerPrincipal = async (id: number) => {
    try {
      await establecerDatosFiscalesPrincipal(id);
      toast.success('Datos fiscales establecidos como principal');
      cargarDatosFiscales();
    } catch (error: any) {
      toast.error('Error: ' + error.message);
    }
  };

  const handleEditarDatos = (datos: DatosFiscales) => {
    setFormularioDatos(datos);
    setModoEdicion(datos.id ?? null);
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
    });
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
          Mi Perfil
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Gestiona tus entradas, datos fiscales y monedero
        </p>
      </div>

      <Tabs
        value={tabActual}
        onValueChange={(value) => setSearchParams({ tab: value })}
      >
        <TabsList className="mb-6">
          <TabsTrigger value="entradas">
            <Ticket className="w-4 h-4 mr-2" />
            Mis Entradas
          </TabsTrigger>
          <TabsTrigger value="fiscales">
            <FileText className="w-4 h-4 mr-2" />
            Datos Fiscales
          </TabsTrigger>
          <TabsTrigger value="monedero">
            <Wallet className="w-4 h-4 mr-2" />
            Monedero
          </TabsTrigger>
        </TabsList>

        {/* Tab: Mis Entradas */}
        <TabsContent value="entradas">
          <div className="space-y-4">
            {loading ? (
              <p className="text-center text-gray-500">Cargando...</p>
            ) : entradas.length === 0 ? (
              <Card className="p-8 text-center">
                <Ticket className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">No tienes entradas todavía</p>
              </Card>
            ) : (
              entradas.map((entrada) => (
                <Card key={entrada.id} className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                          {entrada.eventoNombre}
                        </h3>
                        {entrada.estadoEntrada === 'ACTIVA' && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Activa
                          </span>
                        )}
                        {entrada.estadoEntrada === 'USADA' && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                            Usada
                          </span>
                        )}
                        {entrada.estadoEntrada === 'CANCELADA' && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full flex items-center gap-1">
                            <XCircle className="w-3 h-3" />
                            Cancelada
                          </span>
                        )}
                      </div>

                      <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(entrada.eventoFecha).toLocaleDateString('es-ES')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{entrada.zonaNombre} - {entrada.asientoEtiqueta}</span>
                        </div>
                        <div>
                          <span className="font-semibold">Código:</span> {entrada.codigo}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="text-right mb-2">
                        <p className="text-2xl font-bold text-[#00A651]">
                          {entrada.precio.toFixed(2)} €
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDescargarPdf(entrada.id)}
                        className="w-full"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Descargar PDF
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Tab: Datos Fiscales */}
        <TabsContent value="fiscales">
          <div className="space-y-4">
            {!mostrarFormularioNuevo && (
              <Button onClick={() => setMostrarFormularioNuevo(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Añadir Datos Fiscales
              </Button>
            )}

            {mostrarFormularioNuevo && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  {modoEdicion ? 'Editar' : 'Nuevos'} Datos Fiscales
                </h3>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="nif">NIF *</Label>
                    <Input
                      id="nif"
                      placeholder="12345678A"
                      value={formularioDatos.nif}
                      onChange={(e) =>
                        setFormularioDatos({ ...formularioDatos, nif: e.target.value.toUpperCase() })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="nombreCompleto">Nombre Completo *</Label>
                    <Input
                      id="nombreCompleto"
                      placeholder="Juan Pérez García"
                      value={formularioDatos.nombreCompleto}
                      onChange={(e) =>
                        setFormularioDatos({ ...formularioDatos, nombreCompleto: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="direccion">Dirección *</Label>
                    <Input
                      id="direccion"
                      placeholder="Calle Principal, 123"
                      value={formularioDatos.direccion}
                      onChange={(e) =>
                        setFormularioDatos({ ...formularioDatos, direccion: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="ciudad">Ciudad *</Label>
                      <Input
                        id="ciudad"
                        placeholder="Málaga"
                        value={formularioDatos.ciudad}
                        onChange={(e) =>
                          setFormularioDatos({ ...formularioDatos, ciudad: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="codigoPostal">Código Postal *</Label>
                      <Input
                        id="codigoPostal"
                        placeholder="29001"
                        value={formularioDatos.codigoPostal}
                        onChange={(e) =>
                          setFormularioDatos({ ...formularioDatos, codigoPostal: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="pais">País *</Label>
                    <Input
                      id="pais"
                      value={formularioDatos.pais}
                      onChange={(e) =>
                        setFormularioDatos({ ...formularioDatos, pais: e.target.value })
                      }
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleGuardarDatosFiscales}>
                      Guardar
                    </Button>
                    <Button variant="outline" onClick={handleCancelarEdicion}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {loading ? (
              <p className="text-center text-gray-500">Cargando...</p>
            ) : datosFiscales.length === 0 ? (
              <Card className="p-8 text-center">
                <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">No tienes datos fiscales guardados</p>
              </Card>
            ) : (
              datosFiscales.map((datos) => (
                <Card key={datos.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                          {datos.nombreCompleto}
                        </h3>
                        {datos.isPrincipal && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full flex items-center gap-1">
                            <Star className="w-3 h-3 fill-current" />
                            Principal
                          </span>
                        )}
                      </div>

                      <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <p><span className="font-semibold">NIF:</span> {datos.nif}</p>
                        <p><span className="font-semibold">Dirección:</span> {datos.direccion}</p>
                        <p>
                          <span className="font-semibold">Ciudad:</span> {datos.ciudad}, {datos.codigoPostal}
                        </p>
                        <p><span className="font-semibold">País:</span> {datos.pais}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {!datos.isPrincipal && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEstablecerPrincipal(datos.id!)}
                          title="Establecer como principal"
                        >
                          <Star className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditarDatos(datos)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEliminarDatosFiscales(datos.id!)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Tab: Monedero */}
        <TabsContent value="monedero">
          <Card className="p-8 text-center">
            <Wallet className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
              Monedero
            </h3>
            <p className="text-gray-500 mb-6">
              Funcionalidad en desarrollo
            </p>
            <div className="bg-gradient-to-r from-[#00A651] to-[#4ade80] text-white p-6 rounded-lg max-w-md mx-auto">
              <p className="text-sm opacity-90 mb-2">Saldo Disponible</p>
              <p className="text-4xl font-bold">0.00 €</p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

