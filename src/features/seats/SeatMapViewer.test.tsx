import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SeatMapViewer } from './SeatMapViewer';
import type { Asiento, ObjetoDecorativo } from '../../types/seatmap.types';

describe('SeatMapViewer', () => {
  const mockAsientos: Asiento[] = [
    {
      id: 'seat-1',
      x: 100,
      y: 100,
      estado: 'LIBRE',
      etiqueta: 'A1',
      fila: 1,
      columna: 1,
      tipoEntradaId: 1,
      precio: 20,
      forma: 'circulo',
    },
    {
      id: 'seat-2',
      x: 150,
      y: 100,
      estado: 'OCUPADO',
      etiqueta: 'A2',
      fila: 1,
      columna: 2,
      tipoEntradaId: 1,
      precio: 20,
      forma: 'cuadrado',
    },
    {
      id: 'seat-3',
      x: 200,
      y: 100,
      estado: 'SELECCIONADO',
      etiqueta: 'A3',
      fila: 1,
      columna: 3,
      tipoEntradaId: 1,
      precio: 20,
      forma: 'rectangulo',
    },
    {
      id: 'seat-4',
      x: 250,
      y: 100,
      estado: 'BLOQUEADO',
      etiqueta: 'A4',
      fila: 1,
      columna: 4,
      tipoEntradaId: 1,
      precio: 20,
      forma: 'triangulo',
    },
  ];

  const mockObjetos: ObjetoDecorativo[] = [
    {
      id: 'obj-1',
      tipo: 'escenario',
      x: 400,
      y: 50,
      ancho: 200,
      alto: 40,
      color: '#9333ea',
      etiqueta: 'ESCENARIO',
      clickeable: false,
    },
  ];

  it('renderiza el viewer con asientos', () => {
    render(<SeatMapViewer asientos={mockAsientos} onSelectSeat={vi.fn()} />);

    // Verificar que el SVG se renderiza
    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renderiza asientos con diferentes estados', () => {
    render(<SeatMapViewer asientos={mockAsientos} onSelectSeat={vi.fn()} />);

    // Verificar que se renderizan los 4 asientos
    expect(screen.getByText('A1')).toBeInTheDocument();
    expect(screen.getByText('A2')).toBeInTheDocument();
    expect(screen.getByText('A3')).toBeInTheDocument();
    expect(screen.getByText('A4')).toBeInTheDocument();
  });

  it('llama a onSelectSeat cuando se hace click en un asiento libre', () => {
    const mockOnSelect = vi.fn();
    render(<SeatMapViewer asientos={mockAsientos} onSelectSeat={mockOnSelect} />);

    const asientoLibre = screen.getByText('A1').closest('g');
    if (asientoLibre) {
      fireEvent.click(asientoLibre);
      expect(mockOnSelect).toHaveBeenCalledWith('seat-1');
    }
  });

  it('no llama a onSelectSeat cuando se hace click en un asiento ocupado', () => {
    const mockOnSelect = vi.fn();
    render(<SeatMapViewer asientos={mockAsientos} onSelectSeat={mockOnSelect} />);

    const asientoOcupado = screen.getByText('A2').closest('g');
    if (asientoOcupado) {
      fireEvent.click(asientoOcupado);
      expect(mockOnSelect).not.toHaveBeenCalled();
    }
  });

  it('renderiza objetos decorativos', () => {
    render(
      <SeatMapViewer
        asientos={mockAsientos}
        objetosDecorativos={mockObjetos}
        onSelectSeat={vi.fn()}
      />,
    );

    // Verifica que hay al menos un elemento con el texto ESCENARIO
    expect(screen.getAllByText('ESCENARIO').length).toBeGreaterThan(0);
  });

  it('renderiza el título del escenario personalizado', () => {
    render(
      <SeatMapViewer
        asientos={mockAsientos}
        onSelectSeat={vi.fn()}
        mostrarEscenario={true}
        tituloEscenario="TEATRO PRINCIPAL"
      />,
    );

    expect(screen.getByText('TEATRO PRINCIPAL')).toBeInTheDocument();
  });

  it('no renderiza el escenario si mostrarEscenario es false', () => {
    render(
      <SeatMapViewer asientos={mockAsientos} onSelectSeat={vi.fn()} mostrarEscenario={false} />,
    );

    expect(screen.queryByText('ESCENARIO')).not.toBeInTheDocument();
  });

  it('renderiza sin asientos (viewBox por defecto)', () => {
    render(<SeatMapViewer asientos={[]} onSelectSeat={vi.fn()} />);

    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('usa dimensiones personalizadas', () => {
    const { container } = render(
      <SeatMapViewer asientos={mockAsientos} onSelectSeat={vi.fn()} ancho={1000} alto={800} />,
    );

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renderiza asientos con tipos de entrada y colores', () => {
    const asientosConTipo: Asiento[] = [
      {
        ...mockAsientos[0],
        tipoEntrada: {
          id: 1,
          nombre: 'VIP',
          precio: 50,
          color: '#FFD700',
        },
      },
    ];

    render(<SeatMapViewer asientos={asientosConTipo} onSelectSeat={vi.fn()} />);

    expect(screen.getByText('A1')).toBeInTheDocument();
  });

  it('maneja asientos con todas las formas', () => {
    render(<SeatMapViewer asientos={mockAsientos} onSelectSeat={vi.fn()} />);

    // Círculo
    expect(screen.getByText('A1')).toBeInTheDocument();
    // Cuadrado
    expect(screen.getByText('A2')).toBeInTheDocument();
    // Rectángulo
    expect(screen.getByText('A3')).toBeInTheDocument();
    // Triángulo
    expect(screen.getByText('A4')).toBeInTheDocument();
  });

  it('calcula viewBox dinámico con asientos y objetos', () => {
    const { container } = render(
      <SeatMapViewer
        asientos={mockAsientos}
        objetosDecorativos={mockObjetos}
        onSelectSeat={vi.fn()}
      />,
    );

    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('viewBox');
  });
});
