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
        { slug: 'bisection', name: 'Bisection', endpoint: '/api/methods/roots/bisection', fields: ['function', 'a', 'b', 'tolerance', 'max_iterations', 'error_type'] },
        { slug: 'false-position', name: 'False position', endpoint: '/api/methods/roots/false-position', fields: ['function', 'a', 'b', 'tolerance', 'max_iterations', 'error_type'] },
        { slug: 'fixed-point', name: 'Fixed point', endpoint: '/api/methods/roots/fixed-point', fields: ['function', 'g_function', 'x0', 'tolerance', 'max_iterations', 'error_type'] },
        { slug: 'newton', name: 'Newton-Raphson method', endpoint: '/api/methods/roots/newton', fields: ['function', 'x0', 'tolerance', 'max_iterations', 'error_type'] },
        { slug: 'secant', name: 'Secant method', endpoint: '/api/methods/roots/secant', fields: ['function', 'x0', 'x1', 'tolerance', 'max_iterations', 'error_type'] },
        { slug: 'multiple-roots', name: 'Multiple roots', endpoint: '/api/methods/roots/multiple-roots', fields: ['function', 'x0', 'tolerance', 'max_iterations', 'error_type'] },
      ],
    },
  ],
}
