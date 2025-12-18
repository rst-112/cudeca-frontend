import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { SeatMapEditor } from '../../features/seats';
import type { MapaAsientos } from '../../types/seatmap.types';

/**
 * EditorMapaAsientos - Wrapper para el editor de mapas en el contexto del admin
 */
export default function EditorMapaAsientos() {
  const { eventoId } = useParams<{ eventoId: string }>();
  const navigate = useNavigate();

  const handleSave = (mapa: MapaAsientos) => {
    console.log('Mapa guardado para evento', eventoId, mapa);
    // TODO: Aquí iría la llamada al backend para guardar el mapa
    // await saveSeatMap(Number(eventoId), mapa);
    alert(`✅ Mapa guardado para evento ${eventoId}`);
    navigate('/admin/asientos');
  };

  const handleBack = () => {
    navigate('/admin/asientos');
  };

  return (
    <div className="h-[calc(100vh-140px)] md:h-[calc(100vh-80px)] bg-slate-50 dark:bg-slate-950 flex flex-col">
      {/* Header */}
      <div className="shrink-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={handleBack} className="gap-2">
            <ArrowLeft size={16} />
            Volver a Gestión de Asientos
          </Button>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Editor de Mapa - Evento #{eventoId}
          </h2>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <SeatMapEditor onSave={handleSave} ancho={800} alto={600} />
      </div>
    </div>
  );
}
