'use client';
import useReveal from '@/components/ui/useReveal';

export default function Hero({ data, colors }) {
  const ref = useReveal(0.1);
  if (!data) return null;

  const primary   = colors?.primary   || '#10b981';
  const secondary = colors?.secondary || '#059669';

  return (
    <section ref={ref} className="reveal relative min-h-[580px] flex items-center justify-center">
      {/* very subtle photo wash */}
      {data.backgroundImage && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${data.backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.1,
          }}
        />
      )}

      <div className="relative z-10 container mx-auto px-4 text-center py-28">
        <div className="glass max-w-3xl mx-auto px-6 py-14 md:px-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-5 grad-text leading-tight">
            {data.title}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-xl mx-auto">
            {data.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/kontakt"
              className="inline-block px-8 py-4 rounded-xl text-lg font-semibold text-white shadow-lg transition hover:opacity-90"
              style={{ background: `linear-gradient(135deg,${primary},${secondary})` }}
            >
              {data.cta}
            </a>
            <a
              href="#kontakt-sekcja"
              className="inline-block px-8 py-4 rounded-xl text-lg font-semibold text-white border border-white/15 hover:border-white/35 transition"
            >
              Poznaj nas ↓
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
