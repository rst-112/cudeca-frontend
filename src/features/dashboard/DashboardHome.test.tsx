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

    expect(screen.getByText('Resumen de Actividad')).toBeInTheDocument();

    // Stats Cards
    expect(screen.getByText('Asistentes Hoy')).toBeInTheDocument();
    expect(screen.getByText('124')).toBeInTheDocument();

    expect(screen.getByText('Entradas Vendidas')).toBeInTheDocument();
    expect(screen.getByText('1,450')).toBeInTheDocument();

    expect(screen.getByText('Próximo Evento')).toBeInTheDocument();
    expect(screen.getByText('Gala Benéfica')).toBeInTheDocument();
  });

  it('renderiza la sección de actividad reciente', () => {
    render(
      <BrowserRouter>
        <DashboardHome />
      </BrowserRouter>,
    );

    expect(screen.getByText('Registros Recientes')).toBeInTheDocument();

    // Debería haber items de actividad
    const items = screen.getAllByText(/Entrada validada/i);
    expect(items.length).toBeGreaterThan(0);
  });
});
