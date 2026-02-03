'use client';
import { useRouter, useSearchParams } from 'next/navigation';

export default function TemplateSwitcher({ currentTemplate }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const templates = [
    { id: 'fotowoltaika', label: 'Szablon 1' },
    { id: 'fotowoltaika-v2', label: 'Szablon 2' },
    { id: 'fotowoltaika-v3', label: 'Szablon 3' },
    { id: 'fotowoltaika-v4', label: 'Szablon 4' },
    { id: 'fotowoltaika-v5', label: 'Szablon 5' }
  ];

  const handleTemplateChange = (templateId) => {
    const params = new URLSearchParams(searchParams);
    params.set('template', templateId);
    router.push(`/?${params.toString()}`);
    
    // Scrolluj na górę po zmianie szablonu (z małym opóźnieniem dla lepszego UX)
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-6 py-3 rounded-full shadow-2xl backdrop-blur-xl"
         style={{ 
           background: 'rgba(255, 255, 255, 0.95)',
           border: '1px solid rgba(0, 0, 0, 0.1)'
         }}>
      {templates.map((template) => (
        <button
          key={template.id}
          onClick={() => handleTemplateChange(template.id)}
          className={`px-5 py-2.5 rounded-full font-medium transition-all duration-200 text-sm ${
            currentTemplate === template.id
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg scale-105'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          {template.label}
        </button>
      ))}
    </div>
  );
}
