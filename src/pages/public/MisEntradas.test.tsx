import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MisEntradas from './MisEntradas';
import type { Ticket } from '../../types';

// Mock del componente TicketCard para aislar la prueba de la página
vi.mock('../../components/tickets/ticketCard', () => ({
  TicketCard: ({ ticket }: { ticket: Ticket }) => (
    <div data-testid="mock-ticket-card">
      {ticket.nombreEvento} - {ticket.nombreUsuario}
    </div>
  ),
}));

describe('MisEntradas Page', () => {
  it('renderiza el título y la descripción correctamente', () => {
    render(<MisEntradas />);

    expect(screen.getByText('Mis Entradas')).toBeInTheDocument();
    expect(
      screen.getByText(/Consulta tus entradas, descarga el PDF oficial o envíalas a tu correo/i),
    ).toBeInTheDocument();
  });

  it('renderiza la lista de tickets', () => {
    render(<MisEntradas />);

    const tickets = screen.getAllByTestId('mock-ticket-card');
    expect(tickets).toHaveLength(2); // Basado en los datos MOCK_TICKETS en el componente

    expect(screen.getByText('Cena de Gala Benéfica - Fran García')).toBeInTheDocument();
    expect(screen.getByText('Concierto Solidario Rock - Fran García')).toBeInTheDocument();
  });
});
