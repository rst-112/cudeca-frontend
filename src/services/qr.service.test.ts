import { describe, it, expect, vi, beforeEach } from 'vitest';
import { qrService } from './qr.service';
import api from '../lib/axios';

// Mock del módulo axios
vi.mock('../lib/axios', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

describe('qr.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('validarTicket', () => {
    it('debe validar un ticket exitosamente con estado OK', async () => {
      const mockResponse = {
        data: {
          estado: 'OK',
          mensaje: 'Entrada validada correctamente',
          entradaId: 123,
          codigoQR: 'QR123456',
          estadoAnterior: 'VALIDA',
          estadoActual: 'USADA',
          timestamp: Date.now(),
        },
      };

      vi.mocked(api.post).mockResolvedValueOnce(mockResponse);

      const result = await qrService.validarTicket('QR123456', 'SCANNER-001');

      expect(api.post).toHaveBeenCalledWith('/validador-qr/validar', {
        codigoQR: 'QR123456',
        dispositivoId: 'SCANNER-001',
      });
      expect(result).toEqual(mockResponse.data);
      expect(result.estado).toBe('OK');
      expect(result.entradaId).toBe(123);
    });

    it('debe manejar entrada ya usada (ERROR_YA_USADA)', async () => {
      const mockResponse = {
        data: {
          estado: 'ERROR_YA_USADA',
          mensaje: 'Esta entrada ya fue utilizada anteriormente',
          codigoQR: 'QR789012',
          estadoAnterior: 'USADA',
          estadoActual: 'USADA',
          timestamp: Date.now(),
        },
      };

      vi.mocked(api.post).mockResolvedValueOnce(mockResponse);

      const result = await qrService.validarTicket('QR789012', 'SCANNER-002');

      expect(result.estado).toBe('ERROR_YA_USADA');
      expect(result.mensaje).toContain('ya fue utilizada');
    });

    it('debe manejar entrada anulada (ERROR_ANULADA)', async () => {
      const mockResponse = {
        data: {
          estado: 'ERROR_ANULADA',
          mensaje: 'Esta entrada ha sido anulada',
          codigoQR: 'QR345678',
          estadoAnterior: 'ANULADA',
          estadoActual: 'ANULADA',
          timestamp: Date.now(),
        },
      };

      vi.mocked(api.post).mockResolvedValueOnce(mockResponse);

      const result = await qrService.validarTicket('QR345678', 'SCANNER-003');

      expect(result.estado).toBe('ERROR_ANULADA');
      expect(result.mensaje).toContain('anulada');
    });

    it('debe manejar entrada no encontrada (ERROR_NO_ENCONTRADO)', async () => {
      const mockResponse = {
        data: {
          estado: 'ERROR_NO_ENCONTRADO',
          mensaje: 'No se encontró ninguna entrada con este código QR',
          codigoQR: 'QR999999',
          timestamp: Date.now(),
        },
      };

      vi.mocked(api.post).mockResolvedValueOnce(mockResponse);

      const result = await qrService.validarTicket('QR999999', 'SCANNER-004');

      expect(result.estado).toBe('ERROR_NO_ENCONTRADO');
      expect(result.mensaje).toContain('No se encontró');
    });

    it('debe propagar errores de red', async () => {
      const networkError = new Error('Network Error');
      vi.mocked(api.post).mockRejectedValueOnce(networkError);

      await expect(qrService.validarTicket('QR123', 'SCANNER-005')).rejects.toThrow(
        'Network Error',
      );
    });

    it('debe manejar errores de timeout', async () => {
      const timeoutError = { code: 'ECONNABORTED', message: 'timeout of 5000ms exceeded' };
      vi.mocked(api.post).mockRejectedValueOnce(timeoutError);

      await expect(qrService.validarTicket('QR456', 'SCANNER-006')).rejects.toMatchObject({
        code: 'ECONNABORTED',
      });
    });

    it('debe enviar correctamente el código QR con caracteres especiales', async () => {
      const mockResponse = {
        data: {
          estado: 'OK',
          mensaje: 'Entrada validada',
          codigoQR: 'QR-ABC/123+XYZ',
          timestamp: Date.now(),
        },
      };

      vi.mocked(api.post).mockResolvedValueOnce(mockResponse);

      await qrService.validarTicket('QR-ABC/123+XYZ', 'SCANNER-007');

      expect(api.post).toHaveBeenCalledWith('/validador-qr/validar', {
        codigoQR: 'QR-ABC/123+XYZ',
        dispositivoId: 'SCANNER-007',
      });
    });

    it('debe incluir timestamp en la respuesta', async () => {
      const mockTimestamp = 1734480000000;
      const mockResponse = {
        data: {
          estado: 'OK',
          mensaje: 'Entrada validada',
          codigoQR: 'QR111',
          timestamp: mockTimestamp,
        },
      };

      vi.mocked(api.post).mockResolvedValueOnce(mockResponse);

      const result = await qrService.validarTicket('QR111', 'SCANNER-008');

      expect(result.timestamp).toBe(mockTimestamp);
      expect(typeof result.timestamp).toBe('number');
    });
  });

  describe('consultarEntrada', () => {
    it('debe consultar una entrada válida sin cambiar su estado', async () => {
      const mockResponse = {
        data: {
          estado: 'OK',
          mensaje: 'Entrada encontrada',
          entradaId: 456,
          codigoQR: 'QR654321',
          estadoAnterior: 'VALIDA',
          estadoActual: 'VALIDA',
          timestamp: Date.now(),
        },
      };

      vi.mocked(api.get).mockResolvedValueOnce(mockResponse);

      const result = await qrService.consultarEntrada('QR654321');

      expect(api.get).toHaveBeenCalledWith('/validador-qr/consultar/QR654321');
      expect(result).toEqual(mockResponse.data);
      expect(result.estado).toBe('OK');
      expect(result.entradaId).toBe(456);
      expect(result.estadoAnterior).toBe(result.estadoActual); // No debe cambiar el estado
    });

    it('debe consultar entrada ya usada', async () => {
      const mockResponse = {
        data: {
          estado: 'OK',
          mensaje: 'Entrada ya utilizada',
          entradaId: 789,
          codigoQR: 'QR111222',
          estadoAnterior: 'USADA',
          estadoActual: 'USADA',
          timestamp: Date.now(),
        },
      };

      vi.mocked(api.get).mockResolvedValueOnce(mockResponse);

      const result = await qrService.consultarEntrada('QR111222');

      expect(result.estadoActual).toBe('USADA');
    });

    it('debe consultar entrada anulada', async () => {
      const mockResponse = {
        data: {
          estado: 'OK',
          mensaje: 'Entrada anulada',
          entradaId: 101,
          codigoQR: 'QR333444',
          estadoAnterior: 'ANULADA',
          estadoActual: 'ANULADA',
          timestamp: Date.now(),
        },
      };

      vi.mocked(api.get).mockResolvedValueOnce(mockResponse);

      const result = await qrService.consultarEntrada('QR333444');

      expect(result.estadoActual).toBe('ANULADA');
    });

    it('debe manejar entrada no encontrada en consulta', async () => {
      const mockResponse = {
        data: {
          estado: 'ERROR_NO_ENCONTRADO',
          mensaje: 'Entrada no encontrada',
          codigoQR: 'QR000000',
          timestamp: Date.now(),
        },
      };

      vi.mocked(api.get).mockResolvedValueOnce(mockResponse);

      const result = await qrService.consultarEntrada('QR000000');

      expect(result.estado).toBe('ERROR_NO_ENCONTRADO');
      expect(result.entradaId).toBeUndefined();
    });

    it('debe propagar errores de red en consultas', async () => {
      const networkError = new Error('Network Error');
      vi.mocked(api.get).mockRejectedValueOnce(networkError);

      await expect(qrService.consultarEntrada('QR777')).rejects.toThrow('Network Error');
    });

    it('debe codificar correctamente códigos QR con caracteres especiales en URL', async () => {
      const mockResponse = {
        data: {
          estado: 'OK',
          mensaje: 'Entrada encontrada',
          codigoQR: 'QR-TEST/123',
          timestamp: Date.now(),
        },
      };

      vi.mocked(api.get).mockResolvedValueOnce(mockResponse);

      await qrService.consultarEntrada('QR-TEST/123');

      expect(api.get).toHaveBeenCalledWith('/validador-qr/consultar/QR-TEST/123');
    });

    it('debe manejar errores 404 del backend', async () => {
      const notFoundError = {
        response: {
          status: 404,
          data: { mensaje: 'Endpoint no encontrado' },
        },
      };

      vi.mocked(api.get).mockRejectedValueOnce(notFoundError);

      await expect(qrService.consultarEntrada('QR888')).rejects.toMatchObject({
        response: { status: 404 },
      });
    });

    it('debe manejar respuestas sin campos opcionales', async () => {
      const mockResponse = {
        data: {
          estado: 'OK',
          mensaje: 'Consulta exitosa',
          codigoQR: 'QR555',
          timestamp: Date.now(),
          // Sin entradaId, estadoAnterior, estadoActual
        },
      };

      vi.mocked(api.get).mockResolvedValueOnce(mockResponse);

      const result = await qrService.consultarEntrada('QR555');

      expect(result.entradaId).toBeUndefined();
      expect(result.estadoAnterior).toBeUndefined();
      expect(result.estadoActual).toBeUndefined();
    });
  });

  describe('Casos edge', () => {
    it('debe manejar códigos QR vacíos en validación', async () => {
      const mockResponse = {
        data: {
          estado: 'ERROR_NO_ENCONTRADO',
          mensaje: 'Código QR inválido',
          codigoQR: '',
          timestamp: Date.now(),
        },
      };

      vi.mocked(api.post).mockResolvedValueOnce(mockResponse);

      const result = await qrService.validarTicket('', 'SCANNER-009');

      expect(result.estado).toBe('ERROR_NO_ENCONTRADO');
    });

    it('debe manejar dispositivos ID vacíos', async () => {
      const mockResponse = {
        data: {
          estado: 'OK',
          mensaje: 'Validación exitosa',
          codigoQR: 'QR222',
          timestamp: Date.now(),
        },
      };

      vi.mocked(api.post).mockResolvedValueOnce(mockResponse);

      await qrService.validarTicket('QR222', '');

      expect(api.post).toHaveBeenCalledWith('/validador-qr/validar', {
        codigoQR: 'QR222',
        dispositivoId: '',
      });
    });

    it('debe manejar errores con código de estado HTTP 400', async () => {
      const badRequestError = {
        response: {
          status: 400,
          data: { mensaje: 'Datos inválidos' },
        },
      };

      vi.mocked(api.post).mockRejectedValueOnce(badRequestError);

      await expect(qrService.validarTicket('INVALID', 'SCANNER-010')).rejects.toMatchObject({
        response: { status: 400 },
      });
    });

    it('debe manejar errores con código de estado HTTP 500', async () => {
      const serverError = {
        response: {
          status: 500,
          data: { mensaje: 'Error interno del servidor' },
        },
      };

      vi.mocked(api.get).mockRejectedValueOnce(serverError);

      await expect(qrService.consultarEntrada('QR666')).rejects.toMatchObject({
        response: { status: 500 },
      });
    });

    it('debe preservar todos los campos de la respuesta en validación', async () => {
      const completeResponse = {
        data: {
          estado: 'OK',
          mensaje: 'Validación completa',
          entradaId: 999,
          codigoQR: 'QR-FULL',
          estadoAnterior: 'VALIDA',
          estadoActual: 'USADA',
          timestamp: 1734480000000,
        },
      };

      vi.mocked(api.post).mockResolvedValueOnce(completeResponse);

      const result = await qrService.validarTicket('QR-FULL', 'SCANNER-011');

      expect(result).toHaveProperty('estado');
      expect(result).toHaveProperty('mensaje');
      expect(result).toHaveProperty('entradaId');
      expect(result).toHaveProperty('codigoQR');
      expect(result).toHaveProperty('estadoAnterior');
      expect(result).toHaveProperty('estadoActual');
      expect(result).toHaveProperty('timestamp');
    });

    it('debe preservar todos los campos de la respuesta en consulta', async () => {
      const completeResponse = {
        data: {
          estado: 'OK',
          mensaje: 'Consulta completa',
          entradaId: 888,
          codigoQR: 'QR-FULL-2',
          estadoAnterior: 'VALIDA',
          estadoActual: 'VALIDA',
          timestamp: 1734480000000,
        },
      };

      vi.mocked(api.get).mockResolvedValueOnce(completeResponse);

      const result = await qrService.consultarEntrada('QR-FULL-2');

      expect(Object.keys(result)).toHaveLength(7);
      expect(result.entradaId).toBe(888);
      expect(result.codigoQR).toBe('QR-FULL-2');
    });
  });
});
