import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Vendor } from '../types';
import { formatDistance } from '../lib/distance';

interface VendorCardProps {
  vendor: Vendor;
  distance: number;
  onPress: () => void;
}

export default function VendorCard({ vendor, distance, onPress }: VendorCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      className="bg-white rounded-2xl mr-4 overflow-hidden"
      style={{
        width: 210,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
      }}
    >
      {/* Shop image */}
      <Image
        source={{ uri: vendor.shopImages[0] }}
        style={{ width: '100%', height: 120 }}
        resizeMode="cover"
      />

      {/* Profile avatar overlapping the image */}
      <View
        className="absolute"
        style={{
          top: 100,
          left: 12,
          width: 42,
          height: 42,
          borderRadius: 21,
          borderWidth: 2.5,
          borderColor: '#fff',
          overflow: 'hidden',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
          elevation: 4,
        }}
      >
        <Image
          source={{ uri: vendor.profilePhoto }}
          style={{ width: 42, height: 42 }}
          resizeMode="cover"
        />
      </View>

      <View className="px-3 pt-7 pb-3">
        <Text className="text-sm font-bold text-gray-900" numberOfLines={1}>
          {vendor.shopName}
        </Text>
        <Text className="text-xs text-gray-400 mt-0.5" numberOfLines={1}>
          {vendor.shopCategory}
        </Text>
        <View className="flex-row items-center justify-between mt-2">
          <View className="flex-row items-center">
            <Ionicons name="star" size={12} color="#F59E0B" />
            <Text className="text-xs font-semibold ml-0.5 text-amber-700">
              {vendor.rating}
            </Text>
            <Text className="text-xs text-gray-400 ml-1">({vendor.totalReviews})</Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="location" size={12} color="#FF7A30" />
            <Text className="text-xs font-medium ml-0.5" style={{ color: '#FF7A30' }}>
              {formatDistance(distance)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
