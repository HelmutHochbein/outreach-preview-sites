# Barnimer Rollladenbau Muster-Website

Lokale statische Vorschau für Barnimer Rollladenbau aus Althüttendorf.

## Quelle

- Airtable-Link: konnte wegen Reauthentifizierung der Airtable-Verbindung nicht direkt gelesen werden.
- Bestehende Website: `https://rollladenbau-barnim.de/` verweist aktuell auf `https://www.barnimer-rollladenbau.de/`.
- Extrahierte Fakten: Name, Adresse, Telefon, E-Mail, Standort Althüttendorf, Leistungen Rollladen, Raffstore, Rolltore/Torsysteme, Motore/Antriebe, Smart Home.

## Dateien

- `index.html` - Onepage-Website mit Hero, Leistungen, Komfortargumentation, Ablauf, Einzugsgebiet, Kontakt und Formular.
- `assets/css/styles.css` - Responsive Styling für Desktop und Mobile inklusive Scroll-Reveal-Animationen.
- `assets/js/main.js` - Mobile Navigation, Header-Zustand, Reverse-Scroll-Animationen und statisches Kontaktformular mit Mailto-Vorbereitung.
- `robots.txt` und `sitemap.xml` - GitHub-Pages-fähige SEO-Grundlagen.

## Bildhinweis

Die lokalen Bilder wurden aus der bestehenden Website geladen und dienen für diese interne Vorschau. Vor einer Veröffentlichung sollte geklärt werden, ob diese Bilder für die neue Website wiederverwendet werden dürfen.

## Lokale Vorschau

Aus diesem Ordner kann ein statischer Server gestartet werden:

```bash
python3 -m http.server 4173
```

Danach im Browser öffnen:

```text
http://localhost:4173
```
