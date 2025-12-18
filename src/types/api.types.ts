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

export type EstadoEvento = 'BORRADOR' | 'PUBLICADO' | 'CANCELADO' | 'FINALIZADO';

export type CategoriaEvento = 'Concierto' | 'Cena' | 'Rifa' | 'Otro' | 'Todos';

export interface TipoEntrada {
  id: number;
  nombre: string;
  costeBase: number;
  donacionImplicita: number;
  cantidadTotal: number;
  cantidadVendida: number;
  limitePorCompra: number;
}

export interface Evento {
  id: number;
  nombre: string;
  descripcion?: string;
  fechaInicio: string; // ISO 8601
  lugar: string;
  estado: EstadoEvento;
  imagenUrl?: string;
  objetivoRecaudacion?: number;
  tiposEntrada?: TipoEntrada[];
}
