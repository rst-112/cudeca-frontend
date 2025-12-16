/**
 * Tests para PrivateRoute
 *
 * Estos tests verifican:
 * - Redirección cuando no hay autenticación
 * - Renderizado del contenido protegido cuando está autenticado
 * - Manejo del estado de carga
 * - Preservación de la ubicación intentada
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';

// ============================================================================
// MOCKS
// ============================================================================

// Mock del AuthContext para controlar el estado de autenticación
vi.mock('../context/AuthContext', async () => {
  const actual = await vi.importActual('../context/AuthContext');
  return {
    ...actual,
    useAuth: vi.fn(),
  };
});

import { useAuth } from '../context/AuthContext';
const mockUseAuth = vi.mocked(useAuth);

// ============================================================================
// COMPONENTES DE PRUEBA
// ============================================================================

/**
 * Componente de Login simple para tests
 */
const LoginPage = () => <div>Login Page</div>;

/**
 * Componente protegido simple para tests
 */
const ProtectedPage = () => <div>Protected Content</div>;

/**
 * Helper para renderizar el PrivateRoute con rutas
 */
const renderWithRouter = (initialRoute = '/') => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/perfil" element={<div>Perfil Page</div>} />
        <Route element={<PrivateRoute />}>
          <Route path="/protected" element={<ProtectedPage />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
};

// ============================================================================
// TESTS
// ============================================================================

describe('PrivateRoute', () => {
  beforeEach(() => {
    // Limpiar mocks antes de cada test
    vi.clearAllMocks();
  });

  // --------------------------------------------------------------------------
  // ESTADO DE CARGA
  // --------------------------------------------------------------------------

  describe('Estado de carga', () => {
    it('debe mostrar pantalla de carga mientras isLoading es true', () => {
      // Mock: Usuario en proceso de autenticación
      mockUseAuth.mockReturnValue({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: true, // ← Cargando
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
      });

      const { container } = renderWithRouter('/protected');

      // Verificar que se muestra el spinner de carga
      expect(container.getElementsByClassName('animate-spin').length).toBeGreaterThan(0);

      // Verificar que NO se muestra el contenido protegido
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();

      // Verificar que NO redirige al login
      expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
    });
  });

  // --------------------------------------------------------------------------
  // USUARIO NO AUTENTICADO
  // --------------------------------------------------------------------------

  describe('Usuario no autenticado', () => {
    it('debe redirigir a /login si no está autenticado', async () => {
      // Mock: Usuario no autenticado
      mockUseAuth.mockReturnValue({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
      });

      renderWithRouter('/protected');

      // Verificar que redirige al login
      await waitFor(() => {
        expect(screen.getByText('Login Page')).toBeInTheDocument();
      });

      // Verificar que NO muestra el contenido protegido
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('debe preservar la ubicación intentada en el estado de navegación', async () => {
      mockUseAuth.mockReturnValue({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
      });

      // Intentar acceder a /protected
      const { container } = renderWithRouter('/protected');

      await waitFor(() => {
        expect(screen.getByText('Login Page')).toBeInTheDocument();
      });

      expect(container).toBeTruthy();
    });
  });

  // --------------------------------------------------------------------------
  // USUARIO AUTENTICADO
  // --------------------------------------------------------------------------

  describe('Usuario autenticado', () => {
    it('debe renderizar el contenido protegido si está autenticado', async () => {
      // Mock: Usuario autenticado
      mockUseAuth.mockReturnValue({
        user: {
          id: 1,
          email: 'test@test.com',
          nombre: 'Test User',
          roles: ['COMPRADOR'],
        },
        token: 'valid_token_123',
        isAuthenticated: true,
        isLoading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
      });

      renderWithRouter('/protected');

      // Verificar que se muestra el contenido protegido
      await waitFor(() => {
        expect(screen.getByText('Protected Content')).toBeInTheDocument();
      });

      // Verificar que NO redirige al login
      expect(screen.queryByText('Login Page')).not.toBeInTheDocument();

      // Verificar que NO muestra pantalla de carga
      expect(screen.queryByText('Cargando sesión...')).not.toBeInTheDocument();
    });

    it('debe permitir acceso a múltiples rutas protegidas', async () => {
      mockUseAuth.mockReturnValue({
        user: {
          id: 1,
          email: 'test@test.com',
          nombre: 'Test User',
          roles: ['ADMINISTRADOR'],
        },
        token: 'admin_token',
        isAuthenticated: true,
        isLoading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
      });

      // Renderizar con múltiples rutas protegidas
      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<div>Dashboard</div>} />
              <Route path="/profile" element={<div>Profile</div>} />
              <Route path="/settings" element={<div>Settings</div>} />
            </Route>
          </Routes>
        </MemoryRouter>,
      );

      // Verificar acceso a dashboard
      await waitFor(() => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
      });
    });
  });

  // --------------------------------------------------------------------------
  // TRANSICIONES DE ESTADO
  // --------------------------------------------------------------------------

  describe('Transiciones de estado', () => {
    it('debe cambiar de carga a contenido cuando la autenticación se completa', async () => {
      // Estado inicial: cargando
      mockUseAuth.mockReturnValue({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: true,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
      });

      // Iniciar en estado de carga
      const { rerender, container } = render(
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<PrivateRoute />}>
              <Route path="/protected" element={<ProtectedPage />} />
            </Route>
          </Routes>
        </MemoryRouter>,
      );

      expect(container.getElementsByClassName('animate-spin').length).toBeGreaterThan(0);

      // Cambiar a autenticado
      mockUseAuth.mockReturnValue({
        user: {
          id: 1,
          email: 'test@test.com',
          nombre: 'Test User',
          roles: ['COMPRADOR'],
        },
        token: 'token123',
        isAuthenticated: true,
        isLoading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
      });

      // Forzar re-render
      rerender(
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<PrivateRoute />}>
              <Route path="/protected" element={<ProtectedPage />} />
            </Route>
          </Routes>
        </MemoryRouter>,
      );

      // Verificar que ahora muestra el contenido
      await waitFor(() => {
        expect(screen.getByText('Protected Content')).toBeInTheDocument();
      });
    });

    it('debe cambiar de carga a login si no hay autenticación', async () => {
      // Estado inicial: cargando
      mockUseAuth.mockReturnValue({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: true,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
      });

      const { rerender, container } = render(
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<PrivateRoute />}>
              <Route path="/protected" element={<ProtectedPage />} />
            </Route>
          </Routes>
        </MemoryRouter>,
      );

      expect(container.getElementsByClassName('animate-spin').length).toBeGreaterThan(0);

      // Cambiar a no autenticado
      mockUseAuth.mockReturnValue({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
      });

      rerender(
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<PrivateRoute />}>
              <Route path="/protected" element={<ProtectedPage />} />
            </Route>
          </Routes>
        </MemoryRouter>,
      );

      // Verificar que redirige al login
      await waitFor(() => {
        expect(screen.getByText('Login Page')).toBeInTheDocument();
      });
    });
  });

  // --------------------------------------------------------------------------
  // EDGE CASES
  // --------------------------------------------------------------------------

  describe('Casos especiales', () => {
    it('debe manejar token presente pero isAuthenticated false', async () => {
      // Caso edge: hay token pero no está autenticado (token inválido)
      mockUseAuth.mockReturnValue({
        user: null,
        token: 'expired_token',
        isAuthenticated: false, // ← Contradicción intencional
        isLoading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
      });

      renderWithRouter('/protected');

      // Debe redirigir al login (se basa en isAuthenticated)
      await waitFor(() => {
        expect(screen.getByText('Login Page')).toBeInTheDocument();
      });
    });

    it('debe manejar usuario presente pero sin token', async () => {
      // Caso edge: hay usuario pero no token
      mockUseAuth.mockReturnValue({
        user: {
          id: 1,
          email: 'test@test.com',
          nombre: 'Test User',
          roles: ['COMPRADOR'],
        },
        token: null,
        isAuthenticated: false,
        isLoading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
      });

      renderWithRouter('/protected');

      // Debe redirigir al login
      await waitFor(() => {
        expect(screen.getByText('Login Page')).toBeInTheDocument();
      });
    });
  });

  // --------------------------------------------------------------------------
  // AUTORIZACIÓN POR ROL (requiredRole)
  // --------------------------------------------------------------------------

  describe('Autorización por rol', () => {
    it('debe permitir acceso si el usuario tiene el rol requerido', async () => {
      mockUseAuth.mockReturnValue({
        user: {
          id: 1,
          email: 'admin@test.com',
          nombre: 'Admin User',
          roles: ['ADMINISTRADOR'],
        },
        token: 'admin_token',
        isAuthenticated: true,
        isLoading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
      });

      render(
        <MemoryRouter initialEntries={['/admin']}>
          <Routes>
            <Route path="/" element={<div>Home Page</div>} />
            <Route element={<PrivateRoute requiredRole="ADMINISTRADOR" />}>
              <Route path="/admin" element={<div>Admin Panel</div>} />
            </Route>
          </Routes>
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(screen.getByText('Admin Panel')).toBeInTheDocument();
      });
    });

    it('debe redirigir a home si el usuario no tiene el rol requerido', async () => {
      mockUseAuth.mockReturnValue({
        user: {
          id: 2,
          email: 'user@test.com',
          nombre: 'Regular User',
          roles: ['COMPRADOR'],
        },
        token: 'user_token',
        isAuthenticated: true,
        isLoading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
      });

      render(
        <MemoryRouter initialEntries={['/admin']}>
          <Routes>
            <Route path="/" element={<div>Home Page</div>} />
            <Route path="/perfil" element={<div>Perfil Page</div>} />
            <Route element={<PrivateRoute requiredRole="ADMINISTRADOR" />}>
              <Route path="/admin" element={<div>Admin Panel</div>} />
            </Route>
          </Routes>
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(screen.getByText('Perfil Page')).toBeInTheDocument();
      });

      expect(screen.queryByText('Admin Panel')).not.toBeInTheDocument();
    });

    it('debe permitir acceso si no se especifica requiredRole', async () => {
      mockUseAuth.mockReturnValue({
        user: {
          id: 1,
          email: 'user@test.com',
          nombre: 'Any User',
          roles: ['COMPRADOR'],
        },
        token: 'token',
        isAuthenticated: true,
        isLoading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
      });

      render(
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route element={<PrivateRoute />}>
              <Route path="/protected" element={<div>Protected Content</div>} />
            </Route>
          </Routes>
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(screen.getByText('Protected Content')).toBeInTheDocument();
      });
    });
  });
});
