# weather-series

Aplikacja do zbierania i prezentacji temperatury powietrza w wielu miastach
(Warszawa, Funchal, Heraklion, Busan) jako serii pomiarowych w czasie. Projekt
na przedmiot Zaawansowane Aplikacje Internetowe (26Z).

Dane pochodzą z autonomicznych czujników (generator danych) wysyłających wyniki
do API; interfejs służy wyłącznie do prezentacji (wykres + tabela, filtrowanie
po czasie i seriach). Zalogowany administrator zarządza seriami i czujnikami.

## Stos technologiczny

| Warstwa    | Technologia                          |
| ---------- | ------------------------------------ |
| Backend    | Node.js + Fastify                    |
| Baza       | PostgreSQL (Neon) + Drizzle ORM      |
| Frontend   | React + Vite + Recharts              |
| Generator  | Node.js (CLI)                        |
| Hosting    | Render (aplikacja) + Neon (baza)     |

## Struktura katalogów

| Katalog      | Zawartość                                        |
| ------------ | ------------------------------------------------ |
| `backend/`   | Serwer Fastify, API, autoryzacja                 |
| `frontend/`  | Aplikacja SPA (React)                            |
| `generator/` | Emulator czujnika (CLI) wysyłający wyniki do API |
| `db/`        | Diagram ERD                                      |
| `docs/`      | Dokumentacja projektu (źródło PDF)               |

## Uruchomienie lokalne

> Instrukcja zostanie uzupełniona wraz z implementacją.

Wymagania: Node.js 24+, Docker (lokalna baza) lub konto Neon.

```bash
cp .env.example .env   # uzupełnij DATABASE_URL i dane admina
docker compose up -d   # lokalna baza Postgres
```
