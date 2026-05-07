import React from 'react';
import Logo from './Logo';

const styles = {
  footer: {
    background: '#fff',
    borderTop: '1px solid #e8e8e8',
    padding: '48px 40px 24px',
    marginTop: 60,
    fontFamily: "'DM Sans', sans-serif",
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '220px 1fr 1fr 1fr',
    gap: 40,
    maxWidth: 1100,
    margin: '0 auto 32px',
  },
  heading: {
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 14,
    color: '#111',
  },
  text: {
    fontSize: 13,
    color: '#555',
    lineHeight: 1.7,
  },
  bottom: {
    textAlign: 'center',
    fontSize: 13,
    color: '#999',
    borderTop: '1px solid #e8e8e8',
    paddingTop: 20,
  },
};

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.grid}>
        {/* Kolom 1: Logo + Deskripsi */}
        <div>
          <div style={{ marginBottom: 14 }}>
            <Logo size={40} />
          </div>
          <p style={styles.text}>
            Sportiva adalah platform rekomendasi perlengkapan olahraga yang
            menghadirkan berbagai produk original dari brand-brand terpercaya.
          </p>
        </div>

        {/* Kolom 2: About */}
        <div>
          <h4 style={styles.heading}>About Sportiva</h4>
          <p style={styles.text}>
            Sportiva adalah platform rekomendasi perlengkapan olahraga yang
            menghadirkan berbagai produk original dari brand-brand terpercaya.
          </p>
        </div>

        {/* Kolom 3: Contact */}
        <div>
          <h4 style={styles.heading}>Our Contact</h4>
          <p style={styles.text}>
            ✉ info@sportiva.com
            <br />
            📞 +62 891-2345-6789
          </p>
        </div>

        {/* Kolom 4: Social Media */}
        <div>
          <h4 style={styles.heading}>Social Media</h4>
          <p style={styles.text}>@ sportiva.official</p>
        </div>
      </div>

      <div style={styles.bottom}>© 2026 Sportiva. All Rights Reserved.</div>
    </footer>
  );
}
