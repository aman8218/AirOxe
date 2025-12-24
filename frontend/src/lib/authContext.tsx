'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
  isLoading: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session, status } = useSession();

  // Sync with NextAuth session
  useEffect(() => {
    if (status === 'loading') {
      setIsLoading(true);
      return;
    }

    if (session?.user) {
      // User logged in via OAuth
      const oauthUser: User = {
        id: session.user.email || '',
        fullName: session.user.name || '',
        email: session.user.email || '',
        role: (session.user.role as 'user' | 'admin') || 'user',
      };
      
      setUser(oauthUser);
      setToken(session.user.accessToken || '');
      
      // Store in localStorage for consistency
      localStorage.setItem('user', JSON.stringify(oauthUser));
      localStorage.setItem('token', session.user.accessToken || '');
      
      setIsLoading(false);
    } else {
      // Check localStorage for regular email/password login
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      }
      
      setIsLoading(false);
    }
  }, [session, status]);

  const login = (userData: User, userToken: string) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);