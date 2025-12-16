/**
 * Terms Page Test Suite
 *
 * Tests para la página de Términos y Condiciones
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Terms from './Terms';

describe('Terms Page', () => {
  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <Terms />
      </BrowserRouter>,
    );
  };

  it('debe renderizar correctamente', () => {
    renderComponent();

    expect(screen.getByText('Términos y Condiciones de Uso')).toBeInTheDocument();
  });

  it('debe mostrar el título principal', () => {
    renderComponent();

    const heading = screen.getByRole('heading', {
      name: /Términos y Condiciones de Uso/i,
      level: 1,
    });
    expect(heading).toBeInTheDocument();
  });

  it('debe mostrar la fecha de última actualización', () => {
    renderComponent();

    expect(screen.getByText(/Última actualización:/i)).toBeInTheDocument();
  });

  it('debe mostrar el botón de volver al inicio', () => {
    renderComponent();

    const backButton = screen.getByRole('link', { name: /Volver al Inicio/i });
    expect(backButton).toBeInTheDocument();
    expect(backButton).toHaveAttribute('href', '/');
  });

  it('debe tener estructura de headings correcta', () => {
    renderComponent();

    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toBeInTheDocument();
  });

  it('debe tener links accesibles', () => {
    renderComponent();

    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
  });
});
