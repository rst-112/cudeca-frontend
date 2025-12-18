import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import ConfirmationPage from './Confirmation';

describe('ConfirmationPage', () => {
  it('renders confirmation message', () => {
    render(
      <BrowserRouter>
        <ConfirmationPage />
      </BrowserRouter>,
    );

    expect(screen.getByText('¡Compra Confirmada!')).toBeInTheDocument();
    expect(screen.getByText(/Tu pedido se ha procesado correctamente/)).toBeInTheDocument();
  });

  it('renders navigation buttons', () => {
    render(
      <BrowserRouter>
        <ConfirmationPage />
      </BrowserRouter>,
    );

    expect(screen.getByText('Ver mis entradas')).toBeInTheDocument();
    expect(screen.getByText('Volver al inicio')).toBeInTheDocument();
  });
});
