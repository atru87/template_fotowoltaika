# 🔧 NAPRAWA PROBLEMU Z CZATEM AI

## Problem
Czat AI wyświetla komunikat: 
> "Przepraszam, wystąpił problem z połączeniem. Spróbuj ponownie lub skontaktuj się telefonicznie."

## Przyczyna
Brak klucza API dla Groq w pliku konfiguracyjnym `data/bot-config.json`

## Rozwiązanie

### Opcja 1: Dodaj klucz API przez panel administratora (ZALECANE)

1. **Zarejestruj się w Groq:**
   - Wejdź na https://console.groq.com
   - Załóż darmowe konto
   - Wygeneruj klucz API (zaczyna się od `gsk_...`)

2. **Dodaj klucz w panelu admin:**
   - Zaloguj się do panelu administratora: `/admin/login`
   - Przejdź do: **Ustawienia** → **Bot AI**
   - Wklej klucz API w pole "API Key (Groq)"
   - Kliknij **Zapisz**

3. **Wyczyść cache Redis (jeśli używasz Redis):**
   - W tej samej sekcji kliknij: **🗑️ Wyczyść cache Redis**
   - Potwierdź operację
   - Cache zostanie wyczyszczony i dane zostaną przeładowane

### Opcja 2: Edytuj plik bezpośrednio

Jeśli wolisz edytować plik bezpośrednio:

1. Otwórz plik: `data/bot-config.json`

2. Zmień z:
```json
{
  "apiKey": "",
  "systemPrompt": "Jesteś pomocnym asystentem firmy. Odpowiadaj profesjonalnie i zwięźle na pytania klientów."
}
```

3. Na (z Twoim kluczem API):
```json
{
  "apiKey": "gsk_TWOJ_KLUCZ_API_TUTAJ",
  "systemPrompt": "Jesteś pomocnym asystentem firmy. Odpowiadaj profesjonalnie i zwięźle na pytania klientów."
}
```

4. **Wyczyść cache Redis:**
   - Wejdź do panelu admin → Ustawienia
   - Kliknij **🗑️ Wyczyść cache Redis**
   
   LUB użyj API bezpośrednio:
   ```bash
   curl -X POST https://twoja-domena.vercel.app/api/admin/clear-cache
   ```

## Zmiany w kodzie

### 1. Poprawiono `lib/chatLogic.js`
- Dodano lepszą walidację klucza API
- Dodano bardziej pomocne komunikaty błędów
- Rozróżnienie błędów autoryzacji (401/403) od problemów z połączeniem

### 2. Dodano `app/api/admin/clear-cache/route.js`
- Nowy endpoint do czyszczenia cache Redis
- POST `/api/admin/clear-cache` - czyści cache
- GET `/api/admin/clear-cache` - sprawdza status cache

### 3. Zaktualizowano `app/admin/ustawienia/page.js`
- Dodano przycisk "Wyczyść cache Redis"
- Funkcja `clearCache()` do łatwego czyszczenia cache
- Automatyczne przeładowanie danych po wyczyszczeniu

## Jak działa system cache

1. **Bez Redis:** 
   - Dane ładowane ze statycznych plików JSON w `data/`
   - Zmiany widoczne od razu po przebudowaniu

2. **Z Redis:**
   - Dane buforowane w Redis dla szybkości
   - Po zmianie plików potrzebne czyszczenie cache
   - Przycisk w panelu admin automatyzuje proces

## Testowanie

Po dodaniu klucza API przetestuj czat:

1. Otwórz stronę główną
2. Kliknij ikonę czatu w prawym dolnym rogu
3. Wyślij wiadomość, np: "Witaj"
4. Bot powinien odpowiedzieć używając AI

Jeśli nadal są problemy:
- Sprawdź logi w konsoli przeglądarki (F12)
- Sprawdź logi serwera
- Zweryfikuj poprawność klucza API w Groq Console

## Komunikaty błędów

- **"Bot AI nie jest skonfigurowany..."** - brak klucza API
- **"Bot AI nie jest prawidłowo skonfigurowany..."** - błąd 401/403, nieprawidłowy klucz
- **"Przepraszam, wystąpił problem z połączeniem..."** - problem z API Groq lub siecią

## Koszty

Groq oferuje darmowy tier z limitem:
- 30 zapytań/minutę
- Wystarczające dla większości małych projektów
- Model: `llama-3.1-70b-versatile`

## Wsparcie

Jeśli problem nadal występuje:
1. Sprawdź czy klucz API jest aktywny w Groq Console
2. Sprawdź limity w Groq (czy nie przekroczyłeś darmowego limitu)
3. Sprawdź logi błędów w konsoli
