// app/api/admin/set-redis-key/route.js
// Bezpośrednie ustawienie klucza w Redis (bez ładowania z pliku)
// Rozwiązuje problem pustego pliku na Vercel

import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

export async function POST(request) {
  try {
    // Sprawdź czy Redis jest dostępny
    if (!process.env.REDIS_URL) {
      return NextResponse.json(
        { error: 'Redis nie jest skonfigurowany' },
        { status: 500 }
      );
    }

    const { key, value } = await request.json();

    if (!key || !value) {
      return NextResponse.json(
        { error: 'Brak klucza lub wartości' },
        { status: 400 }
      );
    }

    // Zapisz bezpośrednio do Redis
    await redis.set(key, value);

    return NextResponse.json({
      success: true,
      message: `Klucz '${key}' zapisany w Redis`,
      key,
    });

  } catch (error) {
    console.error('Set Redis key error:', error);
    return NextResponse.json(
      { error: 'Błąd zapisu do Redis', details: error.message },
      { status: 500 }
    );
  }
}

// GET - sprawdź wartość klucza
export async function GET(request) {
  try {
    if (!process.env.REDIS_URL) {
      return NextResponse.json(
        { error: 'Redis nie jest skonfigurowany' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json(
        { error: 'Brak parametru key' },
        { status: 400 }
      );
    }

    const value = await redis.get(key);

    return NextResponse.json({
      key,
      value,
      exists: !!value,
    });

  } catch (error) {
    console.error('Get Redis key error:', error);
    return NextResponse.json(
      { error: 'Błąd odczytu z Redis', details: error.message },
      { status: 500 }
    );
  }
}
