"""Request/response schemas for the numerical-method endpoints."""
from __future__ import annotations

from typing import Any

from pydantic import BaseModel, Field


# ----- Shared response shape -------------------------------------------------
class MethodResult(BaseModel):
    """Common envelope returned by every method endpoint.

    ``success`` tells the frontend whether a root/solution was found. When a
    method fails to converge or input is mathematically invalid, ``success`` is
    False and ``message`` explains why — mirroring the reference app, which
    shows messages like "the tolerance must be positive".
    """

    success: bool
    message: str = ""
    # Column headers for the iteration/step table.
    columns: list[str] = Field(default_factory=list)
    # Each row is a list of cell values aligned with ``columns``.
    rows: list[list[Any]] = Field(default_factory=list)
    # The headline answer (root, solution vector, polynomial, ...).
    result: Any | None = None


# ----- Equation roots --------------------------------------------------------
class RootRequest(BaseModel):
    function: str = Field(..., examples=["x^3 - x - 2"])
    tolerance: float = Field(1e-7, gt=0)
    max_iterations: int = Field(100, gt=0)


class IncrementalRequest(RootRequest):
    x0: float
    delta: float = Field(..., gt=0)


class BisectionRequest(RootRequest):
    a: float
    b: float


class FalsePositionRequest(BisectionRequest):
    pass


class FixedPointRequest(RootRequest):
    # g(x) iteration function.
    g_function: str
    x0: float


class NewtonRequest(RootRequest):
    x0: float


class SecantRequest(RootRequest):
    x0: float
    x1: float


class MultipleRootsRequest(RootRequest):
    x0: float


# ----- Linear systems --------------------------------------------------------
class LinearSystemRequest(BaseModel):
    matrix: list[list[float]] = Field(..., description="Coefficient matrix A")
    vector: list[float] = Field(..., description="Right-hand side vector b")


class IterativeSystemRequest(LinearSystemRequest):
    x0: list[float]
    tolerance: float = Field(1e-7, gt=0)
    max_iterations: int = Field(100, gt=0)


class SorRequest(IterativeSystemRequest):
    w: float = Field(..., gt=0, description="Relaxation factor")


# ----- Interpolation ---------------------------------------------------------
class InterpolationRequest(BaseModel):
    x: list[float] = Field(..., min_length=2)
    y: list[float] = Field(..., min_length=2)
