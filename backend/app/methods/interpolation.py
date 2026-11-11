"""Interpolation numerical methods: Vandermonde, Newton divided differences,
Lagrange and splines (linear, quadratic, cubic).

Each returns a ``MethodResult`` whose ``result`` carries the polynomial
coefficients / piecewise definition and whose table shows the working.
"""
from __future__ import annotations

from ..schemas.methods import InterpolationRequest, MethodResult
from .systems import _back_substitution, _augment


def _validate_points(req: InterpolationRequest) -> str | None:
    if len(req.x) != len(req.y):
        return "The x and y lists must have the same length"
    if len(set(req.x)) != len(req.x):
        return "The x values must be distinct"
    return None


def _poly_to_string(coeffs: list[float]) -> str:
    """Render coefficients (highest degree first) as a readable polynomial."""
    n = len(coeffs)
    terms = []
    for i, c in enumerate(coeffs):
        power = n - 1 - i
        if abs(c) < 1e-12:
            continue
        cr = round(c, 6)
        if power == 0:
            terms.append(f"{cr}")
        elif power == 1:
            terms.append(f"{cr}*x")
        else:
            terms.append(f"{cr}*x^{power}")
    return " + ".join(terms).replace("+ -", "- ") if terms else "0"


def vandermonde(req: InterpolationRequest) -> MethodResult:
    err = _validate_points(req)
    if err:
        return MethodResult(success=False, message=err)
    n = len(req.x)
    # Build Vandermonde matrix with descending powers.
    matrix = [[req.x[i] ** (n - 1 - j) for j in range(n)] for i in range(n)]
    aug = _augment(matrix, list(req.y))
    # Gaussian elimination to solve for coefficients.
    for k in range(n - 1):
        p = max(range(k, n), key=lambda i: abs(aug[i][k]))
        if aug[p][k] == 0:
            return MethodResult(success=False, message="The Vandermonde matrix is singular")
        aug[k], aug[p] = aug[p], aug[k]
        for i in range(k + 1, n):
            factor = aug[i][k] / aug[k][k]
            for j in range(k, n + 1):
                aug[i][j] -= factor * aug[k][j]
    coeffs = _back_substitution(aug, n)
    columns = [f"a{n-1-j}" for j in range(n)]
    rows = [[round(c, 10) for c in coeffs]]
    return MethodResult(success=True, columns=columns, rows=rows,
                        result={"coefficients": coeffs, "polynomial": _poly_to_string(coeffs)},
                        message="Interpolating polynomial found")


def newton_divided_difference(req: InterpolationRequest) -> MethodResult:
    err = _validate_points(req)
    if err:
        return MethodResult(success=False, message=err)
    n = len(req.x)
    x, y = list(req.x), list(req.y)
    # Divided-difference table.
    table = [[0.0] * n for _ in range(n)]
    for i in range(n):
        table[i][0] = y[i]
    for j in range(1, n):
        for i in range(n - j):
            table[i][j] = (table[i + 1][j - 1] - table[i][j - 1]) / (x[i + j] - x[i])

    coeffs = [table[0][j] for j in range(n)]  # Newton form coefficients
    columns = ["xi", "yi"] + [f"Δ{j}" for j in range(1, n)]
    rows = []
    for i in range(n):
        row = [x[i], y[i]] + [round(table[i][j], 10) if i < n - j else None for j in range(1, n)]
        rows.append(row)
    return MethodResult(success=True, columns=columns, rows=rows,
                        result={"coefficients": coeffs, "nodes": x,
                                "form": "Newton divided differences"},
                        message="Newton\u2019s Divided Difference Table computed")


def lagrange(req: InterpolationRequest) -> MethodResult:
    err = _validate_points(req)
    if err:
        return MethodResult(success=False, message=err)
    n = len(req.x)
    x, y = list(req.x), list(req.y)
    # Build the combined polynomial coefficients (descending powers).
    total = [0.0] * n
    rows = []
    for i in range(n):
        # Basis polynomial L_i(x) = prod_{j != i} (x - x_j)/(x_i - x_j).
        basis = [1.0]
        denom = 1.0
        for j in range(n):
            if j == i:
                continue
            # Multiply polynomial `basis` by (x - x_j).
            basis = _poly_mul(basis, [1.0, -x[j]])
            denom *= (x[i] - x[j])
        scale = y[i] / denom
        scaled = [c * scale for c in basis]
        # Accumulate into total (align lengths, descending powers).
        total = _poly_add(total, scaled)
        rows.append([f"L{i}", round(scale, 10)])
    return MethodResult(success=True, columns=["term", "coefficient"], rows=rows,
                        result={"coefficients": total, "polynomial": _poly_to_string(total)},
                        message="Lagrange interpolating polynomial found")


def _poly_mul(a: list[float], b: list[float]) -> list[float]:
    result = [0.0] * (len(a) + len(b) - 1)
    for i, av in enumerate(a):
        for j, bv in enumerate(b):
            result[i + j] += av * bv
    return result


def _poly_add(a: list[float], b: list[float]) -> list[float]:
    la, lb = len(a), len(b)
    n = max(la, lb)
    a = [0.0] * (n - la) + a
    b = [0.0] * (n - lb) + b
    return [a[i] + b[i] for i in range(n)]


def _spline(req: InterpolationRequest, degree: int) -> MethodResult:
    err = _validate_points(req)
    if err:
        return MethodResult(success=False, message=err)
    pts = sorted(zip(req.x, req.y), key=lambda p: p[0])
    x = [p[0] for p in pts]
    y = [p[1] for p in pts]
    n = len(x)
    segments = []

    if degree == 1:
        for i in range(n - 1):
            m = (y[i + 1] - y[i]) / (x[i + 1] - x[i])
            b = y[i] - m * x[i]
            segments.append({"interval": [x[i], x[i + 1]], "coefficients": [m, b],
                             "polynomial": _poly_to_string([m, b])})
    elif degree == 2:
        # Quadratic spline: solve for a_i, b_i, c_i per segment.
        segs = n - 1
        size = 3 * segs
        A = [[0.0] * size for _ in range(size)]
        rhs = [0.0] * size
        row = 0
        # Interpolation at both ends of each segment.
        for i in range(segs):
            a_i, b_i, c_i = 3 * i, 3 * i + 1, 3 * i + 2
            A[row][a_i] = x[i] ** 2; A[row][b_i] = x[i]; A[row][c_i] = 1; rhs[row] = y[i]; row += 1
            A[row][a_i] = x[i + 1] ** 2; A[row][b_i] = x[i + 1]; A[row][c_i] = 1; rhs[row] = y[i + 1]; row += 1
        # C1 continuity of first derivative at interior knots.
        for i in range(segs - 1):
            a_i, b_i = 3 * i, 3 * i + 1
            a_n, b_n = 3 * (i + 1), 3 * (i + 1) + 1
            A[row][a_i] = 2 * x[i + 1]; A[row][b_i] = 1
            A[row][a_n] = -2 * x[i + 1]; A[row][b_n] = -1
            rhs[row] = 0; row += 1
        # First segment is linear (a_0 = 0).
        A[row][0] = 1; rhs[row] = 0
        sol = _solve_dense(A, rhs)
        if sol is None:
            return MethodResult(success=False, message="Could not solve the quadratic spline system")
        for i in range(segs):
            coeffs = sol[3 * i:3 * i + 3]
            segments.append({"interval": [x[i], x[i + 1]], "coefficients": coeffs,
                             "polynomial": _poly_to_string(coeffs)})
    else:  # cubic natural spline
        segs = n - 1
        h = [x[i + 1] - x[i] for i in range(segs)]
        # Solve tridiagonal system for second derivatives (natural: ends = 0).
        alpha = [0.0] * n
        for i in range(1, segs):
            alpha[i] = (3 / h[i]) * (y[i + 1] - y[i]) - (3 / h[i - 1]) * (y[i] - y[i - 1])
        l = [1.0] + [0.0] * (n - 1)
        mu = [0.0] * n
        z = [0.0] * n
        for i in range(1, segs):
            l[i] = 2 * (x[i + 1] - x[i - 1]) - h[i - 1] * mu[i - 1]
            mu[i] = h[i] / l[i]
            z[i] = (alpha[i] - h[i - 1] * z[i - 1]) / l[i]
        l[n - 1] = 1.0
        c = [0.0] * n
        b = [0.0] * n
        d = [0.0] * n
        for j in range(segs - 1, -1, -1):
            c[j] = z[j] - mu[j] * c[j + 1]
            b[j] = (y[j + 1] - y[j]) / h[j] - h[j] * (c[j + 1] + 2 * c[j]) / 3
            d[j] = (c[j + 1] - c[j]) / (3 * h[j])
        for i in range(segs):
            # S_i(x) = y_i + b_i(x-x_i) + c_i(x-x_i)^2 + d_i(x-x_i)^3
            segments.append({
                "interval": [x[i], x[i + 1]],
                "coefficients": [y[i], b[i], c[i], d[i]],
                "center": x[i],
                "polynomial": f"{round(y[i],6)} + {round(b[i],6)}(x-{x[i]}) + "
                              f"{round(c[i],6)}(x-{x[i]})^2 + {round(d[i],6)}(x-{x[i]})^3",
            })

    columns = ["interval", "polynomial"]
    rows = [[f"[{s['interval'][0]}, {s['interval'][1]}]", s["polynomial"]] for s in segments]
    return MethodResult(success=True, columns=columns, rows=rows,
                        result={"segments": segments, "degree": degree},
                        message=f"Spline of degree {degree} computed")


def _solve_dense(A: list[list[float]], b: list[float]) -> list[float] | None:
    n = len(A)
    aug = [row[:] + [b[i]] for i, row in enumerate(A)]
    for k in range(n):
        p = max(range(k, n), key=lambda i: abs(aug[i][k]))
        if abs(aug[p][k]) < 1e-14:
            return None
        aug[k], aug[p] = aug[p], aug[k]
        for i in range(n):
            if i == k:
                continue
            factor = aug[i][k] / aug[k][k]
            for j in range(k, n + 1):
                aug[i][j] -= factor * aug[k][j]
    return [aug[i][n] / aug[i][i] for i in range(n)]


def spline_linear(req: InterpolationRequest) -> MethodResult:
    return _spline(req, degree=1)


def spline_quadratic(req: InterpolationRequest) -> MethodResult:
    return _spline(req, degree=2)


def spline_cubic(req: InterpolationRequest) -> MethodResult:
    return _spline(req, degree=3)
