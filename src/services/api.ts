import axios, { AxiosError } from 'axios';
import type { BackendHealthResponse } from '../types/api.types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// ============================================================================
// CONFIGURACIÓN DE AXIOS
// ============================================================================

/**
 * apiClient - Instancia configurada de Axios para todas las peticiones
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// ============================================================================
// INTERCEPTORES
// ============================================================================

/**
 * Interceptor de Request - Inyecta el token de autenticación
 *
 * NOTA: Usamos una función dinámica para obtener el token en cada petición,
 * garantizando que siempre usamos el token más reciente y evitando
 * el problema de "tokens zombis" en localStorage/sessionStorage.
 */
apiClient.interceptors.request.use(
  (config) => {
    // Importar dinámicamente authService para evitar dependencias circulares
    // El token se obtiene en tiempo de ejecución, no al cargar el módulo
    const token = (() => {
      try {
        // Buscar token de forma determinista
        const localToken = localStorage.getItem('token');
        const sessionToken = sessionStorage.getItem('token');

        // Si hay tokens en ambos lugares (estado corrupto), no usar ninguno
        if (localToken && sessionToken) {
          console.error(
            'Estado corrupto detectado en interceptor: tokens en ambos almacenamientos',
          );
          return null;
        }

        return localToken || sessionToken;
      } catch (error) {
        console.error('Error obteniendo token en interceptor:', error);
        return null;
      }
    })();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

/**
 * Interceptor de Response - Manejo centralizado de errores
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Manejo específico de errores 401 (Unauthorized)
    if (error.response?.status === 401) {
      // Limpiar sesión si el token expiró
      localStorage.removeItem('token');
      localStorage.removeItem('auth_user');
      // Redirigir al login (esto lo manejará el contexto)
    }
    return Promise.reject(error);
  },
);

// ============================================================================
// FUNCIONES GENÉRICAS DE API
// ============================================================================

/**
 * apiGet - Realiza una petición GET tipada
 *
 * @template T - Tipo de datos esperados en la respuesta
 * @param {string} path - Ruta del endpoint (ej: '/users')
 * @param {object} config - Configuración adicional de Axios (opcional)
 * @returns {Promise<T>} Datos de la respuesta
 * @throws {Error} Error con mensaje descriptivo
 *
 * @example
 * ```ts
 * const user = await apiGet<User>('/users/1');
 * const events = await apiGet<Event[]>('/events');
 * ```
 */
export async function apiGet<T = unknown>(
  path: string,
  config?: Parameters<typeof apiClient.get>[1],
): Promise<T> {
  try {
    const response = await apiClient.get<T>(path, config);
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    const errorMsg = err.response?.statusText || err.message;
    throw new Error(`Error en GET ${path}: ${errorMsg}`);
  }
}

/**
 * apiPost - Realiza una petición POST tipada
 *
 * @template T - Tipo de datos esperados en la respuesta
 * @param {string} path - Ruta del endpoint
 * @param {unknown} body - Cuerpo de la petición
 * @param {object} config - Configuración adicional de Axios (opcional)
 * @returns {Promise<T>} Datos de la respuesta
 * @throws {Error} Error con mensaje descriptivo
 *
 * @example
 * ```ts
 * const newUser = await apiPost<User>('/users', { name: 'John' });
 * ```
 */
export async function apiPost<T = unknown>(
  path: string,
  body: unknown,
  config?: Parameters<typeof apiClient.post>[2],
): Promise<T> {
  try {
    const response = await apiClient.post<T>(path, body, config);
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    const errorMsg = err.response?.statusText || err.message;
    throw new Error(`Error en POST ${path}: ${errorMsg}`);
  }
}

/**
 * apiPut - Realiza una petición PUT tipada
 *
 * @template T - Tipo de datos esperados en la respuesta
 * @param {string} path - Ruta del endpoint
 * @param {unknown} body - Cuerpo de la petición
 * @param {object} config - Configuración adicional de Axios (opcional)
 * @returns {Promise<T>} Datos de la respuesta
 * @throws {Error} Error con mensaje descriptivo
 */
export async function apiPut<T = unknown>(
  path: string,
  body: unknown,
  config?: Parameters<typeof apiClient.put>[2],
): Promise<T> {
  try {
    const response = await apiClient.put<T>(path, body, config);
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    const errorMsg = err.response?.statusText || err.message;
    throw new Error(`Error en PUT ${path}: ${errorMsg}`);
  }
}

/**
 * apiDelete - Realiza una petición DELETE tipada
 *
 * @template T - Tipo de datos esperados en la respuesta
 * @param {string} path - Ruta del endpoint
 * @param {object} config - Configuración adicional de Axios (opcional)
 * @returns {Promise<T>} Datos de la respuesta
 * @throws {Error} Error con mensaje descriptivo
 */
export async function apiDelete<T = unknown>(
  path: string,
  config?: Parameters<typeof apiClient.delete>[1],
): Promise<T> {
  try {
    const response = await apiClient.delete<T>(path, config);
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    const errorMsg = err.response?.statusText || err.message;
    throw new Error(`Error en DELETE ${path}: ${errorMsg}`);
  }
}

/**
 * apiPatch - Realiza una petición PATCH tipada
 *
 * @template T - Tipo de datos esperados en la respuesta
 * @param {string} path - Ruta del endpoint
 * @param {unknown} body - Cuerpo de la petición
 * @param {object} config - Configuración adicional de Axios (opcional)
 * @returns {Promise<T>} Datos de la respuesta
 * @throws {Error} Error con mensaje descriptivo
 */
export async function apiPatch<T = unknown>(
  path: string,
  body: unknown,
  config?: Parameters<typeof apiClient.patch>[2],
): Promise<T> {
  try {
    const response = await apiClient.patch<T>(path, body, config);
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    const errorMsg = err.response?.statusText || err.message;
    throw new Error(`Error en PATCH ${path}: ${errorMsg}`);
  }
}

// ============================================================================
// FUNCIONES ESPECÍFICAS
// ============================================================================

/**
 * testBackendConnection - Verifica la conexión con el backend
 *
 * @returns {Promise<BackendHealthResponse>} Estado del backend
 *
 * @example
 * ```ts
 * const health = await testBackendConnection();
 * console.log(health.message); // "Backend operativo"
 * ```
 */
export async function testBackendConnection(): Promise<BackendHealthResponse> {
  try {
    return await apiGet<BackendHealthResponse>('/public/test');
  } catch (err) {
    console.error('Error conectando al backend:', err);
    return {
      message: 'Backend no disponible',
      status: 'error',
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * isAxiosError - Type guard para verificar si un error es de Axios
 *
 * @param {unknown} error - Error a verificar
 * @returns {boolean} true si es AxiosError
 *
 * @example
 * ```ts
 * try {
 *   await apiGet('/users');
 * } catch (error) {
 *   if (isAxiosError(error)) {
 *     console.log(error.response?.status);
 *   }
 * }
 * ```
 */
export function isAxiosError(error: unknown): error is AxiosError {
  return axios.isAxiosError(error);
}
