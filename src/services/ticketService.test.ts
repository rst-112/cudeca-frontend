import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { downloadTicketPdf, sendTicketEmail } from './ticketService';

describe('ticketService', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Mock console.log to avoid cluttering output
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('downloadTicketPdf', () => {
    it('genera y descarga el PDF correctamente', async () => {
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

      // Ejecutar la función
      const promise = downloadTicketPdf('TKT-123', 'Evento Test');

      // Avanzar timers para simular espera
      vi.advanceTimersByTime(1500);

      await promise;

      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('[Motor PDF]'));
      expect(mockCreateObjectURL).toHaveBeenCalled();
      expect(mockCreateElement).toHaveBeenCalledWith('a');
      expect(mockLink.setAttribute).toHaveBeenCalledWith('download', 'Entrada_Cudeca_TKT-123.pdf');
      expect(mockLink.href).toBe('blob:mock-url');
      expect(mockAppendChild).toHaveBeenCalledWith(mockLink as unknown as HTMLAnchorElement);
      expect(mockLink.click).toHaveBeenCalled();
      expect(mockLink.parentNode.removeChild).toHaveBeenCalledWith(
        mockLink as unknown as HTMLAnchorElement,
      );

      // Restore URL
      window.URL = originalURL;
    });
  });

  describe('sendTicketEmail', () => {
    it('envía el email correctamente', async () => {
      const promise = sendTicketEmail('TKT-123');

      // Avanzar timers para simular espera
      vi.advanceTimersByTime(1000);

      const result = await promise;

      expect(console.log).toHaveBeenCalledWith(expect.stringContaining('[Emailing]'));
      expect(result).toBe(true);
    });
  });
});
