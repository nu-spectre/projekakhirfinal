import React, { useState } from 'react';
import Logo from '../components/Logo';

const BRANDS = ['Nike', 'Adidas', 'Asics', 'Mizuno'];

const styles = {
  page: {
    paddingTop: 60,
    minHeight: '100vh',
    background: '#2c2c2c',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: "'DM Sans', sans-serif",
  },
  brandBg: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexWrap: 'wrap',
    alignContent: 'flex-start',
    opacity: 0.1,
    pointerEvents: 'none',
    overflow: 'hidden',
    gap: 0,
  },
  brandItem: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 800,
    padding: '14px 12px',
    display: 'block',
    whiteSpace: 'nowrap',
    fontFamily: "'DM Sans', sans-serif",
    letterSpacing: 1,
  },
  card: {
    position: 'relative',
    zIndex: 5,
    background: 'rgba(255,255,255,0.97)',
    borderRadius: 20,
    padding: '48px 44px',
    width: 420,
    boxShadow: '0 24px 80px rgba(0,0,0,.4)',
  },
  logoWrap: { textAlign: 'center', marginBottom: 28, marginLeft: 120 },
  title: { textAlign: 'center', fontSize: 26, fontWeight: 700, marginBottom: 28, color: '#111' },
  formGroup: { marginBottom: 16, position: 'relative' },
  input: {
    width: '100%',
    padding: '14px 18px',
    border: '1.5px solid #e8e8e8',
    borderRadius: 30,
    fontSize: 14,
    fontFamily: "'DM Sans', sans-serif",
    background: '#f5f5f5',
    transition: 'all .2s',
    outline: 'none',
    boxSizing: 'border-box',
  },
  errorText: {
    fontSize: 12,
    color: '#e74c3c',
    marginTop: 6,
    marginLeft: 14,
    display: 'block',
  },
  signInBtn: {
    width: '100%',
    padding: 15,
    background: '#1a5276',
    color: '#fff',
    border: 'none',
    borderRadius: 30,
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    marginTop: 8,
    transition: 'background .2s',
  },
  or: { textAlign: 'center', fontSize: 12, color: '#999', margin: '18px 0 12px' },
  socialBtns: { display: 'flex', gap: 16, justifyContent: 'center' },
  socialBtn: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    border: '1.5px solid #e8e8e8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: 18,
    fontWeight: 900,
    transition: 'all .2s',
    background: '#fff',
  },
  forgot: { textAlign: 'center', fontSize: 12, color: '#999', marginTop: 14, cursor: 'pointer' },
};

function randomId() {
  return Math.floor(Math.random() * 9999) + 1;
}

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [pwFocused, setPwFocused] = useState(false);
  const [btnHovered, setBtnHovered] = useState(false);
  const [emailError, setEmailError] = useState('');

  const brandItems = Array.from({ length: 300 }, (_, i) => BRANDS[i % BRANDS.length]);

  const handleLogin = () => {
    const trimmed = email.trim();
    if (!trimmed) {
      setEmailError('Email tidak boleh kosong');
      return;
    }
    setEmailError('');
    onLogin(trimmed, 'email');
  };

  const handleGoogleLogin = () => {
    onLogin('Google#' + randomId(), 'google');
  };

  const handleFacebookLogin = () => {
    onLogin('Facebook#' + randomId(), 'facebook');
  };

  return (
    <div style={styles.page}>
      <div style={styles.brandBg}>
        {brandItems.map((brand, i) => (
          <span key={i} style={styles.brandItem}>{brand}</span>
        ))}
      </div>

      <div style={styles.card}>
        <div style={styles.logoWrap}>
          <Logo size={56} showText={false} />
        </div>

        <h2 style={styles.title}>Login</h2>

        {/* Email Input */}
        <div style={styles.formGroup}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError && e.target.value.trim()) setEmailError('');
            }}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
            style={{
              ...styles.input,
              borderColor: emailError ? '#e74c3c' : emailFocused ? '#1a5276' : '#e8e8e8',
              background: emailFocused ? '#fff' : '#f5f5f5',
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
          {emailError && <span style={styles.errorText}>⚠ {emailError}</span>}
        </div>

        {/* Password Input */}
        <div style={styles.formGroup}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setPwFocused(true)}
            onBlur={() => setPwFocused(false)}
            style={{
              ...styles.input,
              borderColor: pwFocused ? '#1a5276' : '#e8e8e8',
              background: pwFocused ? '#fff' : '#f5f5f5',
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
        </div>

        <button
          style={{
            ...styles.signInBtn,
            background: btnHovered ? '#154360' : '#1a5276',
          }}
          onMouseEnter={() => setBtnHovered(true)}
          onMouseLeave={() => setBtnHovered(false)}
          onClick={handleLogin}
        >
          Sign In
        </button>

        <p style={styles.forgot}>Forgot Password</p>
        <p style={styles.or}>OR SIGN IN WITH</p>

        <div style={styles.socialBtns}>
          <button style={styles.socialBtn} onClick={handleGoogleLogin} title="Login dengan Google">
            <svg width="22" height="22" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.2l6.7-6.7C35.8 2.5 30.2 0 24 0 14.6 0 6.5 5.5 2.5 13.5l7.8 6C12.2 13.7 17.6 9.5 24 9.5z"/>
              <path fill="#34A853" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4 6.1-10 6.1-17z"/>
              <path fill="#FBBC05" d="M10.3 28.5c-.6-1.7-.9-3.5-.9-5.5s.3-3.8.9-5.5l-7.8-6C.9 14.5 0 19.1 0 24s.9 9.5 2.5 13.5l7.8-9z"/>
              <path fill="#4285F4" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.5-5.8c-2 1.4-4.6 2.2-7.7 2.2-6.4 0-11.8-4.2-13.7-9.9l-7.8 6C6.5 42.5 14.6 48 24 48z"/>
            </svg>
          </button>

          <button style={styles.socialBtn} onClick={handleFacebookLogin} title="Login dengan Facebook">
            <svg width="22" height="22" viewBox="0 0 48 48">
              <path fill="#1877F2" d="M48 24C48 10.7 37.3 0 24 0S0 10.7 0 24c0 12 8.8 21.9 20.3 23.7V30.9h-6.1V24h6.1v-5.3c0-6 3.6-9.3 9-9.3 2.6 0 5.4.5 5.4.5v5.9h-3c-3 0-3.9 1.8-3.9 3.7V24h6.6l-1.1 6.9H27.8v16.8C39.2 45.9 48 36 48 24z"/>
              <path fill="#fff" d="M33.4 30.9l1.1-6.9h-6.6v-4.4c0-1.9.9-3.7 3.9-3.7h3v-5.9s-2.7-.5-5.4-.5c-5.4 0-9 3.3-9 9.3V24h-6.1v6.9h6.1v16.8c1.2.2 2.5.3 3.7.3s2.5-.1 3.7-.3V30.9h5.6z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
