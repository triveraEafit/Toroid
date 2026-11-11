# Toroid

**Toroid** es una aplicación web de **análisis numérico**. Permite graficar funciones,
evaluar expresiones y encontrar raíces de ecuaciones de una variable, mostrando en cada
caso la tabla de iteraciones completa junto con el resultado.

El diseño de la interfaz sigue el archivo de Figma del proyecto (tema claro y editorial,
con acento azul). La lógica matemática vive en el backend de Python; el frontend solo
presenta formularios, tablas y gráficas.

---

## Arquitectura

| Capa      | Tecnología                      | Carpeta     |
| --------- | ------------------------------- | ----------- |
| Frontend  | React + TypeScript + Vite       | `frontend/` |
| Backend   | Python + FastAPI                | `backend/`  |
| Base de datos | PostgreSQL (opcional, cuando se requiera) | — |

El frontend consume la API del backend por HTTP. Toda la lógica de los métodos numéricos
se ejecuta en FastAPI; React únicamente envía los parámetros y dibuja los resultados.

---

## Funcionalidad

La aplicación expone las herramientas en dos categorías (según el diseño de Figma):

**[01] Solución de sistemas por gráfica**
- **Graficador de funciones** — dibuja `f(x)` sobre un plano cartesiano.

**[02] Solución de ecuaciones de una variable**
- **Evaluador de funciones** — calcula el valor de `f(x)` en un punto.
- **Búsqueda incremental**
- **Bisección**
- **Regla falsa** (falsa posición)
- **Punto fijo**
- **Newton-Raphson**
- **Secante**
- **Raíces múltiples**

Además, el backend incluye (disponibles vía API, aunque no estén en el menú del diseño)
métodos de **sistemas lineales** (eliminación gaussiana simple/parcial/total, factorización
LU, Crout, Doolittle, Cholesky, Jacobi, Gauss-Seidel, SOR) e **interpolación**
(Vandermonde, diferencias divididas de Newton, Lagrange y splines).

El resto de páginas son **Inicio**, **Métodos**, **Learn** (documentación de cada método)
y **Ayuda** (anatomía del espacio de trabajo, guía de sintaxis y preguntas frecuentes).

---

## Requisitos previos

- **Python 3.11+** (probado con 3.14)
- **Node.js 18+** y **npm**

---

## Cómo ejecutarlo

El proyecto tiene dos partes que se levantan por separado. Abre **dos terminales**.

### 1. Backend (FastAPI)

```bash
cd backend

# Crear y activar el entorno virtual (si aún no existe)
python -m venv venv

# Windows (PowerShell)
.\venv\Scripts\Activate.ps1
# macOS / Linux
# source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Levantar el servidor de desarrollo
uvicorn app.main:app --reload
```

El backend queda disponible en **http://localhost:8000**.
La documentación interactiva de la API está en **http://localhost:8000/docs**.

### 2. Frontend (React + Vite)

```bash
cd frontend

# Instalar dependencias
npm install

# Levantar el servidor de desarrollo
npm run dev
```

El frontend queda disponible en **http://localhost:5173**.

> El frontend apunta por defecto a `http://localhost:8000`. Para usar otra URL del backend,
> define la variable de entorno `VITE_API_URL` antes de `npm run dev`
> (por ejemplo, en un archivo `frontend/.env`: `VITE_API_URL=http://localhost:8000`).

---

## Scripts útiles

### Frontend

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Compilar para producción (tsc + vite build)
npm run preview  # Previsualizar la compilación de producción
npm run lint     # Analizar el código con oxlint
```

---

## Estructura del proyecto

```
Toroid/
├── backend/
│   ├── app/
│   │   ├── core/          # Configuración y evaluador seguro de expresiones
│   │   ├── methods/       # Lógica de los métodos numéricos
│   │   ├── routers/       # Endpoints de la API
│   │   ├── schemas/       # Modelos de petición/respuesta (Pydantic)
│   │   └── main.py        # Punto de entrada de FastAPI + catálogo de métodos
│   └── requirements.txt
└── frontend/
    └── src/
        ├── api/           # Cliente HTTP y tipos
        ├── components/    # Componentes reutilizables (formularios, tablas, gráfica…)
        ├── methods/       # Catálogo de métodos y metadatos de los campos
        └── pages/         # Páginas (Inicio, Métodos, Learn, Ayuda…)
```

---

## Notas

- El evaluador de funciones acepta notación estándar: usa `^` para potencias
  (por ejemplo `x^3 - x - 2`) y funciones como `sin`, `cos`, `tan`, `exp`, `ln`,
  `log`, `sqrt`, además de las constantes `pi` y `e`.
- Las expresiones se analizan de forma segura (sin `eval`), por lo que solo se permiten
  operaciones matemáticas.
