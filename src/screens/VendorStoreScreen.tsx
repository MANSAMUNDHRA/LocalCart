import React from 'react';
import {
  View, Text, Image, ScrollView, TouchableOpacity, SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PRODUCTS } from '../data/mockData';
import { useCart } from '../context/CartContext';
import { useLocation } from '../context/LocationContext';
import ProductCard from '../components/ProductCard';
import { Vendor } from '../types';

export default function VendorStoreScreen({ route, navigation }: any) {
  const vendor: Vendor = route.params.vendor;
  const { addToCart } = useCart();
  const { calcDistance } = useLocation();

  const vendorProducts = PRODUCTS.filter((p) => p.vendorId === vendor.id);
  const distance = calcDistance(vendor.latitude, vendor.longitude);
  const distanceText = distance < 1 ? `${(distance * 1000).toFixed(0)}m` : `${distance.toFixed(1)} km`;

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#F5EFE6' }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View className="relative">
          <Image
            source={{ uri: vendor.shopImages[0] }}
            style={{ width: '100%', height: 220 }}
            resizeMode="cover"
          />
          <View
            className="absolute inset-0"
            style={{ backgroundColor: 'rgba(0,0,0,0.25)' }}
          />
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="absolute top-4 left-4"
            style={{
              backgroundColor: 'rgba(255,255,255,0.9)',
              borderRadius: 20,
              width: 40,
              height: 40,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="arrow-back" size={22} color="#1F1F1F" />
          </TouchableOpacity>
        </View>

        {/* Shop Info Card */}
        <View
          className="bg-white mx-5 -mt-8 rounded-2xl p-5"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 5,
          }}
        >
          <View className="flex-row items-start justify-between">
            <View className="flex-1 mr-3">
              <Text className="text-xl font-bold text-gray-900">{vendor.shopName}</Text>
              <Text className="text-sm text-gray-500 mt-1">{vendor.shopCategory}</Text>
            </View>
            <View className="flex-row items-center bg-amber-50 px-3 py-1.5 rounded-full">
              <Ionicons name="star" size={16} color="#F59E0B" />
              <Text className="text-sm font-bold ml-1 text-amber-700">{vendor.rating}</Text>
            </View>
          </View>

          <Text className="text-sm text-gray-600 mt-3 leading-5">{vendor.shopDescription}</Text>

          <View className="flex-row items-center mt-4 pt-4 border-t border-gray-100">
            <View className="flex-row items-center flex-1">
              <Ionicons name="location-outline" size={16} color="#FF7A30" />
              <Text className="text-xs text-gray-500 ml-1 flex-1" numberOfLines={1}>
                {vendor.shopAddress}
              </Text>
            </View>
            <View
              className="flex-row items-center px-3 py-1 rounded-full ml-2"
              style={{ backgroundColor: '#FFF3EC' }}
            >
              <Ionicons name="navigate" size={12} color="#FF7A30" />
              <Text className="text-xs font-semibold ml-1" style={{ color: '#FF7A30' }}>
                {distanceText}
              </Text>
            </View>
          </View>
        </View>

        {/* Products */}
        <View className="px-5 mt-6 pb-8">
          <Text className="text-base font-bold text-gray-900 mb-3">
            Products
            <Text className="text-sm font-normal text-gray-500"> ({vendorProducts.length})</Text>
          </Text>
          {vendorProducts.length === 0 ? (
            <View className="items-center py-10">
              <Ionicons name="cube-outline" size={48} color="#D1D5DB" />
              <Text className="text-base text-gray-400 mt-3">No products yet</Text>
            </View>
          ) : (
            vendorProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={() => addToCart(product, vendor.id, vendor.shopName)}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
