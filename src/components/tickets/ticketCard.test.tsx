import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TicketCard } from './ticketCard';
import * as ticketService from '../../services/ticketService';

// Mock del servicio
vi.mock('../../services/ticketService', () => ({
  downloadTicketPdf: vi.fn().mockResolvedValue(undefined),
  sendTicketEmail: vi.fn().mockResolvedValue(true),
}));

const mockTicket = {
  id: 'TKT-123',
  evento: 'Evento de Prueba',
  fecha: '01 Ene 2025 • 20:00h',
  lugar: 'Lugar de Prueba',
  asistente: 'Juan Pérez',
  qrData: 'QR_DATA_123',
};

describe('TicketCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza correctamente los detalles del ticket', () => {
    render(<TicketCard ticket={mockTicket} />);

    expect(screen.getByText('Evento de Prueba')).toBeInTheDocument();
    expect(screen.getByText('#TKT-123')).toBeInTheDocument();
    expect(screen.getByText('01 Ene 2025 • 20:00h')).toBeInTheDocument();
    expect(screen.getByText('Lugar de Prueba')).toBeInTheDocument();
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
  });

  it('renderiza la imagen del código QR con la URL correcta', () => {
    render(<TicketCard ticket={mockTicket} />);

    const qrImage = screen.getByAltText('Código QR Entrada');
    expect(qrImage).toBeInTheDocument();
    expect(qrImage).toHaveAttribute(
      'src',
      expect.stringContaining(
        'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=QR_DATA_123',
      ),
    );
  });

  it('llama a downloadTicketPdf al hacer clic en el botón PDF', async () => {
    render(<TicketCard ticket={mockTicket} />);

    const pdfButton = screen.getByText(/PDF/i);
    fireEvent.click(pdfButton);

    expect(screen.getByText(/Generando.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(ticketService.downloadTicketPdf).toHaveBeenCalledWith('TKT-123', 'Evento de Prueba');
    });

    await waitFor(() => {
      expect(screen.queryByText(/Generando.../i)).not.toBeInTheDocument();
    });
  });

  it('llama a sendTicketEmail al hacer clic en el botón Email', async () => {
    render(<TicketCard ticket={mockTicket} />);

    const emailButton = screen.getByText(/Email/i);
    fireEvent.click(emailButton);

    expect(screen.getByText(/Enviando.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(ticketService.sendTicketEmail).toHaveBeenCalledWith('TKT-123');
    });

    await waitFor(() => {
      expect(screen.getByText(/Enviado/i)).toBeInTheDocument();
    });
  });
});
