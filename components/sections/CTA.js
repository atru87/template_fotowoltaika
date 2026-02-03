'use client';
import useReveal from '@/components/ui/useReveal';

export default function CTA({ data, colors, company }) {
  const ref = useReveal(0.15);
  if (!data) return null;

  const primary   = colors?.primary   || '#10b981';
  const secondary = colors?.secondary || '#059669';

  return (
    <section ref={ref} className="reveal py-24" id="kontakt">
      <div className="container mx-auto px-4">
        <div className="glass max-w-3xl mx-auto p-8 md:p-14 text-center">
          <h2 className="text-4xl font-bold text-white mb-3">{data.title}</h2>
          <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">{data.description}</p>

          {company && (
            <div className="glass-sm rounded-xl p-5 max-w-sm mx-auto mb-8 text-left space-y-2">
              <p className="text-gray-300">📞 <span className="text-white font-medium">{company.phone}</span></p>
              {company.email && <p className="text-gray-300">📧 <span className="text-white font-medium">{company.email}</span></p>}
              <p className="text-gray-300">📍 <span className="text-white font-medium">{company.address}</span></p>
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
              className="inline-block px-8 py-4 rounded-xl text-lg font-semibold text-white border border-white/15 hover:border-white/35 transition"
            >
              Formularz kontaktu →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
