import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ThemeProvider, useTheme } from './ThemeContext';

// Componente de prueba para usar el contexto
const TestComponent = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div>
      <div data-testid="current-theme">{theme}</div>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
};

describe('ThemeContext', () => {
  beforeEach(() => {
    // Limpiar localStorage antes de cada test
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('renderiza el provider correctamente', () => {
    render(
      <ThemeProvider>
        <div>Test Content</div>
      </ThemeProvider>,
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('proporciona el tema por defecto', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    const themeElement = screen.getByTestId('current-theme');
    expect(themeElement.textContent).toBeTruthy();
  });

  it('permite cambiar el tema', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    const initialTheme = screen.getByTestId('current-theme').textContent;
    const toggleButton = screen.getByText('Toggle Theme');

    fireEvent.click(toggleButton);

    const newTheme = screen.getByTestId('current-theme').textContent;
    expect(newTheme).not.toBe(initialTheme);
  });

  it('persiste el tema en localStorage', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    const toggleButton = screen.getByText('Toggle Theme');
    fireEvent.click(toggleButton);

    // Verificar que se guardó en localStorage
    const savedTheme = localStorage.getItem('vite-ui-theme');
    expect(savedTheme).toBeTruthy();
  });

  it('carga el tema desde localStorage', () => {
    // Pre-configurar localStorage
    localStorage.setItem('vite-ui-theme', 'dark');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    const themeElement = screen.getByTestId('current-theme');
    expect(themeElement.textContent).toBe('dark');
  });

  it('aplica la clase dark al html cuando el tema es dark', () => {
    localStorage.setItem('vite-ui-theme', 'dark');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('remueve la clase dark del html cuando el tema es light', () => {
    localStorage.setItem('vite-ui-theme', 'light');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('alterna entre light y dark correctamente', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    const toggleButton = screen.getByText('Toggle Theme');

    // Primera alternancia
    fireEvent.click(toggleButton);
    const theme1 = screen.getByTestId('current-theme').textContent;

    // Segunda alternancia
    fireEvent.click(toggleButton);
    const theme2 = screen.getByTestId('current-theme').textContent;

    // Tercera alternancia
    fireEvent.click(toggleButton);
    const theme3 = screen.getByTestId('current-theme').textContent;

    // Verificar que alterna correctamente
    expect(theme1).not.toBe(theme2);
    expect(theme2).not.toBe(theme3);
    expect(theme1).toBe(theme3);
  });
});
