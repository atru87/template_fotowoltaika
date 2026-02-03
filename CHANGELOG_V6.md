# Wersja v6 - Krytyczne poprawki Redis i API

## 🚨 Naprawione błędy

### 1. **Błąd 500 w /api/config** 
**Problem:** Używanie `require('fs')` w Edge Runtime
**Rozwiązanie:** Użycie `readJSON()` zamiast `fs.readFileSync()`

### 2. **Nieprawidłowe klucze w Redis**
**Problem:** Klucze z `/` (np. `templates/fotowoltaika`) nie działają w Redis
**Rozwiązanie:** Automatyczna zamiana `/` na `:` (np. `templates:fotowoltaika`)

### 3. **Brak szablonów w migracji**
**Problem:** Szablony nie były migrowane do Redis
**Rozwiązanie:** Dodano wszystkie 5 szablonów do procesu migracji

## 📝 Zmiany w plikach

### `lib/dataManager.js`
- **readJSON()** - zamienia `/` na `:` w kluczach Redis
- **writeJSON()** - zamienia `/` na `:` w kluczach Redis
- **migrateToKV()** - dodano szablony i prawidłowe klucze

### `app/api/config/route.js`
- Usunięto `require('fs')` i `path`
- Użyto `readJSON('templates/fotowoltaika.json')`
- Dodano lepsze error handling

### `app/api/admin/diagnostics/route.js`
- Dodano szablony do sprawdzanych kluczy
- Dodano szablony do migracji
- Używa prawidłowej konwersji kluczy (`:` zamiast `/`)

## 🎯 Klucze w Redis

Po migracji w Redis będą następujące klucze:
```
gallery
company
bot-config
triggers
auth
messages
smtp
templates:fotowoltaika
templates:fotowoltaika-v2
templates:fotowoltaika-v3
templates:fotowoltaika-v4
templates:fotowoltaika-v5
```

## 🚀 Jak wdrożyć

1. **Wgraj na Vercel**
   ```bash
   # Wypakuj projekt-v6.zip
   vercel --prod
   ```

2. **Otwórz diagnostykę**
   - Idź na `/admin/diagnostyka`
   - Kliknij "🔍 Sprawdź status systemu"

3. **Zmigruj dane**
   - Jeśli Redis jest pusty: kliknij "📤 Migruj dane do Redis"
   - Sprawdź ponownie - wszystko powinno być "exists ✅"

4. **Testuj**
   - Wejdź na `/admin/firma` - powinno działać bez błędu 500
   - Wejdź na `/admin/realizacje` - dodaj testowe zdjęcie
   - Sprawdź czy dane się zapisują

## ⚠️ Ważne

Po wdrożeniu v6:
- Stare dane w Redis mogą mieć złe klucze (bez `:`)
- Jeśli nadal są problemy: użyj "🗑️ Wyczyść Redis" → "📤 Migruj dane"
- To usunie stare klucze i stworzy nowe z prawidłowym formatem

## 🔍 Weryfikacja

Po migracji diagnostyka powinna pokazać:
```
✅ templates:fotowoltaika - exists ✅
✅ templates:fotowoltaika-v2 - exists ✅
✅ templates:fotowoltaika-v3 - exists ✅
✅ templates:fotowoltaika-v4 - exists ✅
✅ templates:fotowoltaika-v5 - exists ✅
✅ gallery - exists ✅
✅ company - exists ✅
... etc
```

Jeśli któryś pokazuje "missing ❌", oznacza to że plik nie istnieje w folderze `/data`.
