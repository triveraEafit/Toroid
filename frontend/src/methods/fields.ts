// Metadata describing every input field a method form can render.
// Keeps the reusable MethodForm generic: each method declares its field keys
// (from the backend catalog) and this map supplies the label, input type and
// default value.

export type FieldKind = 'text' | 'number' | 'select' | 'matrix' | 'vector' | 'points'

export interface FieldSpec {
  key: string
  label: string
  kind: FieldKind
  default: unknown
  help?: string
  options?: { value: string; label: string }[]
  step?: string
}

export const FIELD_SPECS: Record<string, FieldSpec> = {
  function: { key: 'function', label: 'Function f(x)', kind: 'text', default: 'x^2 - 2', help: 'Use ^ for powers, e.g. x^3 - x - 2. Functions: sin, cos, exp, ln, sqrt.' },
  g_function: { key: 'g_function', label: 'Iteration function g(x)', kind: 'text', default: '(x + 2/x)/2' },
  x_min: { key: 'x_min', label: 'x min', kind: 'number', default: -10, step: 'any' },
  x_max: { key: 'x_max', label: 'x max', kind: 'number', default: 10, step: 'any' },
  x_point: { key: 'x', label: 'Evaluate at x', kind: 'number', default: 1, step: 'any' },
  x0: { key: 'x0', label: 'Initial value x0', kind: 'number', default: 1 },
  x1: { key: 'x1', label: 'Second value x1', kind: 'number', default: 2 },
  a: { key: 'a', label: 'Lower bound a', kind: 'number', default: 0 },
  b: { key: 'b', label: 'Upper bound b', kind: 'number', default: 2 },
  delta: { key: 'delta', label: 'Step size (delta)', kind: 'number', default: 0.5, step: 'any' },
  w: { key: 'w', label: 'Relaxation factor w', kind: 'number', default: 1.1, step: 'any' },
  tolerance: { key: 'tolerance', label: 'Tolerance', kind: 'number', default: 1e-7, step: 'any' },
  max_iterations: { key: 'max_iterations', label: 'Max iterations', kind: 'number', default: 100 },
  error_type: {
    key: 'error_type', label: 'Error type', kind: 'select', default: 'absolute',
    options: [
      { value: 'absolute', label: 'Absolute' },
      { value: 'relative', label: 'Relative' },
    ],
  },
  matrix: { key: 'matrix', label: 'Coefficient matrix A', kind: 'matrix', default: [[4, -1, 0], [-1, 4, -1], [0, -1, 4]] },
  vector: { key: 'vector', label: 'Vector b', kind: 'vector', default: [2, 4, 10] },
  points_x: { key: 'x', label: 'x values', kind: 'points', default: [0, 1, 2, 3] },
  x: { key: 'x', label: 'x values', kind: 'vector', default: [0, 1, 2, 3] },
  y: { key: 'y', label: 'y values', kind: 'vector', default: [0, 1, 4, 9] },
}

export function specFor(key: string): FieldSpec {
  return FIELD_SPECS[key] ?? { key, label: key, kind: 'text', default: '' }
}
