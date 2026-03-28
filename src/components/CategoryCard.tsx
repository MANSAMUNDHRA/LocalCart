import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Category } from '../types';

interface CategoryCardProps {
  category: Category;
  isSelected: boolean;
  onPress: () => void;
}

export default function CategoryCard({ category, isSelected, onPress }: CategoryCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="items-center mr-3"
    >
      <View
        className="w-16 h-16 rounded-2xl items-center justify-center mb-1.5"
        style={{
          backgroundColor: isSelected ? '#FF7A30' : `${category.color}20`,
          shadowColor: isSelected ? '#FF7A30' : 'transparent',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: isSelected ? 0.3 : 0,
          shadowRadius: 8,
          elevation: isSelected ? 4 : 0,
        }}
      >
        <Text style={{ fontSize: 26 }}>{category.icon}</Text>
      </View>
      <Text
        className="text-xs font-medium"
        style={{ color: isSelected ? '#FF7A30' : '#6B6B6B' }}
      >
        {category.name}
      </Text>
    </TouchableOpacity>
  );
}
