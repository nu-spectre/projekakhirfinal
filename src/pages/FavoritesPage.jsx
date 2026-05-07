import React, { useState } from 'react';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';

const styles = {
  page: {
    paddingTop: 60,
    minHeight: '100vh',
    background: '#f5f5f5',
    fontFamily: "'DM Sans', sans-serif",
  },
  header: {
    background: '#f5f5f5',
    padding: '48px 40px 28px',
    borderBottom: '1px solid #e8e8e8',
  },
  headerInner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    maxWidth: 1100,
    margin: '0 auto',
  },
  title: {
    fontFamily: "'Bebas Neue', cursive",
    fontSize: 56,
    letterSpacing: 3,
    textAlign: 'center',
    color: '#111',
  },
  clearBtn: {
    position: 'absolute',
    right: 0,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 18px',
    background: '#fff',
    color: '#e74c3c',
    border: '1.5px solid #e74c3c',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'all .2s',
  },
  section: {
    padding: '40px 40px 60px',
  },
  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 24,
    maxWidth: 1100,
    margin: '0 auto',
  },
  emptyState: {
    textAlign: 'center',
    padding: '80px 40px',
  },
  emptyIcon: {
    width: 80,
    height: 80,
    color: '#e8e8e8',
    margin: '0 auto 16px',
    display: 'block',
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
    lineHeight: 1.6,
  },
  // Dialog konfirmasi
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.45)',
    zIndex: 2000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialog: {
    background: '#fff',
    borderRadius: 16,
    padding: '36px 40px',
    width: 380,
    boxShadow: '0 16px 60px rgba(0,0,0,.2)',
    textAlign: 'center',
    fontFamily: "'DM Sans', sans-serif",
  },
  dialogIcon: {
    width: 56,
    height: 56,
    background: '#fff5f5',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: '#111',
    marginBottom: 8,
  },
  dialogText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 1.6,
    marginBottom: 28,
  },
  dialogBtns: {
    display: 'flex',
    gap: 12,
  },
  dialogBtnCancel: {
    flex: 1,
    padding: '12px 0',
    border: '1.5px solid #e8e8e8',
    borderRadius: 8,
    background: '#fff',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    color: '#555',
    transition: 'background .15s',
  },
  dialogBtnConfirm: {
    flex: 1,
    padding: '12px 0',
    border: 'none',
    borderRadius: 8,
    background: '#e74c3c',
    color: '#fff',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'background .15s',
  },
};

export default function FavoritesPage({ favProducts, favorites, onFav, onOpenDetail, onClearAll }) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleConfirmClear = () => {
    setShowConfirm(false);
    onClearAll();
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div style={styles.headerInner}>
          <h1 style={styles.title}>Favorit</h1>

          {/* Tombol Hapus Semua — hanya tampil jika ada produk */}
          {favProducts.length > 0 && (
            <button
              style={styles.clearBtn}
              onClick={() => setShowConfirm(true)}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#e74c3c';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#fff';
                e.currentTarget.style.color = '#e74c3c';
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4h6v2" />
              </svg>
              Hapus Semua
            </button>
          )}
        </div>
      </div>

      <div style={styles.section}>
        {favProducts.length === 0 ? (
          <div style={styles.emptyState}>
            <svg
              style={styles.emptyIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <p style={styles.emptyText}>
              Belum ada produk favorit.
              <br />
              Klik ❤ pada produk untuk menyimpan.
            </p>
          </div>
        ) : (
          <div style={styles.productGrid}>
            {favProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                isFav={favorites.includes(p.id)}
                onFav={onFav}
                onClick={onOpenDetail}
              />
            ))}
          </div>
        )}
      </div>

      <Footer />

      {/* Dialog Konfirmasi Hapus Semua */}
      {showConfirm && (
        <div style={styles.overlay} onClick={() => setShowConfirm(false)}>
          <div style={styles.dialog} onClick={(e) => e.stopPropagation()}>
            <div style={styles.dialogIcon}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" strokeWidth="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4h6v2" />
              </svg>
            </div>
            <div style={styles.dialogTitle}>Hapus Semua Favorit?</div>
            <p style={styles.dialogText}>
              Semua {favProducts.length} produk di daftar favorit akan dihapus.
              Tindakan ini tidak dapat dibatalkan.
            </p>
            <div style={styles.dialogBtns}>
              <button
                style={styles.dialogBtnCancel}
                onClick={() => setShowConfirm(false)}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#f5f5f5')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}
              >
                Batal
              </button>
              <button
                style={styles.dialogBtnConfirm}
                onClick={handleConfirmClear}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#c0392b')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#e74c3c')}
              >
                Ya, Hapus Semua
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
