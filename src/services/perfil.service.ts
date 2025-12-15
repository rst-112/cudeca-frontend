/**
 * Servicio de Perfil de Usuario
 *
 * Basado en: /api/perfil
 * Documentación: API-ENDPOINTS.md sección 4
 */

import { apiGet, apiPut } from './api';

// ============================================================================
// TIPOS
// ============================================================================

export interface CompraResumen {
  id: string;
  title: string;
  date: string;
  tickets: string;
  total: string;
  status: string;
}

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

/**
 * Obtener perfil de usuario por ID
 * GET /api/perfil/{usuarioId}
 */
export async function obtenerPerfilPorId(usuarioId: number): Promise<PerfilUsuario> {
  return apiGet<PerfilUsuario>(`/perfil/${usuarioId}`);
}

/**
 * Obtener perfil de usuario por email
 * GET /api/perfil/email/{email}
 */
export async function obtenerPerfilPorEmail(email: string): Promise<PerfilUsuario> {
  return apiGet<PerfilUsuario>(`/perfil/email/${email}`);
}

/**
 * Actualizar perfil de usuario
 * PUT /api/perfil/{usuarioId}
 */
export async function actualizarPerfil(
  usuarioId: number,
  datos: ActualizarPerfilRequest,
): Promise<PerfilUsuario> {
  return apiPut<PerfilUsuario>(`/perfil/${usuarioId}`, datos);
}

/**
 * Verificar si usuario existe
 * GET /api/perfil/{usuarioId}/existe
 */
export async function verificarUsuarioExiste(usuarioId: number): Promise<{ existe: boolean }> {
  return apiGet<{ existe: boolean }>(`/perfil/${usuarioId}/existe`);
}

// ============================================================================
// ENDPOINTS DE ENTRADAS
// ============================================================================

/**
 * Obtener todas las entradas del usuario
 * GET /api/perfil/{usuarioId}/entradas
 */
export async function obtenerEntradasUsuario(usuarioId: number): Promise<EntradaUsuario[]> {
  return apiGet<EntradaUsuario[]>(`/perfil/${usuarioId}/entradas`);
}

/**
 * Descargar PDF de entrada
 * GET /api/perfil/{usuarioId}/entradas/{entradaId}/pdf
 *
 * @returns URL para descargar el PDF
 */
export async function descargarPdfEntrada(usuarioId: number, entradaId: number): Promise<Blob> {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'}/perfil/${usuarioId}/entradas/${entradaId}/pdf`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error('Error al descargar PDF');
  }

  return response.blob();
}

/**
 * Generar URL de descarga para una entrada
 */
export function generarUrlDescargaPdf(usuarioId: number, entradaId: number): string {
  return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'}/perfil/${usuarioId}/entradas/${entradaId}/pdf`;
}

export async function obtenerHistorialCompras(usuarioId: number): Promise<CompraResumen[]> {
  return apiGet<CompraResumen[]>(`/perfil/${usuarioId}/compras`);
}

// ============================================================================
// ENDPOINTS DE MONEDERO
// ============================================================================

/**
 * Obtener monedero del usuario
 * GET /api/perfil/{usuarioId}/monedero
 */
export async function obtenerMonedero(usuarioId: number): Promise<Monedero> {
  return apiGet<Monedero>(`/perfil/${usuarioId}/monedero`);
}

/**
 * Obtener movimientos del monedero
 * GET /api/perfil/{usuarioId}/monedero/movimientos
 */
export async function obtenerMovimientosMonedero(usuarioId: number): Promise<MovimientoMonedero[]> {
  return apiGet<MovimientoMonedero[]>(`/perfil/${usuarioId}/monedero/movimientos`);
}

// ============================================================================
// UTILIDADES
// ============================================================================

/**
 * Formatear saldo del monedero
 */
export function formatearSaldo(monedero: Monedero): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: monedero.moneda,
  }).format(monedero.saldo);
}

/**
 * Obtener estado de entrada con color
 */
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
