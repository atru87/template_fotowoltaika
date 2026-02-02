// app/page.js
// Strona główna - wczytuje szablon branżowy i wyświetla sekcje

import Hero from '@/components/sections/Hero';
import Services from '@/components/sections/Services';
import Gallery from '@/components/sections/Gallery';
import CTA from '@/components/sections/CTA';
import { readTemplate, getGallery, getCompanyData } from '@/lib/dataManager';

// WYBIERZ BRANŻĘ - zmień tutaj na: fotowoltaika, instalator, budowlana, medyczny, fryzjer, warsztat
const SELECTED_INDUSTRY = 'fotowoltaika';

export default async function HomePage() {
  // Wczytaj szablon branżowy
  const template = await readTemplate(SELECTED_INDUSTRY);
  
  // Wczytaj galerię i dane firmy
  const gallery = await getGallery();
  const company = await getCompanyData();
  
  if (!template) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Błąd wczytywania szablonu</p>
      </div>
    );
  }
  
  return (
    <>
      <Hero data={template.hero} colors={template.colors} />
      <Services data={template.services} colors={template.colors} />
      <Gallery items={gallery?.items || []} />
      <CTA data={template.cta} colors={template.colors} company={company} />
    </>
  );
}
