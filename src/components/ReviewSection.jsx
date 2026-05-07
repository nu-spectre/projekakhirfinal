import React, { useState } from 'react';

// ─── STAR RATING COMPONENT ───────────────────────────────────────────────────
function StarRating({ value, onChange, readOnly = false, size = 28 }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = (readOnly ? value : (hovered || value)) >= star;
        return (
          <span
            key={star}
            onClick={() => !readOnly && onChange && onChange(star)}
            onMouseEnter={() => !readOnly && setHovered(star)}
            onMouseLeave={() => !readOnly && setHovered(0)}
            style={{
              fontSize: size,
              cursor: readOnly ? 'default' : 'pointer',
              color: filled ? '#f4c430' : '#ddd',
              transition: 'color .15s, transform .1s',
              transform: !readOnly && hovered === star ? 'scale(1.2)' : 'scale(1)',
              userSelect: 'none',
              lineHeight: 1,
            }}
          >
            ★
          </span>
        );
      })}
    </div>
  );
}

// ─── AVERAGE STARS ───────────────────────────────────────────────────────────
function AverageStars({ reviews }) {
  if (!reviews.length) return null;
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  const dist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));
  return (
    <div style={{ display: 'flex', gap: 28, alignItems: 'center', marginBottom: 32, flexWrap: 'wrap' }}>
      {/* Big average */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 52, fontWeight: 700, lineHeight: 1, color: '#111' }}>
          {avg.toFixed(1)}
        </div>
        <StarRating value={Math.round(avg)} readOnly size={20} />
        <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>
          {reviews.length} ulasan
        </div>
      </div>
      {/* Bar chart */}
      <div style={{ flex: 1, minWidth: 200 }}>
        {dist.map(({ star, count }) => {
          const pct = reviews.length ? (count / reviews.length) * 100 : 0;
          return (
            <div key={star} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
              <span style={{ fontSize: 12, color: '#666', width: 20, textAlign: 'right' }}>{star}</span>
              <span style={{ color: '#f4c430', fontSize: 14 }}>★</span>
              <div style={{ flex: 1, background: '#f0f0f0', borderRadius: 4, height: 8, overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, background: '#f4c430', height: '100%', borderRadius: 4, transition: 'width .4s ease' }} />
              </div>
              <span style={{ fontSize: 12, color: '#999', width: 16 }}>{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── SINGLE REVIEW CARD ──────────────────────────────────────────────────────
function ReviewCard({ review, canDelete, onDelete }) {
  const [hov, setHov] = useState(false);
  const initials = review.userName
    ? review.userName.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';
  const dateStr = new Date(review.date).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
  return (
    <div
      style={{
        background: '#fafafa',
        borderRadius: 14,
        padding: '18px 20px',
        marginBottom: 14,
        border: '1.5px solid #f0f0f0',
        transition: 'box-shadow .2s',
        boxShadow: hov ? '0 4px 16px rgba(0,0,0,.07)' : 'none',
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {/* Avatar */}
          <div style={{
            width: 40, height: 40, borderRadius: '50%', background: '#1a5276',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: 14, flexShrink: 0,
          }}>
            {initials}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#111' }}>{review.userName}</div>
            <div style={{ fontSize: 12, color: '#aaa' }}>{dateStr}</div>
          </div>
        </div>
        {canDelete && (
          <button
            onClick={() => onDelete(review.id)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#ccc', fontSize: 18, padding: 4, borderRadius: 6,
              transition: 'color .2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#e74c3c')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#ccc')}
            title="Hapus review"
          >
            ✕
          </button>
        )}
      </div>
      <div style={{ marginTop: 10 }}>
        <StarRating value={review.rating} readOnly size={18} />
      </div>
      <p style={{ marginTop: 10, fontSize: 14, color: '#444', lineHeight: 1.65 }}>{review.comment}</p>
    </div>
  );
}

// ─── REVIEW FORM ─────────────────────────────────────────────────────────────
function ReviewForm({ onSubmit, existingReview }) {
  const [rating, setRating]   = useState(0);
  const [comment, setComment] = useState('');
  const [err, setErr]         = useState('');
  const [hov, setHov]         = useState(false);
  const [success, setSuccess] = useState(false);

  if (existingReview) {
    return (
      <div style={{ background: '#f8f9fa', borderRadius: 14, padding: '18px 20px', border: '1.5px solid #e8e8e8', marginBottom: 28 }}>
        <p style={{ fontSize: 13, color: '#666', textAlign: 'center' }}>
          ✓ Kamu sudah memberikan review untuk produk ini.
        </p>
        <div style={{ marginTop: 12 }}>
          <StarRating value={existingReview.rating} readOnly size={20} />
          <p style={{ marginTop: 8, fontSize: 13, color: '#444' }}>{existingReview.comment}</p>
        </div>
      </div>
    );
  }

  const submit = () => {
    if (rating === 0) { setErr('Pilih rating bintang terlebih dahulu'); return; }
    if (!comment.trim()) { setErr('Komentar tidak boleh kosong'); return; }
    const result = onSubmit(rating, comment);
    if (!result.ok) { setErr(result.msg || 'Terjadi kesalahan'); return; }
    setSuccess(true);
    setRating(0);
    setComment('');
    setErr('');
  };

  if (success) return (
    <div style={{ background: '#eafaf1', borderRadius: 14, padding: '20px', textAlign: 'center', marginBottom: 28, border: '1.5px solid #a9dfbf' }}>
      <div style={{ fontSize: 32, marginBottom: 8 }}>⭐</div>
      <p style={{ color: '#1e8449', fontWeight: 600, fontSize: 14 }}>Review berhasil dikirim! Terima kasih.</p>
    </div>
  );

  return (
    <div style={{ background: '#fff', borderRadius: 16, padding: '24px', border: '1.5px solid #e8e8e8', marginBottom: 28, boxShadow: '0 2px 12px rgba(0,0,0,.04)' }}>
      <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: '#111' }}>Tulis Ulasanmu</h4>

      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 13, color: '#666', marginBottom: 8, fontWeight: 500 }}>Rating</div>
        <StarRating value={rating} onChange={(v) => { setRating(v); setErr(''); }} size={32} />
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 13, color: '#666', marginBottom: 8, fontWeight: 500 }}>Komentar</div>
        <textarea
          value={comment}
          onChange={(e) => { setComment(e.target.value); setErr(''); }}
          placeholder="Ceritakan pengalaman kamu dengan produk ini..."
          rows={4}
          style={{
            width: '100%', padding: '12px 14px', border: '1.5px solid #e8e8e8',
            borderRadius: 12, fontSize: 14, fontFamily: "'DM Sans', sans-serif",
            resize: 'vertical', outline: 'none', background: '#f9f9f9',
            boxSizing: 'border-box', transition: 'border-color .2s',
          }}
          onFocus={(e) => (e.target.style.borderColor = '#1a5276')}
          onBlur={(e) => (e.target.style.borderColor = '#e8e8e8')}
        />
      </div>

      {err && <div style={{ fontSize: 12, color: '#e74c3c', marginBottom: 10 }}>⚠ {err}</div>}

      <button
        onClick={submit}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          padding: '11px 28px', background: hov ? '#154360' : '#1a5276',
          color: '#fff', border: 'none', borderRadius: 30, fontSize: 14,
          fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
          transition: 'background .2s',
        }}
      >
        Kirim Review
      </button>
    </div>
  );
}

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────
export default function ReviewSection({ reviews = [], currentUser, isLoggedIn, onSubmitReview, onDeleteReview, onGoLogin }) {
  const myReview = currentUser
    ? reviews.find((r) => r.userEmail === currentUser.email)
    : null;

  return (
    <div style={{ marginTop: 48 }}>
      <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 28, color: '#111', fontFamily: "'Bebas Neue', cursive", letterSpacing: 1.5 }}>
        ULASAN PRODUK
      </h3>

      {/* Average */}
      {reviews.length > 0 && <AverageStars reviews={reviews} />}

      {/* Review Form */}
      {isLoggedIn ? (
        <ReviewForm onSubmit={onSubmitReview} existingReview={myReview} />
      ) : (
        <div
          style={{
            background: '#f5f8ff', borderRadius: 14, padding: '20px', textAlign: 'center',
            marginBottom: 28, border: '1.5px dashed #c0cfe8', cursor: 'pointer',
          }}
          onClick={onGoLogin}
        >
          <p style={{ fontSize: 14, color: '#555' }}>
            <span style={{ color: '#1a5276', fontWeight: 700 }}>Login</span> untuk memberikan review dan rating
          </p>
        </div>
      )}

      {/* Review List */}
      {reviews.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#bbb' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>⭐</div>
          <p style={{ fontSize: 14 }}>Belum ada ulasan. Jadilah yang pertama!</p>
        </div>
      ) : (
        reviews
          .slice()
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .map((r) => (
            <ReviewCard
              key={r.id}
              review={r}
              canDelete={currentUser && (r.userEmail === currentUser.email)}
              onDelete={onDeleteReview}
            />
          ))
      )}
    </div>
  );
}
