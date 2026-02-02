// app/admin/page.js
'use client';

// Dashboard panelu administracyjnego

import ProtectedRoute from '@/components/admin/ProtectedRoute';
import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-12">
        
        <h1 className="text-4xl font-bold mb-8 text-gray-900">
          Panel administracyjny
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <Link href="/admin/realizacje">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition cursor-pointer">
              <div className="text-4xl mb-4">📸</div>
              <h2 className="text-xl font-semibold mb-2">Realizacje</h2>
              <p className="text-gray-600">
                Zarządzaj galerią zdjęć
              </p>
            </div>
          </Link>
          
          <Link href="/admin/bot">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition cursor-pointer">
              <div className="text-4xl mb-4">🤖</div>
              <h2 className="text-xl font-semibold mb-2">Bot AI</h2>
              <p className="text-gray-600">
                Konfiguruj czat i triggery
              </p>
            </div>
          </Link>
          
          <Link href="/admin/firma">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition cursor-pointer">
              <div className="text-4xl mb-4">🏢</div>
              <h2 className="text-xl font-semibold mb-2">Dane firmy</h2>
              <p className="text-gray-600">
                Edytuj informacje kontaktowe
              </p>
            </div>
          </Link>
          
          <Link href="/">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition cursor-pointer">
              <div className="text-4xl mb-4">🌐</div>
              <h2 className="text-xl font-semibold mb-2">Zobacz stronę</h2>
              <p className="text-gray-600">
                Przejdź do strony publicznej
              </p>
            </div>
          </Link>
          
        </div>
        
      </div>
    </ProtectedRoute>
  );
}
