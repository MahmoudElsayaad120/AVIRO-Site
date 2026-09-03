/**
 * AVIRO API Client
 * Configured to connect directly to ASP.NET Core Web API via VITE_API_BASE_URL.
 * When VITE_API_BASE_URL is not set, seamlessly falls back to client-side
 * structured state with localStorage persistence.
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const isRealApiConfigured = (): boolean => {
  return typeof API_BASE_URL === 'string' && API_BASE_URL.trim().length > 0;
};

export const getAuthHeader = (): Record<string, string> => {
  const token = localStorage.getItem('aviro_jwt_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  if (!isRealApiConfigured()) {
    throw new Error('Real API not configured, using mock service layer.');
  }

  const url = `${API_BASE_URL.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`API Error ${response.status}: ${errorBody || response.statusText}`);
  }

  return response.json();
}
