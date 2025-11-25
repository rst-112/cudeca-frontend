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
const localStorageMock: Storage = (() => {
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
      store[key] = value.toString();
    },
  } as Storage;
})();

// ============================================================================
// ANTES Y DESPUÉS DE CADA TEST
// ============================================================================

beforeEach(() => {
  // Reemplazar localStorage con nuestro mock
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
  });

  // Limpiar localStorage antes de cada test
  localStorageMock.clear();

  // Limpiar todos los mocks
  vi.clearAllMocks();
});

afterEach(() => {
  // Limpiar localStorage después de cada test
  localStorageMock.clear();
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
        rol: 'COMPRADOR',
      };
      const mockToken = 'valid_token_123';

      localStorageMock.setItem('token', mockToken);
      localStorageMock.setItem('auth_user', JSON.stringify(mockUser));

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
      localStorageMock.setItem('token', 'token123');
      localStorageMock.setItem('auth_user', '{"invalid": "data"}'); // Sin campos obligatorios

      // Ejecutar
      const { result } = renderHook(() => useAuth(), { wrapper });

      // Verificar: Debe limpiar todo
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(localStorageMock.getItem('token')).toBeNull();
      expect(localStorageMock.getItem('auth_user')).toBeNull();
    });

    it('debe manejar JSON inválido en localStorage', async () => {
      // Preparar: JSON malformado
      localStorageMock.setItem('token', 'token123');
      localStorageMock.setItem('auth_user', '{invalid json}');

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
        rol: 'COMPRADOR',
      };
      localStorageMock.setItem('auth_user', JSON.stringify(mockUser));

      // Ejecutar
      const { result } = renderHook(() => useAuth(), { wrapper });

      // Verificar: No debe restaurar sesión
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
    });
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

      // Ejecutar login
      await act(async () => {
        await result.current.login(email, password);
      });

      // Verificar
      expect(result.current.user).not.toBeNull();
      expect(result.current.user?.email).toBe(email);
      expect(result.current.user?.nombre).toBe('Usuario Demo');
      expect(result.current.token).toBeTruthy();
      expect(result.current.isAuthenticated).toBe(true);

      // Verificar localStorage
      expect(localStorageMock.getItem('token')).toBeTruthy();
      expect(localStorageMock.getItem('auth_user')).toBeTruthy();
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

      await act(async () => {
        await result.current.login('test@test.com', 'password123');
      });

      // Verificar estructura de datos en localStorage
      const storedToken = localStorageMock.getItem('token');
      const storedUser = localStorageMock.getItem('auth_user');

      expect(storedToken).toBeTruthy();
      expect(storedToken).toMatch(/^mock_token_/);

      const parsedUser = JSON.parse(storedUser!);
      expect(parsedUser).toHaveProperty('id');
      expect(parsedUser).toHaveProperty('email');
      expect(parsedUser).toHaveProperty('nombre');
      expect(parsedUser).toHaveProperty('rol');
    });
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
      expect(localStorageMock.getItem('token')).toBeNull();
      expect(localStorageMock.getItem('auth_user')).toBeNull();
    });

    it('debe limpiar localStorage al hacer logout', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Login
      await act(async () => {
        await result.current.login('test@test.com', 'password123');
      });

      // Verificar que hay datos
      expect(localStorageMock.getItem('token')).toBeTruthy();
      expect(localStorageMock.getItem('auth_user')).toBeTruthy();

      // Logout
      act(() => {
        result.current.logout();
      });

      // Verificar que se limpiaron
      expect(localStorageMock.getItem('token')).toBeNull();
      expect(localStorageMock.getItem('auth_user')).toBeNull();
    });
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
      await act(async () => {
        await result.current.login('user@test.com', 'pass123');
      });

      expect(result.current.isAuthenticated).toBe(true);
      const originalToken = result.current.token;

      // 3. Desmontar (simular cierre de página)
      unmount();

      // 4. Re-renderizar (simular F5)
      const { result: result2 } = renderHook(() => useAuth(), { wrapper });

      // 5. Verificar que restauró la sesión
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
        rol: 'COMPRADOR',
      };
      const mockToken = 'token_that_will_fail';

      localStorageMock.setItem('token', mockToken);
      localStorageMock.setItem('auth_user', JSON.stringify(mockUser));

      // Mock console.debug para evitar logs en tests
      const consoleDebugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});

      // Renderizar
      const { result } = renderHook(() => useAuth(), { wrapper });

      // Esperar a que termine
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Verificar que el token se validó (aunque sea mock)
      expect(consoleDebugSpy).toHaveBeenCalledWith('Token a validar:', mockToken);

      consoleDebugSpy.mockRestore();
    });

    it('debe manejar usuario sin campo id en localStorage', async () => {
      // Usuario sin id (inválido)
      const invalidUser = {
        email: 'test@test.com',
        nombre: 'Test User',
        rol: 'COMPRADOR',
      };

      localStorageMock.setItem('token', 'token123');
      localStorageMock.setItem('auth_user', JSON.stringify(invalidUser));

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Debe limpiar sesión
      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it('debe manejar usuario sin campo email en localStorage', async () => {
      const invalidUser = {
        id: 1,
        nombre: 'Test User',
        rol: 'COMPRADOR',
      };

      localStorageMock.setItem('token', 'token123');
      localStorageMock.setItem('auth_user', JSON.stringify(invalidUser));

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it('debe manejar usuario sin campo rol en localStorage', async () => {
      const invalidUser = {
        id: 1,
        email: 'test@test.com',
        nombre: 'Test User',
      };

      localStorageMock.setItem('token', 'token123');
      localStorageMock.setItem('auth_user', JSON.stringify(invalidUser));

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it('debe manejar múltiples logins consecutivos', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Primer login
      await act(async () => {
        await result.current.login('user1@test.com', 'pass1');
      });

      const firstToken = result.current.token;
      expect(result.current.user?.email).toBe('user1@test.com');

      // Esperar 1ms para garantizar timestamp diferente
      await new Promise((resolve) => setTimeout(resolve, 1));

      // Segundo login (sobreescribe)
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
      expect(localStorageMock.getItem('token')).toBeNull();
      expect(localStorageMock.getItem('auth_user')).toBeNull();
    });

    it('debe manejar localStorage.setItem que falla', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Mock localStorage.setItem para que falle
      const originalSetItem = localStorageMock.setItem;
      localStorageMock.setItem = vi.fn(() => {
        throw new Error('QuotaExceededError');
      });

      // Intentar login (debería fallar al guardar)
      try {
        await act(async () => {
          await result.current.login('test@test.com', 'password');
        });
      } catch (error) {
        // Esperamos que falle
        expect(error).toBeDefined();
      }

      // Restaurar
      localStorageMock.setItem = originalSetItem;
    });
  });
});
