// app/api/admin/diagnostics/route.js
// Endpoint diagnostyczny dla Redis

import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { migrateToKV } from '@/lib/dataManager';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  
  // Sprawdź czy Redis jest skonfigurowany
  const redisConfigured = !!process.env.REDIS_URL;
  
  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    redisConfigured: redisConfigured,
    redisUrl: process.env.REDIS_URL ? 'REDIS_URL configured ✅' : 'not configured ❌',
  };
  
  try {
    // Test połączenia z Redis
    if (redisConfigured) {
      try {
        await redis.ping();
        diagnostics.redisConnection = 'OK ✅';
      } catch (error) {
        diagnostics.redisConnection = `ERROR: ${error.message} ❌`;
      }
      
      // Sprawdź jakie klucze są w Redis
      try {
        const keys = await redis.keys('*');
        diagnostics.redisKeys = keys;
        diagnostics.redisKeysCount = keys.length;
      } catch (error) {
        diagnostics.redisKeysError = error.message;
      }
      
      // Sprawdź konkretne dane w Redis
      const dataKeys = [
        'gallery', 
        'company', 
        'bot-config', 
        'triggers', 
        'auth',
        'messages',
        'smtp',
        'templates:fotowoltaika',
        'templates:fotowoltaika-v2',
        'templates:fotowoltaika-v3',
        'templates:fotowoltaika-v4',
        'templates:fotowoltaika-v5',
      ];
      diagnostics.redisData = {};
      
      for (const key of dataKeys) {
        try {
          const data = await redis.get(key);
          diagnostics.redisData[key] = data ? 'exists ✅' : 'missing ❌';
        } catch (error) {
          diagnostics.redisData[key] = `error: ${error.message} ❌`;
        }
      }
    } else {
      diagnostics.redisConnection = 'Redis not configured ❌';
      diagnostics.warning = 'Bez Redis nie można zapisywać danych na Vercel (filesystem jest read-only)';
    }
    
    // Akcja: migracja danych do Redis
    if (action === 'migrate' && redisConfigured) {
      try {
        await migrateToKV();
        diagnostics.migration = { status: 'completed ✅', message: 'Wszystkie dane zmigrowane do Redis' };
      } catch (error) {
        diagnostics.migration = { status: 'failed ❌', error: error.message };
      }
    }
    
    // Akcja: reset Redis (usuń wszystkie klucze)
    if (action === 'reset' && redisConfigured) {
      diagnostics.reset = {};
      
      try {
        const keys = await redis.keys('*');
        for (const key of keys) {
          await redis.del(key);
        }
        diagnostics.reset.deleted = keys;
        diagnostics.reset.count = keys.length;
        diagnostics.reset.status = 'completed ✅';
      } catch (error) {
        diagnostics.reset.error = error.message;
        diagnostics.reset.status = 'failed ❌';
      }
    }
    
    return NextResponse.json(diagnostics, { status: 200 });
    
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Diagnostics failed',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
