// src/context/AuthContext.tsx
// Real Firebase Auth context — replaces all mock/demo login logic.

import React, {
  createContext, useContext, useState, useEffect, ReactNode,
} from 'react';
import { Buyer, Vendor } from '../types';
import {
  subscribeToAuthState,
  fetchUserDoc,
  fetchVendorDoc,
  loginWithEmail,
  signUpWithEmail,
  logoutUser,
  CreateUserPayload,
} from '../lib/firebaseServices';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface AuthState {
  user: (Buyer | Vendor) | null;
  role: 'buyer' | 'vendor' | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  firebaseUid: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signUp: (payload: CreateUserPayload) => Promise<void>;
  logout: () => Promise<void>;
  /** Call this after vendor profile is created to update context without re-auth */
  setVendorProfile: (vendor: Vendor) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    role: null,
    isLoggedIn: false,
    isLoading: true,   // true on boot while Firebase resolves auth state
    firebaseUid: null,
  });

  // ── Listen to Firebase Auth state ──────────────────────────────────────────
  useEffect(() => {
    const unsubscribe = subscribeToAuthState(async (firebaseUser) => {
      if (!firebaseUser) {
        setState({ user: null, role: null, isLoggedIn: false, isLoading: false, firebaseUid: null });
        return;
      }

      try {
        // Fetch the user document which tells us the role
        const userDoc = await fetchUserDoc(firebaseUser.uid);
        if (!userDoc) {
          // Document doesn't exist yet (e.g. mid-registration); stay loading
          setState({ user: null, role: null, isLoggedIn: false, isLoading: false, firebaseUid: firebaseUser.uid });
          return;
        }

        if (userDoc.role === 'vendor') {
          // Fetch the full vendor profile
          const vendorDoc = await fetchVendorDoc(firebaseUser.uid);
          if (vendorDoc) {
            setState({
              user: vendorDoc,
              role: 'vendor',
              isLoggedIn: true,
              isLoading: false,
              firebaseUid: firebaseUser.uid,
            });
          } else {
            // Auth exists, user doc says vendor, but no vendor profile yet
            // (happens if registration was interrupted mid-way)
            setState({
              user: null,
              role: null,
              isLoggedIn: false,
              isLoading: false,
              firebaseUid: firebaseUser.uid,
            });
          }
        } else {
          setState({
            user: userDoc as Buyer,
            role: 'buyer',
            isLoggedIn: true,
            isLoading: false,
            firebaseUid: firebaseUser.uid,
          });
        }
      } catch (err) {
        console.error('[AuthContext] onAuthStateChanged error:', err);
        setState({ user: null, role: null, isLoggedIn: false, isLoading: false, firebaseUid: null });
      }
    });

    return unsubscribe;
  }, []);

  // ── Actions ────────────────────────────────────────────────────────────────

  const login = async (email: string, password: string): Promise<void> => {
    // isLoading will flip to true via onAuthStateChanged automatically
    await loginWithEmail(email, password);
    // onAuthStateChanged fires and fills state
  };

  const signUp = async (payload: CreateUserPayload): Promise<void> => {
    await signUpWithEmail(payload);
    // onAuthStateChanged fires and fills state
  };

  const logout = async (): Promise<void> => {
    await logoutUser();
    // onAuthStateChanged fires and clears state
  };

  /** After vendor completes profile creation, update context immediately */
  const setVendorProfile = (vendor: Vendor) => {
    setState((prev) => ({
      ...prev,
      user: vendor,
      role: 'vendor',
      isLoggedIn: true,
    }));
  };

  return (
    <AuthContext.Provider value={{ ...state, login, signUp, logout, setVendorProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};