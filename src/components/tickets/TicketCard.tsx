import { useState } from 'react';
import type { Ticket } from '../../types/ticket.types';
import { downloadTicketPdf, sendTicketEmail } from '../../services/ticketService';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Download, Mail, Calendar, MapPin, QrCode, Check, Loader2 } from 'lucide-react';

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
    } catch {
      // Error manejado internamente por el servicio (console.warn)
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
    } catch {
      setEmailStatus('idle');
    }
  };

  return (
    // ... (resto del JSX igual, sin cambios)
    <Card className="w-full max-w-sm overflow-hidden border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all duration-300 bg-white dark:bg-slate-900">
      <div className="h-2 bg-[#00A651] w-full" />

      <CardHeader className="text-center pb-2">
        <div className="mx-auto bg-green-50 dark:bg-green-900/20 w-12 h-12 rounded-full flex items-center justify-center mb-3">
          <QrCode className="text-[#00A651] h-6 w-6" />
        </div>
        <CardTitle className="text-lg leading-tight text-slate-900 dark:text-white">
          {ticket.nombreEvento}
        </CardTitle>
        <div className="flex justify-center mt-2">
          <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
            #{ticket.codigoAsiento}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex justify-center p-4 bg-slate-50 dark:bg-slate-950 rounded-lg border border-dashed border-slate-200 dark:border-slate-800">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticket.codigoQR}`}
            alt="QR Entrada"
            className="rounded mix-blend-multiply dark:mix-blend-normal dark:opacity-90"
          />
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <Calendar className="w-4 h-4 text-[#F29325] mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-slate-900 dark:text-slate-100">Fecha</p>
              <p className="text-slate-500 dark:text-slate-400">{ticket.fechaEventoFormato}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 text-[#F29325] mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-slate-900 dark:text-slate-100">Ubicación</p>
              <p className="text-slate-500 dark:text-slate-400">{ticket.lugarEvento}</p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center mt-2">
            <span className="text-slate-500 dark:text-slate-400">Asistente:</span>
            <span className="font-medium text-slate-900 dark:text-white">
              {ticket.nombreUsuario}
            </span>
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
              <Loader2 className="w-3 h-3 animate-spin mr-2" />
            ) : (
              <Download className="w-3 h-3 mr-2" />
            )}
            PDF
          </Button>

          <Button
            size="sm"
            onClick={handleEmail}
            disabled={emailStatus !== 'idle'}
            className="w-full text-xs bg-[#00A651] hover:bg-[#008a43] text-white"
          >
            {emailStatus === 'sending' ? (
              <span className="flex items-center">
                <Loader2 className="w-3 h-3 animate-spin mr-2" /> Enviando
              </span>
            ) : emailStatus === 'sent' ? (
              <span className="flex items-center">
                <Check className="w-3 h-3 mr-2" /> Enviado
              </span>
            ) : (
              <span className="flex items-center">
                <Mail className="w-3 h-3 mr-2" /> Email
              </span>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
