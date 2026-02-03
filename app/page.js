import Header   from '@/components/ui/Header';
import Hero     from '@/components/sections/Hero';
import Services from '@/components/sections/Services';
import Process  from '@/components/sections/Process';
import Gallery  from '@/components/sections/Gallery';
import CTA      from '@/components/sections/CTA';
import Footer   from '@/components/ui/Footer';
import ThemeStyles from '@/components/ui/ThemeStyles';
import TemplateSwitcher from '@/components/ui/TemplateSwitcher';
import { readTemplate, getGallery, getCompanyData } from '@/lib/dataManager';

// ========================================
// KONFIGURACJA SZABLONU
// ========================================
// template = 0  -> Pokazuje menu z możliwością zmiany szablonu
// template = 1  -> Zawsze pokazuje szablon 1 (fotowoltaika)
// template = 2  -> Zawsze pokazuje szablon 2 (fotowoltaika-v2)
// template = 3  -> Zawsze pokazuje szablon 3 (fotowoltaika-v3)
// template = 4  -> Zawsze pokazuje szablon 4 (fotowoltaika-v4)
// template = 5  -> Zawsze pokazuje szablon 5 (fotowoltaika-v5)

const TEMPLATE_MODE = 0;  // <-- ZMIEŃ TU: 0 = menu, 1-5 = konkretny szablon

const templateMap = {
  0: 'fotowoltaika',        // domyślny gdy menu
  1: 'fotowoltaika',
  2: 'fotowoltaika-v2',
  3: 'fotowoltaika-v3',
  4: 'fotowoltaika-v4',
  5: 'fotowoltaika-v5'
};

export default async function HomePage({ searchParams }) {
  // Logika wyboru szablonu
  let templateId;
  let showSwitcher = false;
  
  if (TEMPLATE_MODE === 0) {
    // Tryb menu - użytkownik może przełączać szablony
    templateId = searchParams?.template || templateMap[0];
    showSwitcher = true;
  } else {
    // Tryb stały - zawsze ten sam szablon
    templateId = templateMap[TEMPLATE_MODE] || templateMap[1];
    showSwitcher = false;
  }
  
  const template = await readTemplate(templateId);
  const gallery  = await getGallery();
  const company  = await getCompanyData();

  if (!template) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <p>Błąd wczytywania szablonu</p>
      </div>
    );
  }

  const theme = template.theme || {};

  return (
    <>
      {/* Dynamic theme styles */}
      <ThemeStyles theme={theme} colors={template.colors} />
      
      {/* Template switcher - tylko gdy TEMPLATE_MODE = 0 */}
      {showSwitcher && <TemplateSwitcher currentTemplate={templateId} />}
      
      <Header companyName={company?.name} theme={theme} />
      <Hero     key={`hero-${templateId}`} data={template.hero}     colors={template.colors} theme={theme} template={template} />
      <Services key={`services-${templateId}`} data={template.services} colors={template.colors} theme={theme} template={template} />
      <Process  key={`process-${templateId}`} data={template.process}  colors={template.colors} theme={theme} template={template} />
      <Gallery  items={gallery?.items || []} theme={theme} />
      <CTA      data={template.cta}      colors={template.colors} theme={theme} company={company} />
      <Footer   company={company} theme={theme} />
    </>
  );
}
