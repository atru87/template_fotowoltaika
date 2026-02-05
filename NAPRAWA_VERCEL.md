# 🔥 PILNE - JAK NAPRAWIĆ CZAT NA VERCEL

## Problem
Na Vercel (produkcja) filesystem jest READ-ONLY, więc:
- ❌ Nie można zapisywać do plików przez panel admin
- ❌ Po wyczyszczeniu cache Redis ładuje pusty plik z repo
- ✅ ROZWIĄZANIE: Wpisz klucz API bezpośrednio w pliku i zrób redeploy

## 🚀 Rozwiązanie krok po kroku

### Opcja A: Szybka (edycja w Vercel Dashboard)

1. **Wejdź na Vercel Dashboard:**
   - https://vercel.com/[twoja-firma]/[nazwa-projektu]
   
2. **Przejdź do zakładki Storage:**
   - Kliknij **Storage** w menu
   - Wybierz swój Redis (jeśli masz)
   - LUB przejdź do **Settings** → **Environment Variables**

3. **Dodaj zmienne środowiskowe:**
   ```
   GROQ_API_KEY = gsk_TWOJ_KLUCZ_TUTAJ
   ```

4. **Zaktualizuj kod:**
   - W pliku `lib/chatLogic.js` zmień linię 36:
   ```javascript
   export async function queryAI(message, apiKey, systemPrompt, history = []) {
     // Użyj klucza z env lub z parametru
     const actualApiKey = process.env.GROQ_API_KEY || apiKey;
     
     if (!actualApiKey || actualApiKey.trim() === '') {
       return "Bot AI nie jest skonfigurowany...";
     }
   ```

5. **Redeploy:**
   - Kliknij **Deployments**
   - Kliknij **Redeploy** na ostatnim deploymencie

### Opcja B: Prawidłowa (edycja w repo)

1. **Edytuj plik `data/bot-config.json` lokalnie:**
   ```json
   {
     "apiKey": "gsk_TWOJ_RZECZYWISTY_KLUCZ_API",
     "systemPrompt": "Jesteś pomocnym asystentem firmy. Odpowiadaj profesjonalnie i zwięźle na pytania klientów."
   }
   ```

2. **Commit i push:**
   ```bash
   git add data/bot-config.json
   git commit -m "Add Groq API key"
   git push
   ```

3. **Vercel automatycznie redeploy**

4. **Po deploymencie:**
   - Wejdź na `/admin/bot`
   - Kliknij "Wyczyść cache" (żeby Redis pobrał nowy plik)

### Opcja C: Tylko Redis (bez plików)

Jeśli nie chcesz trzymać klucza w repo:

1. **Ustaw klucz przez Redis CLI:**
   ```bash
   redis-cli -u $REDIS_URL
   > SET bot-config '{"apiKey":"gsk_TWOJ_KLUCZ","systemPrompt":"..."}'
   ```

2. **LUB użyj API bezpośrednio:**
   ```bash
   curl -X POST https://twoja-domena.vercel.app/api/admin/set-bot-key \
     -H "Content-Type: application/json" \
     -d '{"apiKey":"gsk_TWOJ_KLUCZ"}'
   ```
   (wymaga stworzenia tego endpointu)

## ⚡ Najszybsze rozwiązanie (30 sekund)

**Jeśli nie masz czasu:**

1. Otwórz plik `data/bot-config.json` w tym ZIP
2. Wklej swój klucz API zamiast `WPISZ_TUTAJ_SWOJ_KLUCZ_API_Z_GROQ`
3. Rozpakuj ZIP
4. Push do repo (lub upload przez Vercel CLI)
5. Poczekaj na redeploy
6. Wejdź na `/admin/bot` → "Wyczyść cache"

## 🔍 Dlaczego tak się dzieje?

```
PRODUKCJA (Vercel):
┌─────────────────────────────────────┐
│ Panel Admin → Zapisz konfigurację   │
└─────────────────┬───────────────────┘
                  │
                  ▼
         ┌────────────────┐
         │  Redis (OK!)   │
         └────────┬───────┘
                  │
                  │ Wyczyść cache
                  ▼
         ┌────────────────────┐
         │  Ładuj z pliku     │
         │  (PUSTY! ❌)       │
         └────────────────────┘
```

**Filesystem na Vercel jest READ-ONLY:**
- Pliki w repo są statyczne
- Po deploymencie nie można ich edytować
- Panel admin może zapisywać TYLKO do Redis
- Po wyczyszczeniu cache → ładuje pusty plik

**Rozwiązanie:**
- Klucz API w pliku w repo (bezpieczny - prywatny repo)
- LUB klucz API w zmiennych środowiskowych Vercel
- LUB nigdy nie czyścić cache (ale wtedy zmiany nie działają)

## 📝 Co zmieniłem w plikach?

### Plik `data/bot-config.json` - EDYTUJ TO:
```json
{
  "apiKey": "WPISZ_TUTAJ_SWOJ_KLUCZ_API_Z_GROQ",
  "systemPrompt": "Jesteś pomocnym asystentem firmy..."
}
```

### Zmień na:
```json
{
  "apiKey": "gsk_abc123def456...",  ← TWÓJ PRAWDZIWY KLUCZ
  "systemPrompt": "Jesteś pomocnym asystentem firmy..."
}
```

## ✅ Weryfikacja

Po naprawie:

1. Otwórz czat na stronie
2. Napisz: "Cześć"
3. Powinien odpowiedzieć bot AI (a nie komunikat o błędzie)

Jeśli nadal błąd:
- Sprawdź logi Vercel (Functions)
- Szukaj `AI query error` w logach
- Sprawdź czy klucz API jest poprawny w Groq Console

## 🆘 Potrzebujesz pomocy?

Sprawdź w logach Vercel:
```
Functions → Runtime Logs
```

Szukaj:
- `✅ Read from Redis: bot-config` → Redis działa
- `⚠️ bot-config not in Redis` → Ładuje z pliku
- `AI query error` → Problem z Groq API
