// src/screens/CheckoutScreen.tsx
// Writes orders to Firestore. Razorpay integration preserved.

import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, SafeAreaView,
  TextInput, Alert, Platform, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrdersContext';
import { Buyer } from '../types';

// Razorpay — safe import with fallback for simulators that can't link native module
let RazorpayCheckout: any = null;
try {
  RazorpayCheckout = require('react-native-razorpay').default;
} catch {
  RazorpayCheckout = null;
}

const RAZORPAY_KEY = 'rzp_test_XXXXXXXXXXXXXX'; // Replace with your Razorpay Test Key

export default function CheckoutScreen({ navigation }: any) {
  const { items, totalAmount, clearCart } = useCart();
  const { user, firebaseUid } = useAuth();
  const { placeOrder } = useOrders();
  const buyer = user as Buyer;

  const [address, setAddress]         = useState(buyer?.deliveryAddress || '');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'cod'>('upi');
  const [isProcessing, setIsProcessing]   = useState(false);

  const deliveryFee = totalAmount > 500 ? 0 : 40;
  const grandTotal  = totalAmount + deliveryFee;

  const onSuccess = async (paymentId?: string) => {
    try {
      await placeOrder({
        buyerId:   firebaseUid || buyer?.id || 'unknown',
        buyerName: buyer?.name || 'Guest',
        vendorId:  items[0]?.vendorId || '',
        vendorName: items[0]?.vendorName || '',
        items,
        totalAmount: grandTotal,
        deliveryAddress: address,
        paymentStatus: paymentId ? 'paid' : (paymentMethod === 'cod' ? 'pending' : 'paid'),
        razorpayPaymentId: paymentId,
      });

      clearCart();
      setIsProcessing(false);

      Alert.alert(
        '🎉 Order Placed!',
        'Your order has been placed. Vendors will start preparing shortly.',
        [{ text: 'OK', onPress: () => navigation.navigate('HomeTab') }]
      );
    } catch (err: any) {
      setIsProcessing(false);
      Alert.alert('Error', err.message || 'Failed to place order. Please try again.');
    }
  };

  const handleRazorpay = () => {
    if (!address.trim()) {
      Alert.alert('Error', 'Please enter a delivery address');
      return;
    }
    setIsProcessing(true);

    if (!RazorpayCheckout || Platform.OS === 'web') {
      // Fallback for simulator / web / missing native module
      setTimeout(() => onSuccess('sim_' + Date.now()), 1500);
      return;
    }

    const options = {
      description: 'LocalMart Order',
      image: 'https://i.imgur.com/3g7nmJC.png',
      currency: 'INR',
      key: RAZORPAY_KEY,
      amount: grandTotal * 100,
      name: 'LocalMart',
      prefill: {
        email: buyer?.email || 'buyer@localmart.com',
        contact: buyer?.phone || '9999999999',
        name: buyer?.name || 'Buyer',
      },
      theme: { color: '#FF7A30' },
    };

    RazorpayCheckout.open(options)
      .then((data: any) => onSuccess(data.razorpay_payment_id))
      .catch((err: any) => {
        setIsProcessing(false);
        if (err.code !== 0) {
          Alert.alert('Payment Failed', err.description || 'Please try again.');
        }
      });
  };

  const handleCOD = () => {
    if (!address.trim()) {
      Alert.alert('Error', 'Please enter a delivery address');
      return;
    }
    setIsProcessing(true);
    onSuccess(); // no payment ID for COD
  };

  const paymentMethods = [
    { id: 'upi' as const,  label: 'UPI / Online',      icon: 'phone-portrait-outline' as const, desc: 'Razorpay — Google Pay, PhonePe, Cards' },
    { id: 'cod' as const,  label: 'Cash on Delivery',  icon: 'cash-outline' as const,            desc: 'Pay when you receive your order' },
  ];

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#F5EFE6' }}>
      <View className="flex-row items-center px-5 pt-4 pb-3">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
          <Ionicons name="arrow-back" size={24} color="#1F1F1F" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900">Checkout</Text>
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {/* Delivery Address */}
        <View className="bg-white rounded-2xl p-4 mb-4"
          style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}>
          <View className="flex-row items-center mb-3">
            <View className="w-9 h-9 rounded-full items-center justify-center" style={{ backgroundColor: '#FFF3EC' }}>
              <Ionicons name="location" size={18} color="#FF7A30" />
            </View>
            <Text className="text-base font-bold text-gray-900 ml-2">Delivery Address</Text>
          </View>
          <TextInput
            value={address} onChangeText={setAddress}
            placeholder="Enter full delivery address" multiline
            className="bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-900"
            style={{ minHeight: 70 }} placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Order Summary */}
        <View className="bg-white rounded-2xl p-4 mb-4"
          style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}>
          <View className="flex-row items-center mb-3">
            <View className="w-9 h-9 rounded-full items-center justify-center" style={{ backgroundColor: '#FFF3EC' }}>
              <Ionicons name="receipt" size={18} color="#FF7A30" />
            </View>
            <Text className="text-base font-bold text-gray-900 ml-2">Order Summary</Text>
          </View>
          {items.map((item) => (
            <View key={item.product.id} className="flex-row items-center justify-between py-2 border-b border-gray-50">
              <Text className="text-sm text-gray-700 flex-1" numberOfLines={1}>
                {item.product.name} × {item.quantity}
              </Text>
              <Text className="text-sm font-semibold text-gray-900">
                ₹{(item.product.price * item.quantity).toLocaleString()}
              </Text>
            </View>
          ))}
          <View className="flex-row justify-between mt-3">
            <Text className="text-sm text-gray-500">Subtotal</Text>
            <Text className="text-sm font-semibold text-gray-900">₹{totalAmount.toLocaleString()}</Text>
          </View>
          <View className="flex-row justify-between mt-1.5">
            <Text className="text-sm text-gray-500">Delivery</Text>
            <Text className="text-sm font-semibold" style={{ color: deliveryFee === 0 ? '#34C759' : '#1F1F1F' }}>
              {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
            </Text>
          </View>
          <View className="flex-row justify-between mt-3 pt-3 border-t border-gray-100">
            <Text className="text-base font-bold text-gray-900">Total</Text>
            <Text className="text-base font-bold" style={{ color: '#FF7A30' }}>₹{grandTotal.toLocaleString()}</Text>
          </View>
        </View>

        {/* Payment Method */}
        <View className="bg-white rounded-2xl p-4 mb-6"
          style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 }}>
          <View className="flex-row items-center mb-3">
            <View className="w-9 h-9 rounded-full items-center justify-center" style={{ backgroundColor: '#FFF3EC' }}>
              <Ionicons name="wallet" size={18} color="#FF7A30" />
            </View>
            <Text className="text-base font-bold text-gray-900 ml-2">Payment</Text>
          </View>
          {paymentMethods.map((pm) => (
            <TouchableOpacity
              key={pm.id} onPress={() => setPaymentMethod(pm.id)} activeOpacity={0.7}
              className="flex-row items-center p-3 rounded-xl mb-2"
              style={{
                backgroundColor: paymentMethod === pm.id ? '#FFF3EC' : '#F9FAFB',
                borderWidth: paymentMethod === pm.id ? 1.5 : 0, borderColor: '#FF7A30',
              }}
            >
              <Ionicons name={pm.icon} size={20} color={paymentMethod === pm.id ? '#FF7A30' : '#9CA3AF'} />
              <View className="flex-1 ml-3">
                <Text className="text-sm font-semibold" style={{ color: paymentMethod === pm.id ? '#FF7A30' : '#1F1F1F' }}>
                  {pm.label}
                </Text>
                <Text className="text-xs text-gray-400 mt-0.5">{pm.desc}</Text>
              </View>
              {paymentMethod === pm.id && <Ionicons name="checkmark-circle" size={22} color="#FF7A30" />}
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Pay Now Button */}
      <View
        className="absolute bottom-0 left-0 right-0 bg-white px-5 pt-4 pb-8 rounded-t-3xl"
        style={{ shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 8 }}
      >
        <TouchableOpacity
          onPress={paymentMethod === 'cod' ? handleCOD : handleRazorpay}
          activeOpacity={0.85} disabled={isProcessing}
          className="py-4 rounded-xl items-center flex-row justify-center"
          style={{ backgroundColor: isProcessing ? '#FFB088' : '#FF7A30' }}
        >
          {isProcessing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name={paymentMethod === 'cod' ? 'cart' : 'lock-closed'} size={18} color="#fff" />
              <Text className="text-white text-base font-bold ml-2">
                {paymentMethod === 'cod'
                  ? `Place Order • ₹${grandTotal.toLocaleString()}`
                  : `Pay Now • ₹${grandTotal.toLocaleString()}`}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
