import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import * as api from './services/api';
import { act } from 'react';

vi.mock('./services/api');

describe('App component', () => {
  beforeEach(() => {
    vi.mocked(api.testBackendConnection).mockResolvedValue({ message: 'Mocked OK' });
  });

  it('renders the main heading and default text', () => {
    render(<App />);
    expect(screen.getByText(/Vite \+ React/i)).toBeInTheDocument();
    expect(screen.getByText(/Comprobando conexión/i)).toBeInTheDocument();
  });

  it('increments the counter when button is clicked', async () => {
    render(<App />);
    const button = screen.getByRole('button', { name: /count is/i });
    await act(async () => {
      fireEvent.click(button);
    });
    expect(button.textContent).toMatch(/count is 1/i);
  });

  it('shows success message when backend connection succeeds', async () => {
    vi.mocked(api.testBackendConnection).mockResolvedValueOnce({
      message: 'Backend operativo',
    });

    render(<App />);
    await waitFor(() => expect(screen.getByText(/Backend operativo/i)).toBeInTheDocument());
  });

  it('shows error message when backend connection fails', async () => {
    vi.mocked(api.testBackendConnection).mockRejectedValueOnce(new Error('Server down'));

    render(<App />);
    await waitFor(() =>
      expect(screen.getByText(/Error al conectar con backend/i)).toBeInTheDocument(),
    );
  });
});
