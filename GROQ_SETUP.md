# Jak skonfigurować Groq API (DARMOWE)

## Krok 1: Załóż konto na Groq

1. Idź na: https://console.groq.com/
2. Kliknij "Sign Up" i załóż darmowe konto
3. Zaloguj się

## Krok 2: Wygeneruj klucz API

1. Po zalogowaniu kliknij na swoje konto (prawy górny róg)
2. Wybierz "API Keys"
3. Kliknij "Create API Key"
4. Skopiuj wygenerowany klucz (zapisz go bezpiecznie!)

## Krok 3: Dodaj klucz do projektu

### Opcja A: Przez panel admina (ZALECANE)
1. Uruchom projekt: `npm run dev`
2. Idź na: http://localhost:3000/admin
3. Domyślne hasło: `admin123`
4. Wklej klucz API w pole "Klucz API"
5. Zapisz

### Opcja B: Ręcznie w pliku
1. Otwórz plik: `data/bot-config.json`
2. Wklej klucz:
```json
{
  "apiKey": "gsk_TWOJ_KLUCZ_TUTAJ",
  "systemPrompt": "Jesteś pomocnym asystentem firmy. Odpowiadaj profesjonalnie i zwięźle na pytania klientów."
}
```

## Limity darmowego planu Groq

✅ **30 zapytań na minutę** - bardzo dużo dla strony wizytówki!
✅ **14,400 zapytań dziennie** (przy limicie 30/min)
✅ **Bez limitu miesięcznego** (tylko rate limit)
✅ **Bardzo szybkie odpowiedzi** (najszybszy darmowy API!)

## Alternatywne darmowe API (jeśli Groq nie wystarczy)

### 1. Google AI (Gemini)
- https://ai.google.dev/
- 60 zapytań/minutę za darmo
- Model: gemini-1.5-flash
- Endpoint: https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent

### 2. Cohere
- https://cohere.com/
- 1000 wywołań/miesiąc za darmo
- Dobry do embeddings i klasyfikacji

### 3. Together AI
- https://www.together.ai/
- $25 darmowych kredytów na start
- Wiele modeli open source

## Który wybrać?

**Dla strony wizytówki z czatem:**
- **Groq** - NAJLEPSZY (szybki, stabilny, łatwy)
- Gemini - dobry backup
- Cohere - jeśli potrzebujesz mniej rozmów

## Testowanie

Po dodaniu klucza:
1. Odśwież stronę główną
2. Kliknij ikonę czatu w prawym dolnym rogu
3. Napisz wiadomość testową: "Cześć"
4. Bot powinien odpowiedzieć!

## Rozwiązywanie problemów

**Brak ikony czatu?**
- Sprawdź czy plik `app/layout.js` zawiera `<ChatWidget />`
- Odśwież przeglądarkę (Ctrl+F5)

**Bot nie odpowiada?**
- Sprawdź konsolę przeglądarki (F12)
- Sprawdź czy klucz API jest poprawny
- Sprawdź limity Groq (może przekroczyłeś 30/min)

**Error 401 Unauthorized?**
- Klucz API jest nieprawidłowy lub wygasł
- Wygeneruj nowy klucz w konsoli Groq
