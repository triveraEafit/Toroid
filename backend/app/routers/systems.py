"""Linear-system method endpoints."""
from fastapi import APIRouter

from ..methods import systems
from ..schemas.methods import (
    IterativeSystemRequest,
    LinearSystemRequest,
    MethodResult,
    SorRequest,
)

router = APIRouter(prefix="/api/methods/systems", tags=["systems"])


@router.post("/gaussian-simple", response_model=MethodResult)
def gaussian_simple(req: LinearSystemRequest) -> MethodResult:
    return systems.gaussian_simple(req)


@router.post("/gaussian-partial", response_model=MethodResult)
def gaussian_partial(req: LinearSystemRequest) -> MethodResult:
    return systems.gaussian_partial(req)


@router.post("/gaussian-total", response_model=MethodResult)
def gaussian_total(req: LinearSystemRequest) -> MethodResult:
    return systems.gaussian_total(req)


@router.post("/lu-simple", response_model=MethodResult)
def lu_simple(req: LinearSystemRequest) -> MethodResult:
    return systems.lu_doolittle(req)


@router.post("/lu-partial", response_model=MethodResult)
def lu_partial(req: LinearSystemRequest) -> MethodResult:
    return systems.lu_partial(req)


@router.post("/crout", response_model=MethodResult)
def crout(req: LinearSystemRequest) -> MethodResult:
    return systems.lu_crout(req)


@router.post("/doolittle", response_model=MethodResult)
def doolittle(req: LinearSystemRequest) -> MethodResult:
    return systems.lu_doolittle(req)


@router.post("/cholesky", response_model=MethodResult)
def cholesky(req: LinearSystemRequest) -> MethodResult:
    return systems.cholesky(req)


@router.post("/jacobi", response_model=MethodResult)
def jacobi(req: IterativeSystemRequest) -> MethodResult:
    return systems.jacobi(req)


@router.post("/gauss-seidel", response_model=MethodResult)
def gauss_seidel(req: IterativeSystemRequest) -> MethodResult:
    return systems.gauss_seidel(req)


@router.post("/sor", response_model=MethodResult)
def sor(req: SorRequest) -> MethodResult:
    return systems.sor(req)
