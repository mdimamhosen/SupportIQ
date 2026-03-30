const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface RequestOptions extends Omit<RequestInit, 'body'> {
  method?: HttpMethod;
  body?: any;
}

export const api = async <T>(endpoint: string, options: RequestOptions = {}): Promise<T> => {
  const { body, headers: customHeaders, ...customConfig } = options;
  
  const headers = new Headers({
    'Content-Type': 'application/json',
    ...customHeaders,
  });

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  const config: RequestInit = {
    ...customConfig,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    
    if (response.status === 204) {
      return {} as T;
    }

    const data = await response.json().catch(() => ({}));

    if (response.ok) {
      return data as T;
    }

    const errorMessage = Array.isArray(data.message) 
      ? data.message[0] 
      : data.message || response.statusText;
      
    if (response.status === 401 && typeof window !== 'undefined') {
    }

    throw new Error(errorMessage);
  } catch (error: any) {
    if (error.message && !error.message.includes('fetch')) {
      throw error;
    }
    throw new Error('Network error. Is the server running?');
  }
};
