// components/ui/Footer.js
// Stopka z danymi kontaktowymi firmy

export default function Footer({ company }) {
  if (!company) return null;
  
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Kolumna 1: Nazwa firmy */}
          <div>
            <h3 className="text-xl font-bold mb-4">{company.name}</h3>
            <p className="text-gray-400">
              Profesjonalne usługi na najwyższym poziomie
            </p>
          </div>
          
          {/* Kolumna 2: Kontakt */}
          <div>
            <h4 className="font-semibold mb-4">Kontakt</h4>
            <div className="space-y-2 text-gray-400">
              <p>📞 {company.phone}</p>
              <p>📧 {company.email}</p>
              <p>📍 {company.address}</p>
            </div>
          </div>
          
          {/* Kolumna 3: Godziny otwarcia */}
          <div>
            <h4 className="font-semibold mb-4">Godziny otwarcia</h4>
            <p className="text-gray-400">{company.hours}</p>
          </div>
          
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 {company.name}. Wszelkie prawa zastrzeżone.</p>
        </div>
      </div>
    </footer>
  );
}
