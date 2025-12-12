import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as perfilService from './perfil.service';
import * as api from './api';

// Mock de api
vi.mock('./api', () => ({
  apiGet: vi.fn(),
  apiPost: vi.fn(),
  apiPut: vi.fn(),
  apiDelete: vi.fn(),
}));

// Mock de fetch global
globalThis.fetch = vi.fn() as typeof fetch;

describe('perfil.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('obtenerPerfilPorId', () => {
    it('obtiene el perfil de un usuario por ID', async () => {
      const mockPerfil = {
        id: 1,
        email: 'test@test.com',
        nombre: 'Test User',
        direccion: 'Test Address',
        fechaRegistro: '2024-01-01',
        rol: 'USER',
      };

      vi.mocked(api.apiGet).mockResolvedValue(mockPerfil);

      const result = await perfilService.obtenerPerfilPorId(1);

      expect(api.apiGet).toHaveBeenCalledWith('/perfil/1');
      expect(result).toEqual(mockPerfil);
    });
  });

  describe('obtenerPerfilPorEmail', () => {
    it('obtiene el perfil de un usuario por email', async () => {
      const mockPerfil = {
        id: 1,
        email: 'test@test.com',
        nombre: 'Test User',
        direccion: 'Test Address',
        fechaRegistro: '2024-01-01',
        rol: 'USER',
      };

      vi.mocked(api.apiGet).mockResolvedValue(mockPerfil);

      const result = await perfilService.obtenerPerfilPorEmail('test@test.com');

      expect(api.apiGet).toHaveBeenCalledWith('/perfil/email/test@test.com');
      expect(result).toEqual(mockPerfil);
    });
  });

  describe('actualizarPerfil', () => {
    it('actualiza el perfil de un usuario', async () => {
      const mockPerfil = {
        id: 1,
        email: 'test@test.com',
        nombre: 'Updated Name',
        direccion: 'New Address',
        fechaRegistro: '2024-01-01',
        rol: 'USER',
      };

      vi.mocked(api.apiPut).mockResolvedValue(mockPerfil);

      const datos = {
        nombre: 'Updated Name',
        direccion: 'New Address',
      };

      const result = await perfilService.actualizarPerfil(1, datos);

      expect(api.apiPut).toHaveBeenCalledWith('/perfil/1', datos);
      expect(result).toEqual(mockPerfil);
    });
  });

  describe('verificarUsuarioExiste', () => {
    it('verifica que un usuario existe', async () => {
      const mockResponse = { existe: true };

      vi.mocked(api.apiGet).mockResolvedValue(mockResponse);

      const result = await perfilService.verificarUsuarioExiste(1);

      expect(api.apiGet).toHaveBeenCalledWith('/perfil/1/existe');
      expect(result).toEqual(mockResponse);
    });

    it('verifica que un usuario no existe', async () => {
      const mockResponse = { existe: false };

      vi.mocked(api.apiGet).mockResolvedValue(mockResponse);

      const result = await perfilService.verificarUsuarioExiste(999);

      expect(api.apiGet).toHaveBeenCalledWith('/perfil/999/existe');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('obtenerEntradasUsuario', () => {
    it('obtiene entradas del usuario', async () => {
      const mockEntradas = [
        {
          id: 1,
          eventoId: 1,
          eventoNombre: 'Evento Test',
          eventoFecha: '2024-12-15',
          asientoEtiqueta: 'A-1',
          precio: 25,
          estado: 'VALIDA' as const,
        },
      ];

      vi.mocked(api.apiGet).mockResolvedValue(mockEntradas);

      const result = await perfilService.obtenerEntradasUsuario(1);

      expect(api.apiGet).toHaveBeenCalledWith('/perfil/1/entradas');
      expect(result).toEqual(mockEntradas);
    });
  });

  describe('descargarPdfEntrada', () => {
    it('descarga el PDF de una entrada', async () => {
      const mockBlob = new Blob(['test'], { type: 'application/pdf' });

      vi.mocked(globalThis.fetch).mockResolvedValue({
        ok: true,
        blob: () => Promise.resolve(mockBlob),
      } as Response);

      const result = await perfilService.descargarPdfEntrada(1, 1);

      expect(globalThis.fetch).toHaveBeenCalled();
      expect(result).toEqual(mockBlob);
    });

    it('lanza error cuando falla la descarga del PDF', async () => {
      vi.mocked(globalThis.fetch).mockResolvedValue({
        ok: false,
      } as Response);

      await expect(perfilService.descargarPdfEntrada(1, 1)).rejects.toThrow('Error al descargar PDF');
    });
  });

  describe('generarUrlDescargaPdf', () => {
    it('genera URL de descarga correctamente', () => {
      const url = perfilService.generarUrlDescargaPdf(1, 1);

      expect(url).toContain('/perfil/1/entradas/1/pdf');
    });
  });

  describe('obtenerMonedero', () => {
    it('obtiene el monedero del usuario', async () => {
      const mockMonedero = {
        id: 1,
        usuarioId: 1,
        saldo: 100,
        moneda: 'EUR',
      };

      vi.mocked(api.apiGet).mockResolvedValue(mockMonedero);

      const result = await perfilService.obtenerMonedero(1);

      expect(api.apiGet).toHaveBeenCalledWith('/perfil/1/monedero');
      expect(result).toEqual(mockMonedero);
    });
  });

  describe('obtenerMovimientosMonedero', () => {
    it('obtiene los movimientos del monedero', async () => {
      const mockMovimientos = [
        {
          id: 1,
          tipo: 'RECARGA' as const,
          importe: 50,
          fecha: '2024-12-12',
          descripcion: 'Recarga',
        },
      ];

      vi.mocked(api.apiGet).mockResolvedValue(mockMovimientos);

      const result = await perfilService.obtenerMovimientosMonedero(1);

      expect(api.apiGet).toHaveBeenCalledWith('/perfil/1/monedero/movimientos');
      expect(result).toEqual(mockMovimientos);
    });
  });

  describe('formatearSaldo', () => {
    it('formatea el saldo correctamente', () => {
      const monedero = {
        id: 1,
        usuarioId: 1,
        saldo: 100.50,
        moneda: 'EUR',
        fechaCreacion: '2024-01-01',
        fechaActualizacion: '2024-01-01',
      };

      const resultado = perfilService.formatearSaldo(monedero);

      expect(resultado).toContain('100');
      expect(resultado).toContain('€');
    });
  });

  describe('obtenerEstadoEntrada', () => {
    it('retorna estado correcto para VALIDA', () => {
      const estado = perfilService.obtenerEstadoEntrada('VALIDA');

      expect(estado.label).toBe('Válida');
      expect(estado.color).toBe('green');
    });

    it('retorna estado correcto para USADA', () => {
      const estado = perfilService.obtenerEstadoEntrada('USADA');

      expect(estado.label).toBe('Usada');
      expect(estado.color).toBe('gray');
    });

    it('retorna estado correcto para CANCELADA', () => {
      const estado = perfilService.obtenerEstadoEntrada('CANCELADA');

      expect(estado.label).toBe('Cancelada');
      expect(estado.color).toBe('red');
    });

    it('retorna estado desconocido para valores no válidos', () => {
      const estado = perfilService.obtenerEstadoEntrada('INVALID' as 'VALIDA');

      expect(estado.label).toBe('Desconocido');
      expect(estado.color).toBe('gray');
    });
  });
});

