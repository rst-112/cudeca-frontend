/**
 * DatosFiscales - Información fiscal del usuario
 */
export interface DatosFiscales {
  id?: number;
  nif: string;
  nombreCompleto: string;
  direccion: string;
  ciudad: string;
  codigoPostal: string;
  pais: string;
  alias?: string;
}

export interface AsientoSeleccionado {
  id: string;
  etiqueta: string;
  precio: number;
  zonaId: number;
  zonaNombre?: string;
  tipoEntradaId?: number;
}

export interface ReservaRequest {
  eventoId: number;
  asientoIds: string[];
  solicitarCertificado: boolean;
  datosFiscalesId?: number;
  nuevoDatosFiscales?: DatosFiscales;
}

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

export interface AsientoReserva {
  id: number;
  asientoId: string;
  etiqueta: string;
  precio: number;
  zonaId: number;
}

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

export interface CheckoutSummary {
  asientos: AsientoSeleccionado[];
  subtotal: number;
  comision: number;
  total: number;
}

export interface CompraResponse {
  reservaId: number;
  entradas: Entrada[];
  total: number;
  mensaje: string;
}
