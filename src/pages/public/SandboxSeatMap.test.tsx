import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import SandboxSeatMap from './SandboxSeatMap';

describe('SandboxSeatMap', () => {
  const renderWithRouter = () => {
    return render(
      <BrowserRouter>
        <SandboxSeatMap />
      </BrowserRouter>,
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza el componente correctamente', () => {
    renderWithRouter();

    // Verificar que el componente se monta
    const svgs = document.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThan(0);
  });

  it('muestra el mapa con SVG', () => {
    renderWithRouter();

    // Debe haber un SVG renderizado
    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renderiza las estadísticas de asientos', () => {
    renderWithRouter();

    // Verificar que muestra el número total de asientos (50 asientos generados)
    expect(screen.getByText('50')).toBeInTheDocument();
  });

  it('renderiza el botón de volver al inicio', () => {
    renderWithRouter();

    // Debe haber un link para volver
    const links = document.querySelectorAll('a[href="/"]');
    expect(links.length).toBeGreaterThan(0);
  });

  it('muestra el botón de tema', () => {
    renderWithRouter();

    // Debe haber un botón de tema
    const themeButton = document.querySelector('[aria-label="Toggle theme"]');
    expect(themeButton).toBeInTheDocument();
  });

  it('renderiza el header con título', () => {
    renderWithRouter();

    // Verificar que hay un header con el título
    expect(screen.getByText(/Sandbox: Mapa de Asientos/)).toBeInTheDocument();
  });

  it('muestra el link al editor', () => {
    renderWithRouter();

    // Debe haber un link al editor
    const editorLinks = document.querySelectorAll('a[href*="editor"]');
    expect(editorLinks.length).toBeGreaterThan(0);
  });

  it('muestra botón de importar JSON', () => {
    renderWithRouter();

    const importButton = screen.getByText(/Importar JSON/);
    expect(importButton).toBeInTheDocument();
  });

  it('muestra botón de regenerar mapa', () => {
    renderWithRouter();

    const regenerarButton = screen.getByText(/Regenerar Mapa/);
    expect(regenerarButton).toBeInTheDocument();
  });

  it('muestra la cantidad de asientos seleccionados inicialmente (0)', () => {
    renderWithRouter();

    // Al inicio no hay asientos seleccionados - buscar todos los elementos con 0
    const zeroElements = screen.getAllByText('0');
    expect(zeroElements.length).toBeGreaterThan(0);
  });

  it('maneja el click en regenerar mapa', async () => {
    renderWithRouter();

    const regenerarButton = screen.getByText(/Regenerar Mapa/);
    fireEvent.click(regenerarButton);

    // Verificar que el SVG sigue presente después de regenerar
    await waitFor(() => {
      const svg = document.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  it('renderiza correctamente las estadísticas', () => {
    renderWithRouter();

    // Verificar que se muestran las estadísticas
    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
  });

  it('muestra estadísticas de disponibles', () => {
    renderWithRouter();

    expect(screen.getByText('Disponibles')).toBeInTheDocument();
  });

  it('muestra estadísticas de ocupados', () => {
    renderWithRouter();

    expect(screen.getByText('Ocupados')).toBeInTheDocument();
  });

  it('muestra estadísticas de bloqueados', () => {
    renderWithRouter();

    expect(screen.getByText('Bloqueados')).toBeInTheDocument();
  });

  it('renderiza el botón de volver con texto', () => {
    renderWithRouter();

    expect(screen.getByText('Volver')).toBeInTheDocument();
  });

  it('renderiza el componente SeatMapViewer', () => {
    renderWithRouter();

    // Verificar que hay elementos SVG del viewer
    const svgs = document.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThan(0);
  });

  it('calcula estadísticas correctamente', () => {
    renderWithRouter();

    // Verificar que muestra el total de 50 asientos
    const totalElement = screen.getByText('50');
    expect(totalElement).toBeInTheDocument();
  });

  it('muestra el panel de estadísticas completo', () => {
    renderWithRouter();

    // Verificar que todos los labels de estadísticas están presentes
    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getByText('Disponibles')).toBeInTheDocument();
    expect(screen.getByText('Ocupados')).toBeInTheDocument();
    expect(screen.getByText('Bloqueados')).toBeInTheDocument();
    expect(screen.getByText('Seleccionados')).toBeInTheDocument();
  });
});
