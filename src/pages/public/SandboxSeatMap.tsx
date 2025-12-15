import { useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, ShoppingCart, Info, ArrowLeft, Ticket, Edit, Upload } from 'lucide-react';
import { SeatMapViewer } from '../../features/seats/SeatMapViewer';
import { Button } from '../../components/ui/Button';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import type {
  Asiento,
  EstadoAsiento,
  MapaAsientos,
  ObjetoDecorativo,
} from '../../types/seatmap.types';

/**
 * Genera un array de asientos mock para pruebas
 * Simula un teatro con filas A-E y 10 columnas
 */
const generarAsientosMock = (): Asiento[] => {
  const asientos: Asiento[] = [];
  const filas = 5;
  const columnas = 10;
  const espaciadoX = 45;
  const espaciadoY = 50;

  // Centrar el grid de asientos
  const offsetX = 150;
  const offsetY = 120;

  for (let fila = 0; fila < filas; fila++) {
    for (let col = 0; col < columnas; col++) {
      const random = Math.random();
      let estado: EstadoAsiento = 'LIBRE';

      // Distribución: 66% libre, 24% ocupado, 10% bloqueado
      if (random > 0.9) {
        estado = 'BLOQUEADO';
      } else if (random > 0.66) {
        estado = 'OCUPADO';
      }

      asientos.push({
        id: `seat-${fila}-${col}`,
        x: offsetX + col * espaciadoX,
        y: offsetY + fila * espaciadoY,
        estado,
        etiqueta: `${String.fromCharCode(65 + fila)}${col + 1}`,
        fila: fila + 1,
        columna: col + 1,
        tipoEntradaId: 1,
        precio: 20,
      });
    }
  }

  return asientos;
};

/**
 * SandboxSeatMap - Página de pruebas para el sistema de mapa de asientos
 * Entorno aislado que no afecta al sistema principal
 */
export default function SandboxSeatMap() {
  const [asientos, setAsientos] = useState<Asiento[]>(generarAsientosMock);
  const [objetosDecorativos, setObjetosDecorativos] = useState<ObjetoDecorativo[]>([]);
  const [seleccionados, setSeleccionados] = useState<string[]>([]);
  const [mapaImportado, setMapaImportado] = useState<MapaAsientos | null>(null);

  /**
   * Importar mapa desde JSON
   */
  const handleImport = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const mapa: MapaAsientos = JSON.parse(event.target?.result as string);
          setMapaImportado(mapa);

          // Extraer asientos y objetos de la primera zona
          const zona = mapa.zonas?.[0];
          if (zona) {
            setAsientos(zona.asientos || []);
            setObjetosDecorativos(zona.objetosDecorativos || []);
          }

          const totalAsientos =
            mapa.zonas?.reduce((acc, z) => acc + (z.asientos?.length || 0), 0) || 0;
          alert(`✅ Mapa importado: ${totalAsientos} asientos`);
          setSeleccionados([]);
        } catch (error) {
          alert('❌ Error al importar el mapa. Verifica el formato JSON.');
          console.error(error);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }, []);

  /**
   * Maneja la selección/deselección de un asiento
   */
  const handleSelect = useCallback((id: string) => {
    setAsientos((prev) =>
      prev.map((seat) => {
        if (seat.id === id) {
          const nuevoEstado: EstadoAsiento =
            seat.estado === 'SELECCIONADO' ? 'LIBRE' : 'SELECCIONADO';

          if (nuevoEstado === 'SELECCIONADO') {
            setSeleccionados((p) => (p.includes(id) ? p : [...p, id]));
          } else {
            setSeleccionados((p) => p.filter((s) => s !== id));
          }

          return { ...seat, estado: nuevoEstado };
        }
        return seat;
      }),
    );
  }, []);

  /**
   * Regenera el mapa con nuevos datos aleatorios
   */
  const handleRegenerar = useCallback(() => {
    setAsientos(generarAsientosMock());
    setObjetosDecorativos([]);
    setSeleccionados([]);
    setMapaImportado(null);
  }, []);

  // Calcular estadísticas con memoización
  const stats = useMemo(() => {
    const libres = asientos.filter((a) => a.estado === 'LIBRE').length;
    const ocupados = asientos.filter(
      (a) => a.estado === 'OCUPADO' || a.estado === 'VENDIDO',
    ).length;
    const bloqueados = asientos.filter((a) => a.estado === 'BLOQUEADO').length;
    return { libres, ocupados, bloqueados };
  }, [asientos]);

  // Calcular precio total sumando los precios reales de los asientos seleccionados
  const totalPrecio = useMemo(() => {
    return seleccionados.reduce((total, id) => {
      const asiento = asientos.find((a) => a.id === id);
      return total + (asiento?.precio || 0);
    }, 0);
  }, [seleccionados, asientos]);

  /**
   * Simula el proceso de compra
   */
  const handleSimularCompra = useCallback(() => {
    const asientosSeleccionados = asientos.filter((a) => seleccionados.includes(a.id));
    const detalleAsientos = asientosSeleccionados
      .map((a) => `${a.etiqueta} (${a.precio}€)`)
      .join(', ');
    console.log('🛒 Simulando compra de asientos:', asientosSeleccionados);
    alert(
      `Simulando compra de ${seleccionados.length} asiento(s) por ${totalPrecio}€\n\nAsientos: ${detalleAsientos}`,
    );
  }, [asientos, seleccionados, totalPrecio]);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-200"
            >
              <Link to="/">
                <ArrowLeft size={16} />
                Volver
              </Link>
            </Button>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
            <h1 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              🧪 Sandbox: Mapa de Asientos
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleImport}
              className="gap-2 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <Upload size={16} />
              <span className="hidden sm:inline">Importar JSON</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="gap-2 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <Link to="/dev/mapa/editor">
                <Edit size={16} />
                <span className="hidden sm:inline">Abrir Editor</span>
              </Link>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Info del mapa importado */}
        {mapaImportado && (
          <div className="p-4 bg-[#00A651]/10 border border-[#00A651]/30 rounded-xl flex gap-3">
            <Info className="text-[#00A651] shrink-0 mt-0.5" size={20} />
            <div className="text-sm text-slate-800 dark:text-slate-200">
              <strong>Mapa Importado:</strong> Evento ID {mapaImportado.eventoId} •{' '}
              {mapaImportado.ancho}×{mapaImportado.alto}px
              {mapaImportado.tiposEntrada && mapaImportado.tiposEntrada.length > 0 && (
                <span className="ml-2">
                  • {mapaImportado.tiposEntrada.length} tipo(s) de entrada
                </span>
              )}
            </div>
          </div>
        )}

        {/* Panel de Estadísticas */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{asientos.length}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Disponibles</p>
            <p className="text-2xl font-bold text-[#00A651]">{stats.libres}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Ocupados</p>
            <p className="text-2xl font-bold text-slate-500">{stats.ocupados}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Bloqueados</p>
            <p className="text-2xl font-bold text-red-500">{stats.bloqueados}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Seleccionados</p>
            <p className="text-2xl font-bold text-[#F29325]">{seleccionados.length}</p>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleRegenerar}
              className="gap-2 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <RefreshCw size={16} />
              Regenerar Mapa
            </Button>
            <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
              <Info size={12} className="inline mr-1" />
              Regenera con estados aleatorios
            </span>
          </div>

          {seleccionados.length > 0 && (
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {seleccionados.length} asiento(s)
                </p>
                <p className="text-xl font-bold text-[#00A651]">{totalPrecio}€</p>
              </div>
              <Button
                onClick={handleSimularCompra}
                className="gap-2 bg-[#00A651] hover:bg-[#008a43]"
              >
                <ShoppingCart size={16} />
                Simular Compra
              </Button>
            </div>
          )}
        </div>

        {/* Mapa de Asientos */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <SeatMapViewer
            asientos={asientos}
            objetosDecorativos={objetosDecorativos}
            onSelectSeat={handleSelect}
            tituloEscenario="ESCENARIO - CONCIERTO BENÉFICO"
          />
        </div>

        {/* Panel de Selección */}
        {seleccionados.length > 0 && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-[#F29325]/10 flex items-center justify-center">
                <Ticket className="text-[#F29325]" size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">Asientos Seleccionados</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Haz clic en un asiento para deseleccionarlo
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {seleccionados.map((id) => {
                const seat = asientos.find((a) => a.id === id);
                return (
                  <button
                    key={id}
                    onClick={() => handleSelect(id)}
                    className="px-3 py-1.5 bg-[#F29325]/10 hover:bg-[#F29325]/20 text-[#D94F04] dark:text-[#F29325] rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    {seat?.etiqueta}
                    <span className="text-xs opacity-70">{seat?.precio}€</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Panel Informativo */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl flex gap-3">
          <Info className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" size={20} />
          <div className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Instrucciones:</strong> Usa la rueda del ratón o los botones +/- para zoom.
            Arrastra para mover el mapa. Haz clic en asientos verdes para seleccionarlos.
          </div>
        </div>
      </main>
    </div>
  );
}
