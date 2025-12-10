export interface Ticket {
  id: string;
  evento: string;
  fecha: string;
  lugar: string;
  asistente: string;
  asiento?: string; // Opcional (por si es entrada general de pie)
  qrData: string; // El texto que contendrá el QR
}
