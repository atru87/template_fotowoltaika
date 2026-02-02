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
 * Wysyła zapytanie do AI (Anthropic Claude)
 * @param {string} message - wiadomość użytkownika
 * @param {string} apiKey - klucz API
 * @param {string} systemPrompt - prompt systemowy
 * @param {array} history - historia konwersacji
 * @returns {Promise<string>} - odpowiedź AI
 */
export async function queryAI(message, apiKey, systemPrompt, history = []) {
  if (!apiKey) {
    return "Bot AI nie jest skonfigurowany. Skontaktuj się z administratorem.";
  }

  try {
    // Budujemy historię konwersacji w formacie Claude
    const messages = [
      ...history,
      { role: "user", content: message }
    ];

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1024,
        system: systemPrompt,
        messages: messages
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.content[0].text;
    
  } catch (error) {
    console.error('AI query error:', error);
    return "Przepraszam, wystąpił problem z połączeniem. Spróbuj ponownie lub skontaktuj się telefonicznie.";
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
