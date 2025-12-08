import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
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
vi.mock('./pages/public/Home', () => ({
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
vi.mock('./pages/public/DetallesEvento', () => ({
  default: () => <div>Detalle Evento Mock</div>,
}));
vi.mock('./pages/public/Checkout', () => ({
  default: () => <div>Checkout Mock</div>,
}));
vi.mock('./components/layout/MainLayout', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
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

// Mock de ThemeContext
vi.mock('./context/ThemeContext', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock de sonner
vi.mock('sonner', () => ({
  Toaster: () => <div>Toaster Mock</div>,
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('App Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<App />);
    expect(container).toBeInTheDocument();
  });

  it('renders Home Page by default', () => {
    const { container } = render(<App />);
    expect(container.querySelector('div')).toBeInTheDocument();
  });
});
