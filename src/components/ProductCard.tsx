import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: () => void;
  justAdded?: boolean;
}

export default function ProductCard({ product, onAddToCart, justAdded }: ProductCardProps) {
  return (
    <View
      className="bg-white rounded-2xl overflow-hidden mb-3"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      <View className="flex-row">
        <Image
          source={{ uri: product.image }}
          style={{ width: 110, height: 110 }}
          resizeMode="cover"
        />
        <View className="flex-1 p-3 justify-between">
          <View>
            <Text className="text-sm font-bold text-gray-900" numberOfLines={1}>
              {product.name}
            </Text>
            <Text className="text-xs text-gray-500 mt-1" numberOfLines={2}>
              {product.description}
            </Text>
          </View>
          <View className="flex-row items-center justify-between mt-2">
            <Text className="text-base font-bold" style={{ color: '#FF7A30' }}>
              ₹{product.price}
            </Text>
            <TouchableOpacity
              onPress={onAddToCart}
              activeOpacity={0.8}
              className="flex-row items-center px-3 py-1.5 rounded-full"
              style={{
                backgroundColor: justAdded ? '#34C759' : '#FF7A30',
              }}
            >
              <Ionicons name={justAdded ? 'checkmark' : 'add'} size={16} color="#fff" />
              <Text className="text-white text-xs font-semibold ml-0.5">
                {justAdded ? 'Added' : 'Add'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
