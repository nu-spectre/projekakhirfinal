import React, { useState, useCallback, useEffect } from 'react';

// Komponen
import Navbar from './components/Navbar';
import Toast from './components/Toast';

// Halaman
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import DetailPage from './pages/DetailPage';
import AuthPage from './pages/AuthPage';
import FavoritesPage from './pages/FavoritesPage';
import SearchPage from './pages/SearchPage';
import ContactPage from './pages/ContactPage';
import AdminPage from './pages/AdminPage';

// API Services
import {
  apiLogin, apiRegister,
  apiAddReview, apiDeleteReview, apiGetReviews,
  getToken, saveToken, clearToken,
} from './services/apiService';
import { getProducts, createProduct, updateProduct, deleteProduct } from './services/productService';

// localStorage helper (hanya untuk favorit)
const LS = {
  get: (key, fb = null) => { try { return JSON.parse(localStorage.getItem(key)) ?? fb; } catch { return fb; } },
  set: (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} },
};
const FAV_KEY = (u) => `sportiva_favs_${u}`;

export default function App() {
  const [currentPage, setCurrentPage]             = useState('home');
  const [prevPage, setPrevPage]                   = useState('home');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [currentUser, setCurrentUser]             = useState(null);
  const [favorites, setFavorites]                 = useState([]);
  const [isLoggedIn, setIsLoggedIn]               = useState(false);
  const [searchQuery, setSearchQuery]             = useState('');
  const [searchResults, setSearchResults]         = useState([]);
  const [toast, setToast]                         = useState({ msg: '', visible: false });
  const [reviews, setReviews]                     = useState([]);
  const [allProducts, setAllProducts]             = useState([]);
  const [loadingProducts, setLoadingProducts]     = useState(true);

  // Load semua produk dari DB
  const fetchProducts = useCallback(async () => {
    setLoadingProducts(true);
    const data = await getProducts();
    setAllProducts(data);
    setLoadingProducts(false);
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // Restore session dari JWT
  useEffect(() => {
    const token = getToken();
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp * 1000 > Date.now()) {
        setCurrentUser({ id: payload.id, name: payload.name, email: payload.email, role: payload.role });
        setIsLoggedIn(true);
        setFavorites(LS.get(FAV_KEY(payload.email), []));
      } else {
        clearToken();
      }
    } catch { clearToken(); }
  }, []);

  const showToast = useCallback((msg) => {
    setToast({ msg, visible: true });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2500);
  }, []);

  const navigate = useCallback((page) => {
    setPrevPage(currentPage);
    setCurrentPage(page);
    window.scrollTo(0, 0);
  }, [currentPage]);

  const openDetail = useCallback((productId) => {
    setPrevPage(currentPage);
    setSelectedProductId(productId);
    setCurrentPage('detail');
    window.scrollTo(0, 0);
    apiGetReviews(productId).then((res) => { if (res.ok) setReviews(res.data); });
  }, [currentPage]);

  const goBack = useCallback(() => {
    navigate(prevPage === 'detail' ? 'home' : prevPage);
  }, [navigate, prevPage]);

  const toggleFav = useCallback((productId) => {
    if (!isLoggedIn) { navigate('auth'); showToast('Login dulu untuk menyimpan favorit'); return; }
    setFavorites((prev) => {
      const isFav = prev.includes(productId);
      const next  = isFav ? prev.filter((id) => id !== productId) : [...prev, productId];
      LS.set(FAV_KEY(currentUser.email), next);
      showToast(isFav ? 'Dihapus dari favorit' : 'Ditambahkan ke favorit ❤️');
      return next;
    });
  }, [isLoggedIn, navigate, showToast, currentUser]);

  const clearAllFavorites = useCallback(() => {
    setFavorites([]);
    LS.set(FAV_KEY(currentUser?.email), []);
    showToast('Semua favorit telah dihapus 🗑️');
  }, [currentUser, showToast]);

  const handleLogin = useCallback(async (email, password) => {
    const res = await apiLogin(email, password);
    if (!res.ok) return { ok: false, msg: res.msg };
    saveToken(res.token);
    setCurrentUser(res.user);
    setIsLoggedIn(true);
    setFavorites(LS.get(FAV_KEY(res.user.email), []));
    showToast(`Selamat datang, ${res.user.name}! 🎉`);
    setTimeout(() => navigate('home'), 600);
    return { ok: true };
  }, [navigate, showToast]);

  const handleRegister = useCallback(async (email, password, name) => {
    const res = await apiRegister(name, email, password);
    return res.ok ? { ok: true } : { ok: false, msg: res.msg };
  }, []);

  const handleForgotPassword = useCallback(() => {
    return { ok: false, msg: 'Silakan login lalu ubah password melalui profil' };
  }, []);

  const handleLogout = useCallback(() => {
    clearToken();
    setIsLoggedIn(false);
    setCurrentUser(null);
    setFavorites([]);
    showToast('Berhasil logout 👋');
    navigate('home');
  }, [navigate, showToast]);

  const submitReview = useCallback(async (productId, rating, comment) => {
    if (!isLoggedIn) { navigate('auth'); showToast('Login dulu untuk memberi review'); return { ok: false }; }
    const res = await apiAddReview(productId, rating, comment);
    if (!res.ok) return { ok: false, msg: res.msg };
    setReviews((prev) => [res.data, ...prev]);
    showToast('Review berhasil dikirim! ⭐');
    return { ok: true };
  }, [isLoggedIn, navigate, showToast]);

  const deleteReview = useCallback(async (reviewId) => {
    const res = await apiDeleteReview(reviewId);
    if (!res.ok) { showToast(res.msg || 'Gagal hapus review'); return; }
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    showToast('Review dihapus');
  }, [showToast]);

  const addProduct = useCallback(async (product) => {
    const res = await createProduct(product);
    if (!res.ok) { showToast(res.msg || 'Gagal tambah produk'); return { ok: false }; }
    setAllProducts((prev) => [res.data, ...prev]);
    showToast('Produk berhasil ditambahkan! ✅');
    return { ok: true, product: res.data };
  }, [showToast]);

  const editProduct = useCallback(async (id, updates) => {
    const res = await updateProduct(id, updates);
    if (!res.ok) { showToast(res.msg || 'Gagal update produk'); return; }
    setAllProducts((prev) => prev.map((p) => String(p.id) === String(id) ? res.data : p));
    showToast('Produk berhasil diupdate! ✅');
  }, [showToast]);

  const removeProduct = useCallback(async (id) => {
    const res = await deleteProduct(id);
    if (!res.ok) { showToast(res.msg || 'Gagal hapus produk'); return; }
    setAllProducts((prev) => prev.filter((p) => String(p.id) !== String(id)));
    showToast('Produk dihapus 🗑️');
  }, [showToast]);

  const handleSearch = useCallback((query) => {
    const q = query.toLowerCase();
    const results = allProducts.filter((p) =>
      p.name?.toLowerCase().includes(q) ||
      p.brand?.toLowerCase().includes(q) ||
      p.type?.toLowerCase().includes(q)
    );
    setSearchQuery(query);
    setSearchResults(results);
    navigate('search');
  }, [navigate, allProducts]);

  const handleShop = useCallback((shopUrl) => {
    if (!isLoggedIn) { navigate('auth'); showToast('Login untuk melanjutkan pembelian'); return; }
    if (shopUrl) { showToast('Membuka toko resmi... 🛒'); window.open(shopUrl, '_blank', 'noopener,noreferrer'); }
    else showToast('Link toko tidak tersedia');
  }, [isLoggedIn, navigate, showToast]);

  const productsByCategory = (cat) => allProducts.filter((p) => (p.cat || p.category) === cat);

  // Ambil 2 produk dari tiap kategori agar popular items merata
  const popularProducts = (() => {
    const categories = ['top', 'bottom', 'shoes'];
    const result = [];
    for (const cat of categories) {
      const items = allProducts.filter(p => (p.cat || p.category) === cat).slice(0, 1);
      result.push(...items);
    }
    // Kalau kurang dari 6, tambah dari produk lain
    if (result.length < 3) {
      const ids = new Set(result.map(p => p.id));
      const extras = allProducts.filter(p => !ids.has(p.id)).slice(0, 3 - result.length);
      result.push(...extras);
    }
    return result;
  })();

  const selectedProduct    = selectedProductId ? allProducts.find((p) => String(p.id) === String(selectedProductId)) : null;
  const favProducts        = allProducts.filter((p) => favorites.includes(p.id));
  const cardProps          = { favorites, onFav: toggleFav, onOpenDetail: openDetail };
  const hideNavbar         = currentPage === 'auth' || currentPage === 'admin';

  return (
    <>
      {!hideNavbar && (
        <Navbar
          activePage={currentPage}
          onNavigate={navigate}
          isLoggedIn={isLoggedIn}
          onSearch={handleSearch}
          favCount={favorites.length}
          onLogout={handleLogout}
        />
      )}

      {currentPage === 'home'    && <HomePage popularProducts={popularProducts} loading={loadingProducts} {...cardProps} onNavigate={navigate} />}
      {currentPage === 'top'     && <CategoryPage categoryLabel="Top"    products={productsByCategory('top')}    {...cardProps} />}
      {currentPage === 'bottom'  && <CategoryPage categoryLabel="Bottom" products={productsByCategory('bottom')} {...cardProps} />}
      {currentPage === 'shoes'   && <CategoryPage categoryLabel="Shoes"  products={productsByCategory('shoes')}  {...cardProps} />}
      {currentPage === 'detail'  && (
        <DetailPage
          product={selectedProduct}
          isFav={favorites.includes(selectedProductId)}
          onFav={toggleFav}
          onBack={goBack}
          onShop={() => handleShop(selectedProduct?.shopUrl || selectedProduct?.shop_url)}
          reviews={reviews}
          currentUser={currentUser}
          isLoggedIn={isLoggedIn}
          onSubmitReview={(rating, comment) => submitReview(selectedProductId, rating, comment)}
          onDeleteReview={deleteReview}
        />
      )}
      {currentPage === 'auth'      && <AuthPage onLogin={handleLogin} onRegister={handleRegister} onForgotPassword={handleForgotPassword} />}
      {currentPage === 'favorites' && <FavoritesPage favProducts={favProducts} favorites={favorites} onFav={toggleFav} onOpenDetail={openDetail} onClearAll={clearAllFavorites} />}
      {currentPage === 'search'    && <SearchPage query={searchQuery} results={searchResults} {...cardProps} />}
      {currentPage === 'contact'   && <ContactPage />}
      {currentPage === 'admin'     && (
        <AdminPage
          onNavigate={navigate}
          onLogout={handleLogout}
          currentUser={currentUser}
          reviews={reviews}
          allProducts={allProducts}
          onDeleteReview={deleteReview}
          customProducts={allProducts}
          onAddProduct={addProduct}
          onUpdateProduct={editProduct}
          onDeleteProduct={removeProduct}
        />
      )}

      <Toast msg={toast.msg} visible={toast.visible} />
    </>
  );
}