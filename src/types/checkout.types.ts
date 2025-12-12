/**
 * Tipos relacionados con el checkout y compra de entradas
 */

/**
 * DatosFiscales - Información fiscal del usuario
 * Debe coincidir exactamente con el tipo en checkout.service.ts
 */
export interface DatosFiscales {
  id?: number;
  usuarioId?: number;
  nombre: string;
  nif: string;
  direccion: string;
  ciudad: string;
  codigoPostal: string;
  pais: string;
  esPrincipal?: boolean;
}

/**
 * AsientoSeleccionado - Asiento seleccionado para compra
 */
export interface AsientoSeleccionado {
  id: string;
  etiqueta: string;
  precio: number;
  zonaId: number;
  zonaNombre?: string;
  tipoEntradaId?: number;
}

/**
 * ReservaRequest - Datos para crear una reserva
 */
export interface ReservaRequest {
  eventoId: number;
  asientoIds: string[];
  solicitarCertificado: boolean;
  datosFiscalesId?: number;
  nuevoDatosFiscales?: DatosFiscales;
}

/**
 * Reserva - Respuesta del backend con la reserva creada
 */
export interface Reserva {
  id: number;
  usuarioId: number;
  eventoId: number;
  estadoReserva: 'PENDIENTE' | 'CONFIRMADA' | 'CANCELADA' | 'EXPIRADA';
  fechaReserva: string;
  fechaExpiracion: string;
  total: number;
  asientos: AsientoReserva[];
}

/**
 * AsientoReserva - Información de un asiento en la reserva
 */
export interface AsientoReserva {
  id: number;
  asientoId: string;
  etiqueta: string;
  precio: number;
  zonaId: number;
}

/**
 * Entrada - Entrada confirmada/comprada
 * Compatible con EntradaUsuario del servicio de perfil
 */
export interface Entrada {
  id: number;
  codigo?: string;
  eventoId?: number;
  eventoNombre: string;
  eventoFecha?: string;
  fechaEvento: string;
  asientoId?: string;
  asientoEtiqueta?: string;
  asientoNumero: string;
  zonaNombre?: string;
  precio?: number;
  estadoEntrada: 'VALIDA' | 'USADA' | 'CANCELADA';
  fechaCompra?: string;
  fechaEmision: string;
  qrCode?: string;
  codigoQR: string;
  pdfUrl?: string;
}

/**
 * CheckoutSummary - Resumen del checkout
 */
export interface CheckoutSummary {
  asientos: AsientoSeleccionado[];
  subtotal: number;
  comision: number;
  total: number;
}

/**
 * CompraResponse - Respuesta después de confirmar la compra
 */
export interface CompraResponse {
  reservaId: number;
  entradas: Entrada[];
  total: number;
  mensaje: string;
}
