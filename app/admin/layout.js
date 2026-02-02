// app/admin/layout.js
// Layout specjalny dla panelu admina

import AdminNav from '@/components/admin/AdminNav';

export const metadata = {
  title: 'Panel administracyjny',
};

export default function AdminLayout({ children }) {
  return (
    <>
      <AdminNav />
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    </>
  );
}
