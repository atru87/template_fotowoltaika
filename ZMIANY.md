# ✅ ZMIANY W PROJEKCIE

## Co zostało naprawione:

### 1. ❌ Problem: Brak ikony czatu na stronie
**Rozwiązanie:** Dodano `<ChatWidget />` do `app/layout.js`

### 2. 🔄 Zmiana API: Claude → Groq
**Powód:** Groq jest darmowy i pozwala na więcej rozmów
- Claude: ~50 wiadomości/dzień (płatne)
- **Groq: 30 wiadomości/minutę = 14,400/dzień (DARMOWE!)**

## Pliki zmienione:

1. **app/layout.js** - dodano ChatWidget
2. **lib/chatLogic.js** - zmieniono API z Claude na Groq
3. **GROQ_SETUP.md** - nowa instrukcja konfiguracji

## Jak uruchomić:

### Krok 1: Zainstaluj zależności
```bash
npm install
```

### Krok 2: Pobierz DARMOWY klucz API Groq
Szczegółowa instrukcja w pliku: **GROQ_SETUP.md**

Szybko:
1. https://console.groq.com/ → Załóż konto
2. API Keys → Create API Key
3. Skopiuj klucz

### Krok 3: Dodaj klucz do projektu

**Opcja A - Panel admina:**
```bash
npm run dev
# Idź na: http://localhost:3000/admin
# Hasło: admin123
# Wklej klucz API i zapisz
```

**Opcja B - Ręcznie:**
Edytuj `data/bot-config.json`:
```json
{
  "apiKey": "gsk_TWOJ_KLUCZ_Z_GROQ",
  "systemPrompt": "Jesteś pomocnym asystentem firmy..."
}
```

### Krok 4: Przetestuj
1. Odśwież stronę
2. Kliknij ikonę czatu (prawy dolny róg)
3. Napisz: "Cześć"
4. Bot odpowie! 🎉

## Dlaczego Groq?

✅ **Całkowicie darmowy** (30 zapytań/minutę)
✅ **Najszybszy** ze wszystkich darmowych API
✅ **Stabilny** - działa bez problemów
✅ **Łatwa integracja** - kompatybilny z OpenAI API
✅ **Dobre modele** - Llama 3.1 70B to mocny model

## Porównanie darmowych API:

| API | Limit dzienny | Szybkość | Jakość |
|-----|--------------|----------|---------|
| **Groq** | ~14,400 | ⚡⚡⚡ | ⭐⭐⭐⭐ |
| Google Gemini | ~8,640 | ⚡⚡ | ⭐⭐⭐⭐ |
| Cohere | 1,000 | ⚡ | ⭐⭐⭐ |
| Claude (płatne) | ~50 | ⚡⚡ | ⭐⭐⭐⭐⭐ |

## Alternatywy (jeśli Groq nie działa):

### Google Gemini (też darmowy)
W `lib/chatLogic.js` zmień endpoint na:
```javascript
const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: message }] }]
    })
  }
);
```

## Struktura projektu (bez zmian):

```
project/
├── app/
│   ├── layout.js          ✅ ZMIENIONY - dodano ChatWidget
│   ├── page.js
│   ├── admin/
│   └── api/
├── components/
│   └── ui/
│       └── ChatWidget.js  ✓ Działa poprawnie
├── lib/
│   └── chatLogic.js       ✅ ZMIENIONY - Groq API
├── data/
│   ├── bot-config.json    ⚠️  Dodaj tutaj klucz API
│   └── triggers.json
└── GROQ_SETUP.md          🆕 NOWY - instrukcja
```

## FAQ

**Q: Czy Groq jest naprawdę darmowy?**
A: Tak! 30 zapytań/minutę bez kosztów.

**Q: Co jeśli przekroczę limit?**
A: API zwróci błąd 429. Poczekaj minutę i spróbuj ponownie.

**Q: Czy mogę używać innego modelu?**
A: Tak! Dostępne modele Groq:
- `llama-3.1-70b-versatile` (zalecany)
- `llama-3.1-8b-instant` (szybszy)
- `mixtral-8x7b-32768` (dużo tokenów)

**Q: Ikona czatu nie działa?**
A: Sprawdź:
1. Czy uruchomiłeś `npm run dev`
2. Czy dodałeś klucz API
3. Czy odświeżyłeś przeglądarkę (Ctrl+F5)

## Support

Problemy? Sprawdź:
1. Konsolę przeglądarki (F12)
2. Terminal gdzie uruchomiłeś `npm run dev`
3. Plik `GROQ_SETUP.md` - szczegółowe instrukcje

---

**Status: ✅ GOTOWE DO UŻYCIA**

Potrzebujesz tylko:
1. Klucza API z Groq (2 minuty)
2. Uruchomić `npm run dev`
3. Cieszyć się darmowym czatem AI! 🚀
