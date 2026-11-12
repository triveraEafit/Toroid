// Bundled copy of the backend /api/methods catalog, used as a fallback for
// navigation when the API has not responded yet. Kept in sync with
// backend/app/main.py:methods_catalog and the Figma design (2 categories,
// 9 tools).
import type { MethodsCatalog } from '../api/types'

export const FALLBACK_CATALOG: MethodsCatalog = {
  categories: [
    {
      key: 'graphing',
      index: '[01]',
      title: 'Solving systems by graphing',
      methods: [
        { slug: 'function-plotter', name: 'Function plotter', endpoint: '/api/graph/evaluate', kind: 'plotter', fields: ['function', 'x_min', 'x_max'] },
      ],
    },
    {
      key: 'equations',
      index: '[02]',
      title: 'Solving equations of one variable',
      methods: [
        { slug: 'function-evaluator', name: 'Function evaluator', endpoint: '/api/graph/evaluate-point', kind: 'evaluator', fields: ['function', 'x_point'] },
        { slug: 'incremental', name: 'Incremental search', endpoint: '/api/methods/roots/incremental', fields: ['function', 'x0', 'delta', 'max_iterations'] },
        { slug: 'bisection', name: 'Bisection', endpoint: '/api/methods/roots/bisection', fields: ['function', 'a', 'b', 'tolerance', 'max_iterations'] },
        { slug: 'false-position', name: 'False position', endpoint: '/api/methods/roots/false-position', fields: ['function', 'a', 'b', 'tolerance', 'max_iterations'] },
        { slug: 'fixed-point', name: 'Fixed point', endpoint: '/api/methods/roots/fixed-point', fields: ['function', 'g_function', 'x0', 'tolerance', 'max_iterations'] },
        { slug: 'newton', name: 'Newton-Raphson method', endpoint: '/api/methods/roots/newton', fields: ['function', 'x0', 'tolerance', 'max_iterations'] },
        { slug: 'secant', name: 'Secant method', endpoint: '/api/methods/roots/secant', fields: ['function', 'x0', 'x1', 'tolerance', 'max_iterations'] },
        { slug: 'multiple-roots', name: 'Multiple roots', endpoint: '/api/methods/roots/multiple-roots', fields: ['function', 'x0', 'tolerance', 'max_iterations'] },
      ],
    },
    {
      key: 'systems',
      index: '[03]',
      title: 'Solution of systems of equations',
      methods: [
        { slug: 'gaussian-simple', name: 'Gaussian elimination (simple)', endpoint: '/api/methods/systems/gaussian-simple', fields: ['matrix', 'vector'] },
        { slug: 'gaussian-partial', name: 'Gaussian elimination (partial pivot)', endpoint: '/api/methods/systems/gaussian-partial', fields: ['matrix', 'vector'] },
        { slug: 'gaussian-total', name: 'Gaussian elimination (total pivot)', endpoint: '/api/methods/systems/gaussian-total', fields: ['matrix', 'vector'] },
        { slug: 'lu-simple', name: 'Direct Factorization LU - simple', endpoint: '/api/methods/systems/lu-simple', fields: ['matrix', 'vector'] },
        { slug: 'lu-partial', name: 'Direct Factorization LU - partial', endpoint: '/api/methods/systems/lu-partial', fields: ['matrix', 'vector'] },
        { slug: 'crout', name: 'Crout', endpoint: '/api/methods/systems/crout', fields: ['matrix', 'vector'] },
        { slug: 'doolittle', name: 'Doolittle', endpoint: '/api/methods/systems/doolittle', fields: ['matrix', 'vector'] },
        { slug: 'cholesky', name: 'Cholesky', endpoint: '/api/methods/systems/cholesky', fields: ['matrix', 'vector'] },
        { slug: 'jacobi', name: 'Jacobi', endpoint: '/api/methods/systems/jacobi', fields: ['matrix', 'vector', 'x0_vec', 'tolerance', 'max_iterations'] },
        { slug: 'gauss-seidel', name: 'Gauss-Seidel', endpoint: '/api/methods/systems/gauss-seidel', fields: ['matrix', 'vector', 'x0_vec', 'tolerance', 'max_iterations'] },
        { slug: 'sor', name: 'SOR (relaxation)', endpoint: '/api/methods/systems/sor', fields: ['matrix', 'vector', 'x0_vec', 'w', 'tolerance', 'max_iterations'] },
      ],
    },
    {
      key: 'interpolation',
      index: '[04]',
      title: 'Interpolation',
      methods: [
        { slug: 'vandermonde', name: 'Vandermonde', endpoint: '/api/methods/interpolation/vandermonde', fields: ['x', 'y'] },
        { slug: 'newton', name: 'Newton (Divided difference method)', endpoint: '/api/methods/interpolation/newton', fields: ['x', 'y'] },
        { slug: 'lagrange', name: 'Lagrange', endpoint: '/api/methods/interpolation/lagrange', fields: ['x', 'y'] },
        { slug: 'spline-linear', name: 'Spline (linear)', endpoint: '/api/methods/interpolation/spline-linear', fields: ['x', 'y'] },
        { slug: 'spline-quadratic', name: 'Spline (quadratic)', endpoint: '/api/methods/interpolation/spline-quadratic', fields: ['x', 'y'] },
        { slug: 'spline-cubic', name: 'Spline (cubic)', endpoint: '/api/methods/interpolation/spline-cubic', fields: ['x', 'y'] },
      ],
    },
  ],
}
