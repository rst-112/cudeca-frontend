import { apiClient } from './api';
import type { MapaAsientos } from '../types/seatmap.types';

/**
 * ============================================================================
 * SERVICIO DE ASIENTOS
 * ============================================================================
 *
 * Este servicio gestiona todas las peticiones relacionadas con mapas de
 * asientos de eventos. Permite:
 * - Obtener el mapa completo de asientos de un evento
 * - Verificar disponibilidad de asientos individuales
 *
 * Endpoints consumidos:
 * - GET /api/eventos/{eventoId}/mapa-asientos
 * - GET /api/asientos/{asientoId}/disponible
 */

/**
 * Obtiene el mapa de asientos completo para un evento específico
 *
 * @param eventoId - ID del evento
 * @returns MapaAsientos con zonas y asientos, o null si el evento no tiene mapa configurado
 *
 * @example
 * ```ts
 * const mapa = await getMapaAsientosByEventoId(999);
 * if (mapa) {
 *   console.log(`El evento tiene ${mapa.zonas.length} zonas`);
 * } else {
 *   console.log('Evento sin mapa de asientos');
 * }
 * ```
 */
export const getMapaAsientosByEventoId = async (eventoId: number): Promise<MapaAsientos | null> => {
  try {
    const response = await apiClient.get<MapaAsientos>(`/eventos/${eventoId}/mapa-asientos`);
    return response.data;
  } catch (error: unknown) {
    // Si el backend devuelve 404, significa que el evento no tiene mapade asientos configurado
    if ((error as AxiosError).response?.status === 404) {
      return null;
    }
    // Para cualquier otro error, re-lanzarlo para manejo superior
    throw error;
  }
};

/**
 * Verifica si un asiento específico está disponible para compra
 *
 * @param asientoId - ID único del asiento
 * @returns true si el asiento está disponible, false en caso contrario
 *
 * @example
 * ```ts
 * const disponible = await verificarDisponibilidadAsiento('asiento-123');
 * if (disponible) {
 *   // Permitir selección
 * }
 * ```
 *
 * @note Este endpoint es opcional y puede usarse para validación en tiempo real
 */
export const verificarDisponibilidadAsiento = async (asientoId: string): Promise<boolean> => {
  try {
    const response = await apiClient.get<{ disponible: boolean }>(
      `/asientos/${asientoId}/disponible`,
    );
    return response.data.disponible;
  } catch (error) {
    console.error('Error verificando disponibilidad:', error);
    // En caso de error, asumimos que no está disponible por seguridad
    return false;
  }
};
