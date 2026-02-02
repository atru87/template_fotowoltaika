// app/api/auth/route.js
// Endpoint logowania - weryfikuje dane i zwraca token (w uproszczeniu)

import { NextResponse } from 'next/server';
import { checkAuth } from '@/lib/dataManager';

export async function POST(request) {
  try {
    const { username, password } = await request.json();
    
    // Sprawdzenie danych logowania
    const isValid = await checkAuth(username, password);
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Nieprawidłowe dane logowania' },
        { status: 401 }
      );
    }
    
    // W produkcji użyj JWT lub innego mechanizmu sesji
    // Tu zwracamy prosty token dla uproszczenia
    const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');
    
    return NextResponse.json({ 
      success: true,
      token 
    });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Błąd serwera' },
      { status: 500 }
    );
  }
}
