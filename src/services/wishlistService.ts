import { isRealApiConfigured, apiFetch } from './apiClient';

const WISHLIST_STORAGE_KEY = 'aviro_wishlist';

const getStoredWishlist = (): string[] => {
  const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  }
  // Start with p-1 and p-2 as initial favorites for demo
  const initial = ['p-1', 'p-2'];
  localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(initial));
  return initial;
};

const saveWishlist = (ids: string[]) => {
  localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(ids));
};

export const wishlistService = {
  async getWishlist(): Promise<string[]> {
    if (isRealApiConfigured()) {
      return await apiFetch<string[]>('/api/wishlist');
    }
    return getStoredWishlist();
  },

  async addToWishlist(productId: string): Promise<string[]> {
    if (isRealApiConfigured()) {
      return await apiFetch<string[]>(`/api/wishlist/${productId}`, { method: 'POST' });
    }
    const current = getStoredWishlist();
    if (!current.includes(productId)) {
      current.push(productId);
      saveWishlist(current);
    }
    return current;
  },

  async removeFromWishlist(productId: string): Promise<string[]> {
    if (isRealApiConfigured()) {
      return await apiFetch<string[]>(`/api/wishlist/${productId}`, { method: 'DELETE' });
    }
    const current = getStoredWishlist();
    const updated = current.filter((id) => id !== productId);
    saveWishlist(updated);
    return updated;
  },

  async toggleWishlist(productId: string): Promise<boolean> {
    const list = await this.getWishlist();
    if (list.includes(productId)) {
      await this.removeFromWishlist(productId);
      return false;
    } else {
      await this.addToWishlist(productId);
      return true;
    }
  },

  async isInWishlist(productId: string): Promise<boolean> {
    const list = await this.getWishlist();
    return list.includes(productId);
  },
};
