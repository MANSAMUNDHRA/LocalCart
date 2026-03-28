import React, { useState } from 'react';
import {
  View, Text, Image, ScrollView, TouchableOpacity, SafeAreaView, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrdersContext';
import { PRODUCTS } from '../data/mockData';
import { Vendor, Product } from '../types';

export default function VendorDashboard({ navigation }: any) {
  const { user, logout } = useAuth();
  const { orders } = useOrders();
  const vendor = user as Vendor;

  const [products] = useState<Product[]>(PRODUCTS.filter((p) => p.vendorId === vendor.id));
  const vendorOrders = orders.filter((o) => o.vendorId === vendor.id || true); // demo shows all

  const revenue = vendorOrders
    .filter((o) => o.paymentStatus === 'paid')
    .reduce((s, o) => s + o.totalAmount, 0);

  const stats = [
    { label: 'Products',  value: products.length.toString(),             icon: 'cube'         as const, color: '#FF7A30' },
    { label: 'Orders',    value: vendorOrders.length.toString(),          icon: 'receipt'      as const, color: '#10B981' },
    { label: 'Rating',    value: vendor.rating.toFixed(1),               icon: 'star'         as const, color: '#F59E0B' },
    { label: 'Revenue',   value: `₹${(revenue / 1000).toFixed(1)}k`,     icon: 'trending-up'  as const, color: '#8B5CF6' },
  ];

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#F5EFE6' }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-5 pt-4 pb-3">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <View style={{ width: 46, height: 46, borderRadius: 23, overflow: 'hidden', borderWidth: 2, borderColor: '#FF7A30', marginRight: 12 }}>
                <Image source={{ uri: vendor.profilePhoto }} style={{ width: 46, height: 46 }} resizeMode="cover" />
              </View>
              <View className="flex-1">
                <Text className="text-xs text-gray-500">Welcome back 👋</Text>
                <Text className="text-base font-bold text-gray-900">{vendor.ownerName}</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() =>
                Alert.alert('Logout', 'Are you sure?', [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Logout', style: 'destructive', onPress: logout },
                ])
              }
              className="w-10 h-10 rounded-full items-center justify-center bg-white"
              style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 }}
            >
              <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
            </TouchableOpacity>
          </View>

          {/* Shop card */}
          <View className="bg-white rounded-2xl mt-4 overflow-hidden"
            style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4 }}>
            <Image source={{ uri: vendor.shopImages[0] }} style={{ width: '100%', height: 110 }} resizeMode="cover" />
            <View className="p-3">
              <Text className="text-base font-bold text-gray-900">{vendor.shopName}</Text>
              <View className="flex-row items-center mt-1">
                <Ionicons name="star" size={13} color="#F59E0B" />
                <Text className="text-xs font-semibold text-amber-700 ml-1">{vendor.rating}</Text>
                <Text className="text-xs text-gray-400 ml-1">({vendor.totalReviews} reviews)</Text>
                <View className="mx-2 w-1 h-1 rounded-full bg-gray-300" />
                <Text className="text-xs text-gray-500">{vendor.shopCategory}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View className="flex-row flex-wrap px-3 mt-1">
          {stats.map((s) => (
            <View key={s.label} className="w-1/2 p-2">
              <View className="bg-white rounded-2xl p-4"
                style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}>
                <View className="w-10 h-10 rounded-xl items-center justify-center" style={{ backgroundColor: `${s.color}18` }}>
                  <Ionicons name={s.icon} size={20} color={s.color} />
                </View>
                <Text className="text-2xl font-bold text-gray-900 mt-3">{s.value}</Text>
                <Text className="text-xs text-gray-400 mt-0.5">{s.label}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Quick actions */}
        <View className="px-5 mt-4">
          <Text className="text-sm font-bold text-gray-700 mb-3">Quick Actions</Text>
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={() => navigation.navigate('AddProduct')}
              activeOpacity={0.85}
              className="flex-1 py-3.5 rounded-xl items-center flex-row justify-center"
              style={{ backgroundColor: '#FF7A30' }}
            >
              <Ionicons name="add-circle" size={18} color="#fff" />
              <Text className="text-white font-bold text-sm ml-1.5">Add Product</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('Orders')}
              activeOpacity={0.85}
              className="flex-1 py-3.5 rounded-xl items-center flex-row justify-center bg-white border-2"
              style={{ borderColor: '#FF7A30' }}
            >
              <Ionicons name="list" size={18} color="#FF7A30" />
              <Text className="font-bold text-sm ml-1.5" style={{ color: '#FF7A30' }}>Orders</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Product list */}
        <View className="px-5 mt-5 pb-8">
          <Text className="text-sm font-bold text-gray-700 mb-3">
            Products <Text className="font-normal text-gray-400">({products.length})</Text>
          </Text>
          {products.length === 0 ? (
            <View className="items-center py-10 bg-white rounded-2xl">
              <Ionicons name="cube-outline" size={48} color="#D1D5DB" />
              <Text className="text-sm text-gray-400 mt-2">No products yet</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('AddProduct')}
                className="mt-3 px-6 py-2 rounded-lg"
                style={{ backgroundColor: '#FF7A30' }}
              >
                <Text className="text-white font-semibold text-sm">Add First Product</Text>
              </TouchableOpacity>
            </View>
          ) : (
            products.map((product) => (
              <TouchableOpacity
                key={product.id}
                onPress={() => navigation.navigate('EditProduct', { product })}
                activeOpacity={0.85}
                className="bg-white rounded-2xl mb-3 flex-row overflow-hidden"
                style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}
              >
                <Image source={{ uri: product.image }} style={{ width: 88, height: 88 }} resizeMode="cover" />
                <View className="flex-1 p-3 justify-between">
                  <View>
                    <Text className="text-sm font-bold text-gray-900" numberOfLines={1}>{product.name}</Text>
                    <Text className="text-xs text-gray-400 mt-0.5" numberOfLines={1}>{product.description}</Text>
                  </View>
                  <View className="flex-row items-center justify-between">
                    <Text className="text-sm font-bold" style={{ color: '#FF7A30' }}>₹{product.price}</Text>
                    <View className="flex-row items-center">
                      <View className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: product.inStock ? '#34C759' : '#FF3B30' }} />
                      <Text className="text-xs text-gray-400">{product.inStock ? 'In Stock' : 'Out'}</Text>
                    </View>
                  </View>
                </View>
                <View className="justify-center pr-3">
                  <Ionicons name="create-outline" size={18} color="#9CA3AF" />
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
