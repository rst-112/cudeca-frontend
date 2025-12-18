import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { SeatMapViewer } from '../../features/seats';

/**
 * VisorMapaAsientos - Wrapper para el visor de mapas en el contexto del admin
 */
export default function VisorMapaAsientos() {
  const { eventoId } = useParams<{ eventoId: string }>();
  const navigate = useNavigate();

  // Mock de asientos - en producción vendría del backend
  const asientosEjemplo = [
    {
      id: 'A1',
      etiqueta: 'A-1',
      x: 100,
      y: 100,
      estado: 'LIBRE' as const,
      tipoEntradaId: 1,
    },
    {
      id: 'A2',
      etiqueta: 'A-2',
      x: 150,
      y: 100,
      estado: 'VENDIDO' as const,
      tipoEntradaId: 1,
    },
    {
      id: 'B1',
      etiqueta: 'B-1',
      x: 100,
      y: 150,
      estado: 'LIBRE' as const,
      tipoEntradaId: 1,
    },
    {
      id: 'B2',
      etiqueta: 'B-2',
      x: 150,
      y: 150,
      estado: 'BLOQUEADO' as const,
      tipoEntradaId: 1,
    },
  ];

  const objetosDecorativosEjemplo = [];

  const handleBack = () => {
    navigate('/admin/asientos');
  };

  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col">
      {/* Header */}
      <div className="shrink-0 bg-slate-900 border-b border-slate-800 p-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="gap-2 text-white hover:text-[#00A651]"
          >
            <ArrowLeft size={16} />
            Volver a Gestión de Asientos
          </Button>
          <div className="h-6 w-px bg-slate-700" />
          <h2 className="text-lg font-bold text-white">Visor de Mapa - Evento #{eventoId}</h2>
        </div>
      </div>

      {/* Visor - Ocupa TODO el resto de la pantalla */}
      <div className="flex-1 overflow-hidden p-8">
        <div className="h-full max-w-6xl mx-auto">
          <SeatMapViewer
            asientos={asientosEjemplo}
            objetosDecorativos={objetosDecorativosEjemplo}
            onSelectSeat={(asientoId) => {
              console.log('Asiento seleccionado:', asientoId);
            }}
            ancho={800}
            alto={600}
          />
        </div>
      </div>
    </div>
  );
}
