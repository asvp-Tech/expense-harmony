import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthState, LoginCredentials, RegisterData, User } from '@/types';
import { authApi } from '@/lib/api';
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
    const stored = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const { user, token } = JSON.parse(stored);
        setState({ user, token, isAuthenticated: true, isLoading: false });
      } catch {
        localStorage.removeItem(STORAGE_KEY);
        sessionStorage.removeItem(STORAGE_KEY);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const response = await authApi.login(credentials.email, credentials.password);
      const token = response.token;
      const user: User = response.user || {
        id: '',
        name: credentials.email.split('@')[0],
        email: credentials.email,
      };

      const storage = credentials.rememberMe ? localStorage : sessionStorage;
      storage.setItem(STORAGE_KEY, JSON.stringify({ user, token }));

      setState({ user, token, isAuthenticated: true, isLoading: false });

      toast({ title: 'Welcome back!', description: `Logged in as ${user.email}` });
      return true;
    } catch (error: any) {
      setState(prev => ({ ...prev, isLoading: false }));
      toast({
        title: 'Login failed',
        description: error.message || 'Invalid email or password',
        variant: 'destructive',
      });
      return false;
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      if (data.password !== data.confirmPassword) {
        throw new Error('Passwords do not match');
      }
      await authApi.register(data);
      setState(prev => ({ ...prev, isLoading: false }));
      toast({ title: 'Registration successful!', description: 'Please login with your new account' });
      return true;
    } catch (error: any) {
      setState(prev => ({ ...prev, isLoading: false }));
      toast({
        title: 'Registration failed',
        description: error.message || 'Please check your information',
        variant: 'destructive',
      });
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
    setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
    toast({ title: 'Logged out', description: 'See you next time!' });
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
