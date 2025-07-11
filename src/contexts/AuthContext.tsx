import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { getCurrentUser, signOut, fetchAuthSession } from '@aws-amplify/auth';

// Define los tipos para el usuario y el contexto
interface User {
  username?: string;
  userId?: string;
  userAttributes?: Record<string, string>;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  shown: boolean;
  isAuthenticated: boolean;
  login: (idTokenOrString: any) => Promise<boolean>;
  logout: () => Promise<boolean>;
  validateToken: () => Promise<boolean>;
  refreshToken: () => Promise<string | null>;
  checkAuthState: () => Promise<void>;
  checkAuthentication: () => Promise<void>;
  userAttributes: Record<string, string>;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Crear el contexto con tipo
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [shown, setShown] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check if user is authenticated on app load
  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const currentUser = await getCurrentUser();
      const session = await fetchAuthSession();
      
      if (currentUser && session.tokens?.idToken) {
        setUser(currentUser);
        setToken(session.tokens.idToken.toString());
        setShown(true);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setToken(null);
        setShown(false);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.log('No authenticated user found');
      setUser(null);
      setToken(null);
      setShown(false);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const checkAuthentication = async (): Promise<void> => {
    try {
      const currentUser = await getCurrentUser();
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken;
      
      if (currentUser && idToken) {
        setUser(currentUser);
        setToken(idToken.toString());
        setShown(true);
        setIsAuthenticated(true);
        
        // Check for Cognito redirect URL
        const cognitoRedirectUrl = idToken.payload['custom:redirect_url'] as string | undefined;
        if (cognitoRedirectUrl) {
          window.location.href = cognitoRedirectUrl;
          return;
        }
      } else {
        setUser(null);
        setToken(null);
        setShown(false);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Authentication check failed:', error);
      setUser(null);
      setToken(null);
      setShown(false);
      setIsAuthenticated(false);
    }
  };

  const validateToken = async (): Promise<boolean> => {
    try {
      const session = await fetchAuthSession();
      const currentUser = await getCurrentUser();
      
      if (currentUser && session.tokens?.idToken) {
        // Check if token is expired
        const idToken = session.tokens.idToken;
        const currentTime = Math.floor(Date.now() / 1000);
        
        if (idToken.payload.exp > currentTime) {
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Token validation failed:', error);
      // Clear invalid token
      setToken(null);
      setUser(null);
      setShown(false);
      setIsAuthenticated(false);
      return false;
    }
  };

  const login = async (idTokenOrString: any): Promise<boolean> => {
    try {
      // Handle both token object and token string
      const tokenString = typeof idTokenOrString === 'string' 
        ? idTokenOrString 
        : idTokenOrString?.toString();
      
      setToken(tokenString);
      
      // Get user details
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setShown(true);
      setIsAuthenticated(true);
      
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = async (): Promise<boolean> => {
    try {
      await signOut();
      setUser(null);
      setToken(null);
      setShown(false);
      setIsAuthenticated(false);
      alert("logged out");
      return true;
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if logout fails, clear local state
      setUser(null);
      setToken(null);
      setShown(false);
      setIsAuthenticated(false);
      alert("cleared local store");
      return false;
    }
  };

  const refreshToken = async (): Promise<string | null> => {
    try {
      const session = await fetchAuthSession({ forceRefresh: true });
      if (session.tokens?.idToken) {
        const newToken = session.tokens.idToken.toString();
        setToken(newToken);
        return newToken;
      }
      return null;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return null;
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    shown,
    isAuthenticated,
    login,
    logout,
    validateToken,
    refreshToken,
    checkAuthState,
    checkAuthentication,
    // Helper methods
    userAttributes: user?.userAttributes || {},
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};