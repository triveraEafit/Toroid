"""Interpolation method endpoints."""
from fastapi import APIRouter

from ..methods import interpolation
from ..schemas.methods import InterpolationRequest, MethodResult

router = APIRouter(prefix="/api/methods/interpolation", tags=["interpolation"])


@router.post("/vandermonde", response_model=MethodResult)
def vandermonde(req: InterpolationRequest) -> MethodResult:
    return interpolation.vandermonde(req)


@router.post("/newton", response_model=MethodResult)
def newton(req: InterpolationRequest) -> MethodResult:
    return interpolation.newton_divided_difference(req)


@router.post("/lagrange", response_model=MethodResult)
def lagrange(req: InterpolationRequest) -> MethodResult:
    return interpolation.lagrange(req)


@router.post("/spline-linear", response_model=MethodResult)
def spline_linear(req: InterpolationRequest) -> MethodResult:
    return interpolation.spline_linear(req)


@router.post("/spline-quadratic", response_model=MethodResult)
def spline_quadratic(req: InterpolationRequest) -> MethodResult:
    return interpolation.spline_quadratic(req)


@router.post("/spline-cubic", response_model=MethodResult)
def spline_cubic(req: InterpolationRequest) -> MethodResult:
    return interpolation.spline_cubic(req)
