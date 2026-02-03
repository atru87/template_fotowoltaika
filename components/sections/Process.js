'use client';
import useReveal from '@/components/ui/useReveal';

export default function Process({ data, colors, theme, template }) {
  const ref = useReveal(0.12);
  if (!data?.steps) return null;

  const primary = colors?.primary || '#10b981';
  const isLightTheme = theme?.textPrimary === '#111827';
  const layout = template?.layout || 'classic';

  // Layout 1: Classic - 3 karty + obrazek na dole
  if (layout === 'classic') {
    return (
      <section ref={ref} className="reveal py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${isLightTheme ? 'text-gray-900' : 'text-white'}`}>
              {data.title}
            </h2>
            <p className={`text-lg ${isLightTheme ? 'text-gray-600' : 'text-gray-400'} max-w-2xl mx-auto`}>
              {data.subtitle}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {data.steps.map((step, i) => (
              <div key={i} className={`relative p-8 rounded-2xl transition-all duration-300 hover:-translate-y-2 ${isLightTheme ? 'bg-white shadow-lg hover:shadow-xl' : 'glass-sm hover:border-white/20'}`}
                   style={!isLightTheme ? { border: '1px solid rgba(255,255,255,0.08)' } : {}}>
                <div className="absolute -top-4 left-8 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg"
                     style={{ background: `linear-gradient(135deg, ${primary}, ${colors?.secondary || primary})` }}>
                  {i + 1}
                </div>
                <div className="text-5xl mb-6 mt-4">{step.icon}</div>
                <h3 className={`text-xl font-bold mb-3 ${isLightTheme ? 'text-gray-900' : 'text-white'}`}>{step.title}</h3>
                <p className={`leading-relaxed ${isLightTheme ? 'text-gray-600' : 'text-gray-400'}`}>{step.description}</p>
              </div>
            ))}
          </div>
          {data.image && (
            <div className="mt-20 max-w-5xl mx-auto">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img src={data.image} alt="Process visualization" className="w-full h-[500px] object-cover" />
                <div className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(90deg, ${primary}15, transparent 50%)` }} />
              </div>
            </div>
          )}
        </div>
      </section>
    );
  }

  // Layout 2: Minimal - timeline pionowy z obrazkiem po prawej
  if (layout === 'minimal') {
    return (
      <section ref={ref} className="reveal py-24 relative">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${isLightTheme ? 'text-gray-900' : 'text-white'}`}>
                {data.title}
              </h2>
              <p className={`text-lg mb-12 ${isLightTheme ? 'text-gray-600' : 'text-gray-400'}`}>
                {data.subtitle}
              </p>
              <div className="space-y-8">
                {data.steps.map((step, i) => (
                  <div key={i} className="flex gap-6 items-start">
                    <div className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg"
                         style={{ background: `linear-gradient(135deg, ${primary}, ${colors?.secondary || primary})` }}>
                      {step.icon}
                    </div>
                    <div>
                      <h3 className={`text-2xl font-bold mb-2 ${isLightTheme ? 'text-gray-900' : 'text-white'}`}>{step.title}</h3>
                      <p className={`${isLightTheme ? 'text-gray-600' : 'text-gray-400'}`}>{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {data.image && (
              <div className="relative rounded-3xl overflow-hidden shadow-2xl sticky top-24">
                <img src={data.image} alt="Process" className="w-full h-[600px] object-cover" />
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  // Layout 3: Bold - duże numery z obrazkiem na górze
  if (layout === 'bold') {
    return (
      <section ref={ref} className="reveal py-24 relative">
        <div className="container mx-auto px-4">
          {data.image && (
            <div className="mb-20 max-w-6xl mx-auto">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img src={data.image} alt="Process" className="w-full h-[400px] object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8 text-white">
                  <h2 className="text-5xl md:text-6xl font-black mb-4">{data.title}</h2>
                  <p className="text-xl">{data.subtitle}</p>
                </div>
              </div>
            </div>
          )}
          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {data.steps.map((step, i) => (
              <div key={i} className={`text-center p-8 rounded-3xl ${isLightTheme ? 'bg-white shadow-xl' : 'glass-sm'}`}>
                <div className="text-8xl font-black mb-6" style={{ color: primary, opacity: 0.2 }}>{i + 1}</div>
                <div className="text-6xl mb-6">{step.icon}</div>
                <h3 className={`text-2xl font-black mb-4 ${isLightTheme ? 'text-gray-900' : 'text-white'}`}>{step.title}</h3>
                <p className={`text-lg ${isLightTheme ? 'text-gray-600' : 'text-gray-400'}`}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Layout 4: Eco - alternating z obrazkami między krokami
  if (layout === 'eco') {
    return (
      <section ref={ref} className="reveal py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${isLightTheme ? 'text-gray-900' : 'text-white'}`}>
              {data.title}
            </h2>
            <p className={`text-lg ${isLightTheme ? 'text-gray-600' : 'text-gray-400'} max-w-2xl mx-auto`}>
              {data.subtitle}
            </p>
          </div>
          <div className="max-w-4xl mx-auto space-y-16">
            {data.steps.map((step, i) => (
              <div key={i} className={`flex flex-col md:flex-row gap-8 items-center ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                <div className={`flex-1 p-8 rounded-2xl ${isLightTheme ? 'bg-white shadow-lg' : 'glass-sm'}`}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                         style={{ background: `linear-gradient(135deg, ${primary}, ${colors?.secondary || primary})` }}>
                      {i + 1}
                    </div>
                    <div className="text-5xl">{step.icon}</div>
                  </div>
                  <h3 className={`text-2xl font-bold mb-3 ${isLightTheme ? 'text-gray-900' : 'text-white'}`}>{step.title}</h3>
                  <p className={`${isLightTheme ? 'text-gray-600' : 'text-gray-400'}`}>{step.description}</p>
                </div>
                <div className="flex-1">
                  {data.image && i === 1 && (
                    <div className="relative rounded-2xl overflow-hidden shadow-xl">
                      <img src={data.image} alt="Process step" className="w-full h-[300px] object-cover" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Layout 5: Tech - horizontal scroll cards
  if (layout === 'tech') {
    return (
      <section ref={ref} className="reveal py-24 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className={`text-5xl md:text-6xl font-black mb-6 ${isLightTheme ? 'text-gray-900' : 'text-white'}`}>
              {data.title}
            </h2>
            <p className={`text-xl ${isLightTheme ? 'text-gray-600' : 'text-gray-400'} max-w-3xl mx-auto`}>
              {data.subtitle}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
            {data.steps.map((step, i) => (
              <div key={i} className={`relative p-10 rounded-3xl transition-all duration-300 hover:scale-105 ${isLightTheme ? 'bg-white shadow-2xl' : 'glass-sm'}`}
                   style={{ background: `linear-gradient(135deg, ${primary}10, transparent)` }}>
                <div className="text-7xl mb-6">{step.icon}</div>
                <div className="absolute top-6 right-6 w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-2xl"
                     style={{ background: `linear-gradient(135deg, ${primary}, ${colors?.secondary || primary})` }}>
                  {i + 1}
                </div>
                <h3 className={`text-2xl font-black mb-4 ${isLightTheme ? 'text-gray-900' : 'text-white'}`}>{step.title}</h3>
                <p className={`text-lg ${isLightTheme ? 'text-gray-600' : 'text-gray-300'}`}>{step.description}</p>
              </div>
            ))}
          </div>
          {data.image && (
            <div className="max-w-6xl mx-auto">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img src={data.image} alt="Technology" className="w-full h-[450px] object-cover opacity-80" />
                <div className="absolute inset-0" style={{ background: `linear-gradient(45deg, ${primary}40, transparent)` }} />
              </div>
            </div>
          )}
        </div>
      </section>
    );
  }

  return null;
}
