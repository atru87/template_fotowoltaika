// app/api/admin/diagnostics/route.js
// Endpoint diagnostyczny dla KV - sprawdza stan Redis

import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { migrateToKV } from '@/lib/dataManager';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  
  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    kvConfigured: !!process.env.KV_REST_API_URL,
    kvUrl: process.env.KV_REST_API_URL ? 'configured ✅' : 'not configured ❌',
  };
  
  try {
    // Test połączenia z KV
    if (process.env.KV_REST_API_URL) {
      try {
        await kv.ping();
        diagnostics.kvConnection = 'OK ✅';
      } catch (error) {
        diagnostics.kvConnection = `ERROR: ${error.message} ❌`;
      }
      
      // Sprawdź jakie klucze są w KV
      try {
        const keys = await kv.keys('*');
        diagnostics.kvKeys = keys;
        diagnostics.kvKeysCount = keys.length;
      } catch (error) {
        diagnostics.kvKeysError = error.message;
      }
      
      // Sprawdź konkretne dane w KV
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
      diagnostics.kvData = {};
      
      for (const key of dataKeys) {
        try {
          const data = await kv.get(key);
          diagnostics.kvData[key] = data ? 'exists ✅' : 'missing ❌';
        } catch (error) {
          diagnostics.kvData[key] = `error: ${error.message} ❌`;
        }
      }
    } else {
      diagnostics.kvConnection = 'KV not configured ❌';
      diagnostics.warning = 'Bez KV nie można zapisywać danych na Vercel (filesystem jest read-only)';
    }
    
    // Akcja: migracja danych do KV
    if (action === 'migrate' && process.env.KV_REST_API_URL) {
      try {
        await migrateToKV();
        diagnostics.migration = { status: 'completed ✅', message: 'Wszystkie dane zmigrowane do KV' };
      } catch (error) {
        diagnostics.migration = { status: 'failed ❌', error: error.message };
      }
    }
    
    // Akcja: reset KV (usuń wszystkie klucze)
    if (action === 'reset' && process.env.KV_REST_API_URL) {
      diagnostics.reset = {};
      
      try {
        const keys = await kv.keys('*');
        for (const key of keys) {
          await kv.del(key);
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
