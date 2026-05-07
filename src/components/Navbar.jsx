import React, { useState, useRef, useEffect } from 'react';
import Logo from './Logo';

const navLinks = [
  { id: 'home', label: 'Home' },
  { id: 'top', label: 'Top' },
  { id: 'bottom', label: 'Bottom' },
  { id: 'shoes', label: 'Shoes' },
  { id: 'contact', label: 'Contact' },
];

const styles = {
  nav: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    height: 60,
    background: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 40px',
    borderBottom: '1px solid #e8e8e8',
    fontFamily: "'DM Sans', sans-serif",
  },
  links: {
    display: 'flex',
    gap: 28,
    listStyle: 'none',
  },
  link: {
    textDecoration: 'none',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'color .2s',
    background: 'none',
    border: 'none',
    fontFamily: "'DM Sans', sans-serif",
    padding: 0,
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  searchWrap: {
    position: 'relative',
  },
  searchInput: {
    border: '1.5px solid #e8e8e8',
    borderRadius: 20,
    padding: '7px 16px 7px 36px',
    fontSize: 13,
    fontFamily: "'DM Sans', sans-serif",
    background: '#f5f5f5',
    transition: 'all .2s',
    outline: 'none',
  },
  searchIcon: {
    position: 'absolute',
    left: 11,
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#999',
    pointerEvents: 'none',
  },
  profileWrap: {
    position: 'relative',
  },
  profileBtn: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background .2s',
    position: 'relative',
  },
  // Dropdown menu
  dropdown: {
    position: 'absolute',
    top: 'calc(100% + 10px)',
    right: 0,
    background: '#fff',
    border: '1.5px solid #e8e8e8',
    borderRadius: 12,
    boxShadow: '0 8px 32px rgba(0,0,0,.12)',
    minWidth: 180,
    overflow: 'hidden',
    zIndex: 200,
  },
  dropdownItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '12px 18px',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    border: 'none',
    background: 'none',
    width: '100%',
    textAlign: 'left',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'background .15s',
    color: '#111',
  },
  dropdownDivider: {
    height: 1,
    background: '#e8e8e8',
    margin: '4px 0',
  },
};

export default function Navbar({ activePage, onNavigate, isLoggedIn, onSearch, favCount, onLogout }) {
  const [searchVal, setSearchVal] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchVal.trim()) {
      onSearch(searchVal.trim());
    }
  };

  const handleDropdownNav = (page) => {
    setDropdownOpen(false);
    onNavigate(page);
  };

  const handleLogoutClick = () => {
    setDropdownOpen(false);
    onLogout();
  };

  return (
    <nav style={styles.nav}>
      {/* Logo */}
      <div style={{ cursor: 'pointer' }} onClick={() => onNavigate('home')}>
        <Logo size={36} onNavigate={onNavigate} />
      </div>

      {/* Nav Links */}
      <ul style={styles.links}>
        {navLinks.map((link) => (
          <li key={link.id}>
            <button
              style={{
                ...styles.link,
                color: activePage === link.id ? '#111' : '#555',
                fontWeight: activePage === link.id ? 700 : 500,
              }}
              onClick={() => onNavigate(link.id)}
            >
              {link.label}
            </button>
          </li>
        ))}
      </ul>

      {/* Search + Profile */}
      <div style={styles.right}>
        {/* Search */}
        <div style={styles.searchWrap}>
          <span style={styles.searchIcon}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Cari produk..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            style={{
              ...styles.searchInput,
              borderColor: searchFocused ? '#1a5276' : '#e8e8e8',
              width: searchFocused ? 240 : 200,
              background: searchFocused ? '#fff' : '#f5f5f5',
            }}
          />
        </div>

        {/* Profile Button + Dropdown */}
        <div style={styles.profileWrap} ref={dropdownRef}>
          <button
            style={{
              ...styles.profileBtn,
              background: isLoggedIn ? '#1a5276' : '#e8e8e8',
            }}
            onClick={() => {
              if (!isLoggedIn) {
                onNavigate('auth');
              } else {
                setDropdownOpen((v) => !v);
              }
            }}
            title={isLoggedIn ? 'Akun' : 'Login'}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke={isLoggedIn ? '#fff' : 'currentColor'}
              strokeWidth="2"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            {/* Badge favorit */}
            {isLoggedIn && favCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: -4,
                  right: -4,
                  background: '#e74c3c',
                  color: '#fff',
                  borderRadius: '50%',
                  width: 16,
                  height: 16,
                  fontSize: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                }}
              >
                {favCount}
              </span>
            )}
          </button>

          {/* Dropdown — hanya muncul saat logged in */}
          {isLoggedIn && dropdownOpen && (
            <div style={styles.dropdown}>
              {/* Admin Panel */}
              <button
                style={styles.dropdownItem}
                onClick={() => handleDropdownNav('admin')}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#f5f5f5')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                </svg>
                Admin Panel
              </button>

              {/* Favorit */}
              <button
                style={styles.dropdownItem}
                onClick={() => handleDropdownNav('favorites')}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#f5f5f5')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                Favorit Saya
                {favCount > 0 && (
                  <span style={{
                    marginLeft: 'auto',
                    background: '#e74c3c',
                    color: '#fff',
                    borderRadius: 10,
                    padding: '1px 7px',
                    fontSize: 11,
                    fontWeight: 700,
                  }}>
                    {favCount}
                  </span>
                )}
              </button>

              <div style={styles.dropdownDivider} />

              {/* Logout */}
              <button
                style={{ ...styles.dropdownItem, color: '#e74c3c' }}
                onClick={handleLogoutClick}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#fff5f5')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
