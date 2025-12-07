import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock matchMedia for ThemeProvider
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock de los componentes para simplificar el test de routing
vi.mock('./pages/Home', () => ({
  default: () => <div>Home Page Mock</div>,
}));
vi.mock('./features/auth/AuthPage', () => ({
  default: () => <div>Auth Page Mock</div>,
}));
vi.mock('./features/admin/AdminDashboard', () => ({
  default: () => <div>Admin Dashboard Mock</div>,
}));
vi.mock('./features/dashboard/Dashboard', () => ({
  default: () => <div>Dashboard Mock</div>,
}));

// Mock del servicio API para evitar llamadas reales en AuthProvider
vi.mock('./services/api', () => ({
  apiClient: {
    get: vi.fn().mockResolvedValue({ data: { valid: true } }),
    post: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  },
}));

// Mock de AuthContext para evitar lógica compleja
vi.mock('./context/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useAuth: () => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  }),
}));

describe('App Component', () => {
  it('renders without crashing', () => {
    render(<App />);
    // Verifica que se renderiza el layout (por ejemplo, buscando el logo o texto del header)
    expect(screen.getByText('Home Page Mock')).toBeInTheDocument();
  });

  it('renders Home Page by default', () => {
    render(<App />);
    expect(screen.getByText('Home Page Mock')).toBeInTheDocument();
  });
});
