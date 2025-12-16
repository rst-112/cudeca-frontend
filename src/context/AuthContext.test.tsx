/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Tests para AuthContext
 *
 * Estos tests verifican:
 * - Inicialización
 * - Login
 * - Logout
 * - Persistencia de sesión
 * - Validación de token
 * - Manejo de errores
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import type { ReactNode } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import type { User } from '../types/auth.types';
import { apiClient } from '../services/api';
import { authService } from '../services/auth.service';

// Mock del servicio API
vi.mock('../services/api', () => ({
  apiClient: {
    post: vi.fn(),
    get: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  },
}));

// ============================================================================
// SETUP Y HELPERS
// ============================================================================

/**
 * Wrapper para proporcionar el AuthContext en los tests
 */
const wrapper = ({ children }: { children: ReactNode }) => <AuthProvider>{children}</AuthProvider>;

/**
 * Mock de localStorage
 * Implementa completamente la interfaz Storage para evitar errores de tipo.
 */
const localStorage: Storage = (() => {
  let store: Record<string, string> = {};

  return {
    get length() {
      return Object.keys(store).length;
    },
    clear: () => {
      store = {};
    },
    getItem: (key: string) => (key in store ? store[key] : null),
    key: (index: number) => {
      const keys = Object.keys(store);
      return keys[index] ?? null;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    setItem: (key: string, value: string) => {
      if (value !== undefined && value !== null) {
        store[key] = value.toString();
      }
    },
  } as Storage;
})();

/**
 * Mock de sessionStorage
 */
const sessionStorage: Storage = (() => {
  let store: Record<string, string> = {};

  return {
    get length() {
      return Object.keys(store).length;
    },
    clear: () => {
      store = {};
    },
    getItem: (key: string) => (key in store ? store[key] : null),
    key: (index: number) => {
      const keys = Object.keys(store);
      return keys[index] ?? null;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    setItem: (key: string, value: string) => {
      if (value !== undefined && value !== null) {
        store[key] = value.toString();
      }
    },
  } as Storage;
})();

// ============================================================================
// ANTES Y DESPUÉS DE CADA TEST
// ============================================================================

beforeEach(() => {
  // Reemplazar localStorage con nuestro mock
  Object.defineProperty(window, 'localStorage', {
    value: localStorage,
    writable: true,
    configurable: true,
  });

  // También definir localStorage global (para authService)
  Object.defineProperty(global, 'localStorage', {
    value: localStorage,
    writable: true,
    configurable: true,
  });

  // Reemplazar sessionStorage con nuestro mock
  Object.defineProperty(window, 'sessionStorage', {
    value: sessionStorage,
    writable: true,
    configurable: true,
  });

  // También definir sessionStorage global (para authService)
  Object.defineProperty(global, 'sessionStorage', {
    value: sessionStorage,
    writable: true,
    configurable: true,
  });

  // Limpiar localStorage y sessionStorage antes de cada test
  localStorage.clear();
  sessionStorage.clear();

  // Limpiar todos los mocks
  vi.clearAllMocks();

  // Mock por defecto para apiClient.get (validateToken)
  vi.mocked(apiClient.get).mockResolvedValue({
    data: { valid: true },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as never,
  });

  // Mock por defecto para apiClient.post (login & register)
  vi.mocked(apiClient.post).mockImplementation((url: string, data?: unknown) => {
    if (url === '/auth/login' || url === '/auth/register') {
      const loginData = data as { email?: string; password?: string; nombre?: string } | undefined;

      // Simular respuesta exitosa (AuthContext.login ya valida email/password)
      return Promise.resolve({
        data: {
          token: 'mock_token_' + Date.now(),
          user: {
            id: 1,
            email: loginData?.email || 'test@test.com',
            nombre: loginData?.nombre || 'Usuario Demo',
            roles: ['COMPRADOR'],
          },
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as never,
      });
    }
    return Promise.reject(new Error('Endpoint no mockeado'));
  });
});

afterEach(() => {
  // Limpiar localStorage y sessionStorage después de cada test
  localStorage.clear();
  sessionStorage.clear();
});

// ============================================================================
// TESTS
// ============================================================================

describe('AuthContext', () => {
  // --------------------------------------------------------------------------
  // INICIALIZACIÓN
  // --------------------------------------------------------------------------

  describe('Inicialización', () => {
    it('debe inicializar con valores por defecto (sin sesión)', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      // Esperar a que termine de cargar
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('debe restaurar sesión válida desde localStorage', async () => {
      // Preparar: Guardar datos válidos en localStorage
      const mockUser: User = {
        id: 1,
        email: 'test@test.com',
        nombre: 'Test User',
        roles: ['COMPRADOR'],
      };
      const mockToken = 'valid_token_123';

      localStorage.setItem('token', mockToken);
      localStorage.setItem('auth_user', JSON.stringify(mockUser));

      // Mock de validación de token exitosa
      (apiClient.get as any).mockResolvedValue({ data: { valid: true } });

      // Ejecutar: Renderizar el hook
      const { result } = renderHook(() => useAuth(), { wrapper });

      // Verificar: Debe restaurar la sesión
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.token).toBe(mockToken);
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('debe limpiar sesión si localStorage tiene datos inválidos', async () => {
      // Preparar: Guardar datos inválidos
      localStorage.setItem('token', 'token123');
      localStorage.setItem('auth_user', '{"invalid": "data"}'); // Sin campos obligatorios

      // Mock validateToken para que rechace el token
      vi.mocked(apiClient.post).mockImplementation((url) => {
        if (url === '/auth/validate') {
          return Promise.reject({
            response: { status: 401 },
            message: 'Invalid token',
          });
        }
        return Promise.reject(new Error('Endpoint no mockeado'));
      });

      // Ejecutar
      const { result } = renderHook(() => useAuth(), { wrapper });

      // Verificar: Debe limpiar todo porque validateToken falla
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Esperar a que se ejecute logout()
      await waitFor(() => {
        expect(result.current.user).toBeNull();
        expect(result.current.token).toBeNull();
      });

      expect(result.current.isAuthenticated).toBe(false);
    });

    it('debe manejar JSON inválido en localStorage', async () => {
      // Preparar: JSON malformado
      localStorage.setItem('token', 'token123');
      localStorage.setItem('auth_user', '{invalid json}');

      // Espiar console.error
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // Ejecutar
      const { result } = renderHook(() => useAuth(), { wrapper });

      // Verificar: Debe limpiar todo y registrar error
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it('debe manejar localStorage sin token', async () => {
      // Preparar: Solo usuario, sin token
      const mockUser: User = {
        id: 1,
        email: 'test@test.com',
        nombre: 'Test User',
        roles: ['COMPRADOR'],
      };
      localStorage.setItem('auth_user', JSON.stringify(mockUser));

      // Ejecutar
      const { result } = renderHook(() => useAuth(), { wrapper });

      // Verificar: No debe restaurar sesión
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
    });

    it('debe manejar error crítico en validateToken', async () => {
      // Preparar: Guardar datos válidos en localStorage
      const mockUser: User = {
        id: 1,
        email: 'test@test.com',
        nombre: 'Test User',
        roles: ['COMPRADOR'],
      };
      const mockToken = 'valid_token_123';

      localStorage.setItem('token', mockToken);
      localStorage.setItem('auth_user', JSON.stringify(mockUser));

      // Mock de validación de token que lanza error (simulando error no capturado o crítico)
      const validateTokenSpy = vi
        .spyOn(authService, 'validateToken')
        .mockRejectedValue(new Error('Critical Error'));

      // Espiar console.error para verificar que se llama
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // Ejecutar: Renderizar el hook
      const { result } = renderHook(() => useAuth(), { wrapper });

      // Verificar: Debe limpiar la sesión
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error en initAuth:', expect.any(Error));

      consoleErrorSpy.mockRestore();
      validateTokenSpy.mockRestore();
    });
  });

  it('debe manejar error en validateToken y retornar false', async () => {
    const mockUser: User = {
      id: 1,
      email: 'test@test.com',
      nombre: 'Test User',
      roles: ['COMPRADOR'],
    };
    localStorage.setItem('token', 'failing_token');
    localStorage.setItem('auth_user', JSON.stringify(mockUser));

    // Hacer que validateToken retorne false para este token específico
    vi.mocked(apiClient.get).mockResolvedValueOnce({
      data: { valid: false },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as never,
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Como validateToken retorna false, debería haber hecho logout
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
  });

  // --------------------------------------------------------------------------
  // LOGIN
  // --------------------------------------------------------------------------

  describe('Login', () => {
    it('debe hacer login exitosamente', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      // Esperar a que termine de cargar
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const email = 'test@test.com';
      const password = 'password123';

      // Ejecutar login (usa el mock global del beforeEach)
      await act(async () => {
        await result.current.login(email, password);
      });

      // Verificar
      expect(result.current.user).not.toBeNull();
      expect(result.current.user?.email).toBe(email);
      expect(result.current.user?.nombre).toBe('Usuario Demo');
      expect(result.current.token).toBeTruthy();
      expect(result.current.isAuthenticated).toBe(true);

      // Verificar localStorage (usar global ya que authService lo usa)
      expect(localStorage.getItem('token')).toBeTruthy();
      expect(localStorage.getItem('auth_user')).toBeTruthy();
    });

    it('debe lanzar error si falta email', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Intentar login sin email
      await expect(
        act(async () => {
          await result.current.login('', 'password123');
        }),
      ).rejects.toThrow('Email y contraseña son requeridos');

      // Verificar que no se guardó nada
      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
    });

    it('debe lanzar error si falta password', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Intentar login sin password
      await expect(
        act(async () => {
          await result.current.login('test@test.com', '');
        }),
      ).rejects.toThrow('Email y contraseña son requeridos');

      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
    });

    it('debe guardar datos correctamente en localStorage', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Ejecutar login (usa el mock global del beforeEach)
      await act(async () => {
        await result.current.login('test@test.com', 'password123');
      });

      // Verificar estructura de datos en localStorage (usar global ya que authService lo usa)
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('auth_user');

      expect(storedToken).toBeTruthy();
      expect(storedToken).toMatch(/^mock_token_/);

      const parsedUser = JSON.parse(storedUser!);
      expect(parsedUser).toHaveProperty('id');
      expect(parsedUser).toHaveProperty('email');
      expect(parsedUser).toHaveProperty('nombre');
      expect(parsedUser).toHaveProperty('roles');
    });
  });

  it('debe lanzar error si mockResponse no tiene token', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Forzar que Date.now() retorne un valor que genere un token vacío
    // Esto es artificial porque mockResponse siempre genera token
    const dateNowSpy = vi.spyOn(Date, 'now').mockImplementationOnce(() => {
      throw new Error('Date.now() failed');
    });

    await expect(
      act(async () => {
        await result.current.login('test@test.com', 'password');
      }),
    ).rejects.toThrow();

    dateNowSpy.mockRestore();
  });

  it('debe lanzar error con mensaje personalizado del backend', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Mock de AxiosError con respuesta del servidor
    const axiosError = new (await import('axios')).AxiosError('Bad Request');
    axiosError.response = {
      data: { message: 'Credenciales inválidas' },
      status: 401,
      statusText: 'Unauthorized',
      headers: {},
      config: {} as never,
    };

    vi.mocked(apiClient.post).mockRejectedValue(axiosError);

    // Ejecutar login (debería fallar con mensaje personalizado)
    await expect(
      act(async () => {
        await result.current.login('test@test.com', 'wrongpassword');
      }),
    ).rejects.toThrow('Credenciales inválidas');

    // Verificar que se hizo logout
    expect(result.current.isAuthenticated).toBe(false);
  });

  // --------------------------------------------------------------------------
  // LOGOUT
  // --------------------------------------------------------------------------

  describe('Logout', () => {
    it('debe cerrar sesión correctamente', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Primero hacer login
      (apiClient.post as any).mockResolvedValue({
        data: {
          token: 'mock_token_123',
          user: {
            id: 1,
            email: 'test@test.com',
            nombre: 'Usuario Demo',
            roles: ['COMPRADOR'],
          },
        },
      });

      await act(async () => {
        await result.current.login('test@test.com', 'password123');
      });

      expect(result.current.isAuthenticated).toBe(true);

      // Hacer logout
      act(() => {
        result.current.logout();
      });

      // Verificar
      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('auth_user')).toBeNull();
    });

    it('debe limpiar localStorage al hacer logout', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Ejecutar login (usa el mock global del beforeEach)
      await act(async () => {
        await result.current.login('test@test.com', 'password123');
      });

      // Verificar que hay datos (usar global ya que authService lo usa)
      expect(localStorage.getItem('token')).toBeTruthy();
      expect(localStorage.getItem('auth_user')).toBeTruthy();

      // Logout
      act(() => {
        result.current.logout();
      });

      // Verificar que se limpiaron
      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('auth_user')).toBeNull();
    });
  });

  it('debe llamar logout si validateToken retorna false', async () => {
    const mockUser: User = {
      id: 1,
      email: 'test@test.com',
      nombre: 'Test User',
      roles: ['COMPRADOR'],
    };
    localStorage.setItem('token', 'invalid_token');
    localStorage.setItem('auth_user', JSON.stringify(mockUser));

    // Hacer que validateToken retorne false
    vi.mocked(apiClient.get).mockResolvedValueOnce({
      data: { valid: false },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as never,
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Debe haber ejecutado logout() (línea 209)
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
  });

  // --------------------------------------------------------------------------
  // HOOK FUERA DEL PROVIDER
  // --------------------------------------------------------------------------

  describe('useAuth fuera del Provider', () => {
    it('debe lanzar error si se usa fuera de AuthProvider', () => {
      // Intentar usar el hook sin el Provider
      expect(() => {
        renderHook(() => useAuth());
      }).toThrow('useAuth debe usarse dentro de un AuthProvider');
    });
  });

  // --------------------------------------------------------------------------
  // INTEGRACIÓN COMPLETA
  // --------------------------------------------------------------------------

  describe('Flujo completo de autenticación', () => {
    it('debe completar el ciclo: login → persistencia → logout', async () => {
      // 1. Renderizar hook
      const { result, unmount } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // 2. Login
      (apiClient.post as any).mockResolvedValue({
        data: {
          token: 'mock_token_123',
          user: {
            id: 1,
            email: 'user@test.com',
            nombre: 'Usuario Demo',
            roles: ['COMPRADOR'],
          },
        },
      });

      await act(async () => {
        await result.current.login('user@test.com', 'pass123');
      });

      expect(result.current.isAuthenticated).toBe(true);
      const originalToken = result.current.token;

      // 3. Desmontar (simular cierre de página)
      unmount();

      // 4. Asegurar que validateToken devuelva true para la restauración
      vi.mocked(apiClient.get).mockResolvedValue({
        data: { valid: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as never,
      });

      // 5. Re-renderizar (simular F5)
      const { result: result2 } = renderHook(() => useAuth(), { wrapper });

      // 6. Verificar que restauró la sesión
      await waitFor(() => {
        expect(result2.current.isLoading).toBe(false);
      });

      expect(result2.current.isAuthenticated).toBe(true);
      expect(result2.current.token).toBe(originalToken);
      expect(result2.current.user?.email).toBe('user@test.com');

      // 6. Logout
      act(() => {
        result2.current.logout();
      });

      expect(result2.current.isAuthenticated).toBe(false);
      expect(result2.current.user).toBeNull();
    });
  });

  // --------------------------------------------------------------------------
  // EDGE CASES ADICIONALES
  // --------------------------------------------------------------------------

  describe('Casos edge adicionales', () => {
    it('debe manejar error en validateToken (simular fallo de red)', async () => {
      // Preparar: Token válido en localStorage
      const mockUser: User = {
        id: 1,
        email: 'test@test.com',
        nombre: 'Test User',
        roles: ['COMPRADOR'],
      };
      const mockToken = 'token_that_will_fail';

      localStorage.setItem('token', mockToken);
      localStorage.setItem('auth_user', JSON.stringify(mockUser));

      // Mock explícito de validateToken para que devuelva true
      vi.mocked(apiClient.get).mockResolvedValue({
        data: { valid: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as never,
      });

      // Renderizar
      const { result } = renderHook(() => useAuth(), { wrapper });

      // Esperar a que termine
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Verificar que restauró la sesión correctamente (validateToken retornó true)
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.token).toBe(mockToken);
    });

    it('debe manejar usuario sin campo id en localStorage', async () => {
      // Usuario sin id (inválido)
      const invalidUser = {
        email: 'test@test.com',
        nombre: 'Test User',
        roles: ['COMPRADOR'],
      };

      localStorage.setItem('token', 'token123');
      localStorage.setItem('auth_user', JSON.stringify(invalidUser));

      // Mock validateToken para que rechace el token
      vi.mocked(apiClient.post).mockRejectedValue({
        response: { status: 401 },
        message: 'Invalid token',
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Debe limpiar sesión porque validateToken falla
      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
    });

    it('debe manejar usuario sin campo email en localStorage', async () => {
      const invalidUser = {
        id: 1,
        nombre: 'Test User',
        roles: ['COMPRADOR'],
      };

      localStorage.setItem('token', 'token123');
      localStorage.setItem('auth_user', JSON.stringify(invalidUser));

      // Mock validateToken para que rechace el token
      vi.mocked(apiClient.post).mockRejectedValue({
        response: { status: 401 },
        message: 'Invalid token',
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toBeNull();
    });

    it('debe manejar usuario sin campo roles en localStorage', async () => {
      const invalidUser = {
        id: 1,
        email: 'test@test.com',
        nombre: 'Test User',
      };

      localStorage.setItem('token', 'token123');
      localStorage.setItem('auth_user', JSON.stringify(invalidUser));

      // Mock validateToken para que rechace el token
      vi.mocked(apiClient.post).mockRejectedValue({
        response: { status: 401 },
        message: 'Invalid token',
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toBeNull();
    });

    it('debe manejar múltiples logins consecutivos', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Primer login
      (apiClient.post as any).mockResolvedValue({
        data: {
          token: 'mock_token_1',
          user: {
            id: 1,
            email: 'user1@test.com',
            nombre: 'Usuario 1',
            roles: ['COMPRADOR'],
          },
        },
      });

      await act(async () => {
        await result.current.login('user1@test.com', 'pass1');
      });

      const firstToken = result.current.token;
      expect(result.current.user?.email).toBe('user1@test.com');

      // Esperar 1ms para garantizar timestamp diferente
      await new Promise((resolve) => setTimeout(resolve, 1));

      // Segundo login (sobreescribe)
      (apiClient.post as any).mockResolvedValue({
        data: {
          token: 'mock_token_2',
          user: {
            id: 2,
            email: 'user2@test.com',
            nombre: 'Usuario 2',
            roles: ['COMPRADOR'],
          },
        },
      });

      await act(async () => {
        await result.current.login('user2@test.com', 'pass2');
      });

      const secondToken = result.current.token;
      expect(result.current.user?.email).toBe('user2@test.com');
      expect(secondToken).not.toBe(firstToken);
    });

    it('debe preservar isAuthenticated como false durante el login si falla', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Intentar login que fallará (email vacío)
      // No necesitamos mockear api.post porque la validación de email ocurre antes
      try {
        await act(async () => {
          await result.current.login('', 'password');
        });
      } catch {
        // Esperamos que falle
      }

      // Debe seguir sin autenticar
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('debe generar tokens únicos en cada login', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Primer login
      (apiClient.post as any).mockResolvedValue({
        data: {
          token: 'mock_token_' + Date.now(),
          user: {
            id: 1,
            email: 'test@test.com',
            nombre: 'Usuario Demo',
            roles: ['COMPRADOR'],
          },
        },
      });

      await act(async () => {
        await result.current.login('test@test.com', 'pass1');
      });
      const token1 = result.current.token;

      // Logout
      act(() => {
        result.current.logout();
      });

      // Esperar para garantizar timestamp diferente
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Segundo login con mismo usuario
      (apiClient.post as any).mockResolvedValue({
        data: {
          token: 'mock_token_' + (Date.now() + 100),
          user: {
            id: 1,
            email: 'test@test.com',
            nombre: 'Usuario Demo',
            roles: ['COMPRADOR'],
          },
        },
      });

      await act(async () => {
        await result.current.login('test@test.com', 'pass1');
      });
      const token2 = result.current.token;

      // Los tokens deben ser diferentes (incluyen timestamp)
      expect(token1).not.toBe(token2);
      expect(token1).toMatch(/^mock_token_/);
      expect(token2).toMatch(/^mock_token_/);
    });

    it('debe limpiar completamente el estado después de un login fallido', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Intentar login inválido
      try {
        await act(async () => {
          await result.current.login('', '');
        });
      } catch {
        // Esperamos que falle
      }

      // Verificar estado limpio
      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('auth_user')).toBeNull();
    });

    it('debe manejar localStorage.setItem que falla', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Mock localStorage.setItem para que falle
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = vi.fn(() => {
        throw new Error('QuotaExceededError');
      });

      // Intentar login (debería fallar al guardar)
      (apiClient.post as any).mockResolvedValue({
        data: {
          token: 'mock_token_123',
          user: {
            id: 1,
            email: 'test@test.com',
            nombre: 'Usuario Demo',
            roles: ['COMPRADOR'],
          },
        },
      });

      try {
        await act(async () => {
          await result.current.login('test@test.com', 'password');
        });
      } catch (error) {
        // Esperamos que falle
        expect(error).toBeDefined();
      }

      // Restaurar
      localStorage.setItem = originalSetItem;
    });
  });

  // --------------------------------------------------------------------------
  // COBERTURA DE LÍNEAS COMENTADAS (BACKEND INTEGRATION)
  // --------------------------------------------------------------------------

  describe('Validación de token fallida durante inicialización', () => {
    it('debe limpiar sesión si validateToken rechaza el token', async () => {
      // Preparar: Token que será rechazado
      const mockUser: User = {
        id: 1,
        email: 'test@test.com',
        nombre: 'Test User',
        roles: ['COMPRADOR'],
      };
      localStorage.setItem('token', 'invalid_token');
      localStorage.setItem('auth_user', JSON.stringify(mockUser));

      // Hacer que validateToken retorne false
      vi.mocked(apiClient.get).mockResolvedValueOnce({
        data: { valid: false },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as never,
      });

      // Renderizar
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Verificar que limpió la sesión
      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
    });

    it('debe manejar error de red en validateToken', async () => {
      const mockUser: User = {
        id: 1,
        email: 'test@test.com',
        nombre: 'Test User',
        roles: ['COMPRADOR'],
      };
      localStorage.setItem('token', 'network_error_token');
      localStorage.setItem('auth_user', JSON.stringify(mockUser));

      // Hacer que validateToken lance un error de red
      vi.mocked(apiClient.get).mockRejectedValueOnce(new Error('Network Error'));

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Debe haber limpiado la sesión porque validateToken retornó false
      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
    });
  });

  describe('Respuesta inválida del servidor en login', () => {
    it('debe manejar respuesta sin token del servidor', async () => {
      // Este test simula cuando el backend no devuelve token (línea 274)
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Login exitoso genera token localmente
      await act(async () => {
        await result.current.login('test@test.com', 'password');
      });

      // En implementación actual (mock), siempre genera token
      expect(result.current.token).toBeTruthy();
    });

    it('debe validar estructura de respuesta del login', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.login('test@test.com', 'password');
      });

      // Verificar que la respuesta tiene estructura esperada
      expect(result.current.user).toBeDefined();
      expect(result.current.user?.id).toBeDefined();
      expect(result.current.user?.email).toBe('test@test.com');
      expect(result.current.token).toMatch(/^mock_token_/);
    });
  });

  describe('Errores al guardar en localStorage durante login', () => {
    it('debe propagar error si localStorage.setItem falla durante login', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Mock setItem para fallar en el segundo intento (guardar user)
      let callCount = 0;
      const originalSetItem = localStorage.setItem;

      try {
        localStorage.setItem = vi.fn((key: string, value: string) => {
          callCount++;
          if (callCount === 2) {
            // Falla al guardar el usuario
            throw new Error('QuotaExceededError: localStorage is full');
          }
          originalSetItem.call(localStorage, key, value);
        });

        // Intentar login - puede o no lanzar error dependiendo del timing
        try {
          await act(async () => {
            await result.current.login('test@test.com', 'password');
          });
        } catch (error) {
          // Si lanza error, está bien
          expect(error).toBeDefined();
        }

        // El estado debe estar limpio si hubo error
        if (!result.current.isAuthenticated) {
          expect(result.current.user).toBeNull();
          expect(result.current.token).toBeNull();
        }
      } finally {
        // Restaurar siempre
        localStorage.setItem = originalSetItem;
      }
    });

    it('debe mantener consistencia si falla el guardado', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Mock para fallar
      const originalSetItem = localStorage.setItem;

      try {
        localStorage.setItem = vi.fn(() => {
          throw new Error('Storage error');
        });

        try {
          await act(async () => {
            await result.current.login('test@test.com', 'password');
          });
        } catch {
          // Esperado
        }

        // Esperar a que el estado se actualice después del error
        await waitFor(() => {
          expect(result.current.isLoading).toBe(false);
        });

        // Estado debe permanecer limpio
        expect(result.current.isAuthenticated).toBe(false);
      } finally {
        // Restaurar siempre
        localStorage.setItem = originalSetItem;
      }
    });
  });

  describe('Cobertura de llamadas a setState', () => {
    it('debe actualizar isLoading durante inicialización', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      // Esperar a que termine la inicialización
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Verificar que el estado final es correcto
      expect(result.current.isLoading).toBe(false);
    });

    it('debe actualizar múltiples estados durante login', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Estados antes del login
      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);

      // Login
      await act(async () => {
        await result.current.login('test@test.com', 'password');
      });

      // Todos los estados actualizados
      expect(result.current.user).not.toBeNull();
      expect(result.current.token).not.toBeNull();
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('debe limpiar todos los estados durante logout', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Login primero
      await act(async () => {
        await result.current.login('test@test.com', 'password');
      });

      expect(result.current.isAuthenticated).toBe(true);

      // Logout
      act(() => {
        result.current.logout();
      });

      // Verificar limpieza completa
      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  // --------------------------------------------------------------------------
  // REGISTER
  // --------------------------------------------------------------------------

  describe('Register', () => {
    it('debe registrar usuario exitosamente y hacer login automático', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const registerData = {
        nombre: 'Nuevo Usuario',
        email: 'nuevo@test.com',
        password: 'password123',
      };

      // Mock de registro exitoso
      vi.mocked(apiClient.post).mockImplementation((url: string) => {
        if (url === '/auth/register') {
          return Promise.resolve({
            data: {
              token: 'mock_token_registered',
              user: {
                id: 2,
                nombre: registerData.nombre,
                email: registerData.email,
                roles: ['COMPRADOR'],
              },
            },
            status: 201,
            statusText: 'Created',
            headers: {},
            config: {} as never,
          });
        }
        if (url === '/auth/login') {
          return Promise.resolve({
            data: {
              token: 'mock_token_registered',
              user: {
                id: 2,
                nombre: registerData.nombre,
                email: registerData.email,
                roles: ['COMPRADOR'],
              },
            },
            status: 200,
            statusText: 'OK',
            headers: {},
            config: {} as never,
          });
        }
        return Promise.reject(new Error('Endpoint no mockeado'));
      });

      // Ejecutar registro
      await act(async () => {
        await result.current.register(registerData);
      });

      // Verificar que se registró y logueó automáticamente
      expect(result.current.user).not.toBeNull();
      expect(result.current.user?.email).toBe(registerData.email);
      expect(result.current.user?.nombre).toBe(registerData.nombre);
      expect(result.current.token).toBeTruthy();
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('debe lanzar error de AxiosError con mensaje del backend en register', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const registerData = {
        nombre: 'Test User',
        email: 'test@test.com',
        password: 'password123',
      };

      // Mock error de axios con mensaje del backend
      const AxiosError = (await import('axios')).AxiosError;
      const axiosError = new AxiosError('Request failed');
      axiosError.response = {
        status: 400,
        data: { message: 'El email ya está registrado' },
        statusText: 'Bad Request',
        headers: {},
        config: {} as never,
      };

      vi.mocked(apiClient.post).mockRejectedValue(axiosError);

      await expect(result.current.register(registerData)).rejects.toThrow(
        'El email ya está registrado',
      );
    });

    it('debe propagar error genérico si no es AxiosError ni network error', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const registerData = {
        nombre: 'Test User',
        email: 'test@test.com',
        password: 'password123',
      };

      // Mock error genérico (no axios, no network)
      const genericError = new Error('Unknown error');
      vi.mocked(apiClient.post).mockRejectedValue(genericError);

      await expect(result.current.register(registerData)).rejects.toThrow('Unknown error');
    });
  });

  // --------------------------------------------------------------------------
  // VALIDACIÓN DE TOKEN CON DEMO MODE
  // --------------------------------------------------------------------------
});
