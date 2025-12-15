import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import DashboardHome from './DashboardHome';

describe('DashboardHome', () => {
  it('renderiza las tarjetas de estadísticas', () => {
    render(
      <BrowserRouter>
        <DashboardHome />
      </BrowserRouter>,
    );

    expect(screen.getByText('Eventos Próximos')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();

    expect(screen.getByText('Mis Entradas')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();

    expect(screen.getByText('Donaciones')).toBeInTheDocument();
    expect(screen.getByText('150€')).toBeInTheDocument();
  });

  it('tiene un enlace correcto a mis entradas', () => {
    render(
      <BrowserRouter>
        <DashboardHome />
      </BrowserRouter>,
    );

    const link = screen.getByRole('link', { name: /mis entradas/i });
    expect(link).toHaveAttribute('href', '/dashboard/tickets');
  });

  it('renderiza la sección de actividad reciente', () => {
    render(
      <BrowserRouter>
        <DashboardHome />
      </BrowserRouter>,
    );

    expect(screen.getByText('Actividad Reciente')).toBeInTheDocument();

    // Debería haber 3 items de actividad según el mock
    const items = screen.getAllByText(/Compra de entradas - Concierto Benéfico/i);
    expect(items).toHaveLength(3);
  });
});
