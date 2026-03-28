import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useOrders } from '../context/OrdersContext';
import { useAuth } from '../context/AuthContext';
import { Order, OrderStatus } from '../types';
import RatingModal from '../components/RatingModal';

const STATUS_CONFIG: Record<OrderStatus, { color: string; bg: string; icon: string; label: string }> = {
  pending:   { color: '#F59E0B', bg: '#FEF3C7', icon: 'time-outline',            label: 'Pending' },
  preparing: { color: '#3B82F6', bg: '#DBEAFE', icon: 'restaurant-outline',      label: 'Preparing' },
  ready:     { color: '#8B5CF6', bg: '#EDE9FE', icon: 'checkmark-circle-outline', label: 'Ready' },
  delivered: { color: '#10B981', bg: '#D1FAE5', icon: 'checkmark-done-outline',  label: 'Delivered' },
};

export default function BuyerOrdersScreen({ navigation }: any) {
  const { user } = useAuth();
  const { orders } = useOrders();
  const { rateOrder } = useOrders();

  const myOrders = orders.filter((o) => o.buyerId === (user?.id || 'b_demo') || true); // show all in demo
  const [ratingTarget, setRatingTarget] = useState<Order | null>(null);

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#F5EFE6' }}>
      <View className="px-5 pt-4 pb-3">
        <Text className="text-2xl font-bold text-gray-900">My Orders</Text>
        <Text className="text-xs text-gray-400 mt-0.5">{myOrders.length} total orders</Text>
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {myOrders.length === 0 ? (
          <View className="items-center py-16">
            <Ionicons name="receipt-outline" size={52} color="#D1D5DB" />
            <Text className="text-base text-gray-400 mt-3">No orders yet</Text>
          </View>
        ) : (
          myOrders.map((order) => {
            const sc = STATUS_CONFIG[order.orderStatus];
            return (
              <View key={order.id} className="bg-white rounded-2xl p-4 mb-3"
                style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}>

                {/* Header row */}
                <View className="flex-row items-center justify-between mb-2">
                  <View>
                    <Text className="text-xs font-bold text-gray-900">#{order.id.toUpperCase().slice(0, 10)}</Text>
                    <Text className="text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                      })}
                    </Text>
                  </View>
                  <View className="flex-row items-center px-3 py-1 rounded-full" style={{ backgroundColor: sc.bg }}>
                    <Ionicons name={sc.icon as any} size={13} color={sc.color} />
                    <Text className="text-xs font-semibold ml-1" style={{ color: sc.color }}>{sc.label}</Text>
                  </View>
                </View>

                {/* Vendor */}
                <View className="flex-row items-center mb-2">
                  <Ionicons name="storefront-outline" size={14} color="#9CA3AF" />
                  <Text className="text-sm font-semibold text-gray-700 ml-1">{order.vendorName}</Text>
                </View>

                {/* Items */}
                {order.items.map((item) => (
                  <View key={item.product.id} className="flex-row justify-between py-1">
                    <Text className="text-xs text-gray-600 flex-1" numberOfLines={1}>
                      {item.product.name} × {item.quantity}
                    </Text>
                    <Text className="text-xs font-medium text-gray-800 ml-2">
                      ₹{(item.product.price * item.quantity).toLocaleString()}
                    </Text>
                  </View>
                ))}

                <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <Text className="text-sm font-bold" style={{ color: '#FF7A30' }}>
                    Total: ₹{order.totalAmount.toLocaleString()}
                  </Text>

                  {/* Rate button — only for delivered & unrated */}
                  {order.orderStatus === 'delivered' && !order.rated && (
                    <TouchableOpacity
                      onPress={() => setRatingTarget(order)}
                      activeOpacity={0.8}
                      className="flex-row items-center px-3 py-1.5 rounded-full"
                      style={{ backgroundColor: '#FEF3C7' }}
                    >
                      <Ionicons name="star-outline" size={14} color="#F59E0B" />
                      <Text className="text-xs font-bold ml-1 text-amber-700">Rate</Text>
                    </TouchableOpacity>
                  )}

                  {order.rated && (
                    <View className="flex-row items-center">
                      {Array.from({ length: order.rating || 0 }).map((_, i) => (
                        <Ionicons key={i} name="star" size={13} color="#F59E0B" />
                      ))}
                    </View>
                  )}
                </View>
              </View>
            );
          })
        )}
        <View style={{ height: 20 }} />
      </ScrollView>

      {ratingTarget && (
        <RatingModal
          visible
          orderId={ratingTarget.id}
          vendorName={ratingTarget.vendorName}
          onClose={() => setRatingTarget(null)}
        />
      )}
    </SafeAreaView>
  );
}
