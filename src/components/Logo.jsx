import React from 'react';
import logo from '../assets/sportiva.png'; // pastikan nama file sama

export default function Logo({ size = 40, showText = false, style = {}, onNavigate }) {
  const handleClick = () => {
    if (onNavigate) {
      onNavigate('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div
      onClick={handleClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        cursor: 'pointer',
        ...style
      }}
    >
      <img
        src={logo}
        alt="Sportiva Logo"
        style={{
          height: size,
          width: 'auto',
          objectFit: 'contain'
        }}
      />

      {showText && (
        <span
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: size * 0.7,
            letterSpacing: 2,
            color: '#ffffff'
          }}
        >
          SPORTIVA
        </span>
      )}
    </div>
  );
}