# 🌿 Codzienny Asystent Nawożenia - Ogrodnik 4.0

Aplikacja PWA zoptymalizowana pod urządzenia mobilne z systemem Android, wspomagająca codzienne nawożenie upraw w okresie letnim (25.06.2026 - 31.08.2026).

## 🚀 Uruchomienie Lokalne (Development)

1. Zainstaluj zależności:
   ```bash
   npm install
   ```
2. Uruchom serwer developerski:
   ```bash
   npm run dev
   ```
3. Otwórz podany w terminalu adres (zazwyczaj `http://localhost:5173`).

---

## 🐳 Wdrożenie Docker (Lokalnie / VPS)

Aplikacja zawiera pełną konfigurację Docker (multi-stage build z Nginx do serwowania plików statycznych).

### Uruchomienie przez Docker Compose (Zalecane)

1. Upewnij się, że masz zainstalowany Docker i Docker Compose na swoim serwerze.
2. Zbuduj i uruchom kontener w tle:
   ```bash
   docker compose up -d --build
   ```
3. Aplikacja będzie dostępna pod adresem: `http://<IP_TWOJEGO_VPS>:8080`.
4. Aby zatrzymać kontener:
   ```bash
   docker compose down
   ```

### Samodzielny Docker (Alternative)

1. Zbuduj obraz:
   ```bash
   docker build -t ogrodnik-asystent .
   ```
2. Uruchom kontener:
   ```bash
   docker run -d -p 8080:80 --name ogrodnik-asystent --restart always ogrodnik-asystent
   ```

---

## 📱 Instalacja PWA (Android / iOS)

Aplikacja spełnia standardy Progressive Web App (PWA):
1. **Instalacja**: Kliknij baner "DODAJ" na dole ekranu, lub użyj menu przeglądarki Chrome ("Dodaj do ekranu głównego").
2. **Offline**: Po pierwszym załadowaniu, aplikacja działa bez dostępu do Internetu.
