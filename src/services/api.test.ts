import { beforeEach, describe, expect, it, vi, type Mocked, beforeAll } from 'vitest';
import type { InternalAxiosRequestConfig } from 'axios';
import { apiGet, apiPost, testBackendConnection, apiClient } from './api';

// ----------------------------------------------------------------------
// 1. CONFIGURACIÓN DEL MOCK DE AXIOS (CON vi.hoisted)
// ----------------------------------------------------------------------
const { requestUseMock, requestEjectMock } = vi.hoisted(() => {
  return {
    requestUseMock: vi.fn(),
    requestEjectMock: vi.fn(),
  };
});

vi.mock('axios', () => {
  const defaultMock = {
    get: vi.fn(),
    post: vi.fn(),
    interceptors: {
      request: {
        use: requestUseMock,
        eject: requestEjectMock,
      },
      response: {
        use: vi.fn(),
        eject: vi.fn(),
      },
    },
    defaults: { headers: { common: {} } },
  };
  return {
    default: {
      create: vi.fn(() => defaultMock),
      ...defaultMock,
    },
    AxiosError: class {},
  };
});

// Definimos los tipos de las funciones del interceptor para evitar 'any'
type OnFulfilled = (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig;
type OnRejected = (error: unknown) => Promise<unknown>;

// ----------------------------------------------------------------------
// 2. SUITE DE TESTS
// ----------------------------------------------------------------------
describe('API Service', () => {
  const mockedApiClient = apiClient as Mocked<typeof apiClient>;

  // Variables tipadas correctamente (¡Adiós any!)
  let interceptorSuccessHandler: OnFulfilled;
  let interceptorErrorHandler: OnRejected;

  beforeAll(() => {
    // Capturamos los handlers. Hacemos casting (as ...) porque mock.calls devuelve 'unknown'
    // pero nosotros sabemos qué estructura tienen.
    if (requestUseMock.mock.calls.length > 0) {
      interceptorSuccessHandler = requestUseMock.mock.calls[0][0] as OnFulfilled;
      interceptorErrorHandler = requestUseMock.mock.calls[0][1] as OnRejected;
    }
  });

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  // --- TEST DE INTERCEPTORES (Seguridad / Token) ---
  describe('Interceptors', () => {
    it('debe inyectar el header Authorization si existe token en localStorage', () => {
      localStorage.setItem('auth_token', 'TOKEN_DE_PRUEBA_123');
      const config = { headers: {} } as InternalAxiosRequestConfig;

      // Al estar tipado, TS sabe que esto devuelve una config
      const resultConfig = interceptorSuccessHandler(config);

      expect(resultConfig.headers.Authorization).toBe('Bearer TOKEN_DE_PRUEBA_123');
    });

    it('NO debe inyectar el header Authorization si no hay token', () => {
      localStorage.removeItem('auth_token');
      const config = { headers: {} } as InternalAxiosRequestConfig;

      const resultConfig = interceptorSuccessHandler(config);

      expect(resultConfig.headers.Authorization).toBeUndefined();
    });

    it('debe manejar errores en el interceptor', async () => {
      const error = new Error('Error en interceptor');

      await expect(interceptorErrorHandler(error)).rejects.toThrow('Error en interceptor');
    });
  });

  // --- TEST DE GET ---
  describe('apiGet', () => {
    it('devuelve los datos cuando la respuesta es correcta (OK)', async () => {
      const mockResponse = { data: { message: 'ok' } };
      mockedApiClient.get.mockResolvedValueOnce(mockResponse);

      const result = await apiGet('/test');
      expect(mockedApiClient.get).toHaveBeenCalledWith('/test');
      expect(result).toEqual(mockResponse.data);
    });

    it('lanza error usando statusText si la petición falla con respuesta', async () => {
      const errorMock = {
        response: { statusText: 'Bad Request' },
        message: 'Error genérico',
      };
      mockedApiClient.get.mockRejectedValueOnce(errorMock);

      await expect(apiGet('/error')).rejects.toThrow('Error en GET /error: Bad Request');
    });

    it('lanza error usando message si falla la red', async () => {
      const errorMock = { message: 'Network Error' };
      mockedApiClient.get.mockRejectedValueOnce(errorMock);

      await expect(apiGet('/fail')).rejects.toThrow('Error en GET /fail: Network Error');
    });
  });

  // --- TEST DE POST ---
  describe('apiPost', () => {
    it('devuelve datos cuando el POST es correcto', async () => {
      const mockResponse = { data: { success: true } };
      mockedApiClient.post.mockResolvedValueOnce(mockResponse);

      const result = await apiPost('/submit', { name: 'Raul' });
      expect(mockedApiClient.post).toHaveBeenCalledWith('/submit', { name: 'Raul' });
      expect(result).toEqual(mockResponse.data);
    });

    it('lanza error usando statusText cuando hay respuesta', async () => {
      const errorMock = {
        response: { statusText: 'Internal Server Error' },
        message: 'Ignorado',
      };
      mockedApiClient.post.mockRejectedValueOnce(errorMock);

      await expect(apiPost('/fail', {})).rejects.toThrow(
        'Error en POST /fail: Internal Server Error',
      );
    });

    it('lanza error usando message cuando no hay respuesta (Fallo de Red)', async () => {
      const errorMock = { message: 'Network Down' };
      mockedApiClient.post.mockRejectedValueOnce(errorMock);

      await expect(apiPost('/network', {})).rejects.toThrow('Error en POST /network: Network Down');
    });
  });

  // --- TEST DE CONEXIÓN ---
  describe('testBackendConnection', () => {
    it('llama a apiGet("/public/test") correctamente', async () => {
      const mockResponse = { data: { message: 'Backend operativo' } };
      mockedApiClient.get.mockResolvedValueOnce(mockResponse);

      const result = await testBackendConnection();
      expect(result).toEqual(mockResponse.data);
    });

    it('devuelve mensaje de fallback si falla', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockedApiClient.get.mockRejectedValueOnce({ message: 'Error fatal' });

      const result = await testBackendConnection();
      expect(result).toEqual({ message: 'Backend no disponible' });
      consoleSpy.mockRestore();
    });
  });
});
