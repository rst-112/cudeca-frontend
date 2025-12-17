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

    // Mock de mapa - en producción vendría del backend
    const mapaEjemplo = {
        eventoId: Number(eventoId),
        zonas: [
            {
                id: 'zona-1',
                nombre: 'Zona VIP',
                color: '#00A651',
                asientos: [
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
                ],
            },
        ],
        objetos: [],
    };

    const handleBack = () => {
        navigate('/admin/asientos');
    };

    return (
        <div className="h-[calc(100vh-140px)] md:h-[calc(100vh-80px)] bg-slate-50 dark:bg-slate-950 flex flex-col">
            {/* Header */}
            <div className="shrink-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleBack}
                        className="gap-2"
                    >
                        <ArrowLeft size={16} />
                        Volver a Gestión de Asientos
                    </Button>
                    <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                        Visor de Mapa - Evento #{eventoId}
                    </h2>
                </div>
            </div>

            {/* Visor */}
            <div className="flex-1 overflow-auto p-8">
                <div className="max-w-4xl mx-auto">
                    <SeatMapViewer
                        mapa={mapaEjemplo}
                        onAsientoClick={(asiento) => {
                            console.log('Asiento seleccionado:', asiento);
                        }}
                        ancho={800}
                        alto={600}
                    />
                </div>
            </div>
        </div>
    );
}
