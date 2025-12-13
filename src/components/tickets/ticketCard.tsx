import { useState } from 'react';
import type { Ticket } from '../../types';
import { downloadTicketPdf, sendTicketEmail } from '../../services/ticketService';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Download, Mail, Calendar, MapPin, QrCode, Check } from 'lucide-react';

interface TicketCardProps {
  ticket: Ticket;
}

export const TicketCard = ({ ticket }: TicketCardProps) => {
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const handleDownload = async () => {
    setLoadingPdf(true);
    try {
      await downloadTicketPdf(ticket);
    } catch (error) {
      console.error('Error descargando PDF:', error);
    } finally {
      setLoadingPdf(false);
    }
  };

  const handleEmail = async () => {
    setEmailStatus('sending');
    try {
      await sendTicketEmail(ticket);
      setEmailStatus('sent');
      setTimeout(() => setEmailStatus('idle'), 3000);
    } catch (error) {
      console.error('Error enviando email:', error);
      setEmailStatus('idle');
    }
  };

  return (
    <Card className="w-full max-w-sm overflow-hidden border-cudeca-gris-borde/40 hover:shadow-lg transition-all duration-300">
      <div className="h-3 bg-cudeca-verde w-full" />

      <CardHeader className="text-center pb-2">
        <div className="mx-auto bg-green-50 w-10 h-10 rounded-full flex items-center justify-center mb-2">
          <QrCode className="text-cudeca-verde h-5 w-5" />
        </div>
        <CardTitle className="text-lg leading-tight">{ticket.nombreEvento}</CardTitle>
        <span className="text-xs font-mono text-cudeca-gris-texto bg-gray-100 px-2 py-1 rounded inline-block mt-2">
          #{ticket.codigoAsiento}
        </span>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex justify-center p-4 bg-gray-50 rounded-lg border border-dashed border-gray-200">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticket.codigoQR}`}
            alt="Código QR Entrada"
            className="mix-blend-multiply opacity-90 rounded"
          />
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <Calendar className="w-4 h-4 text-cudeca-naranja mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-gray-900">Fecha</p>
              <p className="text-cudeca-gris-texto">{ticket.fechaEventoFormato}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 text-cudeca-naranja mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-gray-900">Ubicación</p>
              <p className="text-cudeca-gris-texto">{ticket.lugarEvento}</p>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 flex justify-between items-center mt-2">
            <span className="text-cudeca-gris-texto">Asistente:</span>
            <span className="font-medium text-gray-900">{ticket.nombreUsuario}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            disabled={loadingPdf}
            className="w-full text-xs"
          >
            {loadingPdf ? (
              'Generando...'
            ) : (
              <>
                <Download className="w-3 h-3 mr-2" /> PDF
              </>
            )}
          </Button>

          <Button
            size="sm"
            onClick={handleEmail}
            disabled={emailStatus !== 'idle'}
            className="w-full text-xs bg-cudeca-verde hover:bg-cudeca-verde-dark text-white"
          >
            {emailStatus === 'sending' ? (
              'Enviando...'
            ) : emailStatus === 'sent' ? (
              <>
                <Check className="w-3 h-3 mr-2" /> Enviado
              </>
            ) : (
              <>
                <Mail className="w-3 h-3 mr-2" /> Email
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
