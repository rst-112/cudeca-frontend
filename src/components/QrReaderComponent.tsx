import React, { useState, useCallback, useEffect } from 'react';
import { Scanner, type IDetectedBarcode } from '@yudiel/react-qr-scanner';
import { toast } from 'sonner';
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  Camera,
  Loader2,
  AlertCircle,
  UserX,
} from 'lucide-react';
import { qrService, type QrValidacionResponse } from '../services/qr.service';
import { useAuth } from '../context/AuthContext';

type ScanStatus = 'scanning' | 'processing' | 'success' | 'error';

interface ScanResult {
  status: ScanStatus;
  message: string;
  data?: string;
  response?: QrValidacionResponse;
}

const QrReaderComponent: React.FC = () => {
  const { user } = useAuth();
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isPaused, setIsPaused] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [dispositivoId, setDispositivoId] = useState<string>('');

  // Generar ID único del dispositivo al montar el componente
  useEffect(() => {
    const generarDispositivoId = () => {
      const stored = localStorage.getItem('dispositivo_escaner_id');
      if (stored) {
        return stored;
      }

      const nuevoId = `SCANNER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('dispositivo_escaner_id', nuevoId);
      return nuevoId;
    };

    setDispositivoId(generarDispositivoId());
  }, []);

  const handleScan = useCallback(
    async (detectedCodes: IDetectedBarcode[]) => {
      if (detectedCodes.length > 0) {
        const rawValue = detectedCodes[0].rawValue;

        if (rawValue && rawValue !== scanResult?.data && !isProcessing) {
          setIsPaused(true);
          setIsProcessing(true);

          // Validar que tengamos el usuario autenticado
          if (!user?.id) {
            toast.error('Error de autenticación', {
              description: 'No se encontró el usuario autenticado',
              duration: 4000,
            });
            setIsProcessing(false);
            setIsPaused(false);
            return;
          }

          // Validar que el usuario tenga permisos de staff
          const isStaff =
            user?.roles?.includes('PERSONAL_EVENTO') || user?.rol === 'PERSONAL_EVENTO';
          if (!isStaff) {
            toast.error('Permisos insuficientes', {
              description: 'Solo el personal de evento puede validar entradas',
              duration: 4000,
            });
            setIsProcessing(false);
            setIsPaused(false);
            return;
          }

          try {
            const response = await qrService.validarTicket(rawValue, dispositivoId, user.id);

            if (response.estado === 'OK') {
              setScanResult({
                status: 'success',
                message: 'Acceso Autorizado',
                data: rawValue,
                response,
              });
              toast.success('Entrada válida', {
                description: `Estado: ${response.estadoAnterior} → ${response.estadoActual}`,
                duration: 3000,
              });
            } else {
              // Manejar diferentes tipos de error
              let errorMessage = 'Acceso Denegado';

              switch (response.estado) {
                case 'ERROR_YA_USADA':
                  errorMessage = 'Entrada Ya Usada';
                  break;
                case 'ERROR_ANULADA':
                  errorMessage = 'Entrada Anulada';
                  break;
                case 'ERROR_NO_ENCONTRADO':
                  errorMessage = 'Entrada No Encontrada';
                  break;
              }

              setScanResult({
                status: 'error',
                message: errorMessage,
                data: rawValue,
                response,
              });

              toast.error(errorMessage, {
                description: response.mensaje,
                duration: 4000,
              });
            }
          } catch (error) {
            console.error('Error al validar:', error);

            setScanResult({
              status: 'error',
              message: 'Error de Conexión',
              data: rawValue,
            });

            const errorMsg =
              (error as { response?: { data?: { mensaje?: string } } }).response?.data?.mensaje ||
              'No se pudo conectar con el servidor';
            toast.error('Error al validar entrada', {
              description: errorMsg,
              duration: 5000,
            });
          } finally {
            setIsProcessing(false);
          }
        }
      }
    },
    [scanResult, isProcessing, dispositivoId, user],
  );

  const handleError = useCallback((error: unknown) => {
    console.error('Scanner Error:', error);
    toast.error('Error de cámara', {
      id: 'camera-error',
      description: 'Verifica los permisos de cámara.',
    });
  }, []);

  const startScanning = () => {
    if (!canScan) {
      toast.error('Acceso denegado', {
        description: 'Solo el personal autorizado puede usar el escáner',
      });
      return;
    }

    setIsReady(true);
    setIsPaused(false);
    setScanResult(null);
  };

  const resetScan = () => {
    setScanResult(null);
    setIsProcessing(false);
    setIsPaused(false);
  };

  // Verificar si el usuario tiene permisos para escanear
  const canScan =
    user && (user.roles?.includes('PERSONAL_EVENTO') || user.rol === 'PERSONAL_EVENTO');

  // Si no está autenticado o no tiene permisos
  if (!canScan) {
    return (
      <div className="flex flex-col items-center w-full gap-4 max-w-md mx-auto py-6 md:py-0">
        <div className="w-full aspect-square relative rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-950 shadow-2xl ring-1 ring-slate-200 dark:ring-slate-900/5">
          <div className="absolute inset-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm flex flex-col items-center justify-center text-slate-900 dark:text-white z-30 p-6 rounded-xl">
            <div className="bg-red-100 dark:bg-red-900/30 p-6 rounded-full mb-6 ring-4 ring-red-200 dark:ring-red-800/50">
              <UserX className="w-16 h-16 text-red-500" strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-center">Acceso Restringido</h3>
            <p className="text-slate-600 dark:text-slate-300 text-center max-w-xs leading-relaxed">
              Solo el personal autorizado puede acceder al escáner de entradas.
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">
              Rol actual: {user?.rol || 'No autenticado'}
            </p>
            {user?.roles && user.roles.length > 0 && (
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                Roles: {user.roles.join(', ')}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full gap-4 max-w-md mx-auto py-6 md:py-0">
      <div className="w-full aspect-square relative rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-950 shadow-2xl ring-1 ring-slate-200 dark:ring-slate-900/5">
        <Scanner
          onScan={handleScan}
          onError={handleError}
          paused={isPaused}
          scanDelay={500}
          sound={false}
          components={{
            finder: false,
            onOff: false,
            torch: false,
            zoom: false,
          }}
          constraints={{
            facingMode: 'environment',
            aspectRatio: 1,
          }}
          styles={{
            container: { width: '100%', height: '100%', borderRadius: '0.75rem' },
            video: { objectFit: 'cover', borderRadius: '0.75rem' },
          }}
        />

        {/* Estado Inicial */}
        {!isReady && !scanResult && !isProcessing && (
          <div className="absolute inset-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm flex flex-col items-center justify-center text-slate-900 dark:text-white z-30 p-6 rounded-xl">
            <div className="bg-slate-100 dark:bg-slate-800/50 p-4 md:p-6 rounded-full mb-4 md:mb-6 ring-4 ring-slate-200 dark:ring-slate-600/50 transition-all">
              <Camera
                className="w-12 h-12 md:w-20 md:h-20 text-amber-500 transition-all"
                strokeWidth={1.5}
              />
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-3 transition-all">
              Escáner de Entradas
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-center text-sm mb-6 md:mb-8 max-w-xs leading-relaxed transition-all">
              Presiona el botón para activar la cámara y comenzar a escanear códigos QR
            </p>{' '}
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 md:mb-8">
              Validador: {user?.nombre || 'Usuario'}
            </p>{' '}
            <button
              onClick={startScanning}
              className="flex items-center gap-2 md:gap-3 bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-3 px-6 md:py-4 md:px-8 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95 cursor-pointer"
            >
              <Camera className="w-5 h-5 md:w-6 md:h-6" />
              <span className="text-base md:text-lg">Iniciar Escaneo</span>
            </button>
          </div>
        )}

        {/* Estado Escaneando */}
        {isReady && !scanResult && !isProcessing && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(transparent_40%,rgba(0,0,0,0.3)_100%)] dark:bg-[radial-gradient(transparent_40%,rgba(0,0,0,0.6)_100%)]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 border-2 border-slate-400/40 dark:border-white/30 rounded-lg relative">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-amber-500 rounded-tl-lg -mt-1 -ml-1"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-amber-500 rounded-tr-lg -mt-1 -mr-1"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-amber-500 rounded-bl-lg -mb-1 -ml-1"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-amber-500 rounded-br-lg -mb-1 -mr-1"></div>
                <div className="absolute inset-x-0 h-0.5 bg-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.8)] animate-scan-vertical top-1/2" />
              </div>
            </div>
            <div className="absolute bottom-6 left-0 right-0 flex justify-center">
              <span className="bg-black/60 dark:bg-black/60 text-white text-xs font-medium px-4 py-2 rounded-full backdrop-blur-md border border-white/10 flex items-center gap-2">
                <Camera size={14} />
                Enfoca el código QR
              </span>
            </div>
          </div>
        )}

        {/* Estado Procesando */}
        {isProcessing && (
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center text-white z-10">
            <Loader2 className="w-12 h-12 animate-spin text-amber-500 mb-4" />
            <p className="font-medium animate-pulse">Validando entrada...</p>
          </div>
        )}

        {/* Estado Éxito */}
        {scanResult?.status === 'success' && (
          <div className="absolute inset-0 bg-emerald-600 flex flex-col items-center justify-center text-white p-6 animate-in fade-in zoom-in duration-300 z-20">
            <div className="bg-white/20 p-4 rounded-full mb-4">
              <CheckCircle2 className="w-16 h-16" strokeWidth={2} />
            </div>
            <h3 className="text-2xl font-bold">¡Autorizado!</h3>
            <p className="text-emerald-100 mt-2 text-center">Entrada válida</p>
            {scanResult.response && (
              <div className="mt-4 text-sm bg-white/10 rounded-lg p-3">
                <p>ID: {scanResult.response.entradaId}</p>
                <p>Estado: {scanResult.response.estadoActual}</p>
              </div>
            )}
          </div>
        )}

        {/* Estado Error */}
        {scanResult?.status === 'error' && (
          <div className="absolute inset-0 bg-rose-600 flex flex-col items-center justify-center text-white p-6 animate-in fade-in zoom-in duration-300 z-20">
            <div className="bg-white/20 p-4 rounded-full mb-4">
              <XCircle className="w-16 h-16" strokeWidth={2} />
            </div>
            <h3 className="text-2xl font-bold">Denegado</h3>
            <p className="text-rose-100 mt-2 text-center">{scanResult.message}</p>
            {scanResult.response && (
              <div className="mt-4 text-sm bg-white/10 rounded-lg p-3 text-center">
                <AlertCircle className="w-5 h-5 inline mr-2" />
                <p>{scanResult.response.mensaje}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Panel de Control de Resultados */}
      {scanResult && (
        <div className="w-full px-4 animate-in slide-in-from-bottom-2 duration-300">
          <div
            className={`rounded-xl border shadow-sm p-4 mb-4 ${
              scanResult.status === 'success'
                ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p
                  className={`font-bold text-lg ${
                    scanResult.status === 'success'
                      ? 'text-green-800 dark:text-green-300'
                      : 'text-red-800 dark:text-red-300'
                  }`}
                >
                  {scanResult.message}
                </p>
                <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">
                  Datos Escaneados:
                </p>
                <code className="text-sm block mt-1 bg-white/50 dark:bg-black/20 p-2 rounded border border-black/5 dark:border-white/5 font-mono break-all">
                  {scanResult.data}
                </code>
                {scanResult.response && (
                  <div className="mt-3 text-xs space-y-1">
                    <p>
                      <strong>Entrada ID:</strong> {scanResult.response.entradaId}
                    </p>
                    <p>
                      <strong>Estado Actual:</strong> {scanResult.response.estadoActual}
                    </p>
                    {scanResult.response.estadoAnterior && (
                      <p>
                        <strong>Estado Anterior:</strong> {scanResult.response.estadoAnterior}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={resetScan}
            className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-slate-800 to-slate-900 dark:from-white dark:to-slate-100 hover:from-slate-900 hover:to-black dark:hover:from-slate-100 dark:hover:to-white text-white dark:text-slate-900 font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-[0.98] cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
            Escanear Siguiente
          </button>
        </div>
      )}
    </div>
  );
};

export default QrReaderComponent;
