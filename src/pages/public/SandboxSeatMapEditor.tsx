import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, Upload, Eye } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { SeatMapEditor } from '../../features/seats';
import type { MapaAsientos } from '../../types/seatmap.types';
import { ThemeToggle } from '../../components/ui/ThemeToggle';

/**
 * SandboxSeatMapEditor - Página de prueba para el Editor de Mapas de Asientos
 * Permite crear mapas, exportarlos como JSON y probar la funcionalidad completa
 */
export default function SandboxSeatMapEditor() {
  const [mapaGuardado, setMapaGuardado] = useState<MapaAsientos | null>(null);
  const [vistaPrevia, setVistaPrevia] = useState(false);
  const [keyEditor, setKeyEditor] = useState(0); // Forzar remount del editor

  /**
   * Guardar el mapa creado
   */
  const handleSave = useCallback((mapa: MapaAsientos) => {
    setMapaGuardado(mapa);
    const totalAsientos = mapa.zonas.reduce((acc, zona) => acc + zona.asientos.length, 0);
    alert(`✅ Mapa guardado: ${totalAsientos} asientos`);
    console.log('Mapa guardado:', mapa);
  }, []);

  /**
   * Exportar mapa como JSON
   */
  const handleExport = useCallback(() => {
    if (!mapaGuardado) return;

    // Solicitar nombre al usuario
    const nombreArchivo = prompt('Nombre del archivo:', `mapa-evento-${mapaGuardado.eventoId}`);
    if (!nombreArchivo) return; // Cancelado

    const json = JSON.stringify(mapaGuardado, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${nombreArchivo}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [mapaGuardado]);

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
          const mapa = JSON.parse(event.target?.result as string);
          setMapaGuardado(mapa);
          setKeyEditor((prev) => prev + 1); // Forzar remount del editor
          const totalAsientos =
            mapa.zonas?.reduce(
              (acc: number, zona: { asientos?: unknown[] }) => acc + (zona.asientos?.length || 0),
              0,
            ) || 0;
          alert(`✅ Mapa importado: ${totalAsientos} asientos`);
        } catch (error) {
          alert('❌ Error al importar el mapa. Verifica el formato JSON.');
          console.error(error);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }, []);

  return (
    <div className="h-screen bg-slate-100 dark:bg-slate-950 font-['Arimo'] flex flex-col overflow-hidden">
      {/* Header */}
      <header className="shrink-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-200"
            >
              <Link to="/" className="inline-flex items-center gap-2">
                <ArrowLeft size={16} />
                Volver
              </Link>
            </Button>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
            <h1 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              🎨 Editor de Mapas de Asientos
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {mapaGuardado && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setVistaPrevia(!vistaPrevia)}
                  className="gap-2"
                >
                  <Eye size={16} />
                  {vistaPrevia ? 'Ocultar' : 'Vista Previa'}
                </Button>
                <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
                  <Download size={16} />
                  Exportar JSON
                </Button>
              </>
            )}
            <Button variant="outline" size="sm" onClick={handleImport} className="gap-2">
              <Upload size={16} />
              Importar JSON
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Vista previa del JSON guardado */}
      {vistaPrevia && mapaGuardado && (
        <div className="shrink-0 bg-amber-50 dark:bg-amber-950/20 border-b border-amber-200 dark:border-amber-900">
          <div className="container mx-auto px-4 py-2">
            <div className="bg-white dark:bg-slate-900 rounded-lg p-3 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-slate-900 dark:text-white">
                  📄 Mapa Guardado - {mapaGuardado.zonas?.[0]?.asientos.length || 0} asientos
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setVistaPrevia(false)}
                  className="text-xs dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800"
                >
                  Cerrar
                </Button>
              </div>
              <pre className="text-xs bg-slate-50 dark:bg-slate-950 p-2 rounded overflow-x-auto max-h-32 overflow-y-auto border dark:border-slate-800 text-slate-900 dark:text-slate-300">
                {JSON.stringify(mapaGuardado, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Área del editor */}
      <main className="flex-1 overflow-hidden min-h-0">
        <SeatMapEditor
          key={keyEditor}
          mapaInicial={mapaGuardado || undefined}
          onSave={handleSave}
          ancho={800}
          alto={600}
        />
      </main>

      {/* Footer informativo */}
      <footer className="shrink-0 bg-slate-800 dark:bg-slate-900/50 border-t border-slate-700/50">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span>
              💡 <strong>Tip:</strong>
            </span>
            <p>
              Usa el layout Grid para generar asientos automáticamente, luego ajusta posiciones
              manualmente. Exporta el JSON para usarlo en producción.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
