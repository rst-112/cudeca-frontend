import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiClient } from '../../services/api';
import MisEntradas from './MisEntradas';
import type { Ticket } from '../../types/ticket.types';

// Mock del componente TicketCard para aislar la prueba de la página
vi.mock('../../components/tickets/ticketCard', () => ({
  TicketCard: ({ ticket }: { ticket: Ticket }) => (
    <div data-testid="mock-ticket-card">
      {ticket.nombreEvento} - {ticket.nombreUsuario}
    </div>
  ),
}));

// Mock de apiClient
vi.mock('../../services/api', () => ({
  apiClient: {
    get: vi.fn(),
  },
}));

const MOCK_TICKETS: Ticket[] = [
  {
    id: 'mock-1',
    codigoAsiento: 'MOCK-001',
    nombreEvento: 'Cena de Gala Benéfica',
    fechaEventoFormato: '15 Oct 2025 • 21:00h',
    lugarEvento: 'Hotel Miramar, Málaga',
    nombreUsuario: 'Fran García',
    codigoQR: 'MOCK_DATA_QR_001',
  },
  {
    id: 'mock-2',
    codigoAsiento: 'MOCK-045',
    nombreEvento: 'Concierto Solidario Rock',
    fechaEventoFormato: '22 Nov 2025 • 20:00h',
    lugarEvento: 'Sala París 15, Málaga',
    nombreUsuario: 'Fran García',
    codigoQR: 'MOCK_DATA_QR_002',
  },
];

describe('MisEntradas Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza el título y la descripción correctamente', async () => {
    // Mock para que no falle y devuelva loading false rápido o data vacía
    vi.mocked(apiClient.get).mockResolvedValue({ data: [] });

    render(<MisEntradas />);

    await waitFor(() => {
      expect(screen.getByText('Mis Entradas')).toBeInTheDocument();
    });
    expect(
      screen.getByText(/Gestiona y descarga tus accesos para los próximos eventos/i),
    ).toBeInTheDocument();
  });

  it('renderiza la lista de tickets', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: MOCK_TICKETS });

    render(<MisEntradas />);

    // Esperar a que cargue
    await waitFor(() => {
      expect(screen.queryByText(/Buscando tus entradas.../i)).not.toBeInTheDocument();
    });

    const tickets = screen.getAllByTestId('mock-ticket-card');
    expect(tickets).toHaveLength(2);

    expect(screen.getByText('Cena de Gala Benéfica - Fran García')).toBeInTheDocument();
    expect(screen.getByText('Concierto Solidario Rock - Fran García')).toBeInTheDocument();
  });
});
