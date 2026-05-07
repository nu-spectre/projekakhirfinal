// ─── REVIEW STORAGE HELPERS ────────────────────────────────────────────────
// Review disimpan di localStorage dengan key "sportiva_reviews"
// Format:
// {
//   [productId]: [
//     { id, user, rating, comment, date }
//   ]
// }

const STORAGE_KEY = 'sportiva_reviews';

export function loadAllReviews() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

export function saveAllReviews(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

// Ambil review untuk satu produk
export function getReviewsByProduct(productId) {
  const all = loadAllReviews();
  return all[productId] || [];
}

// Tambah review baru — return { ok, message }
export function addReview(productId, user, rating, comment) {
  if (!user) return { ok: false, message: 'Harus login untuk memberikan ulasan.' };
  if (!rating) return { ok: false, message: 'Pilih bintang terlebih dahulu.' };
  if (!comment.trim()) return { ok: false, message: 'Komentar tidak boleh kosong.' };

  const all = loadAllReviews();
  const existing = all[productId] || [];

  // Satu akun hanya boleh review sekali per produk
  if (existing.some((r) => r.user === user)) {
    return { ok: false, message: 'Kamu sudah memberikan ulasan untuk produk ini.' };
  }

  const newReview = {
    id: Date.now().toString(),
    user,
    rating,
    comment: comment.trim(),
    date: new Date().toLocaleDateString('id-ID', {
      day: '2-digit', month: 'long', year: 'numeric',
    }),
  };

  all[productId] = [...existing, newReview];
  saveAllReviews(all);
  return { ok: true, review: newReview };
}

// Hapus review (admin)
export function deleteReview(productId, reviewId) {
  const all = loadAllReviews();
  if (!all[productId]) return;
  all[productId] = all[productId].filter((r) => r.id !== reviewId);
  saveAllReviews(all);
}

// Ambil SEMUA review (flat list, untuk admin)
// Return: [{ productId, productName, ...review }]
export function getAllReviewsFlat(products) {
  const all = loadAllReviews();
  const flat = [];
  for (const [productId, reviews] of Object.entries(all)) {
    const product = products.find((p) => p.id === productId);
    for (const review of reviews) {
      flat.push({ ...review, productId, productName: product?.name || productId });
    }
  }
  // Urutkan terbaru di atas
  return flat.sort((a, b) => Number(b.id) - Number(a.id));
}

// Hitung rata-rata rating sebuah produk
export function getAverageRating(productId) {
  const reviews = getReviewsByProduct(productId);
  if (!reviews.length) return 0;
  return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
}
