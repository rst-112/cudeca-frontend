import { beforeEach, describe, expect, it, vi, afterEach, beforeAll } from 'vitest';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';

// ============================================================================
// MOCKS - Usamos vi.hoisted para evitar ReferenceError
// ============================================================================

const { mockAxiosInstance } = vi.hoisted(() => {
  const instance = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn(),
    defaults: {
      baseURL: 'http://localhost:8080/api',
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000,
    },
    interceptors: {
      request: {
        use: vi.fn(),
        eject: vi.fn(),
      },
      response: {
        use: vi.fn(),
        eject: vi.fn(),
      },
    },
  };
  return { mockAxiosInstance: instance };
});

// Mock de axios
vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => mockAxiosInstance),
    isAxiosError: vi.fn((error: unknown) => {
      return (
        typeof error === 'object' &&
        error !== null &&
        'isAxiosError' in error &&
        (error as { isAxiosError: boolean }).isAxiosError === true
      );
    }),
  },
}));

// ============================================================================
// IMPORTS
// ============================================================================

import {
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
  apiPatch,
  testBackendConnection,
  apiClient,
  isAxiosError,
} from './api';

// ============================================================================
// SETUP
// ============================================================================

describe('API Service', () => {
  let requestInterceptorSuccess: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig;
  let requestInterceptorError: (error: unknown) => Promise<never>;
  let responseInterceptorSuccess: (response: unknown) => unknown;
  let responseInterceptorError: (error: AxiosError) => Promise<never>;

  // Capturamos los interceptores UNA sola vez antes de todos los tests
  // Esto evita que vi.clearAllMocks() en beforeEach borre su registro
  beforeAll(() => {
    if (mockAxiosInstance.interceptors.request.use.mock.calls.length > 0) {
      const requestCall = mockAxiosInstance.interceptors.request.use.mock.calls[0];
      requestInterceptorSuccess = requestCall[0];
      requestInterceptorError = requestCall[1];
    }

    if (mockAxiosInstance.interceptors.response.use.mock.calls.length > 0) {
      const responseCall = mockAxiosInstance.interceptors.response.use.mock.calls[0];
      responseInterceptorSuccess = responseCall[0];
      responseInterceptorError = responseCall[1];
    }
  });

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    // Nota: Ya no intentamos capturar interceptores aquí porque clearAllMocks
    // habría borrado la información de registro.
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // --------------------------------------------------------------------------
  // CONFIGURACIÓN BÁSICA
  // --------------------------------------------------------------------------

  describe('Configuración Básica', () => {
    it('debe tener el apiClient configurado', () => {
      expect(apiClient).toBeDefined();
      expect(apiClient.defaults).toBeDefined();
      expect(apiClient.defaults.baseURL).toBeDefined();
    });

    it('debe tener interceptores configurados', () => {
      expect(apiClient.interceptors).toBeDefined();
      expect(apiClient.interceptors.request).toBeDefined();
      expect(apiClient.interceptors.response).toBeDefined();
    });

    it('debe tener el timeout configurado a 10 segundos', () => {
      expect(apiClient.defaults.timeout).toBe(10000);
    });

    it('debe tener el Content-Type configurado como application/json', () => {
      expect(apiClient.defaults.headers['Content-Type']).toBe('application/json');
    });
  });

  // --------------------------------------------------------------------------
  // INTERCEPTORES DE REQUEST
  // --------------------------------------------------------------------------

  describe('Interceptor de Request', () => {
    it('debe inyectar el token de Authorization cuando existe en localStorage', () => {
      localStorage.setItem('token', 'test_token_123');

      const config = {
        headers: {},
      } as InternalAxiosRequestConfig;

      const result = requestInterceptorSuccess(config);

      expect(result.headers.Authorization).toBe('Bearer test_token_123');
    });

    it('NO debe inyectar Authorization si no hay token en localStorage', () => {
      const config = {
        headers: {},
      } as InternalAxiosRequestConfig;

      const result = requestInterceptorSuccess(config);

      expect(result.headers.Authorization).toBeUndefined();
    });

    it('debe retornar el config modificado', () => {
      const config = {
        headers: {},
        url: '/test',
      } as InternalAxiosRequestConfig;

      const result = requestInterceptorSuccess(config);

      expect(result).toBe(config);
      expect(result.url).toBe('/test');
    });

    it('debe rechazar la promesa en caso de error', async () => {
      const error = new Error('Request interceptor error');

      await expect(requestInterceptorError(error)).rejects.toThrow('Request interceptor error');
    });

    it('debe mantener headers existentes al inyectar Authorization', () => {
      localStorage.setItem('token', 'test_token');

      const config = {
        headers: {
          'X-Custom-Header': 'custom-value',
          'Content-Type': 'application/json',
        },
      } as unknown as InternalAxiosRequestConfig;

      const result = requestInterceptorSuccess(config);

      expect(result.headers.Authorization).toBe('Bearer test_token');
      expect(result.headers['X-Custom-Header']).toBe('custom-value');
      expect(result.headers['Content-Type']).toBe('application/json');
    });
  });

  // --------------------------------------------------------------------------
  // INTERCEPTORES DE RESPONSE
  // --------------------------------------------------------------------------

  describe('Interceptor de Response', () => {
    it('debe retornar la response sin modificar en caso de éxito', () => {
      const response = { data: { message: 'success' }, status: 200 };

      const result = responseInterceptorSuccess(response);

      expect(result).toBe(response);
    });

    it('debe limpiar localStorage cuando el error es 401 Unauthorized', async () => {
      localStorage.setItem('token', 'expired_token');
      localStorage.setItem('auth_user', JSON.stringify({ id: 1, name: 'Test' }));

      const error401 = {
        response: { status: 401 },
        isAxiosError: true,
      } as AxiosError;

      await expect(responseInterceptorError(error401)).rejects.toEqual(error401);

      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('auth_user')).toBeNull();
    });

    it('NO debe limpiar localStorage para errores diferentes a 401', async () => {
      localStorage.setItem('token', 'valid_token');
      localStorage.setItem('auth_user', JSON.stringify({ id: 1 }));

      const error500 = {
        response: { status: 500 },
        isAxiosError: true,
      } as AxiosError;

      await expect(responseInterceptorError(error500)).rejects.toEqual(error500);

      expect(localStorage.getItem('token')).toBe('valid_token');
      expect(localStorage.getItem('auth_user')).not.toBeNull();
    });

    it('debe rechazar la promesa con el error original', async () => {
      const error = {
        response: { status: 500 },
        message: 'Internal Server Error',
      } as AxiosError;

      await expect(responseInterceptorError(error)).rejects.toEqual(error);
    });

    it('debe manejar error 401 sin limpiar si no hay response.status', async () => {
      localStorage.setItem('token', 'token');
      localStorage.setItem('auth_user', JSON.stringify({ id: 1 }));

      const errorWithoutStatus = {
        isAxiosError: true,
      } as AxiosError;

      await expect(responseInterceptorError(errorWithoutStatus)).rejects.toEqual(
        errorWithoutStatus,
      );

      expect(localStorage.getItem('token')).toBe('token');
    });

    it('debe manejar múltiples errores 401 consecutivos', async () => {
      localStorage.setItem('token', 'token1');
      localStorage.setItem('auth_user', JSON.stringify({ id: 1 }));

      const error401 = {
        response: { status: 401 },
        message: 'Unauthorized',
      } as AxiosError;

      await expect(responseInterceptorError(error401)).rejects.toEqual(error401);
      expect(localStorage.getItem('token')).toBeNull();

      await expect(responseInterceptorError(error401)).rejects.toEqual(error401);
      expect(localStorage.getItem('token')).toBeNull();
    });
  });

  // --------------------------------------------------------------------------
  // apiGet
  // --------------------------------------------------------------------------

  describe('apiGet', () => {
    it('debe retornar los datos en caso de éxito', async () => {
      const mockData = { id: 1, name: 'Test User' };
      mockAxiosInstance.get.mockResolvedValueOnce({ data: mockData });

      const result = await apiGet('/users/1');

      expect(result).toEqual(mockData);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/users/1', undefined);
    });

    it('debe pasar configuración adicional a axios', async () => {
      const mockData = { items: [] };
      const config = { params: { page: 1, limit: 10 } };
      mockAxiosInstance.get.mockResolvedValueOnce({ data: mockData });

      await apiGet('/items', config);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/items', config);
    });

    it('debe lanzar error con statusText cuando la respuesta tiene error', async () => {
      const error = {
        response: { statusText: 'Not Found' },
        message: 'Request failed',
      } as AxiosError;

      mockAxiosInstance.get.mockRejectedValueOnce(error);

      await expect(apiGet('/users/999')).rejects.toThrow('Error en GET /users/999: Not Found');
    });

    it('debe lanzar error con message cuando no hay response', async () => {
      const error = {
        message: 'Network Error',
      } as AxiosError;

      mockAxiosInstance.get.mockRejectedValueOnce(error);

      await expect(apiGet('/users')).rejects.toThrow('Error en GET /users: Network Error');
    });

    it('debe priorizar statusText sobre message en errores', async () => {
      const error = {
        response: { statusText: 'Bad Gateway' },
        message: 'Generic message',
      } as AxiosError;

      mockAxiosInstance.get.mockRejectedValueOnce(error);

      await expect(apiGet('/test')).rejects.toThrow('Error en GET /test: Bad Gateway');
    });
  });

  // --------------------------------------------------------------------------
  // apiPost
  // --------------------------------------------------------------------------

  describe('apiPost', () => {
    it('debe enviar el body y retornar los datos', async () => {
      const body = { name: 'New User', email: 'user@test.com' };
      const mockResponse = { id: 1, ...body };
      mockAxiosInstance.post.mockResolvedValueOnce({ data: mockResponse });

      const result = await apiPost('/users', body);

      expect(result).toEqual(mockResponse);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/users', body, undefined);
    });

    it('debe pasar configuración adicional', async () => {
      const body = { data: 'test' };
      const config = { headers: { 'X-Custom-Header': 'value' } };
      mockAxiosInstance.post.mockResolvedValueOnce({ data: { success: true } });

      await apiPost('/endpoint', body, config);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/endpoint', body, config);
    });

    it('debe lanzar error formateado con statusText', async () => {
      const error = {
        response: { statusText: 'Bad Request' },
        message: 'Request failed',
      } as AxiosError;

      mockAxiosInstance.post.mockRejectedValueOnce(error);

      await expect(apiPost('/users', {})).rejects.toThrow('Error en POST /users: Bad Request');
    });

    it('debe lanzar error formateado con message cuando no hay response', async () => {
      const error = {
        message: 'Network timeout',
      } as AxiosError;

      mockAxiosInstance.post.mockRejectedValueOnce(error);

      await expect(apiPost('/users', {})).rejects.toThrow('Error en POST /users: Network timeout');
    });

    it('debe manejar body null', async () => {
      mockAxiosInstance.post.mockResolvedValueOnce({ data: { created: true } });

      await apiPost('/endpoint', null);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/endpoint', null, undefined);
    });
  });

  // --------------------------------------------------------------------------
  // apiPut
  // --------------------------------------------------------------------------

  describe('apiPut', () => {
    it('debe actualizar el recurso y retornar los datos', async () => {
      const body = { name: 'Updated Name' };
      const mockResponse = { id: 1, name: 'Updated Name' };
      mockAxiosInstance.put.mockResolvedValueOnce({ data: mockResponse });

      const result = await apiPut('/users/1', body);

      expect(result).toEqual(mockResponse);
      expect(mockAxiosInstance.put).toHaveBeenCalledWith('/users/1', body, undefined);
    });

    it('debe pasar configuración adicional', async () => {
      const body = { status: 'active' };
      const config = { timeout: 5000 };
      mockAxiosInstance.put.mockResolvedValueOnce({ data: { updated: true } });

      await apiPut('/status', body, config);

      expect(mockAxiosInstance.put).toHaveBeenCalledWith('/status', body, config);
    });

    it('debe lanzar error con statusText', async () => {
      const error = {
        response: { statusText: 'Forbidden' },
        message: 'Request failed',
      } as AxiosError;

      mockAxiosInstance.put.mockRejectedValueOnce(error);

      await expect(apiPut('/users/1', {})).rejects.toThrow('Error en PUT /users/1: Forbidden');
    });

    it('debe lanzar error con message cuando no hay response', async () => {
      const error = {
        message: 'Connection refused',
      } as AxiosError;

      mockAxiosInstance.put.mockRejectedValueOnce(error);

      await expect(apiPut('/users/1', {})).rejects.toThrow(
        'Error en PUT /users/1: Connection refused',
      );
    });
  });

  // --------------------------------------------------------------------------
  // apiDelete
  // --------------------------------------------------------------------------

  describe('apiDelete', () => {
    it('debe eliminar el recurso y retornar confirmación', async () => {
      const mockResponse = { deleted: true };
      mockAxiosInstance.delete.mockResolvedValueOnce({ data: mockResponse });

      const result = await apiDelete('/users/1');

      expect(result).toEqual(mockResponse);
      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/users/1', undefined);
    });

    it('debe pasar configuración adicional', async () => {
      const config = { headers: { 'X-Confirm': 'true' } };
      mockAxiosInstance.delete.mockResolvedValueOnce({ data: { success: true } });

      await apiDelete('/items/5', config);

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/items/5', config);
    });

    it('debe lanzar error con statusText', async () => {
      const error = {
        response: { statusText: 'Not Found' },
        message: 'Request failed',
      } as AxiosError;

      mockAxiosInstance.delete.mockRejectedValueOnce(error);

      await expect(apiDelete('/users/999')).rejects.toThrow(
        'Error en DELETE /users/999: Not Found',
      );
    });

    it('debe lanzar error con message cuando no hay response', async () => {
      const error = {
        message: 'Server error',
      } as AxiosError;

      mockAxiosInstance.delete.mockRejectedValueOnce(error);

      await expect(apiDelete('/users/1')).rejects.toThrow('Error en DELETE /users/1: Server error');
    });
  });

  // --------------------------------------------------------------------------
  // apiPatch
  // --------------------------------------------------------------------------

  describe('apiPatch', () => {
    it('debe actualizar parcialmente el recurso', async () => {
      const body = { email: 'newemail@test.com' };
      const mockResponse = { id: 1, email: 'newemail@test.com' };
      mockAxiosInstance.patch.mockResolvedValueOnce({ data: mockResponse });

      const result = await apiPatch('/users/1', body);

      expect(result).toEqual(mockResponse);
      expect(mockAxiosInstance.patch).toHaveBeenCalledWith('/users/1', body, undefined);
    });

    it('debe pasar configuración adicional', async () => {
      const body = { active: false };
      const config = { params: { notify: true } };
      mockAxiosInstance.patch.mockResolvedValueOnce({ data: { patched: true } });

      await apiPatch('/users/1', body, config);

      expect(mockAxiosInstance.patch).toHaveBeenCalledWith('/users/1', body, config);
    });

    it('debe lanzar error con statusText', async () => {
      const error = {
        response: { statusText: 'Conflict' },
        message: 'Request failed',
      } as AxiosError;

      mockAxiosInstance.patch.mockRejectedValueOnce(error);

      await expect(apiPatch('/users/1', {})).rejects.toThrow('Error en PATCH /users/1: Conflict');
    });

    it('debe lanzar error con message cuando no hay response', async () => {
      const error = {
        message: 'Timeout',
      } as AxiosError;

      mockAxiosInstance.patch.mockRejectedValueOnce(error);

      await expect(apiPatch('/users/1', {})).rejects.toThrow('Error en PATCH /users/1: Timeout');
    });
  });

  // --------------------------------------------------------------------------
  // testBackendConnection
  // --------------------------------------------------------------------------

  describe('testBackendConnection', () => {
    it('debe retornar el estado del backend en caso de éxito', async () => {
      const mockHealth = {
        message: 'Backend operativo',
        status: 'ok' as const,
        timestamp: '2024-01-01T00:00:00.000Z',
      };

      mockAxiosInstance.get.mockResolvedValueOnce({ data: mockHealth });

      const result = await testBackendConnection();

      expect(result).toEqual(mockHealth);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/public/test', undefined);
    });

    it('debe retornar mensaje de error si falla la conexión', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const error = new Error('Connection failed');

      mockAxiosInstance.get.mockRejectedValueOnce(error);

      const result = await testBackendConnection();

      expect(result.message).toBe('Backend no disponible');
      expect(result.status).toBe('error');
      expect(result.timestamp).toBeDefined();

      // Corregido: apiGet envuelve el error, así que esperamos el error envuelto
      const expectedError = new Error('Error en GET /public/test: Connection failed');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error conectando al backend:', expectedError);

      consoleErrorSpy.mockRestore();
    });

    it('debe incluir timestamp válido en respuesta de error', async () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
      mockAxiosInstance.get.mockRejectedValueOnce(new Error('Network error'));

      const beforeCall = Date.now();
      const result = await testBackendConnection();
      const afterCall = Date.now();

      expect(result.timestamp).toBeDefined();
      const resultTime = new Date(result.timestamp!).getTime();
      expect(resultTime).toBeGreaterThanOrEqual(beforeCall);
      expect(resultTime).toBeLessThanOrEqual(afterCall);
    });

    it('debe manejar error de tipo AxiosError', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const axiosError = {
        response: { status: 500, statusText: 'Internal Server Error' },
        message: 'Server error',
        isAxiosError: true,
      } as AxiosError;

      mockAxiosInstance.get.mockRejectedValueOnce(axiosError);

      const result = await testBackendConnection();

      expect(result.status).toBe('error');
      expect(result.message).toBe('Backend no disponible');

      // Corregido: apiGet usa statusText si existe
      const expectedError = new Error('Error en GET /public/test: Internal Server Error');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error conectando al backend:', expectedError);

      consoleErrorSpy.mockRestore();
    });
  });

  // --------------------------------------------------------------------------
  // isAxiosError
  // --------------------------------------------------------------------------

  describe('isAxiosError', () => {
    it('debe identificar correctamente un error de Axios', () => {
      const axiosError = {
        isAxiosError: true,
        response: { status: 404 },
        message: 'Not found',
      };

      expect(isAxiosError(axiosError)).toBe(true);
    });

    it('debe retornar false para Error normal', () => {
      const normalError = new Error('Normal error');

      expect(isAxiosError(normalError)).toBe(false);
    });

    it('debe retornar false para objeto sin isAxiosError', () => {
      const obj = { message: 'Some error', status: 500 };

      expect(isAxiosError(obj)).toBe(false);
    });

    it('debe retornar false para null', () => {
      expect(isAxiosError(null)).toBe(false);
    });

    it('debe retornar false para undefined', () => {
      expect(isAxiosError(undefined)).toBe(false);
    });

    it('debe retornar false para string', () => {
      expect(isAxiosError('error string')).toBe(false);
    });

    it('debe retornar false para número', () => {
      expect(isAxiosError(404)).toBe(false);
    });

    it('debe retornar false para objeto con isAxiosError = false', () => {
      const obj = { isAxiosError: false, message: 'Error' };

      expect(isAxiosError(obj)).toBe(false);
    });

    it('debe retornar false para array', () => {
      expect(isAxiosError([1, 2, 3])).toBe(false);
    });

    it('debe retornar false para función', () => {
      expect(isAxiosError(() => {})).toBe(false);
    });
  });

  // --------------------------------------------------------------------------
  // INTEGRACIÓN
  // --------------------------------------------------------------------------

  describe('Integración - Flujo completo', () => {
    it('debe usar el token en peticiones autenticadas', async () => {
      localStorage.setItem('token', 'integration_token_xyz');

      const config = {
        headers: {},
      } as InternalAxiosRequestConfig;

      const enrichedConfig = requestInterceptorSuccess(config);

      expect(enrichedConfig.headers.Authorization).toBe('Bearer integration_token_xyz');
    });

    it('debe limpiar sesión en error 401 y lanzar el error', async () => {
      localStorage.setItem('token', 'expired');
      localStorage.setItem('auth_user', JSON.stringify({ id: 1 }));

      const error401 = {
        response: { status: 401 },
        message: 'Unauthorized',
        isAxiosError: true,
      } as AxiosError;

      await expect(responseInterceptorError(error401)).rejects.toEqual(error401);
      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('auth_user')).toBeNull();
    });

    it('debe manejar petición completa con todos los elementos', async () => {
      localStorage.setItem('token', 'valid_token');

      const mockData = { success: true, data: { id: 1 } };
      mockAxiosInstance.post.mockResolvedValueOnce({ data: mockData });

      const result = await apiPost('/auth/verify', { token: 'test' });

      expect(result).toEqual(mockData);
    });

    it('debe manejar flujo completo: request interceptor -> petición -> response interceptor', async () => {
      localStorage.setItem('token', 'test_token');

      const config = {
        headers: {},
        url: '/users',
      } as InternalAxiosRequestConfig;

      const enrichedConfig = requestInterceptorSuccess(config);
      expect(enrichedConfig.headers.Authorization).toBe('Bearer test_token');

      const mockData = { users: [] };
      mockAxiosInstance.get.mockResolvedValueOnce({ data: mockData });
      const result = await apiGet('/users');

      const response = { data: mockData, status: 200 };
      const processedResponse = responseInterceptorSuccess(response);
      expect(processedResponse).toBe(response);

      expect(result).toEqual(mockData);
    });
  });

  // --------------------------------------------------------------------------
  // EDGE CASES
  // --------------------------------------------------------------------------

  describe('Edge Cases', () => {
    it('debe manejar response.data undefined', async () => {
      mockAxiosInstance.get.mockResolvedValueOnce({ data: undefined });

      const result = await apiGet('/test');

      expect(result).toBeUndefined();
    });

    it('debe manejar response.data null', async () => {
      mockAxiosInstance.get.mockResolvedValueOnce({ data: null });

      const result = await apiGet('/test');

      expect(result).toBeNull();
    });

    it('debe manejar error sin response ni message', async () => {
      const error = {} as AxiosError;
      mockAxiosInstance.get.mockRejectedValueOnce(error);

      await expect(apiGet('/test')).rejects.toThrow('Error en GET /test: undefined');
    });

    it('debe manejar path vacío', async () => {
      mockAxiosInstance.get.mockResolvedValueOnce({ data: { ok: true } });

      await apiGet('');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('', undefined);
    });

    it('debe manejar body complejo en POST', async () => {
      const complexBody = {
        nested: { deep: { value: 123 } },
        array: [1, 2, 3],
        date: new Date().toISOString(),
      };

      mockAxiosInstance.post.mockResolvedValueOnce({ data: { received: true } });

      await apiPost('/complex', complexBody);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/complex', complexBody, undefined);
    });

    it('debe manejar response con data vacío (string)', async () => {
      mockAxiosInstance.get.mockResolvedValueOnce({ data: '' });

      const result = await apiGet<string>('/test');

      expect(result).toBe('');
    });

    it('debe manejar response con data vacío (array)', async () => {
      mockAxiosInstance.get.mockResolvedValueOnce({ data: [] });

      const result = await apiGet<unknown[]>('/test');

      expect(result).toEqual([]);
    });

    it('debe manejar response con data vacío (objeto)', async () => {
      mockAxiosInstance.get.mockResolvedValueOnce({ data: {} });

      const result = await apiGet<Record<string, unknown>>('/test');

      expect(result).toEqual({});
    });

    it('debe manejar token vacío en localStorage', () => {
      localStorage.setItem('token', '');

      const config = {
        headers: {},
      } as InternalAxiosRequestConfig;

      const result = requestInterceptorSuccess(config);

      expect(result.headers.Authorization).toBeUndefined();
    });

    it('debe manejar error con response pero sin statusText', async () => {
      const error = {
        response: { status: 500 },
        message: 'Fallback message',
      } as AxiosError;

      mockAxiosInstance.get.mockRejectedValueOnce(error);

      await expect(apiGet('/test')).rejects.toThrow('Error en GET /test: Fallback message');
    });

    it('debe manejar múltiples configuraciones simultáneas', async () => {
      const config1 = { params: { page: 1 } };
      const config2 = { headers: { 'X-Custom': 'value' } };

      mockAxiosInstance.get.mockResolvedValueOnce({ data: { result: 1 } });
      mockAxiosInstance.get.mockResolvedValueOnce({ data: { result: 2 } });

      await apiGet('/test1', config1);
      await apiGet('/test2', config2);

      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(2);
      expect(mockAxiosInstance.get).toHaveBeenNthCalledWith(1, '/test1', config1);
      expect(mockAxiosInstance.get).toHaveBeenNthCalledWith(2, '/test2', config2);
    });
  });
});
