"""Linear-system numerical methods.

Direct methods (Gaussian elimination with simple/partial/total pivoting, LU
factorization via Doolittle/Crout/Cholesky) and iterative methods (Jacobi,
Gauss-Seidel, SOR). Pure-Python implementations (no numpy) returning a
``MethodResult`` with step tables and the solution vector.
"""
from __future__ import annotations

import math
from copy import deepcopy

from ..schemas.methods import (
    IterativeSystemRequest,
    LinearSystemRequest,
    MethodResult,
    SorRequest,
)

Matrix = list[list[float]]
Vector = list[float]


def _validate_square(matrix: Matrix, vector: Vector) -> str | None:
    n = len(matrix)
    if n == 0:
        return "The matrix is empty"
    for row in matrix:
        if len(row) != n:
            return "The coefficient matrix must be square"
    if len(vector) != n:
        return "The right-hand side vector length must match the matrix size"
    return None


def _back_substitution(a: Matrix, n: int) -> Vector:
    """Solve an upper-triangular augmented matrix ``a`` (n x n+1)."""
    x = [0.0] * n
    for i in range(n - 1, -1, -1):
        s = sum(a[i][j] * x[j] for j in range(i + 1, n))
        x[i] = (a[i][n] - s) / a[i][i]
    return x


def _forward_substitution(a: Matrix, n: int) -> Vector:
    """Solve a lower-triangular augmented matrix ``a`` (n x n+1)."""
    x = [0.0] * n
    for i in range(n):
        s = sum(a[i][j] * x[j] for j in range(i))
        x[i] = (a[i][n] - s) / a[i][i]
    return x


def _augment(matrix: Matrix, vector: Vector) -> Matrix:
    return [list(row) + [vector[i]] for i, row in enumerate(matrix)]


def _stage_rows(a: Matrix, n: int, stage: int) -> list[list]:
    """Snapshot of the augmented matrix labelled with the current stage."""
    return [[stage, *[round(v, 10) for v in row]] for row in a]


def _gaussian(req: LinearSystemRequest, pivot: str) -> MethodResult:
    err = _validate_square(req.matrix, req.vector)
    if err:
        return MethodResult(success=False, message=err)
    n = len(req.matrix)
    a = _augment(req.matrix, req.vector)
    marks = list(range(n))  # column tracking for total pivoting
    columns = ["stage"] + [f"a{j+1}" for j in range(n)] + ["b"]
    rows: list[list] = []
    rows.extend(_stage_rows(a, n, 0))

    for k in range(n - 1):
        if pivot == "partial":
            p = max(range(k, n), key=lambda i: abs(a[i][k]))
            if p != k:
                a[k], a[p] = a[p], a[k]
        elif pivot == "total":
            best = (k, k)
            best_val = -1.0
            for i in range(k, n):
                for j in range(k, n):
                    if abs(a[i][j]) > best_val:
                        best_val = abs(a[i][j])
                        best = (i, j)
            pi, pj = best
            if pi != k:
                a[k], a[pi] = a[pi], a[k]
            if pj != k:
                for row in a:
                    row[k], row[pj] = row[pj], row[k]
                marks[k], marks[pj] = marks[pj], marks[k]

        if a[k][k] == 0:
            return MethodResult(success=False, columns=columns, rows=rows,
                                message="A zero pivot was found; the system cannot be solved with this pivoting strategy")
        for i in range(k + 1, n):
            factor = a[i][k] / a[k][k]
            for j in range(k, n + 1):
                a[i][j] -= factor * a[k][j]
        rows.extend(_stage_rows(a, n, k + 1))

    if a[n - 1][n - 1] == 0:
        return MethodResult(success=False, columns=columns, rows=rows,
                            message="The determinant of the matrix cannot be 0")

    x = _back_substitution(a, n)
    if pivot == "total":
        # Undo column permutation.
        ordered = [0.0] * n
        for i in range(n):
            ordered[marks[i]] = x[i]
        x = ordered

    return MethodResult(success=True, columns=columns, rows=rows, result=x,
                        message="After applying regressive substitution we get the solution")


def gaussian_simple(req: LinearSystemRequest) -> MethodResult:
    return _gaussian(req, pivot="none")


def gaussian_partial(req: LinearSystemRequest) -> MethodResult:
    return _gaussian(req, pivot="partial")


def gaussian_total(req: LinearSystemRequest) -> MethodResult:
    return _gaussian(req, pivot="total")


def _lu_result(L: Matrix, U: Matrix, vector: Vector, n: int) -> MethodResult:
    # Solve Ly = b (forward) then Ux = y (back).
    ly = _augment(L, vector)
    y = _forward_substitution(ly, n)
    ux = _augment(U, y)
    x = _back_substitution(ux, n)
    columns = [f"col{j+1}" for j in range(n)]
    rows = [["L", *[round(v, 10) for v in row]] for row in L] + \
           [["U", *[round(v, 10) for v in row]] for row in U]
    return MethodResult(success=True, columns=["matrix", *columns], rows=rows, result=x,
                        message="Direct factorization complete")


def lu_doolittle(req: LinearSystemRequest) -> MethodResult:
    err = _validate_square(req.matrix, req.vector)
    if err:
        return MethodResult(success=False, message=err)
    n = len(req.matrix)
    a = deepcopy(req.matrix)
    L = [[0.0] * n for _ in range(n)]
    U = [[0.0] * n for _ in range(n)]
    for i in range(n):
        L[i][i] = 1.0
    for k in range(n):
        for j in range(k, n):
            U[k][j] = a[k][j] - sum(L[k][s] * U[s][j] for s in range(k))
        if U[k][k] == 0:
            return MethodResult(success=False, message="A zero pivot was found; Doolittle factorization cannot continue")
        for i in range(k + 1, n):
            L[i][k] = (a[i][k] - sum(L[i][s] * U[s][k] for s in range(k))) / U[k][k]
    return _lu_result(L, U, req.vector, n)


def lu_crout(req: LinearSystemRequest) -> MethodResult:
    err = _validate_square(req.matrix, req.vector)
    if err:
        return MethodResult(success=False, message=err)
    n = len(req.matrix)
    a = deepcopy(req.matrix)
    L = [[0.0] * n for _ in range(n)]
    U = [[0.0] * n for _ in range(n)]
    for i in range(n):
        U[i][i] = 1.0
    for k in range(n):
        for i in range(k, n):
            L[i][k] = a[i][k] - sum(L[i][s] * U[s][k] for s in range(k))
        if L[k][k] == 0:
            return MethodResult(success=False, message="A zero pivot was found; Crout factorization cannot continue")
        for j in range(k + 1, n):
            U[k][j] = (a[k][j] - sum(L[k][s] * U[s][j] for s in range(k))) / L[k][k]
    return _lu_result(L, U, req.vector, n)


def lu_partial(req: LinearSystemRequest) -> MethodResult:
    """LU with partial pivoting (PA = LU). Solves via the permuted system."""
    err = _validate_square(req.matrix, req.vector)
    if err:
        return MethodResult(success=False, message=err)
    n = len(req.matrix)
    a = deepcopy(req.matrix)
    b = list(req.vector)
    L = [[0.0] * n for _ in range(n)]
    U = deepcopy(a)
    perm = list(range(n))
    for k in range(n):
        p = max(range(k, n), key=lambda i: abs(U[i][k]))
        if U[p][k] == 0:
            return MethodResult(success=False, message="The matrix is singular; LU with partial pivoting cannot continue")
        if p != k:
            U[k], U[p] = U[p], U[k]
            L[k], L[p] = L[p], L[k]
            b[k], b[p] = b[p], b[k]
            perm[k], perm[p] = perm[p], perm[k]
        L[k][k] = 1.0
        for i in range(k + 1, n):
            factor = U[i][k] / U[k][k]
            L[i][k] = factor
            for j in range(k, n):
                U[i][j] -= factor * U[k][j]
    return _lu_result(L, U, b, n)


def cholesky(req: LinearSystemRequest) -> MethodResult:
    err = _validate_square(req.matrix, req.vector)
    if err:
        return MethodResult(success=False, message=err)
    n = len(req.matrix)
    a = deepcopy(req.matrix)
    # Symmetry check.
    for i in range(n):
        for j in range(n):
            if abs(a[i][j] - a[j][i]) > 1e-9:
                return MethodResult(success=False, message="The matrix must be symmetric to apply Cholesky")
    L = [[0.0] * n for _ in range(n)]
    for i in range(n):
        for j in range(i + 1):
            s = sum(L[i][k] * L[j][k] for k in range(j))
            if i == j:
                val = a[i][i] - s
                if val <= 0:
                    return MethodResult(success=False,
                                        message="The matrix is not positive definite; Cholesky cannot be applied")
                L[i][j] = math.sqrt(val)
            else:
                L[i][j] = (a[i][j] - s) / L[j][j]
    U = [[L[j][i] for j in range(n)] for i in range(n)]  # L^T
    return _lu_result(L, U, req.vector, n)


# ----- Iterative methods -----------------------------------------------------
def _spectral_radius_ok(matrix: Matrix, n: int) -> bool:
    """Rough convergence check via strict diagonal dominance."""
    for i in range(n):
        diag = abs(matrix[i][i])
        off = sum(abs(matrix[i][j]) for j in range(n) if j != i)
        if diag <= off:
            return False
    return True


def _iterative(req: IterativeSystemRequest, w: float, use_latest: bool) -> MethodResult:
    err = _validate_square(req.matrix, req.vector)
    if err:
        return MethodResult(success=False, message=err)
    n = len(req.matrix)
    if len(req.x0) != n:
        return MethodResult(success=False, message="The initial vector length must match the matrix size")
    a, b = req.matrix, req.vector
    for i in range(n):
        if a[i][i] == 0:
            return MethodResult(success=False,
                                message="The matrix cannot have a 0 on the main diagonal")

    columns = ["iter", *[f"x{j+1}" for j in range(n)], "error"]
    rows: list[list] = [[0, *[round(v, 10) for v in req.x0], None]]
    x = list(req.x0)

    for it in range(1, req.max_iterations + 1):
        x_new = list(x)
        for i in range(n):
            src = x_new if use_latest else x
            s = sum(a[i][j] * src[j] for j in range(n) if j != i)
            gs = (b[i] - s) / a[i][i]
            x_new[i] = (1 - w) * x[i] + w * gs
        # Infinity-norm error between successive iterates.
        error = max(abs(x_new[j] - x[j]) for j in range(n))
        if req.error_type == "relative":
            denom = max(abs(v) for v in x_new) or 1.0
            error = error / denom
        rows.append([it, *[round(v, 10) for v in x_new], error])
        x = x_new
        if error < req.tolerance:
            return MethodResult(success=True, columns=columns, rows=rows, result=x,
                                message="The method converged to a solution")

    return MethodResult(success=False, columns=columns, rows=rows,
                        message="The method did not converge within the given number of iterations")


def jacobi(req: IterativeSystemRequest) -> MethodResult:
    return _iterative(req, w=1.0, use_latest=False)


def gauss_seidel(req: IterativeSystemRequest) -> MethodResult:
    return _iterative(req, w=1.0, use_latest=True)


def sor(req: SorRequest) -> MethodResult:
    if not 0 < req.w < 2:
        # Still allow it, but note the typical convergence range.
        pass
    return _iterative(req, w=req.w, use_latest=True)
