import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, SafeAreaView, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useOrders } from '../context/OrdersContext';
import { useAuth } from '../context/AuthContext';
import { Order, OrderStatus } from '../types';

const STATUS_CONFIG: Record<OrderStatus, { color: string; bg: string; icon: string; next?: OrderStatus; nextLabel?: string }> = {
  pending:   { color: '#F59E0B', bg: '#FEF3C7', icon: 'time-outline',             next: 'preparing', nextLabel: 'Start Preparing' },
  preparing: { color: '#3B82F6', bg: '#DBEAFE', icon: 'restaurant-outline',       next: 'ready',     nextLabel: 'Mark Ready' },
  ready:     { color: '#8B5CF6', bg: '#EDE9FE', icon: 'checkmark-circle-outline', next: 'delivered', nextLabel: 'Mark Delivered' },
  delivered: { color: '#10B981', bg: '#D1FAE5', icon: 'checkmark-done-outline' },
};

export default function OrdersScreen({ navigation }: any) {
  const { orders, updateOrderStatus } = useOrders();
  const { user } = useAuth();
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');

  // In demo, show all orders for the mocked vendor
  const vendorOrders = orders.filter((o) => o.vendorId === (user as any)?.id || true);
  const filtered = filter === 'all' ? vendorOrders : vendorOrders.filter((o) => o.orderStatus === filter);

  const advance = (order: Order) => {
    const sc = STATUS_CONFIG[order.orderStatus];
    if (!sc.next) return;
    Alert.alert('Update Status', `Mark this order as "${sc.next}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Confirm', onPress: () => updateOrderStatus(order.id, sc.next!) },
    ]);
  };

  const filters: { label: string; value: OrderStatus | 'all' }[] = [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Preparing', value: 'preparing' },
    { label: 'Ready', value: 'ready' },
    { label: 'Delivered', value: 'delivered' },
  ];

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#F5EFE6' }}>
      <View className="px-5 pt-4 pb-2">
        <Text className="text-2xl font-bold text-gray-900">Incoming Orders</Text>
        <Text className="text-xs text-gray-400 mt-0.5">{vendorOrders.length} total</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 10 }}>
        {filters.map((f) => (
          <TouchableOpacity
            key={f.value}
            onPress={() => setFilter(f.value)}
            className="mr-2 px-4 py-2 rounded-full"
            style={{ backgroundColor: filter === f.value ? '#FF7A30' : '#fff' }}
          >
            <Text className="text-sm font-semibold" style={{ color: filter === f.value ? '#fff' : '#6B6B6B' }}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {filtered.length === 0 ? (
          <View className="items-center py-16">
            <Ionicons name="receipt-outline" size={52} color="#D1D5DB" />
            <Text className="text-sm text-gray-400 mt-3">No orders here</Text>
          </View>
        ) : (
          filtered.map((order) => {
            const sc = STATUS_CONFIG[order.orderStatus];
            return (
              <View key={order.id} className="bg-white rounded-2xl p-4 mb-3"
                style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}>

                <View className="flex-row items-center justify-between mb-2">
                  <View>
                    <Text className="text-sm font-bold text-gray-900">#{order.id.toUpperCase().slice(0, 10)}</Text>
                    <Text className="text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                      })}
                    </Text>
                  </View>
                  <View className="flex-row items-center px-3 py-1 rounded-full" style={{ backgroundColor: sc.bg }}>
                    <Ionicons name={sc.icon as any} size={13} color={sc.color} />
                    <Text className="text-xs font-semibold ml-1 capitalize" style={{ color: sc.color }}>{order.orderStatus}</Text>
                  </View>
                </View>

                <View className="flex-row items-center mb-2">
                  <Ionicons name="person-outline" size={13} color="#9CA3AF" />
                  <Text className="text-sm text-gray-600 ml-1">{order.buyerName}</Text>
                </View>

                {order.items.map((item) => (
                  <View key={item.product.id} className="flex-row justify-between py-0.5">
                    <Text className="text-xs text-gray-700 flex-1" numberOfLines={1}>
                      {item.product.name} × {item.quantity}
                    </Text>
                    <Text className="text-xs font-medium text-gray-800">₹{(item.product.price * item.quantity).toLocaleString()}</Text>
                  </View>
                ))}

                <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <Text className="text-sm font-bold" style={{ color: '#FF7A30' }}>
                    ₹{order.totalAmount.toLocaleString()}
                  </Text>
                  {sc.next && (
                    <TouchableOpacity
                      onPress={() => advance(order)}
                      activeOpacity={0.8}
                      className="flex-row items-center px-4 py-2 rounded-full"
                      style={{ backgroundColor: sc.color }}
                    >
                      <Text className="text-white text-xs font-bold">{sc.nextLabel}</Text>
                      <Ionicons name="arrow-forward" size={13} color="#fff" style={{ marginLeft: 4 }} />
                    </TouchableOpacity>
                  )}
                </View>

                <View className="flex-row items-start mt-2 pt-2 border-t border-gray-50">
                  <Ionicons name="location-outline" size={13} color="#9CA3AF" />
                  <Text className="text-xs text-gray-400 ml-1 flex-1">{order.deliveryAddress}</Text>
                </View>
              </View>
            );
          })
        )}
        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
