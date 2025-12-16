/**
 * Auth Service - Servicio de Autenticación
 *
 * Basado en: /api/auth (Sección 1 de API-ENDPOINTS.md)
 *
 * Endpoints:
 * - POST /api/auth/register - Registrar nuevo usuario
 * - POST /api/auth/login - Iniciar sesión
 * - GET /api/auth/validate - Validar token JWT
 */

import { apiClient } from './api';
import type { User, LoginCredentials, RegisterData, AuthResponse, Role } from '../types/auth.types';

/**
 * Claves para localStorage - Centralizadas aquí para consistencia
 */
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'auth_user',
} as const;

/**
 * authService - Objeto con todos los métodos de autenticación
 */
export const authService = {
  /**
   * login - Inicia sesión con email y contraseña
   *
   * ESTRATEGIA DE EXCLUSIÓN MUTUA ESTRICTA:
   * - Si rememberMe=true: guarda en localStorage y LIMPIA sessionStorage
   * - Si rememberMe=false: guarda en sessionStorage y LIMPIA localStorage
   * - NUNCA deben coexistir tokens en ambos almacenamientos
   *
   * @param credentials - Email y contraseña del usuario
   * @param rememberMe - Si es true usa localStorage (por defecto), si es false usa sessionStorage
   * @returns Promise con el token y datos del usuario
   * @throws Error si las credenciales son inválidas
   */
  login: async (
    credentials: LoginCredentials,
    rememberMe: boolean = true,
  ): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);

    if (response.data.token && response.data.user) {
      // El backend envía 'rol' como string separado por comas (ej: "COMPRADOR,PERSONAL_EVENTO")
      // Convertirlo a 'roles' array para el frontend
      const backendUser = response.data.user as User & { rol?: string };
      const rolesArray: Role[] =
        backendUser.roles ??
        (backendUser.rol ? backendUser.rol.split(',').map((r) => r.trim() as Role) : []);

      const user: User = {
        id: backendUser.id,
        email: backendUser.email,
        nombre: backendUser.nombre,
        roles: rolesArray,
      };

      // EXCLUSIÓN MUTUA ESTRICTA
      if (rememberMe) {
        // Guardar en localStorage y LIMPIAR sessionStorage
        localStorage.setItem(STORAGE_KEYS.TOKEN, response.data.token);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        sessionStorage.removeItem(STORAGE_KEYS.TOKEN);
        sessionStorage.removeItem(STORAGE_KEYS.USER);
      } else {
        // Guardar en sessionStorage y LIMPIAR localStorage
        sessionStorage.setItem(STORAGE_KEYS.TOKEN, response.data.token);
        sessionStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
      }

      // Devolver la respuesta con el usuario normalizado
      return { token: response.data.token, user };
    }

    return response.data;
  },

  /**
   * register - Registra un nuevo usuario
   *
   * ESTRATEGIA DE EXCLUSIÓN MUTUA ESTRICTA:
   * - Por defecto usa localStorage (rememberMe=true)
   * - Limpia el almacenamiento opuesto para evitar conflictos
   *
   * @param data - Datos del nuevo usuario (nombre, email, password)
   * @param rememberMe - Si es true usa localStorage (por defecto), si es false usa sessionStorage
   * @returns Promise con el token y datos del usuario
   * @throws Error si el email ya está registrado
   */
  register: async (data: RegisterData, rememberMe: boolean = true): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    if (response.data.token && response.data.user) {
      // El backend envía 'rol' como string separado por comas (ej: "COMPRADOR,PERSONAL_EVENTO")
      // Convertirlo a 'roles' array para el frontend
      const backendUser = response.data.user as User & { rol?: string };
      const rolesArray: Role[] =
        backendUser.roles ??
        (backendUser.rol ? backendUser.rol.split(',').map((r) => r.trim() as Role) : []);

      const user: User = {
        id: backendUser.id,
        email: backendUser.email,
        nombre: backendUser.nombre,
        roles: rolesArray,
      };

      // EXCLUSIÓN MUTUA ESTRICTA
      if (rememberMe) {
        // Guardar en localStorage y LIMPIAR sessionStorage
        localStorage.setItem(STORAGE_KEYS.TOKEN, response.data.token);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        sessionStorage.removeItem(STORAGE_KEYS.TOKEN);
        sessionStorage.removeItem(STORAGE_KEYS.USER);
      } else {
        // Guardar en sessionStorage y LIMPIAR localStorage
        sessionStorage.setItem(STORAGE_KEYS.TOKEN, response.data.token);
        sessionStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
      }

      return { token: response.data.token, user };
    }

    return response.data;
  },

  /**
   * validateToken - Valida un token con el backend
   *
   * @param token - Token JWT a validar
   * @returns Promise<boolean> - true si es válido, false si no
   */
  validateToken: async (token: string): Promise<boolean> => {
    try {
      const response = await apiClient.get<{ valid: boolean }>('/auth/validate', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.valid;
    } catch (error) {
      console.error('Error validando token:', error);
      return false;
    }
  },

  /**
   * logout - Cierra sesión del usuario
   *
   * Limpia todos los datos de autenticación del localStorage y sessionStorage
   */
  logout: (): void => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    sessionStorage.removeItem(STORAGE_KEYS.TOKEN);
    sessionStorage.removeItem(STORAGE_KEYS.USER);
  },

  /**
   * getCurrentUser - Obtiene el usuario actual de forma determinista
   *
   * BÚSQUEDA DETERMINISTA:
   * 1. Busca primero en localStorage
   * 2. Si no existe, busca en sessionStorage
   * 3. Si encuentra en ambos (estado corrupto), limpia y devuelve null
   *
   * @returns User | null - Usuario actual o null si no hay sesión
   */
  getCurrentUser: (): User | null => {
    try {
      const localUserStr = localStorage.getItem(STORAGE_KEYS.USER);
      const sessionUserStr = sessionStorage.getItem(STORAGE_KEYS.USER);

      // Si hay usuarios en ambos lugares (estado corrupto), limpiar todo
      if (localUserStr && sessionUserStr) {
        console.error('Estado corrupto detectado: usuarios en ambos almacenamientos');
        authService.logout();
        return null;
      }

      // Obtener el string del usuario que exista
      const userStr = localUserStr || sessionUserStr;
      if (!userStr) return null;

      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error parseando usuario:', error);
      authService.logout();
      return null;
    }
  },

  /**
   * getToken - Obtiene el token actual de forma determinista
   *
   * BÚSQUEDA DETERMINISTA:
   * 1. Busca primero en localStorage
   * 2. Si no existe, busca en sessionStorage
   * 3. Si encuentra en ambos (estado corrupto), limpia y devuelve null
   *
   * @returns string | null - Token JWT o null si no hay sesión
   */
  getToken: (): string | null => {
    const localToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const sessionToken = sessionStorage.getItem(STORAGE_KEYS.TOKEN);

    // Si hay tokens en ambos lugares (estado corrupto), limpiar todo
    if (localToken && sessionToken) {
      console.error('Estado corrupto detectado: tokens en ambos almacenamientos');
      authService.logout();
      return null;
    }

    // Devolver el token que exista (puede ser null si no hay ninguno)
    return localToken || sessionToken;
  },
};
