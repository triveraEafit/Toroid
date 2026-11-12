"""Tests for linear-system methods. All methods are checked against the same
system whose exact solution is [1, 2, 3]."""
import pytest

from app.methods import systems
from app.schemas.methods import (
    IterativeSystemRequest,
    LinearSystemRequest,
    SorRequest,
)

# 4x1 - x2       = 2
# -x1 + 4x2 - x3 = 4
#      -x2 + 4x3 = 10   ->  solution [1, 2, 3]
A = [[4, -1, 0], [-1, 4, -1], [0, -1, 4]]
B = [2, 4, 10]
EXPECTED = [1.0, 2.0, 3.0]


def _close(result, expected=EXPECTED, tol=1e-4):
    return result is not None and all(a == pytest.approx(e, abs=tol) for a, e in zip(result, expected))


def test_gaussian_simple():
    r = systems.gaussian_simple(LinearSystemRequest(matrix=A, vector=B))
    assert r.success and _close(r.result)


def test_gaussian_partial():
    r = systems.gaussian_partial(LinearSystemRequest(matrix=A, vector=B))
    assert r.success and _close(r.result)


def test_gaussian_total():
    r = systems.gaussian_total(LinearSystemRequest(matrix=A, vector=B))
    assert r.success and _close(r.result)


def test_lu_doolittle():
    r = systems.lu_doolittle(LinearSystemRequest(matrix=A, vector=B))
    assert r.success and _close(r.result)


def test_lu_crout():
    r = systems.lu_crout(LinearSystemRequest(matrix=A, vector=B))
    assert r.success and _close(r.result)


def test_lu_partial():
    r = systems.lu_partial(LinearSystemRequest(matrix=A, vector=B))
    assert r.success and _close(r.result)


def test_cholesky():
    r = systems.cholesky(LinearSystemRequest(matrix=A, vector=B))
    assert r.success and _close(r.result)


def test_cholesky_rejects_non_symmetric():
    r = systems.cholesky(LinearSystemRequest(matrix=[[4, 1, 0], [-1, 4, -1], [0, -1, 4]], vector=B))
    assert not r.success
    assert "symmetric" in r.message.lower()


def test_jacobi():
    r = systems.jacobi(IterativeSystemRequest(matrix=A, vector=B, x0=[0, 0, 0], tolerance=1e-9, max_iterations=200))
    assert r.success and _close(r.result)


def test_gauss_seidel():
    r = systems.gauss_seidel(IterativeSystemRequest(matrix=A, vector=B, x0=[0, 0, 0], tolerance=1e-9, max_iterations=200))
    assert r.success and _close(r.result)


def test_sor():
    r = systems.sor(SorRequest(matrix=A, vector=B, x0=[0, 0, 0], w=1.1, tolerance=1e-9, max_iterations=200))
    assert r.success and _close(r.result)


def test_non_square_matrix_fails():
    r = systems.gaussian_simple(LinearSystemRequest(matrix=[[1, 2, 3], [4, 5, 6]], vector=[1, 2]))
    assert not r.success


def test_iterative_zero_on_diagonal_fails():
    r = systems.jacobi(IterativeSystemRequest(matrix=[[0, 1], [1, 0]], vector=[1, 1], x0=[0, 0], tolerance=1e-6, max_iterations=10))
    assert not r.success
    assert "diagonal" in r.message.lower()
