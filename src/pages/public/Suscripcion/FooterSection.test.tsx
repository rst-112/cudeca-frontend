import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FooterSection } from './FooterSection';

describe('Suscripcion - FooterSection', () => {
  it('renderiza correctamente', () => {
    render(<FooterSection />);
    expect(screen.getByText('Fundación Cudeca')).toBeInTheDocument();
  });

  it('renderiza todos los enlaces rápidos', () => {
    render(<FooterSection />);
    expect(screen.getByText('Sobre Nosotros')).toBeInTheDocument();
    expect(screen.getByText('Nuestros Servicios')).toBeInTheDocument();
    expect(screen.getByText('Cómo Ayudar')).toBeInTheDocument();
  });

  it('renderiza todos los enlaces de eventos', () => {
    render(<FooterSection />);
    expect(screen.getByText('Próximos Eventos')).toBeInTheDocument();
    expect(screen.getByText('Eventos Pasados')).toBeInTheDocument();
  });

  it('renderiza información de contacto', () => {
    render(<FooterSection />);
    expect(screen.getByText('Calle Virgen de la Peña, 7')).toBeInTheDocument();
    expect(screen.getByText('29602 Marbella, Málaga')).toBeInTheDocument();
    expect(screen.getByText('Tel: +34 952 56 47 10')).toBeInTheDocument();
    expect(screen.getByText('info@cudeca.org')).toBeInTheDocument();
  });

  it('renderiza el copyright', () => {
    render(<FooterSection />);
    expect(screen.getByText(/© 2025 Fundación Cudeca/)).toBeInTheDocument();
  });

  it('renderiza enlaces legales', () => {
    render(<FooterSection />);
    expect(screen.getByText('Política de Privacidad')).toBeInTheDocument();
    expect(screen.getByText('Términos y Condiciones')).toBeInTheDocument();
  });
});

