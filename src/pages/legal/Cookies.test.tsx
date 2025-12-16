/**
 * Cookies Page Test Suite
 *
 * Tests para la página de Política de Cookies
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Cookies from './Cookies';

describe('Cookies Page', () => {
  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <Cookies />
      </BrowserRouter>,
    );
  };

  it('debe renderizar correctamente', () => {
    renderComponent();

    expect(screen.getByText('Política de Cookies')).toBeInTheDocument();
  });

  it('debe mostrar el t\u00edtulo principal', () => {
    renderComponent();

    const heading = screen.getByRole('heading', { name: /Pol\u00edtica de Cookies/i, level: 1 });
    expect(heading).toBeInTheDocument();
  });

  it('debe mostrar la fecha de \u00faltima actualizaci\u00f3n', () => {
    renderComponent();

    expect(screen.getByText(/\u00daltima actualizaci\u00f3n:/i)).toBeInTheDocument();
  });

  it('debe mostrar el bot\u00f3n de volver al inicio', () => {
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
