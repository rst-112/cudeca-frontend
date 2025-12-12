/**
 * Servicio de Endpoints Públicos
 *
 * Basado en: /api/public (Sección 5 de API-ENDPOINTS.md)
 *
 * Endpoints sin autenticación para testing y salud del sistema
 */

import { apiGet } from './api';

// ============================================================================
// TIPOS
// ============================================================================

export interface TestResponse {
  message: string;
}

export interface EmailTestResponse {
  status: string;
  message: string;
}

// ============================================================================
// ENDPOINTS PÚBLICOS
// ============================================================================

/**
 * Test de Conexión con el Backend
 * GET /api/public/test
 *
 * @returns Mensaje de confirmación de conexión
 *
 * @example
 * ```ts
 * const response = await testConexion();
 * console.log(response.message); // "Conexión correcta con el backend CUDECA"
 * ```
 */
export async function testConexion(): Promise<TestResponse> {
  return apiGet<TestResponse>('/public/test');
}

/**
 * Enviar Email de Prueba
 * GET /api/public/send-test-email?to={email}
 *
 * @param email - Dirección de email de destino
 * @returns Confirmación del envío
 *
 * @example
 * ```ts
 * const response = await enviarEmailPrueba('test@cudeca.org');
 * console.log(response.message); // "Correo de prueba enviado a test@cudeca.org"
 * ```
 */
export async function enviarEmailPrueba(email: string): Promise<EmailTestResponse> {
  return apiGet<EmailTestResponse>(`/public/send-test-email?to=${encodeURIComponent(email)}`);
}

// ============================================================================
// UTILIDADES
// ============================================================================

/**
 * Verificar si el backend está disponible
 *
 * @returns true si el backend responde correctamente
 */
export async function verificarBackendDisponible(): Promise<boolean> {
  try {
    const response = await testConexion();
    return response.message === 'Conexión correcta con el backend CUDECA';
  } catch (error) {
    console.error('Backend no disponible:', error);
    return false;
  }
}

