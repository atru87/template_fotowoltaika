'use client';
import useReveal from '@/components/ui/useReveal';

export default function Process({ data, colors, theme }) {
  const ref = useReveal(0.12);
  if (!data?.steps) return null;

  const primary = colors?.primary || '#10b981';
  const isLightTheme = theme?.textPrimary === '#111827';

  return (
    <section ref={ref} className="reveal py-24 relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${isLightTheme ? 'text-gray-900' : 'text-white'}`}>
            {data.title}
          </h2>
          <p className={`text-lg ${isLightTheme ? 'text-gray-600' : 'text-gray-400'} max-w-2xl mx-auto`}>
            {data.subtitle}
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {data.steps.map((step, i) => (
            <div
              key={i}
              className={`relative p-8 rounded-2xl transition-all duration-300 hover:-translate-y-2 ${
                isLightTheme 
                  ? 'bg-white shadow-lg hover:shadow-xl' 
                  : 'glass-sm hover:border-white/20'
              }`}
              style={!isLightTheme ? { border: '1px solid rgba(255,255,255,0.08)' } : {}}
            >
              {/* Step number */}
              <div 
                className="absolute -top-4 left-8 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg"
                style={{ background: `linear-gradient(135deg, ${primary}, ${colors?.secondary || primary})` }}
              >
                {i + 1}
              </div>

              {/* Icon */}
              <div className="text-5xl mb-6 mt-4">
                {step.icon}
              </div>

              {/* Content */}
              <h3 className={`text-xl font-bold mb-3 ${isLightTheme ? 'text-gray-900' : 'text-white'}`}>
                {step.title}
              </h3>
              <p className={`leading-relaxed ${isLightTheme ? 'text-gray-600' : 'text-gray-400'}`}>
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Optional image section below */}
        {data.image && (
          <div className="mt-20 max-w-5xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={data.image} 
                alt="Process visualization" 
                className="w-full h-auto max-h-[500px] object-contain bg-gradient-to-br from-gray-50 to-gray-100"
              />
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `linear-gradient(90deg, ${primary}15, transparent 50%)`
                }}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
