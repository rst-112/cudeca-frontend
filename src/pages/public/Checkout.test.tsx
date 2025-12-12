import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Checkout from './Checkout';
import * as checkoutService from '../../services/checkout.service';
import { toast } from 'sonner';

// Mock de servicios
vi.mock('../../services/checkout.service');
vi.mock('sonner');

// Mock de useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Checkout - Branches Coverage', () => {
  const mockDatosFiscales = [
    {
      id: 1,
      nif: '12345678A',
      nombre: 'Usuario Test',
      direccion: 'Calle Test 123',
      ciudad: 'Málaga',
      codigoPostal: '29001',
      pais: 'España',
      esPrincipal: true,
    },
    {
      id: 2,
      nif: '87654321B',
      nombre: 'Usuario Test 2',
      direccion: 'Calle Test 456',
      ciudad: 'Marbella',
      codigoPostal: '29600',
      pais: 'España',
      esPrincipal: false,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(checkoutService.obtenerDatosFiscalesUsuario).mockResolvedValue(mockDatosFiscales);
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  describe('Carga inicial y datos fiscales', () => {
    it('debe cargar datos fiscales y seleccionar el principal por defecto', async () => {
      renderWithRouter(<Checkout />);

      await waitFor(() => {
        expect(checkoutService.obtenerDatosFiscalesUsuario).toHaveBeenCalledWith(1);
      });
    });

    it('debe manejar error al cargar datos fiscales', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.mocked(checkoutService.obtenerDatosFiscalesUsuario).mockRejectedValue(
        new Error('Error de red')
      );

      renderWithRouter(<Checkout />);

      await waitFor(() => {
        expect(consoleError).toHaveBeenCalledWith(
          'Error al cargar datos fiscales:',
          expect.any(Error)
        );
      });

      consoleError.mockRestore();
    });

    it('debe cargar sin seleccionar datos fiscales si no hay principal', async () => {
      const datosSinPrincipal = mockDatosFiscales.map((d) => ({ ...d, esPrincipal: false }));
      vi.mocked(checkoutService.obtenerDatosFiscalesUsuario).mockResolvedValue(datosSinPrincipal);

      renderWithRouter(<Checkout />);

      await waitFor(() => {
        expect(checkoutService.obtenerDatosFiscalesUsuario).toHaveBeenCalled();
      });
    });
  });

  describe('Solicitar certificado de donación', () => {
    it('debe mostrar formulario si no hay datos fiscales y se activa certificado', async () => {
      vi.mocked(checkoutService.obtenerDatosFiscalesUsuario).mockResolvedValue([]);

      renderWithRouter(<Checkout />);

      await waitFor(() => {
        expect(screen.getByText('Solicitar Certificado de Donación')).toBeInTheDocument();
      });

      const switchCertificado = screen.getByRole('switch');
      fireEvent.click(switchCertificado);

      await waitFor(() => {
        expect(screen.getByLabelText(/NIF/)).toBeInTheDocument();
      });
    });

    it('debe mostrar selector de datos fiscales existentes cuando se activa certificado', async () => {
      renderWithRouter(<Checkout />);

      await waitFor(() => {
        expect(screen.getByText('Solicitar Certificado de Donación')).toBeInTheDocument();
      });

      const switchCertificado = screen.getByRole('switch');
      fireEvent.click(switchCertificado);


      await waitFor(() => {
        expect(screen.getByText(/Selecciona Datos Fiscales/i)).toBeInTheDocument();
      });
    });
  });

  describe('Validación de datos fiscales', () => {
    it('debe validar que se completen todos los campos del formulario nuevo', async () => {
      vi.mocked(checkoutService.obtenerDatosFiscalesUsuario).mockResolvedValue([]);

      renderWithRouter(<Checkout />);

      await waitFor(() => {
        const switchCertificado = screen.getByRole('switch');
        fireEvent.click(switchCertificado);
      });

      const btnConfirmar = screen.getByText('Confirmar Compra');
      fireEvent.click(btnConfirmar);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Completa todos los campos de datos fiscales');
      });
    });

    it('debe validar formato NIF en formulario nuevo', async () => {
      vi.mocked(checkoutService.obtenerDatosFiscalesUsuario).mockResolvedValue([]);

      renderWithRouter(<Checkout />);

      await waitFor(() => {
        const switchCertificado = screen.getByRole('switch');
        fireEvent.click(switchCertificado);
      });

      // Rellenar campos con NIF inválido
      fireEvent.change(screen.getByLabelText(/NIF/), { target: { value: 'INVALIDO' } });
      fireEvent.change(screen.getByLabelText(/Nombre Completo/), {
        target: { value: 'Test User' },
      });
      fireEvent.change(screen.getByLabelText(/Dirección/), {
        target: { value: 'Calle Test 1' },
      });
      fireEvent.change(screen.getByLabelText(/Ciudad/), { target: { value: 'Málaga' } });
      fireEvent.change(screen.getByLabelText(/Código Postal/), { target: { value: '29001' } });

      const btnConfirmar = screen.getByText('Confirmar Compra');
      fireEvent.click(btnConfirmar);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          'El NIF debe tener 8 números seguidos de una letra'
        );
      });
    });


    it('debe permitir confirmar sin certificado', async () => {
      vi.mocked(checkoutService.procesarCheckout).mockResolvedValue({
        compraId: 123,
        urlPago: 'http://pago.test',
        importeTotal: 52.50,
        mensaje: 'Compra procesada correctamente',
      });
      vi.mocked(checkoutService.confirmarPago).mockResolvedValue({
        success: true,
        message: 'Pago confirmado',
        compraId: 123,
      });

      renderWithRouter(<Checkout />);

      await waitFor(() => {
        expect(screen.getByText('Confirmar Compra')).toBeInTheDocument();
      });

      const btnConfirmar = screen.getByText('Confirmar Compra');
      fireEvent.click(btnConfirmar);

      await waitFor(() => {
        expect(checkoutService.procesarCheckout).toHaveBeenCalledWith(
          expect.objectContaining({
            solicitarCertificado: false,
          })
        );
      });
    });
  });

  describe('Proceso de compra', () => {
    it('debe procesar compra exitosamente con datos fiscales existentes', async () => {
      vi.mocked(checkoutService.procesarCheckout).mockResolvedValue({
        compraId: 123,
        urlPago: 'http://pago.test',
        importeTotal: 52.50,
        mensaje: 'Compra procesada correctamente',
      });
      vi.mocked(checkoutService.confirmarPago).mockResolvedValue({
        success: true,
        message: 'Pago confirmado',
        compraId: 123,
      });

      renderWithRouter(<Checkout />);

      // Esperar a que el componente se cargue completamente
      await waitFor(() => {
        expect(screen.getByText('Confirmar Compra')).toBeInTheDocument();
      });

      const switchCertificado = screen.getByRole('switch');
      fireEvent.click(switchCertificado);

      // Esperar a que el estado se actualice
      await waitFor(() => {
        expect(switchCertificado).toBeChecked();
      });

      const btnConfirmar = screen.getByText('Confirmar Compra');
      fireEvent.click(btnConfirmar);

      await waitFor(() => {
        expect(checkoutService.procesarCheckout).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('Compra procesada correctamente');
      }, { timeout: 3000 });

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('¡Compra confirmada! Redirigiendo...');
      }, { timeout: 3000 });
    });

    it('debe procesar compra con nuevos datos fiscales', async () => {
      vi.mocked(checkoutService.obtenerDatosFiscalesUsuario).mockResolvedValue([]);
      vi.mocked(checkoutService.procesarCheckout).mockResolvedValue({
        compraId: 123,
        urlPago: 'http://pago.test',
        importeTotal: 52.50,
        mensaje: 'Compra procesada correctamente',
      });
      vi.mocked(checkoutService.confirmarPago).mockResolvedValue({
        success: true,
        message: 'Pago confirmado',
        compraId: 123,
      });

      renderWithRouter(<Checkout />);

      await waitFor(() => {
        const switchCertificado = screen.getByRole('switch');
        fireEvent.click(switchCertificado);
      });

      // Rellenar formulario correctamente
      fireEvent.change(screen.getByLabelText(/NIF/), { target: { value: '12345678A' } });
      fireEvent.change(screen.getByLabelText(/Nombre Completo/), {
        target: { value: 'Test User' },
      });
      fireEvent.change(screen.getByLabelText(/Dirección/), {
        target: { value: 'Calle Test 1' },
      });
      fireEvent.change(screen.getByLabelText(/Ciudad/), { target: { value: 'Málaga' } });
      fireEvent.change(screen.getByLabelText(/Código Postal/), { target: { value: '29001' } });

      const btnConfirmar = screen.getByText('Confirmar Compra');
      fireEvent.click(btnConfirmar);

      await waitFor(() => {
        expect(checkoutService.procesarCheckout).toHaveBeenCalledWith(
          expect.objectContaining({
            solicitarCertificado: true,
            datosFiscalesId: undefined,
          })
        );
      });
    });

    it('debe manejar errores durante el proceso de compra', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.mocked(checkoutService.procesarCheckout).mockRejectedValue(
        new Error('Error de conexión')
      );

      renderWithRouter(<Checkout />);

      await waitFor(() => {
        expect(screen.getByText('Confirmar Compra')).toBeInTheDocument();
      });

      const btnConfirmar = screen.getByText('Confirmar Compra');
      fireEvent.click(btnConfirmar);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Error de conexión');
      });

      consoleError.mockRestore();
    });

    it('debe manejar errores genéricos sin mensaje', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.mocked(checkoutService.procesarCheckout).mockRejectedValue('Error desconocido');

      renderWithRouter(<Checkout />);

      const btnConfirmar = screen.getByText('Confirmar Compra');
      fireEvent.click(btnConfirmar);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Error al procesar la compra');
      });

      consoleError.mockRestore();
    });
  });

  describe('Pantalla de confirmación', () => {
    it('debe mostrar pantalla de confirmación', async () => {
      vi.mocked(checkoutService.procesarCheckout).mockResolvedValue({
        compraId: 123,
        urlPago: 'http://pago.test',
        importeTotal: 52.50,
        mensaje: 'Compra procesada correctamente',
      });
      vi.mocked(checkoutService.confirmarPago).mockResolvedValue({
        success: true,
        message: 'Pago confirmado',
        compraId: 123,
      });

      renderWithRouter(<Checkout />);

      await waitFor(() => {
        expect(screen.getByText('Confirmar Compra')).toBeInTheDocument();
      });

      const btnConfirmar = screen.getByText('Confirmar Compra');
      fireEvent.click(btnConfirmar);

      await waitFor(() => {
        expect(screen.getByText('¡Compra Confirmada!')).toBeInTheDocument();
      }, { timeout: 5000 });

      expect(screen.getByText('Ver mis entradas')).toBeInTheDocument();
    });
  });

  describe('Formulario de datos fiscales', () => {
    it('debe convertir NIF a mayúsculas automáticamente', async () => {
      vi.mocked(checkoutService.obtenerDatosFiscalesUsuario).mockResolvedValue([]);

      renderWithRouter(<Checkout />);

      await waitFor(() => {
        const switchCertificado = screen.getByRole('switch');
        fireEvent.click(switchCertificado);
      });

      await waitFor(() => {
        const nifInput = screen.getByLabelText(/NIF/);
        expect(nifInput).toBeInTheDocument();
        fireEvent.change(nifInput, { target: { value: '12345678a' } });
      });

      const nifInput = screen.getByLabelText(/NIF/);
      expect(nifInput).toHaveValue('12345678A');
    });

    it('debe permitir editar todos los campos del formulario', async () => {
      vi.mocked(checkoutService.obtenerDatosFiscalesUsuario).mockResolvedValue([]);

      renderWithRouter(<Checkout />);

      await waitFor(() => {
        const switchCertificado = screen.getByRole('switch');
        fireEvent.click(switchCertificado);
      });

      await waitFor(() => {
        expect(screen.getByLabelText(/Nombre Completo/)).toBeInTheDocument();
      });

      fireEvent.change(screen.getByLabelText(/Nombre Completo/), {
        target: { value: 'Nuevo Nombre' },
      });
      fireEvent.change(screen.getByLabelText(/Dirección/), {
        target: { value: 'Nueva Dirección' },
      });
      fireEvent.change(screen.getByLabelText(/Ciudad/), { target: { value: 'Nueva Ciudad' } });
      fireEvent.change(screen.getByLabelText(/Código Postal/), { target: { value: '12345' } });
      fireEvent.change(screen.getByLabelText(/País/), { target: { value: 'Portugal' } });

      expect(screen.getByLabelText(/Nombre Completo/)).toHaveValue('Nuevo Nombre');
      expect(screen.getByLabelText(/Dirección/)).toHaveValue('Nueva Dirección');
      expect(screen.getByLabelText(/Ciudad/)).toHaveValue('Nueva Ciudad');
      expect(screen.getByLabelText(/Código Postal/)).toHaveValue('12345');
      expect(screen.getByLabelText(/País/)).toHaveValue('Portugal');
    });
  });

  describe('Cálculo de totales', () => {
    it('debe calcular correctamente el total con comisión', () => {
      renderWithRouter(<Checkout />);

      // Los asientos demo son: 2 x 25€ = 50€
      // Comisión 5%: 2.50€
      // Total: 52.50€
      expect(screen.getByText('50.00 €')).toBeInTheDocument(); // Subtotal
      expect(screen.getByText('2.50 €')).toBeInTheDocument(); // Comisión
      expect(screen.getByText('52.50 €')).toBeInTheDocument(); // Total
    });
  });

  describe('Estados de carga', () => {
    it('debe deshabilitar botón durante la carga', async () => {
      let resolveCheckout: ((value: unknown) => void) | undefined;
      vi.mocked(checkoutService.procesarCheckout).mockImplementation(
        () => new Promise((resolve) => { resolveCheckout = resolve; })
      );

      renderWithRouter(<Checkout />);

      const btnConfirmar = screen.getByText('Confirmar Compra');
      fireEvent.click(btnConfirmar);

      await waitFor(() => {
        expect(screen.getByText('Procesando...')).toBeInTheDocument();
      });

      const processingButton = screen.getByRole('button', { name: /procesando/i });
      expect(processingButton).toBeDisabled();

      // Limpiar
      if (resolveCheckout) {
        resolveCheckout({
          compraId: 123,
          urlPago: 'http://test.com',
          importeTotal: 52.50,
          mensaje: 'OK'
        });
      }
    });
  });
});

