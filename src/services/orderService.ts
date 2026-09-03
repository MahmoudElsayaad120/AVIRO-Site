import { Order, OrderStatus, Address, PaymentMethod, CartItem } from '../types';
import { INITIAL_ORDERS } from '../data/initialData';
import { isRealApiConfigured, apiFetch } from './apiClient';

const ORDERS_STORAGE_KEY = 'aviro_orders';

const getStoredOrders = (): Order[] => {
  const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return INITIAL_ORDERS;
    }
  }
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(INITIAL_ORDERS));
  return INITIAL_ORDERS;
};

const saveOrders = (orders: Order[]) => {
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
};

export interface CreateOrderPayload {
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: Address;
  shippingMethod?: string;
  shippingCost?: number;
  paymentMethod: PaymentMethod;
  items: CartItem[];
  subtotal?: number;
  discount?: number;
  total?: number;
  totalAmount?: number;
}

export const orderService = {
  async getOrders(userId?: string): Promise<Order[]> {
    if (isRealApiConfigured()) {
      const url = userId ? `/api/orders?userId=${userId}` : '/api/orders';
      return await apiFetch<Order[]>(url);
    }
    const orders = getStoredOrders();
    if (userId) {
      return orders.filter((o) => o.userId === userId);
    }
    return orders;
  },

  async getAllOrders(): Promise<Order[]> {
    return this.getOrders();
  },

  async getUserOrders(userId?: string): Promise<Order[]> {
    return this.getOrders(userId);
  },

  async getOrderById(id: string): Promise<Order | null> {
    if (isRealApiConfigured()) {
      return await apiFetch<Order>(`/api/orders/${id}`);
    }
    const orders = getStoredOrders();
    return orders.find((o) => o.id === id || o.orderNumber === id) || null;
  },

  async createOrder(payload: CreateOrderPayload): Promise<Order> {
    if (isRealApiConfigured()) {
      return await apiFetch<Order>('/api/orders', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    }

    const orders = getStoredOrders();
    const finalTotal = payload.total ?? payload.totalAmount ?? 0;
    const newOrder: Order = {
      ...payload,
      customerPhone: payload.customerPhone || '+1 (555) 019-2834',
      shippingMethod: payload.shippingMethod || 'Standard Insured Courier',
      shippingCost: payload.shippingCost ?? 0,
      subtotal: payload.subtotal ?? finalTotal,
      discount: payload.discount ?? 0,
      total: finalTotal,
      totalAmount: finalTotal,
      id: 'ord-' + Date.now(),
      orderNumber: `AVR-${Math.floor(10000 + Math.random() * 90000)}`,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    orders.unshift(newOrder);
    saveOrders(orders);
    return newOrder;
  },

  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
    if (isRealApiConfigured()) {
      return await apiFetch<Order>(`/api/orders/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
    }

    const orders = getStoredOrders();
    const index = orders.findIndex((o) => o.id === id || o.orderNumber === id);
    if (index === -1) throw new Error('Order not found');

    const updated = { ...orders[index], status };
    orders[index] = updated;
    saveOrders(orders);
    return updated;
  },
};
