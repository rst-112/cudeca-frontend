import { TicketCard } from '../../components/tickets/ticketCard';
import type { Ticket } from '../../types';

// Datos de prueba (Mocks)
const MOCK_TICKETS: Ticket[] = [
  {
    id: 'TKT-2025-001',
    evento: 'Cena de Gala Benéfica',
    fecha: '15 Oct 2025 • 21:00h',
    lugar: 'Hotel Miramar, Málaga',
    asistente: 'Fran García',
    qrData: 'ACCESO_VALIDO_TKT_001',
  },
  {
    id: 'TKT-2025-045',
    evento: 'Concierto Solidario Rock',
    fecha: '22 Nov 2025 • 20:00h',
    lugar: 'Sala París 15, Málaga',
    asistente: 'Fran García',
    asiento: 'Pista General',
    qrData: 'ACCESO_VALIDO_TKT_045',
  },
];

export default function MisEntradas() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Entradas</h1>
          <p className="text-cudeca-gris-texto">
            Consulta tus entradas, descarga el PDF oficial o envíalas a tu correo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {MOCK_TICKETS.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      </div>
    </div>
  );
}
