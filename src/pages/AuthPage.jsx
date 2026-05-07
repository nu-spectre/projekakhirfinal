import React, { useState } from 'react';
import Logo from '../components/Logo';

// AuthPage menggabungkan 3 tampilan: Login, Register, Forgot Password
// mode: 'login' | 'register' | 'forgot'

const BRANDS = ['Nike', 'Adidas', 'Asics', 'Mizuno', 'Reebok', 'Jordan'];

const S = {
  page: {
    minHeight: '100vh',
    background: '#1c1c1c',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: "'DM Sans', sans-serif",
  },
  brandBg: {
    position: 'absolute', inset: 0, display: 'flex', flexWrap: 'wrap',
    alignContent: 'flex-start', opacity: 0.07, pointerEvents: 'none', overflow: 'hidden',
  },
  brandItem: { color: '#fff', fontSize: 13, fontWeight: 800, padding: '12px 12px', whiteSpace: 'nowrap', letterSpacing: 1 },
  card: {
    position: 'relative', zIndex: 5, background: '#fff',
    borderRadius: 20, padding: '44px 44px', width: 420,
    boxShadow: '0 32px 80px rgba(0,0,0,.5)',
  },
  logoWrap: { display: 'flex', justifyContent: 'center', marginBottom: 24 },
  title: { textAlign: 'center', fontSize: 26, fontWeight: 700, marginBottom: 8, color: '#111' },
  subtitle: { textAlign: 'center', fontSize: 13, color: '#999', marginBottom: 28 },
  label: { fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 5, display: 'block', marginLeft: 4 },
  formGroup: { marginBottom: 16, position: 'relative' },
  input: {
    width: '100%', padding: '13px 18px', border: '1.5px solid #e8e8e8',
    borderRadius: 30, fontSize: 14, fontFamily: "'DM Sans', sans-serif",
    background: '#f5f5f5', transition: 'all .2s', outline: 'none', boxSizing: 'border-box',
  },
  errorMsg: { fontSize: 12, color: '#e74c3c', marginTop: 5, marginLeft: 14, display: 'block' },
  successMsg: { fontSize: 12, color: '#27ae60', marginTop: 5, marginLeft: 14, display: 'block' },
  primaryBtn: {
    width: '100%', padding: 14, background: '#1a5276', color: '#fff',
    border: 'none', borderRadius: 30, fontSize: 15, fontWeight: 700,
    cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", marginTop: 6,
    transition: 'background .2s',
  },
  switchRow: { textAlign: 'center', fontSize: 13, color: '#777', marginTop: 20 },
  switchLink: { color: '#1a5276', fontWeight: 700, cursor: 'pointer', marginLeft: 4 },
  divider: { textAlign: 'center', fontSize: 12, color: '#bbb', margin: '18px 0 12px', position: 'relative' },
  socialRow: { display: 'flex', gap: 14, justifyContent: 'center' },
  socialBtn: {
    width: 48, height: 48, borderRadius: '50%', border: '1.5px solid #e8e8e8',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', background: '#fff', transition: 'all .2s',
  },
  forgotLink: { textAlign: 'center', fontSize: 12, color: '#1a5276', marginTop: 12, cursor: 'pointer', fontWeight: 600 },
  stepDot: { width: 8, height: 8, borderRadius: '50%', background: '#ddd', transition: 'background .3s' },
  stepDotActive: { background: '#1a5276' },
};

function Input({ label, type = 'text', value, onChange, placeholder, error, onKeyDown }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={S.formGroup}>
      {label && <label style={S.label}>{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={onKeyDown}
        style={{
          ...S.input,
          borderColor: error ? '#e74c3c' : focused ? '#1a5276' : '#e8e8e8',
          background: focused ? '#fff' : '#f5f5f5',
        }}
      />
      {error && <span style={S.errorMsg}>⚠ {error}</span>}
    </div>
  );
}

// ─── LOGIN PANEL ─────────────────────────────────────────────────────────────
function LoginPanel({ onLogin, onSwitch, onForgot }) {
  const [email, setEmail]     = useState('');
  const [pw, setPw]           = useState('');
  const [err, setErr]         = useState({});
  const [apiErr, setApiErr]   = useState('');
  const [hov, setHov]         = useState(false);

  const validate = () => {
    const e = {};
    if (!email.trim()) e.email = 'Email tidak boleh kosong';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Format email tidak valid';
    if (!pw) e.pw = 'Password tidak boleh kosong';
    return e;
  };

  const submit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErr(e); return; }
    setErr({});
    const result = onLogin(email.trim(), pw);
    if (!result.ok) setApiErr(result.msg);
  };

  return (
    <>
      <div style={S.logoWrap}><Logo size={52} showText={false} /></div>
      <h2 style={S.title}>Masuk ke Akun</h2>
      <p style={S.subtitle}>Selamat datang kembali di Sportiva</p>

      {apiErr && (
        <div style={{ background: '#fdf0f0', border: '1px solid #f5c6cb', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#c0392b' }}>
          ⚠ {apiErr}
        </div>
      )}

      <Input label="Email" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setApiErr(''); }} placeholder="contoh@email.com" error={err.email} onKeyDown={(e) => e.key === 'Enter' && submit()} />
      <Input label="Password" type="password" value={pw} onChange={(e) => { setPw(e.target.value); setApiErr(''); }} placeholder="Masukkan password" error={err.pw} onKeyDown={(e) => e.key === 'Enter' && submit()} />

      <button style={{ ...S.primaryBtn, background: hov ? '#154360' : '#1a5276' }} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} onClick={submit}>
        Masuk
      </button>

      <div style={S.forgotLink} onClick={onForgot}>Lupa password?</div>

      <div style={S.divider}>atau masuk dengan</div>
      <div style={S.socialRow}>
        <button style={S.socialBtn} onClick={() => onLogin('google@demo.com', '___social___')} title="Google">
          <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.2l6.7-6.7C35.8 2.5 30.2 0 24 0 14.6 0 6.5 5.5 2.5 13.5l7.8 6C12.2 13.7 17.6 9.5 24 9.5z"/><path fill="#34A853" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4 6.1-10 6.1-17z"/><path fill="#FBBC05" d="M10.3 28.5c-.6-1.7-.9-3.5-.9-5.5s.3-3.8.9-5.5l-7.8-6C.9 14.5 0 19.1 0 24s.9 9.5 2.5 13.5l7.8-9z"/><path fill="#4285F4" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.5-5.8c-2 1.4-4.6 2.2-7.7 2.2-6.4 0-11.8-4.2-13.7-9.9l-7.8 6C6.5 42.5 14.6 48 24 48z"/></svg>
        </button>
        <button style={S.socialBtn} onClick={() => onLogin('facebook@demo.com', '___social___')} title="Facebook">
          <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#1877F2" d="M48 24C48 10.7 37.3 0 24 0S0 10.7 0 24c0 12 8.8 21.9 20.3 23.7V30.9h-6.1V24h6.1v-5.3c0-6 3.6-9.3 9-9.3 2.6 0 5.4.5 5.4.5v5.9h-3c-3 0-3.9 1.8-3.9 3.7V24h6.6l-1.1 6.9H27.8v16.8C39.2 45.9 48 36 48 24z"/><path fill="#fff" d="M33.4 30.9l1.1-6.9h-6.6v-4.4c0-1.9.9-3.7 3.9-3.7h3v-5.9s-2.7-.5-5.4-.5c-5.4 0-9 3.3-9 9.3V24h-6.1v6.9h6.1v16.8c1.2.2 2.5.3 3.7.3s2.5-.1 3.7-.3V30.9h5.6z"/></svg>
        </button>
      </div>

      <div style={S.switchRow}>
        Belum punya akun?
        <span style={S.switchLink} onClick={() => onSwitch('register')}>Daftar sekarang</span>
      </div>
    </>
  );
}

// ─── REGISTER PANEL ──────────────────────────────────────────────────────────
function RegisterPanel({ onRegister, onSwitch }) {
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [pw, setPw]           = useState('');
  const [pwc, setPwc]         = useState('');
  const [err, setErr]         = useState({});
  const [apiErr, setApiErr]   = useState('');
  const [success, setSuccess] = useState('');
  const [hov, setHov]         = useState(false);

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = 'Nama tidak boleh kosong';
    if (!email.trim()) e.email = 'Email tidak boleh kosong';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Format email tidak valid';
    if (!pw) e.pw = 'Password tidak boleh kosong';
    else if (pw.length < 6) e.pw = 'Password minimal 6 karakter';
    if (pw !== pwc) e.pwc = 'Konfirmasi password tidak cocok';
    return e;
  };

  const submit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErr(e); return; }
    setErr({}); setApiErr('');
    const result = onRegister(email.trim(), pw, name.trim());
    if (!result.ok) { setApiErr(result.msg); return; }
    setSuccess('Akun berhasil dibuat! Silakan login.');
    setTimeout(() => onSwitch('login'), 1800);
  };

  return (
    <>
      <div style={S.logoWrap}><Logo size={52} showText={false} /></div>
      <h2 style={S.title}>Buat Akun Baru</h2>
      <p style={S.subtitle}>Bergabung dengan komunitas Sportiva</p>

      {apiErr && (
        <div style={{ background: '#fdf0f0', border: '1px solid #f5c6cb', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#c0392b' }}>
          ⚠ {apiErr}
        </div>
      )}
      {success && (
        <div style={{ background: '#eafaf1', border: '1px solid #a9dfbf', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#1e8449', fontWeight: 600 }}>
          ✓ {success}
        </div>
      )}

      <Input label="Nama Lengkap" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama kamu" error={err.name} />
      <Input label="Email" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setApiErr(''); }} placeholder="contoh@email.com" error={err.email} />
      <Input label="Password" type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Minimal 6 karakter" error={err.pw} />
      <Input label="Konfirmasi Password" type="password" value={pwc} onChange={(e) => setPwc(e.target.value)} placeholder="Ulangi password" error={err.pwc} onKeyDown={(e) => e.key === 'Enter' && submit()} />

      <button style={{ ...S.primaryBtn, background: hov ? '#154360' : '#1a5276' }} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} onClick={submit}>
        Buat Akun
      </button>

      <div style={S.switchRow}>
        Sudah punya akun?
        <span style={S.switchLink} onClick={() => onSwitch('login')}>Masuk</span>
      </div>
    </>
  );
}

// ─── FORGOT PASSWORD PANEL ───────────────────────────────────────────────────
// Alur 3 langkah: 1) Masukkan email  2) Buat password baru  3) Sukses
function ForgotPanel({ onForgotPassword, onSwitch }) {
  const [step, setStep]       = useState(1); // 1 | 2 | 3
  const [email, setEmail]     = useState('');
  const [pw, setPw]           = useState('');
  const [pwc, setPwc]         = useState('');
  const [err, setErr]         = useState({});
  const [hov, setHov]         = useState(false);

  const stepNext1 = () => {
    const e = {};
    if (!email.trim()) e.email = 'Email tidak boleh kosong';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Format email tidak valid';
    if (Object.keys(e).length) { setErr(e); return; }
    setErr({});
    // Check email exists (we check in parent)
    setStep(2);
  };

  const stepNext2 = () => {
    const e = {};
    if (!pw) e.pw = 'Password tidak boleh kosong';
    else if (pw.length < 6) e.pw = 'Password minimal 6 karakter';
    if (pw !== pwc) e.pwc = 'Konfirmasi password tidak cocok';
    if (Object.keys(e).length) { setErr(e); return; }
    setErr({});
    const result = onForgotPassword(email.trim(), pw);
    if (!result.ok) { setErr({ email: result.msg }); setStep(1); return; }
    setStep(3);
  };

  const Steps = () => (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 24 }}>
      {[1, 2, 3].map((n) => (
        <div key={n} style={{ ...S.stepDot, ...(step >= n ? S.stepDotActive : {}) }} />
      ))}
    </div>
  );

  if (step === 1) return (
    <>
      <div style={S.logoWrap}><Logo size={52} showText={false} /></div>
      <h2 style={S.title}>Lupa Password</h2>
      <p style={S.subtitle}>Masukkan email akun kamu untuk melanjutkan</p>
      <Steps />
      <Input label="Email Akun" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setErr({}); }} placeholder="contoh@email.com" error={err.email} onKeyDown={(e) => e.key === 'Enter' && stepNext1()} />
      <button style={{ ...S.primaryBtn, background: hov ? '#154360' : '#1a5276' }} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} onClick={stepNext1}>
        Lanjutkan
      </button>
      <div style={S.switchRow}>
        Ingat password?
        <span style={S.switchLink} onClick={() => onSwitch('login')}>Kembali login</span>
      </div>
    </>
  );

  if (step === 2) return (
    <>
      <div style={S.logoWrap}><Logo size={52} showText={false} /></div>
      <h2 style={S.title}>Buat Password Baru</h2>
      <p style={S.subtitle}>Untuk akun <strong>{email}</strong></p>
      <Steps />
      <Input label="Password Baru" type="password" value={pw} onChange={(e) => { setPw(e.target.value); setErr({}); }} placeholder="Minimal 6 karakter" error={err.pw} />
      <Input label="Konfirmasi Password" type="password" value={pwc} onChange={(e) => setPwc(e.target.value)} placeholder="Ulangi password baru" error={err.pwc} onKeyDown={(e) => e.key === 'Enter' && stepNext2()} />
      <button style={{ ...S.primaryBtn, background: hov ? '#154360' : '#1a5276' }} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} onClick={stepNext2}>
        Simpan Password
      </button>
    </>
  );

  return (
    <>
      <div style={S.logoWrap}><Logo size={52} showText={false} /></div>
      <h2 style={S.title}>Password Berhasil Diperbarui</h2>
      <Steps />
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
        <p style={{ color: '#555', fontSize: 14, lineHeight: 1.6 }}>
          Password akun <strong>{email}</strong> telah diperbarui.<br />
          Silakan login dengan password baru kamu.
        </p>
      </div>
      <button style={{ ...S.primaryBtn, background: '#1a5276' }} onClick={() => onSwitch('login')}>
        Kembali Login
      </button>
    </>
  );
}

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────
export default function AuthPage({ onLogin, onRegister, onForgotPassword }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'forgot'
  const brandItems = Array.from({ length: 300 }, (_, i) => BRANDS[i % BRANDS.length]);

  // Wrap onLogin so social buttons also get an account created if new
  const handleLogin = (email, password) => {
    if (password === '___social___') {
      // Auto-register social accounts
      const accounts = JSON.parse(localStorage.getItem('sportiva_accounts') || '{}');
      if (!accounts[email.toLowerCase()]) {
        onRegister(email, 'social_auto', email.split('@')[0]);
      }
      return onLogin(email, 'social_auto');
    }
    return onLogin(email, password);
  };

  return (
    <div style={S.page}>
      <div style={S.brandBg}>
        {brandItems.map((b, i) => <span key={i} style={S.brandItem}>{b}</span>)}
      </div>
      <div style={S.card}>
        {mode === 'login'    && <LoginPanel    onLogin={handleLogin} onSwitch={setMode} onForgot={() => setMode('forgot')} />}
        {mode === 'register' && <RegisterPanel onRegister={onRegister} onSwitch={setMode} />}
        {mode === 'forgot'   && <ForgotPanel   onForgotPassword={onForgotPassword} onSwitch={setMode} />}
      </div>
    </div>
  );
}
