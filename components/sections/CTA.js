// components/sections/CTA.js
// Sekcja Call-to-Action z danymi kontaktowymi

export default function CTA({ data, colors, company }) {
  if (!data) return null;
  
  return (
    <section 
      className="py-20 text-white"
      style={{ backgroundColor: colors?.primary || '#3b82f6' }}
    >
      <div className="container mx-auto px-4 text-center" id="kontakt">
        
        <h2 className="text-4xl font-bold mb-4">
          {data.title}
        </h2>
        
        <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
          {data.description}
        </p>
        
        {company && (
          <div className="bg-white bg-opacity-20 rounded-lg p-8 max-w-lg mx-auto mb-8">
            <div className="space-y-3 text-lg">
              <p>📞 {company.phone}</p>
              <p>📧 {company.email}</p>
              <p>📍 {company.address}</p>
            </div>
          </div>
        )}
        
        <a
          href={`tel:${company?.phone}`}
          className="inline-block bg-white px-8 py-4 rounded-lg text-lg font-semibold transition hover:opacity-90"
          style={{ color: colors?.primary || '#3b82f6' }}
        >
          {data.buttonText}
        </a>
        
      </div>
    </section>
  );
}
