import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, SafeAreaView,
  TextInput, Alert, Image, Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '../types';

export default function EditProductScreen({ route, navigation }: any) {
  const product: Product = route.params.product;

  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price.toString());
  const [description, setDescription] = useState(product.description);
  const [category, setCategory] = useState(product.category);
  const [inStock, setInStock] = useState(product.inStock);

  const handleSave = () => {
    if (!name.trim() || !price.trim()) {
      Alert.alert('Error', 'Please fill in product name and price');
      return;
    }
    Alert.alert('Success', 'Product updated successfully!', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Product',
      `Are you sure you want to delete "${product.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Deleted', 'Product has been deleted.', [
              { text: 'OK', onPress: () => navigation.goBack() },
            ]);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#F5EFE6' }}>
      <View className="flex-row items-center justify-between px-5 pt-4 pb-3">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
            <Ionicons name="arrow-back" size={24} color="#1F1F1F" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-900">Edit Product</Text>
        </View>
        <TouchableOpacity onPress={handleDelete}>
          <Ionicons name="trash-outline" size={22} color="#FF3B30" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {/* Current Image */}
        <View className="bg-white rounded-2xl overflow-hidden mb-4" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}>
          <Image
            source={{ uri: product.image }}
            style={{ width: '100%', height: 180 }}
            resizeMode="cover"
          />
          <TouchableOpacity className="absolute bottom-3 right-3 bg-white px-3 py-1.5 rounded-full flex-row items-center" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4, elevation: 3 }}>
            <Ionicons name="camera" size={16} color="#FF7A30" />
            <Text className="text-xs font-semibold ml-1" style={{ color: '#FF7A30' }}>Change</Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
        <View className="bg-white rounded-2xl p-4 mb-4" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}>
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-1.5">Product Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              className="bg-gray-50 rounded-xl px-4 py-3 text-base text-gray-900"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-1.5">Price (₹)</Text>
            <TextInput
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
              className="bg-gray-50 rounded-xl px-4 py-3 text-base text-gray-900"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-1.5">Category</Text>
            <TextInput
              value={category}
              onChangeText={setCategory}
              className="bg-gray-50 rounded-xl px-4 py-3 text-base text-gray-900"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-1.5">Description</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              multiline
              className="bg-gray-50 rounded-xl px-4 py-3 text-base text-gray-900"
              style={{ minHeight: 90 }}
              placeholderTextColor="#9CA3AF"
              textAlignVertical="top"
            />
          </View>

          {/* In Stock Toggle */}
          <View className="flex-row items-center justify-between py-2">
            <View>
              <Text className="text-sm font-medium text-gray-700">In Stock</Text>
              <Text className="text-xs text-gray-400 mt-0.5">Toggle product availability</Text>
            </View>
            <Switch
              value={inStock}
              onValueChange={setInStock}
              trackColor={{ false: '#E5E7EB', true: '#FFD4B8' }}
              thumbColor={inStock ? '#FF7A30' : '#9CA3AF'}
            />
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          onPress={handleSave}
          activeOpacity={0.85}
          className="py-4 rounded-xl items-center mb-8"
          style={{ backgroundColor: '#FF7A30' }}
        >
          <Text className="text-white text-base font-bold">Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
