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
import { getTemplateId, shouldShowSwitcher } from '@/config/template';

export default async function HomePage({ searchParams }) {
  const templateId = getTemplateId(searchParams);
  const showSwitcher = shouldShowSwitcher();
  
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
      
      <Header companyName={company?.name} theme={theme} templateId={templateId} />
      <Hero     key={`hero-${templateId}`} data={template.hero}     colors={template.colors} theme={theme} template={template} templateId={templateId} />
      <Services key={`services-${templateId}`} data={template.services} colors={template.colors} theme={theme} template={template} />
      <Process  key={`process-${templateId}`} data={template.process}  colors={template.colors} theme={theme} template={template} />
      <Gallery  items={gallery?.items || []} theme={theme} />
      <CTA      data={template.cta}      colors={template.colors} theme={theme} company={company} templateId={templateId} />
      <Footer   company={company} theme={theme} />
    </>
  );
}
