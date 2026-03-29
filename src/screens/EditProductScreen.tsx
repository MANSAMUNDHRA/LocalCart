// src/screens/EditProductScreen.tsx
// Edits or deletes a product in Firestore. Optionally re-uploads image.

import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, SafeAreaView,
  TextInput, Alert, Image, Switch, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';
import { updateProduct, deleteProduct } from '../lib/firebaseServices';
import { Product, Vendor } from '../types';

export default function EditProductScreen({ route, navigation }: any) {
  const { user } = useAuth();
  const vendor = user as Vendor;
  const product: Product = route.params.product;

  const [name, setName]               = useState(product.name);
  const [price, setPrice]             = useState(product.price.toString());
  const [description, setDescription] = useState(product.description);
  const [category, setCategory]       = useState(product.category);
  const [inStock, setInStock]         = useState(product.inStock);
  const [newImageUri, setNewImageUri] = useState<string | null>(null);
  const [loading, setLoading]         = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled) setNewImageUri(result.assets[0].uri);
  };

  const handleSave = async () => {
    if (!name.trim() || !price.trim()) {
      Alert.alert('Error', 'Please fill in product name and price');
      return;
    }
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      Alert.alert('Error', 'Please enter a valid price');
      return;
    }
    setLoading(true);
    try {
      await updateProduct(
        product.id,
        vendor.id,
        {
          name: name.trim(),
          price: parsedPrice,
          description: description.trim(),
          category: category.trim(),
          inStock,
        },
        newImageUri
      );
      Alert.alert('✅ Updated!', 'Product updated successfully.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to update product.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Product',
      `Are you sure you want to delete "${product.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete', style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await deleteProduct(product.id);
              navigation.goBack();
            } catch (err: any) {
              Alert.alert('Error', err.message || 'Failed to delete product.');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const displayImage = newImageUri || product.image;

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#F5EFE6' }}>
      <View className="flex-row items-center justify-between px-5 pt-4 pb-3">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
            <Ionicons name="arrow-back" size={24} color="#1F1F1F" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-900">Edit Product</Text>
        </View>
        <TouchableOpacity onPress={handleDelete} disabled={loading}>
          <Ionicons name="trash-outline" size={22} color="#FF3B30" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {/* Current / New Image */}
        <View className="bg-white rounded-2xl overflow-hidden mb-4"
          style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}>
          <Image source={{ uri: displayImage }} style={{ width: '100%', height: 180 }} resizeMode="cover" />
          <TouchableOpacity
            onPress={pickImage}
            className="absolute bottom-3 right-3 bg-white px-3 py-1.5 rounded-full flex-row items-center"
            style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4, elevation: 3 }}
          >
            <Ionicons name="camera" size={16} color="#FF7A30" />
            <Text className="text-xs font-semibold ml-1" style={{ color: '#FF7A30' }}>
              {newImageUri ? 'Change' : 'Replace'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
        <View className="bg-white rounded-2xl p-4 mb-4"
          style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}>

          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-1.5">Product Name</Text>
            <TextInput value={name} onChangeText={setName}
              className="bg-gray-50 rounded-xl px-4 py-3 text-base text-gray-900"
              placeholderTextColor="#9CA3AF" />
          </View>

          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-1.5">Price (₹)</Text>
            <TextInput value={price} onChangeText={setPrice} keyboardType="numeric"
              className="bg-gray-50 rounded-xl px-4 py-3 text-base text-gray-900"
              placeholderTextColor="#9CA3AF" />
          </View>

          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-1.5">Category</Text>
            <TextInput value={category} onChangeText={setCategory}
              className="bg-gray-50 rounded-xl px-4 py-3 text-base text-gray-900"
              placeholderTextColor="#9CA3AF" />
          </View>

          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-1.5">Description</Text>
            <TextInput value={description} onChangeText={setDescription} multiline
              className="bg-gray-50 rounded-xl px-4 py-3 text-base text-gray-900"
              style={{ minHeight: 90 }} placeholderTextColor="#9CA3AF" textAlignVertical="top" />
          </View>

          <View className="flex-row items-center justify-between py-2">
            <View>
              <Text className="text-sm font-medium text-gray-700">In Stock</Text>
              <Text className="text-xs text-gray-400 mt-0.5">Toggle product availability</Text>
            </View>
            <Switch
              value={inStock} onValueChange={setInStock}
              trackColor={{ false: '#E5E7EB', true: '#FFD4B8' }}
              thumbColor={inStock ? '#FF7A30' : '#9CA3AF'}
            />
          </View>
        </View>

        {loading && (
          <View className="bg-orange-50 rounded-xl p-3 mb-4 flex-row items-center">
            <ActivityIndicator size="small" color="#FF7A30" />
            <Text className="text-sm text-orange-700 ml-3 font-medium">Saving changes…</Text>
          </View>
        )}

        <TouchableOpacity
          onPress={handleSave} activeOpacity={0.85} disabled={loading}
          className="py-4 rounded-xl items-center mb-8"
          style={{ backgroundColor: loading ? '#FFB088' : '#FF7A30' }}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text className="text-white text-base font-bold">Save Changes</Text>
          }
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
