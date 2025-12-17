import { apiGet, apiPost, apiPut, apiDelete } from './api';
import type { DatosFiscales } from '../types/checkout.types';

// ============================================================================
// TIPOS - CHECKOUT
// ============================================================================

/**
 * Estructura exacta que espera el backend para cada ítem
 */
export interface ItemCheckout {
  tipo: 'ENTRADA' | 'DONACION';
  referenciaId: number; // Aquí irá el ID numérico del asiento
  cantidad: number; // Será 1 para entradas
  precio: number;
}

export interface CheckoutRequest {
  usuarioId: number;
  items: ItemCheckout[];
  donacionExtra?: number;
  solicitarCertificado: boolean;
  datosFiscalesId?: number;
  emailContacto?: string;
  metodoPago?: string;
}

export interface CheckoutResponse {
  compraId: number;
  urlPago?: string;
  importeTotal: number;
  mensaje: string;
  estado?: string;
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

// Tipos para Validar NIF
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

export async function obtenerDatosFiscalesUsuario(usuarioId: number): Promise<DatosFiscales[]> {
  return apiGet<DatosFiscales[]>(`/perfil/${usuarioId}/datos-fiscales`);
}

export async function obtenerDatosFiscalesPorId(
  id: number,
  usuarioId: number,
): Promise<DatosFiscales> {
  return apiGet<DatosFiscales>(`/perfil/${usuarioId}/datos-fiscales/${id}`);
}

export async function crearDatosFiscales(
  usuarioId: number,
  datos: DatosFiscales,
): Promise<DatosFiscales> {
  return apiPost<DatosFiscales>(`/perfil/${usuarioId}/datos-fiscales`, datos);
}

export async function actualizarDatosFiscales(
  id: number,
  usuarioId: number,
  datos: DatosFiscales,
): Promise<DatosFiscales> {
  return apiPut<DatosFiscales>(`/perfil/${usuarioId}/datos-fiscales/${id}`, datos);
}

export async function eliminarDatosFiscales(id: number, usuarioId: number): Promise<void> {
  return apiDelete(`/perfil/${usuarioId}/datos-fiscales/${id}`);
}

// Endpoint auxiliar (si lo implementaste en el controller)
export async function validarNif(nif: string): Promise<{ valido: boolean; mensaje?: string }> {
  return apiPost('/perfil/validar-nif', { nif }); // Ajusta la ruta si usaste otra
}

// ============================================================================
// UTILIDADES
// ============================================================================

export function calcularTotalCheckout(items: ItemCheckout[], donacionExtra: number = 0): number {
  const subtotal = items.reduce((total, item) => total + item.precio, 0);
  return subtotal + donacionExtra;
}

export function formatearPrecio(precio: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(precio);
}

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

export function validarFormatoNif(nif: string): boolean {
  const regex = /^[0-9]{8}[A-Z]$/i;
  return regex.test(nif);
}
