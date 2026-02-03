'use client';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import Link from 'next/link';

const tiles = [
  { href: '/admin/realizacje',  icon: '📸', title: 'Realizacje',       desc: 'Zarządzaj galerią zdjęć' },
  { href: '/admin/bot',         icon: '🤖', title: 'Bot / Triggery',   desc: 'Triggery i testy czatu' },
  { href: '/admin/firma',       icon: '🏢', title: 'Dane firmy',       desc: 'Informacje kontaktowe' },
  { href: '/admin/ustawienia',  icon: '⚙️', title: 'Ustawienia',       desc: 'AI key, SMTP, wiadomości' },
  { href: '/',                  icon: '🌐', title: 'Zobaczyć stronę',  desc: 'Podgląd strony publicznej' },
];

export default function AdminDashboard() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Panel administracyjny</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {tiles.map(t => (
            <Link key={t.href} href={t.href}>
              <div className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer border border-gray-100 hover:border-blue-300">
                <div className="text-3xl mb-3">{t.icon}</div>
                <h2 className="text-lg font-semibold text-gray-900">{t.title}</h2>
                <p className="text-gray-500 text-sm mt-0.5">{t.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
}
