/**
 * Privacy Page Test Suite
 *
 * Tests para la página de Política de Privacidad
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Privacy from './Privacy';

describe('Privacy Page', () => {
  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <Privacy />
      </BrowserRouter>,
    );
  };

  it('debe renderizar correctamente', () => {
    renderComponent();

    expect(screen.getByText('Política de Privacidad')).toBeInTheDocument();
  });

  it('debe mostrar el título principal', () => {
    renderComponent();

    const heading = screen.getByRole('heading', { name: /Política de Privacidad/i, level: 1 });
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
