# DietEtycznie

Nowoczesna aplikacja webowa wspierająca codzienne planowanie diety w chorobach dietozależnych — baza sprawdzonych przepisów z pełnym makro, zalecenia żywieniowe oparte na wytycznych NCEŻ, tygodniowe jadłospisy (gotowe, własne i indywidualne od dietetyka) oraz panel administracyjny.

🌐 **Wersja produkcyjna:** [https://dietetycznie.github.io](https://dietetycznie.github.io)

---

## Dokumentacja projektu

- 📐 **[Architektura aplikacji](docs/ARCHITECTURE.md)** — struktura katalogów, biblioteka UI, routing, warstwa danych i model bezpieczeństwa RBAC (`firestore.rules`).
- 🎨 **[Wytyczne UI i Design System](docs/UI_GUIDELINES.md)** — tokeny kolorystyczne Light/Dark, typografia, standardy kontrolek (`40px`), komponenty Material i wydruk A4.

---

## Główne ścieżki aplikacji

| Ścieżka | Opis |
| --- | --- |
| `/` | Strona główna z wyszukiwarką i interaktywnym przewodnikiem |
| `/przepisy` | Katalog przepisów z filtrami makro, czasu, chorób i diet |
| `/przepisy/:uid` | Szczegóły dania z przelicznikiem porcji i wydrukiem A4 |
| `/choroby` | Przewodnik chorób dietozależnych (zalecenia NCEŻ) |
| `/jadlospisy` | Gotowe, własne oraz indywidualne plany 7-dniowe + lista zakupów |
| `/logowanie`, `/rejestracja` | Logowanie (e-mail/hasło, Google, tryb demo) i rejestracja |
| `/admin` | Panel administratora i dietetyka (wymaga roli `admin`) |

---

## Uruchomienie lokalne

```bash
npm install
npm start          # http://localhost:4200
npm run build      # Build produkcyjny (dist/demo)
```

> Bez pliku `src/environments/environment.ts` aplikacja automatycznie uruchamia się w trybie lokalnym (`LocalStoreService`) z pełnym zestawem startowym przepisów, chorób i jadłospisów.
