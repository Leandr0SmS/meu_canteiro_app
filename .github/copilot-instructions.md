# Copilot Instructions — Meu Canteiro App

## Project Overview

**Meu Canteiro App** is a desktop agroforestry garden-bed planner built with Electron, a vanilla-JS frontend, and two independent Node.js/Express backends backed by SQLite.

The application lets users compose *canteiros* (garden beds) by selecting plants from four vertical strata and evaluating their spacing, harvest time, and shade level compatibility.

---

## Architecture

```
Electron (main.js + preload.js)
  └── loads frontend/meu_canteiro_front_end/index.html
        └── ES-module JS (main.js + modules/)
              ├── calls meu_canteiro_back_end  (port 5000)  — plants CRUD + canteiro query
              └── calls agroforestry_systems_design (port 5001) — canteiro design / storage
```

### Directory Map

| Path | Role |
|---|---|
| `electron/` | Electron main process; spawns both backends, creates BrowserWindow |
| `electron/preload.js` | Context bridge exposing safe APIs to the renderer |
| `frontend/meu_canteiro_front_end/` | Vanilla JS frontend (no framework) loaded by Electron |
| `frontend/meu_canteiro_front_end/config.js` | Central API URL configuration |
| `frontend/meu_canteiro_front_end/modules/` | Feature modules: `canteiro.js`, `plantas.js`, `previsao-tempo.js` |
| `backend/meu_canteiro_back_end/` | Primary REST API — plants and canteiro endpoints |
| `backend/agroforestry_systems_design/` | Secondary REST API — canteiro design / persistence |

---

## Tech Stack

- **Desktop shell**: Electron 29, packaged with `electron-builder` (NSIS/portable/zip for Windows)
- **Frontend**: Vanilla JS with ES modules (`type="module"`), no bundler
- **Backend**: Node.js with Express 4, ES modules (`"type": "module"` in each `package.json`)
- **ORM / DB**: Sequelize 6 + `sqlite3` (one SQLite file per backend under `database/`)
- **Docs**: Swagger UI (`swagger-jsdoc` + `swagger-ui-express`) at `/api-docs` on each backend
- **Logging**: Winston
- **Testing**: Jest (with `--experimental-vm-modules` for ES module support)

---

## Running the Project

```powershell
# Start Electron app (also spawns both backends)
npm start

# Dev mode (adds --dev flag to Electron)
npm run dev

# Run each backend independently
npm run backend:canteiro   # port 5000
npm run backend:agro       # port 5001

# Build installer
npm run build
```

Backend tests (from each backend directory):
```powershell
cd backend/meu_canteiro_back_end
npm test
```

---

## API Endpoints

### meu_canteiro_back_end — port 5000

| Method | Route | Description |
|---|---|---|
| GET | `/plantas` | List all plants |
| POST | `/planta` | Add a new plant |
| DELETE | `/planta` | Delete a plant by name |
| POST | `/plantasInfo` | Get detailed info for a list of plants |
| GET | `/canteiro` | Query canteiro by plant names |

### agroforestry_systems_design — port 5001

| Method | Route | Description |
|---|---|---|
| PUT | `/canteiro` | Create / save a canteiro design |
| GET | `/canteiro` | List saved canteiros |
| DELETE | `/canteiro` | Delete a canteiro |

Both backends expose Swagger docs at `GET /api-docs`.

---

## Domain Vocabulary (Portuguese ↔ English)

| Portuguese | English |
|---|---|
| canteiro | garden bed |
| planta | plant |
| estrato | stratum / layer |
| baixo | low stratum |
| medio | medium stratum |
| alto | high stratum |
| emergente | emergent stratum |
| espaçamento | plant spacing (cm) |
| tempo_colheita | harvest time (days) |
| porcentagem_sombra | shade percentage |
| nome_planta | plant name |

---

## Data Model

### Estrato (stratum)
```js
{ nome_estrato: 'baixo' | 'medio' | 'alto' | 'emergente', porcentagem_sombra: Number }
```

### Planta (plant)
```js
{ id_planta, nome_planta, tempo_colheita, espacamento, estrato }
```
- `estrato` is a FK referencing `Estrato.nome_estrato`
- `nome_planta` is unique

### Canteiro (garden bed) — stored in agroforestry_systems_design
Contains a name and a list of plants with their stratum data.

---

## External APIs (used in frontend)

| API | Base URL | Purpose |
|---|---|---|
| BrasilAPI / CPTEC | `https://brasilapi.com.br/api/cptec/v1/` | Weather forecast by city |
| MyMemory | `https://api.mymemory.translated.net/` | Text translation |
| Quotes API | `https://qapi.vercel.app/api/random` | Random inspirational quotes |

All external API URLs are configured in `frontend/meu_canteiro_front_end/config.js`.

---

## Coding Conventions

- **ES modules everywhere**: always use `import`/`export`, never `require()`.
- **Backend file structure**: `src/app.js` → `routes/` → `controllers/` → `models/` / `schemas/`.
- **Frontend modules**: each feature lives in `frontend/meu_canteiro_front_end/modules/`. DOM manipulation and fetch calls are co-located per feature.
- **No frontend framework**: use plain `fetch`, `document.getElementById`, and template literals.
- **SQLite DB files** live in each backend's `database/` directory and are populated on first run via `populateDb()`.
- **Port convention**: 5000 = primary backend, 5001 = secondary backend.
- **Electron security**: `nodeIntegration: false`, `contextIsolation: true`; use `preload.js` to expose any Node APIs to the renderer.
- **Language**: user-facing strings and variable names in domain code are in **Portuguese**; code comments may be in Portuguese or English.

---

## Build & Packaging

- `electron-builder` targets Windows: NSIS installer, portable exe, and zip.
- The installer uses a custom `.nsh` script (`installer.nsh`) at the repo root.
- Packaged app resolves backend paths via `process.resourcesPath` (see `electron/main.js`).
- Icon: `frontend/meu_canteiro_front_end/resources/images/tree-icon.ico`
