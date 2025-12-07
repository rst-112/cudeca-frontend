import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App component', () => {
  it('renders the main layout and home page by default', () => {
    render(<App />);

    // CORRECCIÓN: Usamos getAllByText porque el texto aparece 2 veces (Navbar y Footer)
    // Esto devuelve una lista (array) y comprobamos que tenga longitud mayor a 0
    const elementosCudeca = screen.getAllByText(/FUNDACIÓN CUDECA/i);
    expect(elementosCudeca.length).toBeGreaterThan(0);

    // 2. Comprobamos que el botón de Login existe en el menú
    expect(screen.getByText(/Login/i)).toBeInTheDocument();

    // 3. Comprobamos que se carga la página de Inicio por defecto
    // (Busca el título h1 que pusiste en Home.tsx)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });
});
