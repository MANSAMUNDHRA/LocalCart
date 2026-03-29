import React, { useState, useEffect } from 'react';
import {
  View, Text, Image, ScrollView, TouchableOpacity, SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import { useLocation } from '../context/LocationContext';
import { formatDistance } from '../lib/distance';
import { subscribeToVendorProducts } from '../lib/firebaseServices';
import ProductCard from '../components/ProductCard';
import { Vendor, Product } from '../types';

export default function VendorProfileScreen({ route, navigation }: any) {
  const vendor: Vendor = route.params.vendor;
  const { addToCart } = useCart();
  const { calcDistance } = useLocation();
  const [addedId, setAddedId] = useState<string | null>(null);
  const [vendorProducts, setVendorProducts] = useState<Product[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToVendorProducts(vendor.id, (incoming) => setVendorProducts(incoming));
    return unsubscribe;
  }, [vendor.id]);

  const distance = calcDistance(vendor.latitude, vendor.longitude);

  const handleAdd = (product: Product) => {
    addToCart(product, vendor.id, vendor.shopName);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1200);
  };

  const stars = Array.from({ length: 5 }, (_, i) => i + 1);

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#F5EFE6' }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={{ position: 'relative' }}>
          <Image
            source={{ uri: vendor.shopImages[0] }}
            style={{ width: '100%', height: 220 }}
            resizeMode="cover"
          />
          {/* gradient overlay */}
          <View
            style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: 80,
              backgroundColor: 'transparent',
            }}
          />
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              position: 'absolute', top: 16, left: 16,
              backgroundColor: 'rgba(255,255,255,0.92)',
              borderRadius: 20, width: 40, height: 40,
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Ionicons name="arrow-back" size={22} color="#1F1F1F" />
          </TouchableOpacity>

          {/* Cart button */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Cart')}
            style={{
              position: 'absolute', top: 16, right: 16,
              backgroundColor: 'rgba(255,255,255,0.92)',
              borderRadius: 20, width: 40, height: 40,
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Ionicons name="bag-outline" size={22} color="#1F1F1F" />
          </TouchableOpacity>
        </View>

        {/* Profile card */}
        <View
          className="bg-white mx-4 -mt-10 rounded-3xl p-5"
          style={{
            shadowColor: '#000', shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.1, shadowRadius: 16, elevation: 6,
          }}
        >
          <View className="flex-row items-start">
            {/* Circular avatar */}
            <View
              style={{
                width: 72, height: 72, borderRadius: 36,
                borderWidth: 3, borderColor: '#FF7A30', overflow: 'hidden',
                shadowColor: '#FF7A30', shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3, shadowRadius: 8, elevation: 5,
              }}
            >
              <Image
                source={{ uri: vendor.profilePhoto }}
                style={{ width: 72, height: 72 }}
                resizeMode="cover"
              />
            </View>

            <View className="flex-1 ml-4">
              <Text className="text-xl font-bold text-gray-900">{vendor.ownerName}</Text>
              <Text className="text-sm font-semibold" style={{ color: '#FF7A30' }}>
                {vendor.shopName}
              </Text>

              {/* Stars row */}
              <View className="flex-row items-center mt-1.5">
                {stars.map((s) => (
                  <Ionicons
                    key={s}
                    name={s <= Math.round(vendor.rating) ? 'star' : 'star-outline'}
                    size={14}
                    color="#F59E0B"
                  />
                ))}
                <Text className="text-xs font-bold text-amber-700 ml-1">
                  {vendor.rating}
                </Text>
                <Text className="text-xs text-gray-400 ml-1">
                  ({vendor.totalReviews} reviews)
                </Text>
              </View>
            </View>
          </View>

          {/* Info pills */}
          <View className="flex-row flex-wrap gap-2 mt-4">
            <View className="flex-row items-center bg-orange-50 px-3 py-1.5 rounded-full">
              <Ionicons name="pricetag" size={13} color="#FF7A30" />
              <Text className="text-xs font-semibold ml-1" style={{ color: '#FF7A30' }}>
                {vendor.shopCategory}
              </Text>
            </View>
            <View className="flex-row items-center bg-blue-50 px-3 py-1.5 rounded-full">
              <Ionicons name="navigate" size={13} color="#3B82F6" />
              <Text className="text-xs font-semibold ml-1 text-blue-600">
                {formatDistance(distance)} away
              </Text>
            </View>
            <View className="flex-row items-center bg-green-50 px-3 py-1.5 rounded-full">
              <Ionicons name="call" size={13} color="#10B981" />
              <Text className="text-xs font-semibold ml-1 text-green-700">
                {vendor.phone}
              </Text>
            </View>
          </View>

          {/* Description */}
          <Text className="text-sm text-gray-600 mt-4 leading-6">
            {vendor.shopDescription}
          </Text>

          {/* Address */}
          <View className="flex-row items-start mt-3 pt-3 border-t border-gray-100">
            <Ionicons name="location-outline" size={15} color="#9CA3AF" style={{ marginTop: 1 }} />
            <Text className="text-xs text-gray-500 ml-1.5 flex-1">{vendor.shopAddress}</Text>
          </View>
        </View>

        {/* Products section */}
        <View className="px-4 mt-5 pb-8">
          <Text className="text-base font-bold text-gray-900 mb-3">
            Products{' '}
            <Text className="font-normal text-gray-400">({vendorProducts.length})</Text>
          </Text>

          {vendorProducts.length === 0 ? (
            <View className="items-center py-10">
              <Ionicons name="cube-outline" size={48} color="#D1D5DB" />
              <Text className="text-sm text-gray-400 mt-2">No products available</Text>
            </View>
          ) : (
            vendorProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={() => handleAdd(product)}
                justAdded={addedId === product.id}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
