// src/context/OrdersContext.tsx
// Real Firestore-backed orders context with realtime listeners.

import React, {
  createContext, useContext, useState, useEffect, ReactNode,
} from 'react';
import { Order, OrderStatus } from '../types';
import { useAuth } from './AuthContext';
import {
  subscribeToVendorOrders,
  subscribeToBuyerOrders,
  updateOrderStatusInDb,
  rateOrderInDb,
  placeOrder as placeOrderInDb,
  PlaceOrderPayload,
} from '../lib/firebaseServices';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface OrdersContextType {
  orders: Order[];
  isLoading: boolean;
  placeOrder: (payload: PlaceOrderPayload) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  rateOrder: (orderId: string, rating: number) => Promise<void>;
  getOrdersForVendor: (vendorId: string) => Order[];
  getOrdersForBuyer: (buyerId: string) => Order[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────────────────────

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export const OrdersProvider = ({ children }: { children: ReactNode }) => {
  const { firebaseUid, role, isLoggedIn } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Subscribe to orders based on role whenever the user logs in/out
  useEffect(() => {
    if (!isLoggedIn || !firebaseUid || !role) {
      setOrders([]);
      return;
    }

    setIsLoading(true);

    let unsubscribe: () => void;

    if (role === 'vendor') {
      unsubscribe = subscribeToVendorOrders(firebaseUid, (incoming) => {
        setOrders(incoming);
        setIsLoading(false);
      });
    } else {
      unsubscribe = subscribeToBuyerOrders(firebaseUid, (incoming) => {
        setOrders(incoming);
        setIsLoading(false);
      });
    }

    return () => unsubscribe?.();
  }, [isLoggedIn, firebaseUid, role]);

  // ── Actions ────────────────────────────────────────────────────────────────

  const placeOrder = async (payload: PlaceOrderPayload): Promise<Order> => {
    return placeOrderInDb(payload);
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<void> => {
    await updateOrderStatusInDb(orderId, status);
    // Firestore listener will update local state automatically
  };

  const rateOrder = async (orderId: string, rating: number): Promise<void> => {
    await rateOrderInDb(orderId, rating);
  };

  const getOrdersForVendor = (vendorId: string) =>
    orders.filter((o) => o.vendorId === vendorId);

  const getOrdersForBuyer = (buyerId: string) =>
    orders.filter((o) => o.buyerId === buyerId);

  return (
    <OrdersContext.Provider
      value={{
        orders,
        isLoading,
        placeOrder,
        updateOrderStatus,
        rateOrder,
        getOrdersForVendor,
        getOrdersForBuyer,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = (): OrdersContextType => {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error('useOrders must be used inside OrdersProvider');
  return ctx;
};
