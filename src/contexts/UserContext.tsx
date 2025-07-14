
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { authService } from './AuthService';

export type UserRole = 'admin' | 'developer' | 'guest';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  avatar?: string;
  cognitoId?: string;
  userAttributes?: Record<string, string>;
  name: string;
  given_name: string;
  family_name: string;
}

interface UserContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (userData: User, token: string) => void;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  hasPermission: (permission: string) => boolean;
  refreshToken: () => Promise<string | null>;
  validateToken: () => Promise<boolean>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Mock user data
const mockUsers: { [key in UserRole]: User } = {
  admin: {
    id: '1',
    username: 'Admin User',
    email: 'admin@casinovizion.com',
    role: 'admin'
  },
  developer: {
    id: '2',
    username: 'Dev User',
    email: 'developer@casinovizion.com',
    role: 'developer'
  },
  guest: {
    id: '3',
    username: 'Guest User',
    email: 'guest@casinovizion.com',
    role: 'guest'
  }
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(mockUsers.admin); //change this from mockUsers.admin to null later
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const mapCognitoUserToAppUser = (cognitoUser: any, userAttributes: any): User => {
    // Map cognito data to the user structure

    const tempObj = {
      id: cognitoUser.username,
      username: cognitoUser.username,
      email: cognitoUser.signInDetails?.loginId || '',
      role: (cognitoUser.attributes?.['custom:role'] as UserRole) || 'admin',
      cognitoId: cognitoUser.userId,
      name: userAttributes.given_name || "",
      family_name: userAttributes.family_name || ""
    }

    //console.log("cognitoUser returned: ", tempObj)

    return tempObj
  };

  const loadUser = async () => {
    setIsLoading(true);
    try {
      const {cognitoUser, userAttributes} = await authService.getCurrentUser();
      const session = await authService.getSession();

      if (cognitoUser && session?.tokens?.idToken) {
        const appUser = mapCognitoUserToAppUser(cognitoUser, userAttributes);
        setUser(appUser);
        setToken(session.tokens.idToken.toString());
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (cognitoUser: any, authToken: string, userAttributes: any) => {
    
    const appUser = mapCognitoUserToAppUser(cognitoUser, userAttributes);
    //console.log(appUser)
    setUser(appUser);
    setToken(authToken);
    setIsAuthenticated(true);
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.signOut();
      setUser(mockUsers.guest);
      setToken(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;

    const permissions = {
      admin: ['view_all', 'add_edit_delete_users', 'add_edit_records', 'delete_records', 'edit_profile'],
      developer: ['view_all', 'add_edit_records', 'delete_records', 'edit_profile'],
      guest: ['view_all', 'add_edit_records', 'edit_profile']
    };

    return permissions[user.role]?.includes(permission) || false;
  };

  const refreshToken = async (): Promise<string | null> => {
    const newToken = await authService.refreshSession();
    if (newToken) {
      setToken(newToken);
    }
    return newToken;
  };

  const validateToken = async (): Promise<boolean> => {
    try {
      const session = await authService.getSession();
      if (!session?.tokens?.idToken) return false;

      const currentTime = Math.floor(Date.now() / 1000);
      return session.tokens.idToken.payload.exp > currentTime;
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <UserContext.Provider value={{
      user,
      token,
      isLoading,
      isAuthenticated,
      login,
      logout,
      updateUser,
      hasPermission,
      refreshToken,
      validateToken
    }}>
      {children}
    </UserContext.Provider>
  );
};


export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
