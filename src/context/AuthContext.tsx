/**
 * AuthContext - Sistema de Autenticación Global
 *
 * Este archivo crea un "contexto" de React que permite compartir información
 * de autenticación (usuario, token) en TODA la aplicación sin tener que
 * pasar props manualmente entre componentes.
 *
 */

/* eslint-disable react-refresh/only-export-components */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import type { User, RegisterData } from '../types/auth.types';
import { authService } from '../services/auth.service';
import { AxiosError } from 'axios';

/**
  ============================================================================
  TIPOS Y CONSTANTES
  ============================================================================ 
*/

/**
 * AuthContextType - Define qué datos y funciones estarán disponibles en el contexto
 *
 * Cualquier componente que use useAuth() tendrá acceso a estas propiedades
 */
export interface AuthContextType {
  /** Usuario actual logueado (null si no hay sesión) */
  user: User | null;

  /** Token JWT para autenticar peticiones al backend (null si no hay sesión) */
  token: string | null;

  /** Atajo para saber si hay usuario logueado (true si hay token) */
  isAuthenticated: boolean;

  /** Indica si estamos cargando datos de sesión (mostrar spinners) */
  isLoading: boolean;

  /** Función para iniciar sesión - devuelve una Promise para usar con async/await */
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;

  /** Función para registrarse con opción de recordar sesión */
  register: (data: RegisterData, rememberMe?: boolean) => Promise<void>;

  /** Función para cerrar sesión */
  logout: () => void;

  /** Función para actualizar datos del usuario */
  updateUser: (data: Partial<User>) => void;
}

/**
  ============================================================================
  CREACIÓN DEL CONTEXTO
  ============================================================================
*/

/**
 * AuthContext - El contexto de autenticación
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
  ============================================================================
  PROVIDER - COMPONENTE QUE ENVUELVE LA APP
  ============================================================================
*/

/**
 * AuthProvider - Componente proveedor del contexto de autenticación
 *
 * USO:
 * ```tsx
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 * ```
 * @param {ReactNode} children
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  /**
    --------------------------------------------------------------------------
    ESTADO DEL COMPONENTE
    --------------------------------------------------------------------------
  */

  /**
   * user - Estado que guarda el usuario actual
   *
   * useState crea una variable especial que cuando cambia, React re-renderiza el componente
   */
  const [user, setUser] = useState<User | null>(null);

  /**
   * token - Estado que guarda el token JWT
   */
  const [token, setToken] = useState<string | null>(null);

  /**
   * isLoading - Estado que indica si estamos cargando la sesión
   */
  const [isLoading, setIsLoading] = useState<boolean>(true);

  /**
   * --------------------------------------------------------------------------
   * FUNCIÓN UPDATEUSER
   * --------------------------------------------------------------------------
   */

  /**
   * updateUser - Función para actualizar datos del usuario en el estado y almacenamiento
   *
   * @param {Partial<User>} data - Datos parciales para actualizar el usuario
   */
  const updateUser = useCallback((data: Partial<User>) => {
    setUser((prevUser) => {
      if (!prevUser) return null;

      const updatedUser = { ...prevUser, ...data };

      // Actualizamos también el almacenamiento local para que persista al recargar (F5)
      // Intentamos actualizar en ambos sitios por seguridad si authService no expone método
      if (localStorage.getItem('user')) {
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      if (sessionStorage.getItem('user')) {
        sessionStorage.setItem('user', JSON.stringify(updatedUser));
      }

      return updatedUser;
    });
  }, []);

  /**
    --------------------------------------------------------------------------
    FUNCIÓN LOGOUT
    --------------------------------------------------------------------------
  */

  /**
   * logout - Cierra la sesión del usuario
   *
   * useCallback memoriza esta función para que sea la MISMA en cada render.
   */
  const logout = useCallback(() => {
    authService.logout();
    setToken(null);
    setUser(null);
  }, []);

  /**
    --------------------------------------------------------------------------
    FUNCIÓN VALIDAR TOKEN CON EL BACKEND
    --------------------------------------------------------------------------
  */

  /**
   * validateToken - Verifica si un token es válido consultando al backend
   *
   * @param {string} tokenToValidate - token a validar
   * @returns {Promise<boolean>} true si es válido, false si no
   */
  const validateToken = useCallback(async (tokenToValidate: string): Promise<boolean> => {
    return authService.validateToken(tokenToValidate);
  }, []);

  /**
    --------------------------------------------------------------------------
    EFECTO: RESTAURAR SESIÓN AL CARGAR LA APP
    --------------------------------------------------------------------------
  */

  /**
   * useEffect - Se ejecuta cuando el componente se monta (aparece en pantalla)
   *
   * SIMPLIFICACIÓN: Confiamos en la lógica robusta del authService.
   * El servicio ya maneja:
   * - Detección de estados corruptos (tokens en ambos almacenamientos)
   * - Limpieza automática de datos inválidos
   * - Parsing seguro con try-catch
   */
  useEffect(() => {
    /**
     * initAuth - Función asíncrona que inicializa la autenticación
     */
    const initAuth = async () => {
      try {
        // 1. Usar authService para obtener token y usuario (con lógica determinista)
        const storedToken = authService.getToken();
        const storedUser = authService.getCurrentUser();

        // 2. Si no hay token o usuario, no hay sesión válida
        if (!storedToken || !storedUser) {
          return;
        }

        // 3. Validación básica de integridad del usuario
        if (!storedUser.id || !storedUser.email || !storedUser.roles?.length) {
          console.warn('Usuario con datos incompletos, limpiando sesión');
          logout();
          return;
        }

        // 4. Validar el token con el backend
        const isValid = await validateToken(storedToken);

        if (isValid) {
          // Token válido: restaurar sesión
          setToken(storedToken);
          setUser(storedUser);
        } else {
          // Token inválido: limpiar sesión
          console.warn('Token inválido, limpiando sesión');
          logout();
        }
      } catch (error) {
        // Error inesperado: limpiar sesión por seguridad
        console.error('Error en initAuth:', error);
        logout();
      } finally {
        // Siempre marcar como cargado
        setIsLoading(false);
      }
    };

    // Ejecutar la función
    initAuth();
  }, [logout, validateToken]); // Dependencias: si cambian, el efecto se vuelve a ejecutar

  /**
    --------------------------------------------------------------------------
    FUNCIÓN LOGIN
    --------------------------------------------------------------------------
  */

  /**
   * login - Inicia sesión con email y contraseña
   *
   * USO:
   * ```tsx
   * const { login } = useAuth();
   * await login('user@example.com', 'password123', true); // true para recordar sesión
   * ```
   * NOTA DE SEGURIDAD:
   * - La contraseña se envía en TEXTO PLANO al backend
   * - El BACKEND es responsable de hashear la contraseña
   *
   * @param {string} email
   * @param {string} password
   * @param {boolean} rememberMe - Si es true guarda en localStorage, si es false en sessionStorage
   * @throws {Error}
   */
  const login = useCallback(
    async (email: string, password: string, rememberMe: boolean = true) => {
      if (!email || !password) throw new Error('Email y contraseña son requeridos');

      setIsLoading(true);
      try {
        // Login con el backend usando authService (ya guarda en localStorage o sessionStorage)
        const { token: newToken, user: newUser } = await authService.login(
          { email, password },
          rememberMe,
        );

        // Actualizar el estado
        setToken(newToken);
        setUser(newUser);
      } catch (error) {
        logout();
        if (error instanceof AxiosError) {
          throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
        }
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [logout],
  );

  /**
   * register - Registra un nuevo usuario
   *
   * @param data - Datos del usuario a registrar
   * @param rememberMe - Si es true usa localStorage (por defecto), si es false usa sessionStorage
   */
  const register = useCallback(async (data: RegisterData, rememberMe: boolean = true) => {
    setIsLoading(true);
    try {
      // Registro con authService (implementa exclusión mutua estricta)
      const { token: newToken, user: newUser } = await authService.register(data, rememberMe);

      // Actualizar el estado
      setToken(newToken);
      setUser(newUser);
    } catch (error) {
      // Propagar el error
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Error al registrarse');
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const contextValue = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: !!token,
      isLoading,
      login,
      register,
      logout,
      updateUser,
    }),
    [user, token, isLoading, login, register, logout, updateUser],
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

/* ============================================================================
   HOOK PERSONALIZADO
   ============================================================================ */

/**
 * useAuth - Hook para acceder al contexto de autenticación
 *
 * Este hook es un atajo para usar el contexto de forma segura.
 * Lanza un error si intentas usarlo fuera de un AuthProvider.
 *
 * USO en cualquier componente:
 * ```tsx
 * function MiComponente() {
 *   const { user, login, logout } = useAuth();
 *
 *   if (!user) {
 *     return <p>No has iniciado sesión</p>;
 *   }
 *
 *   return (
 *     <div>
 *       <p>Hola, {user.nombre}!</p>
 *       <button onClick={logout}>Cerrar sesión</button>
 *     </div>
 *   );
 * }
 * ```
 *
 * @returns {AuthContextType}
 * @throws {Error}
 */
export const useAuth = (): AuthContextType => {
  // Intentar leer el contexto
  const context = useContext(AuthContext);

  // Si es undefined, significa que no estamos dentro de un AuthProvider
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }

  // Devolver el contexto
  return context;
};
