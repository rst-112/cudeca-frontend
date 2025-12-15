import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { downloadTicketPdf, sendTicketEmail } from './ticketService';
import { apiClient } from './api';
import type { Ticket } from '../types/ticket.types';

// Mock de apiClient
vi.mock('./api', () => ({
  apiClient: {
    post: vi.fn(),
  },
}));

// Mock de jsPDF
const mockSave = vi.fn();
const mockText = vi.fn();
const mockRect = vi.fn();
const mockAddImage = vi.fn();
const mockSetFillColor = vi.fn();
const mockSetFontSize = vi.fn();
const mockSetTextColor = vi.fn();

vi.mock('jspdf', () => {
  return {
    jsPDF: class {
      save = mockSave;
      text = mockText;
      rect = mockRect;
      addImage = mockAddImage;
      setFillColor = mockSetFillColor;
      setFontSize = mockSetFontSize;
      setTextColor = mockSetTextColor;
    },
  };
});

describe('ticketService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});

    // Mock global fetching for image blob (used in fallback)
    globalThis.fetch = vi.fn().mockResolvedValue({
      blob: () => Promise.resolve(new Blob([''])),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('downloadTicketPdf', () => {
    it('genera y descarga el PDF correctamente cuando el backend responde', async () => {
      // Mock respuesta exitosa de apiClient
      vi.mocked(apiClient.post).mockResolvedValue({
        data: new Blob(['pdf-content'], { type: 'application/pdf' }),
      });

      // Mock URL methods
      const mockCreateObjectURL = vi.fn(() => 'blob:mock-url');
      const mockRevokeObjectURL = vi.fn();

      const originalURL = window.URL;
      Object.defineProperty(window, 'URL', {
        value: {
          createObjectURL: mockCreateObjectURL,
          revokeObjectURL: mockRevokeObjectURL,
        },
        writable: true,
      });

      // Mock DOM methods for link click
      const mockLink = {
        href: '',
        setAttribute: vi.fn(),
        click: vi.fn(),
        parentNode: { removeChild: vi.fn() },
      };

      const mockCreateElement = vi
        .spyOn(document, 'createElement')
        .mockReturnValue(mockLink as unknown as HTMLAnchorElement);
      const mockAppendChild = vi
        .spyOn(document.body, 'appendChild')
        .mockImplementation(() => mockLink as unknown as HTMLAnchorElement);

      const mockTicket = { codigoAsiento: 'TKT-123' } as unknown as Ticket;

      await downloadTicketPdf(mockTicket);

      expect(apiClient.post).toHaveBeenCalledWith(
        '/tickets/descargar-pdf',
        mockTicket,
        expect.objectContaining({ responseType: 'blob' }),
      );

      expect(mockCreateElement).toHaveBeenCalledWith('a');
      expect(mockLink.href).toBe('blob:mock-url');
      expect(mockAppendChild).toHaveBeenCalledWith(mockLink as unknown as HTMLAnchorElement);
      expect(mockLink.click).toHaveBeenCalled();

      // Restore
      window.URL = originalURL;
    });

    it('usa el fallback cuando el backend falla', async () => {
      // Simular fallo de backend (axios error)
      vi.mocked(apiClient.post).mockRejectedValue(new Error('Network Error'));

      const mockTicket = {
        id: '1',
        codigoAsiento: 'TKT-123',
        nombreEvento: 'Evento Test',
        fechaEventoFormato: '01 Ene 2025',
        lugarEvento: 'Lugar Test',
        nombreUsuario: 'Usuario Test',
        codigoQR: 'QR123',
      } as Ticket;

      await downloadTicketPdf(mockTicket);

      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('Backend falló'),
        expect.any(Error),
      );

      // Debe haber generado el PDF localmente
      expect(mockSave).toHaveBeenCalledWith('MOCK_Entrada_TKT-123.pdf');
    });
  });

  describe('sendTicketEmail', () => {
    it('envía el email correctamente cuando el backend responde', async () => {
      vi.mocked(apiClient.post).mockResolvedValue({ data: { success: true } });

      const mockTicket = { id: 'TKT-123' } as unknown as Ticket;
      const result = await sendTicketEmail(mockTicket);

      expect(apiClient.post).toHaveBeenCalledWith(
        '/tickets/generar-y-enviar',
        expect.objectContaining({
          id: 'TKT-123',
          sender: 'frangalisteo1@gmail.com',
        }),
      );
      expect(result).toBe(true);
    });

    it('usa el fallback de simulación cuando el backend falla', async () => {
      vi.mocked(apiClient.post).mockRejectedValue(new Error('Network Error'));

      const mockTicket = { id: 'TKT-123' } as unknown as Ticket;

      // Usar timers reales o fake timers para acelerar la prueba
      // Dado que el componente espera 2s, podemos usar fake timers
      vi.useFakeTimers();

      const promise = sendTicketEmail(mockTicket);

      // Avanzar el tiempo
      await vi.advanceTimersByTimeAsync(2000); // 2000ms delay en el catch

      const result = await promise;

      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('Backend falló'),
        expect.any(Error),
      );
      expect(result).toBe(true);

      vi.useRealTimers();
    });
  });
});
