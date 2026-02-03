'use client';
import useReveal from '@/components/ui/useReveal';

export default function Services({ data, colors }) {
  const ref = useReveal(0.12);
  if (!data?.items) return null;

  return (
    <section ref={ref} className="reveal py-24" id="kontakt-sekcja">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-white mb-3">{data.title}</h2>
        <p className="text-center text-gray-400 mb-16 max-w-xl mx-auto">
          Kompleksowe rozwiązania dopasowane do Twoich potrzeb
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.items.map((svc, i) => (
            <div
              key={i}
              className="glass-sm p-8 hover:border-emerald-400 transition-all duration-300 hover:-translate-y-2"
              style={{ border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div className="text-4xl mb-5">{svc.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-2">{svc.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{svc.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
