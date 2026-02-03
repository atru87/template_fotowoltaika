import Header   from '@/components/ui/Header';
import Hero     from '@/components/sections/Hero';
import Services from '@/components/sections/Services';
import Process  from '@/components/sections/Process';
import Gallery  from '@/components/sections/Gallery';
import CTA      from '@/components/sections/CTA';
import Footer   from '@/components/ui/Footer';
import ThemeStyles from '@/components/ui/ThemeStyles';
import { readTemplate, getGallery, getCompanyData } from '@/lib/dataManager';

//  fotowoltaika, instalator, budowlana, medyczny, fryzjer, warsztat
const SELECTED_INDUSTRY = 'fotowoltaika';

export default async function HomePage() {
  const template = await readTemplate(SELECTED_INDUSTRY);
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
      {/* Dynamic theme styles - now in a Client Component */}
      <ThemeStyles theme={theme} colors={template.colors} />
      
      <Header companyName={company?.name} theme={theme} />
      <Hero     data={template.hero}     colors={template.colors} theme={theme} />
      <Services data={template.services} colors={template.colors} theme={theme} />
      <Process  data={template.process}  colors={template.colors} theme={theme} />
      <Gallery  items={gallery?.items || []} theme={theme} />
      <CTA      data={template.cta}      colors={template.colors} theme={theme} company={company} />
      <Footer   company={company} theme={theme} />
    </>
  );
}
