// app/layout.js
// Root layout - owijka dla całej aplikacji

import './globals.css';

export const metadata = {
  title: 'Twoja Firma - Profesjonalne usługi',
  description: 'Wizytówka firmy',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
