import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Order, OrderStatus } from '../types';
import { MOCK_ORDERS } from '../data/mockData';

interface OrdersContextType {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  rateOrder: (orderId: string, rating: number) => void;
  getOrdersForVendor: (vendorId: string) => Order[];
  getOrdersForBuyer: (buyerId: string) => Order[];
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export const OrdersProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);

  const addOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, orderStatus: status } : o))
    );
  };

  const rateOrder = (orderId: string, rating: number) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, rated: true, rating } : o
      )
    );
  };

  const getOrdersForVendor = (vendorId: string) =>
    orders.filter((o) => o.vendorId === vendorId);

  const getOrdersForBuyer = (buyerId: string) =>
    orders.filter((o) => o.buyerId === buyerId);

  return (
    <OrdersContext.Provider
      value={{ orders, addOrder, updateOrderStatus, rateOrder, getOrdersForVendor, getOrdersForBuyer }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error('useOrders must be used inside OrdersProvider');
  return ctx;
};
