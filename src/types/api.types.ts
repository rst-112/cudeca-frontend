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

/**
 * EstadoEvento - Posibles estados de un evento
 */
export type EstadoEvento = 'BORRADOR' | 'PUBLICADO' | 'CANCELADO' | 'FINALIZADO';

/**
 * CategoriaEvento - Posibles categorías de un evento
 */
export type CategoriaEvento = 'Concierto' | 'Cena' | 'Rifa' | 'Otro' | 'Todos';

/**
 * Evento - Estructura de datos para un evento
 */
export interface Evento {
  id: number;
  nombre: string;
  descripcion: string;
  fecha: string; // Formato ISO 8601: "YYYY-MM-DDTHH:mm:ss.sssZ"
  ubicacion: string;
  imagenUrl: string;
  capacidad: number;
  // Campos para administración
  estado: EstadoEvento;
  recaudado: number;
  objetivo: number;
  // Nuevo campo
  categoria: CategoriaEvento;
}
