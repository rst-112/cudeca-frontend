/**
 * Servicio de Perfil de Usuario
 * Basado en: /api/perfil
 */

import { apiGet, apiPut, apiClient } from './api';

// ============================================================================
// TIPOS
// ============================================================================

export interface PerfilUsuario {
  id: number;
  email: string;
  nombre: string;
  direccion?: string;
  fechaRegistro: string;
  rol: string;
}

export interface EntradaUsuario {
  id: number;
  eventoNombre: string;
  fechaEvento: string;
  asientoNumero: string;
  estadoEntrada: 'VALIDA' | 'USADA' | 'CANCELADA';
  codigoQR: string;
  fechaEmision: string;
}

export interface Monedero {
  id: number;
  usuarioId: number;
  saldo: number;
  moneda: string;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface MovimientoMonedero {
  id: number;
  monederoId: number;
  tipoMovimiento: 'INGRESO' | 'GASTO';
  monto: number;
  descripcion: string;
  fecha: string;
}

export interface CompraResumen {
  id: string;
  title: string;
  date: string;
  tickets: string;
  total: string;
  status: string;
}

export interface ActualizarPerfilRequest {
  nombre?: string;
  direccion?: string;
}

// ============================================================================
// ENDPOINTS DE PERFIL
// ============================================================================

export async function obtenerPerfilPorId(usuarioId: number): Promise<PerfilUsuario> {
  return apiGet<PerfilUsuario>(`/perfil/${usuarioId}`);
}

export async function obtenerPerfilPorEmail(email: string): Promise<PerfilUsuario> {
  return apiGet<PerfilUsuario>(`/perfil/email/${email}`);
}

export async function actualizarPerfil(
  usuarioId: number,
  datos: ActualizarPerfilRequest,
): Promise<PerfilUsuario> {
  return apiPut<PerfilUsuario>(`/perfil/${usuarioId}`, datos);
}

export async function verificarUsuarioExiste(usuarioId: number): Promise<{ existe: boolean }> {
  return apiGet<{ existe: boolean }>(`/perfil/${usuarioId}/existe`);
}

// ============================================================================
// ENDPOINTS DE ENTRADAS
// ============================================================================

export async function obtenerEntradasUsuario(usuarioId: number): Promise<EntradaUsuario[]> {
  return apiGet<EntradaUsuario[]>(`/perfil/${usuarioId}/entradas`);
}

/**
 * Descargar PDF de entrada
 * Usa apiClient para manejar la autenticación automáticamente.
 */
export async function descargarPdfEntrada(usuarioId: number, entradaId: number): Promise<Blob> {
  const response = await apiClient.get(`/perfil/${usuarioId}/entradas/${entradaId}/pdf`, {
    responseType: 'blob',
  });
  return response.data;
}

/**
 * Generar URL de descarga para una entrada (Uso limitado, prefiere descargarPdfEntrada)
 */
export function generarUrlDescargaPdf(usuarioId: number, entradaId: number): string {
  // Nota: Esto solo funciona si el endpoint público o si se pasa token por query param
  // Si requiere Auth header, es mejor usar descargarPdfEntrada y crear un Blob URL local
  return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'}/perfil/${usuarioId}/entradas/${entradaId}/pdf`;
}

export async function obtenerHistorialCompras(usuarioId: number): Promise<CompraResumen[]> {
  return apiGet<CompraResumen[]>(`/perfil/${usuarioId}/compras`);
}

/**
 * Descargar PDF de Resumen de Compra (Factura + Entradas)
 */
export async function descargarPdfCompra(usuarioId: number, compraId: string): Promise<Blob> {
  const response = await apiClient.get(`/perfil/${usuarioId}/compras/${compraId}/pdf`, {
    responseType: 'blob',
  });
  return response.data;
}

// ============================================================================
// ENDPOINTS DE MONEDERO
// ============================================================================

export async function obtenerMonedero(usuarioId: number): Promise<Monedero> {
  return apiGet<Monedero>(`/perfil/${usuarioId}/monedero`);
}

export async function obtenerMovimientosMonedero(usuarioId: number): Promise<MovimientoMonedero[]> {
  return apiGet<MovimientoMonedero[]>(`/perfil/${usuarioId}/monedero/movimientos`);
}

// ============================================================================
// UTILIDADES
// ============================================================================

export function formatearSaldo(monedero: Monedero): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: monedero.moneda,
  }).format(monedero.saldo);
}

export function obtenerEstadoEntrada(estado: EntradaUsuario['estadoEntrada']): {
  label: string;
  color: string;
} {
  switch (estado) {
    case 'VALIDA':
      return { label: 'Válida', color: 'green' };
    case 'USADA':
      return { label: 'Usada', color: 'gray' };
    case 'CANCELADA':
      return { label: 'Cancelada', color: 'red' };
    default:
      return { label: 'Desconocido', color: 'gray' };
  }
}
