"""Equation-root method endpoints."""
from fastapi import APIRouter

from ..methods import roots
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

router = APIRouter(prefix="/api/methods/roots", tags=["roots"])


@router.post("/incremental", response_model=MethodResult)
def incremental(req: IncrementalRequest) -> MethodResult:
    return roots.incremental_search(req)


@router.post("/bisection", response_model=MethodResult)
def bisection(req: BisectionRequest) -> MethodResult:
    return roots.bisection(req)


@router.post("/false-position", response_model=MethodResult)
def false_position(req: FalsePositionRequest) -> MethodResult:
    return roots.false_position(req)


@router.post("/fixed-point", response_model=MethodResult)
def fixed_point(req: FixedPointRequest) -> MethodResult:
    return roots.fixed_point(req)


@router.post("/newton", response_model=MethodResult)
def newton(req: NewtonRequest) -> MethodResult:
    return roots.newton(req)


@router.post("/secant", response_model=MethodResult)
def secant(req: SecantRequest) -> MethodResult:
    return roots.secant(req)


@router.post("/multiple-roots", response_model=MethodResult)
def multiple_roots(req: MultipleRootsRequest) -> MethodResult:
    return roots.multiple_roots(req)
