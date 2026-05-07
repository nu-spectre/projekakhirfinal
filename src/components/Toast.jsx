import React, { useEffect, useState } from 'react';

// Komponen Toast Notification
// msg: pesan yang ditampilkan
// visible: boolean apakah toast ditampilkan
export default function Toast({ msg, visible }) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 30,
        left: '50%',
        transform: `translateX(-50%) translateY(${visible ? 0 : 80}px)`,
        background: '#111',
        color: '#fff',
        padding: '12px 24px',
        borderRadius: 30,
        fontSize: 14,
        fontWeight: 500,
        zIndex: 9999,
        transition: 'transform .3s ease',
        pointerEvents: 'none',
        fontFamily: "'DM Sans', sans-serif",
        whiteSpace: 'nowrap',
      }}
    >
      {msg}
    </div>
  );
}
