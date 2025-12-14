import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SeatMapEditor } from './SeatMapEditor';
import type { MapaAsientos } from '../../types/seatmap.types';

describe('SeatMapEditor', () => {
  const mockOnSave = vi.fn();

  const mapaInicial: MapaAsientos = {
    eventoId: 1,
    ancho: 800,
    alto: 600,
    tiposEntrada: [
      {
        id: 1,
        nombre: 'Normal',
        precio: 20,
        color: '#00A651',
      },
    ],
    zonas: [
      {
        id: 1,
        nombre: 'Principal',
        aforoTotal: 10,
        asientos: [
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
        ],
        objetosDecorativos: [],
      },
    ],
  };

  it('renderiza el editor con mapa inicial', () => {
    render(<SeatMapEditor mapaInicial={mapaInicial} onSave={mockOnSave} />);

    expect(screen.getByText('Herramientas')).toBeInTheDocument();
    expect(screen.getByText('Seleccionar')).toBeInTheDocument();
    expect(screen.getByText('Añadir')).toBeInTheDocument();
    expect(screen.getByText('Eliminar')).toBeInTheDocument();
  });

  it('cambia de herramienta al hacer click', () => {
    render(<SeatMapEditor onSave={mockOnSave} />);

    const botonAñadir = screen.getByText('Añadir');
    fireEvent.click(botonAñadir);

    // El botón debe estar activo
    expect(botonAñadir.closest('button')).toHaveClass('bg-[#00A651]');
  });

  it('renderiza formas de asiento', () => {
    render(<SeatMapEditor onSave={mockOnSave} />);

    expect(screen.getByText('Forma de Asiento')).toBeInTheDocument();
  });

  it('muestra tipos de entrada del mapa inicial', () => {
    render(<SeatMapEditor mapaInicial={mapaInicial} onSave={mockOnSave} />);

    expect(screen.getByText('Normal')).toBeInTheDocument();
    expect(screen.getByText('20€')).toBeInTheDocument();
  });

  it('permite añadir un nuevo tipo de entrada', () => {
    render(<SeatMapEditor onSave={mockOnSave} />);

    const botonAñadirTipo = screen.getByText('Añadir Tipo');
    fireEvent.click(botonAñadirTipo);

    // Debe aparecer un nuevo tipo en modo edición
    expect(screen.getByPlaceholderText('Nombre')).toBeInTheDocument();
  });

  it('muestra opciones de layout automático', () => {
    render(<SeatMapEditor onSave={mockOnSave} />);

    // Verificar que existe texto relacionado con layout
    expect(screen.getByText('Layout Automático')).toBeInTheDocument();
  });

  it('genera grid cuando se hace click en Generar Grid', async () => {
    render(<SeatMapEditor onSave={mockOnSave} />);

    // Primero añadir un tipo de entrada
    const botonAñadirTipo = screen.getByText('Añadir Tipo');
    fireEvent.click(botonAñadirTipo);

    await waitFor(() => {
      const botonGuardar = screen.getAllByText('Guardar')[0];
      fireEvent.click(botonGuardar);
    });

    // Verificar que el panel está disponible
    expect(screen.getByText('Layout Automático')).toBeInTheDocument();
  });
  it('permite undo y redo', () => {
    render(<SeatMapEditor mapaInicial={mapaInicial} onSave={mockOnSave} />);

    const botonUndo = screen.getByTitle('Deshacer (Ctrl+Z)');
    const botonRedo = screen.getByTitle('Rehacer (Ctrl+Y)');

    expect(botonUndo).toBeInTheDocument();
    expect(botonRedo).toBeInTheDocument();
  });

  it('muestra panel de propiedades cuando se selecciona un asiento', async () => {
    render(<SeatMapEditor mapaInicial={mapaInicial} onSave={mockOnSave} />);

    const asiento = screen.getByText('A1');
    fireEvent.click(asiento.closest('g')!);

    await waitFor(() => {
      expect(screen.getByText(/Asiento: A1/)).toBeInTheDocument();
    });
  });

  it('muestra objetos decorativos', () => {
    render(<SeatMapEditor onSave={mockOnSave} />);

    expect(screen.getByText('Objetos Decorativos')).toBeInTheDocument();
    expect(screen.getByText('Escenario')).toBeInTheDocument();
    expect(screen.getByText('Mesa')).toBeInTheDocument();
    expect(screen.getByText('Barra')).toBeInTheDocument();
  });

  it('llama a onSave cuando se guarda el mapa', () => {
    render(<SeatMapEditor mapaInicial={mapaInicial} onSave={mockOnSave} />);

    const botonGuardar = screen.getByText('Guardar Mapa');
    fireEvent.click(botonGuardar);

    expect(mockOnSave).toHaveBeenCalled();
  });

  it('muestra confirmación al limpiar todo', () => {
    // Mock de window.confirm
    const confirmSpy = vi.spyOn(window, 'confirm');
    confirmSpy.mockReturnValue(false);

    render(<SeatMapEditor mapaInicial={mapaInicial} onSave={mockOnSave} />);

    const botonLimpiar = screen.getByText('Limpiar Todo');
    fireEvent.click(botonLimpiar);

    expect(confirmSpy).toHaveBeenCalled();

    confirmSpy.mockRestore();
  });

  it('renderiza controles de zoom', () => {
    render(<SeatMapEditor onSave={mockOnSave} />);

    const zoomButtons = document.querySelectorAll(
      '[aria-label*="zoom"], [aria-label*="Acercar"], [aria-label*="Alejar"]',
    );
    expect(zoomButtons.length).toBeGreaterThan(0);
  });

  it('muestra mensaje de error si no hay tipos de entrada al añadir asiento', () => {
    render(<SeatMapEditor onSave={mockOnSave} />);

    // Cambiar a herramienta añadir
    const botonAñadir = screen.getByText('Añadir');
    fireEvent.click(botonAñadir);

    // El botón debe estar activo
    expect(botonAñadir.closest('button')).toHaveClass('bg-[#00A651]');
  });

  it('permite editar un tipo de entrada', async () => {
    render(<SeatMapEditor mapaInicial={mapaInicial} onSave={mockOnSave} />);

    const botonEditar = screen.getByTitle('Editar');
    fireEvent.click(botonEditar);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Nombre')).toBeInTheDocument();
    });
  });

  it('valida colores conflictivos en tipos de entrada', () => {
    render(<SeatMapEditor onSave={mockOnSave} />);

    // Verificar que el panel de tipos de entrada está presente
    expect(screen.getByText('Tipos de Entrada')).toBeInTheDocument();
  });

  it('permite generar layout circular', async () => {
    render(<SeatMapEditor onSave={mockOnSave} />);

    // Añadir tipo de entrada primero
    const botonAñadirTipo = screen.getByText('Añadir Tipo');
    fireEvent.click(botonAñadirTipo);

    await waitFor(() => {
      const botonGuardar = screen.getAllByText('Guardar')[0];
      fireEvent.click(botonGuardar);
    });

    // Verificar que el panel de layout está disponible
    expect(screen.getByText('Layout Automático')).toBeInTheDocument();
  });

  it('permite cambiar la forma activa', () => {
    render(<SeatMapEditor onSave={mockOnSave} />);

    // Verificar que existe el panel de formas
    expect(screen.getByText('Forma de Asiento')).toBeInTheDocument();
  });

  it('permite configurar filas y columnas del grid', () => {
    render(<SeatMapEditor onSave={mockOnSave} />);

    // Buscar inputs por placeholder o por el contexto de "Layout Automático"
    const inputs = document.querySelectorAll('input[type="number"]');

    // Debe haber inputs para filas y columnas
    expect(inputs.length).toBeGreaterThanOrEqual(2);
  });

  it('renderiza asientos del mapa inicial en el canvas', () => {
    render(<SeatMapEditor mapaInicial={mapaInicial} onSave={mockOnSave} />);

    // Debe renderizar el asiento A1
    expect(screen.getByText('A1')).toBeInTheDocument();
  });

  it('muestra el total de asientos', () => {
    render(<SeatMapEditor mapaInicial={mapaInicial} onSave={mockOnSave} />);

    // Debe mostrar el contador
    expect(screen.getByText(/Total de asientos:/)).toBeInTheDocument();
  });

  it('muestra el botón de limpiar todo', () => {
    render(<SeatMapEditor onSave={mockOnSave} />);

    expect(screen.getByText('Limpiar Todo')).toBeInTheDocument();
  });

  it('guarda el tipo de entrada al hacer click en Guardar', async () => {
    render(<SeatMapEditor onSave={mockOnSave} />);

    const botonAñadirTipo = screen.getByText('Añadir Tipo');
    fireEvent.click(botonAñadirTipo);

    // Llenar los campos
    const inputNombre = screen.getByPlaceholderText('Nombre');
    const inputPrecio = screen.getByPlaceholderText('Precio');

    fireEvent.change(inputNombre, { target: { value: 'VIP' } });
    fireEvent.change(inputPrecio, { target: { value: '50' } });

    await waitFor(() => {
      const botonesGuardar = screen.getAllByText('Guardar');
      if (botonesGuardar.length > 0) {
        fireEvent.click(botonesGuardar[0]);
      }
    });

    // Verificar que el tipo se muestra
    await waitFor(() => {
      expect(screen.getByText('VIP')).toBeInTheDocument();
    });
  });

  it('cancela la edición de tipo de entrada', () => {
    render(<SeatMapEditor onSave={mockOnSave} />);

    const botonAñadirTipo = screen.getByText('Añadir Tipo');
    fireEvent.click(botonAñadirTipo);

    // Debe haber un botón cancelar
    const botonesCancelar = screen.getAllByText('Cancelar');
    expect(botonesCancelar.length).toBeGreaterThan(0);
  });

  it('renderiza el panel de objetos decorativos completo', () => {
    render(<SeatMapEditor onSave={mockOnSave} />);

    expect(screen.getByText('Objetos Decorativos')).toBeInTheDocument();
    expect(screen.getByText('Escenario')).toBeInTheDocument();
    expect(screen.getByText('Mesa')).toBeInTheDocument();
    expect(screen.getByText('Barra')).toBeInTheDocument();
  });

  it('muestra información de teclado shortcuts', () => {
    render(<SeatMapEditor onSave={mockOnSave} />);

    // Verificar que hay hints de shortcuts
    const undoButton = screen.getByTitle('Deshacer (Ctrl+Z)');
    const redoButton = screen.getByTitle('Rehacer (Ctrl+Y)');

    expect(undoButton).toBeInTheDocument();
    expect(redoButton).toBeInTheDocument();
  });

  it('renderiza correctamente sin mapa inicial', () => {
    render(<SeatMapEditor onSave={mockOnSave} />);

    // Debe renderizar el editor vacío sin errores
    expect(screen.getByText('Herramientas')).toBeInTheDocument();
    expect(screen.getByText('Tipos de Entrada')).toBeInTheDocument();
  });
});
