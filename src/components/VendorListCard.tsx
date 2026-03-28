import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Vendor } from '../types';
import { formatDistance } from '../lib/distance';

interface VendorListCardProps {
  vendor: Vendor;
  distance: number;
  onPress: () => void;
}

export default function VendorListCard({ vendor, distance, onPress }: VendorListCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      className="bg-white rounded-2xl overflow-hidden mb-3 flex-row"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      <Image
        source={{ uri: vendor.shopImages[0] }}
        style={{ width: 100, height: 100 }}
        resizeMode="cover"
      />
      {/* Profile avatar */}
      <View
        style={{
          position: 'absolute',
          top: 64,
          left: 64,
          width: 36,
          height: 36,
          borderRadius: 18,
          borderWidth: 2,
          borderColor: '#fff',
          overflow: 'hidden',
        }}
      >
        <Image
          source={{ uri: vendor.profilePhoto }}
          style={{ width: 36, height: 36 }}
          resizeMode="cover"
        />
      </View>

      <View className="flex-1 p-3 justify-between">
        <View>
          <Text className="text-sm font-bold text-gray-900" numberOfLines={1}>
            {vendor.shopName}
          </Text>
          <Text className="text-xs text-gray-500 mt-0.5" numberOfLines={1}>
            {vendor.shopCategory}
          </Text>
        </View>
        <View className="flex-row items-center mt-2">
          <Ionicons name="star" size={12} color="#F59E0B" />
          <Text className="text-xs font-semibold ml-0.5 text-amber-700 mr-3">
            {vendor.rating} ({vendor.totalReviews})
          </Text>
          <Ionicons name="location" size={12} color="#FF7A30" />
          <Text className="text-xs font-medium ml-0.5" style={{ color: '#FF7A30' }}>
            {formatDistance(distance)}
          </Text>
        </View>
      </View>
      <View className="justify-center pr-3">
        <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
      </View>
    </TouchableOpacity>
  );
}
