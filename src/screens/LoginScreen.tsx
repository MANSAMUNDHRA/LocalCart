import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, SafeAreaView, TextInput,
  KeyboardAvoidingView, Platform, ScrollView, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen({ navigation }: any) {
  const { switchRole } = useAuth();
  const [mode, setMode] = useState<'select' | 'buyer' | 'vendor'>('select');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing fields', 'Please enter email and password.');
      return;
    }
    switchRole(mode as 'buyer' | 'vendor');
  };

  if (mode === 'select') {
    return (
      <SafeAreaView className="flex-1" style={{ backgroundColor: '#F5EFE6' }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24 }}>
          {/* Logo */}
          <View className="items-center mb-10">
            <View
              className="w-24 h-24 rounded-3xl items-center justify-center mb-4"
              style={{
                backgroundColor: '#FF7A30',
                shadowColor: '#FF7A30', shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.35, shadowRadius: 16, elevation: 8,
              }}
            >
              <Ionicons name="storefront" size={44} color="#fff" />
            </View>
            <Text className="text-3xl font-bold text-gray-900">LocalMart</Text>
            <Text className="text-sm text-gray-500 mt-2 text-center">
              Discover local vendors{'\n'}right in your neighbourhood
            </Text>
          </View>

          {/* Role cards */}
          <Text className="text-xs font-semibold text-gray-400 uppercase tracking-widest text-center mb-4">
            Continue as
          </Text>

          {[
            {
              role: 'buyer' as const,
              title: 'Buyer',
              desc: 'Browse & buy from local vendors',
              icon: 'bag-handle' as const,
              bg: '#FFF3EC',
              iconColor: '#FF7A30',
            },
            {
              role: 'vendor' as const,
              title: 'Vendor',
              desc: 'Manage your shop & receive orders',
              icon: 'storefront' as const,
              bg: '#ECFDF5',
              iconColor: '#10B981',
            },
          ].map((item) => (
            <TouchableOpacity
              key={item.role}
              onPress={() => setMode(item.role)}
              activeOpacity={0.85}
              className="bg-white rounded-2xl p-5 mb-3 flex-row items-center"
              style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.07, shadowRadius: 12, elevation: 4 }}
            >
              <View className="w-14 h-14 rounded-2xl items-center justify-center mr-4" style={{ backgroundColor: item.bg }}>
                <Ionicons name={item.icon} size={26} color={item.iconColor} />
              </View>
              <View className="flex-1">
                <Text className="text-base font-bold text-gray-900">{item.title}</Text>
                <Text className="text-sm text-gray-400 mt-0.5">{item.desc}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
            </TouchableOpacity>
          ))}

          {/* Register as vendor */}
          <TouchableOpacity
            onPress={() => navigation.navigate('VendorRegistration')}
            activeOpacity={0.8}
            className="flex-row items-center justify-center mt-2 py-3"
          >
            <Ionicons name="add-circle-outline" size={18} color="#FF7A30" />
            <Text className="text-sm font-semibold ml-1.5" style={{ color: '#FF7A30' }}>
              Register New Vendor Shop
            </Text>
          </TouchableOpacity>

          {/* Quick demo */}
          <View className="flex-row items-center mt-5">
            <View className="flex-1 h-px bg-gray-200" />
            <Text className="text-xs text-gray-400 mx-3">Quick Demo</Text>
            <View className="flex-1 h-px bg-gray-200" />
          </View>
          <View className="flex-row mt-3 gap-3">
            <TouchableOpacity
              onPress={() => switchRole('buyer')}
              activeOpacity={0.8}
              className="flex-1 py-3 rounded-xl items-center"
              style={{ backgroundColor: '#FF7A30' }}
            >
              <Text className="text-white font-bold text-sm">Demo Buyer</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => switchRole('vendor')}
              activeOpacity={0.8}
              className="flex-1 py-3 rounded-xl items-center border-2"
              style={{ borderColor: '#FF7A30' }}
            >
              <Text className="font-bold text-sm" style={{ color: '#FF7A30' }}>Demo Vendor</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#F5EFE6' }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
          <TouchableOpacity onPress={() => setMode('select')} className="flex-row items-center mt-4 mb-6">
            <Ionicons name="arrow-back" size={24} color="#1F1F1F" />
            <Text className="text-base font-medium text-gray-900 ml-2">Back</Text>
          </TouchableOpacity>

          <Text className="text-2xl font-bold text-gray-900 mb-1">
            {mode === 'buyer' ? 'Buyer' : 'Vendor'} {isLogin ? 'Login' : 'Sign Up'}
          </Text>
          <Text className="text-sm text-gray-500 mb-6">
            {isLogin ? 'Welcome back! Sign in to continue.' : 'Create your account to get started.'}
          </Text>

          {!isLogin && (
            <View className="mb-3">
              <Text className="text-xs font-medium text-gray-600 mb-1">Full Name</Text>
              <TextInput value={name} onChangeText={setName} placeholder="John Doe"
                className="bg-white rounded-xl px-4 py-3 text-sm text-gray-900" placeholderTextColor="#9CA3AF" />
            </View>
          )}

          <View className="mb-3">
            <Text className="text-xs font-medium text-gray-600 mb-1">Email</Text>
            <TextInput value={email} onChangeText={setEmail} placeholder="you@email.com"
              keyboardType="email-address" autoCapitalize="none"
              className="bg-white rounded-xl px-4 py-3 text-sm text-gray-900" placeholderTextColor="#9CA3AF" />
          </View>

          <View className="mb-3">
            <Text className="text-xs font-medium text-gray-600 mb-1">Password</Text>
            <TextInput value={password} onChangeText={setPassword} placeholder="••••••••"
              secureTextEntry className="bg-white rounded-xl px-4 py-3 text-sm text-gray-900" placeholderTextColor="#9CA3AF" />
          </View>

          {!isLogin && (
            <>
              <View className="mb-3">
                <Text className="text-xs font-medium text-gray-600 mb-1">Phone</Text>
                <TextInput value={phone} onChangeText={setPhone} placeholder="9876543210"
                  keyboardType="phone-pad" className="bg-white rounded-xl px-4 py-3 text-sm text-gray-900" placeholderTextColor="#9CA3AF" />
              </View>
              {mode === 'buyer' && (
                <View className="mb-3">
                  <Text className="text-xs font-medium text-gray-600 mb-1">Delivery Address</Text>
                  <TextInput value={address} onChangeText={setAddress} placeholder="Your delivery address"
                    multiline className="bg-white rounded-xl px-4 py-3 text-sm text-gray-900"
                    style={{ minHeight: 60 }} placeholderTextColor="#9CA3AF" />
                </View>
              )}
            </>
          )}

          <TouchableOpacity
            onPress={handleSubmit}
            activeOpacity={0.85}
            className="py-4 rounded-xl items-center mt-2 mb-3"
            style={{ backgroundColor: '#FF7A30' }}
          >
            <Text className="text-white text-base font-bold">{isLogin ? 'Sign In' : 'Create Account'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsLogin(!isLogin)} className="items-center mb-8">
            <Text className="text-sm text-gray-500">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <Text style={{ color: '#FF7A30' }} className="font-semibold">
                {isLogin ? 'Register' : 'Sign In'}
              </Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
