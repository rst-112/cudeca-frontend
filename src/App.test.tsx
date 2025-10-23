import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

// Test suite principal del componente App
describe('App component', () => {
  it('renders the main heading', () => {
    render(<App />);
    expect(screen.getByText(/Vite \+ React/i)).toBeInTheDocument();
  });

  it('increments the counter when button is clicked', () => {
    render(<App />);
    const button = screen.getByRole('button', { name: /count is/i });
    fireEvent.click(button);
    expect(button.textContent).toMatch(/count is 1/i);
  });
});
