import React, { useState, useCallback } from 'react';

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

// Data
import { PRODUCTS, ALL_PRODUCTS, POPULAR_IDS } from './data/products';

// localStorage helpers
const LS = {
  get: (key, fallback = null) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } },
  set: (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} },
};

const FAV_KEY     = (u) => `sportiva_favs_${u}`;
const ACCOUNTS_KEY = 'sportiva_accounts';
const REVIEWS_KEY  = 'sportiva_reviews';
const CUSTOM_PRODUCTS_KEY = 'sportiva_custom_products';

// Seed default admin account
(function seedAccounts() {
  const existing = LS.get(ACCOUNTS_KEY, {});
  if (!existing['admin@sportiva.com']) {
    existing['admin@sportiva.com'] = { password: 'admin123', name: 'Admin' };
  }
  if (!existing['wisnu@sportiva.com']) {
    existing['wisnu@sportiva.com'] = { password: 'admin123', name: 'Wisnu' };
  }
  LS.set(ACCOUNTS_KEY, existing);
})();

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
  const [reviews, setReviews]                     = useState(() => LS.get(REVIEWS_KEY, []));
  const [customProducts, setCustomProducts]         = useState(() => LS.get(CUSTOM_PRODUCTS_KEY, []));

  const showToast = useCallback((msg) => {
    setToast({ msg, visible: true });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2500);
  }, []);

  const syncCustomProducts = (next) => { setCustomProducts(next); LS.set(CUSTOM_PRODUCTS_KEY, next); };

  const addCustomProduct = useCallback((product) => {
    const newProduct = { ...product, id: 'custom_' + Date.now(), isCustom: true };
    setCustomProducts((prev) => {
      const next = [...prev, newProduct];
      LS.set(CUSTOM_PRODUCTS_KEY, next);
      return next;
    });
    showToast('Produk berhasil ditambahkan! ✅');
    return { ok: true, product: newProduct };
  }, [showToast]);

  const updateCustomProduct = useCallback((id, updates) => {
    setCustomProducts((prev) => {
      const next = prev.map((p) => p.id === id ? { ...p, ...updates } : p);
      LS.set(CUSTOM_PRODUCTS_KEY, next);
      return next;
    });
    showToast('Produk berhasil diupdate! ✅');
  }, [showToast]);

  const deleteCustomProduct = useCallback((id) => {
    setCustomProducts((prev) => {
      const next = prev.filter((p) => p.id !== id);
      LS.set(CUSTOM_PRODUCTS_KEY, next);
      return next;
    });
    showToast('Produk dihapus 🗑️');
  }, [showToast]);

  const syncReviews = (next) => { setReviews(next); LS.set(REVIEWS_KEY, next); };

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
  }, [currentPage]);

  const goBack = useCallback(() => {
    navigate(prevPage === 'detail' ? 'home' : prevPage);
  }, [navigate, prevPage]);

  const toggleFav = useCallback((productId) => {
    if (!isLoggedIn) { navigate('auth'); showToast('Login dulu untuk menyimpan favorit'); return; }
    setFavorites((prev) => {
      const next = prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId];
      LS.set(FAV_KEY(currentUser.email), next);
      showToast(prev.includes(productId) ? 'Dihapus dari favorit' : 'Ditambahkan ke favorit ❤️');
      return next;
    });
  }, [isLoggedIn, navigate, showToast, currentUser]);

  const clearAllFavorites = useCallback(() => {
    setFavorites([]);
    LS.set(FAV_KEY(currentUser?.email), []);
    showToast('Semua favorit telah dihapus 🗑️');
  }, [currentUser, showToast]);

  const handleLogin = useCallback((email, password) => {
    const accounts = LS.get(ACCOUNTS_KEY, {});
    const acc = accounts[email.toLowerCase()];
    if (!acc) return { ok: false, msg: 'Email tidak terdaftar' };
    if (acc.password !== password) return { ok: false, msg: 'Password salah' };
    const user = { email: email.toLowerCase(), name: acc.name };
    setCurrentUser(user);
    setIsLoggedIn(true);
    setFavorites(LS.get(FAV_KEY(user.email), []));
    showToast(`Selamat datang, ${acc.name}! 🎉`);
    setTimeout(() => navigate('home'), 600);
    return { ok: true };
  }, [navigate, showToast]);

  const handleRegister = useCallback((email, password, name) => {
    const accounts = LS.get(ACCOUNTS_KEY, {});
    if (accounts[email.toLowerCase()]) return { ok: false, msg: 'Email sudah terdaftar' };
    accounts[email.toLowerCase()] = { password, name };
    LS.set(ACCOUNTS_KEY, accounts);
    return { ok: true };
  }, []);

  const handleForgotPassword = useCallback((email, newPassword) => {
    const accounts = LS.get(ACCOUNTS_KEY, {});
    if (!accounts[email.toLowerCase()]) return { ok: false, msg: 'Email tidak terdaftar' };
    accounts[email.toLowerCase()].password = newPassword;
    LS.set(ACCOUNTS_KEY, accounts);
    return { ok: true };
  }, []);

  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setFavorites([]);
    showToast('Berhasil logout 👋');
    navigate('home');
  }, [navigate, showToast]);

  const submitReview = useCallback((productId, rating, comment) => {
    if (!isLoggedIn) { navigate('auth'); showToast('Login dulu untuk memberi review'); return { ok: false }; }
    const existing = reviews.find((r) => r.productId === productId && r.userEmail === currentUser.email);
    if (existing) return { ok: false, msg: 'Kamu sudah memberikan review untuk produk ini' };
    const newReview = {
      id: Date.now().toString(),
      productId,
      userEmail: currentUser.email,
      userName: currentUser.name,
      rating,
      comment: comment.trim(),
      date: new Date().toISOString(),
    };
    syncReviews([...reviews, newReview]);
    showToast('Review berhasil dikirim! ⭐');
    return { ok: true };
  }, [isLoggedIn, navigate, showToast, reviews, currentUser]);

  const deleteReview = useCallback((reviewId) => {
    syncReviews(reviews.filter((r) => r.id !== reviewId));
    showToast('Review dihapus');
  }, [reviews]);

  const handleSearch = useCallback((query) => {
    const q = query.toLowerCase();
    const allProds = [...ALL_PRODUCTS, ...customProducts];
    const results = allProds.filter((p) =>
      p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.type.toLowerCase().includes(q)
    );
    setSearchQuery(query);
    setSearchResults(results);
    navigate('search');
  }, [navigate, customProducts]);

  const handleShop = useCallback((shopUrl) => {
    if (!isLoggedIn) { navigate('auth'); showToast('Login untuk melanjutkan pembelian'); return; }
    if (shopUrl) { showToast('Membuka toko resmi... 🛒'); window.open(shopUrl, '_blank', 'noopener,noreferrer'); }
    else showToast('Link toko tidak tersedia');
  }, [isLoggedIn, navigate, showToast]);

  const mergedAllProducts   = [...ALL_PRODUCTS, ...customProducts];
  const popularProducts     = POPULAR_IDS.map((id) => mergedAllProducts.find((p) => p.id === id)).filter(Boolean);
  const selectedProduct     = selectedProductId ? mergedAllProducts.find((p) => p.id === selectedProductId) : null;
  const favProducts         = mergedAllProducts.filter((p) => favorites.includes(p.id));
  const cardProps           = { favorites, onFav: toggleFav, onOpenDetail: openDetail };
  const hideNavbar      = currentPage === 'auth' || currentPage === 'admin';

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

      {currentPage === 'home'      && <HomePage popularProducts={popularProducts} {...cardProps} onNavigate={navigate} />}
      {currentPage === 'top'       && <CategoryPage categoryLabel="Top"    products={[...PRODUCTS.top,    ...customProducts.filter(p => p.category === 'top')]}    {...cardProps} />}
      {currentPage === 'bottom'    && <CategoryPage categoryLabel="Bottom" products={[...PRODUCTS.bottom, ...customProducts.filter(p => p.category === 'bottom')]} {...cardProps} />}
      {currentPage === 'shoes'     && <CategoryPage categoryLabel="Shoes"  products={[...PRODUCTS.shoes,  ...customProducts.filter(p => p.category === 'shoes')]}  {...cardProps} />}
      {currentPage === 'detail'    && (
        <DetailPage
          product={selectedProduct}
          isFav={favorites.includes(selectedProductId)}
          onFav={toggleFav}
          onBack={goBack}
          onShop={() => handleShop(selectedProduct?.shopUrl)}
          reviews={reviews.filter((r) => r.productId === selectedProductId)}
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
          allProducts={mergedAllProducts}
          onDeleteReview={deleteReview}
          customProducts={customProducts}
          onAddProduct={addCustomProduct}
          onUpdateProduct={updateCustomProduct}
          onDeleteProduct={deleteCustomProduct}
        />
      )}

      <Toast msg={toast.msg} visible={toast.visible} />
    </>
  );
}
