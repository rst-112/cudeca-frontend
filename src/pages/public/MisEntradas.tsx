import { useEffect, useState } from 'react';
import { TicketCard } from '../../components/tickets/TicketCard';
import type { Ticket } from '../../types/ticket.types';
import { apiClient } from '../../services/api';
import { Loader2, Ticket as TicketIcon, DatabaseZap } from 'lucide-react';
import { Button } from '../../components/ui/Button';

// ⚠️⚠️⚠️ MOCK DATA - BORRAR EN PRODUCCIÓN ⚠️⚠️⚠️
const MOCK_TICKETS: Ticket[] = [
  {
    id: 'mock-1',
    codigoAsiento: 'MOCK-001',
    nombreEvento: '[MOCK] Cena de Gala Benéfica',
    fechaEventoFormato: '15 Oct 2025 • 21:00h',
    lugarEvento: 'Hotel Miramar, Málaga',
    nombreUsuario: 'Usuario de Prueba',
    codigoQR: 'MOCK_DATA_QR_001',
  },
  {
    id: 'mock-2',
    codigoAsiento: 'MOCK-045',
    nombreEvento: '[MOCK] Concierto Solidario',
    fechaEventoFormato: '22 Nov 2025 • 20:00h',
    lugarEvento: 'Sala París 15, Málaga',
    nombreUsuario: 'Usuario de Prueba',
    codigoQR: 'MOCK_DATA_QR_002',
  },
  {
    id: 'mock-3',
    codigoAsiento: 'MOCK-088',
    nombreEvento: '[MOCK] Carrera Solidaria',
    fechaEventoFormato: '10 Dic 2025 • 10:00h',
    lugarEvento: 'Paseo Marítimo, Málaga',
    nombreUsuario: 'Usuario de Prueba',
    codigoQR: 'MOCK_DATA_QR_003',
  },
];
// ⚠️⚠️⚠️ FIN MOCK DATA ⚠️⚠️⚠️

export default function MisEntradas() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMockData, setIsMockData] = useState(false);

  useEffect(() => {
    let isMounted = true; // Prevenir actualizaciones en componentes desmontados

    const fetchTickets = async () => {
      setLoading(true);
      try {
        const { data } = await apiClient.get<Ticket[]>('/tickets/mis-entradas');
        if (isMounted) {
          setTickets(data);
          setIsMockData(false);
        }
      } catch (err) {
        console.warn('⚠️ Backend no disponible. Activando MODO MOCK.', err);

        // Simular retardo de red para realismo en dev
        setTimeout(() => {
          if (isMounted) {
            setTickets(MOCK_TICKETS);
            setIsMockData(true);
          }
        }, 600);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTickets();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 w-full animate-in fade-in duration-500">
        <Loader2 className="h-10 w-10 text-[#00A651] animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Buscando tus entradas...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* ⚠️ ALERTA DE DESARROLLO (Solo visible si falla el backend) */}
      {isMockData && (
        <div className="animate-in slide-in-from-top-2 duration-300">
          <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-500 p-4 rounded-r-lg shadow-xs flex items-start gap-4">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-full shrink-0 text-amber-600 dark:text-amber-400">
              <DatabaseZap size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-800 dark:text-amber-200 uppercase tracking-wide">
                Modo Simulación Activado
              </h3>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                Backend no detectado. Mostrando datos de prueba. Las acciones de PDF y Email son
                simuladas.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Cabecera de Sección */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-['Arimo'] flex items-center gap-2">
            <TicketIcon className="text-[#00A651]" /> Mis Entradas
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Gestiona y descarga tus accesos para los próximos eventos.
          </p>
        </div>
        <div className="text-sm font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
          Total: <span className="text-slate-900 dark:text-white">{tickets.length}</span>
        </div>
      </div>

      {/* Grid de Tickets */}
      {tickets.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 justify-items-center md:justify-items-start">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="w-full flex justify-center md:block">
              <TicketCard ticket={ticket} />
            </div>
          ))}
        </div>
      ) : (
        /* Estado Vacío */
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-center">
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-full mb-4">
            <TicketIcon className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-white">
            No tienes entradas activas
          </h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm mt-1 mb-6">
            Parece que aún no has comprado entradas para ningún evento próximo.
          </p>
          <Button asChild className="bg-[#00A651] hover:bg-[#008a43]" variant="default">
            <a href="/eventos">Explorar Eventos Disponibles</a>
          </Button>
        </div>
      )}
    </div>
  );
}
