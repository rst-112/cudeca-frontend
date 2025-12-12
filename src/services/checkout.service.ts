/**
 * Servicio de Checkout y Datos Fiscales
 *
 * Basado en:
 * - /api/checkout (Sección 2 de API-ENDPOINTS.md)
 * - /api/datos-fiscales (Sección 3 de API-ENDPOINTS.md)
 */

import { apiGet, apiPost, apiPut, apiDelete } from './api';
import type { DatosFiscales } from '../types/checkout.types';

// ============================================================================
// TIPOS - CHECKOUT
// ============================================================================

export interface ItemCheckout {
  asientoId: number;
  precio: number;
}

export interface CheckoutRequest {
  usuarioId: number;
  items: ItemCheckout[];
  donacionExtra?: number;
  solicitarCertificado: boolean;
  datosFiscalesId?: number;
}

export interface CheckoutResponse {
  compraId: number;
  urlPago: string;
  importeTotal: number;
  mensaje: string;
}

export interface DetallesCompra {
  compraId: number;
  usuarioId: number;
  importeTotal: number;
  estadoCompra: 'PENDIENTE' | 'COMPLETADO' | 'CANCELADO' | 'FALLIDO';
  fechaCompra: string;
  items: ItemCheckout[];
}

export interface ConfirmarPagoRequest {
  transaccionId: string;
  estado: 'COMPLETADO' | 'FALLIDO';
}

export interface ConfirmarPagoResponse {
  success: boolean;
  message: string;
  compraId: number;
}

export interface CancelarCompraRequest {
  motivo: string;
}

export interface CancelarCompraResponse {
  success: boolean;
  message: string;
  compraId: number;
}

// ============================================================================
// TIPOS - DATOS FISCALES
// ============================================================================
// DatosFiscales se importa desde checkout.types.ts para evitar duplicación

export interface ValidarNifRequest {
  nif: string;
}

export interface ValidarNifResponse {
  valido: boolean;
  mensaje: string;
}

export interface EliminarDatosFiscalesResponse {
  success: boolean;
  message: string;
}

// ============================================================================
// ENDPOINTS DE CHECKOUT
// ============================================================================

/**
 * Procesar Checkout (Crear Compra)
 * POST /api/checkout
 */
export async function procesarCheckout(request: CheckoutRequest): Promise<CheckoutResponse> {
  return apiPost<CheckoutResponse>('/checkout', request);
}

/**
 * Obtener Detalles de Compra
 * GET /api/checkout/{compraId}
 */
export async function obtenerDetallesCompra(compraId: number): Promise<DetallesCompra> {
  return apiGet<DetallesCompra>(`/checkout/${compraId}`);
}

/**
 * Confirmar Pago (Webhook)
 * POST /api/checkout/{compraId}/confirmar
 */
export async function confirmarPago(
  compraId: number,
  datos: ConfirmarPagoRequest,
): Promise<ConfirmarPagoResponse> {
  return apiPost<ConfirmarPagoResponse>(`/checkout/${compraId}/confirmar`, datos);
}

/**
 * Cancelar Compra
 * POST /api/checkout/{compraId}/cancelar
 */
export async function cancelarCompra(
  compraId: number,
  datos: CancelarCompraRequest,
): Promise<CancelarCompraResponse> {
  return apiPost<CancelarCompraResponse>(`/checkout/${compraId}/cancelar`, datos);
}

// ============================================================================
// ENDPOINTS DE DATOS FISCALES
// ============================================================================

/**
 * Obtener Datos Fiscales del Usuario
 * GET /api/datos-fiscales/usuario/{usuarioId}
 */
export async function obtenerDatosFiscalesUsuario(usuarioId: number): Promise<DatosFiscales[]> {
  return apiGet<DatosFiscales[]>(`/datos-fiscales/usuario/${usuarioId}`);
}

/**
 * Obtener Datos Fiscales por ID
 * GET /api/datos-fiscales/{id}?usuarioId={usuarioId}
 */
export async function obtenerDatosFiscalesPorId(
  id: number,
  usuarioId: number,
): Promise<DatosFiscales> {
  return apiGet<DatosFiscales>(`/datos-fiscales/${id}?usuarioId=${usuarioId}`);
}

/**
 * Crear Datos Fiscales
 * POST /api/datos-fiscales/usuario/{usuarioId}
 */
export async function crearDatosFiscales(
  usuarioId: number,
  datos: Omit<DatosFiscales, 'id' | 'usuarioId'>,
): Promise<DatosFiscales> {
  return apiPost<DatosFiscales>(`/datos-fiscales/usuario/${usuarioId}`, datos);
}

/**
 * Actualizar Datos Fiscales
 * PUT /api/datos-fiscales/{id}?usuarioId={usuarioId}
 */
export async function actualizarDatosFiscales(
  id: number,
  usuarioId: number,
  datos: Partial<Omit<DatosFiscales, 'id' | 'usuarioId'>>,
): Promise<DatosFiscales> {
  return apiPut<DatosFiscales>(`/datos-fiscales/${id}?usuarioId=${usuarioId}`, datos);
}

/**
 * Eliminar Datos Fiscales
 * DELETE /api/datos-fiscales/{id}?usuarioId={usuarioId}
 */
export async function eliminarDatosFiscales(
  id: number,
  usuarioId: number,
): Promise<EliminarDatosFiscalesResponse> {
  return apiDelete<EliminarDatosFiscalesResponse>(`/datos-fiscales/${id}?usuarioId=${usuarioId}`);
}

/**
 * Validar NIF
 * POST /api/datos-fiscales/validar-nif
 */
export async function validarNif(nif: string): Promise<ValidarNifResponse> {
  return apiPost<ValidarNifResponse>('/datos-fiscales/validar-nif', { nif });
}

// ============================================================================
// UTILIDADES
// ============================================================================

/**
 * Calcular total del checkout
 */
export function calcularTotalCheckout(items: ItemCheckout[], donacionExtra: number = 0): number {
  const subtotal = items.reduce((total, item) => total + item.precio, 0);
  return subtotal + donacionExtra;
}

/**
 * Formatear precio
 */
export function formatearPrecio(precio: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(precio);
}

/**
 * Obtener estado de compra con color
 */
export function obtenerEstadoCompra(estado: DetallesCompra['estadoCompra']): {
  label: string;
  color: string;
} {
  switch (estado) {
    case 'PENDIENTE':
      return { label: 'Pendiente', color: 'yellow' };
    case 'COMPLETADO':
      return { label: 'Completado', color: 'green' };
    case 'CANCELADO':
      return { label: 'Cancelado', color: 'red' };
    case 'FALLIDO':
      return { label: 'Fallido', color: 'red' };
    default:
      return { label: 'Desconocido', color: 'gray' };
  }
}

/**
 * Validar formato de NIF español (básico)
 */
export function validarFormatoNif(nif: string): boolean {
  // Formato: 8 dígitos + 1 letra (ej: 12345678A)
  const regex = /^[0-9]{8}[A-Z]$/i;
  return regex.test(nif);
}
