import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

// Importamos las páginas
import Login from '../../features/auth/LoginPage';
import Registro from '../../features/auth/RegisterPage';
import Checkout from './Checkout';
import DetallesEvento from './DetallesEvento';
import Home from '../../pages/Home';
import PerfilUsuario from '../../pages/PerfilUsuario';
import { CartProvider } from '../../context/CartContext';

// Mock del AuthContext con vi.hoisted
const { mockLogin, mockRegister, mockUseAuth } = vi.hoisted(() => ({
  mockLogin: vi.fn(),
  mockRegister: vi.fn(),
  mockUseAuth: vi.fn(),
}));

vi.mock('../../context/AuthContext', () => ({
  useAuth: mockUseAuth,
}));

// Mock de Sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock de hooks usados en PerfilUsuario y Checkout
vi.mock('../../services/perfil.service', () => ({
  obtenerEntradasUsuario: vi.fn().mockResolvedValue([]),
  obtenerHistorialCompras: vi.fn().mockResolvedValue([]),
  descargarPdfEntrada: vi.fn(),
}));

vi.mock('../../services/checkout.service', () => ({
  obtenerDatosFiscalesUsuario: vi.fn().mockResolvedValue([]),
  procesarCheckout: vi.fn(),
  confirmarPago: vi.fn(),
}));

// Mock assets
vi.mock('../../assets/FotoLogin.png', () => ({ default: 'test-file-stub' }));
vi.mock('../../assets/ImagenLogoCudecaLigth.png', () => ({ default: 'test-file-stub' }));
vi.mock('../../assets/ImagenLogoCudecaDark.png', () => ({ default: 'test-file-stub' }));

describe('Páginas Públicas (Cobertura)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock implementation
    mockUseAuth.mockReturnValue({
      login: mockLogin,
      register: mockRegister,
      isAuthenticated: false,
      user: null,
      isLoading: false,
    });
  });

  it('renderiza la página de Home', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );
    expect(screen.getByText(/Eres pieza/i)).toBeInTheDocument();
  });

  it('renderiza la página de Login y permite interacción', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );
    expect(screen.getByText(/Inicia sesión/i)).toBeInTheDocument();

    const emailInput = screen.getByLabelText(/Correo electrónico/i);
    const passwordInput = screen.getByLabelText(/^Contraseña$/i);
    const submitButton = screen.getByRole('button', { name: /Iniciar sesión/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123', false);
    });
  });

  it('renderiza la página de Registro y permite interacción', async () => {
    render(
      <MemoryRouter>
        <Registro />
      </MemoryRouter>,
    );
    expect(screen.getByText(/Regístrate gratis/i)).toBeInTheDocument();

    const nameInput = screen.getByLabelText(/Nombre completo/i);
    const emailInput = screen.getByLabelText(/Correo electrónico/i);
    const passwordInput = screen.getByLabelText(/^Contraseña\*/i);
    const confirmPasswordInput = screen.getByLabelText(/Confirmar Contraseña/i);

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'new@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123@' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'Password123@' } });

    const termsCheckbox = screen.getByRole('checkbox', { name: /Acepto los/i });
    fireEvent.click(termsCheckbox);

    const submitButton = screen.getByRole('button', { name: /Crear cuenta/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalled();
    });
  });

  it('renderiza la página de Checkout', () => {
    // Checkout requiere AuthProvider y CartProvider mockeados
    const { container } = render(
      <MemoryRouter>
        <CartProvider>
          <Checkout />
        </CartProvider>
      </MemoryRouter>,
    );
    // Solo verificamos que se renderiza sin crash
    expect(container).toBeInTheDocument();
  });

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

  it('renderiza el Perfil de Usuario', async () => {
    mockUseAuth.mockReturnValue({
      user: { id: 1, nombre: 'Juan Carlos', email: 'juan@test.com' },
      isAuthenticated: true,
      isLoading: false,
      login: mockLogin,
      register: mockRegister,
    });

    render(
      <MemoryRouter>
        <PerfilUsuario />
      </MemoryRouter>,
    );

    expect(screen.getByText(/Juan Carlos/i)).toBeInTheDocument();
  });
});
