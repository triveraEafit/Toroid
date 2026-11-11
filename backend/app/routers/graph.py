"""Function evaluation endpoint for the Graph page / function evaluator."""
from fastapi import APIRouter
from pydantic import BaseModel, Field

from ..core.evaluator import ExpressionError, compile_function

router = APIRouter(prefix="/api/graph", tags=["graph"])


class EvaluateRequest(BaseModel):
    function: str = Field(..., examples=["sin(x)"])
    x_min: float = -10
    x_max: float = 10
    points: int = Field(200, gt=1, le=5000)


class PointEvalRequest(BaseModel):
    """Function evaluator: value of f(x) at a single point."""
    function: str = Field(..., examples=["x^2 - 3"])
    x: float


class PointEvalResponse(BaseModel):
    success: bool
    message: str = ""
    value: float | None = None


class Point(BaseModel):
    x: float
    y: float | None


class EvaluateResponse(BaseModel):
    success: bool
    message: str = ""
    points: list[Point] = []


@router.post("/evaluate", response_model=EvaluateResponse)
def evaluate(req: EvaluateRequest) -> EvaluateResponse:
    try:
        f = compile_function(req.function)
    except ExpressionError as exc:
        return EvaluateResponse(success=False, message=str(exc))

    if req.x_max <= req.x_min:
        return EvaluateResponse(success=False, message="x_max must be greater than x_min")

    step = (req.x_max - req.x_min) / (req.points - 1)
    pts: list[Point] = []
    for i in range(req.points):
        x = req.x_min + i * step
        try:
            y = f(x)
            if y != y or y in (float("inf"), float("-inf")):  # NaN/inf guard
                y = None
        except (ArithmeticError, ValueError):
            y = None  # discontinuity / out of domain
        pts.append(Point(x=x, y=y))
    return EvaluateResponse(success=True, points=pts)


@router.post("/evaluate-point", response_model=PointEvalResponse)
def evaluate_point(req: PointEvalRequest) -> PointEvalResponse:
    """Evaluate f(x) at a single point (the design's 'Function evaluator')."""
    try:
        f = compile_function(req.function)
    except ExpressionError as exc:
        return PointEvalResponse(success=False, message=str(exc))
    try:
        value = f(req.x)
    except (ArithmeticError, ValueError) as exc:
        return PointEvalResponse(success=False, message=f"Could not evaluate: {exc}")
    if value != value or value in (float("inf"), float("-inf")):
        return PointEvalResponse(success=False, message="The result is undefined at this point")
    return PointEvalResponse(success=True, value=value)
