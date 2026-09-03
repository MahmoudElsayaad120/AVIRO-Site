import { CategoryInfo, ClothingCategory } from '../types';
import { INITIAL_CATEGORIES } from '../data/initialData';
import { isRealApiConfigured, apiFetch } from './apiClient';

const CATEGORIES_STORAGE_KEY = 'aviro_categories';

const getStoredCategories = (): CategoryInfo[] => {
  const saved = localStorage.getItem(CATEGORIES_STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return INITIAL_CATEGORIES;
    }
  }
  localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(INITIAL_CATEGORIES));
  return INITIAL_CATEGORIES;
};

const saveCategories = (cats: CategoryInfo[]) => {
  localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(cats));
};

export const categoryService = {
  async getCategories(): Promise<CategoryInfo[]> {
    if (isRealApiConfigured()) {
      return await apiFetch<CategoryInfo[]>('/api/categories');
    }
    return getStoredCategories();
  },

  async createCategory(cat: Omit<CategoryInfo, 'id'>): Promise<CategoryInfo> {
    if (isRealApiConfigured()) {
      return await apiFetch<CategoryInfo>('/api/categories', {
        method: 'POST',
        body: JSON.stringify(cat),
      });
    }
    const categories = getStoredCategories();
    const newCat: CategoryInfo = {
      ...cat,
      id: 'cat-' + Date.now(),
    };
    categories.push(newCat);
    saveCategories(categories);
    return newCat;
  },

  async updateCategory(id: string, updates: Partial<CategoryInfo>): Promise<CategoryInfo> {
    if (isRealApiConfigured()) {
      return await apiFetch<CategoryInfo>(`/api/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    }
    const categories = getStoredCategories();
    const index = categories.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('Category not found');
    const updated = { ...categories[index], ...updates };
    categories[index] = updated;
    saveCategories(categories);
    return updated;
  },

  async deleteCategory(id: string): Promise<void> {
    if (isRealApiConfigured()) {
      await apiFetch(`/api/categories/${id}`, { method: 'DELETE' });
      return;
    }
    const categories = getStoredCategories();
    const filtered = categories.filter((c) => c.id !== id);
    saveCategories(filtered);
  },
};
