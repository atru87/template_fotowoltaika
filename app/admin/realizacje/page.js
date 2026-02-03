// app/admin/realizacje/page.js
'use client';

// Panel zarządzania galerią realizacji

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/admin/ProtectedRoute';

export default function GalleryAdmin() {
  const [gallery, setGallery] = useState([]);
  const [newImage, setNewImage] = useState({ url: '', alt: '' });
  const [isLoading, setIsLoading] = useState(false);
  
  // Wczytaj galerię
  useEffect(() => {
    fetchGallery();
  }, []);
  
  const fetchGallery = async () => {
    try {
      const response = await fetch('/api/gallery');
      const data = await response.json();
      setGallery(data.items || []);
    } catch (error) {
      console.error('Error fetching gallery:', error);
    }
  };
  
  // Dodaj zdjęcie
  const handleAdd = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newImage)
      });
      
      if (response.ok) {
        setNewImage({ url: '', alt: '' });
        fetchGallery();
        alert('Zdjęcie dodane!');
      }
    } catch (error) {
      alert('Błąd dodawania zdjęcia');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Usuń zdjęcie
  const handleDelete = async (id) => {
    if (!confirm('Czy na pewno usunąć to zdjęcie?')) return;
    
    try {
      const response = await fetch(`/api/gallery?id=${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchGallery();
        alert('Zdjęcie usunięte!');
      }
    } catch (error) {
      alert('Błąd usuwania zdjęcia');
    }
  };
  
  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-12">
        
        <h1 className="text-4xl font-bold mb-8 text-gray-900">
          Zarządzanie realizacjami
        </h1>
        
        {/* Formularz dodawania */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Dodaj nowe zdjęcie</h2>
          
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL zdjęcia
              </label>
              <input
                type="url"
                value={newImage.url}
                onChange={(e) => setNewImage({...newImage, url: e.target.value})}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900 bg-white"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Użyj serwisu jak Unsplash, Imgur lub własnego hostingu
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Opis zdjęcia (alt)
              </label>
              <input
                type="text"
                value={newImage.alt}
                onChange={(e) => setNewImage({...newImage, alt: e.target.value})}
                placeholder="Realizacja dla klienta X"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900 bg-white"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              {isLoading ? 'Dodawanie...' : 'Dodaj zdjęcie'}
            </button>
          </form>
        </div>
        
        {/* Lista zdjęć */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Aktualne zdjęcia</h2>
          
          {gallery.length === 0 ? (
            <p className="text-gray-600">Brak zdjęć w galerii</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {gallery.map((item) => (
                <div key={item.id} className="relative group">
                  <img
                    src={item.url}
                    alt={item.alt}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="mt-2 flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{item.alt}</p>
                      <p className="text-xs text-gray-500">{item.date}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition"
                    >
                      Usuń
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
      </div>
    </ProtectedRoute>
  );
}
