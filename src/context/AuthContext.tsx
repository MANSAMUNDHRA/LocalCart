import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Vendor, Buyer } from '../types';

interface AuthState {
  user: (Buyer | Vendor) | null;
  role: 'buyer' | 'vendor' | null;
  isLoggedIn: boolean;
}

interface AuthContextType extends AuthState {
  loginAsBuyer: (buyer: Buyer) => void;
  loginAsVendor: (vendor: Vendor) => void;
  logout: () => void;
  switchRole: (role: 'buyer' | 'vendor') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    user: {
      id: 'b_demo',
      name: 'Demo Buyer',
      email: 'buyer@localmart.com',
      phone: '9999999999',
      role: 'buyer',
      deliveryAddress: 'Koramangala Bangalore',
    },
    role: 'buyer',
    isLoggedIn: true,
  });

  const loginAsBuyer = (buyer: Buyer) => {
    setState({ user: buyer, role: 'buyer', isLoggedIn: true });
  };

  const loginAsVendor = (vendor: Vendor) => {
    setState({ user: vendor, role: 'vendor', isLoggedIn: true });
  };

  const logout = () => {
    setState({ user: null, role: null, isLoggedIn: false });
  };

  const switchRole = (role: 'buyer' | 'vendor') => {
    if (role === 'buyer') {
      loginAsBuyer({
        id: 'b_demo',
        name: 'Demo Buyer',
        email: 'buyer@localmart.com',
        phone: '9999999999',
        role: 'buyer',
        deliveryAddress: '42, Koramangala, Bangalore 560034',
      });
    } else {
      const { VENDORS } = require('../data/mockData');
      loginAsVendor(VENDORS[0]);
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, loginAsBuyer, loginAsVendor, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
