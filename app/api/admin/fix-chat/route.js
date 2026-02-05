// app/api/admin/fix-chat/route.js
// Automatyczny skrypt naprawy czatu - diagnostyka + naprawa

import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action'); // 'check' lub 'fix'
  
  const report = {
    timestamp: new Date().toISOString(),
    checks: {},
    problems: [],
    solutions: [],
  };
  
  try {
    // CHECK 1: Redis Configuration
    report.checks.redis_env = !!process.env.REDIS_URL;
    if (!report.checks.redis_env) {
      report.problems.push('❌ REDIS_URL nie jest skonfigurowany w zmiennych środowiskowych');
      report.solutions.push('Dodaj Redis w Vercel Dashboard → Storage → Create Database');
      return NextResponse.json(report, { status: 500 });
    }
    
    // CHECK 2: Redis Connection
    try {
      await redis.ping();
      report.checks.redis_connection = '✅ OK';
    } catch (error) {
      report.checks.redis_connection = `❌ BŁĄD: ${error.message}`;
      report.problems.push('❌ Nie można połączyć się z Redis');
      report.solutions.push('Sprawdź czy Redis jest aktywny w Vercel Dashboard');
      return NextResponse.json(report, { status: 500 });
    }
    
    // CHECK 3: bot-config exists in Redis
    let botConfig = null;
    try {
      botConfig = await redis.get('bot-config');
      report.checks.bot_config_exists = !!botConfig;
      
      if (!botConfig) {
        report.problems.push('❌ Klucz "bot-config" nie istnieje w Redis');
        report.solutions.push('Wejdź na /admin/bot i zapisz klucz API Groq');
        
        // AUTO-FIX: Utwórz domyślny bot-config
        if (action === 'fix') {
          const defaultConfig = {
            apiKey: '',
            systemPrompt: 'Jesteś pomocnym asystentem firmy. Odpowiadaj profesjonalnie i zwięźle na pytania klientów.'
          };
          await redis.set('bot-config', defaultConfig);
          report.autofix = 'Utworzono domyślny bot-config w Redis (bez klucza API)';
          report.solutions.push('⚠️ NADAL MUSISZ dodać klucz API przez panel /admin/bot');
          botConfig = defaultConfig;
        }
      } else {
        report.checks.bot_config_exists = '✅ Istnieje';
      }
    } catch (error) {
      report.checks.bot_config_exists = `❌ BŁĄD: ${error.message}`;
      report.problems.push('❌ Błąd odczytu bot-config z Redis');
    }
    
    // CHECK 4: API Key exists and is not empty
    if (botConfig) {
      report.checks.api_key_set = !!botConfig.apiKey && botConfig.apiKey.trim() !== '';
      
      if (!report.checks.api_key_set) {
        report.problems.push('❌ Klucz API jest pusty lub nie istnieje');
        report.solutions.push('1. Zarejestruj się na https://console.groq.com');
        report.solutions.push('2. Wygeneruj klucz API (zaczyna się od gsk_)');
        report.solutions.push('3. Wejdź na /admin/bot');
        report.solutions.push('4. Wklej klucz i kliknij "Zapisz konfigurację"');
      } else {
        report.checks.api_key_set = '✅ Klucz API jest ustawiony';
        report.checks.api_key_preview = `${botConfig.apiKey.substring(0, 10)}...${botConfig.apiKey.substring(botConfig.apiKey.length - 5)}`;
        
        // CHECK 5: Test Groq API
        if (action === 'test') {
          try {
            const testResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${botConfig.apiKey}`
              },
              body: JSON.stringify({
                model: 'llama-3.1-70b-versatile',
                messages: [
                  { role: 'system', content: 'Odpowiedz jednym słowem: OK' },
                  { role: 'user', content: 'Test' }
                ],
                max_tokens: 10
              })
            });
            
            if (testResponse.ok) {
              const data = await testResponse.json();
              report.checks.groq_api = '✅ Klucz API działa poprawnie';
              report.checks.groq_response = data.choices[0].message.content;
            } else {
              report.checks.groq_api = `❌ BŁĄD ${testResponse.status}`;
              report.problems.push(`❌ Groq API zwróciło błąd ${testResponse.status}`);
              
              if (testResponse.status === 401 || testResponse.status === 403) {
                report.solutions.push('Klucz API jest nieprawidłowy lub wygasł');
                report.solutions.push('Wygeneruj nowy klucz na https://console.groq.com');
              }
            }
          } catch (error) {
            report.checks.groq_api = `❌ BŁĄD: ${error.message}`;
            report.problems.push('❌ Nie można połączyć się z Groq API');
            report.solutions.push('Sprawdź połączenie internetowe serwera');
          }
        }
      }
    }
    
    // CHECK 6: Inne klucze w Redis
    try {
      const allKeys = await redis.keys('*');
      report.checks.redis_keys = allKeys;
      report.checks.redis_keys_count = allKeys.length;
    } catch (error) {
      report.checks.redis_keys = `Błąd: ${error.message}`;
    }
    
    // SUMMARY
    if (report.problems.length === 0) {
      report.status = '✅ WSZYSTKO DZIAŁA POPRAWNIE';
      report.message = 'Czat powinien działać prawidłowo. Jeśli nadal występują problemy, sprawdź logi w konsoli przeglądarki.';
    } else {
      report.status = '⚠️ WYKRYTO PROBLEMY';
      report.message = 'Wykonaj poniższe kroki aby naprawić czat:';
    }
    
    return NextResponse.json(report, { status: report.problems.length === 0 ? 200 : 500 });
    
  } catch (error) {
    return NextResponse.json({
      status: '❌ BŁĄD KRYTYCZNY',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      problems: ['Wystąpił nieoczekiwany błąd podczas diagnostyki'],
      solutions: ['Sprawdź logi serwera Vercel', 'Skontaktuj się z administratorem']
    }, { status: 500 });
  }
}

// POST - Wymuszenie naprawy
export async function POST(request) {
  try {
    const { apiKey } = await request.json();
    
    if (!apiKey || apiKey.trim() === '') {
      return NextResponse.json({
        error: 'Brak klucza API',
        message: 'Podaj klucz API w body: { "apiKey": "gsk_..." }'
      }, { status: 400 });
    }
    
    // Sprawdź czy Redis jest dostępny
    if (!process.env.REDIS_URL) {
      return NextResponse.json({
        error: 'Redis nie jest skonfigurowany'
      }, { status: 500 });
    }
    
    // Test połączenia
    await redis.ping();
    
    // Pobierz obecny bot-config lub utwórz nowy
    let botConfig = await redis.get('bot-config');
    if (!botConfig) {
      botConfig = {
        systemPrompt: 'Jesteś pomocnym asystentem firmy. Odpowiadaj profesjonalnie i zwięźle na pytania klientów.'
      };
    }
    
    // Ustaw nowy klucz API
    botConfig.apiKey = apiKey;
    
    // Zapisz do Redis
    await redis.set('bot-config', botConfig);
    
    // Test Groq API
    const testResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-70b-versatile',
        messages: [
          { role: 'system', content: 'Odpowiedz jednym słowem: OK' },
          { role: 'user', content: 'Test' }
        ],
        max_tokens: 10
      })
    });
    
    if (!testResponse.ok) {
      return NextResponse.json({
        warning: 'Klucz zapisany, ale test API nie powiódł się',
        status: testResponse.status,
        message: 'Sprawdź czy klucz API jest prawidłowy'
      }, { status: 200 });
    }
    
    return NextResponse.json({
      success: true,
      message: '✅ Klucz API zapisany i przetestowany pomyślnie',
      apiKeyPreview: `${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 5)}`
    });
    
  } catch (error) {
    return NextResponse.json({
      error: 'Błąd naprawy',
      details: error.message
    }, { status: 500 });
  }
}
