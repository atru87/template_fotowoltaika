'use client';
import useReveal from '@/components/ui/useReveal';

export default function Services({ data, colors, theme, template }) {
  const ref = useReveal(0.12);
  if (!data?.items) return null;

  const isLightTheme = theme?.textPrimary === '#111827';
  const primary = colors?.primary || '#10b981';
  const layout = template?.layout || 'classic';

  // Layout 1: Classic - 3 karty obok siebie
  if (layout === 'classic') {
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
              <div key={i} className={`p-8 transition-all duration-300 hover:-translate-y-2 rounded-2xl ${isLightTheme ? 'bg-white shadow-lg hover:shadow-xl' : 'glass-sm hover:border-emerald-400'}`}
                   style={!isLightTheme ? { border: '1px solid rgba(255,255,255,0.08)' } : {}}>
                <div className="text-4xl mb-5">{svc.icon}</div>
                <h3 className={`text-lg font-semibold mb-2 ${isLightTheme ? 'text-gray-900' : 'text-white'}`}>{svc.title}</h3>
                <p className={`text-sm leading-relaxed ${isLightTheme ? 'text-gray-600' : 'text-gray-400'}`}>{svc.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Layout 2: Minimal - horizontal scroll z dużymi ikonami
  if (layout === 'minimal') {
    return (
      <section ref={ref} className="reveal py-24" id="uslugi">
        <div className="container mx-auto px-4">
          <h2 className={`text-5xl font-bold mb-20 ${isLightTheme ? 'text-gray-900' : 'text-white'}`}>
            {data.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl">
            {data.items.map((svc, i) => (
              <div key={i} className="flex flex-col items-start gap-4">
                <div className="text-7xl">{svc.icon}</div>
                <h3 className={`text-2xl font-bold ${isLightTheme ? 'text-gray-900' : 'text-white'}`}>{svc.title}</h3>
                <p className={`text-lg ${isLightTheme ? 'text-gray-600' : 'text-gray-400'}`}>{svc.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Layout 3: Bold - duże karty z gradienty
  if (layout === 'bold') {
    return (
      <section ref={ref} className="reveal py-24" id="uslugi">
        <div className="container mx-auto px-4">
          <h2 className={`text-5xl md:text-6xl font-black text-center mb-6 ${isLightTheme ? 'text-gray-900' : 'text-white'}`}>
            {data.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto mt-16">
            {data.items.map((svc, i) => (
              <div key={i} className={`p-10 rounded-3xl transition-all duration-300 hover:scale-105 ${isLightTheme ? 'bg-white shadow-2xl' : 'glass-sm'}`}
                   style={{ background: `linear-gradient(135deg, ${primary}15, transparent)` }}>
                <div className="text-6xl mb-6">{svc.icon}</div>
                <h3 className={`text-2xl font-black mb-4 ${isLightTheme ? 'text-gray-900' : 'text-white'}`}>{svc.title}</h3>
                <p className={`text-lg ${isLightTheme ? 'text-gray-600' : 'text-gray-300'}`}>{svc.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Layout 4: Eco - lista z kolorowymi obwódkami
  if (layout === 'eco') {
    return (
      <section ref={ref} className="reveal py-24" id="uslugi">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${isLightTheme ? 'text-gray-900' : 'text-white'}`}>
              {data.title}
            </h2>
          </div>
          <div className="max-w-4xl mx-auto space-y-6">
            {data.items.map((svc, i) => (
              <div key={i} className={`flex items-start gap-6 p-8 rounded-2xl transition-all hover:scale-[1.02] ${isLightTheme ? 'bg-white shadow-lg' : 'glass-sm'}`}
                   style={{ borderLeft: `6px solid ${primary}` }}>
                <div className="text-5xl flex-shrink-0">{svc.icon}</div>
                <div>
                  <h3 className={`text-2xl font-bold mb-2 ${isLightTheme ? 'text-gray-900' : 'text-white'}`}>{svc.title}</h3>
                  <p className={`text-lg ${isLightTheme ? 'text-gray-600' : 'text-gray-400'}`}>{svc.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Layout 5: Tech - grid z hover effects
  if (layout === 'tech') {
    return (
      <section ref={ref} className="reveal py-24" id="uslugi">
        <div className="container mx-auto px-4">
          <h2 className={`text-5xl md:text-6xl font-black text-center mb-20 ${isLightTheme ? 'text-gray-900' : 'text-white'}`}>
            {data.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto">
            {data.items.map((svc, i) => (
              <div key={i} className={`relative group p-12 rounded-3xl transition-all duration-500 ${isLightTheme ? 'bg-white shadow-xl hover:shadow-2xl' : 'glass-sm'}`}
                   style={{ background: `linear-gradient(135deg, ${primary}08, transparent)` }}>
                <div className="absolute inset-0 rounded-3xl transition-opacity opacity-0 group-hover:opacity-100"
                     style={{ background: `linear-gradient(135deg, ${primary}20, transparent)` }} />
                <div className="relative z-10">
                  <div className="text-7xl mb-8 group-hover:scale-110 transition-transform">{svc.icon}</div>
                  <h3 className={`text-2xl font-black mb-4 ${isLightTheme ? 'text-gray-900' : 'text-white'}`}>{svc.title}</h3>
                  <p className={`text-lg ${isLightTheme ? 'text-gray-600' : 'text-gray-300'}`}>{svc.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return null;
}
