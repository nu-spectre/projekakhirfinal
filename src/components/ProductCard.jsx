import React from 'react';

const styles = {
  card: {
    background: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'transform .25s, box-shadow .25s',
    border: '1.5px solid #e8e8e8',
    position: 'relative',
  },
  imgWrap: {
    aspectRatio: '4/3',
    background: '#f5f5f5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  img: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    padding: 12,
    transition: 'transform .3s',
  },
  favBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 5,
    background: '#fff',
    border: 'none',
    width: 32,
    height: 32,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,.15)',
    transition: 'transform .2s',
    fontSize: 16,
  },
  info: {
    padding: '14px 16px 18px',
  },
  name: {
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 6,
    lineHeight: 1.3,
    color: '#111',
  },
  price: {
    fontSize: 13,
    color: '#555',
    fontWeight: 500,
  },
};

export default function ProductCard({ product, isFav, onFav, onClick }) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <div
      style={{
        ...styles.card,
        transform: hovered ? 'translateY(-4px)' : 'none',
        boxShadow: hovered ? '0 12px 40px rgba(0,0,0,.1)' : 'none',
      }}
      onClick={() => onClick(product.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={styles.imgWrap}>
        <img
          src={product.img}
          alt={product.name}
          loading="lazy"
          style={{
            ...styles.img,
            transform: hovered ? 'scale(1.04)' : 'scale(1)',
          }}
          onError={(e) => {
            e.target.src =
              'https://via.placeholder.com/400x300/f5f5f5/999?text=Produk';
          }}
        />
        {/* Tombol Favorit */}
        <button
          style={styles.favBtn}
          onClick={(e) => {
            e.stopPropagation();
            onFav(product.id);
          }}
          title={isFav ? 'Hapus dari favorit' : 'Tambah ke favorit'}
        >
          {isFav ? '❤️' : '🤍'}
        </button>
      </div>
      <div style={styles.info}>
        <h3 style={styles.name}>{product.name}</h3>
        <p style={styles.price}>{product.price}</p>
      </div>
    </div>
  );
}
