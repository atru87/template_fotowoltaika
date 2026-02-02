// components/ui/Header.js
// Nagłówek z logo i nawigacją

import Link from 'next/link';

export default function Header({ companyName }) {
  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-900">
          {companyName || 'Twoja Firma'}
        </Link>
        
        <div className="flex gap-6">
          <Link 
            href="/" 
            className="text-gray-700 hover:text-gray-900 transition"
          >
            Strona główna
          </Link>
          <Link 
            href="/realizacje" 
            className="text-gray-700 hover:text-gray-900 transition"
          >
            Realizacje
          </Link>
        </div>
      </nav>
    </header>
  );
}
