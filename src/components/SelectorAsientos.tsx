import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/Button';
import { SeatMapViewer } from '../features/seats';
import type { MapaAsientos, Asiento } from '../types/seatmap.types';

interface SelectorAsientosProps {
    isOpen: boolean;
    onClose: () => void;
    mapaAsientos: MapaAsientos;
    cantidadRequerida: number;
    onConfirmar: (asientos: Asiento[]) => void;
    tipoEntradaNombre: string;
}

/**
 * SelectorAsientos - Modal interactivo para seleccionar asientos desde el mapa
 */
export default function SelectorAsientos({
    isOpen,
    onClose,
    mapaAsientos,
    cantidadRequerida,
    onConfirmar,
    tipoEntradaNombre,
}: SelectorAsientosProps) {
    const [asientosSeleccionados, setAsientosSeleccionados] = useState<Asiento[]>([]);

    // Resetear selección cuando se abre el modal
    useEffect(() => {
        if (isOpen) {
            setAsientosSeleccionados([]);
        }
    }, [isOpen]);

    const handleAsientoClick = (asiento: Asiento) => {
        // Si el asiento no está disponible, ignorar
        if (asiento.estado !== 'LIBRE') return;

        setAsientosSeleccionados((prev) => {
            const yaSeleccionado = prev.find((a) => a.id === asiento.id);

            if (yaSeleccionado) {
                // Deseleccionar
                return prev.filter((a) => a.id !== asiento.id);
            } else {
                // Seleccionar solo si no hemos alcanzado el límite
                if (prev.length < cantidadRequerida) {
                    return [...prev, asiento];
                }
                return prev;
            }
        });
    };

    const handleConfirmar = () => {
        if (asientosSeleccionados.length === cantidadRequerida) {
            onConfirmar(asientosSeleccionados);
            onClose();
        }
    };

    if (!isOpen) return null;

    const handleBackdropClick = (e: any) => {
        // Solo cerrar si se hace click en el backdrop, no en el contenido
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleCloseButton = () => {
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={handleBackdropClick}
        >
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Selecciona tus Asientos
                        </h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            {tipoEntradaNombre} - Selecciona {cantidadRequerida} asiento(s)
                        </p>
                    </div>
                    <button
                        onClick={handleCloseButton}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <X size={24} className="text-slate-600 dark:text-slate-400" />
                    </button>
                </div>

                {/* Info de selección */}
                <div className="px-6 py-4 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-green-500 rounded"></div>
                                <span className="text-sm text-slate-700 dark:text-slate-300">Disponible</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                                <span className="text-sm text-slate-700 dark:text-slate-300">Seleccionado</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-red-500 rounded"></div>
                                <span className="text-sm text-slate-700 dark:text-slate-300">Ocupado</span>
                            </div>
                        </div>
                        <div className="text-sm font-semibold text-slate-900 dark:text-white">
                            {asientosSeleccionados.length} / {cantidadRequerida} seleccionados
                        </div>
                    </div>

                    {/* Lista de asientos seleccionados */}
                    {asientosSeleccionados.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                            {asientosSeleccionados.map((asiento) => (
                                <div
                                    key={asiento.id}
                                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium"
                                >
                                    {asiento.etiqueta}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Mapa de asientos */}
                <div className="flex-1 overflow-auto p-6">
                    <div className="flex justify-center">
                        <SeatMapViewer
                            asientos={mapaAsientos.zonas.flatMap((zona) =>
                                zona.asientos.map((asiento) => ({
                                    ...asiento,
                                    estado: asientosSeleccionados.find((a) => a.id === asiento.id)
                                        ? ('SELECCIONADO' as const)
                                        : asiento.estado,
                                }))
                            )}
                            objetosDecorativos={mapaAsientos.zonas.flatMap((z) => z.objetosDecorativos || [])}
                            onSelectSeat={(asientoId) => {
                                const asiento = mapaAsientos.zonas
                                    .flatMap((z) => z.asientos)
                                    .find((a) => a.id === asientoId);
                                if (asiento) {
                                    handleAsientoClick(asiento);
                                }
                            }}
                            ancho={mapaAsientos.ancho || 800}
                            alto={mapaAsientos.alto || 600}
                        />
                    </div>
                </div>

                {/* Footer con botones */}
                <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                    <Button variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button
                        variant="default"
                        onClick={handleConfirmar}
                        disabled={asientosSeleccionados.length !== cantidadRequerida}
                        className="bg-[#00A651] hover:bg-[#008a43] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Confirmar Selección ({asientosSeleccionados.length}/{cantidadRequerida})
                    </Button>
                </div>
            </div>
        </div>
    );
}
