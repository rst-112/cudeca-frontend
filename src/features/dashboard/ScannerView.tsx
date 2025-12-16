import { Info } from 'lucide-react';
import QrReaderComponent from '../../components/QrReaderComponent';

export default function ScannerView() {
  return (
    <div className="max-w-lg mx-auto animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 p-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-lg shrink-0">
            <Info className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h3 className="font-semibold text-amber-800 dark:text-amber-300 mb-1">
              Instrucciones de uso
            </h3>
            <p className="text-sm text-amber-700 dark:text-amber-400">
              Apunta la cámara hacia el código QR de la entrada del asistente. El sistema validará
              automáticamente la entrada.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Cámara activa
              </span>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded-full">
              Modo Staff
            </span>
          </div>
        </div>
        <div className="p-4">
          <QrReaderComponent />
        </div>
      </div>
    </div>
  );
}
