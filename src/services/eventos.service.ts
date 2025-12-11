// import axios from 'axios';
// import { ApiResponse } from '../types/api.types';
import type { Evento } from '../types/api.types';
import { MOCK_EVENTOS } from '../data/mockData';

// Asume que la URL base de la API está en una variable de entorno
// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const USE_MOCK_DATA = true; // <-- ¡LA CLAVE! Cambia a `false` para usar la API real

/**
 * Simula una petición a la API con un retardo.
 * @param data Los datos a devolver.
 * @param delay El tiempo de espera en milisegundos.
 */
const mockApiCall = <T>(data: T, delay = 500): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, delay);
  });
};

/**
 * getEventos - Obtiene la lista de todos los eventos
 */
export const getEventos = async (): Promise<Evento[]> => {
  if (USE_MOCK_DATA) {
    console.log('Usando datos mock para getEventos');
    return mockApiCall(MOCK_EVENTOS);
  }

  // --- Código para la API real (actualmente comentado) ---
  // try {
  //   const response = await axios.get<ApiResponse<Evento[]>>(`${API_URL}/eventos`);
  //   return response.data.data;
  // } catch (error) {
  //   console.error('Error fetching eventos:', error);
  //   throw error;
  // }
  return Promise.reject('La API real no está implementada todavía.');
};

/**
 * getEventoById - Obtiene un evento por su ID
 * @param id - El ID del evento
 */
export const getEventoById = async (id: number): Promise<Evento> => {
  if (USE_MOCK_DATA) {
    console.log(`Usando datos mock para getEventoById con id: ${id}`);
    const evento = MOCK_EVENTOS.find((e) => e.id === id);
    if (evento) {
      return mockApiCall(evento);
    } else {
      return Promise.reject(`No se encontró un evento con id ${id}`);
    }
  }

  // --- Código para la API real (actualmente comentado) ---
  // try {
  //   const response = await axios.get<ApiResponse<Evento>>(`${API_URL}/eventos/${id}`);
  //   return response.data.data;
  // } catch (error) {
  //   console.error(`Error fetching evento with id ${id}:`, error);
  //   throw error;
  // }
  return Promise.reject('La API real no está implementada todavía.');
};

/**
 * createEvento - Crea un nuevo evento
 * @param eventoData - Los datos del evento a crear (sin el id)
 */
export const createEvento = async (eventoData: Omit<Evento, 'id'>): Promise<Evento> => {
  if (USE_MOCK_DATA) {
    console.log('Usando datos mock para createEvento');
    const nuevoId = Math.max(...MOCK_EVENTOS.map(e => e.id)) + 1;
    const nuevoEvento: Evento = {
      id: nuevoId,
      ...eventoData,
    };
    MOCK_EVENTOS.push(nuevoEvento);
    return mockApiCall(nuevoEvento);
  }

  // --- Código para la API real (actualmente comentado) ---
  // try {
  //   const response = await axios.post<ApiResponse<Evento>>(`${API_URL}/eventos`, eventoData);
  //   return response.data.data;
  // } catch (error) {
  //   console.error('Error creating evento:', error);
  //   throw error;
  // }
  return Promise.reject('La API real no está implementada todavía.');
};
