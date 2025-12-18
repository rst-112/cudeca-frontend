import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Plus, Edit, Eye, Info } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';

const eventosConMapas = [
  { id: 1, nombre: 'Noche de Jazz Benéfica', tieneMapa: true, totalAsientos: 150 },
  { id: 2, nombre: 'Gala Anual Fundación', tieneMapa: false, totalAsientos: 0 },
  { id: 3, nombre: 'Concierto Solidario', tieneMapa: true, totalAsientos: 200 },
];

export default function GestionAsientos() {
  const navigate = useNavigate();
  const [eventos] = useState(eventosConMapas);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-['Arimo']">
      <div className="flex flex-col gap-2 border-b border-slate-200 dark:border-slate-800 pb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Gestión de Asientos</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Configura los mapas interactivos para tus eventos numerados.
        </p>
      </div>

      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <CardTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MapPin className="text-[#00a651]" size={20} />
            Mapas de Asientos por Evento
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {eventos.map((evento) => (
              <div
                key={evento.id}
                className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-200 dark:border-slate-700/50 hover:border-[#00A651]/50 dark:hover:border-[#00A651]/50 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center gap-4 mb-4 sm:mb-0">
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-full shrink-0 ${evento.tieneMapa ? 'bg-[#00A651]/10 text-[#00A651]' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}`}
                  >
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      {evento.nombre}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <span
                        className={`w-2 h-2 rounded-full ${evento.tieneMapa ? 'bg-green-500' : 'bg-slate-400'}`}
                      ></span>
                      {evento.tieneMapa
                        ? `${evento.totalAsientos} asientos configurados`
                        : 'Sin mapa de asientos'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  {evento.tieneMapa ? (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/admin/asientos/visor/${evento.id}`)}
                        className="text-slate-600 dark:text-slate-300 hover:text-[#00a651] dark:hover:text-[#00a651]"
                      >
                        <Eye size={16} className="mr-2" /> Ver
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/admin/asientos/editor/${evento.id}`)}
                        className="border-slate-300 dark:border-slate-600 hover:border-[#00A651] dark:hover:border-[#00A651] hover:text-[#00A651]"
                      >
                        <Edit size={16} className="mr-2" /> Editar
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => navigate(`/admin/asientos/editor/${evento.id}`)}
                      className="bg-[#00A651] hover:bg-[#008a43] text-white shadow-sm"
                    >
                      <Plus size={16} className="mr-2" /> Crear Mapa
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Info Box */}
      <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-xl p-4 flex gap-4 items-start">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400 shrink-0">
          <Info size={20} />
        </div>
        <div>
          <h4 className="font-bold text-blue-900 dark:text-blue-300 text-sm mb-1">
            Acerca de los Mapas de Asientos
          </h4>
          <p className="text-sm text-blue-800 dark:text-blue-400 leading-relaxed">
            Los mapas de asientos permiten a los usuarios seleccionar ubicaciones específicas al
            comprar entradas. Puedes crear mapas personalizados con zonas, asientos individuales y
            objetos decorativos para representar el espacio del evento.
          </p>
        </div>
      </div>
    </div>
  );
}
