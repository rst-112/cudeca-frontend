import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import QrReaderComponent from './QrReaderComponent';
import * as qrService from '../services/qr.service';

// Mock del servicio QR
vi.mock('../services/qr.service', () => ({
  qrService: {
    validarTicket: vi.fn(),
    consultarEntrada: vi.fn(),
  },
}));

// Mock del componente Scanner
vi.mock('@yudiel/react-qr-scanner', () => ({
  Scanner: ({ onScan }: { onScan: (result: { rawValue: string }[]) => void }) => (
    <div data-testid="mock-scanner">
      <button
        data-testid="trigger-scan-success"
        onClick={() => onScan([{ rawValue: 'TICKET-VALIDO-123' }])}
      >
        Simular Escaneo Válido
      </button>
      <button
        data-testid="trigger-scan-invalid"
        onClick={() => onScan([{ rawValue: 'TICKET-USADO-456' }])}
      >
        Simular Escaneo Inválido
      </button>
    </div>
  ),
}));

// Mock de sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('QrReaderComponent - Integración Real', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('genera un ID de dispositivo único al montar', () => {
    render(<QrReaderComponent />);

    const dispositivoId = localStorage.getItem('dispositivo_escaner_id');
    expect(dispositivoId).toBeTruthy();
    expect(dispositivoId).toMatch(/^SCANNER-/);
  });

  it('valida entrada exitosamente con el backend', async () => {
    const mockResponse = {
      estado: 'OK',
      mensaje: 'Entrada validada exitosamente',
      entradaId: 123,
      codigoQR: 'TICKET-VALIDO-123',
      estadoAnterior: 'VALIDA',
      estadoActual: 'USADA',
      timestamp: Date.now(),
    };

    vi.mocked(qrService.qrService.validarTicket).mockResolvedValue(mockResponse);

    render(<QrReaderComponent />);

    // Iniciar escaneo
    fireEvent.click(screen.getByText('Iniciar Escaneo'));

    // Simular escaneo
    fireEvent.click(screen.getByTestId('trigger-scan-success'));

    // Verificar estado de procesamiento
    expect(screen.getByText('Validando entrada...')).toBeInTheDocument();

    // Esperar resultado
    await waitFor(
      () => {
        expect(screen.getByText('¡Autorizado!')).toBeInTheDocument();
      },
      { timeout: 3000 },
    );

    expect(screen.getByText('Acceso Autorizado')).toBeInTheDocument();
    expect(screen.getByText('ID: 123')).toBeInTheDocument();
    expect(screen.getByText('Estado: USADA')).toBeInTheDocument();
  });

  it('maneja entrada ya usada correctamente', async () => {
    const mockResponse = {
      estado: 'ERROR_YA_USADA',
      mensaje: 'Esta entrada ya ha sido utilizada',
      entradaId: 456,
      codigoQR: 'TICKET-USADO-456',
      estadoAnterior: 'USADA',
      estadoActual: 'USADA',
      timestamp: Date.now(),
    };

    vi.mocked(qrService.qrService.validarTicket).mockResolvedValue(mockResponse);

    render(<QrReaderComponent />);
    fireEvent.click(screen.getByText('Iniciar Escaneo'));
    fireEvent.click(screen.getByTestId('trigger-scan-invalid'));

    await waitFor(() => {
      expect(screen.getByText('Denegado')).toBeInTheDocument();
    });

    expect(screen.getAllByText('Entrada Ya Usada').length).toBeGreaterThan(0);
    expect(screen.getByText(mockResponse.mensaje)).toBeInTheDocument();
  });

  it('maneja errores de conexión con el backend', async () => {
    vi.mocked(qrService.qrService.validarTicket).mockRejectedValue(new Error('Network Error'));

    render(<QrReaderComponent />);
    fireEvent.click(screen.getByText('Iniciar Escaneo'));
    fireEvent.click(screen.getByTestId('trigger-scan-success'));

    await waitFor(() => {
      expect(screen.getAllByText('Error de Conexión').length).toBeGreaterThan(0);
    });
  });

  it('permite escanear siguiente entrada después de un resultado', async () => {
    const mockResponse = {
      estado: 'OK',
      mensaje: 'Entrada validada',
      entradaId: 789,
      codigoQR: 'TICKET-123',
      estadoAnterior: 'VALIDA',
      estadoActual: 'USADA',
      timestamp: Date.now(),
    };

    vi.mocked(qrService.qrService.validarTicket).mockResolvedValue(mockResponse);

    render(<QrReaderComponent />);
    fireEvent.click(screen.getByText('Iniciar Escaneo'));
    fireEvent.click(screen.getByTestId('trigger-scan-success'));

    await waitFor(() => {
      expect(screen.getByText('Escanear Siguiente')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Escanear Siguiente'));

    expect(screen.queryByText('¡Autorizado!')).not.toBeInTheDocument();
  });
});
