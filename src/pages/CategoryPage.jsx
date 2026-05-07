import React from 'react';
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
  title: {
    fontFamily: "'Bebas Neue', cursive",
    fontSize: 56,
    letterSpacing: 3,
    textAlign: 'center',
    color: '#111',
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
};

// categoryLabel: "Top" | "Bottom" | "Shoes"
// products: array produk sesuai kategori
export default function CategoryPage({ categoryLabel, products, favorites, onFav, onOpenDetail }) {
  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>{categoryLabel}</h1>
      </div>
      <div style={styles.section}>
        <div style={styles.productGrid}>
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              isFav={favorites.includes(p.id)}
              onFav={onFav}
              onClick={onOpenDetail}
            />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
