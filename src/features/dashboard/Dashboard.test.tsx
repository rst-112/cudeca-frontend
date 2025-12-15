import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter, useLocation, type Location } from 'react-router-dom';
import Dashboard from './Dashboard';
import { useAuth, type AuthContextType } from '../../context/AuthContext';

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

  it('renderiza el sidebar y los enlaces para un usuario normal', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { nombre: 'Usuario Test', roles: ['COMPRADOR'] },
      logout: mockLogout,
    } as unknown as AuthContextType);

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>,
    );

    expect(screen.getByText('cudeca')).toBeInTheDocument();
    expect(screen.getByText('Inicio')).toBeInTheDocument();
    expect(screen.getByText('Mis Entradas')).toBeInTheDocument();

    // ScanLine link no debería estar
    expect(screen.queryByText('Escáner QR')).not.toBeInTheDocument();

    // FAB no debería estar
    expect(screen.queryByTestId('qr-fab')).not.toBeInTheDocument();
  });

  it('renderiza elementos adicionales para personal de evento (Staff)', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { nombre: 'Staff User', roles: ['PERSONAL_EVENTO'] },
      logout: mockLogout,
    } as unknown as AuthContextType);

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>,
    );

    // ScanLine link debería estar
    expect(screen.getAllByText('Escáner QR')[0]).toBeInTheDocument();

    // FAB debería estar
    expect(screen.getByTestId('qr-fab')).toBeInTheDocument();
  });

  it('maneja la apertura y cierre del menú móvil', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { nombre: 'Usuario Test', roles: ['COMPRADOR'] },
      logout: mockLogout,
    } as unknown as AuthContextType);

    const { container } = render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>,
    );

    // Botón de menú (clase md:hidden)
    const menuButton = container.querySelector('button.md\\:hidden');
    expect(menuButton).toBeInTheDocument();

    // Inicialmente no visible el menú móvil
    // El "Cerrar Sesión" del sidebar siempre está en el DOM, así que chequear not.toBeVisible() falla si JSDOM no maneja estilos CSS complejos.
    // Mejor verificamos que NO está el contenedor del menú móvil.
    // Nota: El test de visibilidad con "hidden md:flex" puede ser tricky en jsdom.
    // Verificamos si al hacer click se renderiza el overlay móvil

    if (menuButton) {
      fireEvent.click(menuButton);
    }

    // Ahora debería haber elementos del menú móvil
    // Buscamos algo específico del menú móvil que se renderiza condicionalmente {isMobileMenuOpen && ...}
    // El menu movil tiene un "Inicio" que es NavLink.
    // Al abrirse, deberíamos encontrar MÁS elementos de los que había.
    const mobileMenuLinks = screen.getAllByText('Inicio');
    expect(mobileMenuLinks.length).toBeGreaterThan(1);
  });

  it('llama a logout cuando se hace click en cerrar sesión', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { nombre: 'Usuario Test', roles: ['COMPRADOR'] },
      logout: mockLogout,
    } as unknown as AuthContextType);

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>,
    );

    // Click en logout del sidebar (visible en desktop mock)
    const logoutBtn = screen.getByText('Cerrar Sesión');
    fireEvent.click(logoutBtn);

    expect(mockLogout).toHaveBeenCalled();
  });
});
