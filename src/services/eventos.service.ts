import { apiGet, apiPatch, apiPost } from './api';
import type { Evento } from '../types/api.types';

// Interfaces locales para la creación (DTOs de entrada)
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

export interface EventCreationRequest {
  nombre: string;
  descripcion?: string;
  fechaInicio: string; // ISO 8601 con zona horaria
  fechaFin?: string;
  lugar: string;
  objetivoRecaudacion?: number;
  imagenUrl?: string;
  layout?: SeatMapLayoutDTO;
}

/**
 * getEventos - Obtiene la lista de todos los eventos desde el backend
 */
export const getEventos = async (): Promise<Evento[]> => {
  try {
    return await apiGet<Evento[]>('/eventos');
  } catch (error) {
    console.error('Error fetching eventos:', error);
    throw error;
  }
};

/**
 * getEventoById - Obtiene un evento por su ID desde el backend
 * @param id - El ID del evento
 */
export const getEventoById = async (id: number): Promise<Evento> => {
  try {
    return await apiGet<Evento>(`/eventos/${id}`);
  } catch (error) {
    console.error(`Error fetching evento with id ${id}:`, error);
    throw error;
  }
};

/**
 * publicarEvento - Publica un evento cambiando su estado a PUBLICADO
 * @param id - El ID del evento a publicar
 */
export const publicarEvento = async (id: number): Promise<Evento> => {
  try {
    return await apiPatch<Evento>(`/eventos/${id}/publicar`, null);
  } catch (error) {
    console.error(`Error publicando evento with id ${id}:`, error);
    throw error;
  }
};

/**
 * createEvento - Crea un nuevo evento en el backend
 * @param evento - Datos del evento a crear (Request Body)
 */
export const createEvento = async (evento: EventCreationRequest): Promise<Evento> => {
  try {
    // Nota: El backend devuelve un EventoDTO completo (con ID y estado)
    return await apiPost<Evento>('/eventos', evento);
  } catch (error) {
    console.error('Error creando evento:', error);
    throw error;
  }
};
