import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Plus, Edit, Eye } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';

// Mock de eventos - en producción vendría del backend
const eventosConMapas = [
    { id: 1, nombre: 'Noche de Jazz Benéfica', tieneMapa: true, totalAsientos: 150 },
    { id: 2, nombre: 'Gala Anual Fundación', tieneMapa: false, totalAsientos: 0 },
    { id: 3, nombre: 'Concierto Solidario', tieneMapa: true, totalAsientos: 200 },
];

export default function GestionAsientos() {
    const navigate = useNavigate();
    const [eventos] = useState(eventosConMapas);

    const handleCrearMapa = (eventoId: number) => {
        navigate(`/admin/asientos/editor/${eventoId}`);
    };

    const handleEditarMapa = (eventoId: number) => {
        navigate(`/admin/asientos/editor/${eventoId}`);
    };

    const handleVerMapa = (eventoId: number) => {
        navigate(`/admin/asientos/visor/${eventoId}`);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                    Gestión de Asientos
                </h1>
            </div>

            <Card className="bg-white dark:bg-slate-800 border-0 dark:border-slate-700">
                <CardHeader>
                    <CardTitle className="text-slate-900 dark:text-white">
                        Mapas de Asientos por Evento
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {eventos.map((evento) => (
                            <div
                                key={evento.id}
                                className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-[#00A651] dark:hover:border-[#00A651] transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className={`p-3 rounded-lg ${evento.tieneMapa
                                                ? 'bg-green-100 dark:bg-green-900/30'
                                                : 'bg-slate-200 dark:bg-slate-800'
                                            }`}
                                    >
                                        <MapPin
                                            size={24}
                                            className={
                                                evento.tieneMapa
                                                    ? 'text-green-600 dark:text-green-400'
                                                    : 'text-slate-400 dark:text-slate-500'
                                            }
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900 dark:text-white">
                                            {evento.nombre}
                                        </h3>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            {evento.tieneMapa
                                                ? `${evento.totalAsientos} asientos configurados`
                                                : 'Sin mapa de asientos'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {evento.tieneMapa ? (
                                        <>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleVerMapa(evento.id)}
                                                className="gap-2"
                                            >
                                                <Eye size={16} />
                                                Ver
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleEditarMapa(evento.id)}
                                                className="gap-2"
                                            >
                                                <Edit size={16} />
                                                Editar
                                            </Button>
                                        </>
                                    ) : (
                                        <Button
                                            variant="default"
                                            size="sm"
                                            onClick={() => handleCrearMapa(evento.id)}
                                            className="gap-2 bg-[#00A651] hover:bg-[#008a43]"
                                        >
                                            <Plus size={16} />
                                            Crear Mapa
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800">
                <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <MapPin size={20} className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-1">
                                Acerca de los Mapas de Asientos
                            </h4>
                            <p className="text-sm text-blue-800 dark:text-blue-400">
                                Los mapas de asientos permiten a los usuarios seleccionar ubicaciones específicas
                                al comprar entradas. Puedes crear mapas personalizados con zonas, asientos
                                individuales y objetos decorativos para representar el espacio del evento.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
