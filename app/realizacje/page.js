// app/realizacje/page.js
// Strona z pełną galerią realizacji

import Gallery from '@/components/sections/Gallery';
import { getGallery } from '@/lib/dataManager';

export const metadata = {
  title: 'Nasze realizacje',
};

export default function RealizacjePage() {
  const gallery = getGallery();
  
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gray-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">
            Nasze realizacje
          </h1>
          <p className="text-xl text-gray-300">
            Zobacz projekty, które wykonaliśmy dla naszych klientów
          </p>
        </div>
      </div>
      
      <Gallery items={gallery?.items || []} />
    </div>
  );
}
