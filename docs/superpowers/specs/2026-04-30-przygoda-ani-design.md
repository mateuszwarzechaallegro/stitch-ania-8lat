# Design: Przygoda Ani — Urodzinowa Gra Skarbów

**Data:** 2026-04-30  
**Projekt:** stitch-ania-8lat (GitHub Pages)  
**Bohaterka:** Ania, 8 lat  
**Motyw:** Stitch + Hello Kitty — równy miks  

---

## 1. Cel i kontekst

Interaktywna gra terenowa na urodziny dla dzieci, łącząca poszukiwanie skarbów z puzzlami na stronie WWW. Dzieci mają dostęp do jednego telefonu z Androidem i rysika. Strona hostowana na GitHub Pages (repozytorium `stitch-ania-8lat`). Brak backendu — czyste statyczne HTML/CSS/JS.

---

## 2. Fabuła

> *„Alarm! Hello Kitty wysyła wiadomość do Ani: Stitch leciał na Twoje urodziny swoim statkiem kosmicznym, ale coś poszło nie tak! Statek rozbił się awaryjnie w ogrodzie. Systemy pokładowe nie działają, reaktor wyczerpany, a klucz startowy systemu nawigacyjnego zagubił się przy lądowaniu. Tylko Ty możesz go uratować i odebrać urodzinową niespodziankę! Ruszaj na misję!"*

Każdy etap gry to jeden krok w naprawie statku Stitcha.

---

## 3. Architektura — podejście A (wiele plików HTML)

Każdy krok przygody = osobny plik `.html`. Linki między stronami i breloki NFC prowadzą bezpośrednio do właściwego URL. Bez frameworków, bez narzędzi budowania.

### Pliki

| Plik | Opis | Dostęp |
|---|---|---|
| `index.html` | Naładuj reaktor — akcelerometr | URL z breloka NFC #1 |
| `zodiak.html` | Labirynt kosmiczny → ♉ | Link z `index.html` |
| `misja.html` | Odliczanie + mapa + wpisz kod | Link z `zodiak.html` |
| `final.html` | Układanka wtorek + Simon Says | URL z breloka NFC #3 |
| `style.css` | Wspólne style, zmienne CSS | Import we wszystkich plikach |

### Elementy fizyczne

| # | Przedmiot | Zawartość | Lokalizacja |
|---|---|---|---|
| Papier | Wydrukowana instrukcja A4 | Historia + mapka (Start → wykrywacz → brelok #1) | Wręczona Ani na starcie |
| NFC #1 | Brelok/brylok | URL `https://[user].github.io/stitch-ania-8lat/` | Ukryty w trawie/pod korą; wykrywacz metalu naprowadza |
| NFC #2 | Brelok/brylok | Link Google Maps z współrzędnymi drzewa | Zakopany w wyznaczonym miejscu; WiFi-detektor zapika gdy blisko |
| NFC #3 | Brelok/brylok | URL `https://[user].github.io/stitch-ania-8lat/final.html` | Ukryty w „bazie" (domek/skrzynka/szopa) |
| Drzewo | Biały znak namalowany | Rower + cyfra 3 | Przy drzewie wskazywanym przez NFC #2 (Google Maps) |

---

## 4. Szczegółowy opis ekranów

### 4.1 `index.html` — Naładuj reaktor

**Historia na ekranie:**
> *„Znalazłaś klucz startowy! Uruchamiam systemy pokładowe… ale reaktor jest pusty! Musisz naładować energię zanim zaczniemy misję. BIEGNIJ!"*

**Mechanika:**
- Animowany pasek postępu reaktora 0 → 100%
- Napełniany przez `DeviceMotion` API (akcelerometr) — detekcja kroków przez progi przyspieszenia
- Cel: ~200 kroków (≈ 100 m biegu)
- Przycisk *„Zażądaj dostępu do ruchu"* na starcie (wymagane na iOS/niektórych Androidach)
- Po osiągnięciu 100%: animacja wybuchu energii + przycisk *„Reaktor gotowy! Odpal systemy →"*

**Fallback:** Jeśli DeviceMotion niedostępny (przeglądarka blokuje) — ukryty przycisk-fallback po 30 sekundach nieaktywności.

---

### 4.2 `zodiak.html` — Labirynt kosmiczny

**Historia na ekranie:**
> *„System nawigacyjny wymaga kodu dostępu. Hasło to Twój kosmiczny znak. Komputer pokładowy zaszyfrował go w labiryncie. Przeprowadź rysik przez właściwą ścieżkę — ona sama ujawni odpowiedź!"*

**Mechanika:**
- HTML5 Canvas z narysowanym labiryntem
- Obsługa dotyku i rysika (`pointerdown`, `pointermove`, `pointerup`), `touch-action: none`
- Ścieżki labiryntu zaprojektowane tak, że jedyne wyjście tworzy kształt ♉ (koło + dwa rogi)
- Detekcja poprawnej ścieżki: sprawdzenie czy punkt dotarł do wyjścia (prostokąt wyjściowy)
- Po dotarciu do wyjścia: ścieżka animuje się w kolorze fioletowo-różowym, symbol ♉ podświetla się w centrum
- Komunikat: *„To Twój kosmiczny znak — BYK ♉! Ustaw ten symbol na pudełku, a potem kliknij Dalej."*
- Przycisk *„Dalej →"* zawsze widoczny (dzieci mogą potrzebować pomocy)

---

### 4.3 `misja.html` — Sygnał awaryjny

**Historia na ekranie:**
> *„Skanery pokładowe wykryły zagubioną część reaktora! Sygnał jest słaby — macie tylko 5 minut zanim zaniknie. Idźcie w zaznaczone miejsce. Gdy usłyszycie pikanie — jesteście blisko!"*

**Mechanika — część 1: Odliczanie:**
- Duży licznik 5:00 odliczający w dół (localStorage przechowuje czas startu — odświeżenie strony nie resetuje)
- Placeholder mapki (obraz SVG z zaznaczonym punktem X)
- Notatka: *„Urządzenie zacznie pikać gdy się zbliżycie"* (WiFi-detektor)

**Mechanika — część 2: Kod seryjny:**
- Formularz *„Wpisz numer seryjny części, który znalazłaś:"* jest zawsze widoczny poniżej mapy (timer jest dramatyczny/atmosferyczny, nie blokuje dostępu do formularza)
- Pole tekstowe + przycisk *„Sprawdź"*
- Poprawna odpowiedź: `3` (case insensitive)
- Po poprawnej odpowiedzi: konfetti, komunikat *„Cyfra 3 — zapamiętaj ją! To numer do ustawienia na pudełku."* + pojawia się drugi placeholder mapki z zaznaczoną bazą + tekst *„Lecicie do bazy! Tam czeka kolejna wskazówka."*
- Błędna odpowiedź: *„Nie to… Sprawdź jeszcze raz znak na drzewie."* (bez limitu prób)

**Uwaga do projektowania map:**
Oba obrazy map to tymczasowe placeholdery SVG. Właściciel projektu podmieni je na zdjęcia/zrzuty z prawdziwymi lokalizacjami przed imprezą.

---

### 4.4 `final.html` — Centrum dowodzenia

**Historia na ekranie:**
> *„Brawo! Dotarłyście do centrum dowodzenia statku Stitcha! Zostały ostatnie dwa kody do aktywacji głównego reaktora. Hello Kitty ma dla Was ostatnie zadania — dajcie radę!"*

**Mechanika — część 1: Układanka dni tygodnia**

Historia:
> *„Komputer pokładowy potrzebuje kodu czasowego. Ułóżcie dni tygodnia w prawidłowej kolejności!"*

- 7 kafelków z nazwami (PON, WT, ŚR, CZW, PT, SOB, NIE) rozsypanych losowo na ekranie
- Drag & drop do 7 ponumerowanych slotów
- Po poprawnym ułożeniu: WT podświetla się kolorem różowym z animacją
- Komunikat: *„Wtorek — to dzień urodzin Ani! Ustaw TU na pudełku."*
- Przycisk *„Następne zadanie →"*

**Mechanika — część 2: Simon Says emocji**

Historia:
> *„Hello Kitty wysyła ostatnią wiadomość zakodowaną w emocjach. Zapamiętaj sekwencję i powtórz ją — ostatnia emocja to Wasz ostatni kod!"*

- 4 duże przyciski-emocje: 😢 😠 😲 😊
- Hello Kitty „pokazuje" sekwencję 4 emocji (przyciski podświetlają się kolejno — wizualny flash + opcjonalna wibracja przez Vibration API, bez Web Audio)
- Sekwencja zawsze kończy się na 😊, ale pierwsze 3 są losowe
- Dzieci tapią w tej samej kolejności
- Po poprawnym powtórzeniu: animacja Hello Kitty tańczącej, komunikat:
  *„Ostatnia emocja to UŚMIECHNIĘTA BUZIA 😊 — ostatni kod aktywowany!"*
- Błędne tapnięcie: delikatne drżenie ekranu, sekwencja pokazuje się od nowa

**Ekran końcowy (po obu częściach):**
- Duże konfetti, animacja Stitcha i Hello Kitty
- *„BRAWO ANIA! Zebrałaś wszystkie 4 kody! Ustaw je na pudełku i otwórz niespodziankę! 🎉"*
- Lista kodów: `3 · ♉ · TU · 😊`

---

## 5. Styl wizualny

### Kolory
```css
--bg:          #0d0d1a;   /* tło główne */
--surface:     #1a1230;   /* karty, sekcje */
--border:      #3a2060;   /* obramowania */
--purple:      #c45cd9;   /* akcent fioletowy (Hello Kitty) */
--pink:        #ff6ba8;   /* akcent różowy (Hello Kitty) */
--blue:        #2d7dd2;   /* akcent niebieski (Stitch) */
--teal:        #00b4d8;   /* akcent turkusowy (Stitch) */
--text:        #f0eaff;   /* tekst główny */
--text-muted:  #a89cc8;   /* tekst pomocniczy */
--success:     #52b788;   /* poprawna odpowiedź */
```

### Typografia
- Czcionka systemowa (`system-ui`) lub Google Fonts `Nunito` (zaokrąglona, przyjazna dzieciom)
- Duże przyciski (min. 48px wysokości) — łatwe tapnięcie palcem/rysikiem
- Rozmiary tekstu: 18–22px dla treści gry, 14px dla instrukcji

### Layout
- Mobile-first, `max-width: 430px`, wycentrowane na `100vw`
- `viewport` meta tag z `initial-scale=1.0`
- Brak poziomego scrollowania

### Motywy postaci
- Stitch: emoji 👾, kolor `--blue` i `--teal`, kosmiczne animacje
- Hello Kitty: emoji 🎀, kolor `--purple` i `--pink`, kokarda w dekoracjach
- Naprzemiennie w kolejnych ekranach

---

## 6. Instrukcja fizyczna dla organizatora

### Co wydrukować
1. **Instrukcja A4 dla Ani** — zawiera:
   - Krótką historię (Stitch rozbił statek)
   - Mapkę z zaznaczonymi: Start, Miejsce wykrywacza metalu, Punkt gdzie jest NFC #1
   - Informację *„Znajdź klucz startowy i zeskanuj go telefonem"*

### Co zaprogramować w brylokach NFC
| Brelok | Typ zapisu | Wartość |
|---|---|---|
| NFC #1 | URL | `https://[user].github.io/stitch-ania-8lat/` |
| NFC #2 | URL | Google Maps link z dokładnymi współrzędnymi drzewa (format: `https://maps.google.com/?q=LAT,LNG`) |
| NFC #3 | URL | `https://[user].github.io/stitch-ania-8lat/final.html` |

### Co ukryć/przygotować fizycznie
1. **NFC #1** — ukryć pod korą / w trawie / pod kamieniem w pobliżu startowego punktu. Zakopać lub przykryć metalowym przedmiotem (kapsel, monetka) żeby wykrywacz go znalazł
2. **NFC #2** — zakopać płytko w ziemi/trawie w miejscu wskazywanym przez mapkę na `misja.html`. WiFi-detektor piknie gdy dzieci się zbliżą
3. **Znak na drzewie** — biały znak (namalowany lub wydrukowany i przyklejony) z rysunkiem roweru i cyfrą **3**
4. **NFC #3** — ukryć w „bazie" (domek ogrodowy, skrzynka, wyznaczone miejsce) razem z puzzle boxem lub w jego okolicy
5. **Puzzle box** — ustawić zamki na kombinację blokującą (nie na rozwiązanie `3 · ♉ · TU · 😊`)

### Ustawienia puzzle boxa (kolejność stron)
| Strona | Symbol | Odpowiedź |
|---|---|---|
| 1 (cyfry 0-9) | liczba | **3** |
| 2 (znaki zodiaku) | ♉ Byk | **♉** |
| 3 (skróty dni) | Tu | **TU** (wtorek) |
| 4 (emotki/twarze) | 😊 | **uśmiechnięta buzia** |

---

## 7. Wymagania techniczne

- **Przeglądarka:** Chrome na Androidzie (DeviceMotion API dostępne bez HTTPS na localhost, wymagane HTTPS na GitHub Pages — spełnione)
- **DeviceMotion:** Automatyczne na Androidzie/Chrome; na iOS wymaga `DeviceMotionEvent.requestPermission()` — obsłużone buttonem
- **Canvas:** HTML5 Canvas API, pointer events dla rysika
- **Drag & drop:** Implementacja oparta na touch/pointer events (HTML5 Drag and Drop API pominięte — słabe wsparcie na mobile)
- **Brak localStorage cross-origin** — każda strona jest niezależna, timer w `misja.html` używa `localStorage` żeby przeżyć refresh
- **Offline:** strony działają offline po załadowaniu (cache przeglądarki)
- **Zero zewnętrznych zależności:** brak npm, brak frameworków, brak CDN — wszystko inline lub w `style.css`

---

## 8. Poza zakresem

- Scoring / punkty
- Leaderboard
- Dźwięki (opcjonalnie można dodać Web Audio API dla Simon Says, ale nie wymagane)
- Obsługa wielu języków
- PWA / service worker
- Autoryzacja / logowanie
