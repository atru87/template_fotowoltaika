import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import ThemeStyles from '@/components/ui/ThemeStyles';
import ContactForm from '@/components/sections/ContactForm';
import { readTemplate, getCompanyData } from '@/lib/dataManager';
import { getTemplateId } from '@/config/template';

export default async function KontaktPage({ searchParams }) {
  const templateId = getTemplateId(searchParams);
  const template = await readTemplate(templateId);
  const company = await getCompanyData();

  if (!template) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <p>Błąd wczytywania szablonu</p>
      </div>
    );
  }

  const theme = template.theme || {};
  const colors = template.colors || {};

  return (
    <>
      <ThemeStyles theme={theme} colors={colors} />
      
      <Header companyName={company?.name} theme={theme} templateId={templateId} />
      
      <ContactForm theme={theme} colors={colors} />
      
      <Footer company={company} theme={theme} />
    </>
  );
}
