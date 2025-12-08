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
interface AuthContextType {
  /** Usuario actual logueado (null si no hay sesión) */
  user: User | null;

  /** Token JWT para autenticar peticiones al backend (null si no hay sesión) */
  token: string | null;

  /** Atajo para saber si hay usuario logueado (true si hay token) */
  isAuthenticated: boolean;

  /** Indica si estamos cargando datos de sesión (mostrar spinners) */
  isLoading: boolean;

  /** Función para iniciar sesión - devuelve una Promise para usar con async/await */
  login: (email: string, password: string) => Promise<void>;

  /** Función para registrarse */
  register: (data: RegisterData) => Promise<void>;

  /** Función para cerrar sesión */
  logout: () => void;
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
   */
  useEffect(() => {
    /**
     * initAuth - Función asíncrona que inicializa la autenticación
     */
    const initAuth = async () => {
      try {
        // 1. Intentar leer datos guardados de localStorage usando authService
        const storedToken = authService.getToken();
        const storedUser = authService.getCurrentUser();

        // 2. Si no hay token O no hay usuario, no hay sesión
        if (!storedToken || !storedUser) {
          setIsLoading(false);
          return;
        }

        // 3. Validar el token con el backend
        const isValid = await validateToken(storedToken);

        // 4. Si el token es válido, restaurar la sesión
        if (isValid) {
          setToken(storedToken);
          setUser(storedUser);
        } else {
          // Si no es válido, cerrar sesión
          logout();
        }
      } catch (error) {
        // Si algo sale mal, cerrar sesión
        console.error('Error restaurando sesión:', error);
        logout();
      } finally {
        // Siempre terminamos de cargar
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
   * await login('user@example.com', 'password123');
   * ```
   * NOTA DE SEGURIDAD:
   * - La contraseña se envía en TEXTO PLANO al backend
   * - El BACKEND es responsable de hashear la contraseña
   *
   * @param {string} email
   * @param {string} password
   * @throws {Error}
   */
  const login = useCallback(
    async (email: string, password: string) => {
      if (!email || !password) throw new Error('Email y contraseña son requeridos');

      try {
        // Login con el backend usando authService
        const { token: newToken, user: newUser } = await authService.login({ email, password });

        // Actualizar el estado
        setToken(newToken);
        setUser(newUser);
      } catch (error) {
        logout();
        if (error instanceof AxiosError) {
          throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
        }
        throw error;
      }
    },
    [logout],
  );

  /**
   * register - Registra un nuevo usuario
   */
  const register = useCallback(async (data: RegisterData) => {
    try {
      // Registro con authService
      await authService.register(data);

      // authService.register ya guarda el token y usuario en localStorage
      // Obtenerlos y actualizar el estado
      const token = authService.getToken();
      const user = authService.getCurrentUser();

      if (token && user) {
        setToken(token);
        setUser(user);
      }
    } catch (error) {
      // Propagar el error
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Error al registrarse');
      }
      throw error;
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
    }),
    [user, token, isLoading, login, register, logout],
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
