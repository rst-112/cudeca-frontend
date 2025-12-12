import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { FooterSection } from './FooterSection';

describe('PerfilUsuario - FooterSection', () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('renderiza correctamente', () => {
    renderWithRouter(<FooterSection />);
    expect(screen.getByText('Fundación Cudeca')).toBeInTheDocument();
  });

  it('renderiza todos los enlaces rápidos', () => {
    renderWithRouter(<FooterSection />);
    expect(screen.getByText('Sobre Nosotros')).toBeInTheDocument();
    expect(screen.getByText('Nuestros Servicios')).toBeInTheDocument();
    expect(screen.getByText('Cómo Ayudar')).toBeInTheDocument();
  });

  it('renderiza todos los enlaces de eventos', () => {
    renderWithRouter(<FooterSection />);
    expect(screen.getByText('Próximos Eventos')).toBeInTheDocument();
    expect(screen.getByText('Eventos Pasados')).toBeInTheDocument();
  });

  it('renderiza información de contacto con diferentes tipos', () => {
    renderWithRouter(<FooterSection />);

    // Verifica address
    expect(screen.getByText('Calle Virgen de la Peña, 7')).toBeInTheDocument();
    expect(screen.getByText('29602 Marbella, Málaga')).toBeInTheDocument();

    // Verifica phone
    const phoneLink = screen.getByText('Tel: +34 952 56 47 10');
    expect(phoneLink).toBeInTheDocument();

    // Verifica email
    const emailLink = screen.getByText('info@cudeca.org');
    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute('href', 'mailto:info@cudeca.org');
  });

  it('renderiza el copyright', () => {
    renderWithRouter(<FooterSection />);
    expect(screen.getByText(/© 2025 Fundación Cudeca/)).toBeInTheDocument();
  });

  it('renderiza enlaces legales', () => {
    renderWithRouter(<FooterSection />);
    expect(screen.getByText('Política de Privacidad')).toBeInTheDocument();
    expect(screen.getByText('Términos y Condiciones')).toBeInTheDocument();
  });
});
