import { describe, it, expect, vi } from 'vitest';
import { getEventos, getEventoById, publicarEvento, createEvento } from './eventos.service';
import * as api from './api';

vi.mock('./api');

describe('eventos.service', () => {
  describe('getEventos', () => {
    it('fetches all eventos', async () => {
      const mockEventos = [
        { id: 1, nombre: 'Evento 1', estado: 'PUBLICADO' },
        { id: 2, nombre: 'Evento 2', estado: 'BORRADOR' },
      ];

      vi.mocked(api.apiGet).mockResolvedValue(mockEventos);

      const result = await getEventos();

      expect(api.apiGet).toHaveBeenCalledWith('/eventos');
      expect(result).toEqual(mockEventos);
    });

    it('handles errors when fetching eventos', async () => {
      vi.mocked(api.apiGet).mockRejectedValue(new Error('Network error'));

      await expect(getEventos()).rejects.toThrow('Network error');
    });
  });

  describe('getEventoById', () => {
    it('fetches evento by id', async () => {
      const mockEvento = { id: 1, nombre: 'Evento 1', estado: 'PUBLICADO' };

      vi.mocked(api.apiGet).mockResolvedValue(mockEvento);

      const result = await getEventoById(1);

      expect(api.apiGet).toHaveBeenCalledWith('/eventos/1');
      expect(result).toEqual(mockEvento);
    });

    it('handles errors when fetching evento by id', async () => {
      vi.mocked(api.apiGet).mockRejectedValue(new Error('Not found'));

      await expect(getEventoById(999)).rejects.toThrow('Not found');
    });
  });

  describe('publicarEvento', () => {
    it('publishes an evento', async () => {
      const mockEvento = { id: 1, nombre: 'Evento 1', estado: 'PUBLICADO' };

      vi.mocked(api.apiPatch).mockResolvedValue(mockEvento);

      const result = await publicarEvento(1);

      expect(api.apiPatch).toHaveBeenCalledWith('/eventos/1/publicar', null);
      expect(result).toEqual(mockEvento);
    });

    it('handles errors when publishing evento', async () => {
      vi.mocked(api.apiPatch).mockRejectedValue(new Error('Publish failed'));

      await expect(publicarEvento(1)).rejects.toThrow('Publish failed');
    });
  });

  describe('createEvento', () => {
    it('creates a new evento', async () => {
      const newEvento = {
        nombre: 'Nuevo Evento',
        lugar: 'Málaga',
        fechaInicio: '2024-12-25T00:00:00Z',
      };
      const mockResponse = { id: 1, ...newEvento, estado: 'BORRADOR' };

      vi.mocked(api.apiPost).mockResolvedValue(mockResponse);

      const result = await createEvento(newEvento);

      expect(api.apiPost).toHaveBeenCalledWith('/eventos', newEvento);
      expect(result).toEqual(mockResponse);
    });
  });
});
