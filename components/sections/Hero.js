'use client';
import useReveal from '@/components/ui/useReveal';
import { useSearchParams } from 'next/navigation';

export default function Hero({ data, colors, theme, template }) {
  const ref = useReveal(0.1);
  const searchParams = useSearchParams();
  const templateId = searchParams?.get('template') || 'fotowoltaika';
  
  if (!data) return null;

  const primary   = colors?.primary   || '#10b981';
  const secondary = colors?.secondary || '#059669';
  const isLightTheme = theme?.textPrimary === '#111827';
  const layout = template?.layout || 'classic';

  // Layout 1: Classic - tekst po lewej, obrazek po prawej
  if (layout === 'classic') {
    return (
      <section ref={ref} className="reveal relative min-h-[600px] flex items-center py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
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
                <a href={`/kontakt?template=${templateId}`} className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-lg font-semibold text-white shadow-lg transition hover:opacity-90 hover:scale-105"
                   style={{ background: `linear-gradient(135deg,${primary},${secondary})` }}>
                  {data.cta} <span className="ml-2">→</span>
                </a>
                <a href="#uslugi" className={`inline-flex items-center justify-center px-8 py-4 rounded-xl text-lg font-semibold transition ${isLightTheme ? 'bg-white border-2 border-gray-300 text-gray-900 hover:border-gray-400' : 'border-2 border-white/20 text-white hover:border-white/40'}`}>
                  Poznaj nas <span className="ml-2">↓</span>
                </a>
              </div>
              <div className="flex gap-8 pt-8">
                <div>
                  <div className="text-3xl font-bold" style={{ color: isLightTheme ? primary : '#60a5fa' }}>450+</div>
                  <div className={`text-sm ${isLightTheme ? 'text-gray-600' : 'text-gray-400'}`}>Zrealizowanych<br/>Projektów</div>
                </div>
                <div>
                  <div className="text-3xl font-bold" style={{ color: isLightTheme ? primary : '#60a5fa' }}>15+</div>
                  <div className={`text-sm ${isLightTheme ? 'text-gray-600' : 'text-gray-400'}`}>Lat<br/>Doświadczenia</div>
                </div>
              </div>
            </div>
            <div className="relative z-10">
              {data.backgroundImage && (
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img src={data.backgroundImage} alt="Hero" className="w-full h-[500px] object-cover" />
                  <div className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(45deg, ${primary}15, transparent)` }} />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-20 blur-3xl pointer-events-none"
             style={{ background: `radial-gradient(circle, ${primary}30, transparent 70%)` }} />
      </section>
    );
  }

  // Layout 2: Minimal - centrowany tekst z dużym obrazkiem w tle
  if (layout === 'minimal') {
    return (
      <section ref={ref} className="reveal relative min-h-[700px] flex items-center py-32 overflow-hidden">
        {data.backgroundImage && (
          <div className="absolute inset-0 z-0">
            <img src={data.backgroundImage} alt="Hero Background" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent" />
          </div>
        )}
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight text-white">
              {data.title}
            </h1>
            <p className="text-xl md:text-2xl leading-relaxed text-gray-100">
              {data.subtitle}
            </p>
            <div className="flex justify-center gap-4 pt-6">
              <a href={`/kontakt?template=${templateId}`} className="px-10 py-5 rounded-full text-xl font-semibold text-white shadow-2xl transition hover:scale-105"
                 style={{ background: `linear-gradient(135deg,${primary},${secondary})` }}>
                {data.cta}
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Layout 3: Bold - obrazek po lewej, duży tekst po prawej
  if (layout === 'bold') {
    return (
      <section ref={ref} className="reveal relative min-h-[650px] flex items-center py-24 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative z-10 order-2 md:order-1">
              {data.backgroundImage && (
                <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                  <img src={data.backgroundImage} alt="Hero" className="w-full h-[550px] object-cover" />
                </div>
              )}
            </div>
            <div className="space-y-8 z-10 order-1 md:order-2">
              <h1 className={`text-5xl md:text-7xl font-black leading-tight ${isLightTheme ? 'text-gray-900' : 'text-white'}`}>
                {data.title}
              </h1>
              <p className={`text-xl md:text-2xl font-medium ${isLightTheme ? 'text-gray-700' : 'text-gray-200'}`}>
                {data.subtitle}
              </p>
              <div className="flex flex-col gap-4 pt-4">
                <a href={`/kontakt?template=${templateId}`} className="inline-flex items-center justify-center px-10 py-5 rounded-2xl text-xl font-bold text-white shadow-2xl transition hover:scale-105"
                   style={{ background: `linear-gradient(135deg,${primary},${secondary})` }}>
                  {data.cta} <span className="ml-3 text-2xl">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Layout 4: Eco - split screen z tekstem po lewej
  if (layout === 'eco') {
    return (
      <section ref={ref} className="reveal relative min-h-[600px] flex items-center overflow-hidden">
        <div className="grid md:grid-cols-2 w-full">
          <div className="flex items-center justify-center py-20 px-8 md:px-16">
            <div className="space-y-6 max-w-lg">
              <div className={`inline-block px-5 py-2 rounded-full text-sm font-bold ${isLightTheme ? 'bg-lime-200 text-lime-900' : 'bg-green-500/20 text-green-300'}`}>
                🌿 Eco Friendly
              </div>
              <h1 className={`text-4xl md:text-6xl font-bold leading-tight ${isLightTheme ? 'text-gray-900' : 'text-white'}`}>
                {data.title}
              </h1>
              <p className={`text-lg md:text-xl ${isLightTheme ? 'text-gray-700' : 'text-gray-300'}`}>
                {data.subtitle}
              </p>
              <div className="flex flex-col gap-3 pt-4">
                <a href={`/kontakt?template=${templateId}`} className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-lg font-bold text-white shadow-xl transition hover:scale-105"
                   style={{ background: `linear-gradient(135deg,${primary},${secondary})` }}>
                  {data.cta}
                </a>
              </div>
            </div>
          </div>
          <div className="relative h-[600px]">
            {data.backgroundImage && (
              <img src={data.backgroundImage} alt="Hero" className="w-full h-full object-cover" />
            )}
          </div>
        </div>
      </section>
    );
  }

  // Layout 5: Tech - full width z overlay
  if (layout === 'tech') {
    return (
      <section ref={ref} className="reveal relative min-h-[750px] flex items-center overflow-hidden">
        {data.backgroundImage && (
          <div className="absolute inset-0 z-0">
            <img src={data.backgroundImage} alt="Hero Background" className="w-full h-full object-cover opacity-30" />
            <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${primary}40, transparent)` }} />
          </div>
        )}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl space-y-10">
            <div className={`inline-block px-6 py-3 rounded-full text-base font-bold ${isLightTheme ? 'bg-purple-100 text-purple-900' : 'bg-purple-500/20 text-purple-200'} backdrop-blur-sm`}>
              ⚡ Next-Gen Technology
            </div>
            <h1 className={`text-6xl md:text-8xl font-black leading-tight ${isLightTheme ? 'text-gray-900' : 'text-white'}`}>
              {data.title}
            </h1>
            <p className={`text-2xl md:text-3xl font-light max-w-3xl ${isLightTheme ? 'text-gray-700' : 'text-gray-200'}`}>
              {data.subtitle}
            </p>
            <div className="flex flex-wrap gap-5 pt-6">
              <a href={`/kontakt?template=${templateId}`} className="px-12 py-6 rounded-2xl text-xl font-bold text-white shadow-2xl transition hover:scale-105"
                 style={{ background: `linear-gradient(135deg,${primary},${secondary})` }}>
                {data.cta}
              </a>
              <a href="#uslugi" className={`px-12 py-6 rounded-2xl text-xl font-bold transition ${isLightTheme ? 'bg-white/90 text-gray-900' : 'bg-white/10 text-white backdrop-blur-sm'} hover:scale-105`}>
                Dowiedz się więcej
              </a>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/40 to-transparent" />
      </section>
    );
  }

  return null;
}
