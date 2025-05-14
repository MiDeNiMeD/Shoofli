import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginCredentials, RegisterFormData } from '../models/types';
import { login, register, logout, getCurrentUser, updateCurrentUser } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<User>;
  register: (formData: RegisterFormData) => Promise<User>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<User | null>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Check for existing user on mount
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setIsLoading(false);
  }, []);
  
  const handleLogin = async (credentials: LoginCredentials): Promise<User> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const loggedInUser = login(credentials);
      
      if (!loggedInUser) {
        throw new Error('Invalid email or password');
      }
      
      setUser(loggedInUser);
      return loggedInUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRegister = async (formData: RegisterFormData): Promise<User> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const registeredUser = register(formData);
      
      // Don't automatically log in if user needs approval
      if (registeredUser.isApproved) {
        setUser(registeredUser);
      }
      
      return registeredUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during registration');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLogout = () => {
    logout();
    setUser(null);
  };
  
  const handleUpdateUser = async (userData: Partial<User>): Promise<User | null> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const updatedUser = updateCurrentUser(userData);
      
      if (updatedUser) {
        setUser(updatedUser);
      }
      
      return updatedUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while updating user');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  const clearError = () => {
    setError(null);
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        updateUser: handleUpdateUser,
        clearError
      }}
    >
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