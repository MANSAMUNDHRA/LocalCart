import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Text } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

// Screens
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import VendorProfileScreen from '../screens/VendorProfileScreen';
import VendorStoreScreen from '../screens/VendorStoreScreen';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import MapScreen from '../screens/MapScreen';
import BuyerOrdersScreen from '../screens/BuyerOrdersScreen';
import VendorDashboard from '../screens/VendorDashboard';
import AddProductScreen from '../screens/AddProductScreen';
import EditProductScreen from '../screens/EditProductScreen';
import OrdersScreen from '../screens/OrdersScreen';
import VendorRegistrationScreen from '../screens/VendorRegistrationScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TAB_BAR_STYLE = {
  backgroundColor: '#FFFFFF',
  borderTopWidth: 0,
  height: 65,
  paddingBottom: 8,
  paddingTop: 8,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: -4 },
  shadowOpacity: 0.06,
  shadowRadius: 12,
  elevation: 8,
};

function BuyerTabs() {
  const { totalItems } = useCart();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: TAB_BAR_STYLE,
        tabBarActiveTintColor: '#FF7A30',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={22} color={color} />,
        }}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarLabel: 'Map',
          tabBarIcon: ({ color }) => <Ionicons name="map" size={22} color={color} />,
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarLabel: 'Cart',
          tabBarIcon: ({ color }) => (
            <View>
              <Ionicons name="bag" size={22} color={color} />
              {totalItems > 0 && (
                <View style={{
                  position: 'absolute', top: -4, right: -8,
                  backgroundColor: '#FF7A30', borderRadius: 10,
                  width: 18, height: 18, alignItems: 'center', justifyContent: 'center',
                }}>
                  <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>{totalItems}</Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="MyOrders"
        component={BuyerOrdersScreen}
        options={{
          tabBarLabel: 'Orders',
          tabBarIcon: ({ color }) => <Ionicons name="receipt" size={22} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

function VendorTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: TAB_BAR_STYLE,
        tabBarActiveTintColor: '#FF7A30',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={VendorDashboard}
        options={{
          tabBarLabel: 'Shop',
          tabBarIcon: ({ color }) => <Ionicons name="storefront" size={22} color={color} />,
        }}
      />
      <Tab.Screen
        name="Orders"
        component={OrdersScreen}
        options={{
          tabBarLabel: 'Orders',
          tabBarIcon: ({ color }) => <Ionicons name="receipt" size={22} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { isLoggedIn, role } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isLoggedIn ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen
              name="VendorRegistration"
              component={VendorRegistrationScreen}
              options={{ animation: 'slide_from_right' }}
            />
          </>
        ) : role === 'buyer' ? (
          <>
            <Stack.Screen name="BuyerMain" component={BuyerTabs} />
            <Stack.Screen
              name="VendorProfile"
              component={VendorProfileScreen}
              options={{ animation: 'slide_from_right' }}
            />
            <Stack.Screen
              name="VendorStore"
              component={VendorStoreScreen}
              options={{ animation: 'slide_from_right' }}
            />
            <Stack.Screen
              name="Checkout"
              component={CheckoutScreen}
              options={{ animation: 'slide_from_right' }}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="VendorMain" component={VendorTabs} />
            <Stack.Screen
              name="AddProduct"
              component={AddProductScreen}
              options={{ animation: 'slide_from_right' }}
            />
            <Stack.Screen
              name="EditProduct"
              component={EditProductScreen}
              options={{ animation: 'slide_from_right' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
