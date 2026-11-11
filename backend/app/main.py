from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .core.config import settings
from .routers import graph, interpolation, roots, systems

app = FastAPI(
    title="Toroid API",
    description="Backend de Toroid - métodos de análisis numérico",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(roots.router)
app.include_router(systems.router)
app.include_router(interpolation.router)
app.include_router(graph.router)


@app.get("/")
def root():
    return {"message": "Toroid API funcionando"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/api/methods")
def methods_catalog():
    """Catalog of methods grouped by category, matching the Figma design.

    The design surfaces two categories (graphing + one-variable equations) with
    nine tools total. The linear-systems and interpolation endpoints remain
    available in the API but are not part of this UI catalog.
    """
    return {
        "categories": [
            {
                "key": "graphing",
                "index": "[01]",
                "title": "Solving systems by graphing",
                "methods": [
                    {"slug": "function-plotter", "name": "Function plotter",
                     "endpoint": "/api/graph/evaluate",
                     "kind": "plotter",
                     "fields": ["function", "x_min", "x_max"]},
                ],
            },
            {
                "key": "equations",
                "index": "[02]",
                "title": "Solving equations of one variable",
                "methods": [
                    {"slug": "function-evaluator", "name": "Function evaluator",
                     "endpoint": "/api/graph/evaluate-point",
                     "kind": "evaluator",
                     "fields": ["function", "x_point"]},
                    {"slug": "incremental", "name": "Incremental search",
                     "endpoint": "/api/methods/roots/incremental",
                     "fields": ["function", "x0", "delta", "max_iterations"]},
                    {"slug": "bisection", "name": "Bisection",
                     "endpoint": "/api/methods/roots/bisection",
                     "fields": ["function", "a", "b", "tolerance", "max_iterations", "error_type"]},
                    {"slug": "false-position", "name": "False position",
                     "endpoint": "/api/methods/roots/false-position",
                     "fields": ["function", "a", "b", "tolerance", "max_iterations", "error_type"]},
                    {"slug": "fixed-point", "name": "Fixed point",
                     "endpoint": "/api/methods/roots/fixed-point",
                     "fields": ["function", "g_function", "x0", "tolerance", "max_iterations", "error_type"]},
                    {"slug": "newton", "name": "Newton-Raphson method",
                     "endpoint": "/api/methods/roots/newton",
                     "fields": ["function", "x0", "tolerance", "max_iterations", "error_type"]},
                    {"slug": "secant", "name": "Secant method",
                     "endpoint": "/api/methods/roots/secant",
                     "fields": ["function", "x0", "x1", "tolerance", "max_iterations", "error_type"]},
                    {"slug": "multiple-roots", "name": "Multiple roots",
                     "endpoint": "/api/methods/roots/multiple-roots",
                     "fields": ["function", "x0", "tolerance", "max_iterations", "error_type"]},
                ],
            },
        ]
    }
