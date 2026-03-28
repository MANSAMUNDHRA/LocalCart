import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Image, SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';

export default function CartScreen({ navigation }: any) {
  const { items, removeFromCart, updateQuantity, totalAmount, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <SafeAreaView className="flex-1" style={{ backgroundColor: '#F5EFE6' }}>
        <View className="flex-1 items-center justify-center px-6">
          <View
            className="w-24 h-24 rounded-full items-center justify-center mb-4"
            style={{ backgroundColor: '#FFF3EC' }}
          >
            <Ionicons name="bag-outline" size={44} color="#FF7A30" />
          </View>
          <Text className="text-xl font-bold text-gray-900">Your cart is empty</Text>
          <Text className="text-sm text-gray-500 mt-2 text-center">
            Browse nearby vendors and add{'\n'}products to your cart
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('HomeTab')}
            activeOpacity={0.85}
            className="mt-6 px-8 py-3.5 rounded-xl"
            style={{ backgroundColor: '#FF7A30' }}
          >
            <Text className="text-white font-bold text-base">Browse Vendors</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Group items by vendor
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.vendorId]) {
      acc[item.vendorId] = { vendorName: item.vendorName, items: [] };
    }
    acc[item.vendorId].items.push(item);
    return acc;
  }, {} as Record<string, { vendorName: string; items: typeof items }>);

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#F5EFE6' }}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pt-4 pb-3">
        <Text className="text-2xl font-bold text-gray-900">Cart</Text>
        <TouchableOpacity onPress={clearCart}>
          <Text className="text-sm font-medium" style={{ color: '#FF3B30' }}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {Object.entries(groupedItems).map(([vendorId, group]) => (
          <View key={vendorId} className="mb-4">
            <View className="flex-row items-center mb-2">
              <Ionicons name="storefront-outline" size={16} color="#FF7A30" />
              <Text className="text-sm font-semibold text-gray-700 ml-1.5">
                {group.vendorName}
              </Text>
            </View>
            {group.items.map((item) => (
              <View
                key={item.product.id}
                className="bg-white rounded-2xl mb-2 p-3 flex-row items-center"
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 6,
                  elevation: 2,
                }}
              >
                <Image
                  source={{ uri: item.product.image }}
                  style={{ width: 70, height: 70 }}
                  className="rounded-xl"
                  resizeMode="cover"
                />
                <View className="flex-1 ml-3">
                  <Text className="text-sm font-bold text-gray-900" numberOfLines={1}>
                    {item.product.name}
                  </Text>
                  <Text className="text-sm font-semibold mt-1" style={{ color: '#FF7A30' }}>
                    ₹{item.product.price}
                  </Text>
                  <View className="flex-row items-center mt-2">
                    <TouchableOpacity
                      onPress={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-7 h-7 rounded-full items-center justify-center bg-gray-100"
                    >
                      <Ionicons name="remove" size={16} color="#6B6B6B" />
                    </TouchableOpacity>
                    <Text className="text-sm font-bold text-gray-900 mx-3">
                      {item.quantity}
                    </Text>
                    <TouchableOpacity
                      onPress={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-full items-center justify-center"
                      style={{ backgroundColor: '#FF7A30' }}
                    >
                      <Ionicons name="add" size={16} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </View>
                <View className="items-end">
                  <TouchableOpacity onPress={() => removeFromCart(item.product.id)}>
                    <Ionicons name="trash-outline" size={18} color="#FF3B30" />
                  </TouchableOpacity>
                  <Text className="text-sm font-bold text-gray-900 mt-3">
                    ₹{item.product.price * item.quantity}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ))}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Checkout Bar */}
      <View
        className="absolute bottom-0 left-0 right-0 bg-white px-5 pt-4 pb-8 rounded-t-3xl"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 8,
        }}
      >
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-sm text-gray-500">Total ({items.length} items)</Text>
          <Text className="text-xl font-bold text-gray-900">₹{totalAmount.toLocaleString()}</Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('Checkout')}
          activeOpacity={0.85}
          className="py-4 rounded-xl items-center"
          style={{ backgroundColor: '#FF7A30' }}
        >
          <Text className="text-white text-base font-bold">Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
