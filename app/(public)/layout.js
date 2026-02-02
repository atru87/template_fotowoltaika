// app/(public)/layout.js
// Layout dla strony publicznej (nie-admin)

import { getCompanyData } from '@/lib/dataManager';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import ChatWidget from '@/components/ui/ChatWidget';

export default function PublicLayout({ children }) {
  const company = getCompanyData();
  
  return (
    <>
      <Header companyName={company?.name} />
      <main>{children}</main>
      <Footer company={company} />
      <ChatWidget />
    </>
  );
}
