import './globals.css';
import AnimatedBg   from '@/components/ui/AnimatedBg';
import ChatWidget   from '@/components/ui/ChatWidget';

export const metadata = {
  title: 'Twoja Firma – Profesjonalne usługi',
  description: 'Wizytówka firmy',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <body>
        {/* fixed animated layer */}
        <AnimatedBg />
        <div className="site-bg-grid" />

        {/* scrollable content */}
        <div className="page-wrap">
          {children}
        </div>

        <ChatWidget />
      </body>
    </html>
  );
}
