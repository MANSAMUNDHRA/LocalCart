// src/screens/HomeScreen.tsx
// Reads vendor list from Firestore via realtime listener instead of mockData.

import React, { useState, useMemo, useEffect } from 'react';
import {
  View, Text, ScrollView, TextInput, FlatList,
  TouchableOpacity, SafeAreaView, StatusBar, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocation } from '../context/LocationContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { subscribeToVendors } from '../lib/firebaseServices';
import { CATEGORIES } from '../data/categories';
import { Vendor } from '../types';
import VendorCard from '../components/VendorCard';
import VendorListCard from '../components/VendorListCard';
import CategoryCard from '../components/CategoryCard';
import RadiusSelector from '../components/RadiusSelector';

export default function HomeScreen({ navigation }: any) {
  const { locationName, radius, setRadius, calcDistance } = useLocation();
  const { totalItems } = useCart();
  const { user } = useAuth();

  const [vendors, setVendors]               = useState<Vendor[]>([]);
  const [vendorsLoading, setVendorsLoading] = useState(true);
  const [searchQuery, setSearchQuery]       = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showRadius, setShowRadius]         = useState(false);

  // ── Realtime vendor listener ──────────────────────────────────────────────
  useEffect(() => {
    const unsubscribe = subscribeToVendors((incoming) => {
      setVendors(incoming);
      setVendorsLoading(false);
    });
    return unsubscribe;
  }, []);

  const vendorsWithDistance = useMemo(() => {
    const all = vendors.map((v) => ({ ...v, distance: calcDistance(v.latitude, v.longitude) }));
    const inRadius = all.filter((v) => v.distance <= radius).sort((a, b) => a.distance - b.distance);
    return inRadius.length > 0 ? inRadius : all.sort((a, b) => a.distance - b.distance);
  }, [vendors, radius, calcDistance]);

  const filteredVendors = useMemo(() => {
    let result = vendorsWithDistance;
    if (selectedCategory) result = result.filter((v) => v.shopCategory === selectedCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (v) => v.shopName.toLowerCase().includes(q) || v.shopCategory.toLowerCase().includes(q)
      );
    }
    return result;
  }, [vendorsWithDistance, selectedCategory, searchQuery]);

  const featured = vendorsWithDistance.slice(0, 6);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const goToVendor = (vendor: any) => navigation.navigate('VendorProfile', { vendor });

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#F5EFE6' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5EFE6" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-5 pt-4 pb-2">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-sm text-gray-500">{greeting()} 👋</Text>
              <Text className="text-xl font-bold text-gray-900 mt-0.5">
                {user?.name || 'Welcome'}
              </Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Cart')} className="relative">
              <View className="w-11 h-11 rounded-full items-center justify-center bg-white"
                style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 }}>
                <Ionicons name="bag-outline" size={22} color="#1F1F1F" />
              </View>
              {totalItems > 0 && (
                <View className="absolute -top-1 -right-1 w-5 h-5 rounded-full items-center justify-center" style={{ backgroundColor: '#FF7A30' }}>
                  <Text className="text-white text-xs font-bold">{totalItems}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Location + radius */}
          <TouchableOpacity
            onPress={() => setShowRadius(true)}
            className="flex-row items-center mt-3 bg-white px-4 py-2.5 rounded-xl"
            activeOpacity={0.8}
            style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 }}
          >
            <Ionicons name="location" size={18} color="#FF7A30" />
            <Text className="text-sm font-medium text-gray-900 ml-2 flex-1" numberOfLines={1}>{locationName}</Text>
            <View className="flex-row items-center bg-orange-50 px-2.5 py-1 rounded-full">
              <Ionicons name="navigate-outline" size={12} color="#FF7A30" />
              <Text className="text-xs font-semibold ml-1" style={{ color: '#FF7A30' }}>{radius} km</Text>
            </View>
          </TouchableOpacity>

          {/* Search */}
          <View className="flex-row items-center bg-white rounded-xl mt-3 px-4"
            style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 }}>
            <Ionicons name="search-outline" size={20} color="#9CA3AF" />
            <TextInput
              value={searchQuery} onChangeText={setSearchQuery}
              placeholder="Search vendors, categories..."
              placeholderTextColor="#9CA3AF"
              className="flex-1 py-3 ml-2 text-base text-gray-900"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color="#D1D5DB" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Promo Banner */}
        <View className="mx-5 mt-4 rounded-2xl overflow-hidden" style={{ backgroundColor: '#FF7A30' }}>
          <View className="px-5 py-4 flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-white text-xs font-semibold opacity-80">LIMITED TIME OFFER</Text>
              <Text className="text-white text-lg font-bold mt-0.5">First order 20% off 🎉</Text>
              <Text className="text-white text-xs opacity-70 mt-1">Use code: LOCALMART20</Text>
            </View>
            <Text style={{ fontSize: 48 }}>🛍️</Text>
          </View>
        </View>

        {/* Categories */}
        <View className="mt-5">
          <Text className="text-base font-bold text-gray-900 px-5 mb-3">Shop by Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
            <TouchableOpacity onPress={() => setSelectedCategory(null)} className="items-center mr-3">
              <View className="w-16 h-16 rounded-2xl items-center justify-center mb-1.5"
                style={{ backgroundColor: !selectedCategory ? '#FF7A30' : '#F3F4F6', elevation: !selectedCategory ? 4 : 0 }}>
                <Ionicons name="grid" size={24} color={!selectedCategory ? '#fff' : '#6B6B6B'} />
              </View>
              <Text className="text-xs font-medium" style={{ color: !selectedCategory ? '#FF7A30' : '#6B6B6B' }}>All</Text>
            </TouchableOpacity>
            {CATEGORIES.map((cat) => (
              <CategoryCard
                key={cat.id} category={cat}
                isSelected={selectedCategory === cat.name}
                onPress={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Loading state */}
        {vendorsLoading ? (
          <View style={{ alignItems: 'center', paddingVertical: 40 }}>
            <ActivityIndicator size="large" color="#FF7A30" />
            <Text style={{ color: '#9CA3AF', marginTop: 10, fontSize: 13 }}>Loading nearby vendors…</Text>
          </View>
        ) : (
          <>
            {/* Featured nearby */}
            {!searchQuery && !selectedCategory && featured.length > 0 && (
              <View className="mt-6">
                <View className="flex-row items-center justify-between px-5 mb-3">
                  <Text className="text-base font-bold text-gray-900">⭐ Top Rated Near You</Text>
                  <TouchableOpacity onPress={() => navigation.navigate('Map')}>
                    <Text className="text-sm font-semibold" style={{ color: '#FF7A30' }}>View Map</Text>
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={featured} horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 20 }}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <VendorCard vendor={item} distance={item.distance!} onPress={() => goToVendor(item)} />
                  )}
                />
              </View>
            )}

            {/* All vendors list */}
            <View className="mt-6 px-5 pb-6">
              <Text className="text-base font-bold text-gray-900 mb-3">
                {selectedCategory ? `${selectedCategory} Vendors` : '🏪 All Vendors'}
                <Text className="text-sm font-normal text-gray-500"> ({filteredVendors.length})</Text>
              </Text>
              {filteredVendors.length === 0 ? (
                <View className="items-center py-10">
                  <Ionicons name="search-outline" size={48} color="#D1D5DB" />
                  <Text className="text-sm text-gray-400 mt-3">No vendors found</Text>
                  <Text className="text-xs text-gray-400 mt-1">Try adjusting the radius or search term</Text>
                </View>
              ) : (
                filteredVendors.map((vendor) => (
                  <VendorListCard
                    key={vendor.id} vendor={vendor}
                    distance={vendor.distance!} onPress={() => goToVendor(vendor)}
                  />
                ))
              )}
            </View>
          </>
        )}
      </ScrollView>

      <RadiusSelector
        visible={showRadius} currentRadius={radius}
        onSelect={setRadius} onClose={() => setShowRadius(false)}
      />
    </SafeAreaView>
  );
}