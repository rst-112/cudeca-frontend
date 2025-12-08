/**
 * Tipos relacionados con las respuestas de la API
 */

/**
 * ApiResponse - Estructura genérica de respuesta de la API
 */
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  status: number;
}

/**
 * ApiError - Estructura de error de la API
 */
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

/**
 * BackendHealthResponse - Respuesta del endpoint de salud
 */
export interface BackendHealthResponse {
  message: string;
  timestamp?: string;
  status?: 'ok' | 'error';
}
