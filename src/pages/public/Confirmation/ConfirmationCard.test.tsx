import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { ConfirmationCard } from './ConfirmationCard';
import type { AuthContextType } from '../../../context/AuthContext';

// Mock del AuthContext
const mockUseAuth = vi.fn();
vi.mock('../../../context/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

// Mock de useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({
      state: { compraId: 'CUD-1234', email: 'test@example.com' },
    }),
  };
});

describe('ConfirmationCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Usuario Autenticado', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        user: { id: 1, email: 'user@test.com', nombre: 'Test User', roles: ['COMPRADOR'] },
      } as AuthContextType);
    });

    it('renderiza correctamente para usuario autenticado', () => {
      render(
        <BrowserRouter>
          <ConfirmationCard />
        </BrowserRouter>,
      );

      expect(screen.getByText('¡Pago Completado!')).toBeInTheDocument();
      expect(screen.getByText('Gracias por tu colaboración')).toBeInTheDocument();
      // El ID puede variar según location.state
      expect(screen.getByText(/Referencia del Pedido/i)).toBeInTheDocument();
    });

    it('muestra botones de navegación para usuarios autenticados', () => {
      render(
        <BrowserRouter>
          <ConfirmationCard />
        </BrowserRouter>,
      );

      expect(screen.getByText('Ver Mis Entradas')).toBeInTheDocument();
      expect(screen.getByText('Volver al Inicio')).toBeInTheDocument();

      // No debe mostrar el mensaje de crear cuenta
      expect(screen.queryByText('¿Quieres guardar tus entradas?')).not.toBeInTheDocument();
    });

    it('navega a perfil cuando se hace click en Ver Mis Entradas', () => {
      render(
        <BrowserRouter>
          <ConfirmationCard />
        </BrowserRouter>,
      );

      const verEntradasBtn = screen.getByText('Ver Mis Entradas');
      fireEvent.click(verEntradasBtn);

      expect(mockNavigate).toHaveBeenCalledWith('/perfil?tab=entradas');
    });

    it('navega al inicio cuando se hace click en Volver al Inicio', () => {
      render(
        <BrowserRouter>
          <ConfirmationCard />
        </BrowserRouter>,
      );

      const volverBtn = screen.getByText('Volver al Inicio');
      fireEvent.click(volverBtn);

      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  describe('Usuario Invitado (No Autenticado)', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        user: null,
      } as AuthContextType);
    });

    it('renderiza correctamente para usuario invitado', () => {
      render(
        <BrowserRouter>
          <ConfirmationCard />
        </BrowserRouter>,
      );

      expect(screen.getByText('¡Pago Completado!')).toBeInTheDocument();
      expect(screen.getByText('Gracias por tu colaboración')).toBeInTheDocument();
    });

    it('muestra mensaje de invitación a crear cuenta', () => {
      render(
        <BrowserRouter>
          <ConfirmationCard />
        </BrowserRouter>,
      );

      expect(screen.getByText('¿Quieres guardar tus entradas?')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Crea una cuenta ahora para tener siempre a mano tus entradas y facturas.',
        ),
      ).toBeInTheDocument();
      expect(screen.getByText('Crear Cuenta Gratis')).toBeInTheDocument();
    });

    it('navega a registro cuando se hace click en Crear Cuenta', () => {
      render(
        <BrowserRouter>
          <ConfirmationCard />
        </BrowserRouter>,
      );

      const crearCuentaBtn = screen.getByText('Crear Cuenta Gratis');
      fireEvent.click(crearCuentaBtn);

      expect(mockNavigate).toHaveBeenCalledWith('/registro');
    });

    it('navega al inicio cuando invitado hace click en Volver al Inicio', () => {
      render(
        <BrowserRouter>
          <ConfirmationCard />
        </BrowserRouter>,
      );

      const volverBtn = screen.getByText('Volver al Inicio');
      fireEvent.click(volverBtn);

      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('muestra mensaje de envío de entradas', () => {
      render(
        <BrowserRouter>
          <ConfirmationCard />
        </BrowserRouter>,
      );

      expect(screen.getByText('Hemos enviado tus entradas a:')).toBeInTheDocument();
    });
  });

  describe('Sin información de compra', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        user: null,
      } as AuthContextType);

      // Mock useLocation sin datos
      vi.mock('react-router-dom', async () => {
        const actual = await vi.importActual('react-router-dom');
        return {
          ...actual,
          useNavigate: () => mockNavigate,
          useLocation: () => ({
            state: null,
          }),
        };
      });
    });

    it('muestra datos por defecto cuando no hay información', () => {
      render(
        <MemoryRouter>
          <ConfirmationCard />
        </MemoryRouter>,
      );

      // Debería mostrar el ID por defecto
      expect(screen.getByText(/#CUD-XXXX/)).toBeInTheDocument();
    });
  });

  describe('Renderizado de Iconos', () => {
    it('renderiza todos los iconos correctamente para usuario autenticado', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        user: { id: 1, email: 'user@test.com', nombre: 'Test User', roles: ['COMPRADOR'] },
      } as AuthContextType);

      const { container } = render(
        <BrowserRouter>
          <ConfirmationCard />
        </BrowserRouter>,
      );

      // Verificar que hay iconos SVG renderizados
      const svgs = container.querySelectorAll('svg');
      expect(svgs.length).toBeGreaterThan(0);
    });

    it('renderiza todos los iconos correctamente para usuario invitado', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        user: null,
      } as AuthContextType);

      const { container } = render(
        <BrowserRouter>
          <ConfirmationCard />
        </BrowserRouter>,
      );

      // Verificar que hay iconos SVG renderizados
      const svgs = container.querySelectorAll('svg');
      expect(svgs.length).toBeGreaterThan(0);
    });
  });

  describe('Mensajes y Textos Informativos', () => {
    it('muestra el mensaje de correo enviado', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        user: { id: 1, email: 'user@test.com' },
      } as AuthContextType);

      render(
        <BrowserRouter>
          <ConfirmationCard />
        </BrowserRouter>,
      );

      expect(screen.getByText('Hemos enviado tus entradas a:')).toBeInTheDocument();
      expect(screen.getByText('¿No lo recibes? Revisa tu carpeta de spam.')).toBeInTheDocument();
    });

    it('muestra el título de referencia del pedido', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        user: { id: 1, email: 'user@test.com' },
      } as AuthContextType);

      render(
        <BrowserRouter>
          <ConfirmationCard />
        </BrowserRouter>,
      );

      expect(screen.getByText('Referencia del Pedido')).toBeInTheDocument();
    });
  });
});
