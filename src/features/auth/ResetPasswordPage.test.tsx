import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ResetPasswordPage from './ResetPasswordPage';
import { apiClient } from '../../services/api';
import { toast } from 'sonner';

// Mock de apiClient
vi.mock('../../services/api', () => ({
  apiClient: {
    post: vi.fn(),
  },
  isAxiosError: vi.fn((error) => error && 'response' in error),
}));

// Mock de sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock de ThemeToggle
vi.mock('../../components/ui/ThemeToggle', () => ({
  ThemeToggle: () => <div>Theme Toggle</div>,
}));

// Mock de react-router-dom navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderWithRouter = (
  component: React.ReactElement,
  initialRoute = '/reset-password?token=abc123',
) => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path="/reset-password" element={component} />
      </Routes>
    </MemoryRouter>,
  );
};

describe('ResetPasswordPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('muestra error cuando falta el token en la URL', () => {
    renderWithRouter(<ResetPasswordPage />, '/reset-password');

    expect(screen.getByText('Enlace inválido')).toBeInTheDocument();
    expect(screen.getByText(/falta el token de seguridad/i)).toBeInTheDocument();
  });

  it('renderiza el formulario correctamente con token válido', () => {
    renderWithRouter(<ResetPasswordPage />);

    expect(screen.getByText('Nueva Contraseña')).toBeInTheDocument();
    expect(screen.getByText('Nueva contraseña')).toBeInTheDocument();
    expect(screen.getByText('Confirmar contraseña')).toBeInTheDocument();
    expect(screen.getAllByPlaceholderText('••••••••')).toHaveLength(2); // Hay 2 inputs de password
    expect(screen.getByRole('button', { name: /guardar nueva contraseña/i })).toBeInTheDocument();
  });

  it('muestra error cuando las contraseñas no coinciden', async () => {
    const user = userEvent.setup();
    renderWithRouter(<ResetPasswordPage />);

    const inputs = screen.getAllByPlaceholderText('••••••••');
    const passwordInput = inputs[0];
    const confirmPasswordInput = inputs[1];
    const submitButton = screen.getByRole('button', { name: /guardar nueva contraseña/i });

    await user.type(passwordInput, 'Password123!');
    await user.type(confirmPasswordInput, 'Password456!');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Las contraseñas no coinciden')).toBeInTheDocument();
    });
  });

  it('muestra error cuando la contraseña es demasiado corta', async () => {
    const user = userEvent.setup();
    renderWithRouter(<ResetPasswordPage />);

    const passwordInput = screen.getAllByPlaceholderText('••••••••')[0];
    const submitButton = screen.getByRole('button', { name: /guardar nueva contraseña/i });

    await user.type(passwordInput, 'Pass1!');
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/la contraseña debe tener al menos 8 caracteres/i),
      ).toBeInTheDocument();
    });
  });

  it('muestra error cuando la contraseña no cumple con los requisitos', async () => {
    const user = userEvent.setup();
    renderWithRouter(<ResetPasswordPage />);

    const passwordInput = screen.getAllByPlaceholderText('••••••••')[0];
    const submitButton = screen.getByRole('button', { name: /guardar nueva contraseña/i });

    await user.type(passwordInput, 'password123'); // Sin mayúscula ni carácter especial
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/la contraseña debe contener una mayúscula/i)).toBeInTheDocument();
    });
  });

  it('envía la solicitud y redirige al login cuando es exitoso', async () => {
    const user = userEvent.setup();
    vi.mocked(apiClient.post).mockResolvedValue({ data: { success: true } });

    renderWithRouter(<ResetPasswordPage />);

    const inputs = screen.getAllByPlaceholderText('••••••••');
    const passwordInput = inputs[0];
    const confirmPasswordInput = inputs[1];
    const submitButton = screen.getByRole('button', { name: /guardar nueva contraseña/i });

    await user.type(passwordInput, 'NewPassword123!');
    await user.type(confirmPasswordInput, 'NewPassword123!');
    await user.click(submitButton);

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith('/auth/reset-password', {
        token: 'abc123',
        newPassword: 'NewPassword123!',
      });
      expect(toast.success).toHaveBeenCalledWith('¡Contraseña actualizada correctamente!');
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  it('maneja errores de la API con mensaje específico del backend', async () => {
    const user = userEvent.setup();
    const { isAxiosError } = await import('../../services/api');
    vi.mocked(isAxiosError).mockReturnValue(true);

    vi.mocked(apiClient.post).mockRejectedValue({
      response: {
        data: {
          error: 'Token expirado',
        },
      },
    });

    renderWithRouter(<ResetPasswordPage />);

    const inputs = screen.getAllByPlaceholderText('••••••••');
    const passwordInput = inputs[0];
    const confirmPasswordInput = inputs[1];
    const submitButton = screen.getByRole('button', { name: /guardar nueva contraseña/i });

    await user.type(passwordInput, 'NewPassword123!');
    await user.type(confirmPasswordInput, 'NewPassword123!');
    await user.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Token expirado');
    });
  });

  it('maneja errores de la API con mensaje genérico', async () => {
    const user = userEvent.setup();
    vi.mocked(apiClient.post).mockRejectedValue(new Error('Network error'));

    renderWithRouter(<ResetPasswordPage />);

    const inputs = screen.getAllByPlaceholderText('••••••••');
    const passwordInput = inputs[0];
    const confirmPasswordInput = inputs[1];
    const submitButton = screen.getByRole('button', { name: /guardar nueva contraseña/i });

    await user.type(passwordInput, 'NewPassword123!');
    await user.type(confirmPasswordInput, 'NewPassword123!');
    await user.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Error al restablecer la contraseña');
    });
  });

  it('deshabilita el botón mientras se envía la solicitud', async () => {
    const user = userEvent.setup();
    vi.mocked(apiClient.post).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ data: {} }), 100)),
    );

    renderWithRouter(<ResetPasswordPage />);

    const inputs = screen.getAllByPlaceholderText('••••••••');
    const passwordInput = inputs[0];
    const confirmPasswordInput = inputs[1];
    const submitButton = screen.getByRole('button', { name: /guardar nueva contraseña/i });

    await user.type(passwordInput, 'NewPassword123!');
    await user.type(confirmPasswordInput, 'NewPassword123!');
    await user.click(submitButton);

    expect(submitButton).toBeDisabled();

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  it('permite mostrar y ocultar la contraseña', async () => {
    const user = userEvent.setup();
    renderWithRouter(<ResetPasswordPage />);

    const passwordInput = screen.getAllByPlaceholderText('••••••••')[0] as HTMLInputElement;

    // Inicialmente debe ser tipo password
    expect(passwordInput.type).toBe('password');

    // Buscar los botones de mostrar/ocultar (hay 2: uno para cada campo)
    const toggleButtons = screen.getAllByRole('button', { name: '' });
    const passwordToggle = toggleButtons[0];

    // Click para mostrar
    await user.click(passwordToggle);
    expect(passwordInput.type).toBe('text');

    // Click para ocultar
    await user.click(passwordToggle);
    expect(passwordInput.type).toBe('password');
  });

  it('valida que la contraseña no esté vacía', async () => {
    const user = userEvent.setup();
    renderWithRouter(<ResetPasswordPage />);

    const submitButton = screen.getByRole('button', { name: /guardar nueva contraseña/i });

    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/la contraseña no puede estar vacía/i)).toBeInTheDocument();
    });

    expect(apiClient.post).not.toHaveBeenCalled();
  });

  it('acepta contraseñas válidas con caracteres especiales permitidos', async () => {
    const user = userEvent.setup();
    vi.mocked(apiClient.post).mockResolvedValue({ data: { success: true } });

    renderWithRouter(<ResetPasswordPage />);

    const inputs = screen.getAllByPlaceholderText('••••••••');
    const passwordInput = inputs[0];
    const confirmPasswordInput = inputs[1];
    const submitButton = screen.getByRole('button', { name: /guardar nueva contraseña/i });

    // Probar con diferentes caracteres especiales permitidos
    const validPassword = 'ValidPass123@';
    await user.type(passwordInput, validPassword);
    await user.type(confirmPasswordInput, validPassword);
    await user.click(submitButton);

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalled();
    });
  });
});
