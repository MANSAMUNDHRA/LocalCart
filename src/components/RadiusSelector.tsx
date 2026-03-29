import React from 'react';
import { View, Text, TouchableOpacity, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const RADIUS_OPTIONS = [
  { label: '1 km — Hyperlocal', value: 1 },
  { label: '3 km — Neighbourhood', value: 3 },
  { label: '5 km — Nearby', value: 5 },
  { label: '10 km — City wide', value: 10 },
  { label: '25 km — Metro area', value: 25 },
];


interface RadiusSelectorProps {
  visible: boolean;
  currentRadius: number;
  onSelect: (radius: number) => void;
  onClose: () => void;
}

export default function RadiusSelector({ visible, currentRadius, onSelect, onClose }: RadiusSelectorProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable
        className="flex-1 justify-end"
        style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
        onPress={onClose}
      >
        <Pressable
          className="bg-white rounded-t-3xl px-5 pt-6 pb-10"
          onPress={() => {}}
        >
          <View className="items-center mb-4">
            <View className="w-10 h-1 rounded-full bg-gray-300 mb-4" />
            <Text className="text-lg font-bold text-gray-900">Search Radius</Text>
            <Text className="text-sm text-gray-500 mt-1">
              Find vendors within your preferred distance
            </Text>
          </View>
          {RADIUS_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => {
                onSelect(option.value);
                onClose();
              }}
              activeOpacity={0.7}
              className="flex-row items-center justify-between py-4 px-4 rounded-xl mb-2"
              style={{
                backgroundColor: currentRadius === option.value ? '#FFF3EC' : '#F9FAFB',
                borderWidth: currentRadius === option.value ? 1.5 : 0,
                borderColor: '#FF7A30',
              }}
            >
              <View className="flex-row items-center">
                <View
                  className="w-10 h-10 rounded-full items-center justify-center mr-3"
                  style={{
                    backgroundColor: currentRadius === option.value ? '#FF7A30' : '#E5E7EB',
                  }}
                >
                  <Ionicons
                    name="navigate"
                    size={18}
                    color={currentRadius === option.value ? '#fff' : '#9CA3AF'}
                  />
                </View>
                <Text
                  className="text-base font-semibold"
                  style={{
                    color: currentRadius === option.value ? '#FF7A30' : '#1F1F1F',
                  }}
                >
                  {option.label}
                </Text>
              </View>
              {currentRadius === option.value && (
                <Ionicons name="checkmark-circle" size={24} color="#FF7A30" />
              )}
            </TouchableOpacity>
          ))}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
