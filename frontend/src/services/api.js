const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const apiCall = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...(options.headers || {}),
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'An unexpected error occurred');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Auth API Methods
export const registerUser = (email, password) =>
  apiCall('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

export const loginUser = (email, password) =>
  apiCall('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

export const getMe = () => apiCall('/api/auth/me');

// Items API Methods
export const getItems = () => apiCall('/api/items');

export const createItem = (title, description) =>
  apiCall('/api/items', {
    method: 'POST',
    body: JSON.stringify({ title, description }),
  });

export const updateItem = (id, title, description) =>
  apiCall(`/api/items/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ title, description }),
  });

export const deleteItem = (id) =>
  apiCall(`/api/items/${id}`, {
    method: 'DELETE',
  });

// Health API Method
export const checkHealth = () => apiCall('/health');
