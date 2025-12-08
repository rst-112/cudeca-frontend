/**
 * Auth Service - Servicio de Autenticación
 *
 * Este archivo centraliza TODAS las operaciones relacionadas con autenticación:
 * - Login
 * - Registro
 * - Validación de tokens
 * - Gestión de localStorage
 */

import { apiClient } from './api';
import type { User, LoginCredentials, RegisterData, AuthResponse } from '../types/auth.types';

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
   * @param credentials - Email y contraseña del usuario
   * @returns Promise con el token y datos del usuario
   * @throws Error si las credenciales son inválidas
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);

    if (response.data.token && response.data.user) {
      localStorage.setItem(STORAGE_KEYS.TOKEN, response.data.token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.user));
    }

    return response.data;
  },

  /**
   * register - Registra un nuevo usuario
   *
   * @param data - Datos del nuevo usuario (nombre, email, password)
   * @returns Promise con el token y datos del usuario
   * @throws Error si el email ya está registrado
   */
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    if (response.data.token && response.data.user) {
      localStorage.setItem(STORAGE_KEYS.TOKEN, response.data.token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.user));
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
   * Limpia todos los datos de autenticación del localStorage
   */
  logout: (): void => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  /**
   * getCurrentUser - Obtiene el usuario actual del localStorage
   *
   * @returns User | null - Usuario actual o null si no hay sesión
   */
  getCurrentUser: (): User | null => {
    try {
      const userStr = localStorage.getItem(STORAGE_KEYS.USER);
      if (!userStr) return null;
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error parseando usuario:', error);
      return null;
    }
  },

  /**
   * getToken - Obtiene el token actual del localStorage
   *
   * @returns string | null - Token JWT o null si no hay sesión
   */
  getToken: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  },
};
