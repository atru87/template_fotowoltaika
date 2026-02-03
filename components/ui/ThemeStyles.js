'use client';

export default function ThemeStyles({ theme, colors }) {
  return (
    <style jsx global>{`
      body {
        background: ${theme?.background || '#0a0f1a'};
        color: ${theme?.textPrimary || '#ffffff'};
      }
      
      .site-bg {
        background: ${theme?.backgroundGradient || 'linear-gradient(160deg, #0a0f1a 0%, #111827 50%, #0d1117 100%)'};
      }
      
      .site-bg::before {
        background:
          radial-gradient(ellipse 70% 55% at 15% 25%, ${theme?.glowColor || 'rgba(16,185,129,0.13)'} 0%, transparent 70%),
          radial-gradient(ellipse 50% 45% at 85% 65%, ${theme?.glowColorSecondary || 'rgba(16,185,129,0.09)'} 0%, transparent 70%),
          radial-gradient(ellipse 35% 40% at 55% 5%,  ${theme?.glowColorSecondary || 'rgba(251,191,36,0.07)'} 0%, transparent 70%);
      }
      
      .glass {
        background: ${theme?.glassBackground || 'rgba(255,255,255,0.06)'};
        border: 1px solid ${theme?.textPrimary === '#111827' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'};
      }
      
      .particle {
        background: ${colors?.primary || '#10b981'}80;
        box-shadow: 0 0 5px ${colors?.primary || '#10b981'}50;
      }
      
      .particle.gold {
        background: ${colors?.accent || '#fbbf24'}80;
        box-shadow: 0 0 5px ${colors?.accent || '#fbbf24'}50;
      }

      /* Optymalizacja dla sticky/fixed elementów */
      header.sticky, .fixed {
        will-change: transform;
        transform: translateZ(0);
      }

      /* For light themes, adjust text colors */
      ${theme?.textPrimary === '#111827' ? `
        .text-gray-400 {
          color: #6b7280 !important;
        }
        .text-gray-500 {
          color: #6b7280 !important;
        }
        h1, h2, h3, h4, h5, h6 {
          color: #111827 !important;
        }
      ` : ''}
    `}</style>
  );
}
