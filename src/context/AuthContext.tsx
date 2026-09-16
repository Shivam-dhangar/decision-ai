'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  getStoredSession,
  setStoredSession,
  clearStoredSession,
  UserSession,
} from '@/lib/storage/preferencesStorage';

interface AuthContextType {
  user: UserSession | null;
  isLoading: boolean;
  loginWithCredentials: (email: string, password?: string) => boolean;
  loginDemo: (name?: string, email?: string) => void;
  loginGuest: () => void;
  logout: () => void;
  isContactModalOpen: boolean;
  openContactModal: () => void;
  closeContactModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const loadSession = () => {
    const session = getStoredSession();
    setUser(session);
    setIsLoading(false);
  };

  useEffect(() => {
    loadSession();

    const handleAuthEvent = () => {
      loadSession();
    };

    window.addEventListener('decisionlens_auth_updated', handleAuthEvent);
    window.addEventListener('storage', handleAuthEvent);
    return () => {
      window.removeEventListener('decisionlens_auth_updated', handleAuthEvent);
      window.removeEventListener('storage', handleAuthEvent);
    };
  }, []);

  const loginWithCredentials = (email: string, password?: string): boolean => {
    const trimmed = email.trim();
    if (!trimmed) return false;

    // Support standard demo credentials
    const isStandardDemo =
      trimmed.toLowerCase() === 'demo@decisionlens.ai' ||
      trimmed.toLowerCase().includes('demo');

    const session: UserSession = {
      isLoggedIn: true,
      email: trimmed,
      name: isStandardDemo ? 'Zahir Khan (Demo User)' : trimmed.split('@')[0],
      isDemo: isStandardDemo,
      role: isStandardDemo ? 'Enterprise Demo Analyst' : 'Evaluator',
    };

    setUser(session);
    setStoredSession(session);
    return true;
  };

  const loginDemo = (
    name: string = 'Zahir Khan (Demo User)',
    email: string = 'demo@decisionlens.ai'
  ) => {
    const session: UserSession = {
      isLoggedIn: true,
      email,
      name,
      isDemo: true,
      role: 'Enterprise Demo Analyst',
    };
    setUser(session);
    setStoredSession(session);
  };

  const loginGuest = () => {
    const session: UserSession = {
      isLoggedIn: true,
      email: 'guest@decisionlens.local',
      name: 'Guest Explorer',
      isDemo: true,
      role: 'Guest User',
    };
    setUser(session);
    setStoredSession(session);
  };

  const logout = () => {
    clearStoredSession();
    setUser({
      isLoggedIn: false,
      email: '',
      name: '',
      isDemo: false,
    });
  };

  const openContactModal = () => setIsContactModalOpen(true);
  const closeContactModal = () => setIsContactModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        loginWithCredentials,
        loginDemo,
        loginGuest,
        logout,
        isContactModalOpen,
        openContactModal,
        closeContactModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
