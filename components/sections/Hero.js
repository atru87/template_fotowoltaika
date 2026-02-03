'use client';
import useReveal from '@/components/ui/useReveal';

export default function Hero({ data, colors, theme }) {
  const ref = useReveal(0.1);
  if (!data) return null;

  const primary   = colors?.primary   || '#10b981';
  const secondary = colors?.secondary || '#059669';
  const isLightTheme = theme?.textPrimary === '#111827';

  return (
    <section ref={ref} className="reveal relative min-h-[600px] flex items-center py-20 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* Left side - Text content */}
          <div className="space-y-6 z-10">
            <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold mb-2 ${isLightTheme ? 'bg-cyan-100 text-cyan-800' : 'bg-white/10 text-white'}`}>
              Lider Jakości w Regionie
            </div>
            
            <h1 className={`text-4xl md:text-6xl font-bold leading-tight ${isLightTheme ? 'text-gray-900' : 'text-white'}`}>
              {data.title}
            </h1>
            
            <p className={`text-lg md:text-xl leading-relaxed ${isLightTheme ? 'text-gray-700' : 'text-gray-300'}`}>
              {data.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a
                href="/kontakt"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-lg font-semibold text-white shadow-lg transition hover:opacity-90 hover:scale-105"
                style={{ background: `linear-gradient(135deg,${primary},${secondary})` }}
              >
                {data.cta}
                <span className="ml-2">→</span>
              </a>
              <a
                href="#uslugi"
                className={`inline-flex items-center justify-center px-8 py-4 rounded-xl text-lg font-semibold transition ${
                  isLightTheme 
                    ? 'bg-white border-2 border-gray-300 text-gray-900 hover:border-gray-400' 
                    : 'border-2 border-white/20 text-white hover:border-white/40'
                }`}
              >
                Poznaj nas
                <span className="ml-2">↓</span>
              </a>
            </div>

            {/* Stats badge */}
            <div className="flex gap-8 pt-8">
              <div>
                <div 
                  className="text-3xl font-bold"
                  style={{ color: isLightTheme ? primary : '#60a5fa' }}
                >
                  450+
                </div>
                <div className={`text-sm ${isLightTheme ? 'text-gray-600' : 'text-gray-400'}`}>
                  Zrealizowanych<br/>Projektów
                </div>
              </div>
              <div>
                <div 
                  className="text-3xl font-bold"
                  style={{ color: isLightTheme ? primary : '#60a5fa' }}
                >
                  15+
                </div>
                <div className={`text-sm ${isLightTheme ? 'text-gray-600' : 'text-gray-400'}`}>
                  Lat<br/>Doświadczenia
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Image */}
          <div className="relative z-10">
            {data.backgroundImage && (
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src={data.backgroundImage} 
                  alt="Hero" 
                  className="w-full h-[500px] object-cover"
                />
                {/* Overlay gradient for better readability */}
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `linear-gradient(45deg, ${primary}15, transparent)`
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: `radial-gradient(circle, ${primary}30, transparent 70%)` }}
      />
    </section>
  );
}
