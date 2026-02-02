# ⚠️ WAŻNE: Problem z zapisem plików na Vercel

## Problem

**NA VERCEL NIE BĘDZIE DZIAŁAŁ ZAPIS DO PLIKÓW JSON!** ❌

Vercel (i większość platform serverless) używa **read-only file system** - pliki są tylko do odczytu. Nie możesz zapisywać zmian do plików `.json` w katalogu `data/`.

## Co to oznacza?

❌ **NIE ZADZIAŁA:**
- Dodawanie/usuwanie zdjęć w galerii
- Edycja danych firmy w panelu admin
- Zapisywanie konfiguracji bota
- Dodawanie triggerów

✅ **ZADZIAŁA:**
- Wyświetlanie strony
- Czat z botem (bo Groq API to zewnętrzny serwis)
- Odczyt danych (bo pliki istnieją w buildie)

## Rozwiązania dla Vercel

### 🎯 ROZWIĄZANIE 1: Baza danych (ZALECANE dla produkcji)

Użyj bezpłatnej bazy danych zamiast plików JSON:

#### A) **Vercel Postgres** (oficjalna, darmowa)
```bash
npm install @vercel/postgres
```
- 256MB darmowego storage
- Integracja z Vercel
- Bardzo łatwa konfiguracja

#### B) **MongoDB Atlas** (popularne, darmowe)
```bash
npm install mongodb
```
- 512MB darmowego storage
- Dobre do tego projektu
- Darmowy tier wystarczy

#### C) **Supabase** (najprostsze, darmowe)
```bash
npm install @supabase/supabase-js
```
- 500MB storage
- Automatyczne API
- Panel admina w przeglądarce

### 🎯 ROZWIĄZANIE 2: Vercel KV (Redis) - PROSTE

Najłatwiejsze rozwiązanie dla Twojego projektu:

```bash
npm install @vercel/kv
```

**Zalety:**
- ✅ Działa jak JSON - klucz/wartość
- ✅ Darmowy tier: 256MB
- ✅ Minimalne zmiany w kodzie
- ✅ Integracja z Vercel w 2 kliknięcia

**Ile trzeba zmienić w kodzie:**
- Tylko plik `lib/dataManager.js` (1 plik!)
- Reszta działa bez zmian

### 🎯 ROZWIĄZANIE 3: Vercel Blob Storage

Dla przechowywania obrazków:

```bash
npm install @vercel/blob
```
- 1GB darmowego storage
- Idealne do uploadu zdjęć

### 🎯 ROZWIĄZANIE 4: Tylko CMS w pliku (lokalnie)

Jeśli Vercel tylko do wyświetlania:
- Edytujesz pliki JSON lokalnie
- Commitniesz do GitHub
- Vercel automatycznie re-deployuje

❌ **Wady:**
- Nie ma panelu admina na żywo
- Trzeba commita i deploya za każdą zmianą

## Które rozwiązanie wybrać?

### Dla Twojego projektu (wizytówka + czat):

**NAJLEPSZE: Vercel KV (Redis)**

Dlaczego?
1. ✅ Najprostsze - zamień JSON na KV
2. ✅ Darmowe wystarczająco
3. ✅ Minimalne zmiany w kodzie
4. ✅ Szybkie jak JSON
5. ✅ Panel admin działa tak samo

### Jak to będzie wyglądać?

**Przed (JSON - NIE DZIAŁA na Vercel):**
```javascript
// data/gallery.json - zapisuje do pliku ❌
fs.writeFileSync('gallery.json', data);
```

**Po (KV - DZIAŁA na Vercel):**
```javascript
// Vercel KV - zapisuje do Redis ✅
await kv.set('gallery', data);
```

Prawie to samo!

## Implementacja Vercel KV (krok po kroku)

### 1. Zainstaluj pakiet
```bash
npm install @vercel/kv
```

### 2. Stwórz KV Store w Vercel
- Idź do projektu na Vercel
- Storage → Create Database → KV
- Połącz z projektem

### 3. Zmień tylko `lib/dataManager.js`

Stary kod (pliki):
```javascript
export function writeJSON(filename, data) {
  fs.writeFileSync(path.join(DATA_DIR, filename), JSON.stringify(data));
}
```

Nowy kod (KV):
```javascript
import { kv } from '@vercel/kv';

export async function writeJSON(filename, data) {
  await kv.set(filename.replace('.json', ''), data);
}

export async function readJSON(filename) {
  return await kv.get(filename.replace('.json', ''));
}
```

### 4. Zainicjuj dane (pierwsza migracja)

Stwórz plik `scripts/migrate-to-kv.js`:
```javascript
import { kv } from '@vercel/kv';
import fs from 'fs';

// Przenieś wszystkie JSON-y do KV
const files = ['gallery', 'company', 'bot-config', 'triggers', 'auth'];

for (const file of files) {
  const data = JSON.parse(fs.readFileSync(`data/${file}.json`));
  await kv.set(file, data);
  console.log(`Migrated ${file}`);
}
```

Uruchom raz:
```bash
node scripts/migrate-to-kv.js
```

### 5. Deploy
```bash
git add .
git commit -m "Migrate to Vercel KV"
git push
```

Vercel automatycznie zdeployuje z KV!

## FAQ

**Q: Czy muszę płacić za Vercel KV?**
A: NIE! Darmowy tier (256MB) wystarczy dla 1000 wizytówek takich jak Twoja.

**Q: Czy stracę dane przy redeploy?**
A: NIE! KV to osobna baza - dane są trwałe.

**Q: Czy mogę testować lokalnie?**
A: TAK! KV działa też lokalnie z `vercel env pull`.

**Q: A jeśli nie chcę używać bazy?**
A: Wtedy edytuj JSON-y lokalnie i deployuj przez git. Ale nie będzie panelu admina na stronie.

**Q: Czy trudno przerobić na KV?**
A: NIE! To dosłownie 20 linijek w 1 pliku. Mogę Ci przygotować gotowy kod.

## Podsumowanie

| Rozwiązanie | Trudność | Koszt | Czas | Zalecane |
|-------------|----------|-------|------|----------|
| **Vercel KV** | ⭐ Łatwe | Darmowe | 30min | ✅ TAK |
| Vercel Postgres | ⭐⭐ Średnie | Darmowe | 2h | Jeśli więcej danych |
| Supabase | ⭐⭐ Średnie | Darmowe | 1h | Jeśli chcesz auto-API |
| MongoDB | ⭐⭐⭐ Trudne | Darmowe | 3h | Jeśli znasz Mongo |
| Tylko lokalnie | ⭐ Bardzo łatwe | Darmowe | 0min | ❌ Brak admina online |

## Chcesz gotowy kod?

Mogę Ci przygotować:
1. ✅ Przerobiony `dataManager.js` z Vercel KV
2. ✅ Skrypt migracji danych
3. ✅ Instrukcję krok po kroku

To zajmie mi 10 minut, a Tobie 30 minut wdrożenia.

Daj znać czy chcesz żebym przygotował kod z Vercel KV! 🚀
