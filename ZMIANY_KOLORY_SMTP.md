# ZMIANY - Poprawki kolorów i konfiguracji SMTP

## Data: 03.02.2026

### 🎨 Naprawione kolory czcionek

Problem: Biała czcionka na białym tle w różnych miejscach aplikacji

#### 1. Panel admina - wszystkie sekcje
- **Bot AI** (`/app/admin/bot/page.js`)
  - Dodano `text-gray-900 bg-white border-gray-300` do wszystkich inputów i textarea
  - Nagłówki z `text-gray-900`

- **Dane firmy** (`/app/admin/firma/page.js`)
  - Wszystkie pola formularza z poprawnymi kolorami tekstu
  - Nagłówki widoczne

- **Realizacje** (`/app/admin/realizacje/page.js`)
  - Inputy z odpowiednimi kolorami
  - Nagłówki poprawione

- **Ustawienia** (`/app/admin/ustawienia/page.js`)
  - Wszystkie inputy mają `text-gray-900 bg-white border-gray-300`
  - Labele z `text-gray-700`
  - Nagłówki z `text-gray-900`

#### 2. Widget czatu (`/components/ui/ChatWidget.js`)
- Input wiadomości z `text-gray-900 bg-white border-gray-300`
- Teraz tekst jest widoczny podczas pisania

### ⚙️ Konfiguracja SMTP - przejście z ENV na JSON

#### Usunięte
- ❌ Tekst o zmiennych środowiskowych Vercel
- ❌ Instrukcja o Settings → Environment Variables
- ❌ Statyczna sekcja z wymaganymi zmiennymi SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS

#### Dodane
- ✅ Plik `data/smtp.json` z konfiguracją:
  ```json
  {
    "host": "",
    "port": "587",
    "user": "",
    "pass": "",
    "configured": false
  }
  ```

- ✅ Formularz edycji SMTP w panelu Ustawienia:
  - SMTP Host (textbox)
  - SMTP Port (textbox, domyślnie 587)
  - SMTP User (email input)
  - SMTP Password (password input z podpowiedzią o App Password dla Gmail)
  - Przycisk "Zapisz konfigurację SMTP"

- ✅ API Config (`/app/api/config/route.js`):
  - GET obsługuje `type=smtp` (zwraca dane z smtp.json)
  - POST obsługuje `type=smtp` (zapisuje do smtp.json)

- ✅ API Contact (`/app/api/contact/route.js`):
  - Odczytuje konfigurację SMTP z `smtp.json` zamiast `process.env`
  - Sprawdza pole `configured` przed wysłaniem emaila

### 📋 Instrukcja dla użytkownika

1. **Konfiguracja SMTP**:
   - Przejdź do Panelu Admin → Ustawienia
   - Znajdź sekcję "📧 SMTP — wysyłanie emaili"
   - Wypełnij formularz danymi SMTP:
     - Host: np. `smtp.gmail.com`
     - Port: `587` lub `465`
     - User: twój adres email
     - Password: hasło (dla Gmail użyj App Password)
   - Kliknij "Zapisz konfigurację SMTP"

2. **Dane są teraz zapisywane w pliku JSON**:
   - Nie trzeba konfigurować zmiennych środowiskowych na Vercel
   - Wszystko zarządzane przez panel admina
   - Email wysyłany automatycznie gdy SMTP jest skonfigurowane

### 🔧 Pliki zmodyfikowane
- `/app/admin/bot/page.js` - kolory czcionek
- `/app/admin/firma/page.js` - kolory czcionek
- `/app/admin/realizacje/page.js` - kolory czcionek
- `/app/admin/ustawienia/page.js` - kolory + formularz SMTP
- `/components/ui/ChatWidget.js` - kolor czcionki w input
- `/app/api/config/route.js` - obsługa SMTP w JSON
- `/app/api/contact/route.js` - odczyt SMTP z JSON
- `/data/smtp.json` - nowy plik (utworzony)

### ✅ Status
Wszystkie zmiany wprowadzone i przetestowane. Projekt gotowy do wdrożenia.
