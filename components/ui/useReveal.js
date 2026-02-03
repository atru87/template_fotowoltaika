'use client';
// Hook: dodaje .visible do elementu kiedy scrollujemy do niego
import { useEffect, useRef } from 'react';

export default function useReveal(threshold = 0.15) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    
    const obs = new IntersectionObserver(
      ([e]) => { 
        if (e.isIntersecting) {
          e.target.classList.add('visible'); 
        }
      },
      { threshold }
    );
    
    obs.observe(el);
    
    // Sprawdź natychmiast czy element jest już widoczny (ważne przy zmianie szablonu)
    const rect = el.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
    if (isVisible) {
      el.classList.add('visible');
    }
    
    return () => obs.disconnect();
  }, [threshold]);

  return ref;
}
