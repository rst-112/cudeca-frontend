import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

// Importamos las páginas
import Login from '../../features/auth/LoginPage';
import Registro from '../../features/auth/RegisterPage';
import Checkout from './Checkout';
import DetallesEvento from './DetallesEvento';
import Home from '../Home';

// Mock del AuthContext
const mockLogin = vi.fn();
const mockRegister = vi.fn();

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
    register: mockRegister,
    isAuthenticated: false,
    user: null,
  }),
}));

// Mock de Sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('Páginas Públicas (Cobertura)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza la página de Home', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );
    expect(screen.getByRole('heading', { name: /Eres pieza/i })).toBeInTheDocument();
  });

  it('renderiza la página de Login y permite interacción', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );
    expect(screen.getByText(/Inicia sesión/i)).toBeInTheDocument();

    const emailInput = screen.getByLabelText(/Correo electrónico/i);
    // Usamos regex exacto para evitar coincidencia con el botón "Mostrar contraseña"
    const passwordInput = screen.getByLabelText(/^Contraseña$/i);
    // El botón tiene aria-label="Iniciar sesión" que tiene precedencia sobre el texto "Entrar"
    const submitButton = screen.getByRole('button', { name: /Iniciar sesión/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('muestra errores de validación en Login', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );
    const submitButton = screen.getByRole('button', { name: /Iniciar sesión/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Email inválido/i)).toBeInTheDocument();
      expect(
        screen.getByText(/La contraseña debe tener al menos 6 caracteres/i),
      ).toBeInTheDocument();
    });
  });

  it('maneja error en Login', async () => {
    mockLogin.mockRejectedValueOnce(new Error('Error de prueba'));
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );

    const emailInput = screen.getByLabelText(/Correo electrónico/i);
    const passwordInput = screen.getByLabelText(/^Contraseña$/i);
    const submitButton = screen.getByRole('button', { name: /Iniciar sesión/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
    });
  });

  it('alterna la visibilidad de la contraseña en Login', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );
    const passwordInput = screen.getByLabelText(/^Contraseña$/i);
    expect(passwordInput).toHaveAttribute('type', 'password');

    const toggleButton = screen.getByRole('button', { name: /Mostrar contraseña/i });
    fireEvent.click(toggleButton);

    expect(passwordInput).toHaveAttribute('type', 'text');

    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
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
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });

    // Intentar marcar el checkbox
    const termsCheckbox = screen.getByLabelText(/Acepto los/i);
    fireEvent.click(termsCheckbox);

    // El botón tiene aria-label="Crear cuenta" que tiene precedencia sobre el texto "Registrarse"
    const submitButton = screen.getByRole('button', { name: /Crear cuenta/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalled();
    });
  });

  it('muestra errores de validación en Registro', async () => {
    render(
      <MemoryRouter>
        <Registro />
      </MemoryRouter>,
    );
    const submitButton = screen.getByRole('button', { name: /Crear cuenta/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/El nombre debe tener al menos 2 caracteres/i)).toBeInTheDocument();
      expect(screen.getByText(/Email inválido/i)).toBeInTheDocument();
      expect(
        screen.getByText(/La contraseña debe tener al menos 6 caracteres/i),
      ).toBeInTheDocument();
      expect(screen.getByText(/Debes aceptar los términos y condiciones/i)).toBeInTheDocument();
    });
  });

  it('maneja error en Registro', async () => {
    mockRegister.mockRejectedValueOnce(new Error('Error de prueba'));
    render(
      <MemoryRouter>
        <Registro />
      </MemoryRouter>,
    );

    const nameInput = screen.getByLabelText(/Nombre completo/i);
    const emailInput = screen.getByLabelText(/Correo electrónico/i);
    const passwordInput = screen.getByLabelText(/^Contraseña\*/i);
    const confirmPasswordInput = screen.getByLabelText(/Confirmar Contraseña/i);
    const termsCheckbox = screen.getByLabelText(/Acepto los/i);

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'new@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(termsCheckbox);

    const submitButton = screen.getByRole('button', { name: /Crear cuenta/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalled();
    });
  });

  it('alterna la visibilidad de la contraseña y confirmación en Registro', () => {
    render(
      <MemoryRouter>
        <Registro />
      </MemoryRouter>,
    );

    // Password
    const passwordInput = screen.getByLabelText(/^Contraseña\*/i);
    expect(passwordInput).toHaveAttribute('type', 'password');

    // Hay dos botones de mostrar contraseña, uno para cada campo.
    // El primero es para la contraseña
    const toggleButtons = screen.getAllByRole('button', { name: /Mostrar contraseña/i });
    const passwordToggle = toggleButtons[0];

    fireEvent.click(passwordToggle);
    expect(passwordInput).toHaveAttribute('type', 'text');

    fireEvent.click(passwordToggle);
    expect(passwordInput).toHaveAttribute('type', 'password');

    // Confirm Password
    const confirmInput = screen.getByLabelText(/Confirmar Contraseña/i);
    expect(confirmInput).toHaveAttribute('type', 'password');

    const confirmToggle = toggleButtons[1];

    fireEvent.click(confirmToggle);
    expect(confirmInput).toHaveAttribute('type', 'text');

    fireEvent.click(confirmToggle);
    expect(confirmInput).toHaveAttribute('type', 'password');
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
