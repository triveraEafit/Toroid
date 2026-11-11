"""Safe mathematical expression evaluator.

Parses a user-supplied function of one variable (default ``x``) into a Python
callable using a restricted AST whitelist. No builtins, no attribute access,
no arbitrary names: only numbers, the declared variable, a whitelist of math
functions/constants and basic arithmetic operators are allowed.

This keeps the numeric-method business logic in the backend and prevents
arbitrary code execution from the function text the user types.
"""
from __future__ import annotations

import ast
import math
import operator
from typing import Callable

# Whitelisted functions and constants available inside an expression.
_ALLOWED_FUNCS: dict[str, Callable | float] = {
    "sin": math.sin,
    "cos": math.cos,
    "tan": math.tan,
    "asin": math.asin,
    "acos": math.acos,
    "atan": math.atan,
    "sinh": math.sinh,
    "cosh": math.cosh,
    "tanh": math.tanh,
    "exp": math.exp,
    "log": math.log,  # natural log; log(x, base) also supported
    "ln": math.log,
    "log10": math.log10,
    "log2": math.log2,
    "sqrt": math.sqrt,
    "abs": abs,
    "ceil": math.ceil,
    "floor": math.floor,
}
_ALLOWED_CONSTS: dict[str, float] = {
    "pi": math.pi,
    "e": math.e,
}

_BIN_OPS = {
    ast.Add: operator.add,
    ast.Sub: operator.sub,
    ast.Mult: operator.mul,
    ast.Div: operator.truediv,
    ast.Pow: operator.pow,
    ast.Mod: operator.mod,
}
_UNARY_OPS = {
    ast.UAdd: operator.pos,
    ast.USub: operator.neg,
}


class ExpressionError(ValueError):
    """Raised when an expression is invalid or uses a disallowed construct."""


def _normalize(expr: str) -> str:
    """Translate common math notation to Python syntax."""
    # Caret is exponentiation in math notation.
    return expr.replace("^", "**")


class _Evaluator(ast.NodeVisitor):
    def __init__(self, variables: dict[str, float]):
        self._vars = variables

    def visit(self, node):  # type: ignore[override]
        method = getattr(self, "visit_" + type(node).__name__, None)
        if method is None:
            raise ExpressionError(
                f"Unsupported syntax: {type(node).__name__}"
            )
        return method(node)

    def visit_Expression(self, node: ast.Expression):
        return self.visit(node.body)

    def visit_Constant(self, node: ast.Constant):
        if isinstance(node.value, (int, float)):
            return float(node.value)
        raise ExpressionError("Only numeric constants are allowed")

    def visit_BinOp(self, node: ast.BinOp):
        op = _BIN_OPS.get(type(node.op))
        if op is None:
            raise ExpressionError("Unsupported operator")
        return op(self.visit(node.left), self.visit(node.right))

    def visit_UnaryOp(self, node: ast.UnaryOp):
        op = _UNARY_OPS.get(type(node.op))
        if op is None:
            raise ExpressionError("Unsupported unary operator")
        return op(self.visit(node.operand))

    def visit_Name(self, node: ast.Name):
        if node.id in self._vars:
            return self._vars[node.id]
        if node.id in _ALLOWED_CONSTS:
            return _ALLOWED_CONSTS[node.id]
        raise ExpressionError(f"Unknown name: {node.id}")

    def visit_Call(self, node: ast.Call):
        if not isinstance(node.func, ast.Name):
            raise ExpressionError("Only direct function calls are allowed")
        fn = _ALLOWED_FUNCS.get(node.func.id)
        if fn is None or not callable(fn):
            raise ExpressionError(f"Unknown function: {node.func.id}")
        if node.keywords:
            raise ExpressionError("Keyword arguments are not allowed")
        args = [self.visit(a) for a in node.args]
        return fn(*args)


def compile_function(expr: str, variable: str = "x") -> Callable[[float], float]:
    """Compile ``expr`` into a one-argument callable ``f(value) -> float``.

    Raises :class:`ExpressionError` if the expression is structurally invalid.
    Runtime math errors (e.g. division by zero, domain errors) propagate as
    the usual :class:`ArithmeticError`/:class:`ValueError` when the callable
    is invoked.
    """
    if not expr or not expr.strip():
        raise ExpressionError("The function expression is empty")
    try:
        tree = ast.parse(_normalize(expr), mode="eval")
    except SyntaxError as exc:  # noqa: PERF203
        raise ExpressionError(f"Invalid expression syntax: {exc.msg}") from exc

    # Validate the whole tree once so structural errors surface immediately.
    _Evaluator({variable: 1.0}).visit(tree)

    def func(value: float) -> float:
        result = _Evaluator({variable: float(value)}).visit(tree)
        return float(result)

    return func


def evaluate(expr: str, value: float, variable: str = "x") -> float:
    """Convenience: compile and evaluate ``expr`` at a single point."""
    return compile_function(expr, variable)(value)
