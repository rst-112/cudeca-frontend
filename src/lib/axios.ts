/**
 * lib/axios.ts - Alias para el cliente de API
 *
 * Este archivo re-exporta el cliente de Axios configurado desde services/api.ts
 * para mantener compatibilidad con diferentes patrones de importación.
 *
 * USO:
 * ```ts
 * import axiosInstance from '@/lib/axios';
 * // o
 * import { apiClient } from '@/services/api';
 * ```
 */

export { apiClient as default, apiClient } from '../services/api';
