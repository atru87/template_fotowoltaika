'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Header({ companyName, theme, templateId = 'fotowoltaika' }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 48);
    fn();
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const isLightTheme = theme?.textPrimary === '#111827';

  return (
    <header
      className="sticky top-0 z-40 transition-all duration-300"
      style={{
        background: scrolled
          ? isLightTheme 
            ? 'rgba(255,255,255,0.95)' 
            : 'rgba(10,15,26,0.75)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(14px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(14px)' : 'none',
        borderBottom: scrolled 
          ? isLightTheme 
            ? '1px solid rgba(0,0,0,0.08)' 
            : '1px solid rgba(255,255,255,0.08)' 
          : '1px solid transparent',
      }}
    >
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href={`/?template=${templateId}`} className={`text-xl font-bold tracking-tight ${
          isLightTheme ? 'text-gray-900' : 'text-white'
        }`}>
          {companyName || 'Twoja Firma'}
        </Link>

        <div className="flex gap-6">
          <Link href={`/?template=${templateId}`} className={`transition text-sm font-medium ${
            isLightTheme 
              ? 'text-gray-700 hover:text-gray-900' 
              : 'text-gray-300 hover:text-white'
          }`}>
            Strona główna
          </Link>
          <Link href={`/kontakt?template=${templateId}`} className={`transition text-sm font-medium ${
            isLightTheme 
              ? 'text-gray-700 hover:text-gray-900' 
              : 'text-gray-300 hover:text-white'
          }`}>
            Kontakt
          </Link>
          <Link href="/admin" className={`transition text-sm font-medium ${
            isLightTheme 
              ? 'text-gray-700 hover:text-gray-900' 
              : 'text-gray-300 hover:text-white'
          }`}>
            Admin
          </Link>
        </div>
      </nav>
    </header>
  );
}
