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
  label: {
    textAlign: 'center',
    marginBottom: 24,
    fontSize: 14,
    color: '#555',
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
    padding: '60px 40px',
    color: '#999',
    fontSize: 16,
  },
};

export default function SearchPage({ query, results, favorites, onFav, onOpenDetail }) {
  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Hasil Pencarian</h1>
      </div>
      <div style={styles.section}>
        <p style={styles.label}>
          {results.length} produk ditemukan untuk "{query}"
        </p>
        {results.length === 0 ? (
          <div style={styles.emptyState}>
            Tidak ada produk yang cocok dengan "{query}".
          </div>
        ) : (
          <div style={styles.productGrid}>
            {results.map((p) => (
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
    </div>
  );
}
