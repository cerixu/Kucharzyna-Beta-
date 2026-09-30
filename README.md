# Kucharzyna Beta 0.1

Kucharzyna Beta 0.1 is an iPhone-only Progressive Web App for professional kitchen work.

## Principles

- iPhone only. No desktop layout.
- One router, one application state, one IndexedDB layer.
- CSS uses the iOS safe-area environment variables and dynamic viewport units.
- No legacy code is copied from earlier Kucharzyna versions.
- WebKit/iPhone is the primary E2E target.

## Local development

Serve the repository over HTTP/HTTPS. For example:

```bash
python3 -m http.server 4173
npm install
npm run test:e2e
```

## GitHub Pages

The app is static and can be published from the `main` branch root.

