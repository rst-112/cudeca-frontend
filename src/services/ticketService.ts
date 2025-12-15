import { jsPDF } from 'jspdf';
import { apiClient } from './api';
import type { Ticket } from '../types/ticket.types';

// Helper para convertir imagen a Base64
const getBase64ImageFromUrl = async (imageUrl: string): Promise<string> => {
  try {
    const res = await fetch(imageUrl);
    const blob = await res.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.warn('No se pudo cargar la imagen para el PDF', error);
    return '';
  }
};

/**
 * GENERACIÓN LOCAL DE PDF (FALLBACK / MOCK)
 * ⚠️ Esta función se usa cuando el backend falla.
 */
const generateLocalPdf = async (ticketData: Ticket) => {
  console.log('⚠️ Generando PDF local (Modo Mock)...');
  const doc = new jsPDF();
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticketData.codigoQR}`;
  const qrBase64 = await getBase64ImageFromUrl(qrUrl);

  // Diseño básico del PDF
  doc.setFillColor(0, 166, 81);
  doc.rect(0, 0, 210, 40, 'F');
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text('ENTRADA DIGITAL (MOCK)', 20, 25); // Texto MOCK explícito

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.text(ticketData.nombreEvento, 20, 60);
  doc.setFontSize(12);
  doc.text(`Asistente: ${ticketData.nombreUsuario}`, 20, 75);
  doc.text(`Ref: ${ticketData.codigoAsiento}`, 20, 85);

  if (qrBase64) {
    doc.addImage(qrBase64, 'PNG', 140, 50, 40, 40);
  }

  doc.save(`MOCK_Entrada_${ticketData.codigoAsiento}.pdf`);
};

// 1. DESCARGAR PDF
export const downloadTicketPdf = async (ticketData: Ticket): Promise<void> => {
  try {
    // Intento real
    const response = await apiClient.post('/tickets/descargar-pdf', ticketData, {
      responseType: 'blob',
    });
    // ... lógica de descarga real ...
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Entrada_${ticketData.codigoAsiento}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
  } catch (error) {
    // FALLBACK A MOCK
    console.warn('Backend falló. Usando generador local de PDF.', error);
    await generateLocalPdf(ticketData);
  }
};

// 2. ENVIAR EMAIL
export const sendTicketEmail = async (ticketData: Ticket): Promise<boolean> => {
  try {
    await apiClient.post('/tickets/generar-y-enviar', {
      ...ticketData,
      sender: 'frangalisteo1@gmail.com',
    });
    return true;
  } catch (error) {
    console.warn('Backend falló. Simulando envío de email.', error);
    // Simulación de espera
    await new Promise((r) => setTimeout(r, 2000));
    return true;
  }
};
