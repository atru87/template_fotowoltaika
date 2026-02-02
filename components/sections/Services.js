// components/sections/Services.js
// Sekcja z listą usług/oferty

export default function Services({ data, colors }) {
  if (!data || !data.items) return null;
  
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
          {data.title}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {data.items.map((service, idx) => (
            <div 
              key={idx}
              className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition"
            >
              <div 
                className="text-5xl mb-4"
                style={{ color: colors?.primary || '#3b82f6' }}
              >
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                {service.title}
              </h3>
              <p className="text-gray-600">
                {service.description}
              </p>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
