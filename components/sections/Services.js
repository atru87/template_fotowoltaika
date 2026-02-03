'use client';
import useReveal from '@/components/ui/useReveal';

export default function Services({ data, colors, theme }) {
  const ref = useReveal(0.12);
  if (!data?.items) return null;

  const isLightTheme = theme?.textPrimary === '#111827';
  const primary = colors?.primary || '#10b981';

  return (
    <section ref={ref} className="reveal py-24" id="uslugi">
      <div className="container mx-auto px-4">
        <h2 className={`text-4xl font-bold text-center mb-3 ${isLightTheme ? 'text-gray-900' : 'text-white'}`}>
          {data.title}
        </h2>
        <p className={`text-center mb-16 max-w-xl mx-auto ${isLightTheme ? 'text-gray-600' : 'text-gray-400'}`}>
          Kompleksowe rozwiązania dopasowane do Twoich potrzeb
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.items.map((svc, i) => (
            <div
              key={i}
              className={`p-8 transition-all duration-300 hover:-translate-y-2 rounded-2xl ${
                isLightTheme 
                  ? 'bg-white shadow-lg hover:shadow-xl' 
                  : 'glass-sm hover:border-emerald-400'
              }`}
              style={!isLightTheme ? { border: '1px solid rgba(255,255,255,0.08)' } : {}}
            >
              <div className="text-4xl mb-5">{svc.icon}</div>
              <h3 className={`text-lg font-semibold mb-2 ${isLightTheme ? 'text-gray-900' : 'text-white'}`}>
                {svc.title}
              </h3>
              <p className={`text-sm leading-relaxed ${isLightTheme ? 'text-gray-600' : 'text-gray-400'}`}>
                {svc.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
