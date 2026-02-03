import Header   from '@/components/ui/Header';
import Hero     from '@/components/sections/Hero';
import Services from '@/components/sections/Services';
import Gallery  from '@/components/sections/Gallery';
import CTA      from '@/components/sections/CTA';
import Footer   from '@/components/ui/Footer';
import { readTemplate, getGallery, getCompanyData } from '@/lib/dataManager';

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

  return (
    <>
      <Header companyName={company?.name} />
      <Hero     data={template.hero}     colors={template.colors} />
      <Services data={template.services} colors={template.colors} />
      <Gallery  items={gallery?.items || []} />
      <CTA      data={template.cta}      colors={template.colors} company={company} />
      <Footer   company={company} />
    </>
  );
}
