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
        if (authService.isAuthenticated()) {
          const userInfo = await authService.getCurrentUser();
          if (userInfo) {
            setUser(userInfo);
            setIsAuthenticated(true);
          } else {
            // Token exists but user fetch failed, try once more before giving up
            console.warn('Failed to fetch user info, retrying...');
            try {
              await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
              const retryUserInfo = await authService.getCurrentUser();
              if (retryUserInfo) {
                setUser(retryUserInfo);
                setIsAuthenticated(true);
              } else {
                // Still failed, clear auth
                await authService.logout();
                setIsAuthenticated(false);
                setUser(null);
              }
            } catch (retryError) {
              console.error('Retry failed, clearing auth:', retryError);
              await authService.logout();
              setIsAuthenticated(false);
              setUser(null);
            }
          }
        } else {
          // Token doesn't exist or is expired
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Don't clear auth immediately, just set as not authenticated
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
      const response = await authService.login(username, password);
      if (response.access_token) {
        // Set authenticated state immediately after successful login
        setIsAuthenticated(true);
        
        // Set a basic user object first
        setUser({
          id: 0,
          username: username,
          is_active: true,
          is_admin: true
        });
        
        // Try to get real user info in the background
        try {
          const userInfo = await authService.getCurrentUser();
          if (userInfo) {
            setUser(userInfo);
          }
        } catch (userError) {
          console.warn('Failed to fetch detailed user info, using basic info:', userError);
          // Keep the basic user object we set earlier
        }
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
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