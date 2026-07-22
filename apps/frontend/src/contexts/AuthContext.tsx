import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { User, LoginFormData, RegisterFormData } from '../types';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginFormData) => Promise<void>;
  register: (userData: RegisterFormData) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = authService.getToken();
        const savedUser = authService.getUser();

        if (token && savedUser) {
          // Set user immediately from localStorage
          setUser(savedUser);

          // Optionally verify token in background (don't block UI)
          try {
            const { user: verifiedUser } = await authService.refreshToken();
            setUser(verifiedUser);
            authService.setUser(verifiedUser);
          } catch {
            // Token is invalid, clear auth data
            authService.logout();
            setUser(null);
          }
        }
      } catch {
        authService.logout();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginFormData) => {
    try {
      setLoading(true);
      const { user, token } = await authService.login(credentials);

      authService.setToken(token);
      authService.setUser(user);
      setUser(user);

      toast.success('Login successful!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterFormData) => {
    try {
      setLoading(true);
      const { user, token } = await authService.register(userData);

      authService.setToken(token);
      authService.setUser(user);
      setUser(user);

      toast.success('Registration successful!');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Registration failed'
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    toast.success('Logged out successfully');
  };

  const refreshUser = async () => {
    try {
      const { user: updatedUser } = await authService.getProfile();
      setUser(updatedUser);
      authService.setUser(updatedUser);
    } catch {
      logout();
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
