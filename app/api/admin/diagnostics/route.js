// app/api/admin/diagnostics/route.js
// Endpoint diagnostyczny dla KV - sprawdza stan Redis i danych

import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  
  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    kvConfigured: !!process.env.KV_REST_API_URL,
    kvUrl: process.env.KV_REST_API_URL ? 'configured' : 'not configured',
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
      const dataKeys = ['gallery', 'company', 'bot-config', 'triggers', 'auth'];
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
      diagnostics.kvConnection = 'KV not configured';
    }
    
    // Sprawdź pliki w /data
    diagnostics.dataFiles = {};
    const dataFiles = ['gallery.json', 'company.json', 'bot-config.json', 'triggers.json', 'auth.json'];
    
    for (const filename of dataFiles) {
      const filePath = path.join(DATA_DIR, filename);
      try {
        if (fs.existsSync(filePath)) {
          const stats = fs.statSync(filePath);
          const content = fs.readFileSync(filePath, 'utf-8');
          const json = JSON.parse(content);
          diagnostics.dataFiles[filename] = {
            exists: true,
            size: stats.size,
            modified: stats.mtime,
            itemCount: Array.isArray(json.items) ? json.items.length : 'N/A'
          };
        } else {
          diagnostics.dataFiles[filename] = { exists: false };
        }
      } catch (error) {
        diagnostics.dataFiles[filename] = { error: error.message };
      }
    }
    
    // Akcja: migracja danych do KV
    if (action === 'migrate' && process.env.KV_REST_API_URL) {
      diagnostics.migration = {};
      
      for (const filename of dataFiles) {
        const filePath = path.join(DATA_DIR, filename);
        const key = filename.replace('.json', '');
        
        try {
          if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf-8');
            const json = JSON.parse(content);
            await kv.set(key, json);
            diagnostics.migration[key] = 'migrated ✅';
          } else {
            diagnostics.migration[key] = 'file not found ⚠️';
          }
        } catch (error) {
          diagnostics.migration[key] = `error: ${error.message} ❌`;
        }
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
      } catch (error) {
        diagnostics.reset.error = error.message;
      }
    }
    
    return NextResponse.json(diagnostics, { status: 200 });
    
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Diagnostics failed',
        message: error.message,
        stack: error.stack 
      },
      { status: 500 }
    );
  }
}
