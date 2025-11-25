import axios, { AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// 1. Crear instancia de Axios configurada
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Interceptor de Seguridad (Token)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Función genérica para GET
// Cambio 1: <T = unknown> en lugar de <T = any> para el tipo por defecto
export async function apiGet<T = unknown>(path: string): Promise<T> {
  try {
    const response = await apiClient.get<T>(path);
    return response.data;
  } catch (error) {
    // Cambio 2: Quitamos ': any' del catch y hacemos casting seguro a AxiosError
    const err = error as AxiosError;
    const errorMsg = err.response?.statusText || err.message;
    throw new Error(`Error en GET ${path}: ${errorMsg}`);
  }
}

// Función genérica para POST
// Cambio 3: <T = unknown> de nuevo
export async function apiPost<T = unknown>(path: string, body: unknown): Promise<T> {
  try {
    const response = await apiClient.post<T>(path, body);
    return response.data;
  } catch (error) {
    // Cambio 4: Casting seguro a AxiosError de nuevo
    const err = error as AxiosError;
    const errorMsg = err.response?.statusText || err.message;
    throw new Error(`Error en POST ${path}: ${errorMsg}`);
  }
}

export async function testBackendConnection() {
  try {
    // Aquí especificamos que esperamos un objeto con { message: string } o unknown
    return await apiGet<{ message: string }>('/public/test');
  } catch (err) {
    console.error('Error conectando al backend:', err);
    return { message: 'Backend no disponible' };
  }
}
