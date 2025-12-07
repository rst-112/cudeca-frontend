/**
 * Tipos relacionados con autenticación
 */

/**
 * User - Interfaz que define la estructura de un usuario
 *
 * @property {number} id - Identificador único del usuario
 * @property {string} email - Email del usuario
 * @property {string} nombre - Nombre completo del usuario
 * @property {string} rol - Rol del usuario en el sistema
 */
export interface User {
  id: number;
  email: string;
  nombre: string;
  rol: 'COMPRADOR' | 'ADMINISTRADOR' | 'PERSONAL_EVENTO';
}

/**
 * LoginCredentials - Credenciales para iniciar sesión
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * AuthResponse - Respuesta del backend al hacer login
 */
export interface AuthResponse {
  token: string;
  user: User;
}

export interface RegisterData {
  nombre: string;
  email: string;
  password: string;
}
