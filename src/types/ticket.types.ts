export interface Ticket {
  id: string;
  codigoAsiento: string; // Ej: TKT-2025-001
  nombreEvento: string;
  fechaEventoFormato: string;
  lugarEvento: string;
  nombreUsuario: string;
  codigoQR: string; // Data para generar el QR
}
