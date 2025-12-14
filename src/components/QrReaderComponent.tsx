import React, { useEffect, useRef, useState } from 'react';

const QrReaderComponent: React.FC = () => {
  const [result, setResult] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const html5QrCodeRef = useRef<any>(null);
  const elementId = 'html5qr-reader';

  // inicia el escáner usando html5-qrcode
  const startScanner = async () => {
    if (scanning) return;
    try {
      const module = await import('html5-qrcode');
      const Html5Qrcode = module.Html5Qrcode;
      // obtener cámaras disponibles
      const cameras = await Html5Qrcode.getCameras();
      if (!cameras || cameras.length === 0) {
        console.error('No camera devices found.');
        return;
      }
      const cameraId = cameras[0].id;
      const html5QrCode = new Html5Qrcode(elementId);
      html5QrCodeRef.current = html5QrCode;
      setScanning(true);

      await html5QrCode.start(
        cameraId,
        { fps: 10, qrbox: 250 },
        (decodedText: string) => {
          setResult(decodedText);
          // detener tras primer resultado (opcional)
          html5QrCode
            .stop()
            .then(() => html5QrCode.clear())
            .catch(() => {})
            .finally(() => {
              html5QrCodeRef.current = null;
              setScanning(false);
            });
        },
        (errorMessage: any) => {
          // fallos de lectura continuos (se puede loggear si se desea)
        },
      );
    } catch (err) {
      console.error('Error initializing html5-qrcode:', err);
    }
  };

  // detiene y limpia el escáner si está activo
  const stopScanner = async () => {
    const inst = html5QrCodeRef.current;
    if (!inst) return;
    try {
      await inst.stop();
    } catch {
      // ignore
    }
    try {
      await inst.clear();
    } catch {
      // ignore
    }
    html5QrCodeRef.current = null;
    setScanning(false);
  };

  useEffect(() => {
    // iniciar al montar
    startScanner();
    return () => {
      // limpiar al desmontar
      stopScanner();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRestart = async () => {
    setResult(null);
    await stopScanner();
    // pequeño retardo para asegurar limpieza
    setTimeout(() => startScanner(), 200);
  };

  return (
    <div>
      <div id={elementId} style={{ width: '100%' }} />
      <p>{result ? `Resultado: ${result}` : scanning ? 'Escaneando...' : 'Escaneo detenido'}</p>
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="button" onClick={handleRestart}>
          Reiniciar escaneo
        </button>
        <button
          type="button"
          onClick={() => {
            if (scanning) stopScanner();
            else startScanner();
          }}
        >
          {scanning ? 'Detener' : 'Iniciar'}
        </button>
      </div>
    </div>
  );
};

export default QrReaderComponent;
