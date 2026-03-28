export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'buyer' | 'vendor';
}

export interface Buyer extends User {
  role: 'buyer';
  deliveryAddress: string;
}

export interface Vendor extends User {
  role: 'vendor';
  shopName: string;
  ownerName: string;
  shopCategory: string;
  shopDescription: string;
  shopAddress: string;
  shopImages: string[];
  profilePhoto: string;
  rating: number;
  totalReviews: number;
  latitude: number;
  longitude: number;
  distance?: number;
}

export interface Product {
  id: string;
  vendorId: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  inStock: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  vendorId: string;
  vendorName: string;
}

export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  vendorId: string;
  vendorName: string;
  items: CartItem[];
  totalAmount: number;
  deliveryAddress: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  orderStatus: OrderStatus;
  createdAt: string;
  razorpayPaymentId?: string;
  rated?: boolean;
  rating?: number;
}

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface LocationCoords {
  latitude: number;
  longitude: number;
}

export interface Review {
  id: string;
  orderId: string;
  buyerId: string;
  buyerName: string;
  vendorId: string;
  rating: number;
  comment: string;
  createdAt: string;
}
