'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Header({ companyName }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 48);
    fn();
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <header
      className="sticky top-0 z-40 transition-all duration-300"
      style={{
        background: scrolled
          ? 'rgba(10,15,26,0.75)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(14px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(14px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
      }}
    >
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-white tracking-tight">
          {companyName || 'Twoja Firma'}
        </Link>

        <div className="flex gap-6">
          <Link href="/"        className="text-gray-300 hover:text-white transition text-sm font-medium">Strona główna</Link>
          <Link href="/kontakt" className="text-gray-300 hover:text-white transition text-sm font-medium">Kontakt</Link>
        </div>
      </nav>
    </header>
  );
}
