// src/lib/firebaseServices.ts
// Central Firebase service layer — all Firestore/Storage/Auth calls live here.
// Screens and contexts import from this file; they never touch firebase/* directly.

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
  addDoc,
} from 'firebase/firestore';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';

import { auth, db, storage } from './firebase';
import { Buyer, Vendor, Product, Order, OrderStatus, CartItem } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type AppRole = 'buyer' | 'vendor';

export interface CreateUserPayload {
  email: string;
  password: string;
  name: string;
  phone: string;
  role: AppRole;
  deliveryAddress?: string; // buyer only
}

export interface CreateVendorPayload {
  uid: string;
  ownerName: string;
  shopName: string;
  shopCategory: string;
  shopDescription: string;
  shopAddress: string;
  phone: string;
  email: string;
  latitude: number;
  longitude: number;
  profilePhotoUri?: string | null;
  shopImageUris?: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// IMAGE UPLOAD
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Uploads a local file URI to Firebase Storage and returns the public download URL.
 * @param localUri  e.g. "file:///data/user/.../image.jpg"
 * @param storagePath  e.g. "products/abc123.jpg"
 */
export async function uploadImage(
  localUri: string,
  storagePath: string
): Promise<string> {
  const response = await fetch(localUri);
  const blob = await response.blob();
  const storageRef = ref(storage, storagePath);
  const task = uploadBytesResumable(storageRef, blob);

  return new Promise((resolve, reject) => {
    task.on(
      'state_changed',
      null,
      (err) => reject(err),
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        resolve(url);
      }
    );
  });
}

/**
 * Deletes an image from Storage by its full download URL.
 * Silently ignores errors (image may already be deleted).
 */
export async function deleteImage(downloadUrl: string): Promise<void> {
  try {
    const imageRef = ref(storage, downloadUrl);
    await deleteObject(imageRef);
  } catch {
    // ignore
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTHENTICATION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Creates a new Firebase Auth user + writes to Firestore `users/{uid}`.
 * Returns the Firebase user object.
 */
export async function signUpWithEmail(payload: CreateUserPayload): Promise<FirebaseUser> {
  const { email, password, name, phone, role, deliveryAddress } = payload;
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const uid = cred.user.uid;

  await setDoc(doc(db, 'users', uid), {
    uid,
    name,
    email,
    phone,
    role,
    deliveryAddress: deliveryAddress || '',
    createdAt: serverTimestamp(),
  });

  return cred.user;
}

/**
 * Signs in with email + password.
 */
export async function loginWithEmail(
  email: string,
  password: string
): Promise<FirebaseUser> {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

/**
 * Signs out the current user.
 */
export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

/**
 * Fetches the user document from Firestore.
 * Returns null if not found.
 */
export async function fetchUserDoc(uid: string): Promise<(Buyer | Vendor) | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return null;
  return { id: uid, ...snap.data() } as Buyer | Vendor;
}

/**
 * Fetches the vendor profile from Firestore `vendors/{uid}`.
 */
export async function fetchVendorDoc(uid: string): Promise<Vendor | null> {
  const snap = await getDoc(doc(db, 'vendors', uid));
  if (!snap.exists()) return null;
  return { id: uid, ...snap.data() } as Vendor;
}

/**
 * Subscribes to Firebase Auth state changes.
 */
export function subscribeToAuthState(
  callback: (user: FirebaseUser | null) => void
): () => void {
  return onAuthStateChanged(auth, callback);
}

// ─────────────────────────────────────────────────────────────────────────────
// VENDOR PROFILE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Creates a vendor profile in Firestore + uploads images to Storage.
 * Also writes the users/{uid} document with role='vendor'.
 */
export async function createVendorProfile(
  payload: CreateVendorPayload
): Promise<Vendor> {
  const {
    uid, ownerName, shopName, shopCategory, shopDescription,
    shopAddress, phone, email, latitude, longitude,
    profilePhotoUri, shopImageUris = [],
  } = payload;

  // Upload profile photo
  let profilePhoto = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(ownerName) + '&background=FF7A30&color=fff';
  if (profilePhotoUri) {
    profilePhoto = await uploadImage(profilePhotoUri, `vendors/${uid}/profile.jpg`);
  }

  // Upload shop images
  const shopImages: string[] = [];
  for (let i = 0; i < shopImageUris.length; i++) {
    const url = await uploadImage(shopImageUris[i], `vendors/${uid}/shop_${i}.jpg`);
    shopImages.push(url);
  }
  if (shopImages.length === 0) {
    shopImages.push('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400');
  }

  const vendorData: Omit<Vendor, 'id'> = {
    name: ownerName,
    email,
    phone,
    role: 'vendor',
    ownerName,
    shopName,
    shopCategory,
    shopDescription: shopDescription || `Welcome to ${shopName}!`,
    shopAddress: shopAddress || 'Address not provided',
    shopImages,
    profilePhoto,
    rating: 5.0,
    totalReviews: 0,
    latitude,
    longitude,
  };

  // Write vendor profile
  await setDoc(doc(db, 'vendors', uid), vendorData);
  // Update user role field too
  await setDoc(doc(db, 'users', uid), { role: 'vendor' }, { merge: true });

  return { id: uid, ...vendorData };
}

// ─────────────────────────────────────────────────────────────────────────────
// VENDORS (for buyer home screen)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Real-time listener for all vendors.
 */
export function subscribeToVendors(
  callback: (vendors: Vendor[]) => void
): () => void {
  const q = collection(db, 'vendors');
  return onSnapshot(q, (snap) => {
    const vendors = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Vendor));
    callback(vendors);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Adds a new product. Uploads image to Storage first.
 */
export async function addProduct(
  vendorId: string,
  data: {
    name: string;
    price: number;
    description: string;
    category: string;
    inStock: boolean;
  },
  imageUri: string | null
): Promise<Product> {
  const productRef = doc(collection(db, 'products'));
  const productId = productRef.id;

  let imageUrl = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400';
  if (imageUri) {
    imageUrl = await uploadImage(imageUri, `products/${vendorId}/${productId}.jpg`);
  }

  const product: Omit<Product, 'id'> = {
    vendorId,
    name: data.name,
    price: data.price,
    description: data.description,
    category: data.category,
    inStock: data.inStock,
    image: imageUrl,
  };

  await setDoc(productRef, { ...product, createdAt: serverTimestamp() });
  return { id: productId, ...product };
}

/**
 * Updates an existing product. Optionally re-uploads image.
 */
export async function updateProduct(
  productId: string,
  vendorId: string,
  data: Partial<{
    name: string;
    price: number;
    description: string;
    category: string;
    inStock: boolean;
    image: string;
  }>,
  newImageUri: string | null
): Promise<void> {
  const updates: Record<string, unknown> = { ...data };

  if (newImageUri) {
    const url = await uploadImage(newImageUri, `products/${vendorId}/${productId}.jpg`);
    updates.image = url;
  }

  await updateDoc(doc(db, 'products', productId), updates);
}

/**
 * Deletes a product document (Storage image cleanup is optional).
 */
export async function deleteProduct(productId: string): Promise<void> {
  await deleteDoc(doc(db, 'products', productId));
}

/**
 * Real-time listener for a vendor's products.
 */
export function subscribeToProducts(
  vendorId: string,
  callback: (products: Product[]) => void
): () => void {
  const q = query(
    collection(db, 'products'),
    where('vendorId', '==', vendorId)
  );
  return onSnapshot(q, (snap) => {
    const products = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
    callback(products);
  });
}

/**
 * Real-time listener for a specific vendor's products (used in buyer's VendorStoreScreen).
 */
export function subscribeToVendorProducts(
  vendorId: string,
  callback: (products: Product[]) => void
): () => void {
  return subscribeToProducts(vendorId, callback);
}

// ─────────────────────────────────────────────────────────────────────────────
// ORDERS
// ─────────────────────────────────────────────────────────────────────────────

export interface PlaceOrderPayload {
  buyerId: string;
  buyerName: string;
  vendorId: string;
  vendorName: string;
  items: CartItem[];
  totalAmount: number;
  deliveryAddress: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  razorpayPaymentId?: string;
}

/**
 * Writes a new order to Firestore. Returns the order with its generated ID.
 */
export async function placeOrder(payload: PlaceOrderPayload): Promise<Order> {
  const orderRef = doc(collection(db, 'orders'));
  const orderId = orderRef.id;

  const order: Omit<Order, 'id'> = {
    buyerId: payload.buyerId,
    buyerName: payload.buyerName,
    vendorId: payload.vendorId,
    vendorName: payload.vendorName,
    items: payload.items,
    totalAmount: payload.totalAmount,
    deliveryAddress: payload.deliveryAddress,
    paymentStatus: payload.paymentStatus,
    orderStatus: 'pending',
    createdAt: new Date().toISOString(),
    razorpayPaymentId: payload.razorpayPaymentId,
    rated: false,
  };

  await setDoc(orderRef, {
    ...order,
    createdAt: serverTimestamp(),
  });

  return { id: orderId, ...order };
}

/**
 * Updates the status of an order.
 */
export async function updateOrderStatusInDb(
  orderId: string,
  status: OrderStatus
): Promise<void> {
  await updateDoc(doc(db, 'orders', orderId), { orderStatus: status });
}

/**
 * Marks an order as rated.
 */
export async function rateOrderInDb(
  orderId: string,
  rating: number
): Promise<void> {
  await updateDoc(doc(db, 'orders', orderId), { rated: true, rating });
}

/**
 * Real-time listener for a vendor's incoming orders (newest first).
 */
export function subscribeToVendorOrders(
  vendorId: string,
  callback: (orders: Order[]) => void
): () => void {
  const q = query(
    collection(db, 'orders'),
    where('vendorId', '==', vendorId),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, (snap) => {
    const orders = snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        ...data,
        // Convert Firestore Timestamp → ISO string for existing UI code
        createdAt:
          data.createdAt instanceof Timestamp
            ? data.createdAt.toDate().toISOString()
            : data.createdAt ?? new Date().toISOString(),
      } as Order;
    });
    callback(orders);
  });
}

/**
 * Real-time listener for a buyer's order history (newest first).
 */
export function subscribeToBuyerOrders(
  buyerId: string,
  callback: (orders: Order[]) => void
): () => void {
  const q = query(
    collection(db, 'orders'),
    where('buyerId', '==', buyerId),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, (snap) => {
    const orders = snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        ...data,
        createdAt:
          data.createdAt instanceof Timestamp
            ? data.createdAt.toDate().toISOString()
            : data.createdAt ?? new Date().toISOString(),
      } as Order;
    });
    callback(orders);
  });
}
