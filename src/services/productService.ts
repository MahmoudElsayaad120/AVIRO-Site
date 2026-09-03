import { Product, ClothingCategory, ClothingSize } from '../types';
import { INITIAL_PRODUCTS } from '../data/initialData';
import { isRealApiConfigured, apiFetch } from './apiClient';

const PRODUCTS_STORAGE_KEY = 'aviro_products_v3';

const getStoredProducts = (): Product[] => {
  const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return INITIAL_PRODUCTS;
    }
  }
  localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
  return INITIAL_PRODUCTS;
};

const saveProducts = (products: Product[]) => {
  localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
};

export interface ProductFilterOptions {
  category?: ClothingCategory | 'All';
  size?: ClothingSize;
  color?: string;
  priceRange?: string; // 'Under $50' | '$50–$100' | '$100–$150' | '$150+'
  availability?: 'In Stock' | 'Out of Stock' | 'All';
  search?: string;
  sort?: 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'rating';
}

export const productService = {
  async getProducts(filters?: ProductFilterOptions): Promise<Product[]> {
    if (isRealApiConfigured()) {
      const queryParams = new URLSearchParams();
      if (filters?.category && filters.category !== 'All') queryParams.append('category', filters.category);
      if (filters?.size) queryParams.append('size', filters.size);
      if (filters?.color) queryParams.append('color', filters.color);
      if (filters?.search) queryParams.append('search', filters.search);
      if (filters?.sort) queryParams.append('sort', filters.sort);
      return await apiFetch<Product[]>(`/api/products?${queryParams.toString()}`);
    }

    let items = getStoredProducts();

    if (!filters) return items;

    if (filters.category && filters.category !== 'All') {
      items = items.filter((p) => p.category === filters.category);
    }

    if (filters.size) {
      items = items.filter((p) => p.sizes.includes(filters.size as ClothingSize));
    }

    if (filters.color) {
      items = items.filter((p) =>
        p.colors.some((c) => c.name.toLowerCase() === filters.color?.toLowerCase())
      );
    }

    if (filters.priceRange) {
      if (filters.priceRange === 'Under $50') {
        items = items.filter((p) => p.price < 50);
      } else if (filters.priceRange === '$50–$100') {
        items = items.filter((p) => p.price >= 50 && p.price <= 100);
      } else if (filters.priceRange === '$100–$150') {
        items = items.filter((p) => p.price > 100 && p.price <= 150);
      } else if (filters.priceRange === '$150+') {
        items = items.filter((p) => p.price > 150);
      }
    }

    if (filters.availability && filters.availability !== 'All') {
      if (filters.availability === 'In Stock') {
        items = items.filter((p) => p.stock > 0);
      } else if (filters.availability === 'Out of Stock') {
        items = items.filter((p) => p.stock <= 0);
      }
    }

    if (filters.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (filters.sort) {
      if (filters.sort === 'newest') {
        items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      } else if (filters.sort === 'price-asc') {
        items.sort((a, b) => a.price - b.price);
      } else if (filters.sort === 'price-desc') {
        items.sort((a, b) => b.price - a.price);
      } else if (filters.sort === 'rating') {
        items.sort((a, b) => b.rating - a.rating);
      }
    }

    return items;
  },

  async getProductById(id: string): Promise<Product | null> {
    if (isRealApiConfigured()) {
      return await apiFetch<Product>(`/api/products/${id}`);
    }
    const products = getStoredProducts();
    return products.find((p) => p.id === id) || null;
  },

  async createProduct(data: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
    if (isRealApiConfigured()) {
      return await apiFetch<Product>('/api/products', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    }
    const products = getStoredProducts();
    const newProduct: Product = {
      ...data,
      id: 'p-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    products.unshift(newProduct);
    saveProducts(products);
    return newProduct;
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    if (isRealApiConfigured()) {
      return await apiFetch<Product>(`/api/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    }
    const products = getStoredProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Product not found');
    const updated = { ...products[index], ...updates };
    products[index] = updated;
    saveProducts(products);
    return updated;
  },

  async deleteProduct(id: string): Promise<void> {
    if (isRealApiConfigured()) {
      await apiFetch(`/api/products/${id}`, { method: 'DELETE' });
      return;
    }
    const products = getStoredProducts();
    const filtered = products.filter((p) => p.id !== id);
    saveProducts(filtered);
  },

  async updateStock(id: string, newStock: number): Promise<Product> {
    return this.updateProduct(id, { stock: Math.max(0, newStock) });
  },
};
