import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter, useLocation, type Location } from 'react-router-dom';
import Dashboard from './Dashboard';
import { useAuth, type AuthContextType } from '../../context/AuthContext';
import { CartProvider } from '../../context/CartContext';

// Mock de AuthContext
vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock de ThemeToggle
vi.mock('../../components/ui/ThemeToggle', () => ({
  ThemeToggle: () => <div data-testid="theme-toggle">Theme Toggle</div>,
}));

// Mock de QrScannerFAB
vi.mock('../../components/QrScannerFAB', () => ({
  QrScannerFAB: () => <div data-testid="qr-fab">FAB</div>,
}));

// Mock para react-router-dom y Outlet
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useLocation: vi.fn(),
    useNavigate: vi.fn(),
  };
});

describe('Dashboard Layout', () => {
  const mockLogout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Default location
    vi.mocked(useLocation).mockReturnValue({
      pathname: '/dashboard',
      search: '',
      hash: '',
      state: null,
      key: 'default',
    } as Location);
  });

  it('renderiza el sidebar y los enlaces para un usuario normal/admin', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { nombre: 'Admin User', roles: ['ADMINISTRADOR'] },
      logout: mockLogout,
    } as unknown as AuthContextType);

    render(
      <BrowserRouter>
        <CartProvider>
          <Dashboard />
        </CartProvider>
      </BrowserRouter>,
    );

    expect(screen.getAllByText('Panel de Gestión')[0]).toBeInTheDocument();
    expect(screen.getByText('Resumen')).toBeInTheDocument(); // Sidebar link
    expect(screen.getByText('Mi Cuenta Personal')).toBeInTheDocument();

    // ScanLine link debería estar para admin
    expect(screen.getAllByText('Escáner QR')[0]).toBeInTheDocument();
  });

  it('renderiza elementos adicionales para personal de evento (Staff)', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { nombre: 'Staff User', roles: ['PERSONAL_EVENTO'] },
      logout: mockLogout,
    } as unknown as AuthContextType);

    render(
      <BrowserRouter>
        <CartProvider>
          <Dashboard />
        </CartProvider>
      </BrowserRouter>,
    );

    // ScanLine link debería estar
    expect(screen.getAllByText('Escáner QR')[0]).toBeInTheDocument();

    // FAB debería estar
    expect(screen.getByTestId('qr-fab')).toBeInTheDocument();
  });

  it('maneja la apertura y cierre del menú móvil', async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { nombre: 'Usuario Test', roles: ['COMPRADOR'] },
      logout: mockLogout,
    } as unknown as AuthContextType);

    const { container } = render(
      <BrowserRouter>
        <CartProvider>
          <Dashboard />
        </CartProvider>
      </BrowserRouter>,
    );

    // Botón de menú (clase md:hidden)
    const menuButton = container.querySelector('button.md\\:hidden');
    expect(menuButton).toBeInTheDocument();

    if (menuButton) {
      fireEvent.click(menuButton);
    }

    // Al abrir el menú, deberíamos ver el sidebar con su contenido
    await waitFor(() => {
      // El menú móvil está abierto (isMobileMenuOpen = true)
      // Verificamos que el botón de cerrar (X) está visible
      const closeButton = container.querySelector('button.md\\:hidden svg.lucide-x');
      expect(closeButton).toBeInTheDocument();
    });
  });

  it('llama a logout cuando se hace click en cerrar sesión', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { nombre: 'Usuario Test', roles: ['COMPRADOR'] },
      logout: mockLogout,
    } as unknown as AuthContextType);

    render(
      <BrowserRouter>
        <CartProvider>
          <Dashboard />
        </CartProvider>
      </BrowserRouter>,
    );

    // Click en logout del sidebar
    const logoutBtn = screen.getByText('Cerrar Sesión');
    fireEvent.click(logoutBtn);

    expect(mockLogout).toHaveBeenCalled();
  });
});
