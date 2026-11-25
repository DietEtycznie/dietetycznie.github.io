# Architektura aplikacji DietEtycznie

Dokument opisuje strukturę kodu, przepływ danych, routing, bibliotekę komponentów UI oraz model bezpieczeństwa aplikacji **DietEtycznie** (`https://dietetycznie.github.io`).

---

## 1. Stack technologiczny

| Warstwa | Technologia | Rola |
| --- | --- | --- |
| Framework | **Angular 21.2** (100% Standalone Components, lazy-loaded routes, `@if` / `@for` / `@let`) | SPA bez `NgModule` |
| UI Kit | **Angular Material 21 (MDC)** + autorska biblioteka `src/app/components/ui` | Komponenty dostępnościowe (`mat-select`, `mat-menu`, `mat-dialog`, `mat-icon`) + spójny design system |
| Backend / Baza | **Firebase v13 (native SDK)** (`firebase/app`, `firebase/auth`, `firebase/firestore`) | Autentykacja i Firestore bez przestarzałego `@angular/fire` |
| Tryb Offline / Demo | `LocalStoreService` (`localStorage` + seed JSON) | Automatyczny fallback, gdy brak konfiguracji Firebase lub dostęp do sieci jest zablokowany |
| Stylowanie | **SCSS** + natywne zmienne CSS (`:root` / `:root[data-theme="dark"]`) | Jasny i ciemny motyw z animacją View Transitions API |
| Hosting / CI | **GitHub Pages** (`gh-pages`, `.github/workflows/deploy.yml`) | Automatyczny build i wdrożenie SPA (`404.html` fallback) |

---

## 2. Struktura katalogów

```text
src/
├── app/
│   ├── app.component.ts          # Shell aplikacji (Header + RouterOutlet + Footer)
│   ├── app.config.ts             # Konfiguracja routera, animacji i lokalizacji PL
│   ├── app.routes.ts             # Polskie trasy główne + przekierowania ze starych angielskich URL
│   ├── guards/
│   │   ├── auth.guard.ts         # Wymaga zalogowanego użytkownika (przekierowanie na /logowanie)
│   │   └── admin.guard.ts        # Wymaga uprawnień administratora (isAdmin$)
│   ├── components/
│   │   └── ui/                   # Reużywalna biblioteka komponentów UI (barrel: index.ts)
│   │       ├── index.ts          # Publiczne API biblioteki UI
│   │       ├── brand-logo/       # Wektorowe logo (listek + wordmark DietEtycznie)
│   │       ├── filter-strip/     # Poziomy pasek filtrów z licznikami .count-pill
│   │       ├── footer/           # Globalna stopka aplikacji
│   │       ├── header/           # Globalna nawigacja, przełącznik motywu, menu konta
│   │       ├── image-cropper-dialog/ # Edytor/przycinarka zdjęć dań (pan/zoom/rotate/radius/WebP)
│   │       ├── presentation-header/  # Nagłówek podstron z grafiką alpha + slotem akcji
│   │       ├── print-header/     # Nagłówek wyłącznie do wydruku A4 (logo + domena)
│   │       ├── recipe-card/      # Karta przepisu (normal / wide / compact)
│   │       └── search-input/     # Zunifikowane pole wyszukiwania 40px z przyciskiem czyszczenia
│   └── pages/                    # Widoki routowane (lazy-loaded)
│       ├── home/                 # Strona główna (hero + scroll storytelling + bento + o dietetyku)
│       ├── recipes/              # Katalog przepisów z panelem filtrów i sortowaniem
│       ├── recipe-details/       # Szczegóły przepisu, przelicznik porcji, wydruk A4
│       ├── conditions/           # Choroby dietozależne + karty zaleceń NCEŻ
│       ├── diet-plans/           # Jadłospisy (Gotowe, Moje, Indywidualne), lista zakupów, wydruk A4
│       ├── auth/                 # Logowanie i rejestracja
│       └── admin/                # Panel administracyjny (CRUD przepisów, chorób, planów, użytkowników)
├── assets/                       # Grafiki talerzy, hero light/dark, cutouty PNG, logo SVG
├── data/                         # Zestaw seed (39 przepisów, 8 chorób, 5 jadłospisów, użytkownicy demo)
├── environments/                 # Konfiguracja Firebase (environment.ts ignorowane w Git)
├── models/                       # Interfejsy domenowe i słowniki (Recipe, DietPlan, MedicalCondition, User)
├── services/                     # Warstwa dostępu do danych, autentykacji i motywu
├── styles.scss                   # Globalne tokeny CSS, przyciski, formularze, Material overrides, druk
└── vars.scss                     # Pomocnicze zmienne SCSS (promienie, cienie, kolory semantyczne)
```

---

## 3. Biblioteka komponentów UI (`src/app/components/ui`)

Wszystkie współdzielone komponenty prezentacyjne eksportowane są przez pojedynczy plik barrel [`src/app/components/ui/index.ts`](../src/app/components/ui/index.ts).

```ts
import {
  BrandLogoComponent,
  FilterStripComponent,
  PresentationHeaderComponent,
  PrintHeaderComponent,
  RecipeCardComponent,
  SearchInputComponent,
} from "../../components/ui";
```

| Komponent | Selektor | Zastosowanie |
| --- | --- | --- |
| `AuthShellComponent` | `<app-auth-shell>` | Dwukolumnowy layout split-screen dla `/logowanie` i `/rejestracja` (lewy panel z hasłem i grafiką alpha + prawy panel z formularzem). |
| `BrandLogoComponent` | `<app-brand-logo>` | Jedno źródło prawdy dla znaku marki (`size="sm\|md\|lg"`, `surface="paper\|surface\|white"`). Automatycznie dopasowuje kolor wycięcia w trybie jasnym, ciemnym i w druku. |
| `PresentationHeaderComponent` | `<app-presentation-header>` | Nagłówek podstron z przezroczystą kompozycją owoców (`assets/presentation-header-cutout.png`), szmaragdową poświatą i slotem `<ng-content>` na zakładki lub wyszukiwarkę. |
| `FilterStripComponent` | `<app-filter-strip>` | Bezramkowy pasek zakładek/filtrów z opcjonalnymi licznikami `.count-pill` (używany na `/choroby` i `/jadlospisy`). |
| `SearchInputComponent` | `<app-search-input>` | Pole wyszukiwania o wysokości `40px` z ikoną lupy i przyciskiem czyszczenia (używane w `/choroby` i `/admin`). |
| `PrintHeaderComponent` | `<app-print-header>` | Pasek widoczny wyłącznie w `@media print`: logo po lewej + domena `dietetycznie.github.io` po prawej. |
| `RecipeCardComponent` | `<app-recipe-card>` | Karta dania w wariantach `normal`, `wide` (lista) i `compact` (slot w jadłospisie). |
| `ImageCropperDialogComponent` | `<app-image-cropper-dialog>` | Interaktywny edytor zdjęć dla panelu admina: drag-and-drop, przesuwanie, zoom, obrót, płynny suwak zaokrąglenia (`0%–50%`), podgląd mini-karty i eksport WebP Base64 / PNG. |
| `HeaderComponent` / `FooterComponent` | `<app-header>` / `<app-footer>` | Globalny layout nawigacyjny z przełącznikiem motywu (View Transitions) i menu konta. |

---

## 4. Routing i nawigacja (polskie adresy URL)

Wszystkie trasy zdefiniowane w [`src/app/app.routes.ts`](../src/app/app.routes.ts) używają przyjaznych polskich ścieżek z zachowaniem pełnej kompatybilności wstecznej dla dawnych adresów angielskich:

| Ścieżka główna | Przekierowanie legacy | Widok | Ochrona |
| --- | --- | --- | --- |
| `/` | — | `HomeComponent` | Publiczny |
| `/przepisy` | `/recipes` | `RecipesComponent` | Publiczny |
| `/przepisy/:uid` | `/recipes/:uid` | `RecipeDetailsComponent` | Publiczny |
| `/choroby` | `/conditions` | `ConditionsComponent` | Publiczny |
| `/choroby/:id` | `/conditions/:id` | `ConditionsComponent` (rozwiń chorobę) | Publiczny |
| `/jadlospisy` | `/diet-plans` | `DietPlansComponent` | Publiczny (`Moje` i `Indywidualne` wymagają logowania) |
| `/logowanie` | `/login` | `LoginComponent` | Publiczny |
| `/rejestracja` | `/register` | `RegisterComponent` | Publiczny |
| `/admin` | — | `AdminComponent` | `adminGuard` |

Parametry zapytania (`queryParams`):
- `/przepisy?q=...&condition=...&diet=...&liked=1`
- `/jadlospisy?section=myPlans|personalized&condition=...`
- `/logowanie?returnUrl=/...` (walidacja open-redirect: dozwolone tylko ścieżki zaczynające się od pojedynczego `/`)

---

## 5. Warstwa danych i tryb fallback

Serwisy domenowe (`RecipeService`, `MedicalConditionService`, `DietPlanService`, `UserService`, `AuthService`) korzystają ze wspólnego `FirebaseService`:

1. **Tryb produkcyjny (Firebase):** Odczyty i zapisy trafiają bezpośrednio do Cloud Firestore (`recipes`, `medicalConditions`, `dietPlans`, `users`, `admins`).
2. **Tryb lokalny / fallback:** Jeśli `environment.firebase` jest puste lub połączenie z Firestore nie powiedzie się, `LocalStoreService` przejmuje obsługę danych w `localStorage` z pełnym zestawem startowym (`src/data/seed-data.ts`). Dzięki temu aplikacja działa w 100% interaktywnie również offline oraz w środowiskach demo.

### Modele domenowe (`src/models/`)

- **`Recipe`**: `uid`, `name`, `description`, `prepTimeMinutes`, `servings`, makroskładniki (`calories`, `protein`, `carbs`, `fat`, `fiber`, `sodium`), `ingredients[]`, `instructions[]`, `mealType[]`, `suitableForConditions[]`, `dietTags[]`, `imageUrl`.
- **`MedicalCondition`**: `id`, `name`, `shortSummary`, `description`, `dietaryRecommendations[]`, `lifestyleRecommendations[]`, `foodsToEat[]`, `foodsToAvoid[]`, `warnings[]`, `pdfURL`.
- **`DietPlan`**: `id`, `name`, `description`, `userId` (`null` dla planów publicznych), `isPersonalized` (plany kliniczne przypisane pacjentowi przez dietetyka — tylko do odczytu z możliwością kopiowania), `assignedBy`, `dietitianNotes`, `mealPlan` (`Record<DayKey, string[]>` — 7 dni × 5 posiłków).
- **`User`**: `uid`, `email`, `displayName`, `role` (`"user" | "admin"`), `tier` (`"free" | "pro" | "private"`), `savedRecipes[]`, `medicalConditions[]`.

---

## 6. Bezpieczeństwo i uprawnienia (RBAC)

Reguły bezpieczeństwa Firestore w [`firestore.rules`](../firestore.rules) wymuszają uprawnienia po stronie serwera:

- **Definicja administratora (`isAdmin()`):**
  1. Właściciel bootstrap (`isBootstrapAdmin()` — stałe UID), lub
  2. Custom claim `request.auth.token.admin == true`, lub
  3. Istniejący dokument w kolekcji `admins/{uid}`, lub
  4. Pole `role == 'admin'` w `users/{uid}`.
- **Ochrona przed eskalacją uprawnień:** Zwykły użytkownik może aktualizować własny profil w `users/{uid}`, ale reguły blokują ustawienie pola `role` przy rejestracji oraz jakąkolwiek zmianę `role` przy edycji. Nadawanie i odbieranie roli administratora z panelu `/admin` synchronizuje jednocześnie `users/{uid}.role` i `admins/{uid}` — wykonalne wyłącznie przez istniejącego administratora.
- **Ochrona planów indywidualnych (`isPersonalized == true`):** Pacjent może wyłącznie **odczytywać** plany przypisane mu przez dietetyka oraz skopiować je jako własną kopię roboczą (`isPersonalized: false`). Edycja, usuwanie i tworzenie planów z flagą `isPersonalized: true` są zablokowane po stronie Firestore dla kont nie-administratorskich.
- **Sekrety:** Plik `src/environments/environment.ts` znajduje się w `.gitignore`. W CI klucze są wstrzykiwane z GitHub Actions Secrets podczas buildu.

---

## 7. Komendy deweloperskie

```bash
npm start          # Lokalny serwer developerski (http://localhost:4200)
npm run build      # Produkcyjny build (dist/demo)
npm run seed       # Zasilenie Firestore danymi startowymi (Node script)
```
