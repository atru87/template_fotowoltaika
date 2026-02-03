'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminNav() {
  const pathname = usePathname();

  const links = [
    { href: '/admin',              label: 'Panel' },
    { href: '/admin/realizacje',   label: 'Realizacje' },
    { href: '/admin/firma',        label: 'Dane firmy' },
    { href: '/admin/bot',          label: 'Bot / Triggery' },
    { href: '/admin/ustawienia',   label: 'Ustawienia' },
  ];

  const logout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/admin/login';
  };

  return (
    <nav className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <div className="flex gap-5 flex-wrap">
            {links.map(l => (
              <Link key={l.href} href={l.href}
                className={`text-sm transition ${pathname === l.href ? 'text-white font-semibold border-b-2 border-white pb-0.5' : 'text-gray-400 hover:text-white'}`}>
                {l.label}
              </Link>
            ))}
          </div>
          <button onClick={logout} className="bg-red-600 hover:bg-red-700 px-4 py-1.5 rounded transition text-sm">Wyloguj</button>
        </div>
      </div>
    </nav>
  );
}
