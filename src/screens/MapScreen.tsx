import React, { useMemo } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useLocation } from '../context/LocationContext';
import { VENDORS } from '../data/mockData';
import { formatDistance } from '../lib/distance';

export default function MapScreen({ navigation }: any) {
  const { location, radius, calcDistance, locationName } = useLocation();

  const nearbyVendors = useMemo(() => {
    return VENDORS.map((v) => ({ ...v, distance: calcDistance(v.latitude, v.longitude) }))
      .filter((v) => v.distance <= radius)
      .sort((a, b) => a.distance - b.distance);
  }, [radius, calcDistance]);

  const initialRegion = {
    latitude: location?.latitude ?? 12.9716,
    longitude: location?.longitude ?? 77.5946,
    latitudeDelta: Math.max(radius * 0.018, 0.04),
    longitudeDelta: Math.max(radius * 0.018, 0.04),
  };

  const CATEGORY_COLORS: Record<string, string> = {
    Pottery: '#D4A574', Cafes: '#8B6F47', Candles: '#FFD700',
    Stationery: '#87CEEB', Handmade: '#DDA0DD', Bakery: '#FFB6C1',
    Food: '#90EE90', Fruits: '#FF6B6B', 'Street Food': '#FFA07A',
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#F5EFE6' }}>
      {/* Header */}
      <View className="flex-row items-center px-5 pt-4 pb-3 bg-white"
        style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
          <Ionicons name="arrow-back" size={24} color="#1F1F1F" />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-900">Map View</Text>
          <Text className="text-xs text-gray-500">{nearbyVendors.length} vendors within {radius} km</Text>
        </View>
        <View className="flex-row items-center bg-orange-50 px-3 py-1.5 rounded-full">
          <Ionicons name="location" size={14} color="#FF7A30" />
          <Text className="text-xs font-semibold ml-1" style={{ color: '#FF7A30' }}>{locationName}</Text>
        </View>
      </View>

      <View style={{ flex: 1 }}>
        <MapView
          style={StyleSheet.absoluteFillObject}
          initialRegion={initialRegion}
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          showsUserLocation
          showsMyLocationButton
        >
          {nearbyVendors.map((vendor) => {
            const markerColor = CATEGORY_COLORS[vendor.shopCategory] || '#FF7A30';
            return (
              <Marker
                key={vendor.id}
                coordinate={{ latitude: vendor.latitude, longitude: vendor.longitude }}
              >
                {/* Custom marker */}
                <View style={{ alignItems: 'center' }}>
                  <View style={{
                    backgroundColor: markerColor,
                    paddingHorizontal: 8, paddingVertical: 4,
                    borderRadius: 12,
                    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25, shadowRadius: 4, elevation: 4,
                  }}>
                    <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>{vendor.shopCategory.slice(0, 1)}</Text>
                  </View>
                  <View style={{
                    width: 0, height: 0,
                    borderLeftWidth: 5, borderRightWidth: 5, borderTopWidth: 6,
                    borderLeftColor: 'transparent', borderRightColor: 'transparent',
                    borderTopColor: markerColor,
                  }} />
                </View>

                <Callout onPress={() => navigation.navigate('VendorProfile', { vendor })}>
                  <View style={{ width: 180, padding: 4 }}>
                    <Text style={{ fontSize: 13, fontWeight: '700', color: '#1F1F1F' }}>{vendor.shopName}</Text>
                    <Text style={{ fontSize: 11, color: '#6B6B6B', marginTop: 2 }}>
                      {vendor.shopCategory} · ⭐ {vendor.rating} ({vendor.totalReviews})
                    </Text>
                    <Text style={{ fontSize: 11, color: '#FF7A30', marginTop: 2, fontWeight: '600' }}>
                      📍 {formatDistance(vendor.distance!)} away
                    </Text>
                    <Text style={{ fontSize: 10, color: '#9CA3AF', marginTop: 3 }}>Tap to open shop →</Text>
                  </View>
                </Callout>
              </Marker>
            );
          })}
        </MapView>
      </View>
    </SafeAreaView>
  );
}
