import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import { ProfileActionsSection } from './PerfilUsuario/ProfileActionsSection';
import { ProfileActionsSection as ProfileActionsRecarga } from './RecargaSaldo/ProfileActionsSection';
import { ProfileActionsSection as ProfileActionsDatos } from './DatosFiscales/ProfileActionsSection';
import { ProfileActionsSection as ProfileActionsCompras } from './PerfilCompras/ProfileActionsSection';
import { ConfirmationSection as ConfirmacionInvitado } from './CompraInvitado/ConfirmationSection';
import { ConfirmationSection as ConfirmacionUsuario } from './CompraUsuario/ConfirmationSection';
import { ConfirmationSection as ConfirmacionRecarga } from './RecargaSaldo/ConfirmationSection';
import { CheckoutFormSection as CheckoutFormInvitado } from './CheckoutInvitado/CheckoutFormSection';
import { CheckoutFormSection as CheckoutFormUsuario } from './CheckoutUsuario/CheckoutFormSection';
import { HeaderSection as HeaderInvitado } from './CheckoutInvitado/HeaderSection';

// Mock de useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('ProfileActionsSection Components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza ProfileActionsSection de PerfilUsuario', () => {
    render(
      <MemoryRouter>
        <ProfileActionsSection />
      </MemoryRouter>,
    );

    expect(screen.getByText(/Saldo:/i)).toBeInTheDocument();
    expect(screen.getByText(/36.00€/i)).toBeInTheDocument();
  });

  it('navega cuando se hace clic en botones de ProfileActionsSection', () => {
    render(
      <MemoryRouter>
        <ProfileActionsSection />
      </MemoryRouter>,
    );

    const perfilButton = screen.getByRole('button', { name: /Perfil/i });
    fireEvent.click(perfilButton);

    expect(mockNavigate).toHaveBeenCalledWith('/dev/perfil-usuario');
  });

  it('navega a diferentes rutas desde ProfileActionsSection', () => {
    render(
      <MemoryRouter>
        <ProfileActionsSection />
      </MemoryRouter>,
    );

    const recargarButton = screen.getByRole('button', { name: /Recargar saldo/i });
    fireEvent.click(recargarButton);

    expect(mockNavigate).toHaveBeenCalledWith('/dev/recarga-saldo');
  });

  it('navega a compras desde ProfileActionsSection', () => {
    render(
      <MemoryRouter>
        <ProfileActionsSection />
      </MemoryRouter>,
    );

    const comprasButton = screen.getByRole('button', { name: /Compras/i });
    fireEvent.click(comprasButton);

    expect(mockNavigate).toHaveBeenCalledWith('/dev/perfil-compras');
  });

  it('navega a datos fiscales desde ProfileActionsSection', () => {
    render(
      <MemoryRouter>
        <ProfileActionsSection />
      </MemoryRouter>,
    );

    const datosButton = screen.getByRole('button', { name: /Datos fiscales/i });
    fireEvent.click(datosButton);

    expect(mockNavigate).toHaveBeenCalledWith('/dev/datos-fiscales');
  });

  it('navega a suscripción desde ProfileActionsSection', () => {
    render(
      <MemoryRouter>
        <ProfileActionsSection />
      </MemoryRouter>,
    );

    const suscripcionButton = screen.getByRole('button', { name: /Suscripción/i });
    fireEvent.click(suscripcionButton);

    expect(mockNavigate).toHaveBeenCalledWith('/dev/suscripcion');
  });

  it('renderiza ProfileActionsSection de RecargaSaldo', () => {
    render(
      <MemoryRouter>
        <ProfileActionsRecarga />
      </MemoryRouter>,
    );

    expect(screen.getByText(/Saldo:/i)).toBeInTheDocument();
  });

  it('navega desde ProfileActionsSection de RecargaSaldo', () => {
    render(
      <MemoryRouter>
        <ProfileActionsRecarga />
      </MemoryRouter>,
    );

    const perfilButton = screen.getByRole('button', { name: /Perfil/i });
    fireEvent.click(perfilButton);

    expect(mockNavigate).toHaveBeenCalled();
  });

  it('renderiza ProfileActionsSection de DatosFiscales', () => {
    render(
      <MemoryRouter>
        <ProfileActionsDatos />
      </MemoryRouter>,
    );

    expect(screen.getByText(/Saldo:/i)).toBeInTheDocument();
  });

  it('navega desde ProfileActionsSection de DatosFiscales', () => {
    render(
      <MemoryRouter>
        <ProfileActionsDatos />
      </MemoryRouter>,
    );

    const perfilButton = screen.getByRole('button', { name: /Perfil/i });
    fireEvent.click(perfilButton);

    expect(mockNavigate).toHaveBeenCalled();
  });

  it('renderiza ProfileActionsSection de PerfilCompras', () => {
    render(
      <MemoryRouter>
        <ProfileActionsCompras />
      </MemoryRouter>,
    );

    expect(screen.getByText(/Saldo:/i)).toBeInTheDocument();
  });

  it('navega desde ProfileActionsSection de PerfilCompras', () => {
    render(
      <MemoryRouter>
        <ProfileActionsCompras />
      </MemoryRouter>,
    );

    const perfilButton = screen.getByRole('button', { name: /Perfil/i });
    fireEvent.click(perfilButton);

    expect(mockNavigate).toHaveBeenCalled();
  });
});

describe('ConfirmationSection Components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza ConfirmationSection de CompraInvitado', () => {
    render(
      <MemoryRouter>
        <ConfirmacionInvitado />
      </MemoryRouter>,
    );

    expect(screen.getByText(/Gracias por su colaboración/i)).toBeInTheDocument();
    expect(screen.getByText(/usuario.invitado@email.com/i)).toBeInTheDocument();
  });

  it('navega a registro desde ConfirmationSection de CompraInvitado', () => {
    render(
      <MemoryRouter>
        <ConfirmacionInvitado />
      </MemoryRouter>,
    );

    const createAccountButton = screen.getByRole('button', {
      name: /Crear cuenta con el correo electrónico proporcionado/i,
    });
    fireEvent.click(createAccountButton);

    expect(mockNavigate).toHaveBeenCalledWith('/registro');
  });

  it('navega a home desde ConfirmationSection de CompraInvitado', () => {
    render(
      <MemoryRouter>
        <ConfirmacionInvitado />
      </MemoryRouter>,
    );

    const backButton = screen.getByRole('button', {
      name: /Volver a la página anterior/i,
    });
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('renderiza ConfirmationSection de CompraUsuario', () => {
    render(
      <MemoryRouter>
        <ConfirmacionUsuario />
      </MemoryRouter>,
    );

    expect(screen.getByText(/Gracias por su colaboración/i)).toBeInTheDocument();
    expect(screen.getByText(/usuario.logueado@email.com/i)).toBeInTheDocument();
  });

  it('navega a compras desde ConfirmationSection de CompraUsuario', () => {
    render(
      <MemoryRouter>
        <ConfirmacionUsuario />
      </MemoryRouter>,
    );

    const viewPurchasesButton = screen.getByRole('button', {
      name: /Ver mis compras/i,
    });
    fireEvent.click(viewPurchasesButton);

    expect(mockNavigate).toHaveBeenCalledWith('/perfil');
  });

  it('navega atrás desde ConfirmationSection de CompraUsuario', () => {
    render(
      <MemoryRouter>
        <ConfirmacionUsuario />
      </MemoryRouter>,
    );

    const backButton = screen.getByRole('button', {
      name: /Volver a la página anterior/i,
    });
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('renderiza ConfirmationSection de RecargaSaldo', () => {
    render(
      <MemoryRouter>
        <ConfirmacionRecarga />
      </MemoryRouter>,
    );

    expect(screen.getByText(/Añadir Saldo al Monedero/i)).toBeInTheDocument();
    expect(screen.getByText(/Cantidad a añadir/i)).toBeInTheDocument();
  });

  it('muestra cantidades rápidas en RecargaSaldo', () => {
    render(
      <MemoryRouter>
        <ConfirmacionRecarga />
      </MemoryRouter>,
    );

    expect(screen.getByRole('button', { name: /Añadir 10€/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Añadir 25€/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Añadir 50€/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Añadir 100€/i })).toBeInTheDocument();
  });

  it('permite seleccionar cantidades rápidas en RecargaSaldo', () => {
    render(
      <MemoryRouter>
        <ConfirmacionRecarga />
      </MemoryRouter>,
    );

    const button10 = screen.getByRole('button', { name: /Añadir 10€/i });
    fireEvent.click(button10);

    expect(button10).toHaveAttribute('aria-pressed', 'true');
  });


  it('permite seleccionar diferentes cantidades en RecargaSaldo', () => {
    render(
      <MemoryRouter>
        <ConfirmacionRecarga />
      </MemoryRouter>,
    );

    const button50 = screen.getByRole('button', { name: /Añadir 50€/i });
    const button100 = screen.getByRole('button', { name: /Añadir 100€/i });

    fireEvent.click(button50);
    expect(button50).toHaveAttribute('aria-pressed', 'true');

    fireEvent.click(button100);
    expect(button100).toHaveAttribute('aria-pressed', 'true');
  });
});

describe('CheckoutFormSection Components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza CheckoutFormSection de CheckoutInvitado', () => {
    render(
      <MemoryRouter>
        <CheckoutFormInvitado />
      </MemoryRouter>,
    );

    // Verificar que el formulario se renderiza
    expect(screen.getByText(/Noche de Jazz Solidaria/i)).toBeInTheDocument();
  });

  it('permite cambiar método de pago en CheckoutInvitado', () => {
    render(
      <MemoryRouter>
        <CheckoutFormInvitado />
      </MemoryRouter>,
    );

    // Buscar opciones de pago
    expect(screen.getByText(/Tarjeta de crédito/i)).toBeInTheDocument();
    expect(screen.getByText(/Paypal/i)).toBeInTheDocument();
    expect(screen.getByText(/Bizum/i)).toBeInTheDocument();
  });

  it('navega al confirmar compra en CheckoutInvitado', () => {
    render(
      <MemoryRouter>
        <CheckoutFormInvitado />
      </MemoryRouter>,
    );

    const confirmButton = screen.getByRole('button', {
      name: /Confirmar compra/i,
    });
    fireEvent.click(confirmButton);

    expect(mockNavigate).toHaveBeenCalledWith('/dev/compra-invitado');
  });

  it('renderiza CheckoutFormSection de CheckoutUsuario', () => {
    render(
      <MemoryRouter>
        <CheckoutFormUsuario />
      </MemoryRouter>,
    );

    // Verificar que el formulario se renderiza
    expect(screen.getByText(/Noche de Jazz Solidaria/i)).toBeInTheDocument();
  });

  it('navega al confirmar compra en CheckoutUsuario', () => {
    render(
      <MemoryRouter>
        <CheckoutFormUsuario />
      </MemoryRouter>,
    );

    const confirmButton = screen.getByRole('button', {
      name: /Confirmar compra/i,
    });
    fireEvent.click(confirmButton);

    expect(mockNavigate).toHaveBeenCalledWith('/dev/compra-usuario');
  });
});

describe('HeaderSection Components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza HeaderSection de CheckoutInvitado', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <HeaderInvitado />
        </AuthProvider>
      </MemoryRouter>,
    );

    expect(screen.getByText(/Fundación Cudeca/i)).toBeInTheDocument();
  });

  it('muestra los elementos de navegación en HeaderSection', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <HeaderInvitado />
        </AuthProvider>
      </MemoryRouter>,
    );

    // Verificar que existen los enlaces de navegación
    expect(screen.getByText(/Inicio/i)).toBeInTheDocument();
    expect(screen.getByText(/Eventos/i)).toBeInTheDocument();
    expect(screen.getByText(/Contacto/i)).toBeInTheDocument();
  });
});

