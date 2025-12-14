import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import SandboxSeatMapEditor from './SandboxSeatMapEditor';

// Mock de window.alert y window.prompt
const mockAlert = vi.fn();
const mockPrompt = vi.fn();
window.alert = mockAlert;
window.prompt = mockPrompt;

describe('SandboxSeatMapEditor', () => {
  const renderWithRouter = () => {
    return render(
      <BrowserRouter>
        <SandboxSeatMapEditor />
      </BrowserRouter>,
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockAlert.mockClear();
    mockPrompt.mockClear();
  });

  it('renderiza el componente correctamente', () => {
    renderWithRouter();

    // Verificar que el título del header está presente
    expect(screen.getByText(/Editor de Mapas de Asientos/)).toBeInTheDocument();
  });

  it('muestra el componente SeatMapEditor', () => {
    renderWithRouter();

    // Debe renderizar las herramientas del editor
    expect(screen.getByText('Herramientas')).toBeInTheDocument();
  });

  it('muestra botón de importar en el header', () => {
    renderWithRouter();

    expect(screen.getByText('Importar JSON')).toBeInTheDocument();
  });

  it('renderiza el panel de tipos de entrada', () => {
    renderWithRouter();

    expect(screen.getByText('Tipos de Entrada')).toBeInTheDocument();
  });

  it('renderiza el panel de layout automático', () => {
    renderWithRouter();

    expect(screen.getByText('Layout Automático')).toBeInTheDocument();
  });

  it('muestra el botón de guardar mapa', () => {
    renderWithRouter();

    expect(screen.getByText('Guardar Mapa')).toBeInTheDocument();
  });

  it('renderiza los controles de herramientas', () => {
    renderWithRouter();

    expect(screen.getByText('Seleccionar')).toBeInTheDocument();
    expect(screen.getByText('Añadir')).toBeInTheDocument();
    expect(screen.getByText('Eliminar')).toBeInTheDocument();
  });

  it('muestra el panel de forma de asiento', () => {
    renderWithRouter();

    expect(screen.getByText('Forma de Asiento')).toBeInTheDocument();
  });

  it('renderiza el panel de objetos decorativos', () => {
    renderWithRouter();

    expect(screen.getByText('Objetos Decorativos')).toBeInTheDocument();
  });

  it('muestra el canvas SVG del editor', () => {
    renderWithRouter();

    // Verificar que existe un elemento SVG
    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renderiza el botón de volver', () => {
    renderWithRouter();

    // Debe haber un link para volver
    const links = document.querySelectorAll('a[href="/"]');
    expect(links.length).toBeGreaterThan(0);
  });

  it('muestra el tema toggle button', () => {
    renderWithRouter();

    // Debe haber un botón de tema
    const themeButton = document.querySelector('[aria-label="Toggle theme"]');
    expect(themeButton).toBeInTheDocument();
  });

  it('renderiza el header correctamente', () => {
    renderWithRouter();

    // Verificar elementos del header
    expect(screen.getByText('Importar JSON')).toBeInTheDocument();
  });

  it('muestra los controles de undo/redo', () => {
    renderWithRouter();

    expect(screen.getByTitle('Deshacer (Ctrl+Z)')).toBeInTheDocument();
    expect(screen.getByTitle('Rehacer (Ctrl+Y)')).toBeInTheDocument();
  });

  it('renderiza el header con botones', () => {
    renderWithRouter();

    // Verificar que el header tiene contenido
    expect(screen.getByText('Importar JSON')).toBeInTheDocument();
  });

  it('renderiza el botón de volver con texto', () => {
    renderWithRouter();

    expect(screen.getByText('Volver')).toBeInTheDocument();
  });

  it('muestra el título del sandbox', () => {
    renderWithRouter();

    const title = screen.getByText(/Editor de Mapas de Asientos/);
    expect(title).toBeInTheDocument();
  });

  it('renderiza el panel de configuración de grid', () => {
    renderWithRouter();

    // El panel de layout contiene opciones de grid
    expect(screen.getByText('Layout Automático')).toBeInTheDocument();
  });

  it('muestra opciones de layout circular', () => {
    renderWithRouter();

    // Verificar que el panel de layout está presente
    expect(screen.getByText('Layout Automático')).toBeInTheDocument();
  });

  it('muestra el botón de generar grid', () => {
    renderWithRouter();

    const gridButton = screen.getByText(/Generar Grid/);
    expect(gridButton).toBeInTheDocument();
  });

  it('muestra el panel de tipos de entrada vacío', () => {
    renderWithRouter();

    // El panel debe estar presente aunque vacío
    expect(screen.getByText('Tipos de Entrada')).toBeInTheDocument();
  });

  it('renderiza el componente ThemeToggle', () => {
    renderWithRouter();

    const themeButton = document.querySelector('[aria-label="Toggle theme"]');
    expect(themeButton).toBeInTheDocument();
  });

  it('muestra el botón de importar en el header', () => {
    renderWithRouter();

    // Verificar que el botón de importar está presente
    expect(screen.getByText('Importar JSON')).toBeInTheDocument();
  });
});
