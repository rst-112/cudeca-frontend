const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Función genérica para GET
export async function apiGet(path: string) {
  const response = await fetch(`${API_BASE_URL}${path}`);
  if (!response.ok) {
    throw new Error(`Error en GET ${path}: ${response.statusText}`);
  }
  return response.json();
}

// Función genérica para POST
export async function apiPost(path: string, body: unknown) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`Error en POST ${path}: ${response.statusText}`);
  }
  return response.json();
}

export async function testBackendConnection() {
  try {
    return await apiGet('/public/test');
  } catch (err) {
    console.error('Error conectando al backend:', err);
    return { message: 'Backend no disponible' };
  }
}
