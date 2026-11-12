"""End-to-end API tests through the FastAPI app, exercising every endpoint
category and the catalog that drives the frontend."""
import pytest
from starlette.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health():
    assert client.get("/health").json() == {"status": "ok"}


def test_catalog_lists_all_categories():
    data = client.get("/api/methods").json()
    keys = {c["key"] for c in data["categories"]}
    assert keys == {"graphing", "equations", "systems", "interpolation"}
    total = sum(len(c["methods"]) for c in data["categories"])
    assert total == 26


@pytest.mark.parametrize("endpoint", [
    "/api/methods/roots/incremental",
    "/api/methods/roots/bisection",
    "/api/methods/roots/false-position",
    "/api/methods/roots/fixed-point",
    "/api/methods/roots/newton",
    "/api/methods/roots/secant",
    "/api/methods/roots/multiple-roots",
    "/api/methods/systems/gaussian-simple",
    "/api/methods/systems/gaussian-partial",
    "/api/methods/systems/gaussian-total",
    "/api/methods/systems/lu-simple",
    "/api/methods/systems/lu-partial",
    "/api/methods/systems/crout",
    "/api/methods/systems/doolittle",
    "/api/methods/systems/cholesky",
    "/api/methods/systems/jacobi",
    "/api/methods/systems/gauss-seidel",
    "/api/methods/systems/sor",
    "/api/methods/interpolation/vandermonde",
    "/api/methods/interpolation/newton",
    "/api/methods/interpolation/lagrange",
    "/api/methods/interpolation/spline-linear",
    "/api/methods/interpolation/spline-quadratic",
    "/api/methods/interpolation/spline-cubic",
])
def test_catalog_endpoints_exist(endpoint):
    """Every endpoint advertised by the catalog must be routable (i.e. POSTing
    to it does not 404). An empty body yields 422, which still proves the route
    exists."""
    status = client.post(endpoint, json={}).status_code
    assert status != 404


def test_bisection_endpoint():
    r = client.post("/api/methods/roots/bisection", json={
        "function": "x^2 - 2", "a": 0, "b": 2, "tolerance": 1e-8,
        "max_iterations": 100,
    })
    assert r.status_code == 200
    body = r.json()
    assert body["success"]
    assert body["result"] == pytest.approx(2 ** 0.5, abs=1e-4)


def test_gauss_seidel_endpoint():
    r = client.post("/api/methods/systems/gauss-seidel", json={
        "matrix": [[4, -1, 0], [-1, 4, -1], [0, -1, 4]], "vector": [2, 4, 10],
        "x0": [0, 0, 0], "tolerance": 1e-9, "max_iterations": 200,
    })
    assert r.status_code == 200
    body = r.json()
    assert body["success"]
    assert body["result"] == pytest.approx([1.0, 2.0, 3.0], abs=1e-4)


def test_lagrange_endpoint():
    r = client.post("/api/methods/interpolation/lagrange", json={"x": [0, 1, 2, 3], "y": [0, 1, 4, 9]})
    assert r.status_code == 200
    assert r.json()["success"]


def test_graph_evaluate_endpoint():
    r = client.post("/api/graph/evaluate", json={"function": "sin(x)", "x_min": -3, "x_max": 3, "points": 50})
    assert r.status_code == 200
    body = r.json()
    assert body["success"]
    assert len(body["points"]) == 50


def test_graph_evaluate_point_endpoint():
    r = client.post("/api/graph/evaluate-point", json={"function": "x^2 - 3", "x": 2})
    assert r.status_code == 200
    body = r.json()
    assert body["success"]
    assert body["value"] == pytest.approx(1.0)


def test_evaluate_point_invalid():
    r = client.post("/api/graph/evaluate-point", json={"function": "ln(x)", "x": -1})
    assert r.status_code == 200
    assert r.json()["success"] is False
