import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import ForgotPasswordPage from './ForgotPasswordPage';
import { apiClient } from '../../services/api';
import { toast } from 'sonner';

// Mock de apiClient
vi.mock('../../services/api', () => ({
  apiClient: {
    post: vi.fn(),
  },
}));

// Mock de sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock de imágenes
vi.mock('../../assets/ImagenLogoCudecaLigth.png', () => ({
  default: 'logo-light.png',
}));

vi.mock('../../assets/ImagenLogoCudecaDark.png', () => ({
  default: 'logo-dark.png',
}));

// Mock de ThemeToggle
vi.mock('../../components/ui/ThemeToggle', () => ({
  ThemeToggle: () => <div>Theme Toggle</div>,
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('ForgotPasswordPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza el formulario correctamente', () => {
    renderWithRouter(<ForgotPasswordPage />);

    expect(screen.getByText('Recuperar contraseña')).toBeInTheDocument();
    expect(screen.getByLabelText('Correo electrónico')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /enviar enlace/i })).toBeInTheDocument();
    expect(screen.getByText(/volver a iniciar sesión/i)).toBeInTheDocument();
  });

  it('valida que el formato del email sea correcto', async () => {
    const user = userEvent.setup();
    renderWithRouter(<ForgotPasswordPage />);

    const submitButton = screen.getByRole('button', { name: /enviar enlace/i });

    // Intentar enviar sin email
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Email inválido')).toBeInTheDocument();
    });

    // No debería haber llamado a la API
    expect(apiClient.post).not.toHaveBeenCalled();
  });

  it('envía la solicitud cuando el email es válido', async () => {
    const user = userEvent.setup();
    vi.mocked(apiClient.post).mockResolvedValue({ data: { success: true } });

    renderWithRouter(<ForgotPasswordPage />);

    const emailInput = screen.getByLabelText('Correo electrónico');
    const submitButton = screen.getByRole('button', { name: /enviar enlace/i });

    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith('/auth/forgot-password', {
        email: 'test@example.com',
      });
      expect(toast.success).toHaveBeenCalledWith('Solicitud procesada');
    });
  });

  it('muestra la pantalla de confirmación después de enviar', async () => {
    const user = userEvent.setup();
    vi.mocked(apiClient.post).mockResolvedValue({ data: { success: true } });

    renderWithRouter(<ForgotPasswordPage />);

    const emailInput = screen.getByLabelText('Correo electrónico');
    const submitButton = screen.getByRole('button', { name: /enviar enlace/i });

    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Revisa tu correo')).toBeInTheDocument();
      expect(screen.getByText(/si existe una cuenta asociada a ese email/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /volver al login/i })).toBeInTheDocument();
    });
  });

  it('maneja errores de la API correctamente', async () => {
    const user = userEvent.setup();
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(apiClient.post).mockRejectedValue(new Error('Network error'));

    renderWithRouter(<ForgotPasswordPage />);

    const emailInput = screen.getByLabelText('Correo electrónico');
    const submitButton = screen.getByRole('button', { name: /enviar enlace/i });

    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Error de conexión', {
        description: 'Inténtalo de nuevo más tarde',
      });
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });

  it('deshabilita el botón mientras se envía la solicitud', async () => {
    const user = userEvent.setup();
    vi.mocked(apiClient.post).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ data: {} }), 100)),
    );

    renderWithRouter(<ForgotPasswordPage />);

    const emailInput = screen.getByLabelText('Correo electrónico');
    const submitButton = screen.getByRole('button', { name: /enviar enlace/i });

    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);

    expect(submitButton).toBeDisabled();

    await waitFor(() => {
      expect(screen.getByText('Revisa tu correo')).toBeInTheDocument();
    });
  });

  it('muestra el icono de carga mientras se envía', async () => {
    const user = userEvent.setup();
    vi.mocked(apiClient.post).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ data: {} }), 100)),
    );

    renderWithRouter(<ForgotPasswordPage />);

    const emailInput = screen.getByLabelText('Correo electrónico');
    const submitButton = screen.getByRole('button', { name: /enviar enlace/i });

    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);

    expect(screen.getByText(/enviando/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Revisa tu correo')).toBeInTheDocument();
    });
  });

  it('no permite enviar el formulario vacío', async () => {
    const user = userEvent.setup();
    renderWithRouter(<ForgotPasswordPage />);

    const submitButton = screen.getByRole('button', { name: /enviar enlace/i });

    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Email inválido')).toBeInTheDocument();
    });

    expect(apiClient.post).not.toHaveBeenCalled();
  });
});
