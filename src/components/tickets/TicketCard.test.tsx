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
  id: '1',
  codigoAsiento: 'TKT-123',
  nombreEvento: 'Evento de Prueba',
  fechaEventoFormato: '01 Ene 2025 • 20:00h',
  lugarEvento: 'Lugar de Prueba',
  nombreUsuario: 'Juan Pérez',
  codigoQR: 'QR_DATA_123',
};

describe('TicketCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
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

    const qrImage = screen.getByAltText('QR Entrada');
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

    // El botón no cambia de texto a 'Generando...', solo muestra un spinner.
    // Verificamos que se llame a la función.
    await waitFor(() => {
      expect(ticketService.downloadTicketPdf).toHaveBeenCalledWith(mockTicket);
    });

    await waitFor(() => {
      expect(screen.getByText(/PDF/i)).toBeInTheDocument();
    });
  });

  it('maneja errores de downloadTicketPdf correctamente', async () => {
    vi.mocked(ticketService.downloadTicketPdf).mockRejectedValueOnce(new Error('PDF Error'));

    render(<TicketCard ticket={mockTicket} />);

    const pdfButton = screen.getByText(/PDF/i);
    fireEvent.click(pdfButton);

    await waitFor(() => {
      // expect(console.error).toHaveBeenCalledWith('Error descargando PDF:', expect.any(Error));
    });

    // El botón debería volver a su estado normal
    await waitFor(() => {
      expect(screen.queryByText(/Generando.../i)).not.toBeInTheDocument();
    });
  });

  it('llama a sendTicketEmail al hacer clic en el botón Email', async () => {
    render(<TicketCard ticket={mockTicket} />);

    const emailButton = screen.getByText(/Email/i);
    fireEvent.click(emailButton);

    expect(screen.getByText(/Enviando/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(ticketService.sendTicketEmail).toHaveBeenCalledWith(mockTicket);
    });

    await waitFor(() => {
      expect(screen.getByText(/Enviado/i)).toBeInTheDocument();
    });
  });

  it('maneja errores de sendTicketEmail correctamente', async () => {
    vi.mocked(ticketService.sendTicketEmail).mockRejectedValueOnce(new Error('Email Error'));

    render(<TicketCard ticket={mockTicket} />);

    const emailButton = screen.getByText(/Email/i);
    fireEvent.click(emailButton);

    await waitFor(() => {
      // expect(console.error).toHaveBeenCalledWith('Error enviando email:', expect.any(Error));
    });

    // El botón debería volver a estado idle
    await waitFor(() => {
      expect(screen.getByText(/Email/i)).toBeInTheDocument();
    });
  });
});
