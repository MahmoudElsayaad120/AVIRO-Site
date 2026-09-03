import { CartItem, Product, ClothingSize, ProductColor } from '../types';
import { isRealApiConfigured, apiFetch } from './apiClient';

const CART_STORAGE_KEY = 'aviro_cart';

const getStoredCart = (): CartItem[] => {
  const saved = localStorage.getItem(CART_STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  }
  return [];
};

const saveCart = (items: CartItem[]) => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
};

export const cartService = {
  async getCart(): Promise<CartItem[]> {
    if (isRealApiConfigured()) {
      return await apiFetch<CartItem[]>('/api/cart');
    }
    return getStoredCart();
  },

  async addToCart(
    product: Product,
    selectedSize: ClothingSize,
    selectedColor: ProductColor,
    quantity = 1
  ): Promise<CartItem[]> {
    if (isRealApiConfigured()) {
      return await apiFetch<CartItem[]>('/api/cart/items', {
        method: 'POST',
        body: JSON.stringify({
          productId: product.id,
          selectedSize,
          selectedColor,
          quantity,
        }),
      });
    }

    const items = getStoredCart();
    const existingIndex = items.findIndex(
      (item) =>
        item.productId === product.id &&
        item.selectedSize === selectedSize &&
        item.selectedColor.name === selectedColor.name
    );

    if (existingIndex > -1) {
      items[existingIndex].quantity += quantity;
    } else {
      const newItem: CartItem = {
        id: `ci-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        productId: product.id,
        product,
        selectedSize,
        selectedColor,
        quantity,
        price: product.price,
      };
      items.push(newItem);
    }

    saveCart(items);
    return items;
  },

  async updateCart(cartItemId: string, quantity: number): Promise<CartItem[]> {
    if (isRealApiConfigured()) {
      return await apiFetch<CartItem[]>(`/api/cart/items/${cartItemId}`, {
        method: 'PUT',
        body: JSON.stringify({ quantity }),
      });
    }

    let items = getStoredCart();
    if (quantity <= 0) {
      items = items.filter((item) => item.id !== cartItemId);
    } else {
      items = items.map((item) =>
        item.id === cartItemId ? { ...item, quantity } : item
      );
    }
    saveCart(items);
    return items;
  },

  async removeFromCart(cartItemId: string): Promise<CartItem[]> {
    return this.updateCart(cartItemId, 0);
  },

  async clearCart(): Promise<void> {
    if (isRealApiConfigured()) {
      await apiFetch('/api/cart/clear', { method: 'POST' });
    }
    localStorage.removeItem(CART_STORAGE_KEY);
  },
};
