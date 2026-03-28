import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, SafeAreaView,
  TextInput, Alert, Image, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import { getCurrentLocation } from '../lib/location';
import { CATEGORIES } from '../data/mockData';
import { Vendor } from '../types';

const CATEGORY_NAMES = [
  'Pottery', 'Cafes', 'Candles', 'Stationery',
  'Handmade', 'Bakery', 'Food', 'Fruits', 'Street Food',
];

export default function VendorRegistrationScreen({ navigation }: any) {
  const { loginAsVendor } = useAuth();
  const { setManualLocation } = useLocation();

  const [ownerName, setOwnerName] = useState('');
  const [shopName, setShopName] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [shopImages, setShopImages] = useState<string[]>([]);
  const [locating, setLocating] = useState(false);
  const [capturedCoords, setCapturedCoords] = useState<{ latitude: number; longitude: number } | null>(null);

  const pickImage = async (multi = false) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: !multi,
      aspect: [1, 1],
      quality: 0.8,
      allowsMultipleSelection: multi,
    });
    if (!result.canceled) {
      if (multi) {
        setShopImages(result.assets.map((a) => a.uri));
      } else {
        setProfilePhoto(result.assets[0].uri);
      }
    }
  };

  const captureLocation = async () => {
    setLocating(true);
    const coords = await getCurrentLocation();
    setLocating(false);
    if (coords) {
      setCapturedCoords(coords);
      Alert.alert('📍 Location captured', `Lat: ${coords.latitude.toFixed(5)}, Lng: ${coords.longitude.toFixed(5)}`);
    } else {
      // fallback
      const fallback = { latitude: 12.9716, longitude: 77.5946 };
      setCapturedCoords(fallback);
      Alert.alert('Location', 'Using approximate location — Bangalore centre.');
    }
  };

  const handleRegister = () => {
    if (!ownerName.trim() || !shopName.trim() || !phone.trim() || !category) {
      Alert.alert('Missing fields', 'Please fill in name, shop name, phone and category.');
      return;
    }

    const coords = capturedCoords || { latitude: 12.9716, longitude: 77.5946 };
    const newVendor: Vendor = {
      id: `v_${Date.now()}`,
      name: ownerName,
      email: '',
      phone,
      role: 'vendor',
      shopName,
      ownerName,
      shopCategory: category,
      shopDescription: description || `Welcome to ${shopName}!`,
      shopAddress: address || 'Address not provided',
      shopImages: shopImages.length > 0
        ? shopImages
        : ['https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400'],
      profilePhoto: profilePhoto || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
      rating: 5.0,
      totalReviews: 0,
      latitude: coords.latitude,
      longitude: coords.longitude,
    };

    loginAsVendor(newVendor);
    setManualLocation(coords, shopName);
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#F5EFE6' }}>
      {/* Header */}
      <View className="flex-row items-center px-5 pt-4 pb-3">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
          <Ionicons name="arrow-back" size={24} color="#1F1F1F" />
        </TouchableOpacity>
        <View>
          <Text className="text-xl font-bold text-gray-900">Become a Vendor</Text>
          <Text className="text-xs text-gray-500">Join LocalMart and start selling</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {/* Profile Photo */}
        <View className="items-center mb-5 mt-2">
          <TouchableOpacity onPress={() => pickImage(false)} activeOpacity={0.8}>
            <View
              style={{
                width: 90, height: 90, borderRadius: 45,
                backgroundColor: '#FFF3EC', borderWidth: 2,
                borderColor: '#FF7A30', borderStyle: 'dashed',
                alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
              }}
            >
              {profilePhoto ? (
                <Image source={{ uri: profilePhoto }} style={{ width: 90, height: 90 }} resizeMode="cover" />
              ) : (
                <View className="items-center">
                  <Ionicons name="camera" size={28} color="#FF7A30" />
                  <Text className="text-xs text-gray-400 mt-1">Profile Photo</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* Form card */}
        <View
          className="bg-white rounded-2xl p-4 mb-4"
          style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}
        >
          <Text className="text-sm font-bold text-gray-700 mb-3">Personal Info</Text>

          {[
            { label: 'Owner Name *', value: ownerName, set: setOwnerName, placeholder: 'Your full name' },
            { label: 'Phone Number *', value: phone, set: setPhone, placeholder: '9876543210', keyboard: 'phone-pad' as const },
          ].map((f) => (
            <View key={f.label} className="mb-3">
              <Text className="text-xs font-medium text-gray-500 mb-1">{f.label}</Text>
              <TextInput
                value={f.value}
                onChangeText={f.set}
                placeholder={f.placeholder}
                keyboardType={f.keyboard}
                placeholderTextColor="#9CA3AF"
                className="bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-900"
              />
            </View>
          ))}
        </View>

        <View
          className="bg-white rounded-2xl p-4 mb-4"
          style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}
        >
          <Text className="text-sm font-bold text-gray-700 mb-3">Shop Info</Text>

          <View className="mb-3">
            <Text className="text-xs font-medium text-gray-500 mb-1">Shop Name *</Text>
            <TextInput
              value={shopName}
              onChangeText={setShopName}
              placeholder="e.g., Meera Candle Corner"
              placeholderTextColor="#9CA3AF"
              className="bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-900"
            />
          </View>

          {/* Category selector */}
          <View className="mb-3">
            <Text className="text-xs font-medium text-gray-500 mb-2">Category *</Text>
            <View className="flex-row flex-wrap gap-2">
              {CATEGORY_NAMES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setCategory(cat)}
                  className="px-3 py-1.5 rounded-full"
                  style={{
                    backgroundColor: category === cat ? '#FF7A30' : '#F3F4F6',
                  }}
                >
                  <Text
                    className="text-xs font-semibold"
                    style={{ color: category === cat ? '#fff' : '#6B6B6B' }}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View className="mb-3">
            <Text className="text-xs font-medium text-gray-500 mb-1">Description</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Tell buyers what makes your shop special..."
              placeholderTextColor="#9CA3AF"
              multiline
              className="bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-900"
              style={{ minHeight: 80 }}
              textAlignVertical="top"
            />
          </View>

          <View className="mb-3">
            <Text className="text-xs font-medium text-gray-500 mb-1">Shop Address</Text>
            <TextInput
              value={address}
              onChangeText={setAddress}
              placeholder="Street, Area, City"
              placeholderTextColor="#9CA3AF"
              className="bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-900"
            />
          </View>
        </View>

        {/* GPS Location Capture */}
        <TouchableOpacity
          onPress={captureLocation}
          activeOpacity={0.85}
          className="bg-white rounded-2xl p-4 mb-4 flex-row items-center"
          style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}
        >
          <View
            className="w-10 h-10 rounded-full items-center justify-center mr-3"
            style={{ backgroundColor: capturedCoords ? '#ECFDF5' : '#FFF3EC' }}
          >
            <Ionicons
              name={capturedCoords ? 'checkmark-circle' : 'location'}
              size={20}
              color={capturedCoords ? '#10B981' : '#FF7A30'}
            />
          </View>
          <View className="flex-1">
            <Text className="text-sm font-semibold text-gray-900">
              {capturedCoords ? 'Location Captured ✓' : 'Capture Shop Location *'}
            </Text>
            <Text className="text-xs text-gray-400 mt-0.5">
              {capturedCoords
                ? `${capturedCoords.latitude.toFixed(4)}, ${capturedCoords.longitude.toFixed(4)}`
                : locating ? 'Detecting GPS...' : 'Tap to use your current GPS location'}
            </Text>
          </View>
          <Ionicons name="navigate-outline" size={20} color="#FF7A30" />
        </TouchableOpacity>

        {/* Shop Images */}
        <View
          className="bg-white rounded-2xl p-4 mb-4"
          style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}
        >
          <Text className="text-sm font-bold text-gray-700 mb-2">Shop Images</Text>
          <TouchableOpacity
            onPress={() => pickImage(true)}
            activeOpacity={0.8}
            className="rounded-xl items-center justify-center py-4"
            style={{ backgroundColor: '#F9FAFB', borderWidth: 1.5, borderColor: '#E5E7EB', borderStyle: 'dashed' }}
          >
            <Ionicons name="images-outline" size={28} color="#9CA3AF" />
            <Text className="text-xs text-gray-400 mt-1">
              {shopImages.length > 0 ? `${shopImages.length} image(s) selected` : 'Tap to select shop photos'}
            </Text>
          </TouchableOpacity>
          {shopImages.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-3 -mx-1">
              {shopImages.map((uri, i) => (
                <Image key={i} source={{ uri }} style={{ width: 80, height: 80, borderRadius: 12, marginHorizontal: 4 }} resizeMode="cover" />
              ))}
            </ScrollView>
          )}
        </View>

        {/* Register button */}
        <TouchableOpacity
          onPress={handleRegister}
          activeOpacity={0.85}
          className="py-4 rounded-xl items-center mb-10"
          style={{ backgroundColor: '#FF7A30' }}
        >
          <Text className="text-white text-base font-bold">Register & Open Shop</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
