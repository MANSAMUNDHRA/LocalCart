// src/screens/AddProductScreen.tsx
// Uploads product image to Firebase Storage + writes product to Firestore.

import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, SafeAreaView,
  TextInput, Alert, Image, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';
import { addProduct } from '../lib/firebaseServices';
import { Vendor } from '../types';

export default function AddProductScreen({ navigation }: any) {
  const { user } = useAuth();
  const vendor = user as Vendor;

  const [name, setName]               = useState('');
  const [price, setPrice]             = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory]       = useState('');
  const [imageUri, setImageUri]       = useState<string | null>(null);
  const [loading, setLoading]         = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled) setImageUri(result.assets[0].uri);
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
      await addProduct(
        vendor.id,
        {
          name: name.trim(),
          price: parsedPrice,
          description: description.trim(),
          category: category.trim(),
          inStock: true,
        },
        imageUri
      );
      Alert.alert('✅ Product Added!', 'Your product is now live in your store.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err: any) {
      console.error('[AddProduct]', err);
      Alert.alert('Error', err.message || 'Failed to add product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#F5EFE6' }}>
      <View className="flex-row items-center px-5 pt-4 pb-3">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
          <Ionicons name="arrow-back" size={24} color="#1F1F1F" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900">Add Product</Text>
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {/* Image Upload */}
        <TouchableOpacity
          onPress={pickImage} activeOpacity={0.8}
          className="bg-white rounded-2xl overflow-hidden mb-4 items-center justify-center"
          style={{ height: 180, borderWidth: 2, borderColor: '#E5E7EB', borderStyle: 'dashed' }}
        >
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
          ) : (
            <View className="items-center">
              <View className="w-14 h-14 rounded-full items-center justify-center" style={{ backgroundColor: '#FFF3EC' }}>
                <Ionicons name="camera" size={28} color="#FF7A30" />
              </View>
              <Text className="text-sm font-medium text-gray-500 mt-2">Tap to add product image</Text>
              <Text className="text-xs text-gray-400 mt-0.5">PNG, JPG up to 5MB</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Form */}
        <View className="bg-white rounded-2xl p-4 mb-4"
          style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}>

          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-1.5">Product Name *</Text>
            <TextInput
              value={name} onChangeText={setName}
              placeholder="e.g., Handmade Clay Vase"
              className="bg-gray-50 rounded-xl px-4 py-3 text-base text-gray-900"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-1.5">Price (₹) *</Text>
            <TextInput
              value={price} onChangeText={setPrice}
              placeholder="0" keyboardType="numeric"
              className="bg-gray-50 rounded-xl px-4 py-3 text-base text-gray-900"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-1.5">Category</Text>
            <TextInput
              value={category} onChangeText={setCategory}
              placeholder="e.g., Pottery, Home Decor"
              className="bg-gray-50 rounded-xl px-4 py-3 text-base text-gray-900"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1.5">Description</Text>
            <TextInput
              value={description} onChangeText={setDescription}
              placeholder="Describe your product..."
              multiline
              className="bg-gray-50 rounded-xl px-4 py-3 text-base text-gray-900"
              style={{ minHeight: 90 }}
              placeholderTextColor="#9CA3AF" textAlignVertical="top"
            />
          </View>
        </View>

        {loading && (
          <View className="bg-orange-50 rounded-xl p-3 mb-4 flex-row items-center">
            <ActivityIndicator size="small" color="#FF7A30" />
            <Text className="text-sm text-orange-700 ml-3 font-medium">
              Uploading product…
            </Text>
          </View>
        )}

        <TouchableOpacity
          onPress={handleSave} activeOpacity={0.85} disabled={loading}
          className="py-4 rounded-xl items-center mb-8"
          style={{ backgroundColor: loading ? '#FFB088' : '#FF7A30' }}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text className="text-white text-base font-bold">Add Product</Text>
          }
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}