import React, { useState } from 'react';
import Footer from '../components/Footer';
import ReviewSection from '../components/ReviewSection';

const styles = {
  page: {
    paddingTop: 60,
    minHeight: '100vh',
    background: '#fff',
    fontFamily: "'DM Sans', sans-serif",
  },
  backWrap: {
    padding: '24px 40px 0',
    background: '#fff',
  },
  backBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 14,
    color: '#555',
    cursor: 'pointer',
    border: 'none',
    background: 'none',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'color .2s',
    padding: 0,
  },
  wrap: {
    maxWidth: 1100,
    margin: '0 auto',
    padding: '40px 40px 60px',
    display: 'grid',
    gridTemplateColumns: '1fr 380px',
    gap: 48,
  },
  // Galeri: 1 foto besar di atas, 3 thumbnail di bawah
  gallery: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  mainImgWrap: {
    width: '100%',
    background: '#f5f5f5',
    borderRadius: 10,
    overflow: 'hidden',
    aspectRatio: '16/9',
  },
  mainImg: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    display: 'block',
    // Tidak ada cursor pointer, tidak bisa di-klik untuk diperbesar
    cursor: 'default',
    userSelect: 'none',
    pointerEvents: 'none',
  },
  thumbnailRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 8,
  },
  thumbWrap: {
    background: '#f5f5f5',
    borderRadius: 8,
    overflow: 'hidden',
    aspectRatio: '4/3',
    cursor: 'pointer',
    transition: 'outline .1s',
  },
  thumbImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
    transition: 'opacity .2s',
    userSelect: 'none',
    // Tidak ada cursor pointer dan tidak bisa di-klik untuk diperbesar
    pointerEvents: 'none',
  },
  infoPanel: {
    position: 'sticky',
    top: 80,
    alignSelf: 'start',
  },
  productName: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 8,
    lineHeight: 1.3,
    color: '#111',
  },
  price: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    fontWeight: 500,
  },
  sectionLabel: {
    fontWeight: 700,
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    color: '#111',
  },
  desc: {
    fontSize: 14,
    lineHeight: 1.75,
    color: '#555',
    marginBottom: 20,
  },
  specList: {
    listStyle: 'none',
    marginBottom: 28,
    padding: 0,
  },
  specItem: {
    fontSize: 14,
    color: '#555',
    padding: '6px 0',
    borderBottom: '1px solid #e8e8e8',
    display: 'flex',
    justifyContent: 'space-between',
  },
  specKey: {
    fontWeight: 600,
    color: '#111',
  },
  shopBtn: {
    width: '100%',
    padding: 16,
    background: '#1a5276',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: 15,
    fontWeight: 700,
    letterSpacing: 1,
    textTransform: 'uppercase',
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'background .2s',
    marginBottom: 12,
  },
  favBtn: {
    width: '100%',
    padding: '12px 16px',
    background: '#fff',
    border: '1.5px solid #e8e8e8',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    transition: 'all .2s',
  },
};

export default function DetailPage({ product, isFav, onFav, onBack, onShop, reviews, currentUser, isLoggedIn, onSubmitReview, onDeleteReview, onGoLogin }) {
  const [activeImg, setActiveImg] = useState(0);
  const [shopHovered, setShopHovered] = useState(false);

  if (!product) return null;

  // Selalu tepat 4 foto
  const rawImages = product.images || [product.img];
  const images = Array.from({ length: 4 }, (_, i) => rawImages[i] || rawImages[rawImages.length - 1] || product.img);

  // Foto aktif = images[activeImg]
  // Thumbnail = 3 foto lainnya (bukan yang aktif)
  const thumbIndices = [0, 1, 2, 3].filter(i => i !== activeImg);

  return (
    <div style={styles.page}>
      {/* Tombol Kembali */}
      <div style={styles.backWrap}>
        <button
          style={styles.backBtn}
          onClick={onBack}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#111')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#555')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Kembali
        </button>
      </div>

      <div style={styles.wrap}>
        {/* Galeri Foto — tidak bisa diperbesar */}
        <div style={styles.gallery}>
          {/* Foto utama — besar, tidak bisa diklik/diperbesar */}
          <div style={styles.mainImgWrap}>
            <img
              src={images[activeImg]}
              alt={product.name}
              style={styles.mainImg}
              draggable={false}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/800x450/f5f5f5/999?text=Produk';
              }}
            />
          </div>

          {/* 3 thumbnail — bisa diklik hanya untuk ganti foto aktif, tidak diperbesar */}
          <div style={styles.thumbnailRow}>
            {thumbIndices.map((imgIdx) => (
              <div
                key={imgIdx}
                style={{
                  ...styles.thumbWrap,
                  outline: activeImg === imgIdx ? '2px solid #1a5276' : '2px solid transparent',
                }}
                onClick={() => setActiveImg(imgIdx)}
              >
                <img
                  src={images[imgIdx]}
                  alt={`${product.name} foto ${imgIdx + 1}`}
                  style={{
                    ...styles.thumbImg,
                    opacity: activeImg === imgIdx ? 1 : 0.72,
                  }}
                  draggable={false}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300/f5f5f5/999?text=Produk';
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Info Panel */}
        <div style={styles.infoPanel}>
          <h1 style={styles.productName}>{product.name}</h1>
          <p style={styles.price}>{product.price}</p>

          <p style={styles.sectionLabel}>Tentang Produk</p>
          <p style={styles.desc}>{product.desc}</p>

          <p style={styles.sectionLabel}>Spesifikasi</p>
          <ul style={styles.specList}>
            {(product.specs || [
              { k: 'Brand', v: product.brand },
              { k: 'Kategori', v: product.type },
              { k: 'Warna', v: product.color },
            ]).map((s, i) => (
              <li key={i} style={styles.specItem}>
                <span style={styles.specKey}>{s.k}</span>
                <span>{s.v}</span>
              </li>
            ))}
          </ul>

          <button
            style={{
              ...styles.shopBtn,
              background: shopHovered ? '#154360' : '#1a5276',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
            onMouseEnter={() => setShopHovered(true)}
            onMouseLeave={() => setShopHovered(false)}
            onClick={onShop}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            Shop
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.75 }}>
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </button>

          <button
            style={{
              ...styles.favBtn,
              color: isFav ? '#e74c3c' : '#111',
              borderColor: isFav ? '#e74c3c' : '#e8e8e8',
            }}
            onClick={() => onFav(product.id)}
          >
            {isFav ? '❤️ Hapus dari Favorit' : '🤍 Tambah ke Favorit'}
          </button>
        </div>
      </div>

      {/* ── Review Section ── */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 40px 60px' }}>
        <ReviewSection
          reviews={reviews || []}
          currentUser={currentUser}
          isLoggedIn={isLoggedIn}
          onSubmitReview={onSubmitReview}
          onDeleteReview={onDeleteReview}
          onGoLogin={onGoLogin}
        />
      </div>

      <Footer />
    </div>
  );
}
