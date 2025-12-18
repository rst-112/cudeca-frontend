import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { EventCarousel } from './EventCarousel';
import * as eventosService from '../services/eventos.service';

vi.mock('../services/eventos.service');

describe('EventCarousel', () => {
  const mockEventos = [
    {
      id: 1,
      nombre: 'Evento Test 1',
      descripcion: 'Descripción del evento 1',
      lugar: 'Málaga',
      fechaInicio: '2024-12-25',
      fechaFin: '2024-12-25',
      estado: 'PUBLICADO' as const,
      imagenUrl: 'https://example.com/image1.jpg',
      objetivoRecaudacion: 5000,
    },
    {
      id: 2,
      nombre: 'Evento Test 2',
      descripcion: 'Descripción del evento 2',
      lugar: 'Marbella',
      fechaInicio: '2024-12-26',
      fechaFin: '2024-12-26',
      estado: 'PUBLICADO' as const,
      imagenUrl: undefined,
      objetivoRecaudacion: 0,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state initially', () => {
    vi.mocked(eventosService.getEventos).mockImplementation(
      () => new Promise(() => {}), // Never resolves
    );

    render(
      <BrowserRouter>
        <EventCarousel />
      </BrowserRouter>,
    );

    expect(screen.getByText('Cargando eventos...')).toBeInTheDocument();
  });

  it('shows empty state when no events', async () => {
    vi.mocked(eventosService.getEventos).mockResolvedValue([]);

    render(
      <BrowserRouter>
        <EventCarousel />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('No hay eventos publicados disponibles')).toBeInTheDocument();
    });
  });

  it('renders events carousel', async () => {
    vi.mocked(eventosService.getEventos).mockResolvedValue(mockEventos);

    render(
      <BrowserRouter>
        <EventCarousel />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('Evento Test 1')).toBeInTheDocument();
    });

    expect(screen.getByText('Málaga')).toBeInTheDocument();
    expect(screen.getAllByText(/Ver Detalles/)[0]).toBeInTheDocument();
  });

  it('navigates between slides', async () => {
    vi.mocked(eventosService.getEventos).mockResolvedValue(mockEventos);

    render(
      <BrowserRouter>
        <EventCarousel />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('Evento Test 1')).toBeInTheDocument();
    });

    const nextButton = screen.getByLabelText('Siguiente evento');
    fireEvent.click(nextButton);

    // After navigation, second event should be visible
    await waitFor(() => {
      expect(screen.getByText('Evento Test 2')).toBeInTheDocument();
    });
  });

  it('handles image error gracefully', async () => {
    vi.mocked(eventosService.getEventos).mockResolvedValue(mockEventos);

    const { container } = render(
      <BrowserRouter>
        <EventCarousel />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('Evento Test 1')).toBeInTheDocument();
    });

    // Find the image and trigger error
    const images = container.querySelectorAll('img');
    if (images[0]) {
      fireEvent.error(images[0]);
    }

    // Should still render the event
    expect(screen.getByText('Evento Test 1')).toBeInTheDocument();
  });
});
