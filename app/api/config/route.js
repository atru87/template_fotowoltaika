// app/api/config/route.js
// Unified endpoint do zarządzania konfiguracją

import { NextResponse } from 'next/server';
import { 
  getCompanyData, 
  updateCompanyData,
  getBotConfig,
  updateBotConfig,
  getTriggers,
  updateTriggers
} from '@/lib/dataManager';

// GET - pobierz konfigurację
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type'); // 'company', 'bot', 'triggers'
  
  try {
    let data;
    
    switch(type) {
      case 'company':
        data = getCompanyData();
        break;
      case 'bot':
        data = getBotConfig();
        break;
      case 'triggers':
        data = getTriggers();
        break;
      default:
        return NextResponse.json(
          { error: 'Nieprawidłowy typ konfiguracji' },
          { status: 400 }
        );
    }
    
    return NextResponse.json(data);
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Błąd pobierania danych' },
      { status: 500 }
    );
  }
}

// POST - zaktualizuj konfigurację
export async function POST(request) {
  try {
    const { type, data } = await request.json();
    
    // W produkcji: sprawdź token autoryzacji
    
    let success;
    
    switch(type) {
      case 'company':
        success = updateCompanyData(data);
        break;
      case 'bot':
        success = updateBotConfig(data);
        break;
      case 'triggers':
        success = updateTriggers(data);
        break;
      default:
        return NextResponse.json(
          { error: 'Nieprawidłowy typ konfiguracji' },
          { status: 400 }
        );
    }
    
    if (!success) {
      return NextResponse.json(
        { error: 'Błąd zapisu danych' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Błąd aktualizacji danych' },
      { status: 500 }
    );
  }
}
