import { apiGet, apiPatch } from './api';
import type { Evento } from '../types/api.types';

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
