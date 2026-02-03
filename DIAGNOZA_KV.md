# Diagnoza problemu z dodawaniem zdjęć w realizacjach

## Problem
Nie działa dodawanie zdjęć w `/admin/realizacje` - system korzysta z Vercel KV do przechowywania danych.

## Możliwe przyczyny

### 1. **Lokalnie (npm run dev)**
Jeśli testujesz lokalnie:
- Vercel KV nie jest dostępny bez odpowiedniej konfiguracji
- System powinien automatycznie przełączyć się na pliki JSON w folderze `/data`
- Sprawdź czy folder `/data` istnieje i ma uprawnienia do zapisu

**Rozwiązanie:**
```bash
# Upewnij się że folder data istnieje
mkdir -p data

# Sprawdź uprawnienia (Linux/Mac)
chmod 755 data

# Sprawdź czy plik gallery.json istnieje
ls -la data/gallery.json
```

### 2. **Na Vercel (produkcja)**
Jeśli testujesz na Vercel:
- Sprawdź czy Vercel KV jest podłączony do projektu
- Sprawdź zmienne środowiskowe

**Kroki weryfikacji:**

1. **Dashboard Vercel** → Twój projekt → **Storage**
   - Czy widzisz Vercel KV Store?
   - Czy jest połączony z projektem?

2. **Dashboard Vercel** → Twój projekt → **Settings** → **Environment Variables**
   - Czy są ustawione:
     - `KV_REST_API_URL`
     - `KV_REST_API_TOKEN`
     - `KV_URL` (opcjonalnie)

3. **Jeśli brakuje KV:**
   - Dashboard → **Storage** → **Create Database**
   - Wybierz **KV**
   - Podłącz do swojego projektu
   - Zredeploy aplikację

## Ulepszone logowanie w v4

W wersji v4 dodano szczegółowe logi:
- `✅` - sukces operacji
- `⚠️` - ostrzeżenie (np. brak danych w KV, fallback do pliku)
- `❌` - błąd

### Gdzie sprawdzić logi:

**Lokalnie:**
- Terminal z `npm run dev`

**Na Vercel:**
- Dashboard → Twój projekt → **Logs**
- Lub `vercel logs` w terminalu

## Przykładowe logi sukcesu:

```
Attempting to read from KV: gallery
✅ Read from KV: gallery
Attempting to save to KV: gallery
✅ Saved to KV: gallery
```

## Przykładowe logi gdy KV nie działa:

```
KV not available (USE_KV=false), using file system
✅ Saved to file: gallery.json
```

## Przykładowe logi błędu:

```
❌ Error reading gallery.json from KV: Error: ...
Error details: ...
Falling back to file system...
```

## Test działania

1. Otwórz `/admin/realizacje`
2. Dodaj testowe zdjęcie (np. z Unsplash)
3. Sprawdź logi w terminalu/konsoli
4. Sprawdź czy zdjęcie się zapisało

## Backup danych

W v4 system **zawsze zapisuje do pliku JSON jako backup**, nawet gdy KV działa.
To oznacza że dane są bezpieczne w obu miejscach.

## Migracja danych do KV

Jeśli masz dane w plikach JSON i chcesz je przenieść do KV:

```javascript
// Dodaj endpoint lub uruchom raz
import { migrateToKV } from '@/lib/dataManager';

// W konsoli Vercel lub lokalnie z KV
await migrateToKV();
```

To skopiuje wszystkie pliki JSON do Vercel KV.
