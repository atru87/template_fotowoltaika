// components/admin/ProtectedRoute.js
'use client';

// Wrapper sprawdzający autoryzację w panelu admina
// W produkcji: użyj middleware Next.js lub bardziej zaawansowanej autoryzacji

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  useEffect(() => {
    // Sprawdź czy użytkownik jest zalogowany
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      router.push('/admin/login');
      return;
    }
    
    setIsAuthorized(true);
  }, [router]);
  
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Sprawdzanie autoryzacji...</p>
      </div>
    );
  }
  
  return <>{children}</>;
}
