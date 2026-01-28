import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthState, LoginCredentials, RegisterData, User } from '@/types';
import { mockUser } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'expense_tracker_auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Check for existing session
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const { user, token } = JSON.parse(stored);
        setState({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch {
        localStorage.removeItem(STORAGE_KEY);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock validation - in real app, this would be an API call
    if (credentials.email && credentials.password.length >= 6) {
      const token = 'mock_jwt_token_' + Date.now();
      const user: User = { ...mockUser, email: credentials.email };
      
      if (credentials.rememberMe) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, token }));
      } else {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ user, token }));
      }
      
      setState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
      
      toast({
        title: 'Welcome back!',
        description: `Logged in as ${user.email}`,
      });
      
      return true;
    }
    
    setState(prev => ({ ...prev, isLoading: false }));
    toast({
      title: 'Login failed',
      description: 'Invalid email or password',
      variant: 'destructive',
    });
    return false;
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock validation
    if (data.password !== data.confirmPassword) {
      setState(prev => ({ ...prev, isLoading: false }));
      toast({
        title: 'Registration failed',
        description: 'Passwords do not match',
        variant: 'destructive',
      });
      return false;
    }

    if (data.email && data.password.length >= 6 && data.name) {
      setState(prev => ({ ...prev, isLoading: false }));
      toast({
        title: 'Registration successful!',
        description: 'Please login with your new account',
      });
      return true;
    }
    
    setState(prev => ({ ...prev, isLoading: false }));
    toast({
      title: 'Registration failed',
      description: 'Please check your information',
      variant: 'destructive',
    });
    return false;
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
    toast({
      title: 'Logged out',
      description: 'See you next time!',
    });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Helper to get auth header for API calls
export function getAuthHeader(): { Authorization: string } | {} {
  const stored = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
  if (stored) {
    const { token } = JSON.parse(stored);
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}
