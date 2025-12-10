// src/services/ticketService.ts

/**
 * Servicio para gestionar la comunicación con el Motor PDF y Emailing del Backend.
 */

// 1. Simulación de descarga de PDF (Requisito: Motor PDF)
export const downloadTicketPdf = async (ticketId: string, eventName: string): Promise<void> => {
  console.log(`[Motor PDF] Iniciando generación para ticket: ${ticketId}`);

  // Simulamos el tiempo de espera del servidor
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // --- MOCK: Generamos un PDF falso en el navegador para probar la descarga ---
  const dummyContent = `ENTRADA DIGITAL CUDECA\nEvento: ${eventName}\nRef: ${ticketId}\n\n(Este archivo es una simulación del PDF que generará Java)`;
  const blob = new Blob([dummyContent], { type: 'application/pdf' });

  // Forzar descarga en el navegador
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `Entrada_Cudeca_${ticketId}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.parentNode?.removeChild(link);
};

// 2. Simulación de envío de Email (Requisito: Emailing)
export const sendTicketEmail = async (ticketId: string): Promise<boolean> => {
  console.log(`[Emailing] Solicitando envío por correo para ticket: ${ticketId}`);

  // Simulamos llamada al EmailController.java
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return true;
};
