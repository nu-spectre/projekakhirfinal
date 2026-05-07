import React from 'react';
import Footer from '../components/Footer';

const contactItems = [
  {
    icon: '✉️',
    title: 'Email',
    value: 'info@sportiva.com',
  },
  {
    icon: '📞',
    title: 'Telepon',
    value: '+62 891-2345-6789',
  },
  {
    icon: '📍',
    title: 'Alamat',
    value: 'Jl. Olahraga No. 1, Purwokerto, Jawa Tengah',
  },
  {
    icon: '📱',
    title: 'Social Media',
    value: '@sportiva.official',
  },
];

const styles = {
  page: {
    paddingTop: 60,
    minHeight: '100vh',
    background: '#f5f5f5',
    fontFamily: "'DM Sans', sans-serif",
  },
  wrap: {
    maxWidth: 600,
    margin: '0 auto',
    padding: '60px 40px',
  },
  title: {
    fontFamily: "'Bebas Neue', cursive",
    fontSize: 48,
    letterSpacing: 2,
    marginBottom: 32,
    color: '#111',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    padding: 20,
    background: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    border: '1.5px solid #e8e8e8',
  },
  icon: {
    fontSize: 24,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 4,
    color: '#111',
  },
  itemValue: {
    fontSize: 14,
    color: '#555',
  },
};

export default function ContactPage() {
  return (
    <div style={styles.page}>
      <div style={styles.wrap}>
        <h1 style={styles.title}>Contact</h1>
        {contactItems.map((item, i) => (
          <div key={i} style={styles.item}>
            <span style={styles.icon}>{item.icon}</span>
            <div>
              <h4 style={styles.itemTitle}>{item.title}</h4>
              <p style={styles.itemValue}>{item.value}</p>
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
}
