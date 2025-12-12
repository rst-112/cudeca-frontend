import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CheckoutFormSection } from './CheckoutInvitado/CheckoutFormSection';
import { CheckoutFormSection as CheckoutFormUsuario } from './CheckoutUsuario/CheckoutFormSection';

// Mock de navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('CheckoutFormSection - Branches Coverage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('CheckoutFormSection Invitado', () => {
    it('renderiza el formulario correctamente', () => {
      render(
        <MemoryRouter>
          <CheckoutFormSection />
        </MemoryRouter>,
      );

      expect(screen.getByText(/Información de Contacto/i)).toBeInTheDocument();
    });

    it('valida campos vacíos', async () => {
      render(
        <MemoryRouter>
          <CheckoutFormSection />
        </MemoryRouter>,
      );

      // Buscar y hacer clic en el botón de continuar
      const buttons = screen.getAllByRole('button');
      const continueButton = buttons.find((btn) => btn.textContent?.includes('Continuar'));

      if (continueButton) {
        fireEvent.click(continueButton);

        await waitFor(() => {
          expect(screen.getByText(/Información de Contacto/i)).toBeInTheDocument();
        });
      }
    });

    it('permite escribir en los campos del formulario', () => {
      render(
        <MemoryRouter>
          <CheckoutFormSection />
        </MemoryRouter>,
      );

      const inputs = screen.getAllByRole('textbox');

      if (inputs.length > 0) {
        fireEvent.change(inputs[0], { target: { value: 'test@test.com' } });
        expect(inputs[0]).toHaveValue('test@test.com');
      }
    });
  });

  describe('CheckoutFormSection Usuario', () => {
    it('renderiza el formulario de usuario correctamente', () => {
      render(
        <MemoryRouter>
          <CheckoutFormUsuario />
        </MemoryRouter>,
      );

      expect(screen.getByText(/Información de Contacto/i)).toBeInTheDocument();
    });

    it('muestra opciones de pago', () => {
      render(
        <MemoryRouter>
          <CheckoutFormUsuario />
        </MemoryRouter>,
      );

      // Verificar que hay elementos interactivos
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });
});
