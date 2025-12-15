const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:5000';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  token?: string;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', headers = {}, body, token } = options;

  const url = `${API_BASE_URL}${endpoint}`;
  
  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  if (token) {
    requestHeaders['Authorization'] = `Bearer ${token}`;
  }

  const requestBody = body ? JSON.stringify(body) : undefined;

  try {
    const response = await fetch(url, {
      method,
      headers: requestHeaders,
      body: requestBody,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Request failed for ${endpoint}:`, error);
    throw error;
  }
}

export const httpClient = {
  request,

  get<T = any>(endpoint: string, token?: string): Promise<T> {
    return request<T>(endpoint, { method: 'GET', token });
  },

  post<T = any>(endpoint: string, body: any, token?: string): Promise<T> {
    return request<T>(endpoint, { method: 'POST', body, token });
  },

  put<T = any>(endpoint: string, body: any, token?: string): Promise<T> {
    return request<T>(endpoint, { method: 'PUT', body, token });
  },

  delete<T = any>(endpoint: string, token?: string): Promise<T> {
    return request<T>(endpoint, { method: 'DELETE', token });
  },
};
