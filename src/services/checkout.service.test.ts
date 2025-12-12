import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as checkoutService from './checkout.service';
import * as api from './api';

// Mock de api
vi.mock('./api', () => ({
  apiGet: vi.fn(),
  apiPost: vi.fn(),
  apiPut: vi.fn(),
  apiDelete: vi.fn(),
}));

describe('checkout.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('procesarCheckout', () => {
    it('procesa un checkout correctamente', async () => {
      const mockResponse = {
        compraId: 1,
        urlPago: 'https://payment.com',
        importeTotal: 50,
        mensaje: 'Success',
      };

      vi.mocked(api.apiPost).mockResolvedValue(mockResponse);

      const request = {
        usuarioId: 1,
        items: [{ asientoId: 1, precio: 25 }],
        solicitarCertificado: false,
      };

      const result = await checkoutService.procesarCheckout(request);

      expect(api.apiPost).toHaveBeenCalledWith('/checkout', request);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('confirmarPago', () => {
    it('confirma un pago correctamente', async () => {
      const mockResponse = {
        success: true,
        mensaje: 'Payment confirmed',
      };

      vi.mocked(api.apiPost).mockResolvedValue(mockResponse);

      const compraId = 1;
      const request = {
        transaccionId: 'TXN123',
        estado: 'COMPLETADO' as const,
      };

      const result = await checkoutService.confirmarPago(compraId, request);

      expect(api.apiPost).toHaveBeenCalledWith(`/checkout/${compraId}/confirmar`, request);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('obtenerDatosFiscalesUsuario', () => {
    it('obtiene datos fiscales del usuario', async () => {
      const mockData = [
        {
          id: 1,
          nif: '12345678A',
          nombre: 'Test User',
          direccion: 'Test Address',
          ciudad: 'Madrid',
          codigoPostal: '28001',
          pais: 'España',
          esPrincipal: true,
        },
      ];

      vi.mocked(api.apiGet).mockResolvedValue(mockData);

      const result = await checkoutService.obtenerDatosFiscalesUsuario(1);

      expect(api.apiGet).toHaveBeenCalledWith('/datos-fiscales/usuario/1');
      expect(result).toEqual(mockData);
    });
  });

  describe('crearDatosFiscales', () => {
    it('crea nuevos datos fiscales', async () => {
      const mockData = { id: 1, message: 'Created' };

      vi.mocked(api.apiPost).mockResolvedValue(mockData);

      const datosFiscales = {
        nif: '12345678A',
        nombre: 'Test User',
        direccion: 'Test Address',
        ciudad: 'Madrid',
        codigoPostal: '28001',
        pais: 'España',
      };

      const result = await checkoutService.crearDatosFiscales(1, datosFiscales);

      expect(api.apiPost).toHaveBeenCalledWith('/datos-fiscales/usuario/1', datosFiscales);
      expect(result).toEqual(mockData);
    });
  });

  describe('actualizarDatosFiscales', () => {
    it('actualiza datos fiscales existentes', async () => {
      const mockData = { id: 1, message: 'Updated' };

      vi.mocked(api.apiPut).mockResolvedValue(mockData);

      const datosFiscales = {
        nombre: 'Updated Name',
      };

      const result = await checkoutService.actualizarDatosFiscales(1, 1, datosFiscales);

      expect(api.apiPut).toHaveBeenCalledWith('/datos-fiscales/1?usuarioId=1', datosFiscales);
      expect(result).toEqual(mockData);
    });
  });

  describe('eliminarDatosFiscales', () => {
    it('elimina datos fiscales', async () => {
      vi.mocked(api.apiDelete).mockResolvedValue(undefined);

      await checkoutService.eliminarDatosFiscales(1, 1);

      expect(api.apiDelete).toHaveBeenCalledWith('/datos-fiscales/1?usuarioId=1');
    });
  });

  describe('obtenerDetallesCompra', () => {
    it('obtiene detalles de una compra', async () => {
      const mockDetalles = {
        compraId: 1,
        usuarioId: 1,
        importeTotal: 50,
        estadoCompra: 'COMPLETADO' as const,
        fechaCompra: '2024-12-12',
        items: [],
      };

      vi.mocked(api.apiGet).mockResolvedValue(mockDetalles);

      const result = await checkoutService.obtenerDetallesCompra(1);

      expect(api.apiGet).toHaveBeenCalledWith('/checkout/1');
      expect(result).toEqual(mockDetalles);
    });
  });

  describe('cancelarCompra', () => {
    it('cancela una compra', async () => {
      const mockResponse = {
        success: true,
        message: 'Compra cancelada',
        compraId: 1,
      };

      vi.mocked(api.apiPost).mockResolvedValue(mockResponse);

      const request = {
        motivo: 'Cliente canceló',
      };

      const result = await checkoutService.cancelarCompra(1, request);

      expect(api.apiPost).toHaveBeenCalledWith('/checkout/1/cancelar', request);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('obtenerDatosFiscalesPorId', () => {
    it('obtiene datos fiscales por ID', async () => {
      const mockDatos = {
        id: 1,
        nif: '12345678A',
        nombre: 'Test User',
        direccion: 'Test Address',
        ciudad: 'Madrid',
        codigoPostal: '28001',
        pais: 'España',
        esPrincipal: true,
      };

      vi.mocked(api.apiGet).mockResolvedValue(mockDatos);

      const result = await checkoutService.obtenerDatosFiscalesPorId(1, 1);

      expect(api.apiGet).toHaveBeenCalledWith('/datos-fiscales/1?usuarioId=1');
      expect(result).toEqual(mockDatos);
    });
  });

  describe('validarNif', () => {
    it('valida un NIF correctamente', async () => {
      const mockResponse = {
        valido: true,
        mensaje: 'NIF válido',
      };

      vi.mocked(api.apiPost).mockResolvedValue(mockResponse);

      const result = await checkoutService.validarNif('12345678A');

      expect(api.apiPost).toHaveBeenCalledWith('/datos-fiscales/validar-nif', { nif: '12345678A' });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('calcularTotalCheckout', () => {
    it('calcula el total sin donación extra', () => {
      const items = [
        { asientoId: 1, precio: 25 },
        { asientoId: 2, precio: 30 },
      ];

      const total = checkoutService.calcularTotalCheckout(items);

      expect(total).toBe(55);
    });

    it('calcula el total con donación extra', () => {
      const items = [
        { asientoId: 1, precio: 25 },
        { asientoId: 2, precio: 30 },
      ];

      const total = checkoutService.calcularTotalCheckout(items, 10);

      expect(total).toBe(65);
    });

    it('calcula el total con array vacío', () => {
      const items: any[] = [];

      const total = checkoutService.calcularTotalCheckout(items);

      expect(total).toBe(0);
    });
  });

  describe('formatearPrecio', () => {
    it('formatea un precio correctamente', () => {
      const precio = checkoutService.formatearPrecio(25.5);

      expect(precio).toContain('25');
      expect(precio).toContain('€');
    });

    it('formatea precio con decimales', () => {
      const precio = checkoutService.formatearPrecio(100.99);

      expect(precio).toContain('100');
      expect(precio).toContain('€');
    });
  });

  describe('obtenerEstadoCompra', () => {
    it('retorna estado correcto para PENDIENTE', () => {
      const estado = checkoutService.obtenerEstadoCompra('PENDIENTE');

      expect(estado.label).toBe('Pendiente');
      expect(estado.color).toBe('yellow');
    });

    it('retorna estado correcto para COMPLETADO', () => {
      const estado = checkoutService.obtenerEstadoCompra('COMPLETADO');

      expect(estado.label).toBe('Completado');
      expect(estado.color).toBe('green');
    });

    it('retorna estado correcto para CANCELADO', () => {
      const estado = checkoutService.obtenerEstadoCompra('CANCELADO');

      expect(estado.label).toBe('Cancelado');
      expect(estado.color).toBe('red');
    });

    it('retorna estado correcto para FALLIDO', () => {
      const estado = checkoutService.obtenerEstadoCompra('FALLIDO');

      expect(estado.label).toBe('Fallido');
      expect(estado.color).toBe('red');
    });

    it('retorna estado desconocido para valores no válidos', () => {
      const estado = checkoutService.obtenerEstadoCompra('INVALID' as any);

      expect(estado.label).toBe('Desconocido');
      expect(estado.color).toBe('gray');
    });
  });

  describe('validarFormatoNif', () => {
    it('valida un NIF con formato correcto', () => {
      const valido = checkoutService.validarFormatoNif('12345678A');

      expect(valido).toBe(true);
    });

    it('valida un NIF con minúsculas', () => {
      const valido = checkoutService.validarFormatoNif('12345678a');

      expect(valido).toBe(true);
    });

    it('rechaza un NIF sin letra', () => {
      const valido = checkoutService.validarFormatoNif('12345678');

      expect(valido).toBe(false);
    });

    it('rechaza un NIF con menos dígitos', () => {
      const valido = checkoutService.validarFormatoNif('1234567A');

      expect(valido).toBe(false);
    });

    it('rechaza un NIF con más dígitos', () => {
      const valido = checkoutService.validarFormatoNif('123456789A');

      expect(valido).toBe(false);
    });

    it('rechaza un NIF con letras en los dígitos', () => {
      const valido = checkoutService.validarFormatoNif('1234567BA');

      expect(valido).toBe(false);
    });

    it('rechaza un NIF vacío', () => {
      const valido = checkoutService.validarFormatoNif('');

      expect(valido).toBe(false);
    });
  });
});
