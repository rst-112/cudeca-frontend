import api from '../lib/axios';

export interface QrValidacionRequest {
  codigoQR: string;
  dispositivoId: string;
  usuarioValidadorId: number;
}

export interface QrValidacionResponse {
  estado: string;
  mensaje: string;
  entradaId?: number;
  codigoQR: string;
  estadoAnterior?: string;
  estadoActual?: string;
  timestamp: number;
}

export const qrService = {
  /**
   * Valida un código QR de entrada y cambia su estado de VALIDA a USADA
   */
  validarTicket: async (
    codigoQR: string,
    dispositivoId: string,
    usuarioValidadorId: number,
  ): Promise<QrValidacionResponse> => {
    const response = await api.post<QrValidacionResponse>('/validador-qr/validar', {
      codigoQR,
      dispositivoId,
      usuarioValidadorId,
    });
    return response.data;
  },

  /**
   * Consulta información de una entrada sin cambiar su estado
   */
  consultarEntrada: async (codigoQR: string): Promise<QrValidacionResponse> => {
    const response = await api.get<QrValidacionResponse>(`/validador-qr/consultar/${codigoQR}`);
    return response.data;
  },
};
