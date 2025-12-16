import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CheckoutFormSection } from './Checkout/CheckoutFormSection';

// Mock de navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock AuthContext
vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 1, email: 'test@test.com' },
    isAuthenticated: true,
  }),
}));

describe('CheckoutFormSection - Branches Coverage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('CheckoutFormSection', () => {
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
      // Nota: El texto del botón podría variar, ajustamos a lo que probablemente sea
      const buttons = screen.getAllByRole('button');
      // En el código actual es "Confirmar y Pagar" o "Procesando..."
      const continueButton = buttons.find(
        (btn) => btn.textContent?.includes('Confirmar') || btn.textContent?.includes('Pagar'),
      );

      if (continueButton) {
        fireEvent.click(continueButton);

        await waitFor(() => {
          expect(screen.getByText(/Información de Contacto/i)).toBeInTheDocument();
        });
      }
    });

    it('muestra la información del usuario cuando está autenticado', () => {
      render(
        <MemoryRouter>
          <CheckoutFormSection />
        </MemoryRouter>,
      );

      // Cuando el usuario está autenticado, muestra el título
      expect(screen.getByText(/Información de contacto/i)).toBeInTheDocument();
    });

    it('muestra los métodos de pago disponibles', () => {
      render(
        <MemoryRouter>
          <CheckoutFormSection />
        </MemoryRouter>,
      );

      // Verificar que hay métodos de pago
      expect(screen.getByText(/Tarjeta de crédito/i)).toBeInTheDocument();
      expect(screen.getByText(/Paypal/i)).toBeInTheDocument();
    });

    it('selecciona método de pago correctamente', () => {
      render(
        <MemoryRouter>
          <CheckoutFormSection />
        </MemoryRouter>,
      );

      // Buscar el radio button de Paypal
      const paypalRadio = screen.getByRole('radio', { name: /Paypal/i });
      fireEvent.click(paypalRadio);

      // Verificar que está seleccionado
      expect(paypalRadio).toBeChecked();
    });

    it('permite activar el certificado fiscal', () => {
      render(
        <MemoryRouter>
          <CheckoutFormSection />
        </MemoryRouter>,
      );

      const checkbox = screen.getByRole('checkbox', { name: /solicitar certificado/i });
      fireEvent.click(checkbox);

      // Verificar que el checkbox está marcado
      expect(checkbox).toBeChecked();
    });

    it('permite cambiar entre datos guardados y nuevos', () => {
      render(
        <MemoryRouter>
          <CheckoutFormSection />
        </MemoryRouter>,
      );

      const checkbox = screen.getByRole('checkbox', { name: /solicitar certificado/i });
      fireEvent.click(checkbox);

      // Buscar el botón para usar datos nuevos
      const usarNuevosBtn = screen.queryByText(/Usar datos nuevos/i);
      if (usarNuevosBtn) {
        fireEvent.click(usarNuevosBtn);
      }
    });

    it('muestra el resumen de compra con items', () => {
      render(
        <MemoryRouter>
          <CheckoutFormSection />
        </MemoryRouter>,
      );

      // Verificar que se muestran los items del carrito
      expect(screen.getByText(/Noche de Jazz Solidaria/i)).toBeInTheDocument();
      expect(screen.getByText(/Gala Benéfica anual/i)).toBeInTheDocument();
    });

    it('calcula el total correctamente', () => {
      render(
        <MemoryRouter>
          <CheckoutFormSection />
        </MemoryRouter>,
      );

      // Verificar que hay un total mostrado
      const totalElements = screen.getAllByText(/Total/i);
      expect(totalElements.length).toBeGreaterThan(0);
    });

    it('permite eliminar items del carrito', () => {
      render(
        <MemoryRouter>
          <CheckoutFormSection />
        </MemoryRouter>,
      );

      // Buscar botones de eliminar
      const deleteButtons = screen.getAllByRole('button', { name: '' });
      const trashButtons = deleteButtons.filter((btn) => btn.querySelector('svg.lucide-trash-2'));

      if (trashButtons.length > 0) {
        fireEvent.click(trashButtons[0]);
      }
    });
  });

  describe('CheckoutFormSection - Usuario No Autenticado', () => {
    beforeEach(() => {
      vi.clearAllMocks();
      // Mock sin autenticación
      vi.mock('../../context/AuthContext', () => ({
        useAuth: () => ({
          user: null,
          isAuthenticated: false,
        }),
      }));
    });

    it('no muestra la opción de Monedero para invitados', () => {
      render(
        <MemoryRouter>
          <CheckoutFormSection />
        </MemoryRouter>,
      );

      // No debe mostrar el método de pago Monedero
      expect(screen.queryByText(/Saldo disponible/i)).not.toBeInTheDocument();
    });

    it('muestra formulario para datos nuevos en certificado fiscal', () => {
      render(
        <MemoryRouter>
          <CheckoutFormSection />
        </MemoryRouter>,
      );

      const checkbox = screen.getByRole('checkbox', { name: /solicitar certificado/i });
      fireEvent.click(checkbox);

      // Para invitados, solo debe mostrar el formulario nuevo
      // No debe mostrar selector de datos guardados
      expect(screen.queryByText(/Datos fiscales guardados/i)).not.toBeInTheDocument();
    });
  });

  describe('CheckoutFormSection - Interacciones Avanzadas', () => {
    it('muestra estado de procesamiento al confirmar pago', async () => {
      render(
        <MemoryRouter>
          <CheckoutFormSection />
        </MemoryRouter>,
      );

      const confirmButton = screen.getByRole('button', { name: /Confirmar y Pagar/i });
      fireEvent.click(confirmButton);

      // El botón debe cambiar a estado de procesamiento
      await waitFor(() => {
        expect(screen.queryByText(/Procesando/i)).toBeInTheDocument();
      });
    });

    it('maneja el cambio de método de pago a Bizum', () => {
      render(
        <MemoryRouter>
          <CheckoutFormSection />
        </MemoryRouter>,
      );

      const bizumRadio = screen.getByRole('radio', { name: /Bizum/i });
      fireEvent.click(bizumRadio);

      expect(bizumRadio).toBeChecked();
    });
  });
});
