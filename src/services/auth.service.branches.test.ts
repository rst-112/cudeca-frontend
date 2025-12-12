import { describe, it, expect, beforeEach, vi } from 'vitest';
import { authService, STORAGE_KEYS } from './auth.service';
import { apiClient } from './api';

vi.mock('./api', () => ({
  apiClient: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

describe('auth.service - Branches Coverage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('guarda el token y usuario cuando el login es exitoso', async () => {
      const mockResponse = {
        data: {
          token: 'test-token-123',
          user: {
            id: 1,
            email: 'test@test.com',
            nombre: 'Test User',
            rol: 'USER',
          },
        },
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

      const result = await authService.login({
        email: 'test@test.com',
        password: 'password123',
      });

      expect(localStorage.getItem(STORAGE_KEYS.TOKEN)).toBe('test-token-123');
      expect(localStorage.getItem(STORAGE_KEYS.USER)).toBeTruthy();
      expect(result).toEqual(mockResponse.data);
    });

    it('no guarda datos cuando falta el token en la respuesta', async () => {
      const mockResponse = {
        data: {
          user: {
            id: 1,
            email: 'test@test.com',
            nombre: 'Test User',
            rol: 'USER',
          },
        },
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

      await authService.login({
        email: 'test@test.com',
        password: 'password123',
      });

      expect(localStorage.getItem(STORAGE_KEYS.TOKEN)).toBeNull();
      expect(localStorage.getItem(STORAGE_KEYS.USER)).toBeNull();
    });

    it('no guarda datos cuando falta el usuario en la respuesta', async () => {
      const mockResponse = {
        data: {
          token: 'test-token-123',
        },
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

      await authService.login({
        email: 'test@test.com',
        password: 'password123',
      });

      expect(localStorage.getItem(STORAGE_KEYS.TOKEN)).toBeNull();
      expect(localStorage.getItem(STORAGE_KEYS.USER)).toBeNull();
    });
  });

  describe('register', () => {
    it('guarda el token y usuario cuando el registro es exitoso', async () => {
      const mockResponse = {
        data: {
          token: 'test-token-456',
          user: {
            id: 2,
            email: 'new@test.com',
            nombre: 'New User',
            rol: 'USER',
          },
        },
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

      const result = await authService.register({
        nombre: 'New User',
        email: 'new@test.com',
        password: 'password123',
      });

      expect(localStorage.getItem(STORAGE_KEYS.TOKEN)).toBe('test-token-456');
      expect(localStorage.getItem(STORAGE_KEYS.USER)).toBeTruthy();
      expect(result).toEqual(mockResponse.data);
    });

    it('no guarda datos cuando falta el token en la respuesta', async () => {
      const mockResponse = {
        data: {
          user: {
            id: 2,
            email: 'new@test.com',
            nombre: 'New User',
            rol: 'USER',
          },
        },
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

      await authService.register({
        nombre: 'New User',
        email: 'new@test.com',
        password: 'password123',
      });

      expect(localStorage.getItem(STORAGE_KEYS.TOKEN)).toBeNull();
      expect(localStorage.getItem(STORAGE_KEYS.USER)).toBeNull();
    });

    it('no guarda datos cuando falta el usuario en la respuesta', async () => {
      const mockResponse = {
        data: {
          token: 'test-token-456',
        },
      };

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse);

      await authService.register({
        nombre: 'New User',
        email: 'new@test.com',
        password: 'password123',
      });

      expect(localStorage.getItem(STORAGE_KEYS.TOKEN)).toBeNull();
      expect(localStorage.getItem(STORAGE_KEYS.USER)).toBeNull();
    });
  });

  describe('validateToken', () => {
    it('retorna true cuando el token es válido', async () => {
      const mockResponse = {
        data: {
          valid: true,
        },
      };

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      const result = await authService.validateToken('test-token');

      expect(result).toBe(true);
      expect(apiClient.get).toHaveBeenCalledWith('/auth/validate', {
        headers: { Authorization: 'Bearer test-token' },
      });
    });

    it('retorna false cuando ocurre un error', async () => {
      vi.mocked(apiClient.get).mockRejectedValue(new Error('Network error'));

      const result = await authService.validateToken('invalid-token');

      expect(result).toBe(false);
    });
  });

  describe('getCurrentUser', () => {
    it('retorna null cuando no hay usuario almacenado', () => {
      const user = authService.getCurrentUser();
      expect(user).toBeNull();
    });

    it('retorna el usuario cuando está almacenado', () => {
      const mockUser = {
        id: 1,
        email: 'test@test.com',
        nombre: 'Test User',
        rol: 'USER',
      };

      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(mockUser));

      const user = authService.getCurrentUser();
      expect(user).toEqual(mockUser);
    });

    it('retorna null cuando el JSON es inválido', () => {
      localStorage.setItem(STORAGE_KEYS.USER, 'invalid-json{');

      const user = authService.getCurrentUser();
      expect(user).toBeNull();
    });
  });

  describe('getToken', () => {
    it('retorna null cuando no hay token almacenado', () => {
      const token = authService.getToken();
      expect(token).toBeNull();
    });

    it('retorna el token cuando está almacenado', () => {
      localStorage.setItem(STORAGE_KEYS.TOKEN, 'test-token-123');

      const token = authService.getToken();
      expect(token).toBe('test-token-123');
    });
  });

  describe('logout', () => {
    it('limpia el localStorage', () => {
      localStorage.setItem(STORAGE_KEYS.TOKEN, 'test-token');
      localStorage.setItem(STORAGE_KEYS.USER, '{"id": 1}');

      authService.logout();

      expect(localStorage.getItem(STORAGE_KEYS.TOKEN)).toBeNull();
      expect(localStorage.getItem(STORAGE_KEYS.USER)).toBeNull();
    });
  });
});
