/**
 * Serviço de API - centraliza todas as chamadas HTTP ao backend.
 *
 * Princípio SRP: Responsável apenas pela comunicação com a API.
 */

const API_BASE = '/api';

async function handleResponse(response) {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || 'Erro na requisição');
  }
  return data;
}

// ===== Produtos =====

async function fetchProducts(filters = {}) {
  const params = new URLSearchParams();
  if (filters.category) params.append('category', filters.category);
  if (filters.gender) params.append('gender', filters.gender);
  if (filters.minPrice) params.append('min_price', filters.minPrice);
  if (filters.maxPrice) params.append('max_price', filters.maxPrice);
  if (filters.search) params.append('search', filters.search);

  const response = await fetch(`${API_BASE}/products/?${params.toString()}`);
  return handleResponse(response);
}

async function fetchProduct(productId) {
  const response = await fetch(`${API_BASE}/products/${productId}`);
  return handleResponse(response);
}

async function fetchCategories() {
  const response = await fetch(`${API_BASE}/products/categories`);
  return handleResponse(response);
}

// ===== Usuários =====

async function loginUser(email, password) {
  const response = await fetch(`${API_BASE}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(response);
}

async function registerUser(userData) {
  const response = await fetch(`${API_BASE}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
}

// ===== Pedidos =====

async function createOrder(orderData) {
  const response = await fetch(`${API_BASE}/orders/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });
  return handleResponse(response);
}

async function fetchUserOrders(userId) {
  const response = await fetch(`${API_BASE}/orders/user/${userId}`);
  return handleResponse(response);
}

async function cancelOrder(orderId) {
  const response = await fetch(`${API_BASE}/orders/${orderId}/cancel`, {
    method: 'PUT',
  });
  return handleResponse(response);
}
