// components/sections/Gallery.js
// Galeria realizacji - grid zdjęć

import Image from 'next/image';

export default function Gallery({ items }) {
  if (!items || items.length === 0) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-12 text-gray-900">
            Nasze realizacje
          </h2>
          <p className="text-gray-600">
            Wkrótce pokażemy Ci nasze najlepsze projekty
          </p>
        </div>
      </section>
    );
  }
  
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
          Nasze realizacje
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item) => (
            <div 
              key={item.id}
              className="relative h-64 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition group"
            >
              <img
                src={item.url}
                alt={item.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition">
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
