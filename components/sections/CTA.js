'use client';
import useReveal from '@/components/ui/useReveal';

export default function CTA({ data, colors, company, theme }) {
  const ref = useReveal(0.15);
  if (!data) return null;

  const primary   = colors?.primary   || '#10b981';
  const secondary = colors?.secondary || '#059669';
  const isLightTheme = theme?.textPrimary === '#111827';

  return (
    <section ref={ref} className="reveal py-24" id="kontakt">
      <div className="container mx-auto px-4">
        <div className={`max-w-3xl mx-auto p-8 md:p-14 text-center rounded-2xl ${
          isLightTheme ? 'bg-white shadow-xl' : 'glass'
        }`}>
          <h2 className={`text-4xl font-bold mb-3 ${isLightTheme ? 'text-gray-900' : 'text-white'}`}>
            {data.title}
          </h2>
          <p className={`text-lg mb-8 max-w-xl mx-auto ${isLightTheme ? 'text-gray-600' : 'text-gray-300'}`}>
            {data.description}
          </p>

          {company && (
            <div className={`rounded-xl p-5 max-w-sm mx-auto mb-8 text-left space-y-2 ${
              isLightTheme ? 'bg-gray-50 border border-gray-200' : 'glass-sm'
            }`}>
              <p className={isLightTheme ? 'text-gray-600' : 'text-gray-300'}>
                📞 <span className={`font-medium ${isLightTheme ? 'text-gray-900' : 'text-white'}`}>{company.phone}</span>
              </p>
              {company.email && (
                <p className={isLightTheme ? 'text-gray-600' : 'text-gray-300'}>
                  📧 <span className={`font-medium ${isLightTheme ? 'text-gray-900' : 'text-white'}`}>{company.email}</span>
                </p>
              )}
              <p className={isLightTheme ? 'text-gray-600' : 'text-gray-300'}>
                📍 <span className={`font-medium ${isLightTheme ? 'text-gray-900' : 'text-white'}`}>{company.address}</span>
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={`tel:${company?.phone?.replace(/\s/g,'')}`}
              className="inline-block px-8 py-4 rounded-xl text-lg font-semibold text-white shadow-lg transition hover:opacity-90"
              style={{ background: `linear-gradient(135deg,${primary},${secondary})` }}
            >
              {data.buttonText}
            </a>
            <a
              href="/kontakt"
              className={`inline-block px-8 py-4 rounded-xl text-lg font-semibold transition ${
                isLightTheme 
                  ? 'bg-white border-2 border-gray-300 text-gray-900 hover:border-gray-400' 
                  : 'border-2 border-white/15 text-white hover:border-white/35'
              }`}
            >
              Formularz kontaktu →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
