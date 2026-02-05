// app/api/admin/clear-cache/route.js
// Endpoint do czyszczenia cache Redis - wymusza ponowne załadowanie danych ze statycznych plików

import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

const IS_DEV = process.env.NODE_ENV === 'development';

export async function POST(request) {
  try {
    // Sprawdź czy Redis jest dostępny
    if (!process.env.REDIS_URL) {
      return NextResponse.json(
        { 
          success: true,
          message: IS_DEV 
            ? 'Tryb DEV: Dane zapisywane bezpośrednio do plików - cache nie wymaga czyszczenia' 
            : 'Redis nie jest skonfigurowany - używane są statyczne pliki, cache nie wymaga czyszczenia',
          environment: IS_DEV ? 'development' : 'production',
          redis_enabled: false
        },
        { status: 200 }
      );
    }

    // Lista kluczy do wyczyszczenia
    const keys = [
      'bot-config',
      'triggers',
      'company',
      'gallery',
      'messages',
      'smtp',
      'auth'
    ];

    let cleared = 0;
    let errors = [];

    // Usuń każdy klucz z Redis
    for (const key of keys) {
      try {
        await redis.del(key);
        cleared++;
        console.log(`✅ Cleared cache for: ${key}`);
      } catch (error) {
        console.error(`❌ Failed to clear ${key}:`, error);
        errors.push(key);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Wyczyszczono cache dla ${cleared} kluczy`,
      cleared,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error('Clear cache error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Błąd podczas czyszczenia cache',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// Opcjonalnie - GET endpoint do sprawdzenia statusu cache
export async function GET(request) {
  try {
    if (!process.env.REDIS_URL) {
      return NextResponse.json({
        redis_enabled: false,
        environment: IS_DEV ? 'development' : 'production',
        message: IS_DEV 
          ? 'Tryb DEV: Zmiany zapisywane bezpośrednio do plików w /data'
          : 'Redis nie jest skonfigurowany'
      });
    }

    const keys = [
      'bot-config',
      'triggers',
      'company',
      'gallery'
    ];

    const status = {};
    
    for (const key of keys) {
      try {
        const data = await redis.get(key);
        status[key] = data ? 'cached' : 'not_cached';
      } catch (error) {
        status[key] = 'error';
      }
    }

    return NextResponse.json({
      redis_enabled: true,
      environment: IS_DEV ? 'development' : 'production',
      cache_status: status
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Błąd sprawdzania statusu cache' },
      { status: 500 }
    );
  }
}
