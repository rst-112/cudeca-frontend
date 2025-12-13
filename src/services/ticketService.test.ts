import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { downloadTicketPdf, sendTicketEmail } from './ticketService';

import type { Ticket } from '../types';

describe('ticketService', () => {
  beforeEach(() => {
    // Mock console methods to avoid cluttering output
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('downloadTicketPdf', () => {
    it('genera y descarga el PDF correctamente cuando el backend responde', async () => {
      // Mock fetch global
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        blob: vi.fn().mockResolvedValue(new Blob(['pdf content'])),
      });

      // Mock URL.createObjectURL
      const mockCreateObjectURL = vi.fn(() => 'blob:mock-url');

      // Handle global URL object safely
      const originalURL = window.URL;
      Object.defineProperty(window, 'URL', {
        value: {
          createObjectURL: mockCreateObjectURL,
          revokeObjectURL: vi.fn(),
        },
        writable: true,
      });

      // Mock DOM elements
      const mockLink = {
        href: '',
        setAttribute: vi.fn(),
        click: vi.fn(),
        parentNode: {
          removeChild: vi.fn(),
        },
      };

      const mockCreateElement = vi
        .spyOn(document, 'createElement')
        .mockReturnValue(mockLink as unknown as HTMLAnchorElement);
      const mockAppendChild = vi
        .spyOn(document.body, 'appendChild')
        .mockImplementation(() => mockLink as unknown as HTMLAnchorElement);

      const mockTicket = { codigoAsiento: 'TKT-123' } as unknown as Ticket;

      // Ejecutar la función
      await downloadTicketPdf(mockTicket);

      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('[Motor PDF]'));
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/tickets/descargar-pdf',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(mockTicket),
        }),
      );
      expect(mockCreateObjectURL).toHaveBeenCalled();
      expect(mockCreateElement).toHaveBeenCalledWith('a');
      expect(mockLink.setAttribute).toHaveBeenCalledWith('download', 'Entrada_Cudeca_TKT-123.pdf');
      expect(mockLink.href).toBe('blob:mock-url');
      expect(mockAppendChild).toHaveBeenCalledWith(mockLink as unknown as HTMLAnchorElement);
      expect(mockLink.click).toHaveBeenCalled();

      // Restore URL
      window.URL = originalURL;
    });

    it('usa el fallback cuando el backend falla', async () => {
      // Mock fetch que falla
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      const mockTicket = {
        id: '1',
        codigoAsiento: 'TKT-123',
        nombreEvento: 'Evento Test',
        fechaEventoFormato: '01 Ene 2025',
        lugarEvento: 'Lugar Test',
        nombreUsuario: 'Usuario Test',
        codigoQR: 'QR123',
      } as Ticket;

      // La función no debería lanzar error (maneja el fallback internamente)
      await expect(downloadTicketPdf(mockTicket)).resolves.not.toThrow();

      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('Backend no disponible'),
        expect.anything(),
      );
    });
  });

  describe('sendTicketEmail', () => {
    it('envía el email correctamente cuando el backend responde', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({ status: 'success', email: 'test@example.com' }),
      });

      const mockTicket = { id: 'TKT-123' } as unknown as Ticket;
      const result = await sendTicketEmail(mockTicket);

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/tickets/generar-y-enviar',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            ...mockTicket,
            sender: 'frangalisteo1@gmail.com',
          }),
        }),
      );
      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('[Emailing]'));
      expect(result).toBe(true);
    });

    it('retorna false cuando el servidor responde con error', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({ status: 'error', message: 'Error del servidor' }),
      });

      const mockTicket = { id: 'TKT-123' } as unknown as Ticket;
      const result = await sendTicketEmail(mockTicket);

      expect(console.error).toHaveBeenCalledWith('Error del servidor:', 'Error del servidor');
      expect(result).toBe(false);
    });

    it('usa el fallback de simulación cuando el backend no está disponible', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      const mockTicket = {
        id: 'TKT-123',
        nombreEvento: 'Evento Test',
      } as unknown as Ticket;

      const result = await sendTicketEmail(mockTicket);

      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('Backend no disponible'),
        expect.anything(),
      );
      expect(console.log).toHaveBeenCalledWith('[SIMULACIÓN] Enviando email...');
      expect(result).toBe(true);
    });
  });
});
