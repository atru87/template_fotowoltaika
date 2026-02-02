# Szybki start - 5 minut do działającej aplikacji

## Krok 1: Instalacja (1 min)

```bash
cd business-cards
npm install
```

## Krok 2: Uruchomienie (30 sek)

```bash
npm run dev
```

Aplikacja działa na: `http://localhost:3000`

## Krok 3: Wybierz branżę (30 sek)

Edytuj `app/page.js`, linia 10:

```javascript
const SELECTED_INDUSTRY = 'fotowoltaika';
// Zmień na: instalator, budowlana, medyczny, fryzjer, warsztat
```

Zapisz plik - strona odświeży się automatycznie.

## Krok 4: Dostosuj dane firmy (2 min)

### Opcja A: Przez panel admin
1. Idź do: `http://localhost:3000/admin/login`
2. Login: `admin` / Hasło: `admin123`
3. Kliknij "Dane firmy"
4. Wypełnij formularz
5. Zapisz

### Opcja B: Bezpośrednio w pliku
Edytuj `data/company.json`:

```json
{
  "name": "Twoja Firma Sp. z o.o.",
  "phone": "+48 123 456 789",
  "email": "kontakt@twojafirma.pl",
  "address": "ul. Główna 1, 00-000 Warszawa",
  "hours": "Pon-Pt: 9:00-17:00"
}
```

## Krok 5: Dodaj zdjęcia realizacji (1 min)

1. Idź do panelu: `http://localhost:3000/admin/realizacje`
2. Wklej URL zdjęcia (np. z Unsplash)
3. Kliknij "Dodaj zdjęcie"

**Darmowe zdjęcia:**
- [Unsplash](https://unsplash.com)
- [Pexels](https://pexels.com)
- [Pixabay](https://pixabay.com)

## GOTOWE! 🎉

Twoja strona działa z:
- ✅ Własnymi danymi
- ✅ Wybraną branżą
- ✅ Galerią realizacji
- ✅ Chatbotem (wymaga API key)

---

## Bonus: Konfiguracja czatu AI (opcjonalnie)

### 1. Zdobądź API key
1. Idź do: [console.anthropic.com](https://console.anthropic.com)
2. Zarejestruj się
3. Skopiuj API key

### 2. Dodaj do aplikacji
1. Panel admin: `http://localhost:3000/admin/bot`
2. Wklej API key
3. Dostosuj prompt systemowy
4. Dodaj triggery dla FAQ

### 3. Testuj
1. Kliknij ikonę czatu (prawy dolny róg)
2. Napisz wiadomość
3. Bot odpowie!

---

## Najczęstsze problemy

### Problem: "Module not found"
```bash
npm install
```

### Problem: "Port 3000 is already in use"
```bash
# Użyj innego portu
npm run dev -- -p 3001
```

### Problem: Zdjęcia nie ładują się
Dodaj domenę do `next.config.js`:
```javascript
images: {
  domains: ['images.unsplash.com', 'twoja-domena.com'],
}
```

---

## Następne kroki

1. **Dostosuj kolory** - edytuj `data/templates/[branża].json`
2. **Dodaj więcej sekcji** - stwórz nowe komponenty w `components/sections/`
3. **Zmień layout** - modyfikuj `app/layout.js`
4. **Deploy** - wrzuć na Vercel, Netlify lub inny hosting

---

## Potrzebujesz pomocy?

1. Sprawdź `README.md` - pełna dokumentacja
2. Zobacz `ARCHITECTURE.md` - jak działa aplikacja
3. Czytaj komentarze w kodzie
4. Testuj każdy moduł osobno

---

**Miłej zabawy z kodowaniem! 🚀**
