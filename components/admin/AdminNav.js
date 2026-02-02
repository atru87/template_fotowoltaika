// components/admin/AdminNav.js
'use client';

// Nawigacja w panelu admina

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminNav() {
  const pathname = usePathname();
  
  const links = [
    { href: '/admin', label: 'Panel' },
    { href: '/admin/realizacje', label: 'Realizacje' },
    { href: '/admin/bot', label: 'Bot AI' },
    { href: '/admin/firma', label: 'Dane firmy' }
  ];
  
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/admin/login';
  };
  
  return (
    <nav className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          
          <div className="flex gap-6">
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`hover:text-gray-300 transition ${
                  pathname === link.href ? 'font-bold' : ''
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition"
          >
            Wyloguj
          </button>
          
        </div>
      </div>
    </nav>
  );
}
