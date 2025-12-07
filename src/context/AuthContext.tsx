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
import type { User } from '../types/auth.types';
import { apiClient } from '../services/api'; // Servicio para llamadas HTTP (por implementar)

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

  /** Función para cerrar sesión */
  logout: () => void;
}

/**
 * STORAGE_KEYS - Nombres de las claves usadas en localStorage
 */
const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'auth_user',
} as const;

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
    // Limpiar localStorage
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);

    // Limpiar estado de React
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
    try {
      const response = await apiClient.get('/auth/validate', {
        headers: { Authorization: `Bearer ${tokenToValidate}` },
      });
      return response.data.valid;
    } catch {
      return false;
    }
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
        // 1. Intentar leer datos guardados de localStorage
        const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
        const storedUser = localStorage.getItem(STORAGE_KEYS.USER);

        // 2. Si no hay token O no hay usuario, no hay sesión
        if (!storedToken || !storedUser) {
          setIsLoading(false); // Terminamos de cargar
          return; // Salimos de la función
        }

        // 3. Intentar parsear el JSON del usuario
        const parsedUser: User = JSON.parse(storedUser);

        // 4. Validar que el usuario tiene los campos obligatorios
        if (!parsedUser.id || !parsedUser.email || !parsedUser.rol) {
          throw new Error('Usuario inválido');
        }

        // 5. Validar el token con el backend
        const isValid = await validateToken(storedToken);

        // 6. Si el token es válido, restaurar la sesión
        if (isValid) {
          setToken(storedToken);
          setUser(parsedUser);
        } else {
          // Si no es válido, cerrar sesión
          logout();
        }
      } catch (error) {
        // Si algo sale mal (JSON inválido, error de red, etc.), cerrar sesión
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
      if (!email || !password) {
        throw new Error('Email y contraseña son requeridos');
      }

      try {
        const response = await apiClient.post('/auth/login', { email, password });
        const { token: newToken, user: newUser } = response.data;

        if (!newToken || !newUser) {
          throw new Error('Respuesta inválida del servidor');
        }

        localStorage.setItem(STORAGE_KEYS.TOKEN, newToken);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));

        setToken(newToken);
        setUser(newUser);
      } catch (error) {
        logout();
        throw error;
      }
    },
    [logout],
  );

  /**
    --------------------------------------------------------------------------
    VALOR DEL CONTEXTO
    --------------------------------------------------------------------------
  */

  /**
   * contextValue - Objeto con todos los datos y funciones del contexto
   *
   * useMemo memoriza este objeto para que sea el MISMO en cada render
   * a menos que alguna dependencia cambie.
   *
   * Esto evita que todos los componentes que usan useAuth se re-rendericen
   * innecesariamente.
   */
  const contextValue = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: !!token,
      isLoading,
      login,
      logout,
    }),
    [user, token, isLoading, login, logout], // Si alguno cambia, se recrea el objeto
  );

  /* --------------------------------------------------------------------------
     RENDERIZADO
     -------------------------------------------------------------------------- */

  /**
   * El Provider envuelve los children y les da acceso al contextValue
   */
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
