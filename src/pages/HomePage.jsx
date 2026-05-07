import React, { useState } from 'react';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import { HERO_MEDIA, HOME_COLLAGE_IMAGES } from '../data/products';

const styles = {
  page: {
    paddingTop: 60,
    minHeight: '100vh',
    fontFamily: "'DM Sans', sans-serif",
  },
  hero: {
    position: 'relative',
    height: 480,
    overflow: 'hidden',
    background: '#111',
    display: 'flex',
    alignItems: 'center',
  },
  heroBgMedia: {
    position: 'absolute',
    inset: 0,
    objectFit: 'cover',
    width: '100%',
    height: '100%',
    opacity: 0.55,
    filter: 'saturate(0.8)',
  },
  // Wrapper khusus untuk YouTube iframe — sembunyikan UI YouTube sepenuhnya
  youtubeWrapper: {
    position: 'absolute',
    // Perluas jauh keluar dari batas kontainer agar tidak ada chrome YouTube terlihat
    top: '-60px',
    left: '-60px',
    right: '-60px',
    bottom: '-60px',
    pointerEvents: 'none',
    overflow: 'hidden',
    opacity: 0.55,
    filter: 'saturate(0.8)',
  },
  youtubeIframe: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    border: 'none',
    pointerEvents: 'none',
  },
  heroContent: {
    position: 'relative',
    zIndex: 2,
    maxWidth: 680,
    margin: '0 auto',
    padding: '0 40px',
    textAlign: 'center',
    color: '#fff',
  },
  heroTitle: {
    fontFamily: "'Bebas Neue', cursive",
    fontSize: 52,
    letterSpacing: 3,
    lineHeight: 1.1,
    marginBottom: 16,
    textShadow: '0 2px 20px rgba(0,0,0,.5)',
  },
  heroText: {
    fontSize: 15,
    fontWeight: 400,
    lineHeight: 1.7,
    opacity: 0.9,
  },
  heroCta: {
    marginTop: 28,
    display: 'inline-block',
    padding: '14px 40px',
    background: '#fff',
    color: '#111',
    fontWeight: 700,
    fontSize: 14,
    letterSpacing: 1,
    textTransform: 'uppercase',
    borderRadius: 4,
    cursor: 'pointer',
    border: 'none',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'all .2s',
  },
  popularSection: {
    padding: '60px 40px',
    background: '#fff',
  },
  sectionTitle: {
    fontFamily: "'Bebas Neue', cursive",
    fontSize: 40,
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 40,
    color: '#111',
  },
  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 24,
    maxWidth: 1100,
    margin: '0 auto',
  },
  collage: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridTemplateRows: '280px 280px',
    gap: 4,
  },
  collageItem: { overflow: 'hidden' },
  collageImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform .4s',
    display: 'block',
  },
};

function isVideoFile(url) {
  return /\.(mp4|webm|ogg|mov|m4v)(\?|$)/i.test(url);
}

function isYouTube(url) {
  return /youtube\.com|youtu\.be/i.test(url);
}

function isVimeo(url) {
  return /vimeo\.com/i.test(url);
}

// Konversi URL YouTube biasa ke embed URL yang bersih (tanpa UI)
function toYouTubeEmbed(url) {
  // Sudah embed — pastikan parameter yang tepat
  if (url.includes('youtube.com/embed/')) {
    const base = url.split('?')[0];
    return base + '?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&disablekb=1&fs=0&playlist=' + base.split('/embed/')[1];
  }
  // URL biasa: youtube.com/watch?v=ID atau youtu.be/ID
  let videoId = '';
  const watchMatch = url.match(/[?&]v=([^&#]+)/);
  const shortMatch = url.match(/youtu\.be\/([^?&#]+)/);
  if (watchMatch) videoId = watchMatch[1];
  else if (shortMatch) videoId = shortMatch[1];
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&disablekb=1&fs=0&playlist=${videoId}`;
  }
  return url;
}

function toVimeoEmbed(url) {
  if (url.includes('player.vimeo.com/video/')) return url + '?autoplay=1&muted=1&loop=1&background=1';
  const match = url.match(/vimeo\.com\/(\d+)/);
  if (match) return `https://player.vimeo.com/video/${match[1]}?autoplay=1&muted=1&loop=1&background=1`;
  return url;
}

export default function HomePage({ popularProducts, favorites, onFav, onOpenDetail, onNavigate }) {
  const [ctaHovered, setCtaHovered] = useState(false);
  const [hoveredCollage, setHoveredCollage] = useState(null);

  const mediaUrl = typeof HERO_MEDIA === 'string' ? HERO_MEDIA : HERO_MEDIA?.url;
  const forceType = typeof HERO_MEDIA === 'object' ? HERO_MEDIA?.type : null;

  const renderHeroMedia = () => {
    const type = forceType || (
      isYouTube(mediaUrl) ? 'youtube' :
      isVimeo(mediaUrl) ? 'vimeo' :
      isVideoFile(mediaUrl) ? 'video' : 'image'
    );

    if (type === 'youtube') {
      const embedUrl = toYouTubeEmbed(mediaUrl);
      return (
        // Wrapper oversized: potong chrome YouTube di semua sisi
        <div style={styles.youtubeWrapper}>
          <iframe
            style={{
              ...styles.youtubeIframe,
              // Perluas iframe 2x ukuran kontainer agar bar YouTube tidak terlihat
              top: '-50%',
              left: '-50%',
              width: '200%',
              height: '200%',
            }}
            src={embedUrl}
            allow="autoplay; encrypted-media"
            allowFullScreen={false}
            title="Hero background video"
          />
        </div>
      );
    }

    if (type === 'vimeo') {
      const embedUrl = toVimeoEmbed(mediaUrl);
      return (
        <div style={styles.youtubeWrapper}>
          <iframe
            style={{ ...styles.youtubeIframe, top: '-50%', left: '-50%', width: '200%', height: '200%' }}
            src={embedUrl}
            allow="autoplay; muted"
            allowFullScreen={false}
            title="Hero background video"
          />
        </div>
      );
    }

    if (type === 'video') {
      return (
        <video
          style={styles.heroBgMedia}
          src={mediaUrl}
          autoPlay
          muted
          loop
          playsInline
          onError={(e) => (e.target.style.display = 'none')}
        />
      );
    }

    // Default: gambar
    return (
      <img
        style={styles.heroBgMedia}
        src={mediaUrl}
        alt="Sportiva Hero"
        onError={(e) => (e.target.style.display = 'none')}
      />
    );
  };

  return (
    <div style={styles.page}>
      {/* Hero */}
      <div style={styles.hero}>
        {renderHeroMedia()}
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>
            PUSH YOUR LIMITS AND DISCOVER THE BEST VERSION OF YOURSELF
          </h1>
          <p style={styles.heroText}>
            Kami hadir dengan rekomendasi perlengkapan olahraga berkualitas tinggi untuk
            menemani setiap langkah perjalananmu menuju kemenangan.
          </p>
          <button
            style={{
              ...styles.heroCta,
              background: ctaHovered ? '#1a5276' : '#fff',
              color: ctaHovered ? '#fff' : '#111',
            }}
            onMouseEnter={() => setCtaHovered(true)}
            onMouseLeave={() => setCtaHovered(false)}
            onClick={() => onNavigate('top')}
          >
            Lihat Produk
          </button>
        </div>
      </div>

      {/* Popular Items */}
      <div style={styles.popularSection}>
        <h2 style={styles.sectionTitle}>Popular Item</h2>
        <div style={styles.productGrid}>
          {popularProducts.map((p) => (
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

      {/* Kolase Gambar */}
      <div style={styles.collage}>
        {HOME_COLLAGE_IMAGES.map((img, i) => (
          <div
            key={i}
            style={styles.collageItem}
            onMouseEnter={() => setHoveredCollage(i)}
            onMouseLeave={() => setHoveredCollage(null)}
          >
            <img
              src={img.url}
              alt={img.alt}
              style={{
                ...styles.collageImg,
                transform: hoveredCollage === i ? 'scale(1.04)' : 'scale(1)',
              }}
            />
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
}
