import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import QrReaderComponent from './QrReaderComponent';

// Mock del componente Scanner de la librería externa
vi.mock('@yudiel/react-qr-scanner', () => ({
  Scanner: ({ onScan }: { onScan: (result: { rawValue: string }[]) => void }) => (
    <div data-testid="mock-scanner">
      <button
        data-testid="trigger-scan-success"
        onClick={() => onScan([{ rawValue: 'TICKET-VALIDO' }])}
      >
        Simular Escaneo Válido
      </button>
      <button
        data-testid="trigger-scan-invalid"
        onClick={() => onScan([{ rawValue: 'TICKET-INVALIDO' }])}
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

describe('QrReaderComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('muestra la pantalla inicial correctamente', () => {
    render(<QrReaderComponent />);
    expect(screen.getByText('Escáner de Entradas')).toBeInTheDocument();
    expect(screen.getByText('Iniciar Escaneo')).toBeInTheDocument();
  });

  it('activa el escáner al hacer click en iniciar', () => {
    render(<QrReaderComponent />);

    fireEvent.click(screen.getByText('Iniciar Escaneo'));

    expect(screen.getByTestId('mock-scanner')).toBeInTheDocument();
    expect(screen.queryByText('Escáner de Entradas')).not.toBeInTheDocument();
  });

  it('maneja el flujo de escaneo y validación (éxito por azar controlado)', async () => {
    // Mockear Math.random para asegurar éxito (> 0.3)
    vi.spyOn(Math, 'random').mockReturnValue(0.5);

    render(<QrReaderComponent />);
    fireEvent.click(screen.getByText('Iniciar Escaneo'));

    // Simular escaneo
    fireEvent.click(screen.getByTestId('trigger-scan-success'));

    // Debe mostrar estado procesando
    expect(screen.getByText('Validando entrada...')).toBeInTheDocument();

    await waitFor(
      () => {
        expect(screen.getByText('¡Autorizado!')).toBeInTheDocument();
      },
      { timeout: 3000 },
    );

    expect(screen.getByText('Acceso Autorizado')).toBeInTheDocument();
    expect(screen.getByText('TICKET-VALIDO')).toBeInTheDocument();
  });

  it('permite reiniciar el escaneo después de un resultado', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);

    render(<QrReaderComponent />);
    fireEvent.click(screen.getByText('Iniciar Escaneo'));
    fireEvent.click(screen.getByTestId('trigger-scan-success'));

    await waitFor(
      () => {
        expect(screen.getByText('Escanear Siguiente')).toBeInTheDocument();
      },
      { timeout: 3000 },
    );

    fireEvent.click(screen.getByText('Escanear Siguiente'));

    expect(screen.queryByText('¡Autorizado!')).not.toBeInTheDocument();
    expect(screen.getByText('Enfoca el código QR')).toBeInTheDocument();
  });
});
