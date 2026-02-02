// components/sections/Hero.js
// Sekcja hero z dużym nagłówkiem i CTA

export default function Hero({ data, colors }) {
  if (!data) return null;
  
  return (
    <section 
      className="relative h-[600px] flex items-center justify-center text-white"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${data.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          {data.title}
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
          {data.subtitle}
        </p>
        <a
          href="#kontakt"
          className="inline-block px-8 py-4 rounded-lg text-lg font-semibold transition hover:opacity-90"
          style={{ backgroundColor: colors?.primary || '#3b82f6' }}
        >
          {data.cta}
        </a>
      </div>
    </section>
  );
}
