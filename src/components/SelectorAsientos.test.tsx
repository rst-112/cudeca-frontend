import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SelectorAsientos from './SelectorAsientos';
import type { MapaAsientos } from '../types/seatmap.types';

vi.mock('../features/seats', () => ({
  SeatMapViewer: ({ onSelectSeat }: { onSelectSeat: (id: number) => void }) => (
    <div data-testid="seat-map-viewer">
      <button onClick={() => onSelectSeat(1)}>Seat 1</button>
      <button onClick={() => onSelectSeat(2)}>Seat 2</button>
    </div>
  ),
}));

describe('SelectorAsientos', () => {
  const mockMapaAsientos: MapaAsientos = {
    eventoId: 1,
    ancho: 800,
    alto: 600,
    zonas: [
      {
        id: 1,
        nombre: 'Zona A',
        aforoTotal: 3,
        asientos: [
          { id: '1', etiqueta: 'A1', x: 100, y: 100, estado: 'LIBRE' as const },
          { id: '2', etiqueta: 'A2', x: 150, y: 100, estado: 'LIBRE' as const },
          { id: '3', etiqueta: 'A3', x: 200, y: 100, estado: 'OCUPADO' as const },
        ],
        objetosDecorativos: [],
      },
    ],
  };

  const mockOnClose = vi.fn();
  const mockOnConfirmar = vi.fn();

  it('does not render when closed', () => {
    const { container } = render(
      <SelectorAsientos
        isOpen={false}
        onClose={mockOnClose}
        mapaAsientos={mockMapaAsientos}
        cantidadRequerida={2}
        onConfirmar={mockOnConfirmar}
        tipoEntradaNombre="General"
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders when open', () => {
    render(
      <SelectorAsientos
        isOpen={true}
        onClose={mockOnClose}
        mapaAsientos={mockMapaAsientos}
        cantidadRequerida={2}
        onConfirmar={mockOnConfirmar}
        tipoEntradaNombre="General"
      />,
    );

    expect(screen.getByText('Selecciona tus Asientos')).toBeInTheDocument();
    expect(screen.getByText(/General - Selecciona 2 asiento/)).toBeInTheDocument();
  });

  it('shows seat selection counter', () => {
    render(
      <SelectorAsientos
        isOpen={true}
        onClose={mockOnClose}
        mapaAsientos={mockMapaAsientos}
        cantidadRequerida={2}
        onConfirmar={mockOnConfirmar}
        tipoEntradaNombre="General"
      />,
    );

    expect(screen.getByText('0 / 2 seleccionados')).toBeInTheDocument();
  });

  it('closes when clicking close button', () => {
    render(
      <SelectorAsientos
        isOpen={true}
        onClose={mockOnClose}
        mapaAsientos={mockMapaAsientos}
        cantidadRequerida={2}
        onConfirmar={mockOnConfirmar}
        tipoEntradaNombre="General"
      />,
    );

    const closeButton = screen.getByRole('button', { name: '' }); // X button
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('disables confirm button when not enough seats selected', () => {
    render(
      <SelectorAsientos
        isOpen={true}
        onClose={mockOnClose}
        mapaAsientos={mockMapaAsientos}
        cantidadRequerida={2}
        onConfirmar={mockOnConfirmar}
        tipoEntradaNombre="General"
      />,
    );

    const confirmButton = screen.getByText(/Confirmar Selección/);
    expect(confirmButton).toBeDisabled();
  });

  it('shows legend with seat states', () => {
    render(
      <SelectorAsientos
        isOpen={true}
        onClose={mockOnClose}
        mapaAsientos={mockMapaAsientos}
        cantidadRequerida={2}
        onConfirmar={mockOnConfirmar}
        tipoEntradaNombre="General"
      />,
    );

    expect(screen.getByText('Disponible')).toBeInTheDocument();
    expect(screen.getByText('Seleccionado')).toBeInTheDocument();
    expect(screen.getByText('Ocupado')).toBeInTheDocument();
  });
});
