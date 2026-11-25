# Wytyczne UI i Design System — DietEtycznie

Dokument określa standardy wizualne i interakcyjne aplikacji **DietEtycznie**. Każdy nowy widok i komponent powinien trzymać się poniższych zasad, aby cały produkt zachował spójność i lekkość.

---

## 1. Filozofia wizualna

- **Editorial minimalism (Notion / Apple / ZOE):** dużo światła, czytelna hierarchia typograficzna, cienkie linie dzielące (`1px solid var(--border-subtle)`) zamiast ciężkich ramek, cieni i wielowarstwowych „pudełek w pudełkach”.
- **Spokojna paleta szmaragdowa:** kolor akcentu (`--accent-primary`) służy wyłącznie do kluczowych CTA, stanów aktywnych, polubień i wyróżnień danych (np. kcal). Nie kolorujemy tła dużych kart na jaskrawo.
- **Zero „klisz AI”:** unikamy krzykliwych fioletowych gradientów, przesadnych efektów neonowych, nadmiaru ikon przy każdej etykiecie i zbędnych pigułek z marketingowymi hasłami.
- **Pełna równowaga Light & Dark Mode:** każdy kolor pochodzi ze zmiennej CSS w [`src/styles.scss`](../src/styles.scss). Nie wolno wpisywać na sztywno kolorów tła ani tekstu (wyjątek: sekcja `@media print`, która zawsze drukuje na czystej bieli `#ffffff`).

---

## 2. Tokeny kolorystyczne (CSS Custom Properties)

Zdefiniowane w [`src/styles.scss`](../src/styles.scss):

| Token | Tryb jasny (`:root`) | Tryb ciemny (`[data-theme="dark"]`) | Zastosowanie |
| --- | --- | --- | --- |
| `--bg-page` | `#f6f9f7` | `#0b1210` | Główne tło strony |
| `--bg-paper` | `#fffefc` | `#0e1613` | Ciepłe tło nagłówka, kart szczegółów, sekcji redakcyjnych |
| `--bg-surface` | `#ffffff` | `#131e1a` | Powierzchnie kart, modali, inputów, menu |
| `--bg-subtle` | `#f2f7f4` | `#192822` | Delikatne tła kafelków, miniatur dań, pigułek |
| `--border-subtle` | `#e5ece8` | `rgba(255, 255, 255, 0.09)` | Hairline dividers i ramki kart |
| `--border-strong` | `#cddbd4` | `rgba(255, 255, 255, 0.16)` | Ramki przycisków secondary, inputów i selectów |
| `--ink-primary` | `#13221c` | `#f1f6f3` | Nagłówki, tekst główny |
| `--ink-secondary` | `#51665d` | `#a4b8af` | Opisy, etykiety wtórne |
| `--ink-muted` | `#7b9086` | `#72887e` | Metadane, placeholdery, liczniki |
| `--accent-primary` | `#20b27f` | `#24c48c` | Główne CTA, aktywne zakładki, ikony polubień |
| `--accent-hover` | `#199c6e` | `#2dd49a` | Stan hover dla CTA |
| `--accent-dark` | `#15875f` | `#34d399` | Aktywne linki, etykiety o wysokim kontraście |
| `--accent-soft` | `#e8f7f1` | `rgba(36, 196, 140, 0.14)` | Delikatne wypełnienie badge’y i aktywnych stanów |
| `--check-fg` | `#ffffff` | `#071510` | Kolor „ptaszka” w checkboxach i ukończonych krokach |

Przełączanie motywu obsługuje `ThemeService` z animacją kołowego przejścia **View Transitions API** wychodzącą z pozycji kliknięcia przycisku słońca/księżyca.

---

## 3. Typografia i siatka

- **Nagłówki (`h1–h6`, przyciski, liczby makro):** `"Plus Jakarta Sans"`, ciasny tracking (`letter-spacing: -0.02em` do `-0.03em`), `font-variant-numeric: tabular-nums` dla kalorii i gramatur.
- **Tekst bieżący i kontrolki:** `"Inter"`, bazowy rozmiar `15px`, interlinia `1.6`.
- **Kontener główny (`.container`):** `max-width: 1240px`, poziomy padding `1.25rem`.

---

## 4. Standardy kontrolek i formularzy

### Zunifikowana skala wysokości: `40px` i `border-radius: 8px`
Wszystkie kontrolki w paskach narzędzi i formularzach akcji muszą mieć identyczną wysokość **`40px`** oraz zaokrąglenie **`8px`**, aby leżały w jednej optycznej linii:
- Przyciski `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-ghost`
- Dropdowny `<mat-select class="app-select">`
- Pola wyszukiwania `<app-search-input>`
- Przyciski ikonowe akcji (np. `.icon-menu-btn` — `40px × 40px`)
- Przelicznik porcji (`.portion-stepper`)

### Dropdowny — ZAWSZE Angular Material
- **Zakaz używania natywnego `<select>`** — zamiast niego stosujemy `<mat-select class="app-select">`.
- Globalne style w `src/styles.scss` ustawiają `padding` bezpośrednio na `.mat-mdc-select-trigger` (a `padding: 0` na elemencie hosta), dzięki czemu panel CDK Overlay otwiera się idealnie na szerokość i krawędź obramowania kontrolki.

### Menu kontekstowe (`⋮`)
- Na kartach z wieloma akcjami (np. jadłospisy) pokazujemy **1 główny przycisk CTA** (`.btn-primary`) + przycisk ikonowy `40×40` otwierający `<mat-menu xPosition="before">`.
- Akcje destrukcyjne (np. „Usuń plan”) oddzielamy `<div class="menu-divider"></div>` i oznaczamy klasą `.menu-item--danger`.

### Checkboxy
- Globalnie wystylizowane w `src/styles.scss` (bez natywnego wyglądu przeglądarki): **`18px × 18px`**, `border-radius: 6px`, wycentrowany biały/ciemny checkmark (`var(--check-fg)`), delikatny pierścień fokusu `--accent-soft`.

### Liczniki i odznaki — `.count-pill`
- Zamiast nawiasów tekstowych typu `Gotowe (5)` zawsze używamy globalnej klasy `<span class="count-pill">5</span>` obok etykiety.

### Polubienia (serduszka)
- Ikony polubienia przepisu (`favorite` / `favorite_border`) używają głównego koloru marki (`var(--accent-primary)`), a nie czerwieni/różu.

---

## 5. Identyfikacja marki i multimedia

### Logo (`<app-brand-logo>`)
- Zawsze używaj komponentu `<app-brand-logo [size]="'sm'|'md'|'lg'" [surface]="'paper'|'surface'|'white'">` zamiast wklejania surowego SVG.
- Komponent gwarantuje optyczne wycentrowanie wielkiej litery **`D`** względem zielonej ikony listka (`viewBox="10 64 845 171"`) oraz dynamiczny kolor wycięcia dopasowany do tła (`paper`, `surface` lub `white` w druku).

### Zdjęcia dań i grafiki z kanałem alpha
- **Talerze z przepisami:** zawsze `object-fit: contain` (nigdy `cover`, żeby nie obcinać rantów talerza) na subtelnym tle `--bg-subtle` z lekkim `drop-shadow`.
- **Nagłówki podstron (`<app-presentation-header>`):** pojedyncza grafika PNG z pełnym kanałem alpha (`assets/presentation-header-cutout.png`) renderowana identycznie w trybie jasnym i ciemnym, z neutralną szarą poświatą studyjną CSS (`.presentation-header__glow`).
- **Kadrowanie nowych zdjęć:** dodawanie i przycinanie zdjęć w `/admin` odbywa się przez `ImageCropperDialogComponent`, który eksportuje gotowe lekkie obrazy WebP (600 / 800 / 1024 px).

---

## 6. Standardy wydruku A4 (`@media print`)

Widoki przeznaczone do drukowania (`/przepisy/:uid`, `/jadlospisy`) muszą przestrzegać wspólnych zasad:
1. W globalnym `@media print` ustawione jest `@page { size: A4; margin: 0; }` (usuwa domyślne nagłówki/stopki przeglądarki z datą i URL), a marginesy strony (`12mm`) zapewnia układ dokumentu.
2. Na górze każdej drukowanej strony wyświetlany jest komponent **`<app-print-header>`** (logo `DietEtycznie` po lewej + `dietetycznie.github.io` po prawej).
3. Dla wydruków wielostronicowych (7-dniowy jadłospis) stosujemy strukturę `<table>` z powtarzającymi się sekcjami `<thead>` (z `<app-print-header>`) oraz `<tfoot>` (dolny margines `10mm`), aby każda kolejna kartka A4 miała spójny nagłówek i bezpieczne odstępy.
4. Ukrywamy elementy interaktywne (nawigacja, stopka, przyciski akcji, breadcrumbs, podpowiedzi).

---

## 7. Checklist przed dodaniem nowego widoku / komponentu

- [ ] Czy element reużywalny trafił do `src/app/components/ui/` i został wyeksportowany w `index.ts`?
- [ ] Czy wszystkie kolory korzystają ze zmiennych CSS (`--bg-*`, `--ink-*`, `--border-*`, `--accent-*`) i wyglądają poprawnie w **Light** i **Dark Mode**?
- [ ] Czy dropdowny używają `<mat-select class="app-select">` zamiast `<select>`?
- [ ] Czy przyciski, wyszukiwarki i selecty w paskach narzędzi mają spójną wysokość `40px` i `border-radius: 8px`?
- [ ] Czy liczniki używają `.count-pill` zamiast nawiasów `(N)`?
- [ ] Czy wszystkie linki używają polskich ścieżek (`/przepisy`, `/choroby`, `/jadlospisy`, `/logowanie`, `/rejestracja`)?
- [ ] Czy `npm run build` kończy się z `0` błędami i `0` ostrzeżeniami?
