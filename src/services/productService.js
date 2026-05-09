const API_URL = 'http://localhost:5000/api/products';

function getToken() {
  try { return JSON.parse(localStorage.getItem('sportiva_token')); } catch { return null; }
}
function authHeader() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Ambil semua produk
export const getProducts = async (params = {}) => {
  try {
    const qs = new URLSearchParams(params).toString();
    const response = await fetch(`${API_URL}${qs ? '?' + qs : ''}`);
    if (!response.ok) throw new Error('Gagal ambil data');
    const json = await response.json();
    return json.ok ? json.data : [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

// Tambah produk
export const createProduct = async (productData) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify(productData),
    });
    return await response.json();
  } catch (error) {
    console.error(error);
    return { ok: false, msg: 'Gagal menambah produk' };
  }
};

// Update produk
export const updateProduct = async (id, productData) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify(productData),
    });
    return await response.json();
  } catch (error) {
    console.error(error);
    return { ok: false, msg: 'Gagal update produk' };
  }
};

// Hapus produk
export const deleteProduct = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: authHeader(),
    });
    return await response.json();
  } catch (error) {
    console.error(error);
    return { ok: false, msg: 'Gagal hapus produk' };
  }
};