# PrivScore

PrivScore combina un catálogo visual de servicios con una extensión que analiza cualquier web y abre su ficha detallada dentro del frontend.

## Cómo ejecutarlo en local

### 1. Frontend
```powershell
cd frontend
npm install
npm run dev
```
Abre la URL que te muestre Vite, normalmente `http://localhost:5173/`.

### 2. Extensión
1. Abre `chrome://extensions/` o `edge://extensions/`
2. Activa **Modo desarrollador**
3. Pulsa **Cargar descomprimida**
4. Selecciona la carpeta `extension`

### 3. Ajustar la URL del frontend en la extensión
1. En la tarjeta de la extensión, entra en **Detalles**
2. Abre **Opciones de extensión**
3. En **URL base del frontend** deja `http://localhost:5173/` para desarrollo local
4. Guarda

### 4. Probar el flujo completo
1. Entra en cualquier web
2. Pulsa la extensión y luego **Analizar web**
3. Cuando aparezca el resultado, pulsa **Ver detalle en la web**
4. Se abrirá el frontend en la ruta dinámica `#/analysis` con el análisis real
5. Desde esa ficha puedes volver al catálogo con **Ver más webs**

## Cómo publicarlo en GitHub Pages

El frontend ya está preparado para Pages con assets relativos y `HashRouter`, así que las rutas no se rompen al refrescar.

### Opción recomendada: GitHub Actions
1. Sube el repositorio a GitHub
2. En GitHub entra en **Settings → Pages**
3. En **Source** elige **GitHub Actions**
4. Haz push a `main` o `master`
5. El workflow `.github/workflows/deploy-pages.yml` construirá `frontend/dist` y lo publicará

### URL que debes poner en la extensión cuando ya esté publicado
En las opciones de la extensión cambia **URL base del frontend** por algo así:

```text
https://TU-USUARIO.github.io/TU-REPO/
```

Después, al pulsar **Ver detalle en la web**, la extensión abrirá la ficha dinámica ya publicada en GitHub Pages.

## Arquitectura aplicada

- El catálogo sigue usando las webs hardcodeadas del frontend
- La extensión genera un informe real y lo empaqueta en la URL hash del frontend
- El frontend guarda ese informe en `localStorage` para poder refrescar o reabrir la última ficha dinámica
- Si el dominio analizado coincide con uno del catálogo, la ficha dinámica reutiliza la base editorial del catálogo y la enriquece con el análisis en vivo
- Si no coincide, se genera una ficha nueva con el mismo estilo visual

## Backend

El backend sigue siendo opcional. El flujo extensión → frontend no depende de él.
