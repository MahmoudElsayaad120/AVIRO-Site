import { Review } from '../types';
import { INITIAL_REVIEWS } from '../data/initialData';
import { isRealApiConfigured, apiFetch } from './apiClient';

const REVIEWS_STORAGE_KEY = 'aviro_reviews';

const getStoredReviews = (): Review[] => {
  const saved = localStorage.getItem(REVIEWS_STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return INITIAL_REVIEWS;
    }
  }
  localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(INITIAL_REVIEWS));
  return INITIAL_REVIEWS;
};

const saveReviews = (reviews: Review[]) => {
  localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
};

export const reviewService = {
  async getProductReviews(productId?: string, onlyApproved = true): Promise<Review[]> {
    if (isRealApiConfigured()) {
      const q = new URLSearchParams();
      if (productId) q.append('productId', productId);
      if (onlyApproved) q.append('status', 'Approved');
      return await apiFetch<Review[]>(`/api/reviews?${q.toString()}`);
    }

    let items = getStoredReviews();
    if (productId) {
      items = items.filter((r) => r.productId === productId);
    }
    if (onlyApproved) {
      items = items.filter((r) => r.status === 'Approved');
    }
    return items;
  },

  async getAllReviews(): Promise<Review[]> {
    if (isRealApiConfigured()) {
      return await apiFetch<Review[]>('/api/reviews/all');
    }
    return getStoredReviews();
  },

  async createReview(data: Omit<Review, 'id' | 'createdAt' | 'status'>): Promise<Review> {
    if (isRealApiConfigured()) {
      return await apiFetch<Review>('/api/reviews', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    }

    const reviews = getStoredReviews();
    const newReview: Review = {
      ...data,
      id: 'rev-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
      status: 'Pending', // Requires admin moderation by default
    };

    reviews.unshift(newReview);
    saveReviews(reviews);
    return newReview;
  },

  async approveReview(id: string): Promise<Review> {
    if (isRealApiConfigured()) {
      return await apiFetch<Review>(`/api/reviews/${id}/approve`, { method: 'PUT' });
    }
    const reviews = getStoredReviews();
    const index = reviews.findIndex((r) => r.id === id);
    if (index === -1) throw new Error('Review not found');

    reviews[index].status = 'Approved';
    saveReviews(reviews);
    return reviews[index];
  },

  async rejectReview(id: string): Promise<Review> {
    if (isRealApiConfigured()) {
      return await apiFetch<Review>(`/api/reviews/${id}/reject`, { method: 'PUT' });
    }
    const reviews = getStoredReviews();
    const index = reviews.findIndex((r) => r.id === id);
    if (index === -1) throw new Error('Review not found');

    reviews[index].status = 'Rejected';
    saveReviews(reviews);
    return reviews[index];
  },

  async deleteReview(id: string): Promise<void> {
    if (isRealApiConfigured()) {
      await apiFetch(`/api/reviews/${id}`, { method: 'DELETE' });
      return;
    }
    const reviews = getStoredReviews();
    const filtered = reviews.filter((r) => r.id !== id);
    saveReviews(filtered);
  },
};
