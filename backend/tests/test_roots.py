"""Tests for equation-root methods. Each method is checked against a known
root and its failure/validation behaviour."""
import math

import pytest

from app.methods import roots
from app.schemas.methods import (
    BisectionRequest,
    FalsePositionRequest,
    FixedPointRequest,
    IncrementalRequest,
    MultipleRootsRequest,
    NewtonRequest,
    SecantRequest,
)

SQRT2 = math.sqrt(2)


def test_incremental_finds_bracket():
    r = roots.incremental_search(IncrementalRequest(function="x^2 - 2", x0=0, delta=0.5, max_iterations=20))
    assert r.success
    low, high = r.result
    assert low < SQRT2 < high


def test_incremental_no_sign_change():
    r = roots.incremental_search(IncrementalRequest(function="x^2 + 1", x0=0, delta=0.5, max_iterations=5))
    assert not r.success


def test_bisection_converges():
    r = roots.bisection(BisectionRequest(function="x^2 - 2", a=0, b=2, tolerance=1e-8, max_iterations=100))
    assert r.success
    assert r.result == pytest.approx(SQRT2, abs=1e-4)
    assert r.rows  # produced an iteration table


def test_bisection_no_sign_change_fails():
    r = roots.bisection(BisectionRequest(function="x^2 + 1", a=0, b=2, tolerance=1e-8, max_iterations=100))
    assert not r.success
    assert "sign" in r.message.lower()


def test_false_position_converges():
    r = roots.false_position(FalsePositionRequest(function="x^2 - 2", a=0, b=2, tolerance=1e-8, max_iterations=100))
    assert r.success
    assert r.result == pytest.approx(SQRT2, abs=1e-4)


def test_fixed_point_converges():
    r = roots.fixed_point(FixedPointRequest(function="x^2 - 2", g_function="(x + 2/x)/2", x0=1.5, tolerance=1e-10, max_iterations=50))
    assert r.success
    assert r.result == pytest.approx(SQRT2, abs=1e-6)


def test_newton_converges():
    r = roots.newton(NewtonRequest(function="x^2 - 2", x0=1.5, tolerance=1e-10, max_iterations=50))
    assert r.success
    assert r.result == pytest.approx(SQRT2, abs=1e-8)


def test_newton_cubic():
    # x^3 - x - 2 has a real root near 1.5213797
    r = roots.newton(NewtonRequest(function="x^3 - x - 2", x0=1.5, tolerance=1e-10, max_iterations=50))
    assert r.success
    assert r.result == pytest.approx(1.5213797, abs=1e-5)


def test_secant_converges():
    r = roots.secant(SecantRequest(function="x^2 - 2", x0=1, x1=2, tolerance=1e-10, max_iterations=50))
    assert r.success
    assert r.result == pytest.approx(SQRT2, abs=1e-8)


def test_secant_equal_values_fails():
    # A flat function yields a zero denominator.
    r = roots.secant(SecantRequest(function="0*x + 1", x0=1, x1=2, tolerance=1e-8, max_iterations=10))
    assert not r.success


def test_multiple_roots_double_root():
    # (x-2)^2 has a double root at x=2.
    r = roots.multiple_roots(MultipleRootsRequest(function="(x-2)^2", x0=1.0, tolerance=1e-8, max_iterations=60))
    assert r.success
    assert r.result == pytest.approx(2.0, abs=1e-3)


def test_invalid_function_raises():
    # A structurally invalid expression raises ValueError before iterating.
    with pytest.raises(ValueError):
        roots.bisection(BisectionRequest(function="x +* 2", a=0, b=2, tolerance=1e-8, max_iterations=10))


def test_exact_root_detected():
    r = roots.bisection(BisectionRequest(function="x - 1", a=0, b=2, tolerance=1e-8, max_iterations=50))
    assert r.success
    assert r.result == pytest.approx(1.0, abs=1e-6)
