"""Tests for the safe expression evaluator."""
import math

import pytest

from app.core.evaluator import ExpressionError, compile_function, evaluate


def test_basic_arithmetic():
    assert evaluate("2 + 3 * 4", 0) == 14
    assert evaluate("(2 + 3) * 4", 0) == 20


def test_caret_is_power():
    f = compile_function("x^3")
    assert f(2) == 8
    assert f(3) == 27


def test_variable_substitution():
    f = compile_function("x^2 - 2")
    assert f(0) == -2
    assert f(2) == 2


def test_math_functions():
    assert evaluate("sin(0)", 0) == 0
    assert evaluate("cos(0)", 0) == 1
    assert evaluate("exp(0)", 0) == 1
    assert evaluate("sqrt(9)", 0) == 3
    assert evaluate("ln(1)", 0) == 0


def test_constants():
    assert evaluate("pi", 0) == pytest.approx(math.pi)
    assert evaluate("e", 0) == pytest.approx(math.e)


def test_unary_minus():
    assert evaluate("-x", 5) == -5


def test_empty_expression_raises():
    with pytest.raises(ExpressionError):
        compile_function("")


def test_unknown_name_raises():
    with pytest.raises(ExpressionError):
        compile_function("y + 1")


def test_unknown_function_raises():
    with pytest.raises(ExpressionError):
        compile_function("foo(x)")


def test_no_attribute_access():
    # Disallowed constructs must not slip through.
    with pytest.raises(ExpressionError):
        compile_function("x.__class__")


def test_syntax_error_raises():
    with pytest.raises(ExpressionError):
        compile_function("x +* 2")


def test_runtime_math_error_propagates():
    f = compile_function("1/x")
    with pytest.raises(ZeroDivisionError):
        f(0)
