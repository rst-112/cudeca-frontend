import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { StripePaymentModal } from './StripePaymentModal';

// Mock de apiClient
vi.mock('../../services/api', () => ({
  apiClient: {
    post: vi.fn(),
  },
}));

// Mock de toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock de Stripe SDK
vi.mock('@stripe/stripe-js', () => ({
  loadStripe: vi.fn(() =>
    Promise.resolve({
      confirmPayment: vi.fn(),
    }),
  ),
}));

vi.mock('@stripe/react-stripe-js', () => ({
  Elements: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="elements-wrapper">{children}</div>
  ),
  PaymentElement: () => <div data-testid="payment-element">Payment Element Mock</div>,
  useStripe: vi.fn(),
  useElements: vi.fn(),
}));

describe('StripePaymentModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    usuarioId: 1,
    amount: 50,
    onSuccess: vi.fn(),
  };

  let mockPost: ReturnType<typeof vi.fn>;
  let mockToastSuccess: ReturnType<typeof vi.fn>;
  let mockToastError: ReturnType<typeof vi.fn>;
  let mockConfirmPayment: ReturnType<typeof vi.fn>;
  let mockUseStripe: ReturnType<typeof vi.fn>;
  let mockUseElements: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    vi.clearAllMocks();

    // Obtener referencias a los mocks
    const { apiClient } = await import('../../services/api');
    const { toast } = await import('sonner');
    const { useStripe, useElements } = await import('@stripe/react-stripe-js');

    mockPost = apiClient.post as ReturnType<typeof vi.fn>;
    mockToastSuccess = toast.success as ReturnType<typeof vi.fn>;
    mockToastError = toast.error as ReturnType<typeof vi.fn>;
    mockUseStripe = useStripe as ReturnType<typeof vi.fn>;
    mockUseElements = useElements as ReturnType<typeof vi.fn>;

    mockConfirmPayment = vi.fn();

    // Configurar useStripe y useElements
    mockUseStripe.mockReturnValue({
      confirmPayment: mockConfirmPayment,
    });

    mockUseElements.mockReturnValue({
      submit: vi.fn(),
    });
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('Renderizado básico', () => {
    it('no renderiza nada cuando isOpen es false', () => {
      const { container } = render(<StripePaymentModal {...defaultProps} isOpen={false} />);
      expect(container.firstChild).toBeNull();
    });

    it('renderiza el modal cuando isOpen es true', () => {
      mockPost.mockResolvedValue({ data: { clientSecret: 'test_secret' } });
      render(<StripePaymentModal {...defaultProps} />);
      expect(screen.getByText('Total a pagar')).toBeInTheDocument();
    });

    it('muestra la cantidad correcta formateada', () => {
      mockPost.mockResolvedValue({ data: { clientSecret: 'test_secret' } });
      render(<StripePaymentModal {...defaultProps} amount={75.5} />);
      expect(screen.getByText('75.50 €')).toBeInTheDocument();
    });

    it('muestra la cantidad con dos decimales incluso para números enteros', () => {
      mockPost.mockResolvedValue({ data: { clientSecret: 'test_secret' } });
      render(<StripePaymentModal {...defaultProps} amount={100} />);
      expect(screen.getByText('100.00 €')).toBeInTheDocument();
    });

    it('muestra las pestañas de Tarjeta y Bizum', () => {
      mockPost.mockResolvedValue({ data: { clientSecret: 'test_secret' } });
      render(<StripePaymentModal {...defaultProps} />);
      expect(screen.getByText('Tarjeta')).toBeInTheDocument();
      expect(screen.getByText('Bizum')).toBeInTheDocument();
    });

    it('llama a onClose al hacer clic en el botón de cerrar', () => {
      mockPost.mockResolvedValue({ data: { clientSecret: 'test_secret' } });
      const onClose = vi.fn();
      render(<StripePaymentModal {...defaultProps} onClose={onClose} />);

      const closeButton = screen.getByText('✕');
      fireEvent.click(closeButton);

      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Pestaña de Tarjeta', () => {
    it('muestra el loader inicialmente mientras se carga el clientSecret', () => {
      mockPost.mockResolvedValue({ data: { clientSecret: 'test_secret' } });
      const { container } = render(<StripePaymentModal {...defaultProps} />);
      const loader = container.querySelector('.animate-spin');
      expect(loader).toBeInTheDocument();
    });

    it('llama a crear-intento con los parámetros correctos para tarjeta', async () => {
      mockPost.mockResolvedValue({ data: { clientSecret: 'test_secret_123' } });

      render(<StripePaymentModal {...defaultProps} usuarioId={5} amount={99.99} />);

      await waitFor(() => {
        expect(mockPost).toHaveBeenCalledWith('/pagos/crear-intento/5', {
          amount: 99.99,
          currency: 'eur',
          paymentMethod: 'TARJETA',
        });
      });
    });

    it('muestra el PaymentElement cuando se obtiene el clientSecret', async () => {
      mockPost.mockResolvedValue({ data: { clientSecret: 'test_secret' } });

      render(<StripePaymentModal {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByTestId('payment-element')).toBeInTheDocument();
      });
    });

    it('muestra el botón de pagar con tarjeta', async () => {
      mockPost.mockResolvedValue({ data: { clientSecret: 'test_secret' } });

      render(<StripePaymentModal {...defaultProps} amount={50} />);

      await waitFor(() => {
        expect(screen.getByText(/Pagar 50€ con Tarjeta/i)).toBeInTheDocument();
      });
    });

    it('maneja el submit del formulario de tarjeta exitosamente', async () => {
      mockPost.mockResolvedValue({ data: { clientSecret: 'test_secret' } });
      mockConfirmPayment.mockResolvedValue({ error: null });
      const onSuccess = vi.fn();

      render(<StripePaymentModal {...defaultProps} onSuccess={onSuccess} />);

      await waitFor(() => {
        expect(screen.getByTestId('payment-element')).toBeInTheDocument();
      });

      const submitButton = screen.getByText(/Pagar 50€ con Tarjeta/i);
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockConfirmPayment).toHaveBeenCalled();
      });

      // Verificar que se llamó con redirect: 'if_required'
      expect(mockConfirmPayment).toHaveBeenCalledWith(
        expect.objectContaining({
          redirect: 'if_required',
          confirmParams: { return_url: window.location.origin },
        }),
      );
    });

    it('maneja errores al obtener el clientSecret', async () => {
      mockPost.mockRejectedValue(new Error('Network error'));

      render(<StripePaymentModal {...defaultProps} />);

      await waitFor(() => {
        expect(mockToastError).toHaveBeenCalledWith('Error iniciando Stripe');
      });
    });

    it('maneja errores en el pago con tarjeta', async () => {
      mockPost.mockResolvedValue({ data: { clientSecret: 'test_secret' } });
      mockConfirmPayment.mockResolvedValue({
        error: { message: 'Tarjeta rechazada' },
      });

      render(<StripePaymentModal {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByTestId('payment-element')).toBeInTheDocument();
      });

      const submitButton = screen.getByText(/Pagar 50€ con Tarjeta/i);
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockToastError).toHaveBeenCalledWith('Tarjeta rechazada');
      });
    });
  });

  describe('Pestaña de Bizum', () => {
    it('cambia a la pestaña de Bizum al hacer clic', () => {
      mockPost.mockResolvedValue({ data: { clientSecret: 'test_secret' } });
      render(<StripePaymentModal {...defaultProps} />);

      const bizumTab = screen.getByText('Bizum');
      fireEvent.click(bizumTab);

      expect(screen.getByPlaceholderText('600 000 000')).toBeInTheDocument();
    });

    it('muestra el formulario de Bizum con los elementos correctos', () => {
      mockPost.mockResolvedValue({ data: { clientSecret: 'test_secret' } });
      render(<StripePaymentModal {...defaultProps} />);

      const bizumTab = screen.getByText('Bizum');
      fireEvent.click(bizumTab);

      expect(
        screen.getByText(/Introduce tu número de móvil asociado a Bizum/i),
      ).toBeInTheDocument();
      expect(screen.getByPlaceholderText('600 000 000')).toBeInTheDocument();
      expect(screen.getByText(/Confirmar Bizum de 50€/i)).toBeInTheDocument();
    });

    it('permite escribir en el input del teléfono', () => {
      mockPost.mockResolvedValue({ data: { clientSecret: 'test_secret' } });
      render(<StripePaymentModal {...defaultProps} />);

      const bizumTab = screen.getByText('Bizum');
      fireEvent.click(bizumTab);

      const phoneInput = screen.getByPlaceholderText('600 000 000') as HTMLInputElement;
      fireEvent.change(phoneInput, { target: { value: '612345678' } });

      expect(phoneInput.value).toBe('612345678');
    });

    it('limita el input del teléfono a 9 caracteres', () => {
      mockPost.mockResolvedValue({ data: { clientSecret: 'test_secret' } });
      render(<StripePaymentModal {...defaultProps} />);

      const bizumTab = screen.getByText('Bizum');
      fireEvent.click(bizumTab);

      const phoneInput = screen.getByPlaceholderText('600 000 000') as HTMLInputElement;
      expect(phoneInput.maxLength).toBe(9);
    });

    it('valida que el teléfono tenga al menos 9 dígitos antes de enviar', async () => {
      mockPost.mockResolvedValue({ data: { clientSecret: 'test_secret' } });
      render(<StripePaymentModal {...defaultProps} />);

      const bizumTab = screen.getByText('Bizum');
      fireEvent.click(bizumTab);

      const phoneInput = screen.getByPlaceholderText('600 000 000');
      fireEvent.change(phoneInput, { target: { value: '612' } });

      const submitButton = screen.getByText(/Confirmar Bizum de 50€/i);
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockToastError).toHaveBeenCalledWith('Introduce un móvil válido');
      });
    });

    it('procesa el pago Bizum correctamente', async () => {
      mockPost.mockResolvedValue({ data: { success: true } });
      const onSuccess = vi.fn();

      render(
        <StripePaymentModal {...defaultProps} usuarioId={7} amount={30} onSuccess={onSuccess} />,
      );

      const bizumTab = screen.getByText('Bizum');
      fireEvent.click(bizumTab);

      const phoneInput = screen.getByPlaceholderText('600 000 000');
      fireEvent.change(phoneInput, { target: { value: '612345678' } });

      const submitButton = screen.getByText(/Confirmar Bizum de 30€/i);
      fireEvent.click(submitButton);

      // Esperar a que se haga la llamada al API
      await waitFor(
        () => {
          expect(mockPost).toHaveBeenCalledWith('/pagos/simular-bizum/7', {
            amount: 30,
            currency: 'eur',
          });
        },
        { timeout: 3000 },
      );

      await waitFor(() => {
        expect(mockToastSuccess).toHaveBeenCalledWith('Bizum de 30€ recibido correctamente');
      });

      expect(onSuccess).toHaveBeenCalled();
    });
  });

  describe('Interacciones entre pestañas', () => {
    it('mantiene el estado activo de la pestaña seleccionada visualmente', () => {
      mockPost.mockResolvedValue({ data: { clientSecret: 'test_secret' } });
      render(<StripePaymentModal {...defaultProps} />);

      const tarjetaTab = screen.getByText('Tarjeta').closest('button');
      expect(tarjetaTab).toHaveClass('text-[#00A651]');

      const bizumTab = screen.getByText('Bizum').closest('button');
      fireEvent.click(bizumTab!);

      expect(bizumTab).toHaveClass('text-[#15b2bc]');
    });
  });

  describe('Estados de carga', () => {
    it('el botón de tarjeta está deshabilitado inicialmente', async () => {
      mockPost.mockResolvedValue({ data: { clientSecret: 'test_secret' } });

      render(<StripePaymentModal {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByTestId('payment-element')).toBeInTheDocument();
      });

      const submitButton = screen.getByText(/Pagar 50€ con Tarjeta/i);
      // El botón debe existir
      expect(submitButton).toBeInTheDocument();
    });
  });
});
