# Wdrożenie (Render + Neon)

Aplikacja jest wdrażana jako pojedynczy serwis web na platformie Render: backend
Fastify (`backend/`) buduje oraz serwuje zbudowany frontend (`frontend/`), a dane
są przechowywane w bazie PostgreSQL utrzymywanej w usłudze Neon.

## 1. Repozytorium na GitHub

Render pobiera kod źródłowy z serwisu GitHub. Repozytorium jest dostępne pod adresem
`https://github.com/jlwnd/weather-series-app`; przed wdrożeniem należy jedynie
zaktualizować gałąź `main`:

```bash
git push origin main
```

## 2. Baza danych - Neon

1. Należy założyć konto w usłudze https://neon.tech i utworzyć nowy projekt
   (zalecany region w Europie).
2. Następnie należy skopiować **connection string** (wariant pooled, zawierający
   parametr `?sslmode=require`), który zostanie wykorzystany jako wartość zmiennej
   `DATABASE_URL` w kroku 3.

## 3. Serwis web - Render

1. Należy założyć konto w usłudze https://render.com i połączyć je z kontem GitHub.
2. Po wybraniu opcji **New → Blueprint** i wskazaniu repozytorium `weather-series-app`
   platforma odczytuje plik `render.yaml` i tworzy serwis `weather-series-app-backend`
   (środowisko Node 24, katalog `rootDir: backend`).
3. Zmienne środowiskowe należy skonfigurować ręcznie w zakładce **Environment**
   serwisu - nie są one zadeklarowane w pliku `render.yaml`, w związku z czym platforma
   nie wyświetli monitu o ich uzupełnienie:
   - `DATABASE_URL` - connection string z usługi Neon,
   - `ADMIN_USERNAME` - login testowego konta administratora,
   - `ADMIN_PASSWORD` - hasło testowego konta administratora.
4. Po wybraniu opcji **Apply / Deploy** polecenie `buildCommand` instaluje zależności
   backendu oraz frontendu, buduje aplikację SPA i uruchamia migracje bazy danych
   (`npm run migrate:prod`), natomiast health check `/api/health` potwierdza gotowość
   serwisu. Inicjalizacja konta administratora (na podstawie zmiennych `ADMIN_*`)
   następuje podczas startu serwera i jest idempotentna.

Adres aplikacji: `https://weather-timeseries-app-whu4.onrender.com`
(lub adres nadany przez platformę Render).

> Plan darmowy usypia serwis po około 15 minutach bezczynności; pierwsze żądanie
> po uśpieniu trwa kilkadziesiąt sekund. Skrypt testujący prowadzącego posiada
> wbudowany mechanizm warm-up.

## 4. Dane przykładowe (F11)

Dane wprowadza się **poprzez API, przy użyciu generatora** (nie bezpośrednio do bazy
danych). Po wdrożeniu należy uruchomić skrypt seed lokalnie, wskazując publiczny adres
aplikacji:

```bash
# w katalogu generator/
node seed.ts --api https://weather-timeseries-app-whu4.onrender.com --user <login> --pass <hasło>
```

Skrypt loguje administratora, tworzy cztery serie pomiarowe (Warszawa, Funchal,
Heraklion, Busan), rejestruje czujnik dla każdej z nich oraz uzupełnia dane
rzeczywistymi temperaturami pobranymi z usługi Open-Meteo.

## 5. Weryfikacja

```bash
node "zai-tests.mjs" --app https://weather-timeseries-app-whu4.onrender.com --user <login> --pass <hasło> --stage E1
```

Po wykonaniu skryptu seed etap E1 powinien zakończyć się wynikiem **10/10**.
