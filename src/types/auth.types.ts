/**
 * Tipos relacionados con autenticación
 */

/**
 * Role - Tipo que define los roles disponibles en el sistema.
 * Corresponde a los roles de Spring Security en el Backend.
 */
export type Role = 'COMPRADOR' | 'ADMINISTRADOR' | 'PERSONAL_EVENTO';

/**
 * User - Interfaz que define la estructura de un usuario
 *
 * @property {number} id - Identificador único del usuario
 * @property {string} email - Email del usuario
 * @property {string} nombre - Nombre completo del usuario
 * @property {Role[]} roles - Lista de roles del usuario en el sistema
 */
export interface User {
  id: number;
  email: string;
  nombre: string;
  roles: Role[];
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

/**
 * RegisterData - Datos para registrar un nuevo usuario
 */
export interface RegisterData {
  nombre: string;
  email: string;
  password: string;
}
