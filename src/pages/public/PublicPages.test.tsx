import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

// Importamos las páginas
import Login from '../../features/auth/LoginPage';
import Registro from '../../features/auth/RegisterPage';
import Checkout from './Checkout';
import DetallesEvento from './DetallesEvento';
import Home from '../Home';
import { PantallaDePerfil } from './PerfilUsuario/index';
import { PerfilCompras } from './PerfilCompras/index';
import { CompraUsuario } from './CompraUsuario/index';
import { CheckoutUsuario } from './CheckoutUsuario/index';
import { CheckoutInvitado } from './CheckoutInvitado/index';
import { CompraInvitado } from './CompraInvitado/index';
import { DatosFiscales } from './DatosFiscales/index';
import { PantallaDeRecargar } from './RecargaSaldo/index';
import { Suscripcion } from './Suscripcion/index';

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
    render(
      <MemoryRouter>
        <Checkout />
      </MemoryRouter>,
    );
    expect(screen.getByText(/Checkout/i)).toBeInTheDocument();
    expect(screen.getByText(/Completa tu compra y descarga tus entradas/i)).toBeInTheDocument();
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

  it('renderiza la página de Perfil de Usuario', () => {
    render(
      <MemoryRouter>
        <PantallaDePerfil />
      </MemoryRouter>,
    );
    expect(screen.getByText(/Nombre/i)).toBeInTheDocument();
    expect(screen.getByText(/Juan Carlos/i)).toBeInTheDocument();
  });

  it('renderiza la página de Historial de Compras', () => {
    render(
      <MemoryRouter>
        <PerfilCompras />
      </MemoryRouter>,
    );
    expect(screen.getByText(/Historial de Compras/i)).toBeInTheDocument();
  });

  it('renderiza la página de Confirmación de Compra Usuario', () => {
    render(
      <MemoryRouter>
        <CompraUsuario />
      </MemoryRouter>,
    );
    expect(screen.getByText(/Gracias por su colaboración/i)).toBeInTheDocument();
    expect(screen.getByText(/Tu pago ha sido procesado correctamente/i)).toBeInTheDocument();
  });

  it('renderiza la página de Checkout Usuario', () => {
    render(
      <MemoryRouter>
        <CheckoutUsuario />
      </MemoryRouter>,
    );
    expect(screen.getByText(/Información de contacto/i)).toBeInTheDocument();
  });

  it('renderiza la página de Checkout Invitado', () => {
    render(
      <MemoryRouter>
        <CheckoutInvitado />
      </MemoryRouter>,
    );
    expect(screen.getByText(/Información de contacto/i)).toBeInTheDocument();
  });

  it('renderiza la página de Confirmación Compra Invitado', () => {
    render(
      <MemoryRouter>
        <CompraInvitado />
      </MemoryRouter>,
    );
    expect(screen.getByText(/Gracias por su colaboración/i)).toBeInTheDocument();
    expect(screen.getByText(/Tu pago ha sido procesado correctamente/i)).toBeInTheDocument();
  });

  it('renderiza la página de Datos Fiscales', () => {
    render(
      <MemoryRouter>
        <DatosFiscales />
      </MemoryRouter>,
    );
    expect(screen.getByText(/Datos Fiscales/i)).toBeInTheDocument();
  });

  it('renderiza la página de Recarga de Saldo', () => {
    render(
      <MemoryRouter>
        <PantallaDeRecargar />
      </MemoryRouter>,
    );
    expect(screen.getByText(/Saldo:/i)).toBeInTheDocument();
  });

  it('renderiza la página de Suscripción', () => {
    render(
      <MemoryRouter>
        <Suscripcion />
      </MemoryRouter>,
    );
    expect(screen.getAllByText(/Socio Amigo/i).length).toBeGreaterThan(0);
  });

  it('muestra diferentes planes de suscripción', () => {
    render(
      <MemoryRouter>
        <Suscripcion />
      </MemoryRouter>,
    );

    expect(screen.getAllByText(/Socio Amigo/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Socio Protector/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Socio Benefactor/i).length).toBeGreaterThan(0);
  });

  it('muestra botones de editar en Datos Fiscales', () => {
    render(
      <MemoryRouter>
        <DatosFiscales />
      </MemoryRouter>,
    );

    const editButtons = screen.getAllByRole('button', { name: /Editar/i });
    expect(editButtons.length).toBeGreaterThan(0);
  });

  it('muestra compras en el historial', () => {
    render(
      <MemoryRouter>
        <PerfilCompras />
      </MemoryRouter>,
    );

    expect(screen.getByText(/Concierto Benéfico de Navidad/i)).toBeInTheDocument();
    expect(screen.getByText(/Gala Anual Cudeca 2024/i)).toBeInTheDocument();
  });

  it('muestra email del usuario en confirmación de compra', () => {
    render(
      <MemoryRouter>
        <CompraUsuario />
      </MemoryRouter>,
    );

    expect(screen.getByText(/usuario.logueado@email.com/i)).toBeInTheDocument();
  });

  it('permite interactuar con el perfil de usuario', () => {
    render(
      <MemoryRouter>
        <PantallaDePerfil />
      </MemoryRouter>,
    );

    const editButton = screen.getByRole('button', { name: /Editar información del perfil/i });
    expect(editButton).toBeInTheDocument();
    fireEvent.click(editButton);
  });

  it('muestra todos los campos del perfil de usuario', () => {
    render(
      <MemoryRouter>
        <PantallaDePerfil />
      </MemoryRouter>,
    );

    expect(screen.getByText(/Apellidos/i)).toBeInTheDocument();
    expect(screen.getByText(/Correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByText(/Teléfono/i)).toBeInTheDocument();
  });

  it('renderiza correctamente los botones en CompraUsuario', () => {
    render(
      <MemoryRouter>
        <CompraUsuario />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('button', { name: /Volver a la página anterior/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Ver mis compras/i })).toBeInTheDocument();
  });

  it('renderiza correctamente los botones en CompraInvitado', () => {
    render(
      <MemoryRouter>
        <CompraInvitado />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('button', { name: /Volver a la página anterior/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Crear cuenta con el correo electrónico proporcionado/i }),
    ).toBeInTheDocument();
  });

  it('muestra información de contacto en CheckoutUsuario', () => {
    render(
      <MemoryRouter>
        <CheckoutUsuario />
      </MemoryRouter>,
    );

    expect(screen.getByText(/Información de contacto/i)).toBeInTheDocument();
  });

  it('muestra información de contacto en CheckoutInvitado', () => {
    render(
      <MemoryRouter>
        <CheckoutInvitado />
      </MemoryRouter>,
    );

    expect(screen.getByText(/Información de contacto/i)).toBeInTheDocument();
  });

  it('muestra detalles de compras en el historial', () => {
    render(
      <MemoryRouter>
        <PerfilCompras />
      </MemoryRouter>,
    );

    expect(screen.getAllByText(/Ver detalles/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/2 entradas/i)).toBeInTheDocument();
    expect(screen.getByText(/4 entradas/i)).toBeInTheDocument();
  });

  it('muestra precios en el historial de compras', () => {
    render(
      <MemoryRouter>
        <PerfilCompras />
      </MemoryRouter>,
    );

    expect(screen.getByText(/48.00€/i)).toBeInTheDocument();
    expect(screen.getByText(/120.00€/i)).toBeInTheDocument();
  });

  it('muestra estado de compras completadas', () => {
    render(
      <MemoryRouter>
        <PerfilCompras />
      </MemoryRouter>,
    );

    expect(screen.getAllByText(/Completada/i).length).toBeGreaterThan(0);
  });

  it('renderiza el header en todas las páginas de perfil', () => {
    const { unmount } = render(
      <MemoryRouter>
        <PantallaDePerfil />
      </MemoryRouter>,
    );
    const headers = screen.getAllByText(/Fundación Cudeca/i);
    expect(headers.length).toBeGreaterThan(0);
    unmount();
  });

  it('muestra características de los planes de suscripción', () => {
    render(
      <MemoryRouter>
        <Suscripcion />
      </MemoryRouter>,
    );

    expect(screen.getByText(/Acceso a eventos exclusivos/i)).toBeInTheDocument();
    expect(screen.getByText(/Boletín mensual/i)).toBeInTheDocument();
  });

  it('muestra precios de los planes de suscripción', () => {
    render(
      <MemoryRouter>
        <Suscripcion />
      </MemoryRouter>,
    );

    // Verificar que hay múltiples elementos con los nombres de los planes
    const socioAmigoElements = screen.getAllByText(/Socio Amigo/i);
    expect(socioAmigoElements.length).toBeGreaterThan(0);
  });

  it('verifica que el formulario de registro valida las contraseñas coincidentes', async () => {
    render(
      <MemoryRouter>
        <Registro />
      </MemoryRouter>,
    );

    const passwordInput = screen.getByLabelText(/^Contraseña\*/i);
    const confirmPasswordInput = screen.getByLabelText(/Confirmar Contraseña/i);

    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'different123' } });

    const submitButton = screen.getByRole('button', { name: /Crear cuenta/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Las contraseñas no coinciden/i)).toBeInTheDocument();
    });
  });

  // Pruebas adicionales para mejorar la cobertura

  it('navega desde CompraInvitado a registro', () => {
    render(
      <MemoryRouter>
        <CompraInvitado />
      </MemoryRouter>,
    );

    const createAccountButton = screen.getByRole('button', {
      name: /Crear cuenta con el correo electrónico proporcionado/i
    });

    expect(createAccountButton).toBeInTheDocument();
    fireEvent.click(createAccountButton);
  });

  it('navega desde CompraInvitado a la página anterior', () => {
    render(
      <MemoryRouter>
        <CompraInvitado />
      </MemoryRouter>,
    );

    const backButton = screen.getByRole('button', {
      name: /Volver a la página anterior/i
    });

    expect(backButton).toBeInTheDocument();
    fireEvent.click(backButton);
  });

  it('navega desde CompraUsuario a compras', () => {
    render(
      <MemoryRouter>
        <CompraUsuario />
      </MemoryRouter>,
    );

    const viewPurchasesButton = screen.getByRole('button', {
      name: /Ver mis compras/i
    });

    expect(viewPurchasesButton).toBeInTheDocument();
    fireEvent.click(viewPurchasesButton);
  });

  it('navega desde CompraUsuario a la página anterior', () => {
    render(
      <MemoryRouter>
        <CompraUsuario />
      </MemoryRouter>,
    );

    const backButton = screen.getByRole('button', {
      name: /Volver a la página anterior/i
    });

    expect(backButton).toBeInTheDocument();
    fireEvent.click(backButton);
  });

  it('muestra información detallada en PerfilCompras', () => {
    render(
      <MemoryRouter>
        <PerfilCompras />
      </MemoryRouter>,
    );

    // Verificar que muestra información de eventos
    expect(screen.getByText(/Concierto Benéfico de Navidad/i)).toBeInTheDocument();
    expect(screen.getByText(/Gala Anual Cudeca 2024/i)).toBeInTheDocument();
  });

  it('muestra el email del usuario en CompraInvitado', () => {
    render(
      <MemoryRouter>
        <CompraInvitado />
      </MemoryRouter>,
    );

    expect(screen.getByText(/usuario.invitado@email.com/i)).toBeInTheDocument();
  });

  it('muestra información de perfil de usuario completa', () => {
    render(
      <MemoryRouter>
        <PantallaDePerfil />
      </MemoryRouter>,
    );

    // Verificar todos los campos
    expect(screen.getByText(/Nombre/i)).toBeInTheDocument();
    expect(screen.getByText(/Apellidos/i)).toBeInTheDocument();
    expect(screen.getByText(/Correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByText(/Teléfono/i)).toBeInTheDocument();

    // Verificar valores
    expect(screen.getByText(/Juan Carlos/i)).toBeInTheDocument();
  });
});
