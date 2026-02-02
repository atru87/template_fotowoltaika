// app/api/chat/route.js
// Endpoint obsługi czatu - triggery + AI

import { NextResponse } from 'next/server';
import { getTriggers, getBotConfig } from '@/lib/dataManager';
import { handleMessage } from '@/lib/chatLogic';

export async function POST(request) {
  try {
    const { message, history } = await request.json();
    
    if (!message || message.trim() === '') {
      return NextResponse.json(
        { error: 'Wiadomość nie może być pusta' },
        { status: 400 }
      );
    }
    
    // Pobierz konfigurację
    const triggers = await getTriggers();
    const botConfig = await getBotConfig();
    
    // Przetwórz wiadomość
    const response = await handleMessage(message, triggers, botConfig, history || []);
    
    return NextResponse.json({
      message: response.message,
      source: response.source
    });
    
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Błąd przetwarzania wiadomości' },
      { status: 500 }
    );
  }
}
