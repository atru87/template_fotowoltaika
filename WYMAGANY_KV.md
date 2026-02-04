# ⚠️ WAŻNE: Vercel KV (Redis) jest WYMAGANY

## Problem z system plików na Vercel

Na Vercel **nie można zapisywać plików** - filesystem jest **read-only**. To oznacza że:

❌ **NIE DZIAŁA:**
- `fs.writeFileSync()` - błąd "read-only file system"
- Zapisywanie do `/data/*.json`
- Modyfikacja plików na dysku

✅ **DZIAŁA:**
- Odczyt plików (są budowane razem z projektem)
- Vercel KV (Redis) - zewnętrzna baza danych

## Bez KV nie możesz:

- ❌ Dodawać zdjęć w realizacjach
- ❌ Edytować danych firmy
- ❌ Zarządzać bottem i triggerami
- ❌ Zapisywać żadnych zmian

**Wszystkie dane będą tylko do odczytu.**

## Rozwiązanie: Skonfiguruj Vercel KV (3 minuty)

### Krok 1: Otwórz Vercel Dashboard
https://vercel.com/dashboard

### Krok 2: Znajdź swój projekt
Kliknij na projekt **template-fotowoltaika**

### Krok 3: Storage → Create Database
1. Kliknij **"Storage"** w górnym menu
2. Kliknij **"Create Database"**
3. Wybierz **"KV (Redis)"**
4. Nazwa: `fotowoltaika-kv` (lub inna)
5. Region: **wybierz najbliższy użytkownikom** (np. Frankfurt dla Polski)
6. Kliknij **"Create"**

### Krok 4: Connect to Project
1. Po utworzeniu: kliknij **"Connect to Project"**
2. Wybierz swój projekt z listy
3. Kliknij **"Connect"**

### Krok 5: Sprawdź zmienne środowiskowe
Dashboard → Settings → Environment Variables

Powinny pojawić się automatycznie:
- ✅ `KV_REST_API_URL`
- ✅ `KV_REST_API_TOKEN`
- ✅ `KV_URL`

### Krok 6: Redeploy
**WAŻNE:** Zmiany environment variables działają dopiero po redeployu!

Opcja A - z Gita:
```bash
git commit --allow-empty -m "Enable KV"
git push
```

Opcja B - z terminala:
```bash
vercel --prod
```

Opcja C - z Dashboard:
- Deployments → najnowszy deploy → "..." menu → "Redeploy"

### Krok 7: Zmigruj dane
1. Wejdź na `/admin/diagnostyka`
2. Kliknij **"🔍 Sprawdź status systemu"**
3. Powinno pokazać: **KV skonfigurowane: ✅ TAK**
4. Kliknij **"📤 Migruj dane do Redis"**
5. Sprawdź ponownie - wszystkie dane powinny być "exists ✅"

### Krok 8: Testuj
- Wejdź na `/admin/firma` - powinno załadować się bez błędu
- Wejdź na `/admin/realizacje` - dodaj testowe zdjęcie
- Sprawdź czy się zapisuje

## Koszt Vercel KV

**Darmowy tier:**
- 30,000 poleceń dziennie
- 256 MB storage
- **Wystarczy dla małej/średniej strony firmowej**

## Alternatywa (tylko na localhost)

Jeśli testujesz **tylko lokalnie** (npm run dev), możesz użyć plików JSON.
Ale to **NIE ZADZIAŁA** na produkcji Vercel!

## Pytania?

Jeśli masz problemy z konfiguracją KV:
1. Zrób screenshot z Vercel Dashboard → Storage
2. Zrób screenshot z Settings → Environment Variables
3. Prześlij mi - pomogę zdiagnozować problem
