import React, { useState, useRef, useEffect } from 'react';

import Logo from '../components/Logo';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../services/productService';

const BRANDS = ['Nike', 'adidas', 'Asics', 'Mizuno'];
const WISNU_EMAIL = 'wisnu@sportiva.com';

// ─── STYLES ──────────────────────────────────────────────────────────────────
const S = {
  page: { display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f7f7f7', fontFamily: "'DM Sans', sans-serif" },

  topBar: { height: 64, background: '#fff', borderBottom: '1px solid #e8e8e8', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', flexShrink: 0 },
  topBarTitle: { fontFamily: "'Bebas Neue', cursive", fontSize: 28, letterSpacing: 2, color: '#111' },
  topBarRight: { display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, fontWeight: 500, color: '#111' },
  adminAvatar: { width: 36, height: 36, borderRadius: '50%', background: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center' },

  body: { display: 'flex', flex: 1, minHeight: 0 },

  sidebar: { width: 240, background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 20px 32px', flexShrink: 0, minHeight: 'calc(100vh - 64px)' },
  avatarCircle: { width: 84, height: 84, borderRadius: '50%', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  adminName: { fontFamily: "'Bebas Neue', cursive", fontSize: 18, letterSpacing: 2, color: '#fff', textAlign: 'center', marginBottom: 4, wordBreak: 'break-all', padding: '0 8px' },
  adminRole: { fontSize: 11, color: '#888', textAlign: 'center', marginBottom: 28 },

  menuBtn: { width: '100%', padding: '12px 16px', borderRadius: 10, border: 'none', background: 'transparent', color: '#aaa', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 10, transition: 'all .18s', textAlign: 'left', marginBottom: 4 },
  menuBtnActive: { background: '#1a5276', color: '#fff' },

  sidebarBottom: { display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: 'auto', paddingTop: 24 },
  sidebarIconBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.7, transition: 'opacity .2s' },

  mainContent: { flex: 1, overflow: 'auto', padding: 28 },

  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 },
  statCard: { background: '#fff', borderRadius: 14, padding: '22px 24px', border: '1.5px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', cursor: 'pointer', transition: 'box-shadow .2s' },
  statNum: { fontFamily: "'Bebas Neue', cursive", fontSize: 48, lineHeight: 1, color: '#111', letterSpacing: -1 },
  statLabel: { fontFamily: "'Bebas Neue', cursive", fontSize: 18, letterSpacing: 1, color: '#555', marginTop: 4 },

  tableWrap: { background: '#fff', borderRadius: 16, border: '1.5px solid #eee', overflow: 'hidden' },
  tableHeader: { display: 'grid', gridTemplateColumns: '2fr 2.5fr 1fr 1fr 80px', gap: 0, background: '#f5f5f5', padding: '12px 20px', fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: '#888', borderBottom: '1px solid #eee' },
  tableRow: { display: 'grid', gridTemplateColumns: '2fr 2.5fr 1fr 1fr 80px', gap: 0, padding: '14px 20px', borderBottom: '1px solid #f0f0f0', alignItems: 'center', transition: 'background .15s' },

  filterBar: { display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' },
  filterBtn: { padding: '7px 16px', borderRadius: 20, border: '1.5px solid #e8e8e8', background: '#fff', fontSize: 13, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontWeight: 600, transition: 'all .18s' },
  filterBtnActive: { background: '#1a5276', color: '#fff', borderColor: '#1a5276' },

  sectionTitle: { fontFamily: "'Bebas Neue', cursive", fontSize: 26, letterSpacing: 1.5, marginBottom: 18, color: '#111' },
  emptyState: { textAlign: 'center', padding: '60px 20px', color: '#bbb' },

  // Form styles
  formCard: { background: '#fff', borderRadius: 16, border: '1.5px solid #eee', padding: 28, marginBottom: 24 },
  formRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 },
  formGroup: { display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 },
  label: { fontSize: 12, fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { padding: '10px 14px', border: '1.5px solid #e8e8e8', borderRadius: 10, fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: 'none', transition: 'border-color .2s' },
  textarea: { padding: '10px 14px', border: '1.5px solid #e8e8e8', borderRadius: 10, fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: 'none', resize: 'vertical', minHeight: 100, transition: 'border-color .2s' },
  select: { padding: '10px 14px', border: '1.5px solid #e8e8e8', borderRadius: 10, fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: 'none', background: '#fff', cursor: 'pointer' },
  btnPrimary: { padding: '11px 24px', background: '#1a5276', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'background .2s' },
  btnDanger: { padding: '8px 16px', background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" },
  btnSecondary: { padding: '8px 16px', background: '#f5f5f5', color: '#333', border: '1.5px solid #e8e8e8', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" },

  // Product card in manage
  productCardGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 },
  productCard: { background: '#fff', borderRadius: 14, border: '1.5px solid #eee', overflow: 'hidden', transition: 'box-shadow .2s' },
  productCardImg: { width: '100%', height: 180, objectFit: 'contain', background: '#f8f8f8', padding: 12 },
  productCardBody: { padding: '14px 16px' },
};

// ─── STAR DISPLAY ─────────────────────────────────────────────────────────────
function Stars({ rating }) {
  return (
    <span style={{ color: '#f4c430', letterSpacing: 1 }}>
      {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
    </span>
  );
}

// ─── STAT CARD ───────────────────────────────────────────────────────────────
function StatCard({ num, label, icon, onClick, accent }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      style={{ ...S.statCard, boxShadow: hov ? '0 6px 24px rgba(0,0,0,.08)' : 'none', cursor: onClick ? 'pointer' : 'default' }}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div>
        <div style={{ ...S.statNum, color: accent || '#111' }}>{num}</div>
        <div style={S.statLabel}>{label}</div>
      </div>
      <div style={{ fontSize: 32, opacity: 0.25 }}>{icon}</div>
    </div>
  );
}

// ─── DASHBOARD TAB ───────────────────────────────────────────────────────────
function DashboardTab({ reviews, allProducts, onNavigate, onSwitchTab, currentUser, customProducts }) {
  const myReviews = reviews.filter((r) => r.userEmail === currentUser?.email);
  const totalReviews = myReviews.length;
  const avgRating = totalReviews ? (myReviews.reduce((s, r) => s + r.rating, 0) / totalReviews).toFixed(1) : '–';

  const shoesCount = allProducts.filter(p => (p.cat || p.category) === 'shoes').length;
  const topCount = allProducts.filter(p => (p.cat || p.category) === 'top').length;
  const bottomCount = allProducts.filter(p => (p.cat || p.category) === 'bottom').length;
  const totalProducts = allProducts.length;

  const recent = [...myReviews].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
  const isWisnu = currentUser?.email === WISNU_EMAIL;

  return (
    <div>
      <div style={S.sectionTitle}>DASHBOARD</div>

      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1, color: '#aaa', textTransform: 'uppercase', marginBottom: 10 }}>PRODUK</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 16 }}>
        <StatCard num={totalProducts} label="TOTAL PRODUK" icon="📦" onClick={() => onNavigate('shoes')} />
        <StatCard num={shoesCount} label="SEPATU" icon="👟" accent="#1a5276" onClick={() => onNavigate('shoes')} />
        <StatCard num={topCount} label="TOP" icon="👕" accent="#2e86c1" onClick={() => onNavigate('top')} />
        <StatCard num={bottomCount} label="BOTTOM" icon="👖" accent="#1abc9c" onClick={() => onNavigate('bottom')} />
      </div>

      {isWisnu && customProducts?.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <StatCard num={customProducts.length} label="PRODUK DITAMBAHKAN" icon="➕" accent="#8e44ad" onClick={() => onSwitchTab('products')} />
        </div>
      )}

      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1, color: '#aaa', textTransform: 'uppercase', marginBottom: 10 }}>ULASAN SAYA</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 28 }}>
        <StatCard num={totalReviews} label="ULASAN SAYA" icon="⭐" accent="#f4c430" onClick={() => onSwitchTab('myreviews')} />
        <StatCard num={avgRating} label="RATA-RATA" icon="📊" accent="#e67e22" />
      </div>

      <div style={S.sectionTitle}>ULASAN TERBARU SAYA</div>
      {recent.length === 0 ? (
        <div style={S.emptyState}><div style={{ fontSize: 40 }}>⭐</div><p>Belum ada ulasan</p></div>
      ) : (
        <div style={S.tableWrap}>
          <div style={S.tableHeader}>
            <span>Produk</span><span>Komentar</span><span>User</span><span>Rating</span><span>Tanggal</span>
          </div>
          {recent.map((r) => {
            const prod = allProducts.find((p) => p.id === r.productId);
            return <ReviewRow key={r.id} review={r} product={prod} />;
          })}
        </div>
      )}
    </div>
  );
}

// ─── REVIEW ROW ──────────────────────────────────────────────────────────────
function ReviewRow({ review, product, onDelete }) {
  const [hov, setHov] = useState(false);
  const dateStr = new Date(review.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: '2-digit' });
  return (
    <div
      style={{ ...S.tableRow, background: hov ? '#fafafa' : '#fff' }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#111', marginBottom: 2 }}>{product?.name || '–'}</div>
        <div style={{ fontSize: 11, color: '#aaa', textTransform: 'uppercase', letterSpacing: 0.5 }}>{product?.cat || ''}</div>
      </div>
      <div style={{ fontSize: 13, color: '#555', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 12 }}>
        {review.comment}
      </div>
      <div style={{ fontSize: 13, color: '#333', fontWeight: 500 }}>{review.userName}</div>
      <div><Stars rating={review.rating} /></div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, color: '#aaa' }}>{dateStr}</span>
        {onDelete && (
          <button
            onClick={() => onDelete(review.id)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ddd', fontSize: 14, padding: '2px 4px', borderRadius: 4, transition: 'color .18s' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#e74c3c')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#ddd')}
            title="Hapus ulasan"
          >✕</button>
        )}
      </div>
    </div>
  );
}

// ─── REVIEWS TAB ─────────────────────────────────────────────────────────────
function ReviewsTab({ reviews, allProducts, onDeleteReview, currentUser }) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const myReviews = reviews.filter((r) => r.userEmail === currentUser?.email);

  const filtered = myReviews.filter((r) => {
    const prod = allProducts.find((p) => p.id === r.productId);
    const matchCat = filter === 'all' || (prod && prod.cat === filter) || (filter === String(r.rating));
    const q = search.toLowerCase();
    const matchSearch = !q || r.userName.toLowerCase().includes(q) || r.comment.toLowerCase().includes(q) || (prod && prod.name.toLowerCase().includes(q));
    return matchCat && matchSearch;
  }).sort((a, b) => new Date(b.date) - new Date(a.date));

  const cats = ['all', 'shoes', 'top', 'bottom', '5', '4', '3', '2', '1'];
  const catLabel = { all: 'Semua', shoes: 'Shoes', top: 'Top', bottom: 'Bottom', '5': '★5', '4': '★4', '3': '★3', '2': '★2', '1': '★1' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
        <div style={S.sectionTitle}>ULASAN SAYA <span style={{ fontSize: 16, color: '#aaa', fontFamily: "'DM Sans'" }}>({filtered.length})</span></div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari ulasan atau produk..."
          style={{ padding: '9px 16px', border: '1.5px solid #e8e8e8', borderRadius: 30, fontSize: 13, width: 260, fontFamily: "'DM Sans', sans-serif", outline: 'none' }}
          onFocus={(e) => (e.target.style.borderColor = '#1a5276')}
          onBlur={(e) => (e.target.style.borderColor = '#e8e8e8')}
        />
      </div>

      <div style={S.filterBar}>
        {cats.map((c) => (
          <button key={c} style={{ ...S.filterBtn, ...(filter === c ? S.filterBtnActive : {}) }} onClick={() => setFilter(c)}>
            {catLabel[c]}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={S.emptyState}><div style={{ fontSize: 40 }}>🔍</div><p>Tidak ada ulasan ditemukan</p></div>
      ) : (
        <div style={S.tableWrap}>
          <div style={S.tableHeader}>
            <span>Produk</span><span>Komentar</span><span>User</span><span>Rating</span><span>Tanggal</span>
          </div>
          {filtered.map((r) => {
            const prod = allProducts.find((p) => p.id === r.productId);
            return <ReviewRow key={r.id} review={r} product={prod} onDelete={onDeleteReview} />;
          })}
        </div>
      )}
    </div>
  );
}

// ─── MY REVIEWS TAB ──────────────────────────────────────────────────────────
function MyReviewsTab({ reviews, allProducts, currentUser, onDeleteReview }) {
  const mine = reviews
    .filter((r) => r.userEmail === currentUser?.email)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div>
      <div style={S.sectionTitle}>
        ULASAN SAYA
        <span style={{ fontSize: 14, fontFamily: "'DM Sans'", fontWeight: 400, color: '#aaa', marginLeft: 10 }}>
          ({mine.length} ulasan)
        </span>
      </div>

      {mine.length === 0 ? (
        <div style={S.emptyState}>
          <div style={{ fontSize: 48 }}>⭐</div>
          <p style={{ marginTop: 12, fontSize: 15 }}>Kamu belum memberikan ulasan apapun.</p>
          <p style={{ fontSize: 13, color: '#ccc', marginTop: 6 }}>Beli produk dan beri ulasan di halaman detail produk.</p>
        </div>
      ) : (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
            <div style={{ background: '#fff', borderRadius: 14, padding: '18px 20px', border: '1.5px solid #eee' }}>
              <div style={{ fontSize: 36, fontFamily: "'Bebas Neue'", color: '#111' }}>{mine.length}</div>
              <div style={{ fontSize: 13, color: '#888', fontWeight: 600 }}>Total Ulasan</div>
            </div>
            <div style={{ background: '#fff', borderRadius: 14, padding: '18px 20px', border: '1.5px solid #eee' }}>
              <div style={{ fontSize: 36, fontFamily: "'Bebas Neue'", color: '#f4c430' }}>
                {(mine.reduce((s, r) => s + r.rating, 0) / mine.length).toFixed(1)}
              </div>
              <div style={{ fontSize: 13, color: '#888', fontWeight: 600 }}>Rata-rata Rating</div>
            </div>
            <div style={{ background: '#fff', borderRadius: 14, padding: '18px 20px', border: '1.5px solid #eee' }}>
              <div style={{ fontSize: 36, fontFamily: "'Bebas Neue'", color: '#1a5276' }}>
                {mine.filter((r) => r.rating >= 4).length}
              </div>
              <div style={{ fontSize: 13, color: '#888', fontWeight: 600 }}>Ulasan Positif (≥4★)</div>
            </div>
          </div>

          {mine.map((r) => {
            const prod = allProducts.find((p) => p.id === r.productId);
            const dateStr = new Date(r.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
            return (
              <div key={r.id} style={{ background: '#fff', borderRadius: 14, padding: '20px 24px', marginBottom: 14, border: '1.5px solid #f0f0f0', display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                <div style={{ width: 72, height: 72, borderRadius: 10, background: '#f5f5f5', overflow: 'hidden', flexShrink: 0 }}>
                  {prod?.img && <img src={prod.img} alt={prod.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 6 }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{prod?.name || 'Produk tidak ditemukan'}</div>
                      <div style={{ fontSize: 11, color: '#aaa', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
                        {prod?.brand} · {prod?.cat}
                      </div>
                    </div>
                    <button
                      onClick={() => onDeleteReview(r.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ddd', fontSize: 16, transition: 'color .2s', padding: 4 }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#e74c3c')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#ddd')}
                      title="Hapus ulasan ini"
                    >✕</button>
                  </div>
                  <div style={{ display: 'flex', gap: 2, marginBottom: 8 }}>
                    {[1,2,3,4,5].map((s) => (
                      <span key={s} style={{ color: s <= r.rating ? '#f4c430' : '#e0e0e0', fontSize: 18 }}>★</span>
                    ))}
                  </div>
                  <p style={{ fontSize: 14, color: '#444', lineHeight: 1.6, marginBottom: 8 }}>{r.comment}</p>
                  <div style={{ fontSize: 12, color: '#bbb' }}>{dateStr}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── IMAGE URL INPUT ─────────────────────────────────────────────────────────
function ImageUrlInput({ label, value, onChange, placeholder }) {
  const [focused, setFocused] = useState(false);
  const [preview, setPreview] = useState(value || '');

  const handleChange = (e) => {
    const val = e.target.value;
    onChange(val);
    setPreview(val);
  };

  return (
    <div style={{ marginBottom: 12 }}>
      <div style={S.label}>{label}</div>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder || 'https://...'}
        style={{ ...S.input, width: '100%', borderColor: focused ? '#1a5276' : '#e8e8e8', boxSizing: 'border-box' }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {preview && (
        <div style={{ marginTop: 8, width: 80, height: 60, background: '#f5f5f5', borderRadius: 8, overflow: 'hidden', border: '1px solid #eee' }}>
          <img
            src={preview}
            alt="preview"
            style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 4 }}
            onError={(e) => { e.target.style.display = 'none'; }}
            onLoad={(e) => { e.target.style.display = 'block'; }}
          />
        </div>
      )}
    </div>
  );
}

// ─── SPEC INPUT ──────────────────────────────────────────────────────────────
function SpecInput({ specs, onChange }) {
  const addSpec = () => onChange([...specs, { k: '', v: '' }]);
  const removeSpec = (i) => onChange(specs.filter((_, idx) => idx !== i));
  const updateSpec = (i, field, val) => {
    const next = specs.map((s, idx) => idx === i ? { ...s, [field]: val } : s);
    onChange(next);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={S.label}>SPESIFIKASI PRODUK</div>
        <button type="button" onClick={addSpec} style={{ ...S.btnSecondary, fontSize: 12, padding: '4px 12px' }}>+ Tambah Spek</button>
      </div>
      {specs.map((s, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 8, marginBottom: 8 }}>
          <input
            placeholder="Nama (cth: Brand)"
            value={s.k}
            onChange={(e) => updateSpec(i, 'k', e.target.value)}
            style={{ ...S.input, borderColor: '#e8e8e8' }}
          />
          <input
            placeholder="Nilai (cth: Nike)"
            value={s.v}
            onChange={(e) => updateSpec(i, 'v', e.target.value)}
            style={{ ...S.input, borderColor: '#e8e8e8' }}
          />
          <button type="button" onClick={() => removeSpec(i)} style={{ padding: '8px 12px', background: '#fee', border: '1px solid #fcc', borderRadius: 8, cursor: 'pointer', color: '#e74c3c', fontSize: 14 }}>✕</button>
        </div>
      ))}
      {specs.length === 0 && <p style={{ fontSize: 13, color: '#bbb' }}>Belum ada spesifikasi. Klik "+ Tambah Spek".</p>}
    </div>
  );
}

// ─── PRODUCT FORM ────────────────────────────────────────────────────────────
const EMPTY_FORM = {
  name: '', price: '', brand: 'Nike', category: 'shoes', type: '', color: '',
  desc: '', shopUrl: '', img: '',
  images: ['', '', '', ''],
  specs: [{ k: 'Brand', v: '' }, { k: 'Tipe', v: '' }],
};

function ProductForm({ initial, onSave, onCancel, title }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const set = (field, val) => setForm((f) => ({ ...f, [field]: val }));
  const setImg = (i, val) => {
    const next = [...form.images];
    next[i] = val;
    setForm((f) => ({ ...f, images: next }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Nama produk wajib diisi';
    if (!form.price.trim()) e.price = 'Harga wajib diisi';
    if (!form.img.trim()) e.img = 'Gambar utama wajib diisi';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    const cat = form.category === 'shoes' ? 'shoes' : form.category;
    const product = {
      ...form,
      cat,
      brand: form.brand,
      images: form.images.filter(Boolean),
      specs: form.specs.filter((s) => s.k && s.v),
    };
    await onSave(product);
    setSaving(false);
  };

  const inputStyle = (field) => ({ ...S.input, borderColor: errors[field] ? '#e74c3c' : '#e8e8e8', width: '100%', boxSizing: 'border-box' });

  return (
    <div style={S.formCard}>
      <div style={{ ...S.sectionTitle, fontSize: 20, marginBottom: 24 }}>{title}</div>

      {/* Basic info */}
      <div style={S.formRow}>
        <div>
          <div style={S.label}>Nama Produk *</div>
          <input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="cth: Nike Air Zoom" style={inputStyle('name')} />
          {errors.name && <div style={{ color: '#e74c3c', fontSize: 12, marginTop: 4 }}>{errors.name}</div>}
        </div>
        <div>
          <div style={S.label}>Harga *</div>
          <input value={form.price} onChange={(e) => set('price', e.target.value)} placeholder="cth: Rp. 899.000,00" style={inputStyle('price')} />
          {errors.price && <div style={{ color: '#e74c3c', fontSize: 12, marginTop: 4 }}>{errors.price}</div>}
        </div>
      </div>

      <div style={S.formRow}>
        <div>
          <div style={S.label}>Brand</div>
          <select value={form.brand} onChange={(e) => set('brand', e.target.value)} style={{ ...S.select, width: '100%', boxSizing: 'border-box' }}>
            {['Nike', 'adidas', 'Asics', 'Mizuno', 'Puma', 'Under Armour', 'New Balance', 'Lainnya'].map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </div>
        <div>
          <div style={S.label}>Kategori</div>
          <select value={form.category} onChange={(e) => set('category', e.target.value)} style={{ ...S.select, width: '100%', boxSizing: 'border-box' }}>
            <option value="shoes">Shoes</option>
            <option value="top">Top</option>
            <option value="bottom">Bottom</option>
          </select>
        </div>
      </div>

      <div style={S.formRow}>
        <div>
          <div style={S.label}>Tipe Olahraga</div>
          <input value={form.type} onChange={(e) => set('type', e.target.value)} placeholder="cth: Running, Badminton, Football" style={{ ...S.input, width: '100%', boxSizing: 'border-box' }} />
        </div>
        <div>
          <div style={S.label}>Warna</div>
          <input value={form.color} onChange={(e) => set('color', e.target.value)} placeholder="cth: Black/White" style={{ ...S.input, width: '100%', boxSizing: 'border-box' }} />
        </div>
      </div>

      <div style={S.formGroup}>
        <div style={S.label}>Deskripsi Produk</div>
        <textarea value={form.desc} onChange={(e) => set('desc', e.target.value)} placeholder="Jelaskan produk secara singkat..." style={S.textarea} />
      </div>

      <div style={S.formGroup}>
        <div style={S.label}>Link Pembelian (Shop URL)</div>
        <input value={form.shopUrl} onChange={(e) => set('shopUrl', e.target.value)} placeholder="https://tokopedia.com/..." style={{ ...S.input, width: '100%', boxSizing: 'border-box' }} />
      </div>

      {/* Images */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ ...S.label, marginBottom: 12 }}>GAMBAR PRODUK</div>
        <ImageUrlInput
          label="Gambar Utama (Card) *"
          value={form.img}
          onChange={(v) => set('img', v)}
          placeholder="URL gambar utama"
        />
        {errors.img && <div style={{ color: '#e74c3c', fontSize: 12, marginTop: -8, marginBottom: 8 }}>{errors.img}</div>}
        {[0, 1, 2, 3].map((i) => (
          <ImageUrlInput
            key={i}
            label={`Gambar Detail ${i + 1}`}
            value={form.images[i]}
            onChange={(v) => setImg(i, v)}
            placeholder={`URL gambar detail ${i + 1} (opsional)`}
          />
        ))}
      </div>

      {/* Specs */}
      <div style={{ marginBottom: 24 }}>
        <SpecInput specs={form.specs} onChange={(v) => set('specs', v)} />
      </div>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        {onCancel && <button type="button" onClick={onCancel} style={S.btnSecondary}>Batal</button>}
        <button type="button" onClick={handleSave} disabled={saving} style={{ ...S.btnPrimary, opacity: saving ? 0.7 : 1 }}>
          {saving ? 'Menyimpan...' : '💾 Simpan Produk'}
        </button>
      </div>
    </div>
  );
}

// ─── PRODUCTS TAB (Wisnu only) ────────────────────────────────────────────────
function ProductsTab({ customProducts, onAddProduct, onUpdateProduct, onDeleteProduct }) {
  const [view, setView] = useState('list'); // 'list' | 'add' | 'edit'
  const [editProduct, setEditProduct] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleAdd = async (product) => {
    await onAddProduct(product);
    setView('list');
  };

  const handleEdit = async (product) => {
    await onUpdateProduct(editProduct.id, product);
    setView('list');
    setEditProduct(null);
  };

  const handleDeleteConfirm = (id) => {
    onDeleteProduct(id);
    setDeleteConfirm(null);
  };

  if (view === 'add') {
    return (
      <div>
        <button onClick={() => setView('list')} style={{ ...S.btnSecondary, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 6 }}>
          ← Kembali ke Daftar
        </button>
        <ProductForm title="TAMBAH PRODUK BARU" onSave={handleAdd} onCancel={() => setView('list')} />
      </div>
    );
  }

  if (view === 'edit' && editProduct) {
    return (
      <div>
        <button onClick={() => { setView('list'); setEditProduct(null); }} style={{ ...S.btnSecondary, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 6 }}>
          ← Kembali ke Daftar
        </button>
        <ProductForm title="EDIT PRODUK" initial={editProduct} onSave={handleEdit} onCancel={() => { setView('list'); setEditProduct(null); }} />
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div style={S.sectionTitle}>
          KELOLA PRODUK
          <span style={{ fontSize: 14, fontFamily: "'DM Sans'", fontWeight: 400, color: '#aaa', marginLeft: 10 }}>
            ({customProducts.length} produk ditambahkan)
          </span>
        </div>
        <button onClick={() => setView('add')} style={{ ...S.btnPrimary, display: 'flex', alignItems: 'center', gap: 8 }}>
          ➕ Tambah Produk
        </button>
      </div>

      {customProducts.length === 0 ? (
        <div style={{ ...S.emptyState, background: '#fff', borderRadius: 16, border: '1.5px solid #eee' }}>
          <div style={{ fontSize: 56 }}>📦</div>
          <p style={{ fontSize: 16, marginTop: 12, fontWeight: 600 }}>Belum ada produk yang ditambahkan</p>
          <p style={{ fontSize: 13, color: '#bbb', marginTop: 6 }}>Klik "Tambah Produk" untuk menambahkan produk baru ke katalog.</p>
          <button onClick={() => setView('add')} style={{ ...S.btnPrimary, marginTop: 20 }}>➕ Tambah Produk Pertama</button>
        </div>
      ) : (
        <div style={S.productCardGrid}>
          {customProducts.map((p) => (
            <div key={p.id} style={S.productCard}>
              <div style={{ background: '#f8f8f8', height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                {p.img ? (
                  <img src={p.img} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 16 }} />
                ) : (
                  <div style={{ fontSize: 48, opacity: 0.3 }}>📦</div>
                )}
                <div style={{ position: 'absolute', top: 10, right: 10, background: '#1a5276', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20, textTransform: 'uppercase' }}>
                  {p.category}
                </div>
              </div>
              <div style={S.productCardBody}>
                <div style={{ fontSize: 13, color: '#888', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5, fontSize: 11 }}>{p.brand}</div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4, color: '#111' }}>{p.name}</div>
                <div style={{ fontSize: 14, color: '#1a5276', fontWeight: 700, marginBottom: 12 }}>{p.price}</div>
                {p.shopUrl && (
                  <div style={{ fontSize: 12, color: '#27ae60', marginBottom: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    🔗 {p.shopUrl}
                  </div>
                )}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => { setEditProduct(p); setView('edit'); }}
                    style={{ ...S.btnSecondary, flex: 1, fontSize: 13 }}
                  >✏️ Edit</button>
                  <button
                    onClick={() => setDeleteConfirm(p.id)}
                    style={{ ...S.btnDanger, fontSize: 13 }}
                  >🗑️</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirm modal */}
      {deleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, maxWidth: 380, width: '90%', textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🗑️</div>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Hapus Produk?</div>
            <p style={{ fontSize: 14, color: '#666', marginBottom: 24 }}>Produk ini akan dihapus dari katalog dan tidak bisa dikembalikan.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button onClick={() => setDeleteConfirm(null)} style={S.btnSecondary}>Batal</button>
              <button onClick={() => handleDeleteConfirm(deleteConfirm)} style={S.btnDanger}>Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────
export default function AdminPage({ onNavigate, onLogout, currentUser, reviews = [], allProducts = [], onDeleteReview, customProducts = [], onAddProduct, onUpdateProduct, onDeleteProduct }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dbProducts, setDbProducts] = useState([]);

useEffect(() => {
  const loadInitialData = async () => {
    try {
      const data = await getProducts();
      
      // Mengubah string JSON (images & specs) dari DB menjadi Array/Object
      const formattedData = data.map(p => ({
        ...p,
        images: typeof p.images === 'string' ? JSON.parse(p.images) : (p.images || []),
        specs: typeof p.specs === 'string' ? JSON.parse(p.specs) : (p.specs || [])
      }));
      
      setDbProducts(formattedData);
    } catch (error) {
      console.error("Gagal memuat produk:", error);
    }
  };

  loadInitialData();
}, []);

const fetchProducts = async () => {
  try {
    const res = await axios.get(API);
    setDbProducts(res.data);
  } catch (err) {
    console.error(err);
  }
};

const handleAddProduct = async (product) => {
  try {
    await axios.post(API, product);
    fetchProducts();
  } catch (err) {
    console.error(err);
  }
};

const handleUpdateProduct = async (id, product) => {
  try {
    await axios.put(`${API}/${id}`, product);
    fetchProducts();
  } catch (err) {
    console.error(err);
  }
};

const handleDeleteProduct = async (id) => {
  try {
    await axios.delete(`${API}/${id}`);
    fetchProducts();
  } catch (err) {
    console.error(err);
  }
};
  const displayName = currentUser?.name || 'Admin';
  const isWisnu = currentUser?.email === WISNU_EMAIL;

  const menuItems = [
    { id: 'dashboard', icon: '⊞', label: 'Dashboard' },
    { id: 'reviews',   icon: '⭐', label: 'Ulasan Saya' },
    ...(isWisnu ? [{ id: 'products', icon: '📦', label: 'Kelola Produk', special: true }] : []),
  ];

  return (
    <div style={S.page}>
      {/* TOP BAR */}
      <div style={S.topBar}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ cursor: 'pointer' }} onClick={() => onNavigate('home')}>
            <Logo size={32} onNavigate={onNavigate} />
          </div>
          <span style={S.topBarTitle}>ADMIN PANEL</span>
        </div>
        <div style={S.topBarRight}>
          <div style={S.adminAvatar}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#888" stroke="none">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          Halo, <strong style={{ marginLeft: 4 }}>{displayName}</strong>
          {isWisnu && <span style={{ background: '#8e44ad', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, marginLeft: 6 }}>SUPER ADMIN</span>}
        </div>
      </div>

      <div style={S.body}>
        {/* SIDEBAR */}
        <div style={S.sidebar}>
          <div style={S.avatarCircle}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="#555" stroke="none">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div style={S.adminName}>{displayName.toUpperCase()}</div>
          <div style={S.adminRole}>{currentUser?.email}</div>

          <div style={{ width: '100%', marginBottom: 'auto' }}>
            {menuItems.map((item) => (
              <button
                key={item.id}
                style={{
                  ...S.menuBtn,
                  ...(activeTab === item.id ? S.menuBtnActive : {}),
                  ...(item.special && activeTab !== item.id ? { color: '#c39bd3', borderLeft: '2px solid #8e44ad' } : {}),
                }}
                onClick={() => setActiveTab(item.id)}
                onMouseEnter={(e) => { if (activeTab !== item.id) e.currentTarget.style.background = '#111'; }}
                onMouseLeave={(e) => { if (activeTab !== item.id) e.currentTarget.style.background = 'transparent'; }}
              >
                <span style={{ fontSize: 16 }}>{item.icon}</span>
                {item.label}
                {item.special && <span style={{ marginLeft: 'auto', fontSize: 9, background: '#8e44ad', color: '#fff', borderRadius: 10, padding: '1px 6px' }}>WISNU</span>}
              </button>
            ))}
          </div>

          <div style={S.sidebarBottom}>
            <button style={S.sidebarIconBtn} onClick={() => onNavigate('home')} title="Kembali ke website"
              onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = 0.7)}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
            <button style={S.sidebarIconBtn} onClick={onLogout} title="Logout"
              onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = 0.7)}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
            </button>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div style={S.mainContent}>
          {activeTab === 'dashboard' && (
            <DashboardTab reviews={reviews} allProducts={allProducts} onNavigate={onNavigate} onSwitchTab={setActiveTab} currentUser={currentUser} customProducts={customProducts} />
          )}
          {activeTab === 'reviews' && (
            <ReviewsTab reviews={reviews} allProducts={allProducts} onDeleteReview={onDeleteReview} currentUser={currentUser} />
          )}
          {activeTab === 'myreviews' && (
            <MyReviewsTab reviews={reviews} allProducts={allProducts} currentUser={currentUser} onDeleteReview={onDeleteReview} />
          )}
          {activeTab === 'products' && isWisnu && (
            <ProductsTab
             customProducts={dbProducts}
             onAddProduct={handleAddProduct}
             onUpdateProduct={handleUpdateProduct}
             onDeleteProduct={handleDeleteProduct}
            />
          )}
        </div>
      </div>
    </div>
  );
}