// app/api/admin/test-groq/route.js
// Endpoint do testowania połączenia z Groq API

import { NextResponse } from 'next/server';
import { getBotConfig } from '@/lib/dataManager';

export async function GET() {
  const results = {
    timestamp: new Date().toISOString(),
    steps: []
  };

  try {
    // Krok 1: Pobierz config
    results.steps.push({ step: 'Pobieranie bot-config', status: 'start' });
    const botConfig = await getBotConfig();
    
    if (!botConfig) {
      results.steps.push({ step: 'Pobieranie bot-config', status: 'error', message: 'botConfig is null' });
      return NextResponse.json(results);
    }
    
    results.steps.push({ 
      step: 'Pobieranie bot-config', 
      status: 'ok',
      apiKeyExists: !!botConfig.apiKey,
      apiKeyLength: botConfig.apiKey?.length || 0,
      apiKeyPreview: botConfig.apiKey ? botConfig.apiKey.substring(0, 10) + '...' : 'BRAK'
    });

    // Krok 2: Test połączenia z Groq
    if (!botConfig.apiKey) {
      results.steps.push({ step: 'Test Groq', status: 'skip', message: 'Brak klucza API' });
      return NextResponse.json(results);
    }

    results.steps.push({ step: 'Test Groq', status: 'start' });
    
    const testMessages = [
      { role: "system", content: "Odpowiadaj krótko." },
      { role: "user", content: "Powiedz tylko: OK" }
    ];

    const startTime = Date.now();
    
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${botConfig.apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: testMessages,
        max_tokens: 50,
        temperature: 0.1
      })
    });

    const endTime = Date.now();
    const responseTime = endTime - startTime;

    results.steps.push({
      step: 'Groq response',
      status: response.ok ? 'ok' : 'error',
      httpStatus: response.status,
      responseTimeMs: responseTime
    });

    if (!response.ok) {
      const errorText = await response.text();
      results.steps.push({
        step: 'Groq error details',
        status: 'error',
        errorBody: errorText.substring(0, 500)
      });
      return NextResponse.json(results);
    }

    const data = await response.json();
    results.steps.push({
      step: 'Groq odpowiedź',
      status: 'ok',
      response: data.choices?.[0]?.message?.content || 'BRAK',
      model: data.model,
      usage: data.usage
    });

    results.success = true;
    results.message = 'Groq API działa poprawnie!';

  } catch (error) {
    results.steps.push({
      step: 'Exception',
      status: 'error',
      errorName: error.name,
      errorMessage: error.message,
      errorStack: error.stack?.substring(0, 300)
    });
  }

  return NextResponse.json(results);
}
