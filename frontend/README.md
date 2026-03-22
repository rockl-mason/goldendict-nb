# Web Shell

Modern browser-first UI prototype for GoldenDict-ng.

## Commands

```bash
npm install
npm run dev
```

`npm run build` writes the embedded bundle to `../src/webui/dist/` so Qt can load it through `qrc`.

## Runtime modes

- Browser preview: falls back to mock dictionary data.
- Qt embedded preview: auto-detects `QWebChannel` and binds to `webShellBridge`.
