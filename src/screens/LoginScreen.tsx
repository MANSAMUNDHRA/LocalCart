// src/screens/LoginScreen.tsx
// Real Firebase Auth login/signup — no more demo buttons or mock logic.

import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, SafeAreaView, TextInput,
  KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

type Mode = 'select' | 'buyer' | 'vendor';

export default function LoginScreen({ navigation }: any) {
  const { login, signUp } = useAuth();

  const [mode, setMode] = useState<Mode>('select');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  // Form fields
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [name, setName]         = useState('');
  const [phone, setPhone]       = useState('');
  const [address, setAddress]   = useState('');

  const resetForm = () => {
    setEmail(''); setPassword(''); setName(''); setPhone(''); setAddress('');
  };

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing fields', 'Please enter email and password.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Weak password', 'Password must be at least 6 characters.');
      return;
    }
    if (!isLogin && !name.trim()) {
      Alert.alert('Missing fields', 'Please enter your name.');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await login(email.trim(), password);
        // onAuthStateChanged in AuthContext handles navigation automatically
      } else {
        if (mode === 'vendor') {
          // Vendor registration happens on a dedicated screen
          // We pass email + password so the registration screen can create the account
          navigation.navigate('VendorRegistration', {
            email: email.trim(),
            password,
            ownerName: name.trim(),
            phone: phone.trim(),
          });
          setLoading(false);
          return;
        }
        // Buyer sign-up
        await signUp({
          email: email.trim(),
          password,
          name: name.trim(),
          phone: phone.trim(),
          role: 'buyer',
          deliveryAddress: address.trim(),
        });
      }
    } catch (err: any) {
      const msg =
        err.code === 'auth/user-not-found'       ? 'No account with this email.' :
        err.code === 'auth/wrong-password'        ? 'Incorrect password.' :
        err.code === 'auth/invalid-email'         ? 'Invalid email address.' :
        err.code === 'auth/email-already-in-use'  ? 'Email already in use.' :
        err.code === 'auth/invalid-credential'    ? 'Invalid email or password.' :
        'Something went wrong. Please try again.';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  // ── Role Selection Screen ────────────────────────────────────────────────
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
              onPress={() => { resetForm(); setMode(item.role); setIsLogin(true); }}
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

          {/* Vendor Registration shortcut */}
          <TouchableOpacity
            onPress={() => navigation.navigate('VendorRegistration', {})}
            activeOpacity={0.8}
            className="flex-row items-center justify-center mt-2 py-3"
          >
            <Ionicons name="add-circle-outline" size={18} color="#FF7A30" />
            <Text className="text-sm font-semibold ml-1.5" style={{ color: '#FF7A30' }}>
              Register New Vendor Shop
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── Login / Sign-Up Form ─────────────────────────────────────────────────
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

          {/* Name — signup only */}
          {!isLogin && (
            <View className="mb-3">
              <Text className="text-xs font-medium text-gray-600 mb-1">Full Name</Text>
              <TextInput
                value={name} onChangeText={setName} placeholder="John Doe"
                className="bg-white rounded-xl px-4 py-3 text-sm text-gray-900"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          )}

          <View className="mb-3">
            <Text className="text-xs font-medium text-gray-600 mb-1">Email</Text>
            <TextInput
              value={email} onChangeText={setEmail} placeholder="you@email.com"
              keyboardType="email-address" autoCapitalize="none"
              className="bg-white rounded-xl px-4 py-3 text-sm text-gray-900"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View className="mb-3">
            <Text className="text-xs font-medium text-gray-600 mb-1">Password</Text>
            <TextInput
              value={password} onChangeText={setPassword} placeholder="Min. 6 characters"
              secureTextEntry
              className="bg-white rounded-xl px-4 py-3 text-sm text-gray-900"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Extra fields for buyer sign-up */}
          {!isLogin && mode === 'buyer' && (
            <>
              <View className="mb-3">
                <Text className="text-xs font-medium text-gray-600 mb-1">Phone</Text>
                <TextInput
                  value={phone} onChangeText={setPhone} placeholder="9876543210"
                  keyboardType="phone-pad"
                  className="bg-white rounded-xl px-4 py-3 text-sm text-gray-900"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              <View className="mb-3">
                <Text className="text-xs font-medium text-gray-600 mb-1">Delivery Address</Text>
                <TextInput
                  value={address} onChangeText={setAddress} placeholder="Your delivery address"
                  multiline
                  className="bg-white rounded-xl px-4 py-3 text-sm text-gray-900"
                  style={{ minHeight: 60 }} placeholderTextColor="#9CA3AF"
                />
              </View>
            </>
          )}

          {/* Vendor sign-up note */}
          {!isLogin && mode === 'vendor' && (
            <View className="bg-orange-50 rounded-xl p-3 mb-3 flex-row items-start">
              <Ionicons name="information-circle-outline" size={18} color="#FF7A30" />
              <Text className="text-xs text-gray-600 ml-2 flex-1">
                After entering your email & password, you'll complete your shop profile on the next screen.
              </Text>
            </View>
          )}

          <TouchableOpacity
            onPress={handleSubmit}
            activeOpacity={0.85}
            disabled={loading}
            className="py-4 rounded-xl items-center mt-2 mb-3 flex-row justify-center"
            style={{ backgroundColor: loading ? '#FFB088' : '#FF7A30' }}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text className="text-white text-base font-bold">
                  {isLogin ? 'Sign In' : (mode === 'vendor' ? 'Next →' : 'Create Account')}
                </Text>
            }
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
