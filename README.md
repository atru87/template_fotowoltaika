# System wizytówek firm - Next.js CMS

Aplikacja Next.js do tworzenia stron-wizytówek dla różnych branż z wbudowanym panelem administracyjnym i czatem AI.

## 🚀 Funkcje

- **6 gotowych szablonów branżowych**: fotowoltaika, instalator, budowlana, medyczny, fryzjer, warsztat
- **Panel administracyjny** bez bazy danych (JSON)
- **Chat AI** z obsługą triggerów i Anthropic Claude
- **Galeria realizacji** z prostym zarządzaniem
- **Responsywny design** z Tailwind CSS

## 📁 Struktura projektu

```
/app                    # Strony Next.js (App Router)
  /admin               # Panel administracyjny
  /api                 # API endpoints
  /realizacje          # Strona galerii
/components
  /sections            # Sekcje strony (Hero, Services, CTA, Gallery)
  /ui                  # UI components (Header, Footer, ChatWidget)
  /admin               # Komponenty panelu admina
/data                  # Pliki JSON z danymi
  /templates           # Szablony branżowe
/lib                   # Biblioteki pomocnicze
```

## 🛠️ Instalacja

```bash
# Zainstaluj zależności
npm install

# Uruchom serwer deweloperski
npm run dev

# Aplikacja dostępna na http://localhost:3000
```

## 🎨 Zmiana branży

Edytuj plik `app/page.js` i zmień wartość `SELECTED_INDUSTRY`:

```javascript
const SELECTED_INDUSTRY = 'fotowoltaika'; // lub: instalator, budowlana, medyczny, fryzjer, warsztat
```

## 📝 Panel administracyjny

### Logowanie
- URL: `http://localhost:3000/admin/login`
- Domyślne dane: `admin` / `admin123`
- Zmień w pliku: `data/auth.json`

### Funkcje panelu
1. **Realizacje** (`/admin/realizacje`)
   - Dodawanie zdjęć przez URL
   - Usuwanie zdjęć

2. **Bot AI** (`/admin/bot`)
   - API key Anthropic Claude
   - Prompt systemowy
   - System trigger → response

3. **Dane firmy** (`/admin/firma`)
   - Nazwa, telefon, email
   - Adres, godziny otwarcia

## 🤖 Konfiguracja czatu AI

1. Wejdź do panelu: `/admin/bot`
2. Wklej API key z [console.anthropic.com](https://console.anthropic.com)
3. Ustaw prompt systemowy
4. Dodaj triggery dla często zadawanych pytań

### Jak działają triggery?

1. Użytkownik pisze wiadomość
2. System sprawdza czy wiadomość zawiera trigger
3. Jeśli TAK → zwraca automatyczną odpowiedź
4. Jeśli NIE → używa AI do odpowiedzi

**Przykład:**
- Trigger: `cena`
- Response: `Zapraszam do kontaktu telefonicznego w celu ustalenia wyceny`

## 🎯 Tworzenie nowej branży

### Krok 1: Stwórz szablon JSON

Skopiuj plik z `data/templates/` i dostosuj:

```json
{
  "industry": "nazwa-branży",
  "colors": {
    "primary": "#hex",
    "secondary": "#hex",
    "accent": "#hex"
  },
  "hero": {
    "title": "Główny nagłówek",
    "subtitle": "Podtytuł",
    "cta": "Tekst przycisku",
    "backgroundImage": "URL zdjęcia"
  },
  "services": {
    "title": "Tytuł sekcji",
    "items": [
      {
        "title": "Usługa 1",
        "description": "Opis",
        "icon": "emoji"
      }
    ]
  },
  "cta": {
    "title": "Wezwanie do działania",
    "description": "Opis",
    "buttonText": "Przycisk"
  }
}
```

### Krok 2: Użyj szablonu

W `app/page.js`:
```javascript
const SELECTED_INDUSTRY = 'nazwa-branży';
```

## 📦 Pliki danych (JSON)

### `data/auth.json`
Dane logowania do panelu admina.

### `data/company.json`
Globalne dane firmy używane w stopce i CTA.

### `data/bot-config.json`
Konfiguracja AI: API key i system prompt.

### `data/triggers.json`
Lista triggerów dla czatu.

### `data/gallery.json`
Zdjęcia w galerii realizacji.

## 🔒 Bezpieczeństwo

⚠️ **UWAGA**: To jest podstawowa implementacja do celów demonstracyjnych.

W produkcji należy:
- Użyć prawdziwego systemu autoryzacji (JWT, sessions)
- Przenieść API key do zmiennych środowiskowych
- Zabezpieczyć API endpoints
- Użyć middleware do ochrony tras
- Dodać rate limiting

## 🛡️ Środowisko produkcyjne

1. Stwórz `.env.local`:
```
ANTHROPIC_API_KEY=twoj-klucz-api
```

2. Zmień `lib/chatLogic.js`:
```javascript
const apiKey = process.env.ANTHROPIC_API_KEY;
```

3. Usuń API key z `data/bot-config.json`

## 🎨 Dostosowywanie wyglądu

### Kolory
Edytuj `tailwind.config.js` lub inline style w komponentach.

### Layout
Komponenty w `components/sections/` są niezależne i łatwe do modyfikacji.

### Style globalne
Plik `app/globals.css` zawiera podstawowe style.

## 📱 Responsywność

Wszystkie komponenty używają Tailwind breakpoints:
- `sm:` - 640px+
- `md:` - 768px+
- `lg:` - 1024px+

## 🐛 Troubleshooting

### Problem: Chat nie działa
- Sprawdź czy API key jest poprawny
- Otwórz Console (F12) i sprawdź błędy

### Problem: Zdjęcia nie ładują się
- Sprawdź URL zdjęć
- Dodaj domenę do `next.config.js` w sekcji `images.domains`

### Problem: Nie mogę się zalogować
- Sprawdź plik `data/auth.json`
- Wyczyść localStorage: `localStorage.clear()`

## 🚀 Deploy

### Vercel (zalecane)
```bash
npm run build
vercel deploy
```

### Inne platformy
Upewnij się że:
- Folder `data/` jest zapisywalny
- Node.js 18+ jest dostępny

## 📄 Licencja

Ten projekt to demo/szablon edukacyjny. Możesz go dowolnie modyfikować.

## 🤝 Wsparcie

W razie pytań:
1. Sprawdź komentarze w kodzie
2. Przejrzyj strukturę plików
3. Przetestuj każdy moduł osobno

---

**Autor:** Demo dla full-stack developerów
**Wersja:** 1.0.0
**Data:** 2024
