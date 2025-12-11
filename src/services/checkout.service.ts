/**
 * Servicio para gestión de checkout y compras
 */

import { apiGet, apiPost, apiPut, apiDelete } from './api';
import type {
  ReservaRequest,
  Reserva,
  CompraResponse,
  DatosFiscales,
  Entrada,
} from '../types/checkout.types';

const CHECKOUT_BASE = '/reservas';
const DATOS_FISCALES_BASE = '/usuarios/datos-fiscales';
const ENTRADAS_BASE = '/entradas';

// ============================================================================
// RESERVAS
// ============================================================================

/**
 * Crear una nueva reserva (bloqueo de asientos)
 */
export async function crearReserva(request: ReservaRequest): Promise<Reserva> {
  return apiPost<Reserva>(CHECKOUT_BASE, request);
}

/**
 * Obtener una reserva por ID
 */
export async function obtenerReserva(reservaId: number): Promise<Reserva> {
  return apiGet<Reserva>(`${CHECKOUT_BASE}/${reservaId}`);
}

/**
 * Confirmar una reserva (convertir a entrada)
 */
export async function confirmarReserva(reservaId: number): Promise<CompraResponse> {
  return apiPost<CompraResponse>(`${CHECKOUT_BASE}/${reservaId}/confirmar`, {});
}

/**
 * Cancelar una reserva
 */
export async function cancelarReserva(reservaId: number): Promise<void> {
  return apiDelete<void>(`${CHECKOUT_BASE}/${reservaId}`);
}

/**
 * Obtener mis reservas activas
 */
export async function obtenerMisReservas(): Promise<Reserva[]> {
  return apiGet<Reserva[]>(`${CHECKOUT_BASE}/mis-reservas`);
}

// ============================================================================
// DATOS FISCALES
// ============================================================================

/**
 * Obtener todos los datos fiscales del usuario
 */
export async function obtenerDatosFiscales(): Promise<DatosFiscales[]> {
  return apiGet<DatosFiscales[]>(DATOS_FISCALES_BASE);
}

/**
 * Obtener datos fiscales por ID
 */
export async function obtenerDatosFiscalesById(id: number): Promise<DatosFiscales> {
  return apiGet<DatosFiscales>(`${DATOS_FISCALES_BASE}/${id}`);
}

/**
 * Crear nuevos datos fiscales
 */
export async function crearDatosFiscales(datos: DatosFiscales): Promise<DatosFiscales> {
  return apiPost<DatosFiscales>(DATOS_FISCALES_BASE, datos);
}

/**
 * Actualizar datos fiscales existentes
 */
export async function actualizarDatosFiscales(
  id: number,
  datos: DatosFiscales,
): Promise<DatosFiscales> {
  return apiPut<DatosFiscales>(`${DATOS_FISCALES_BASE}/${id}`, datos);
}

/**
 * Eliminar datos fiscales
 */
export async function eliminarDatosFiscales(id: number): Promise<void> {
  return apiDelete<void>(`${DATOS_FISCALES_BASE}/${id}`);
}

/**
 * Establecer datos fiscales como principal
 */
export async function establecerDatosFiscalesPrincipal(id: number): Promise<DatosFiscales> {
  return apiPut<DatosFiscales>(`${DATOS_FISCALES_BASE}/${id}/principal`, {});
}

// ============================================================================
// ENTRADAS
// ============================================================================

/**
 * Obtener mis entradas
 */
export async function obtenerMisEntradas(): Promise<Entrada[]> {
  return apiGet<Entrada[]>(`${ENTRADAS_BASE}/mis-entradas`);
}

/**
 * Obtener una entrada por ID
 */
export async function obtenerEntradaById(id: number): Promise<Entrada> {
  return apiGet<Entrada>(`${ENTRADAS_BASE}/${id}`);
}

/**
 * Descargar PDF de una entrada
 */
export async function descargarPdfEntrada(entradaId: number): Promise<string> {
  // Por ahora devuelve una URL simulada
  // En producción, esto devolvería la URL real del PDF generado por el backend
  return Promise.resolve(`/api/entradas/${entradaId}/pdf`);
}

/**
 * Validar entrada con QR
 */
export async function validarEntrada(codigo: string): Promise<Entrada> {
  return apiPost<Entrada>(`${ENTRADAS_BASE}/validar`, { codigo });
}

