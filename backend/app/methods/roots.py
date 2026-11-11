"""Equation-root numerical methods.

Every function returns a ``MethodResult``: a success flag, a human message, a
table (columns + rows) describing each iteration, and the headline root. The
behaviour mirrors the reference "Peanut" app, including its validation and
non-convergence messages.
"""
from __future__ import annotations

from ..core.evaluator import ExpressionError, compile_function
from ..schemas.methods import (
    BisectionRequest,
    FalsePositionRequest,
    FixedPointRequest,
    IncrementalRequest,
    MethodResult,
    MultipleRootsRequest,
    NewtonRequest,
    SecantRequest,
)


def _error(value: float, previous: float, error_type: str) -> float:
    """Absolute or relative error between successive approximations."""
    if error_type == "relative" and value != 0:
        return abs((value - previous) / value)
    return abs(value - previous)


def _numeric_derivative(f, x: float, h: float = 1e-6) -> float:
    """Central finite-difference derivative."""
    return (f(x + h) - f(x - h)) / (2 * h)


def _compile(expr: str, variable: str = "x"):
    try:
        return compile_function(expr, variable)
    except ExpressionError as exc:
        raise ValueError(str(exc)) from exc


def incremental_search(req: IncrementalRequest) -> MethodResult:
    f = _compile(req.function)
    columns = ["iter", "x", "f(x)"]
    rows: list[list] = []
    x_prev = req.x0
    try:
        f_prev = f(x_prev)
    except (ArithmeticError, ValueError) as exc:
        return MethodResult(success=False, message=f"Error evaluating the function: {exc}")

    rows.append([0, x_prev, f_prev])
    if f_prev == 0:
        return MethodResult(success=True, columns=columns, rows=rows, result=x_prev,
                            message=f"{x_prev} is a root of the function")

    for i in range(1, req.max_iterations + 1):
        x_cur = x_prev + req.delta
        try:
            f_cur = f(x_cur)
        except (ArithmeticError, ValueError) as exc:
            return MethodResult(success=False, message=f"Error evaluating the function: {exc}", columns=columns, rows=rows)
        rows.append([i, x_cur, f_cur])
        if f_cur == 0:
            return MethodResult(success=True, columns=columns, rows=rows, result=x_cur,
                                message=f"{x_cur} is a root of the function")
        if f_prev * f_cur < 0:
            return MethodResult(
                success=True, columns=columns, rows=rows, result=[x_prev, x_cur],
                message=f"There is a root between {x_prev} and {x_cur}",
            )
        x_prev, f_prev = x_cur, f_cur

    return MethodResult(success=False, columns=columns, rows=rows,
                        message="No sign change found in the given number of iterations")


def _bracketing(req, use_false_position: bool) -> MethodResult:
    f = _compile(req.function)
    a, b = req.a, req.b
    try:
        fa, fb = f(a), f(b)
    except (ArithmeticError, ValueError) as exc:
        return MethodResult(success=False, message=f"Error evaluating the function: {exc}")

    if fa == 0:
        return MethodResult(success=True, result=a, message=f"{a} is a root of the function")
    if fb == 0:
        return MethodResult(success=True, result=b, message=f"{b} is a root of the function")
    if fa * fb > 0:
        return MethodResult(success=False,
                            message="The function does not change sign on the interval; there may be no root between a and b")

    columns = ["iter", "a", "xm", "b", "f(xm)", "error"]
    rows: list[list] = []
    xm_prev = a
    for i in range(1, req.max_iterations + 1):
        if use_false_position:
            xm = b - fb * (a - b) / (fa - fb)
        else:
            xm = (a + b) / 2
        try:
            fm = f(xm)
        except (ArithmeticError, ValueError) as exc:
            return MethodResult(success=False, message=f"Error evaluating the function: {exc}", columns=columns, rows=rows)

        err = _error(xm, xm_prev, req.error_type) if i > 1 else None
        rows.append([i, a, xm, b, fm, err])

        if fm == 0:
            return MethodResult(success=True, columns=columns, rows=rows, result=xm,
                                message=f"{xm} is a root of the function")
        if err is not None and err < req.tolerance:
            return MethodResult(success=True, columns=columns, rows=rows, result=xm,
                                message=f"An approximation of the root was found for x = {xm}")
        if fa * fm < 0:
            b, fb = xm, fm
        else:
            a, fa = xm, fm
        xm_prev = xm

    return MethodResult(success=False, columns=columns, rows=rows,
                        message="Given the number of iterations and the tolerance, it was impossible to find a satisfying root")


def bisection(req: BisectionRequest) -> MethodResult:
    return _bracketing(req, use_false_position=False)


def false_position(req: FalsePositionRequest) -> MethodResult:
    return _bracketing(req, use_false_position=True)


def fixed_point(req: FixedPointRequest) -> MethodResult:
    f = _compile(req.function)
    g = _compile(req.g_function)
    columns = ["iter", "xn", "g(xn)", "f(xn)", "error"]
    rows: list[list] = []
    x_prev = req.x0
    try:
        rows.append([0, x_prev, None, f(x_prev), None])
    except (ArithmeticError, ValueError) as exc:
        return MethodResult(success=False, message=f"Error evaluating the function: {exc}")

    for i in range(1, req.max_iterations + 1):
        try:
            x_cur = g(x_prev)
            f_cur = f(x_cur)
        except (ArithmeticError, ValueError) as exc:
            return MethodResult(success=False, message=f"Error evaluating the function: {exc}", columns=columns, rows=rows)
        err = _error(x_cur, x_prev, req.error_type)
        rows.append([i, x_cur, g(x_prev), f_cur, err])
        if f_cur == 0 or err < req.tolerance:
            return MethodResult(success=True, columns=columns, rows=rows, result=x_cur,
                                message=f"An approximation of the root was found for x = {x_cur}")
        x_prev = x_cur

    return MethodResult(success=False, columns=columns, rows=rows,
                        message="Given the number of iterations and the tolerance, it was impossible to find a satisfying root")


def newton(req: NewtonRequest) -> MethodResult:
    f = _compile(req.function)
    columns = ["iter", "xn", "f(xn)", "f'(xn)", "error"]
    rows: list[list] = []
    x_prev = req.x0
    for i in range(req.max_iterations + 1):
        try:
            fx = f(x_prev)
            dfx = _numeric_derivative(f, x_prev)
        except (ArithmeticError, ValueError) as exc:
            return MethodResult(success=False, message=f"Error evaluating the function: {exc}", columns=columns, rows=rows)

        if i == 0:
            rows.append([0, x_prev, fx, dfx, None])
            if fx == 0:
                return MethodResult(success=True, columns=columns, rows=rows, result=x_prev,
                                    message=f"{x_prev} is a root of the function")
            continue

        if dfx == 0:
            return MethodResult(success=False, columns=columns, rows=rows,
                                message="The derivative is 0, the method cannot be continued")
        x_cur = x_prev - fx / dfx
        err = _error(x_cur, x_prev, req.error_type)
        try:
            fcur = f(x_cur)
        except (ArithmeticError, ValueError) as exc:
            return MethodResult(success=False, message=f"Error evaluating the function: {exc}", columns=columns, rows=rows)
        rows.append([i, x_cur, fcur, _numeric_derivative(f, x_cur), err])
        if fcur == 0 or err < req.tolerance:
            return MethodResult(success=True, columns=columns, rows=rows, result=x_cur,
                                message=f"An approximation of the root was found for x = {x_cur}")
        x_prev = x_cur

    return MethodResult(success=False, columns=columns, rows=rows,
                        message="Given the number of iterations and the tolerance, it was impossible to find a satisfying root")


def secant(req: SecantRequest) -> MethodResult:
    f = _compile(req.function)
    columns = ["iter", "xn", "f(xn)", "error"]
    rows: list[list] = []
    x0, x1 = req.x0, req.x1
    try:
        f0, f1 = f(x0), f(x1)
    except (ArithmeticError, ValueError) as exc:
        return MethodResult(success=False, message=f"Error evaluating the function: {exc}")
    rows.append([0, x0, f0, None])
    rows.append([1, x1, f1, _error(x1, x0, req.error_type)])

    for i in range(2, req.max_iterations + 1):
        denom = f1 - f0
        if denom == 0:
            return MethodResult(success=False, columns=columns, rows=rows,
                                message=f"The denominator is 0, the method cannot be continued. The last approximate root found is {x1}")
        x2 = x1 - f1 * (x1 - x0) / denom
        try:
            f2 = f(x2)
        except (ArithmeticError, ValueError) as exc:
            return MethodResult(success=False, message=f"Error evaluating the function: {exc}", columns=columns, rows=rows)
        err = _error(x2, x1, req.error_type)
        rows.append([i, x2, f2, err])
        if f2 == 0 or err < req.tolerance:
            return MethodResult(success=True, columns=columns, rows=rows, result=x2,
                                message=f"An approximation of the root was found for x = {x2}")
        x0, f0, x1, f1 = x1, f1, x2, f2

    return MethodResult(success=False, columns=columns, rows=rows,
                        message="Given the number of iterations and the tolerance, it was impossible to find a satisfying root")


def multiple_roots(req: MultipleRootsRequest) -> MethodResult:
    """Newton's modified method for roots of multiplicity > 1 (m = f*f' / (f'^2 - f*f'')."""
    f = _compile(req.function)
    columns = ["iter", "xn", "f(xn)", "error"]
    rows: list[list] = []
    x_prev = req.x0

    def d1(x):
        return _numeric_derivative(f, x)

    def d2(x, h=1e-4):
        return (f(x + h) - 2 * f(x) + f(x - h)) / (h * h)

    try:
        rows.append([0, x_prev, f(x_prev), None])
        if f(x_prev) == 0:
            return MethodResult(success=True, columns=columns, rows=rows, result=x_prev,
                                message=f"{x_prev} is a root of the function")
    except (ArithmeticError, ValueError) as exc:
        return MethodResult(success=False, message=f"Error evaluating the function: {exc}")

    for i in range(1, req.max_iterations + 1):
        try:
            fx, fp, fpp = f(x_prev), d1(x_prev), d2(x_prev)
        except (ArithmeticError, ValueError) as exc:
            return MethodResult(success=False, message=f"Error evaluating the function: {exc}", columns=columns, rows=rows)
        denom = fp * fp - fx * fpp
        if denom == 0:
            return MethodResult(success=False, columns=columns, rows=rows,
                                message="The denominator is 0, the method cannot be continued")
        x_cur = x_prev - (fx * fp) / denom
        err = _error(x_cur, x_prev, req.error_type)
        try:
            fcur = f(x_cur)
        except (ArithmeticError, ValueError) as exc:
            return MethodResult(success=False, message=f"Error evaluating the function: {exc}", columns=columns, rows=rows)
        rows.append([i, x_cur, fcur, err])
        if fcur == 0 or err < req.tolerance:
            return MethodResult(success=True, columns=columns, rows=rows, result=x_cur,
                                message=f"An approximation of the root was found for x = {x_cur}")
        x_prev = x_cur

    return MethodResult(success=False, columns=columns, rows=rows,
                        message="Given the number of iterations and the tolerance, it was impossible to find a satisfying root")
