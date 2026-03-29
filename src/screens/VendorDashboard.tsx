// src/screens/VendorDashboard.tsx
// Reads products and orders from Firestore via realtime listeners.

import React, { useState, useEffect } from 'react';
import {
  View, Text, Image, ScrollView, TouchableOpacity,
  SafeAreaView, Alert, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrdersContext';
import { subscribeToProducts } from '../lib/firebaseServices';
import { Vendor, Product } from '../types';

const CARD_SHADOW = {
  shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.06, shadowRadius: 10, elevation: 3,
};
const STRONG_SHADOW = {
  shadowColor: '#000', shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.1, shadowRadius: 16, elevation: 6,
};

export default function VendorDashboard({ navigation }: any) {
  const { user } = useAuth();
  const { orders } = useOrders();
  const vendor = user as Vendor;

  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  // ── Realtime products listener ──────────────────────────────────────────
  useEffect(() => {
    if (!vendor?.id) return;
    const unsubscribe = subscribeToProducts(vendor.id, (incoming) => {
      setProducts(incoming);
      setProductsLoading(false);
    });
    return unsubscribe;
  }, [vendor?.id]);

  // ── Order stats ─────────────────────────────────────────────────────────
  const paidOrders    = orders.filter((o) => o.paymentStatus === 'paid');
  const pendingOrders = orders.filter((o) => o.orderStatus === 'pending');
  const revenue       = paidOrders.reduce((s, o) => s + o.totalAmount, 0);
  const todayRevenue  = paidOrders
    .filter((o) => new Date(o.createdAt).toDateString() === new Date().toDateString())
    .reduce((s, o) => s + o.totalAmount, 0);

  const statusColor = (status: string) => {
    switch (status) {
      case 'pending':   return { bg: '#FFF7ED', text: '#C2410C', dot: '#F97316' };
      case 'preparing': return { bg: '#EFF6FF', text: '#1D4ED8', dot: '#3B82F6' };
      case 'delivered': return { bg: '#F0FDF4', text: '#166534', dot: '#22C55E' };
      default:          return { bg: '#F9FAFB', text: '#6B7280', dot: '#9CA3AF' };
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F4F6F9' }}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── TOP HERO BANNER ── */}
        <View style={{ backgroundColor: '#1A1A2E', paddingBottom: 28 }}>
          <View style={{ height: 130, position: 'relative' }}>
            <Image
              source={{ uri: vendor.shopImages?.[0] || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400' }}
              style={{ width: '100%', height: 130 }} resizeMode="cover"
            />
            <View style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15,15,30,0.6)' }} />
            <View style={{
              position: 'absolute', top: 14, right: 16,
              flexDirection: 'row', alignItems: 'center',
              backgroundColor: 'rgba(34,197,94,0.2)', borderWidth: 1, borderColor: '#22C55E',
              paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
            }}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#22C55E', marginRight: 5 }} />
              <Text style={{ color: '#22C55E', fontSize: 11, fontWeight: '700' }}>SHOP LIVE</Text>
            </View>
          </View>

          <View style={{ paddingHorizontal: 20, marginTop: -28 }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
              <View style={{
                width: 64, height: 64, borderRadius: 18, overflow: 'hidden',
                borderWidth: 3, borderColor: '#1A1A2E', ...CARD_SHADOW,
              }}>
                <Image
                  source={{ uri: vendor.profilePhoto || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(vendor.ownerName || 'V') + '&background=FF7A30&color=fff' }}
                  style={{ width: 64, height: 64 }} resizeMode="cover"
                />
              </View>
              <View style={{ flex: 1, marginLeft: 14, paddingBottom: 4 }}>
                <Text style={{ color: '#fff', fontSize: 17, fontWeight: '800', letterSpacing: -0.3 }}>
                  {vendor.shopName}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3 }}>
                  <Ionicons name="star" size={12} color="#FBBF24" />
                  <Text style={{ color: '#FBBF24', fontSize: 12, fontWeight: '700', marginLeft: 3 }}>
                    {vendor.rating}
                  </Text>
                  <Text style={{ color: '#888', fontSize: 12, marginLeft: 4 }}>
                    ({vendor.totalReviews} reviews)
                  </Text>
                  <Text style={{ color: '#555', marginHorizontal: 6 }}>·</Text>
                  <Text style={{ color: '#888', fontSize: 12 }}>{vendor.shopCategory}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* ── REVENUE CARD ── */}
        <View style={{ paddingHorizontal: 16, marginTop: -14 }}>
          <View style={{
            backgroundColor: '#FF7A30', borderRadius: 20, padding: 20,
            ...STRONG_SHADOW, shadowColor: '#FF7A30', shadowOpacity: 0.3,
          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <View>
                <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, fontWeight: '600', letterSpacing: 0.5 }}>
                  TOTAL REVENUE
                </Text>
                <Text style={{ color: '#fff', fontSize: 34, fontWeight: '800', marginTop: 4, letterSpacing: -1 }}>
                  ₹{revenue.toLocaleString('en-IN')}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                  <View style={{
                    flexDirection: 'row', alignItems: 'center',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8,
                  }}>
                    <Ionicons name="trending-up" size={12} color="#fff" />
                    <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700', marginLeft: 4 }}>Live data</Text>
                  </View>
                </View>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <View style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 14, padding: 10 }}>
                  <Ionicons name="wallet" size={24} color="#fff" />
                </View>
                <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, marginTop: 10, fontWeight: '500' }}>Today</Text>
                <Text style={{ color: '#fff', fontSize: 18, fontWeight: '800' }}>
                  ₹{todayRevenue > 0 ? todayRevenue.toLocaleString('en-IN') : '0'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── STATS ROW ── */}
        <View style={{ flexDirection: 'row', paddingHorizontal: 16, marginTop: 14, gap: 10 }}>
          {[
            { label: 'Products', value: products.length, icon: 'cube-outline' as const, color: '#6366F1', bg: '#EEF2FF' },
            { label: 'Orders', value: orders.length, icon: 'receipt-outline' as const, color: '#10B981', bg: '#ECFDF5' },
            { label: 'Pending', value: pendingOrders.length, icon: 'time-outline' as const, color: '#F59E0B', bg: '#FFFBEB' },
          ].map((s) => (
            <View key={s.label} style={{ flex: 1, backgroundColor: '#fff', borderRadius: 16, padding: 14, alignItems: 'center', ...CARD_SHADOW }}>
              <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: s.bg, alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                <Ionicons name={s.icon} size={20} color={s.color} />
              </View>
              <Text style={{ fontSize: 22, fontWeight: '800', color: '#1a1a1a' }}>{s.value}</Text>
              <Text style={{ fontSize: 11, color: '#9CA3AF', fontWeight: '500', marginTop: 2 }}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* ── QUICK ACTIONS ── */}
        <View style={{ paddingHorizontal: 16, marginTop: 20 }}>
          <Text style={{ fontSize: 13, fontWeight: '700', color: '#6B7280', letterSpacing: 0.5, marginBottom: 12 }}>
            QUICK ACTIONS
          </Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity
              onPress={() => navigation.navigate('AddProduct')} activeOpacity={0.85}
              style={{ flex: 1, backgroundColor: '#1A1A2E', borderRadius: 16, paddingVertical: 16, alignItems: 'center', ...CARD_SHADOW }}
            >
              <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,122,48,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                <Ionicons name="add-circle" size={22} color="#FF7A30" />
              </View>
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 13 }}>Add Product</Text>
              <Text style={{ color: '#666', fontSize: 11, marginTop: 2 }}>List new item</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('Orders')} activeOpacity={0.85}
              style={{ flex: 1, backgroundColor: '#fff', borderRadius: 16, paddingVertical: 16, alignItems: 'center', ...CARD_SHADOW }}
            >
              <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#ECFDF5', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                <Ionicons name="receipt" size={22} color="#10B981" />
              </View>
              <Text style={{ color: '#1a1a1a', fontWeight: '700', fontSize: 13 }}>Manage Orders</Text>
              <Text style={{ color: '#9CA3AF', fontSize: 11, marginTop: 2 }}>
                {pendingOrders.length > 0 ? `${pendingOrders.length} pending` : 'All clear'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── RECENT ORDERS ── */}
        {orders.length > 0 && (
          <View style={{ paddingHorizontal: 16, marginTop: 24 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={{ fontSize: 15, fontWeight: '800', color: '#1a1a1a' }}>Recent Orders</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Orders')}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: '#FF7A30' }}>See all →</Text>
              </TouchableOpacity>
            </View>

            {orders.slice(0, 3).map((order) => {
              const sc = statusColor(order.orderStatus);
              return (
                <View key={order.id} style={{ backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 10, ...CARD_SHADOW }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: 14, fontWeight: '700', color: '#1a1a1a' }}>{order.buyerName}</Text>
                        <Text style={{ color: '#D1D5DB', marginHorizontal: 6 }}>·</Text>
                        <Text style={{ fontSize: 12, color: '#9CA3AF' }}>#{order.id.slice(-4).toUpperCase()}</Text>
                      </View>
                      <Text style={{ fontSize: 12, color: '#9CA3AF', marginTop: 4 }}>
                        {order.items.length} item{order.items.length > 1 ? 's' : ''} · {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </Text>
                    </View>
                    <View>
                      <Text style={{ fontSize: 16, fontWeight: '800', color: '#1a1a1a', textAlign: 'right' }}>
                        ₹{order.totalAmount.toLocaleString('en-IN')}
                      </Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: sc.bg, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, marginTop: 5, alignSelf: 'flex-end' }}>
                        <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: sc.dot, marginRight: 4 }} />
                        <Text style={{ fontSize: 11, fontWeight: '700', color: sc.text, textTransform: 'capitalize' }}>{order.orderStatus}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                    {order.items.slice(0, 3).map((item, i) => (
                      <View key={i} style={{ backgroundColor: '#F4F6F9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}>
                        <Text style={{ fontSize: 11, color: '#6B7280', fontWeight: '500' }}>
                          {item.product.name} ×{item.quantity}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* ── PRODUCTS ── */}
        <View style={{ paddingHorizontal: 16, marginTop: 24, paddingBottom: 40 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ fontSize: 15, fontWeight: '800', color: '#1a1a1a' }}>
              Your Products{' '}
              <Text style={{ fontWeight: '500', color: '#9CA3AF' }}>({products.length})</Text>
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('AddProduct')}
              style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF3EC', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 }}
            >
              <Ionicons name="add" size={15} color="#FF7A30" />
              <Text style={{ fontSize: 13, fontWeight: '700', color: '#FF7A30', marginLeft: 4 }}>Add</Text>
            </TouchableOpacity>
          </View>

          {productsLoading ? (
            <View style={{ alignItems: 'center', paddingVertical: 20 }}>
              <ActivityIndicator size="large" color="#FF7A30" />
            </View>
          ) : products.length === 0 ? (
            <View style={{ backgroundColor: '#fff', borderRadius: 20, padding: 32, alignItems: 'center', ...CARD_SHADOW }}>
              <View style={{ width: 64, height: 64, borderRadius: 20, backgroundColor: '#F4F6F9', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                <Ionicons name="cube-outline" size={32} color="#D1D5DB" />
              </View>
              <Text style={{ fontSize: 15, fontWeight: '700', color: '#374151' }}>No products yet</Text>
              <Text style={{ fontSize: 13, color: '#9CA3AF', marginTop: 4, textAlign: 'center' }}>
                Start selling by adding your first product
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('AddProduct')}
                style={{ marginTop: 16, backgroundColor: '#FF7A30', paddingHorizontal: 24, paddingVertical: 11, borderRadius: 12 }}
              >
                <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>Add First Product</Text>
              </TouchableOpacity>
            </View>
          ) : (
            products.map((product) => (
              <TouchableOpacity
                key={product.id}
                onPress={() => navigation.navigate('EditProduct', { product })}
                activeOpacity={0.88}
                style={{ backgroundColor: '#fff', borderRadius: 16, marginBottom: 10, flexDirection: 'row', overflow: 'hidden', ...CARD_SHADOW }}
              >
                <Image source={{ uri: product.image }} style={{ width: 90, height: 90 }} resizeMode="cover" />
                <View style={{ flex: 1, padding: 12, justifyContent: 'space-between' }}>
                  <View>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: '#1a1a1a' }} numberOfLines={1}>{product.name}</Text>
                    <Text style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }} numberOfLines={1}>{product.description}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 16, fontWeight: '800', color: '#FF7A30' }}>₹{product.price.toLocaleString('en-IN')}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <View style={{ width: 7, height: 7, borderRadius: 4, marginRight: 5, backgroundColor: product.inStock ? '#22C55E' : '#EF4444' }} />
                      <Text style={{ fontSize: 12, color: product.inStock ? '#166534' : '#991B1B', fontWeight: '600' }}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={{ justifyContent: 'center', paddingRight: 14, paddingLeft: 4 }}>
                  <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: '#F4F6F9', alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name="create-outline" size={16} color="#6B7280" />
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}