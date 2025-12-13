import { jsPDF } from 'jspdf';
import type { Ticket } from '../types';

// Helper: Convertir URL de imagen a Base64 para el PDF
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

// 1. DESCARGAR PDF
export const downloadTicketPdf = async (ticketData: Ticket): Promise<void> => {
  try {
    console.log('[Motor PDF] Solicitando descarga de PDF...');

    const response = await fetch('http://localhost:8080/api/tickets/descargar-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ticketData),
      credentials: 'include', // Importante para CORS
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const blob = await response.blob();

    // Crear descarga en el navegador
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Entrada_Cudeca_${ticketData.codigoAsiento}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);

    console.log('PDF descargado correctamente');
  } catch (error) {
    console.warn(
      'Backend no disponible, usando MOCK mejorado (simulación local) con jsPDF:',
      error,
    );

    // --- MOCK SIMULATION (jsPDF Completo) ---
    // Cargar QR
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticketData.codigoQR}`;
    const qrBase64 = await getBase64ImageFromUrl(qrUrl);

    const doc = new jsPDF();

    // === CABECERA ===
    // Fondo verde cabecera
    doc.setFillColor(0, 166, 81); // Verde Cudeca
    doc.rect(0, 0, 210, 40, 'F');

    doc.setFontSize(26);
    doc.setTextColor(255, 255, 255);
    doc.text('ENTRADA DIGITAL', 20, 25);
    doc.setFontSize(12);
    doc.text('Fundación Cudeca', 150, 25);

    // === DETALLES DEL EVENTO ===
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.text(ticketData.nombreEvento, 20, 60);

    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);

    doc.setFont('helvetica', 'bold');
    doc.text('FECHA:', 20, 80);
    doc.setFont('helvetica', 'normal');
    doc.text(ticketData.fechaEventoFormato, 50, 80);

    doc.setFont('helvetica', 'bold');
    doc.text('LUGAR:', 20, 90);
    doc.setFont('helvetica', 'normal');
    doc.text(ticketData.lugarEvento, 50, 90);

    // Línea separadora
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 105, 190, 105);

    // === DETALLES ASISTENTE Y QR ===
    doc.setFontSize(14);
    doc.setTextColor(0, 166, 81);
    doc.text('Información del Asistente', 20, 120);

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);

    doc.setFont('helvetica', 'bold');
    doc.text('Nombre:', 20, 135);
    doc.setFont('helvetica', 'normal');
    doc.text(ticketData.nombreUsuario, 60, 135);

    doc.setFont('helvetica', 'bold');
    doc.text('Ref. Entrada:', 20, 145);
    doc.setFont('helvetica', 'normal');
    doc.text(ticketData.codigoAsiento, 60, 145);

    doc.setFont('helvetica', 'bold');
    doc.text('ID Transacción:', 20, 155);
    doc.setFont('helvetica', 'normal');
    doc.text(ticketData.id, 60, 155);

    // === CÓDIGO QR ===
    if (qrBase64) {
      doc.addImage(qrBase64, 'PNG', 130, 120, 50, 50);
      doc.setFontSize(9);
      doc.text('Escanea este código', 135, 175);
    } else {
      // Placeholder si falla la imagen
      doc.rect(130, 120, 50, 50);
      doc.text('QR No disponible', 135, 145);
    }

    // === PIE DE PÁGINA ===
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text('Gracias por colaborar con la Fundación Cudeca.', 20, 270);
    doc.text('Cuidamos al final de la vida. Añadimos vida a los días.', 20, 275);
    doc.text(`Generado el: ${new Date().toLocaleDateString()}`, 150, 280);

    doc.save(`Entrada_Cudeca_${ticketData.codigoAsiento}_FULL.pdf`);
  }
};

// 2. GENERAR Y ENVIAR POR CORREO
export const sendTicketEmail = async (ticketData: Ticket): Promise<boolean> => {
  try {
    console.log('[Emailing] Solicitando generación y envío de ticket...');

    const payload = {
      ...ticketData,
      sender: 'frangalisteo1@gmail.com', // REMITENTE SOLICITADO
    };

    const response = await fetch('http://localhost:8080/api/tickets/generar-y-enviar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      credentials: 'include',
    });

    const data = await response.json();

    if (response.ok && data.status === 'success') {
      console.log('Ticket enviado correctamente desde ' + payload.sender);
      return true;
    } else {
      console.error('Error del servidor:', data.message);
      return false;
    }
  } catch (error) {
    console.warn('Backend no disponible. Simulación de envío de email activada.', error);

    // --- MOCK SIMULATION ---
    // Simulamos que se envía usando el remitente solicitado
    console.log(`[SIMULACIÓN] Enviando email...`);
    console.log(`   Remitente: myexample@gmail.com`);
    console.log(`   Asunto: Tu Entrada para ${ticketData.nombreEvento}`);
    console.log(`   Destinatario: (Usuario propietario del ticket)`);

    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simular espera de red

    console.log('Ticket enviado (Simulado exitosamente)');
    return true;
  }
};
