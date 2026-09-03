import { User, UserRole, Address } from '../types';
import { INITIAL_USER } from '../data/initialData';
import { isRealApiConfigured, apiFetch } from './apiClient';

const USER_STORAGE_KEY = 'aviro_current_user';
const TOKEN_STORAGE_KEY = 'aviro_jwt_token';

export const authService = {
  async getCurrentUser(): Promise<User | null> {
    if (isRealApiConfigured()) {
      try {
        return await apiFetch<User>('/api/auth/me');
      } catch {
        return null;
      }
    }

    const saved = localStorage.getItem(USER_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_USER;
      }
    }
    // Default logged in user for immediate seamless exploration
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(INITIAL_USER));
    return INITIAL_USER;
  },

  async login(email: string, _password: string, role?: UserRole): Promise<User> {
    if (isRealApiConfigured()) {
      const res = await apiFetch<{ token: string; user: User }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password: _password }),
      });
      localStorage.setItem(TOKEN_STORAGE_KEY, res.token);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(res.user));
      return res.user;
    }

    // Mock Login: recognize admin if email has admin or specified role
    const isAdmin = role === 'Admin' || email.toLowerCase().includes('admin');
    const user: User = {
      id: isAdmin ? 'usr-admin' : 'usr-1',
      firstName: isAdmin ? 'AVIRO' : 'Alexander',
      lastName: isAdmin ? 'Admin' : 'Cole',
      email: email || (isAdmin ? 'admin@avirobrand.com' : 'alex.cole@example.com'),
      phone: '+1 (555) 234-8901',
      role: isAdmin ? 'Admin' : 'Customer',
      addresses: INITIAL_USER.addresses,
    };

    localStorage.setItem(TOKEN_STORAGE_KEY, 'mock-jwt-token-aviro-' + Date.now());
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    return user;
  },

  async register(
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    _password: string,
    preferredSize?: any
  ): Promise<User> {
    if (isRealApiConfigured()) {
      const res = await apiFetch<{ token: string; user: User }>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ firstName, lastName, email, phone, password: _password, preferredSize }),
      });
      localStorage.setItem(TOKEN_STORAGE_KEY, res.token);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(res.user));
      return res.user;
    }

    const newUser: User = {
      id: 'usr-' + Date.now(),
      firstName,
      lastName,
      email,
      phone,
      role: 'Customer',
      preferredSize: preferredSize || 'L',
      addresses: [],
    };

    localStorage.setItem(TOKEN_STORAGE_KEY, 'mock-jwt-token-aviro-' + Date.now());
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
    return newUser;
  },

  async getAllCustomers(): Promise<User[]> {
    if (isRealApiConfigured()) {
      return await apiFetch<User[]>('/api/users/customers');
    }
    const current = (await this.getCurrentUser()) || INITIAL_USER;
    const demoCustomers: User[] = [
      current,
      {
        id: 'usr-demo-2',
        firstName: 'Marcus',
        lastName: 'Vance',
        email: 'marcus.vance@example.com',
        phone: '+1 (555) 392-1920',
        role: 'Customer',
        preferredSize: 'XL',
        addresses: [
          {
            id: 'addr-demo-2',
            fullName: 'Marcus Vance',
            street: '184 Mercer Street',
            city: 'New York',
            postalCode: '10012',
            country: 'United States',
          },
        ],
      },
      {
        id: 'usr-demo-3',
        firstName: 'Julian',
        lastName: 'Reyes',
        email: 'julian.reyes@example.com',
        phone: '+1 (555) 749-0129',
        role: 'Customer',
        preferredSize: 'L',
        addresses: [
          {
            id: 'addr-demo-3',
            fullName: 'Julian Reyes',
            street: '420 Melrose Avenue',
            city: 'Los Angeles',
            postalCode: '90046',
            country: 'United States',
          },
        ],
      },
    ];
    return demoCustomers;
  },

  async logout(): Promise<void> {
    if (isRealApiConfigured()) {
      try {
        await apiFetch('/api/auth/logout', { method: 'POST' });
      } catch {
        // ignore
      }
    }
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
  },

  async switchRole(role: UserRole): Promise<User> {
    const current = await this.getCurrentUser();
    const updated: User = current
      ? { ...current, role }
      : { ...INITIAL_USER, role };
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  async updateProfile(updates: Partial<User>): Promise<User> {
    const current = (await this.getCurrentUser()) || INITIAL_USER;
    const updated = { ...current, ...updates };
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  async addAddress(address: Omit<Address, 'id'>): Promise<Address> {
    const current = (await this.getCurrentUser()) || INITIAL_USER;
    const newAddr: Address = {
      ...address,
      id: 'addr-' + Date.now(),
    };
    const updatedAddresses = [...current.addresses, newAddr];
    await this.updateProfile({ addresses: updatedAddresses });
    return newAddr;
  },
};
