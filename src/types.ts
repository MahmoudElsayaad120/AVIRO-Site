export type ClothingSize = 'S' | 'M' | 'L' | 'XL' | 'XXL' | '3XL';

export type ClothingCategory =
  | 'T-Shirts'
  | 'Hoodies'
  | 'Shirts'
  | 'Pants'
  | 'Jackets'
  | 'Sweatpants';

export type UserRole = 'Customer' | 'Admin';

export interface ProductColor {
  name: string;
  hex: string;
}

export interface ProductDetails {
  material: string;
  fit: string;
  fabricWeight: string;
  careInstructions: string;
  countryOfOrigin: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  details: ProductDetails;
  price: number;
  originalPrice?: number;
  discount?: number;
  category: ClothingCategory;
  images: string[];
  colors: ProductColor[];
  sizes: ClothingSize[];
  stock: number;
  rating: number;
  reviewCount: number;
  isNewArrival?: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  createdAt: string;
}

export interface Address {
  id: string;
  fullName: string;
  street: string;
  apartment?: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  preferredSize?: ClothingSize;
  addresses: Address[];
}

export interface Review {
  id: string;
  productId: string;
  productName?: string;
  userId: string;
  userName: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  verifiedPurchase: boolean;
  userAvatar?: string;
  isApproved?: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  selectedSize: ClothingSize;
  selectedColor: ProductColor;
  quantity: number;
  price: number;
}

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';

export type Currency = 'EGP' | 'USD';

export type PaymentMethod =
  | 'Cash on Delivery'
  | 'Credit / Debit Card'
  | 'Online Payment'
  | 'InstaPay'
  | 'Vodafone Cash / Smart Wallet';

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: Address;
  shippingMethod: string;
  shippingCost: number;
  paymentMethod: PaymentMethod;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  totalAmount: number;
  trackingNumber?: string;
  paymentStatus?: string;
  status: OrderStatus;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  message: string;
  sender: 'user' | 'bot';
  createdAt: string;
  quickReplies?: string[];
  productSuggestions?: Product[];
}

export interface CategoryInfo {
  id: string;
  name: ClothingCategory;
  description: string;
  image: string;
  itemCount: number;
}

export interface HeroSlide {
  id: string | number;
  image: string;
  brand: string;
  tagline: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  isActive?: boolean;
}
