"""Tests for interpolation methods. Points are sampled from y = x^2 so the
recovered polynomial / piecewise functions can be checked by evaluation."""
import pytest

from app.methods import interpolation
from app.schemas.methods import InterpolationRequest

XS = [0.0, 1.0, 2.0, 3.0]
YS = [0.0, 1.0, 4.0, 9.0]  # y = x^2


def _poly_eval(coeffs, x):
    """Evaluate a polynomial given highest-degree-first coefficients."""
    n = len(coeffs)
    return sum(c * x ** (n - 1 - i) for i, c in enumerate(coeffs))


def test_vandermonde_recovers_quadratic():
    r = interpolation.vandermonde(InterpolationRequest(x=XS, y=YS))
    assert r.success
    coeffs = r.result["coefficients"]
    for x, y in zip(XS, YS):
        assert _poly_eval(coeffs, x) == pytest.approx(y, abs=1e-6)
    # y = x^2 -> interpolating at 5 is 25
    assert _poly_eval(coeffs, 5) == pytest.approx(25.0, abs=1e-6)


def test_lagrange_recovers_quadratic():
    r = interpolation.lagrange(InterpolationRequest(x=XS, y=YS))
    assert r.success
    coeffs = r.result["coefficients"]
    for x, y in zip(XS, YS):
        assert _poly_eval(coeffs, x) == pytest.approx(y, abs=1e-6)


def test_newton_divided_difference():
    r = interpolation.newton_divided_difference(InterpolationRequest(x=XS, y=YS))
    assert r.success
    assert len(r.result["coefficients"]) == len(XS)
    assert r.rows  # divided-difference table present


def test_spline_linear_segments():
    r = interpolation.spline_linear(InterpolationRequest(x=XS, y=YS))
    assert r.success
    segs = r.result["segments"]
    assert len(segs) == len(XS) - 1
    # Linear spline passes exactly through the nodes.
    for i, seg in enumerate(segs):
        m, b = seg["coefficients"]
        assert m * XS[i] + b == pytest.approx(YS[i], abs=1e-9)


def test_spline_quadratic_segments():
    r = interpolation.spline_quadratic(InterpolationRequest(x=XS, y=YS))
    assert r.success
    assert len(r.result["segments"]) == len(XS) - 1


def test_spline_cubic_segments():
    r = interpolation.spline_cubic(InterpolationRequest(x=XS, y=YS))
    assert r.success
    segs = r.result["segments"]
    assert len(segs) == len(XS) - 1
    # Each cubic segment must reproduce its left node value exactly.
    for i, seg in enumerate(segs):
        a, b, c, d = seg["coefficients"]
        assert a == pytest.approx(YS[i], abs=1e-9)


def test_duplicate_x_rejected():
    r = interpolation.vandermonde(InterpolationRequest(x=[0, 0, 1], y=[1, 2, 3]))
    assert not r.success
    assert "distinct" in r.message.lower()
