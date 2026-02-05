# 🔧 NAPRAWY I ULEPSZENIA - PODSUMOWANIE

## ✅ Naprawione problemy

### 1. Problem z czatem AI
**Przyczyna:** Pusty klucz API w `data/bot-config.json`

**Rozwiązanie:**
- Lepsze komunikaty błędów w `lib/chatLogic.js`
- Wyraźne informowanie o braku klucza API
- Panel admin teraz wyraźnie pokazuje gdzie dodać klucz

### 2. Duplikat konfiguracji bota
**Problem:** Sekcja "Bot AI" była w dwóch miejscach:
- `/admin/bot` (główna strona)
- `/admin/ustawienia` (duplikat)

**Rozwiązanie:**
- Usunięto duplikat z `/admin/ustawienia`
- Konfiguracja bota TYLKO w `/admin/bot`
- W ustawieniach pozostały tylko: SMTP i Wiadomości

### 3. Zapisywanie do pliku w dev mode
**Problem:** Konfiguracja zapisywała się tylko do Redis, nie do pliku `bot-config.json`

**Rozwiązanie:**
- `lib/dataManager.js` teraz wspiera zapis do plików w trybie development
- W dev mode (`NODE_ENV=development`):
  - ✅ Zapisuje do pliku w `/data`
  - ✅ Synchronizuje z Redis (jeśli dostępny)
- W produkcji (Vercel):
  - ✅ Zapisuje tylko do Redis (filesystem read-only)

### 4. Przywrócono wybór branży i szablonu
**Problem:** Brak możliwości zmiany branży i szablonu w `app/page.js`

**Rozwiązanie:** W pliku `config/template.js` teraz można:

```javascript
// WYBIERZ BRANŻĘ
const SELECTED_INDUSTRY = 'fotowoltaika'; 
// Opcje: fotowoltaika, instalator, budowlana, medyczny, fryzjer, warsztat

// WYBIERZ SZABLON
const SELECTED_TEMPLATE = 0;
// 0 = tryb demo - pokazuje przełącznik (fotowoltaika-v1 do v5)
// 1-5 = konkretny szablon (tylko dla fotowoltaiki)
```

**Zasady:**
- Branża `fotowoltaika` ma 5 wersji szablonów
- Inne branże mają 1 szablon
- `SELECTED_TEMPLATE = 0` pokazuje przełącznik (tylko dla fotowoltaiki)
- `SELECTED_TEMPLATE = 1-5` ustawia konkretny szablon

---

## 📁 Zmienione pliki

### 1. `config/template.js` - ⭐ NOWY SYSTEM
```javascript
// Wybór branży i szablonu
const SELECTED_INDUSTRY = 'fotowoltaika';
const SELECTED_TEMPLATE = 0; // 0 = demo mode

// Wsparcie dla wielu branż
const industryTemplates = {
  'fotowoltaika': { 0-5: różne wersje },
  'instalator': { jeden szablon },
  'budowlana': { jeden szablon },
  // itd...
}
```

### 2. `lib/dataManager.js` - Hybrydowy zapis
- **DEV mode:** Zapisuje do plików w `/data` + sync z Redis
- **PROD mode:** Zapisuje tylko do Redis

### 3. `lib/chatLogic.js` - Lepsze błędy
- Walidacja klucza API (sprawdza czy pusty)
- Rozróżnienie błędów 401/403 vs inne
- Pomocne komunikaty dla użytkownika

### 4. `app/api/admin/clear-cache/route.js` - NOWY
- POST - czyści cache Redis
- GET - sprawdza status cache
- Informacje o środowisku (dev/prod)

### 5. `app/admin/bot/page.js` - Dodano cache
- Przycisk "Wyczyść cache"
- Automatyczne przeładowanie po czyszczeniu

### 6. `app/admin/ustawienia/page.js` - Uproszczono
- Usunięto duplikat konfiguracji bota
- Pozostawiono: Cache, SMTP, Wiadomości

---

## 🚀 Jak używać

### W trybie DEVELOPMENT (lokalnie)

1. **Dodaj klucz API Groq:**
   ```bash
   # W panelu admin lub bezpośrednio w pliku:
   nano data/bot-config.json
   ```
   
   Wklej:
   ```json
   {
     "apiKey": "gsk_TWOJ_KLUCZ",
     "systemPrompt": "Jesteś pomocnym asystentem..."
   }
   ```

2. **Zmień branżę/szablon:**
   ```bash
   nano config/template.js
   ```
   
   Ustaw:
   ```javascript
   const SELECTED_INDUSTRY = 'warsztat';  // wybierz branżę
   const SELECTED_TEMPLATE = 0;           // 0 = demo, 1-5 = konkretny
   ```

3. **Zmiany są widoczne od razu** (zapisywane do plików)

### W trybie PRODUCTION (Vercel)

1. **Ustaw zmienne środowiskowe:**
   ```
   REDIS_URL=redis://...
   NODE_ENV=production
   ```

2. **Dodaj klucz API przez panel admin:**
   - Wejdź: `/admin/login`
   - Przejdź: **Bot** → **Ustawienia AI**
   - Dodaj klucz API
   - Kliknij **Zapisz**
   - Kliknij **Wyczyść cache** ⚠️ WAŻNE!

3. **Po każdej zmianie konfiguracji:**
   - Kliknij "Wyczyść cache" aby odświeżyć Redis

---

## 🔧 Przycisk "Wyczyść cache"

Dostępny w:
- `/admin/bot` - obok "Zapisz konfigurację"
- `/admin/ustawienia` - na górze strony

**Kiedy używać:**
- Po zapisaniu konfiguracji w panelu admin
- Po ręcznej edycji plików JSON (w dev mode zwykle niepotrzebne)
- Gdy zmiany nie są widoczne

**Co robi:**
- Usuwa dane z Redis
- Wymusza przeładowanie z plików statycznych
- Pokazuje komunikat o sukcesie

---

## 📋 Środowiska

| Funkcja | Development | Production (Vercel) |
|---------|------------|---------------------|
| Zapis konfiguracji | ✅ Do plików `/data` | ✅ Do Redis |
| Odczyt konfiguracji | ✅ Z plików | ✅ Redis → fallback pliki |
| Czyszczenie cache | ℹ️ Opcjonalne | ⚠️ Wymagane po zmianach |
| Wybór branży | ✅ `config/template.js` | ✅ `config/template.js` |
| Wybór szablonu | ✅ `config/template.js` | ✅ `config/template.js` |

---

## 🎯 Najczęstsze scenariusze

### Scenariusz 1: Dodanie klucza API (pierwsza konfiguracja)
```
1. Panel admin → Bot → Ustawienia AI
2. Wklej klucz z console.groq.com
3. Zapisz
4. Wyczyść cache (w prod)
5. Gotowe! Czat działa
```

### Scenariusz 2: Zmiana branży z fotowoltaiki na warsztat
```
1. Edytuj config/template.js
2. SELECTED_INDUSTRY = 'warsztat'
3. Przebuduj projekt (npm run build)
4. W dev: zmiany widoczne od razu
5. W prod: deploy do Vercel
```

### Scenariusz 3: Testowanie różnych szablonów fotowoltaiki
```
1. Edytuj config/template.js
2. SELECTED_TEMPLATE = 0 (tryb demo)
3. SELECTED_INDUSTRY = 'fotowoltaika'
4. Na stronie pojawi się menu wyboru v1-v5
```

### Scenariusz 4: Produkcja - konkretny szablon dla klienta
```
1. Edytuj config/template.js
2. SELECTED_INDUSTRY = 'fotowoltaika'
3. SELECTED_TEMPLATE = 3 (np. wersja 3)
4. Menu wyboru nie będzie widoczne
5. Zawsze pokazuje się szablon v3
```

---

## ⚠️ Ważne uwagi

1. **Redis w produkcji:**
   - Bez Redis na Vercel nie można zapisywać zmian przez panel admin
   - Pliki są read-only na Vercel
   - Redis JEST WYMAGANY dla funkcjonalności zapisu

2. **Czyszczenie cache:**
   - W dev mode: opcjonalne (zapisuje do plików)
   - W prod mode: WYMAGANE po każdej zmianie

3. **Klucz API Groq:**
   - Darmowy tier: 30 zapytań/minutę
   - Wystarczające dla małych/średnich projektów
   - Pobierz z: https://console.groq.com

4. **Branże i szablony:**
   - Fotowoltaika: 5 wersji (v1-v5)
   - Inne branże: 1 wersja każda
   - Przełącznik tylko dla fotowoltaiki w trybie demo

---

## 📞 Pomoc techniczna

Problem z zapisem? Sprawdź logi:
```bash
# Development
npm run dev
# Szukaj w konsoli: "✅ Saved to file" lub "❌ Error"

# Production
# Sprawdź logi Vercel
```

Cache nie działa? Test:
```bash
curl https://twoja-domena.vercel.app/api/admin/clear-cache
# Sprawdzi status Redis i środowisko
```
