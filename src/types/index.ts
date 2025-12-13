export interface Ticket {
  id: string; // Identificador único (UUID o similar)
  codigoAsiento: string; // Código legible para mostrar (ej: TKT-001)
  nombreEvento: string;
  fechaEventoFormato: string;
  lugarEvento: string;
  nombreUsuario: string;
  codigoQR: string;
}
