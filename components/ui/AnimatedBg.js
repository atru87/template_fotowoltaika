'use client';
// Generuje particles dynamicznie — bez żadnych dodatkowych packages
import { useEffect, useRef } from 'react';

const COUNT = 28;

export default function AnimatedBg() {
  const ref = useRef(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    for (let i = 0; i < COUNT; i++) {
      const p = document.createElement('div');
      p.className = 'particle' + (Math.random() < 0.18 ? ' gold' : '');

      const size = 2 + Math.random() * 3;
      p.style.width  = size + 'px';
      p.style.height = size + 'px';
      p.style.left   = Math.random() * 100 + '%';

      const dur = 9 + Math.random() * 14;          // 9-23s
      const del = -(Math.random() * dur);           // stagger via negative delay
      p.style.animationDuration = dur + 's';
      p.style.animationDelay    = del + 's';
      p.style.top = '100vh';                        // start at bottom

      container.appendChild(p);
    }
  }, []);

  return <div className="site-bg" ref={ref} />;
}
