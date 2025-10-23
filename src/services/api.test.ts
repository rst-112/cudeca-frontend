import { beforeEach, describe, expect, it, vi } from 'vitest';
import { apiGet, apiPost, testBackendConnection } from './api';

type MockFetch = ReturnType<typeof vi.fn> & {
  mockResolvedValueOnce: (value: unknown) => void;
  mockRejectedValueOnce: (value: unknown) => void;
};

describe('API Service', () => {
  let mockFetch: MockFetch;

  beforeEach(() => {
    mockFetch = vi.fn() as unknown as MockFetch;
    globalThis.fetch = mockFetch as unknown as typeof fetch;
  });

  // --- apiGet ---
  it('returns data when GET response is ok', async () => {
    const mockResponse = { message: 'ok' };
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => mockResponse });

    const result = await apiGet('/test');
    expect(mockFetch).toHaveBeenCalledWith(expect.stringMatching(/\/test$/));
    expect(result).toEqual(mockResponse);
  });

  it('throws error when GET response is not ok', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, statusText: 'Bad Request' });
    await expect(apiGet('/error')).rejects.toThrow('Error en GET /error: Bad Request');
  });

  it('throws error when GET fails entirely', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));
    await expect(apiGet('/fail')).rejects.toThrow('Network error');
  });

  // --- apiPost ---
  it('returns data when POST response is ok', async () => {
    const mockResponse = { success: true };
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => mockResponse });

    const result = await apiPost('/submit', { name: 'Raul' });
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/submit$/),
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    expect(result).toEqual(mockResponse);
  });

  it('throws error when POST response is not ok', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, statusText: 'Internal Error' });
    await expect(apiPost('/fail', {})).rejects.toThrow('Error en POST /fail: Internal Error');
  });

  it('throws error when POST fails entirely', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network down'));
    await expect(apiPost('/network', {})).rejects.toThrow('Network down');
  });

  // --- testBackendConnection ---
  it('calls apiGet("/public/test") correctly', async () => {
    const mockResponse = { message: 'Backend operativo y conectado' };
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => mockResponse });

    const result = await testBackendConnection();
    expect(result).toEqual(mockResponse);
  });

  it('returns fallback message and logs error when backend connection fails', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const result = await testBackendConnection();

    expect(consoleSpy).toHaveBeenCalledWith('Error conectando al backend:', expect.any(Error));
    expect(result).toEqual({ message: 'Backend no disponible' });

    consoleSpy.mockRestore();
  });
});
