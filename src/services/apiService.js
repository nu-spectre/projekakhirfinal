const BASE = 'http://localhost:5000/api';

// ─── Token helpers ────────────────────────────────────────────────────────────
export const getToken = () => {
  try { return JSON.parse(localStorage.getItem('sportiva_token')); } catch { return null; }
};
export const saveToken  = (t) => localStorage.setItem('sportiva_token', JSON.stringify(t));
export const clearToken = ()  => localStorage.removeItem('sportiva_token');

function authHeader() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function api(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...authHeader(), ...(options.headers || {}) },
    ...options,
  });
  return res.json();
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const apiRegister = (name, email, password) =>
  api('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) });

export const apiLogin = (email, password) =>
  api('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });

export const apiChangePassword = (email, oldPassword, newPassword) =>
  api('/auth/change-password', { method: 'POST', body: JSON.stringify({ email, oldPassword, newPassword }) });

// ─── Reviews ─────────────────────────────────────────────────────────────────
export const apiGetReviews = (product_id) =>
  api(`/reviews${product_id ? '?product_id=' + product_id : ''}`);

export const apiAddReview = (product_id, rating, comment) =>
  api('/reviews', { method: 'POST', body: JSON.stringify({ product_id, rating, comment }) });

export const apiDeleteReview = (id) =>
  api(`/reviews/${id}`, { method: 'DELETE' });

// ─── Users (superadmin) ───────────────────────────────────────────────────────
export const apiGetUsers    = ()          => api('/users');
export const apiGetMe       = ()          => api('/users/me');
export const apiChangeRole  = (id, role)  => api(`/users/${id}/role`, { method: 'PUT', body: JSON.stringify({ role }) });
export const apiDeleteUser  = (id)        => api(`/users/${id}`, { method: 'DELETE' });