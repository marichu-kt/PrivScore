# Guía de estructura del repositorio/código

Este documento describe **qué es cada carpeta y archivo** del repositorio. Está pensado como guía rápida para que cualquier miembro del equipo pueda orientarse y saber dónde añadir cosas.

> Nota importante:
> - En el ZIP aparecen carpetas como `node_modules/` y el archivo `backend/.env`. **No deberían subirse a GitHub** (en el repo deberían estar ignorados por `.gitignore`).

---

## Vista general del árbol

```text
backend/
  src/
    config/
      env.js
    controllers/
      service.controller.js
    lib/
      db.js
    models/
      service.model.js
    routes/
      health.js
      index.js
      services.routes.js
    app.js
    server.js
  .env
  .env.example
  .gitignore
  backend.zip
  package-lock.json
  package.json
extension/
  icons/
    icon128.png
    icon16.png
    icon48.png
  src/
    background/
      analyzer_keywords.js
      bullets.js
      cookie_classifier.js
      cookies_summary.js
      gemini_client.js
      html_cleaner.js
      policy_fetcher.js
      scoring.js
      service_worker.js
      weights.js
    content/
      content_script.js
    detail/
      detail.css
      detail.html
      detail.js
    options/
      options.css
      options.html
      options.js
    popup/
      popup.css
      popup.html
      popup.js
  manifest.json
frontend/
  public/
    vite.svg
  src/
    api/
      servicesApi.js
    app/
      router.jsx
    assets/
      logo_PrivSocre.png
      react.svg
    components/
      navbar.jsx
      serviceCard.jsx
    data/
      services.mock.js
    layout/
      appLayout.jsx
    pages/
      catalogPage.jsx
      serviceDetailPage.jsx
    styles/
      global.css
    App.css
    App.jsx
    index.css
    main.jsx
  .gitignore
  README.md
  eslint.config.js
  index.html
  package-lock.json
  package.json
  vite.config.js
LICENSE
README.md
```

---

## Raíz del repositorio

- `README.md`: explicación general del proyecto
- `LICENSE`: licencia del repositorio

Carpetas principales:
- `frontend/`: aplicación web (React + Vite)
- `backend/`: API (Node.js + Express) y conexión a MongoDB (Mongoose)
- `extension/`: extensión de Chrome (Manifest V3)

---

## Backend (`/backend`)

### Archivos en `/backend`
- `.env`: variables de entorno **secretas** (por ejemplo `MONGO_URI`).
- `.env.example`: plantilla de variables de entorno para que otros devs creen su `.env`.
- `.gitignore`: ignora `node_modules/` y `.env` (no se suben a github al hacer push).
- `package.json`: dependencias y scripts (`npm run dev`, `npm start`).
- `package-lock.json`: lockfile de npm.

### Código en `/backend/src`
- `server.js`: **punto de entrada** del backend. Configura Express, CORS, JSON, monta rutas (i.e. `/api/services`), maneja 404/500 y arranca el servidor.
- `app.js`: archivo para separar configuración de Express de `server.js`.
- `config/`
  - `env.js`: carga variables de entorno con `dotenv` y expone un objeto `env` para usarlo en otros archivos para no exponer variables de entorno secretas en el código (PORT, CORS, MONGO_URI…).
- `lib/`
  - `db.js`: conexión a MongoDB Atlas usando **Mongoose** (`connectDB()`).
- `models/`
  - `service.model.js`: modelo Mongoose `Service` (esquema base: `name`, `domain`, `category`, `rating`, `summary`, timestamps).
- `controllers/`
  - `service.controller.js`: controladores de la API (listar servicios, obtener servicio por id).
- `routes/`
  - `health.js`: router `GET /api/health` para comprobar que el backend está vivo.
  - `services.routes.js`: router para `GET /api/services` y `GET /api/services/:id`.
  - `index.js`: router agregador (monta health + services bajo `/api`).

---

## Frontend (`/frontend`)

### Archivos en `/frontend`
- `.gitignore`: ignora artefactos de build/depencias del frontend.
- `index.html`: HTML base de Vite.
- `package.json`: dependencias (React, React Router) y scripts (`npm run dev`, `npm run build`).
- `package-lock.json`: lockfile de npm.
- `vite.config.js`: configuración de Vite (bundler).
- `eslint.config.js`: reglas de lint.
- `README.md`: README del template/config del frontend.
- `public/`
  - `vite.svg`: asset/imagen por defecto.

### Código en `/frontend/src`
- `main.jsx`: entrypoint de React. Monta `RouterProvider` y carga estilos globales.
- `app/`
  - `router.jsx`: definición de rutas con `react-router-dom` (layout + páginas).
- `layout/`
  - `appLayout.jsx`: layout principal (incluye `Navbar` + `<Outlet />`).
- `components/`
  - `navbar.jsx`: barra de navegación superior; muestra el logo de PrivScore y links.
  - `serviceCard.jsx`: tarjeta visual para un servicio en el catálogo (nombre, dominio, rating, CTA).
- `pages/`
  - `catalogPage.jsx`: página principal (lista + filtros: búsqueda, rating, categoría).
  - `serviceDetailPage.jsx`: página de detalle de un servicio.
- `api/`
  - `servicesApi.js`: capa de acceso a datos (fetch al backend o mock). Define `getServices()` y `getServiceById()`.
- `data/`
  - `services.mock.js`: datos de ejemplo para desarrollo rápido sin backend.
- `assets/`
  - `logo_PrivSocre.png`: logo de la app (usado en navbar / home).
  - `react.svg`: asset de la plantilla.
- `styles/`
  - `global.css`: estilos globales (tema, navbar, cards, badges, etc.).
- `App.jsx`, `App.css`: archivos de la plantilla Vite+React (en esta versión **no son el entrypoint real** si usas router desde `main.jsx`).
- `index.css`: estilos base del template (puede quedar obsoleto si todo vive en `global.css`).

---

## Extensión de Chrome (`/extension`)

### Archivos en `/extension`
- `manifest.json`: manifiesto **Manifest V3** (nombre, permisos, popup, options, service worker).
- `icons/`: iconos de la extensión (16/48/128px).

### Código en `/extension/src`
- `background/`: lógica principal que corre en el **service worker** (MV3).
  - `service_worker.js`: orquestador del flujo de análisis (recibe eventos del popup, ejecuta análisis y devuelve resultados).
  - `cookies_summary.js`: lectura/resumen de cookies del sitio actual.
  - `cookie_classifier.js`: clasificación de cookies (por tipo/propósito según heurísticas).
  - `policy_fetcher.js`: descarga y extracción de texto de políticas (privacidad/cookies).
  - `html_cleaner.js`: limpia HTML y normaliza texto para análisis.
  - `analyzer_keywords.js`: señales por keywords/patrones en políticas/textos.
  - `scoring.js`: cálculo determinista de la puntuación (secciones → score total → letra A–E).
  - `weights.js`: pesos, thresholds y constantes del scoring.
  - `bullets.js`: genera bullets/resumen legible para mostrar al usuario.
  - `gemini_client.js`: cliente para IA (si se usa) para ayudar a extraer señales (no debería decidir la letra).
- `content/`
  - `content_script.js`: script inyectado en la página para encontrar enlaces de políticas y señales técnicas del DOM.
- `popup/`: UI del popup (lo que se abre al clicar el icono de la extensión).
  - `popup.html`, `popup.css`, `popup.js`
- `options/`: página de opciones/configuración de la extensión.
  - `options.html`, `options.css`, `options.js`
- `detail/`: pantalla de detalle (más información) dentro de la extensión.
  - `detail.html`, `detail.css`, `detail.js`

---

## Cómo ejecutar (para onboarding rápido)

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Extensión (Chrome)
1. Abrir `chrome://extensions`
2. Activar “Developer mode”
3. “Load unpacked” → seleccionar carpeta `extension/`

---

_Última actualización: 2026-02-23_