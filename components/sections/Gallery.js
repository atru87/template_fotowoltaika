'use client';
import useReveal from '@/components/ui/useReveal';

export default function Gallery({ items, theme }) {
  const ref = useReveal(0.1);
  const isLightTheme = theme?.textPrimary === '#111827';

  return (
    <section ref={ref} className="reveal py-24">
      <div className="container mx-auto px-4">
        <h2 className={`text-4xl font-bold text-center mb-3 ${isLightTheme ? 'text-gray-900' : 'text-white'}`}>
          Nasze realizacje
        </h2>
        <p className={`text-center mb-16 ${isLightTheme ? 'text-gray-600' : 'text-gray-400'}`}>
          {items?.length ? 'Wybrane projekty z naszego portfoilio' : 'Wkrótce pokażemy Ci nasze najlepsze projekty'}
        </p>

        {items?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {items.map((item) => (
              <div
                key={item.id}
                className={`relative h-64 rounded-2xl overflow-hidden group cursor-pointer ${
                  isLightTheme ? 'shadow-lg' : ''
                }`}
                style={!isLightTheme ? { border: '1px solid rgba(255,255,255,0.08)' } : {}}
              >
                <img
                  src={item.url}
                  alt={item.alt}
                  className="w-full h-full object-cover opacity-65 group-hover:opacity-95 group-hover:scale-105 transition-all duration-500"
                />
                {/* bottom gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-white font-semibold">{item.alt}</p>
                  <p className="text-gray-300 text-xs mt-0.5">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`max-w-md mx-auto p-10 text-center rounded-2xl ${
            isLightTheme ? 'bg-gray-50 border border-gray-200' : 'glass-sm'
          }`}>
            <div className="text-5xl mb-4">📸</div>
            <p className={isLightTheme ? 'text-gray-600' : 'text-gray-400'}>
              Realizacje zostaną dodane wkrótce
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
