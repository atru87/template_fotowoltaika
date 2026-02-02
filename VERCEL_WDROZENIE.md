# 🚀 INSTRUKCJA: Wdrożenie na Vercel z KV Storage

## Krok po kroku - DOKŁADNIE TAK ZRÓB

### ✅ KROK 1: Przygotowanie lokalnie (5 minut)

1. **Zainstaluj Vercel KV:**
```bash
npm install @vercel/kv
```

2. **Dodaj "type": "module" do package.json:**

Otwórz `package.json` i dodaj tę linię (po "name"):
```json
{
  "name": "twoja-nazwa",
  "type": "module",    <-- DODAJ TO
  "version": "1.0.0",
  ...
}
```

3. **Zamień dataManager na wersję z KV:**
```bash
# Backup starego pliku
mv lib/dataManager.js lib/dataManager-old.js

# Użyj nowej wersji
mv lib/dataManager-kv.js lib/dataManager.js
```

Lub ręcznie:
- Zmień nazwę `lib/dataManager.js` na `lib/dataManager-old.js`
- Zmień nazwę `lib/dataManager-kv.js` na `lib/dataManager.js`

4. **Dodaj async/await do stron używających dataManager:**

W `app/page.js` zamień:
```javascript
// PRZED
export default function HomePage() {
  const template = readTemplate(SELECTED_INDUSTRY);
  const gallery = getGallery();
  const company = getCompanyData();
```

Na:
```javascript
// PO
export default async function HomePage() {
  const template = await readTemplate(SELECTED_INDUSTRY);
  const gallery = await getGallery();
  const company = await getCompanyData();
```

5. **Commit zmian:**
```bash
git add .
git commit -m "Add Vercel KV support"
git push
```

### ✅ KROK 2: Stwórz projekt na Vercel (3 minuty)

1. Idź na: https://vercel.com/
2. Zaloguj się przez GitHub
3. Kliknij "Add New" → "Project"
4. Wybierz swoje repozytorium
5. Kliknij "Deploy"

⏳ **Poczekaj 2-3 minuty na pierwszy deploy**

### ✅ KROK 3: Dodaj Vercel KV Storage (2 minuty)

1. Gdy deploy się skończy, kliknij na nazwę projektu
2. Górne menu: **Storage** → **Create Database**
3. Wybierz **KV** (to Redis)
4. Nazwa: `production-kv` (lub dowolna)
5. Kliknij **Create**
6. **WAŻNE:** Kliknij **Connect to Project**
7. Wybierz swój projekt
8. Environment: **Production** ✅
9. Kliknij **Connect**

🎉 **Gotowe! KV jest podłączony do projektu**

### ✅ KROK 4: Zmigruj dane do KV (5 minut)

Teraz musimy przenieść dane z plików JSON do KV.

**OPCJA A - Lokalnie przez Vercel CLI (ZALECANE):**

1. **Zainstaluj Vercel CLI:**
```bash
npm install -g vercel
```

2. **Zaloguj się:**
```bash
vercel login
```

3. **Podłącz projekt lokalnie:**
```bash
vercel link
```
Wybierz swój projekt z listy.

4. **Pobierz zmienne środowiskowe (KV credentials):**
```bash
vercel env pull
```

To stworzy plik `.env.local` z danymi dostępowymi do KV.

5. **Uruchom migrację:**
```bash
node scripts/migrate-to-kv.js
```

Zobaczysz:
```
🚀 Starting migration to Vercel KV...
✅ Migrated gallery.json → KV key: "gallery"
✅ Migrated company.json → KV key: "company"
✅ Migrated bot-config.json → KV key: "bot-config"
✅ Migrated triggers.json → KV key: "triggers"
✅ Migrated auth.json → KV key: "auth"
🎉 Migration complete!
```

**OPCJA B - Przez panel Vercel KV (alternatywa):**

Jeśli nie chcesz CLI:

1. Idź na Vercel → Storage → Twój KV
2. Zakładka "Data Browser"
3. Kliknij "Set Value"
4. Dla każdego pliku JSON ręcznie:
   - Key: `gallery` (bez .json)
   - Value: Skopiuj zawartość `data/gallery.json`
   - Type: JSON
   - Kliknij "Save"

Powtórz dla: `company`, `bot-config`, `triggers`, `auth`

### ✅ KROK 5: Redeploy (1 minuta)

1. Wróć do Vercel → Deployments
2. Kliknij na ostatni deployment
3. Prawy górny róg: **⋮** → **Redeploy**
4. Kliknij **Redeploy**

Albo:
```bash
git commit --allow-empty -m "Trigger redeploy"
git push
```

### ✅ KROK 6: Testuj! 🎉

1. Otwórz swoją stronę na Vercel (np. `twoj-projekt.vercel.app`)
2. Idź na `/admin` i zaloguj się
3. Spróbuj dodać zdjęcie do galerii
4. Odśwież stronę - zdjęcie powinno być!
5. Spróbuj usunąć zdjęcie - powinno zniknąć!

🎉 **DZIAŁA! Panel admin zapisuje zmiany na Vercel!**

## Weryfikacja czy KV działa

### Sprawdź w panelu Vercel:
1. Storage → Twój KV → Data Browser
2. Powinieneś zobaczyć klucze: `gallery`, `company`, itd.
3. Kliknij na `gallery` - zobaczysz dane JSON

### Sprawdź w logach:
1. Vercel → Deployments → Ostatni deployment
2. Runtime Logs
3. Szukaj: `✅ Saved to KV: gallery`

## Rozwiązywanie problemów

### Problem: "KV_REST_API_URL is not defined"

**Rozwiązanie:**
1. Vercel → Settings → Environment Variables
2. Sprawdź czy są: `KV_REST_API_URL`, `KV_REST_API_TOKEN`
3. Jeśli nie - idź do Storage → Twój KV → Connect to Project (ponownie)

### Problem: Dane się nie zapisują

**Rozwiązanie:**
1. Sprawdź logi: Vercel → Runtime Logs
2. Sprawdź czy migracja się udała: Storage → Data Browser
3. Uruchom migrację ponownie: `node scripts/migrate-to-kv.js`

### Problem: "Module not found: @vercel/kv"

**Rozwiązanie:**
```bash
npm install @vercel/kv
git add package.json package-lock.json
git commit -m "Add @vercel/kv dependency"
git push
```

### Problem: Lokalnie działa, na Vercel nie

**Rozwiązanie:**
- Lokalnie używa plików JSON (normalne)
- Na Vercel musi używać KV
- Sprawdź czy `.env.local` jest w `.gitignore` (powinien być)
- Na Vercel zmienne są ustawiane automatycznie przez KV

## Koszty

**Vercel KV - Hobby Plan (DARMOWY):**
- ✅ 256 MB storage
- ✅ 30,000 commands/dzień
- ✅ 30 połączeń jednocześnie

Dla Twojego projektu to **DUŻO więcej niż potrzeba**!

Przykład:
- 1 dodanie zdjęcia = 2 komendy (read + write)
- 30,000 / 2 = **15,000 edycji dziennie**
- Wystarczy dla 100+ adminów edytujących non-stop 😄

## Podsumowanie

✅ **CO ZYSKUJESZ:**
- Panel admin działa na Vercel
- Dane są trwałe (nie gubią się przy redeploy)
- Szybkie zapisywanie/odczyt
- Darmowe do 256MB

✅ **CO SIĘ ZMIENIA:**
- `lib/dataManager.js` - nowa wersja (async)
- `app/page.js` - dodane `await`
- Dane w KV zamiast plików

✅ **CO POZOSTAJE:**
- Reszta kodu bez zmian
- Panel admin działa tak samo
- Wszystkie funkcje działają

## Następne kroki

Po wdrożeniu:
1. ✅ Usuń stare pliki: `lib/dataManager-old.js`
2. ✅ Dodaj backup danych: Storage → Export
3. ✅ Zmień hasło admina: `/admin` → Bot
4. ✅ Dodaj klucz Groq API: `/admin` → Bot
5. ✅ Przetestuj czat na żywo

---

**Masz problem? Sprawdź:**
- Vercel logs
- KV Data Browser
- Terminal (migracja)
- Plik `.env.local` (lokalnie)

Powodzenia! 🚀
