# Dokumentacja architektoniczna

## Decyzje projektowe i ich uzasadnienie

### 1. Brak bazy danych - tylko pliki JSON

**Decyzja:** Użycie plików JSON zamiast bazy danych.

**Uzasadnienie:**
- Prostota: nie trzeba konfigurować PostgreSQL, MongoDB czy innych DB
- Szybki start: aplikacja działa od razu po `npm install`
- Wystarczające dla małych stron-wizytówek (< 1000 requestów/dzień)
- Łatwe backupy: skopiowanie folderu `data/`
- Zero kosztów infrastruktury

**Ograniczenia:**
- Brak współbieżności (race conditions przy zapisie)
- Nie skaluje się dla dużego ruchu
- Wymaga zapisywalnego file systemu na serwerze

**Kiedy przejść na DB:**
- Więcej niż 5000 requestów/dzień
- Wielu równoczesnych adminów
- Potrzeba historii zmian
- Zaawansowane wyszukiwanie

---

### 2. System triggerów zamiast tylko AI

**Decyzja:** Dwustopniowy system: triggery lokalne → AI fallback.

**Uzasadnienie:**
- Koszt: triggery są darmowe, AI płatne za token
- Szybkość: lokalna odpowiedź < 10ms, API ~500-2000ms
- Przewidywalność: FAQ zawsze dostaje tę samą odpowiedź
- Offline: podstawowe FAQ działa nawet bez API key

**Implementacja:**
```javascript
1. Sprawdź czy message zawiera trigger
2. Jeśli TAK → zwróć response
3. Jeśli NIE → zapytaj AI
```

**Przykład użycia:**
90% pytań klientów to FAQ (cena, godziny, dojazd).
Triggerami obsługujesz 90% zapytań za darmo.
AI używane tylko do złożonych pytań.

---

### 3. Modułowe sekcje zamiast monolitycznych stron

**Decyzja:** Każda sekcja (Hero, Services, CTA) to osobny komponent.

**Struktura:**
```
<Hero data={template.hero} colors={template.colors} />
<Services data={template.services} colors={template.colors} />
<CTA data={template.cta} colors={template.colors} />
```

**Korzyści:**
- Łatwa zmiana kolejności sekcji
- Reużywalność między branżami
- Testowanie każdej sekcji osobno
- Podmiana jednej sekcji nie psuje reszty

**Jak działa:**
1. `page.js` wczytuje szablon JSON
2. Przekazuje dane do komponentów
3. Komponenty renderują się na podstawie props

---

### 4. Szablony JSON zamiast hardcoded content

**Decyzja:** Content w JSON, nie w JSX.

**Przykład złego podejścia:**
```jsx
// ❌ Źle - content w kodzie
<h1>Energia słoneczna dla Twojego domu</h1>
```

**Przykład dobrego podejścia:**
```jsx
// ✅ Dobrze - content w JSON
<h1>{data.hero.title}</h1>
```

**Korzyści:**
- Zmiana textu bez edycji kodu
- Łatwe tłumaczenia (różne pliki JSON)
- Content manager może edytować JSON
- Można dodać CMS UI w przyszłości

---

### 5. Server Components vs Client Components

**Zasada:** Default Server Components, Client tylko gdy potrzeba.

**Server Components:**
- `app/page.js` - wczytuje dane z plików
- `components/sections/*` - renderują statyczne sekcje
- `app/realizacje/page.js` - lista galerii

**Client Components ('use client'):**
- `components/ui/ChatWidget.js` - stan, interakcje
- `app/admin/*` - formularze, localStorage
- `components/admin/ProtectedRoute.js` - routing checks

**Dlaczego:**
- Server: szybsze, mniejszy bundle JS, SEO
- Client: tylko gdy absolutnie potrzebne

---

### 6. Prosta autoryzacja localStorage

**Decyzja:** Token w localStorage zamiast JWT/sessions.

**Implementacja:**
```javascript
// Login
localStorage.setItem('authToken', token);

// Check
const token = localStorage.getItem('authToken');
if (!token) redirect('/login');
```

**Dlaczego tak prosto:**
- To demo/mała aplikacja
- Jeden admin, nie tysiące userów
- Brak wrażliwych danych
- Zero konfiguracji

**W produkcji użyj:**
- Next.js middleware
- JWT z refresh tokens
- HTTP-only cookies
- Rate limiting

---

### 7. API Routes dla wszystkich mutacji

**Decyzja:** Wszystkie operacje zapisu przez API.

**Endpoints:**
- `POST /api/auth` - logowanie
- `POST /api/chat` - wiadomości czatu
- `GET/POST /api/config` - konfiguracja
- `GET/POST/DELETE /api/gallery` - galeria

**Korzyści:**
- Separacja logic (frontend/backend)
- Łatwe testowanie API
- Możliwość dodania middleware
- Reużywalność (np. mobile app)

---

### 8. Floating chat widget

**Decyzja:** Chat jako widget w prawym dolnym rogu, nie osobna strona.

**Implementacja:**
- Fixed position: `fixed bottom-6 right-6`
- Stan lokalny: `useState` dla wiadomości
- Scroll: auto-scroll do ostatniej wiadomości
- Mobile: responsive width

**Dlaczego floating:**
- Dostępny na każdej stronie
- Nie blokuje contentu
- Standard UX (jak Intercom, Drift)
- Łatwo zamknąć

---

### 9. Tailwind zamiast CSS Modules

**Decyzja:** Utility-first CSS.

**Przykład:**
```jsx
<div className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
  Button
</div>
```

**Korzyści:**
- Szybsze prototypowanie
- Mniej plików CSS
- Autocomplete w IDE
- Purge usuwa nieużywane style

**Kiedy NIE używać:**
- Bardzo złożone animacje
- Custom design system
- Team preferuje CSS/SCSS

---

### 10. Jedna strona - jeden szablon

**Decyzja:** Każda instancja używa jednego szablonu branżowego.

**Jak zmienić branżę:**
```javascript
// app/page.js
const SELECTED_INDUSTRY = 'fotowoltaika'; // zmień tutaj
```

**Dlaczego nie multi-template:**
- Prostota (jedna firma = jedna branża)
- Szybkość (nie trzeba wybierać przy każdym render)
- Łatwiejszy deploy (jeden build = jedna wersja)

**Jak zrobić multi-template:**
1. Dodaj routing: `/[industry]/`
2. Dynamic params w Next.js
3. Wczytuj szablon z `params.industry`

---

## Flow danych

### Strona publiczna
```
1. User odwiedza stronę
2. Server wczytuje:
   - Szablon branżowy (JSON)
   - Dane firmy (JSON)
   - Galeria (JSON)
3. Server renderuje komponenty z danymi
4. Browser dostaje gotowy HTML
5. Chat widget hydratuje się na kliencie
```

### Chat
```
1. User pisze wiadomość
2. POST /api/chat
3. Server sprawdza triggery
4. Jeśli brak match → query AI
5. Response wraca do klienta
6. Wiadomość pojawia się w UI
```

### Panel admin
```
1. User loguje się
2. Token zapisany w localStorage
3. Każda strona sprawdza token
4. Brak tokenu → redirect /login
5. Admin edytuje dane
6. POST /api/config lub /api/gallery
7. JSON update na serwerze
```

---

## Rozszerzenia do rozważenia

### 1. System uprawnień
```javascript
// data/users.json
{
  "users": [
    { "username": "admin", "role": "admin" },
    { "username": "editor", "role": "editor" }
  ]
}
```

### 2. Historia zmian
```javascript
// data/changelog.json
{
  "changes": [
    {
      "user": "admin",
      "action": "gallery_add",
      "timestamp": "2024-01-15T10:30:00Z",
      "data": {...}
    }
  ]
}
```

### 3. Multi-język
```javascript
// data/templates/fotowoltaika.pl.json
// data/templates/fotowoltaika.en.json

const locale = params.locale;
const template = readTemplate(`${industry}.${locale}.json`);
```

### 4. Wyższy poziom customizacji
```javascript
// Panel admin: wizualny edytor
- Przeciągaj sekcje
- Edytuj kolory w color picker
- Preview live
- Zapisz jako nowy szablon
```

### 5. Analytics
```javascript
// data/analytics.json
{
  "pageviews": [...],
  "chatMessages": [...],
  "popularTriggers": {...}
}
```

---

## Limity i skalowanie

### Obecne limity
- ~10 jednoczesnych userów
- ~100 zdjęć w galerii
- ~50 triggerów
- ~1000 wiadomości/dzień w chacie

### Jak skalować
1. **Cache:** Dodaj Redis dla JSON
2. **CDN:** Cloudflare dla statyki
3. **DB:** Przejdź na PostgreSQL
4. **Queue:** BullMQ dla chat AI
5. **Monitoring:** Sentry + analytics

---

## Testowanie

### Testy jednostkowe
```javascript
// lib/chatLogic.test.js
test('checkTriggers returns response when match', () => {
  const triggers = {
    triggers: [
      { trigger: 'cena', response: 'Odpowiedź' }
    ]
  };
  const result = checkTriggers('jaka jest cena?', triggers);
  expect(result).toBe('Odpowiedź');
});
```

### Testy E2E
```javascript
// e2e/chat.test.js
test('user can send message and receive response', async () => {
  await page.goto('/');
  await page.click('[aria-label="Otwórz czat"]');
  await page.fill('input[placeholder="Napisz wiadomość..."]', 'test');
  await page.click('button:has-text("Wyślij")');
  await expect(page.locator('.message')).toContainText('test');
});
```

---

## Konkluzje

Ten system to świadomy trade-off między:
- **Prostotą** (JSON, brak DB) vs **Skalowalnością**
- **Szybkością rozwoju** (gotowe komponenty) vs **Customizacją**
- **Kosztem** (triggery + AI) vs **Inteligencją** (tylko AI)

Idealny dla:
- Małych i średnich firm
- Szybkie MVP
- Budżet < 1000 PLN/mies

Nie dla:
- Enterprise z tysiącami produktów
- Real-time collaboration
- Złożone workflow

---

**Ostatnia aktualizacja:** 2024
**Autor:** System demo
