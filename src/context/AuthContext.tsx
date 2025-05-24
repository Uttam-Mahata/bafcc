import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthService } from '../services/AuthService';
import type { UserInfo } from '../services/AuthService';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  user: UserInfo | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const authService = AuthService.getInstance();

  useEffect(() => {
    // Check if user is already logged in and get user info
    const initializeAuth = async () => {
      try {
        setLoading(true);
        
        // Check if tokens exist and are valid
        if (authService.isAuthenticated()) {
          const userInfo = await authService.getCurrentUser();
          if (userInfo) {
            setUser(userInfo);
            setIsAuthenticated(true);
          } else {
            // Token exists but user fetch failed, clear auth
            await authService.logout();
            setIsAuthenticated(false);
            setUser(null);
          }
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear invalid authentication
        await authService.logout();
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await authService.login(username, password);
      if (response.access_token) {
        // Get user info after successful login
        const userInfo = await authService.getCurrentUser();
        if (userInfo) {
          // Update all states synchronously
          setUser(userInfo);
          setIsAuthenticated(true);
          setLoading(false);
          return true;
        }
      }
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 