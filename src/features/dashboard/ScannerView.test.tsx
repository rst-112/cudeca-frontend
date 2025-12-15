import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ScannerView from './ScannerView';

// Mock del componente QrReaderComponent
vi.mock('../../components/QrReaderComponent', () => ({
  default: () => <div data-testid="mock-qr-reader">Mock QR Reader Component</div>,
}));

describe('ScannerView', () => {
  it('renderiza las instrucciones de uso correctamente', () => {
    render(<ScannerView />);

    expect(screen.getByText('Instrucciones de uso')).toBeInTheDocument();
    expect(screen.getByText(/Apunta la cámara hacia el código QR/i)).toBeInTheDocument();
  });

  it('renderiza el indicador de estado de cámara y modo staff', () => {
    render(<ScannerView />);

    expect(screen.getByText('Cámara activa')).toBeInTheDocument();
    expect(screen.getByText('Modo Staff')).toBeInTheDocument();
  });

  it('renderiza el componente QrReaderComponent dentro del contenedor', () => {
    render(<ScannerView />);

    expect(screen.getByTestId('mock-qr-reader')).toBeInTheDocument();
  });
});
