export default function Footer({ company }) {
  if (!company) return null;

  return (
    <footer className="py-14">
      <div className="container mx-auto px-4">
        <div className="glass-sm p-8 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold text-white mb-3">{company.name}</h3>
              <p className="text-gray-500 text-sm">Profesjonalne usługi na najwyższym poziomie</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-3">Kontakt</h4>
              <div className="space-y-1.5 text-gray-400 text-sm">
                <p>📞 {company.phone}</p>
                {company.email && <p>📧 {company.email}</p>}
                <p>📍 {company.address}</p>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-3">Godziny</h4>
              <p className="text-gray-400 text-sm">{company.hours}</p>
            </div>
          </div>
          <div className="border-t border-white/8 mt-8 pt-5 text-center text-gray-600 text-xs">
            &copy; 2026 {company.name}. Wszelkie prawa zastrzeżone.
          </div>
        </div>
      </div>
    </footer>
  );
}
