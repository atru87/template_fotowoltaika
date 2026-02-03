# 🔧 Naprawa problemu z Redis (Vercel KV)

## Problem
Dodawanie zdjęć w `/admin/realizacje` nie działa - dane zapisują się do Redis, ale nie są widoczne.

## Rozwiązanie - krok po kroku

### 1. Wejdź do panelu diagnostyki

1. Zaloguj się do `/admin`
2. Kliknij kafelek **"Diagnostyka"** 🔧
3. Kliknij **"🔍 Sprawdź status systemu"**

### 2. Sprawdź wyniki

Diagnostyka pokaże Ci:
- ✅ Czy Redis jest podłączony
- ✅ Jakie dane są w Redis
- ✅ Jakie pliki są w folderze `/data`
- ✅ Czy wszystko jest zsynchronizowane

### 3. Najprawdopodobniejsze scenariusze

#### Scenariusz A: Redis działa, ale brak danych
**Objawy:**
- Status połączenia: OK ✅
- Dane w Redis: wszystkie "missing ❌"

**Rozwiązanie:**
1. Kliknij **"📤 Migruj dane do Redis"**
2. Potwierdź akcję
3. Sprawdź ponownie status - powinno być "exists ✅"
4. Spróbuj dodać zdjęcie w realizacjach

#### Scenariusz B: Redis nie działa
**Objawy:**
- KV skonfigurowane: ❌ NIE
- Status połączenia: ERROR

**Rozwiązanie:**
1. Idź do **Vercel Dashboard** → Twój projekt → **Storage**
2. Sprawdź czy widzisz **KV (Redis)** database
3. Jeśli nie ma:
   - Kliknij **Create Database** → **KV**
   - Połącz z projektem
   - Zredeploy projekt (`vercel --prod`)
4. Jeśli jest:
   - Sprawdź **Settings** → **Environment Variables**
   - Upewnij się że są:
     - `KV_REST_API_URL`
     - `KV_REST_API_TOKEN`
   - Zredeploy projekt

#### Scenariusz C: Stare dane w Redis
**Objawy:**
- Status połączenia: OK ✅
- Dane w Redis: exists ✅
- Ale dodawanie nadal nie działa

**Rozwiązanie:**
1. ⚠️ **UWAGA:** To usunie wszystkie dane z Redis
2. Kliknij **"🗑️ Wyczyść Redis"** (potwierdź 2 razy)
3. Kliknij **"📤 Migruj dane do Redis"**
4. Sprawdź ponownie status
5. Spróbuj dodać zdjęcie

### 4. Testowanie

Po naprawie:
1. Wejdź na `/admin/realizacje`
2. Dodaj testowe zdjęcie (np. z Unsplash.com)
3. Sprawdź czy się pojawia
4. Sprawdź czy po odświeżeniu strony nadal jest

### 5. Jeśli nadal nie działa

Wejdź ponownie do **Diagnostyki** i:
1. Kliknij **"📋 Pokaż surowe dane JSON"**
2. Skopiuj cały JSON
3. Prześlij mi go - zdiagnozuję problem dokładniej

## Najczęstsze przyczyny

1. **Brak migracji** - dane są tylko w plikach, nigdy nie trafiły do Redis
2. **Stare zmienne** - zmienne środowiskowe wskazują na nieaktualny Redis
3. **Brak uprawnień** - Redis store nie ma uprawnień do zapisu
4. **Cache** - stary cache po stronie Vercel

## Zapobieganie problemom

Po naprawie:
- Dane będą zapisywane **zarówno w Redis jak i w plikach** (backup)
- Redis jest głównym źródłem danych na produkcji
- Pliki służą jako backup i do lokalnego developmentu

## Wsparcie

Jeśli któryś z kroków nie działa lub potrzebujesz pomocy:
1. Zrób screenshot diagnostyki
2. Sprawdź logi w Vercel Dashboard → **Logs**
3. Prześlij mi informacje
