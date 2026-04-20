# Shady Shambles

Ein datenbankbasiertes Handelsmodul für ein MMORPG.  
Spieler können bei spezialisierten Händlern Items kaufen und verkaufen, ihr Inventar verwalten und ihren Goldbestand im Blick behalten.

---

## Voraussetzungen

Folgende Software muss installiert sein:

| Software | Version |
|---|---|
| XAMPP (Apache + MySQL/MariaDB) | Apache 2.4.58 / MariaDB 10.4.32 |
| Node.js | v24.14.0 |
| Visual Studio Code | aktuellste Version |
| Opera (optional Chrome oder Firefox) | aktuellste Version |

---

## Installation & Start

### Schritt 1 – Datenbank einrichten

1. XAMPP Control Panel öffnen und **Apache** sowie **MySQL** starten.
2. Neben MySQL auf **Admin** klicken – der Browser öffnet phpMyAdmin automatisch.
3. Eine neue Datenbank mit dem Namen `shady_shambles` anlegen.
4. Die mitgelieferte Datei `shady_shambles.sql` (zu finden im Ordner `data`) über den Reiter **Importieren** in die neue Datenbank importieren.

### Schritt 2 – Server starten

1. Den Projektordner in **Visual Studio Code** öffnen und ein neues Terminal starten (STRG + J).
2. **Nur beim ersten Mal** – Abhängigkeiten installieren:
   ```
   npm install
   ```
3. Server starten:
   ```
   node server.js
   ```
   Im Terminal erscheint die Meldung: *„Server läuft auf Port 3000"*

### Schritt 3 – Anwendung öffnen

1. Im Browser `localhost:3000` aufrufen.
2. Ein neues Konto über **Register here** anlegen oder sich mit bestehenden Zugangsdaten einloggen.
3. Auf der Startseite einen Händler auswählen, um Items zu kaufen oder zu verkaufen. Das eigene Inventar ist über den **Inventory**-Button erreichbar.

---

## Autorin

Naomi Zellhofer – Abschlussprojekt GME-24.01, SRH Fachschulen GmbH 2026
