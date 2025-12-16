import { apiPost } from './api';

/**
 * Interfaces que coinciden exactamente con los DTOs de Java del backend
 */

export interface AsientoDTO {
  etiqueta: string;
  fila: number;
  columna: number;
  x: number;
  y: number;
  forma: string;
  tipoEntradaId?: number;
}

export interface ZonaDTO {
  nombre: string;
  capacidad: number;
  asientos: AsientoDTO[];
  objetosDecorativos?: object[];
}

export interface SeatMapLayoutDTO {
  ancho?: number;
  alto?: number;
  zonas?: ZonaDTO[];
}

/**
 * DTO de entrada para crear un evento
 * Coincide con: com.cudeca.dto.usuario.EventCreationRequest
 */
export interface EventCreationRequest {
  nombre: string;
  descripcion?: string;
  fechaInicio: string; // ISO 8601 con zona horaria (OffsetDateTime en Java)
  fechaFin?: string;
  lugar: string;
  objetivoRecaudacion?: number;
  imagenUrl?: string;
  layout?: SeatMapLayoutDTO;
}

/**
 * DTO de respuesta del backend
 * Coincide con: com.cudeca.dto.evento.EventoDTO
 */
export interface EventoResponseDTO {
  id: number;
  nombre: string;
  fechaInicio: string;
  lugar: string;
  estado: 'BORRADOR' | 'PUBLICADO' | 'CANCELADO' | 'FINALIZADO';
  imagenUrl?: string;
}

/**
 * Crea un nuevo evento en el backend
 * 
 * @param evento - Datos del evento a crear
 * @returns Promise con el evento creado (incluyendo ID y estado)
 * 
 * @example
 * ```typescript
 * const nuevoEvento = await createEvent({
 *   nombre: "Concierto Benéfico",
 *   descripcion: "Evento para recaudar fondos",
 *   fechaInicio: "2024-06-15T19:00:00+02:00",
 *   lugar: "Auditorio Municipal",
 *   objetivoRecaudacion: 5000,
 *   imagenUrl: "https://example.com/imagen.jpg"
 * });
 * ```
 */
export async function createEvent(evento: EventCreationRequest): Promise<EventoResponseDTO> {
  return await apiPost<EventoResponseDTO>('/eventos', evento);
}
