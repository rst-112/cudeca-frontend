import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

// Importamos las páginas
import Login from './Login';
import Registro from './Registro';
import Checkout from './Checkout';
import DetallesEvento from './DetallesEvento';

describe('Páginas Públicas (Cobertura)', () => {
  it('renderiza la página de Login', () => {
    render(<Login />);
    expect(screen.getByText(/Acceso a Cuenta/i)).toBeInTheDocument();
  });

  it('renderiza la página de Registro', () => {
    render(<Registro />);
    expect(screen.getByText(/Crear nueva cuenta/i)).toBeInTheDocument();
  });

  it('renderiza la página de Checkout', () => {
    render(<Checkout />);
    expect(screen.getByText(/Pasarela de pago/i)).toBeInTheDocument();
  });

  // Test para la página de Detalles del Evento con parámetro dinámico
  it('renderiza el Detalle del Evento', () => {
    render(
      <MemoryRouter initialEntries={['/evento/123']}>
        <Routes>
          <Route path="/evento/:id" element={<DetallesEvento />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByText(/Viendo evento con ID: 123/i)).toBeInTheDocument();
  });
});
