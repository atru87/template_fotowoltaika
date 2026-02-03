// app/admin/firma/page.js
'use client';

// Panel edycji danych firmy

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/admin/ProtectedRoute';

export default function CompanyAdmin() {
  const [company, setCompany] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    hours: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  
  // Wczytaj dane
  useEffect(() => {
    fetchCompany();
  }, []);
  
  const fetchCompany = async () => {
    try {
      const response = await fetch('/api/config?type=company');
      const data = await response.json();
      setCompany(data);
    } catch (error) {
      console.error('Error fetching company:', error);
    }
  };
  
  // Zapisz dane
  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'company', data: company })
      });
      
      if (response.ok) {
        alert('Dane firmy zapisane! Odśwież stronę aby zobaczyć zmiany.');
      }
    } catch (error) {
      alert('Błąd zapisu');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-12">
        
        <h1 className="text-4xl font-bold mb-8 text-gray-900">
          Dane firmy
        </h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            Edytuj informacje kontaktowe
          </h2>
          
          <form onSubmit={handleSave} className="space-y-4">
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nazwa firmy
              </label>
              <input
                type="text"
                value={company.name}
                onChange={(e) => setCompany({...company, name: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900 bg-white"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefon
              </label>
              <input
                type="tel"
                value={company.phone}
                onChange={(e) => setCompany({...company, phone: e.target.value})}
                placeholder="+48 123 456 789"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900 bg-white"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={company.email}
                onChange={(e) => setCompany({...company, email: e.target.value})}
                placeholder="kontakt@firma.pl"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900 bg-white"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adres
              </label>
              <input
                type="text"
                value={company.address}
                onChange={(e) => setCompany({...company, address: e.target.value})}
                placeholder="ul. Przykładowa 1, 00-000 Warszawa"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900 bg-white"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Godziny otwarcia
              </label>
              <input
                type="text"
                value={company.hours}
                onChange={(e) => setCompany({...company, hours: e.target.value})}
                placeholder="Pon-Pt: 8:00-16:00"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900 bg-white"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 w-full"
            >
              {isLoading ? 'Zapisywanie...' : 'Zapisz zmiany'}
            </button>
            
          </form>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-900">
              💡 <strong>Wskazówka:</strong> Te dane są używane globalnie w stopce i sekcjach kontaktowych na stronie.
            </p>
          </div>
          
        </div>
        
      </div>
    </ProtectedRoute>
  );
}
