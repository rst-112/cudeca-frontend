/**
 * Barrel Export - Servicios
 *
 * Exporta todos los servicios del frontend para fácil importación
 *
 * @example
 * ```ts
 * import { authService, procesarCheckout, obtenerPerfilPorId } from '@/services';
 * ```
 */

// ============================================================================
// SERVICIOS BASE
// ============================================================================

export * from './api';
export * from './auth.service';
export * from './checkout.service';
export * from './perfil.service';
export * from './public.service';

// ============================================================================
// RE-EXPORTS PARA COMPATIBILIDAD
// ============================================================================

// Exportar el authService como default también
export { authService } from './auth.service';
