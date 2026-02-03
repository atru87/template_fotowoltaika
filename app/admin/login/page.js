// app/admin/login/page.js
'use client';

// Strona logowania do panelu administracyjnego

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.error || 'Błąd logowania');
        setIsLoading(false);
        return;
      }
      
      // Zapisz token i przekieruj
      localStorage.setItem('authToken', data.token);
      router.push('/admin');
      
    } catch (err) {
      setError('Błąd połączenia z serwerem');
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">
          Panel administracyjny
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nazwa użytkownika
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900 bg-white"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hasło
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900 bg-white"
              required
            />
          </div>
          
          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {isLoading ? 'Logowanie...' : 'Zaloguj się'}
          </button>
          
        </form>
        
        <p className="mt-4 text-center text-sm text-gray-600">
          Domyślne dane: admin / admin123
        </p>
        
      </div>
    </div>
  );
}
