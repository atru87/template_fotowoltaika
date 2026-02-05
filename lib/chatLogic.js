// lib/chatLogic.js
// Logika decyzyjna czatu: triggery lokalne vs AI

/**
 * Sprawdza czy wiadomość zawiera trigger
 * @param {string} message - wiadomość użytkownika
 * @param {array} triggers - lista triggerów z responses
 * @returns {string|null} - odpowiedź lub null
 */
export function checkTriggers(message, triggers) {
  if (!message || !triggers || !triggers.triggers) return null;
  
  const normalizedMessage = message.toLowerCase().trim();
  
  // Sprawdzamy każdy trigger
  for (const trigger of triggers.triggers) {
    const normalizedTrigger = trigger.trigger.toLowerCase().trim();
    
    // Jeśli wiadomość zawiera trigger - zwracamy odpowiedź
    if (normalizedMessage.includes(normalizedTrigger)) {
      return trigger.response;
    }
  }
  
  return null;
}

/**
 * Wysyła zapytanie do AI (Groq)
 * @param {string} message - wiadomość użytkownika
 * @param {string} apiKey - klucz API
 * @param {string} systemPrompt - prompt systemowy
 * @param {array} history - historia konwersacji
 * @returns {Promise<string>} - odpowiedź AI
 */
export async function queryAI(message, apiKey, systemPrompt, history = []) {
  if (!apiKey || apiKey.trim() === '') {
    return "Bot AI nie jest skonfigurowany. Proszę dodać klucz API Groq w panelu administratora (Ustawienia → Konfiguracja Bota).";
  }

  try {
    // Budujemy historię konwersacji w formacie Groq
    const messages = [
      { role: "system", content: systemPrompt || "Jesteś pomocnym asystentem firmy." },
      ...history,
      { role: "user", content: message }
    ];

    console.log('[ChatLogic] Wysyłam do Groq, klucz:', apiKey.substring(0, 10) + '...');
    console.log('[ChatLogic] Messages count:', messages.length);

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant', // Szybszy model, mniej problemów z timeoutem
        messages: messages,
        max_tokens: 1024,
        temperature: 0.7
      })
    });

    console.log('[ChatLogic] Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[ChatLogic] API error response:', errorText);
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('[ChatLogic] Otrzymano odpowiedź od Groq');
    return data.choices[0].message.content;
    
  } catch (error) {
    console.error('[ChatLogic] AI query error:', error);
    console.error('[ChatLogic] Error name:', error.name);
    console.error('[ChatLogic] Error message:', error.message);
    
    // Sprawdź czy to problem z kluczem API
    if (error.message.includes('401') || error.message.includes('403')) {
      return "Bot AI nie jest prawidłowo skonfigurowany. Skontaktuj się z administratorem w celu dodania klucza API.";
    }
    
    // Sprawdź czy to timeout
    if (error.name === 'AbortError' || error.message.includes('timeout')) {
      return "Odpowiedź trwała zbyt długo. Spróbuj ponownie.";
    }
    
    return `Przepraszam, wystąpił problem z połączeniem (${error.message}). Spróbuj ponownie później lub skontaktuj się telefonicznie.`;
  }
}

/**
 * Główna funkcja obsługi wiadomości
 * Kolejność: 1. Triggery -> 2. AI
 */
export async function handleMessage(message, triggers, botConfig, history = []) {
  // Krok 1: Sprawdź triggery
  const triggerResponse = checkTriggers(message, triggers);
  if (triggerResponse) {
    return {
      source: 'trigger',
      message: triggerResponse
    };
  }
  
  // Krok 2: Zapytaj AI
  const aiResponse = await queryAI(
    message, 
    botConfig.apiKey, 
    botConfig.systemPrompt,
    history
  );
  
  return {
    source: 'ai',
    message: aiResponse
  };
}
