import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

export type Language = 'es' | 'en'

type TranslationKey =
  | 'nav.home' | 'nav.methods' | 'nav.learn' | 'nav.help'
  | 'nav.menu' | 'nav.language' | 'nav.homeAria'
  | 'home.eyebrow' | 'home.title' | 'home.subtitle' | 'home.methods' | 'home.docs'
  | 'home.loading' | 'home.methodology' | 'home.editorialTitle' | 'home.editorialText'
  | 'home.rootTitle' | 'home.rootText' | 'home.errorTitle' | 'home.errorText'
  | 'home.sandbox' | 'home.parity' | 'home.parityText' | 'home.learnEyebrow'
  | 'home.learnTitle' | 'home.learnText' | 'home.learnCta'
  | 'methods.title' | 'methods.description' | 'methods.callout' | 'methods.learn'
  | 'method.back' | 'method.inputs' | 'method.result' | 'method.empty'
  | 'method.notFound' | 'method.pick' | 'method.plot' | 'method.evaluate'
  | 'method.calculate' | 'method.value' | 'method.requestFailed'
  | 'field.function' | 'field.functionHelp' | 'field.g_function' | 'field.x_min'
  | 'field.x_max' | 'field.x_point' | 'field.x0' | 'field.x1' | 'field.a'
  | 'field.b' | 'field.delta' | 'field.w' | 'field.tolerance' | 'field.max_iterations'
  | 'field.error_type' | 'field.matrix' | 'field.vector' | 'field.x0_vec'
  | 'field.x' | 'field.y' | 'field.absolute' | 'field.relative' | 'field.calculate'
  | 'field.calculating' | 'matrix.size' | 'matrix.square'
  | 'catalog.graphing' | 'catalog.equations' | 'catalog.systems' | 'catalog.interpolation'
  | 'catalog.function-plotter' | 'catalog.function-evaluator' | 'catalog.incremental'
  | 'catalog.bisection' | 'catalog.false-position' | 'catalog.fixed-point'
  | 'catalog.newton' | 'catalog.secant' | 'catalog.multiple-roots'
  | 'catalog.gaussian-simple' | 'catalog.gaussian-partial' | 'catalog.gaussian-total'
  | 'catalog.lu-simple' | 'catalog.lu-partial' | 'catalog.crout' | 'catalog.doolittle'
  | 'catalog.cholesky' | 'catalog.jacobi' | 'catalog.gauss-seidel' | 'catalog.sor'
  | 'catalog.vandermonde' | 'catalog.lagrange' | 'catalog.spline-linear'
  | 'catalog.spline-quadratic' | 'catalog.spline-cubic'

const translations: Record<Language, Record<TranslationKey, string>> = {
  es: {
    'nav.home': 'Inicio', 'nav.methods': 'Métodos', 'nav.learn': 'Aprender', 'nav.help': 'Ayuda',
    'nav.menu': 'Abrir menú', 'nav.language': 'Idioma', 'nav.homeAria': 'Ir al inicio',
    'home.eyebrow': 'Calculadora visual para análisis', 'home.title': 'De funciones a aproximaciones numéricas',
    'home.subtitle': 'Un espacio de trabajo moderno para graficar progresiones de búsqueda de raíces, límites de integrales y coordenadas de interpolación. Mapea algoritmos clásicos instantáneamente sobre vistas cartesianas precisas.',
    'home.methods': 'Explorar métodos', 'home.docs': 'Leer documentación', 'home.loading': 'Cargando gráfica…',
    'home.methodology': 'Metodología algorítmica', 'home.editorialTitle': 'Conectando el cálculo puro con máquinas discretas',
    'home.editorialText': 'En matemáticas, las soluciones analíticas pueden ser poco comunes o imposibles. Los métodos numéricos ofrecen un compromiso práctico, convirtiendo límites infinitos en pasos finitos y secuenciales que los computadores pueden recorrer. Toroid construye ese puente computacional para el estudio y la validación.',
    'home.rootTitle': 'Algoritmos de aislamiento de raíces', 'home.rootText': 'Descompón métodos como Bisección, Secante y Newton-Raphson. Observa los criterios exactos que determinan las velocidades de convergencia lineal y cuadrática.',
    'home.errorTitle': 'Seguimiento de convergencia y error', 'home.errorText': 'Sigue la aproximación y el error absoluto de cada iteración hasta que el umbral de tolerancia valide una raíz.',
    'home.sandbox': 'Vista previa del área de resultados', 'home.parity': 'Paridad visual y numérica instantánea',
    'home.parityText': 'Observa cómo las iteraciones computacionales se mapean junto a las coordenadas. Sin demoras ni suposiciones.',
    'home.learnEyebrow': 'Base teórica completa', 'home.learnTitle': 'Profundiza en la teoría de cada método en nuestro centro de aprendizaje',
    'home.learnText': 'Domina las series de Taylor, la convergencia local y global, y los límites de cada paso antes de analizar. Nuestro currículo está diseñado para cursos universitarios de matemáticas.',
    'home.learnCta': 'Explorar centro de aprendizaje',
    'methods.title': 'Métodos', 'methods.description': 'Selecciona entre {total} herramientas matemáticas diseñadas para analizar funciones, localizar raíces y visualizar iteraciones. Usa el directorio para cargar cualquier algoritmo directamente en el área de simulación.',
    'methods.callout': '¿Necesitas repasar los límites de convergencia local y global o el criterio de bisección?', 'methods.learn': 'Explora las demostraciones rigurosas en nuestro centro de aprendizaje.',
    'method.back': '← Todos los métodos', 'method.inputs': 'Entradas', 'method.result': 'Resultado',
    'method.empty': 'Ingresa los parámetros y ejecuta la herramienta para ver el resultado.', 'method.notFound': 'Herramienta no encontrada',
    'method.pick': 'Selecciona una herramienta del directorio de métodos.', 'method.plot': 'Graficar',
    'method.evaluate': 'Evaluar', 'method.calculate': 'Calcular', 'method.value': 'Valor', 'method.requestFailed': 'La solicitud falló',
    'field.function': 'Función f(x)', 'field.functionHelp': 'Usa ^ para potencias, por ejemplo x^3 - x - 2. Funciones: sin, cos, exp, ln, sqrt.',
    'field.g_function': 'Función de iteración g(x)', 'field.x_min': 'x mínimo', 'field.x_max': 'x máximo',
    'field.x_point': 'Evaluar en x', 'field.x0': 'Valor inicial x0', 'field.x1': 'Segundo valor x1',
    'field.a': 'Límite inferior a', 'field.b': 'Límite superior b', 'field.delta': 'Tamaño del paso (delta)',
    'field.w': 'Factor de relajación w', 'field.tolerance': 'Tolerancia', 'field.max_iterations': 'Máximo de iteraciones',
    'field.error_type': 'Tipo de error', 'field.matrix': 'Matriz de coeficientes A', 'field.vector': 'Vector b',
    'field.x0_vec': 'Vector inicial x0', 'field.x': 'Valores de x', 'field.y': 'Valores de y',
    'field.absolute': 'Absoluto', 'field.relative': 'Relativo', 'field.calculate': 'Calcular', 'field.calculating': 'Calculando…',
    'matrix.size': 'Tamaño', 'matrix.square': '(cuadrada {rows}×{cols})',
    'catalog.graphing': 'Solución de sistemas por gráfica', 'catalog.equations': 'Solución de ecuaciones de una variable',
    'catalog.systems': 'Solución de sistemas de ecuaciones', 'catalog.interpolation': 'Interpolación',
    'catalog.function-plotter': 'Graficador de funciones', 'catalog.function-evaluator': 'Evaluador de funciones',
    'catalog.incremental': 'Búsqueda incremental', 'catalog.bisection': 'Bisección', 'catalog.false-position': 'Regla falsa',
    'catalog.fixed-point': 'Punto fijo', 'catalog.newton': 'Método de Newton-Raphson', 'catalog.secant': 'Método de la secante',
    'catalog.multiple-roots': 'Raíces múltiples', 'catalog.gaussian-simple': 'Eliminación gaussiana (simple)',
    'catalog.gaussian-partial': 'Eliminación gaussiana (pivoteo parcial)', 'catalog.gaussian-total': 'Eliminación gaussiana (pivoteo total)',
    'catalog.lu-simple': 'Factorización LU directa - simple', 'catalog.lu-partial': 'Factorización LU directa - parcial',
    'catalog.crout': 'Crout', 'catalog.doolittle': 'Doolittle', 'catalog.cholesky': 'Cholesky', 'catalog.jacobi': 'Jacobi',
    'catalog.gauss-seidel': 'Gauss-Seidel', 'catalog.sor': 'SOR (relajación)', 'catalog.vandermonde': 'Vandermonde',
    'catalog.lagrange': 'Lagrange', 'catalog.spline-linear': 'Spline (lineal)', 'catalog.spline-quadratic': 'Spline (cuadrático)',
    'catalog.spline-cubic': 'Spline (cúbico)',
  },
  en: {
    'nav.home': 'Home', 'nav.methods': 'Methods', 'nav.learn': 'Learn', 'nav.help': 'Help',
    'nav.menu': 'Open menu', 'nav.language': 'Language', 'nav.homeAria': 'Go to home',
    'home.eyebrow': 'Visual calculator for analysis', 'home.title': 'From functions to numerical approximations',
    'home.subtitle': 'A modern workspace dedicated to plotting root-finding progressions, integral limits, and interpolation coordinates. Map classic algorithms instantly onto precise Cartesian viewports.',
    'home.methods': 'Explore Methods', 'home.docs': 'Read Docs', 'home.loading': 'Loading plot…',
    'home.methodology': 'Algorithmic methodology', 'home.editorialTitle': 'Bridging pure calculus with discrete machines',
    'home.editorialText': 'In mathematics, analytical solutions can be rare or impossible. Numerical methods offer a practical compromise, converting infinite limits into finite, sequential steps that computers can trace. Toroid builds the computational bridge for study and validation.',
    'home.rootTitle': 'Root Isolation Algorithms', 'home.rootText': 'Deconstruct methods like Bisection, Secant, and Newton-Raphson. Witness the exact criteria that dictate linear versus quadratic convergence speeds in direct viewports.',
    'home.errorTitle': 'Convergence & Error Tracking', 'home.errorText': 'Follow each iteration’s approximation and absolute error until the tolerance threshold validates a root.',
    'home.sandbox': 'Live output sandbox preview', 'home.parity': 'Instant visual & numerical parity',
    'home.parityText': 'Watch computational iteration stacks map dynamically alongside coordinates. No delay, no guesswork.',
    'home.learnEyebrow': 'Comprehensive theory base', 'home.learnTitle': 'Dive into detailed method theory inside our Learn Center',
    'home.learnText': 'Master Taylor series expansions, local versus global convergence proofs, and step boundaries before you analyze. Our structured curriculum is built specifically for university mathematics courses.',
    'home.learnCta': 'Explore Learn Hub',
    'methods.title': 'Methods', 'methods.description': 'Select from {total} mathematical tools designed to analyze functions, locate roots, and map iteration grids. Use the unified directory below to load any algorithm directly into the simulation sandbox.',
    'methods.callout': 'Need a refresher on local versus global convergence limits or the bisection criteria?', 'methods.learn': 'Explore the rigorous proofs inside our Learn Hub.',
    'method.back': '← All methods', 'method.inputs': 'Inputs', 'method.result': 'Result',
    'method.empty': 'Enter parameters and run the tool to see the output.', 'method.notFound': 'Tool not found',
    'method.pick': 'Pick a tool from the Methods directory.', 'method.plot': 'Plot', 'method.evaluate': 'Evaluate',
    'method.calculate': 'Calculate', 'method.value': 'Value', 'method.requestFailed': 'Request failed',
    'field.function': 'Function f(x)', 'field.functionHelp': 'Use ^ for powers, e.g. x^3 - x - 2. Functions: sin, cos, exp, ln, sqrt.',
    'field.g_function': 'Iteration function g(x)', 'field.x_min': 'x min', 'field.x_max': 'x max', 'field.x_point': 'Evaluate at x',
    'field.x0': 'Initial value x0', 'field.x1': 'Second value x1', 'field.a': 'Lower bound a', 'field.b': 'Upper bound b',
    'field.delta': 'Step size (delta)', 'field.w': 'Relaxation factor w', 'field.tolerance': 'Tolerance',
    'field.max_iterations': 'Max iterations', 'field.error_type': 'Error type', 'field.matrix': 'Coefficient matrix A',
    'field.vector': 'Vector b', 'field.x0_vec': 'Initial vector x0', 'field.x': 'x values', 'field.y': 'y values',
    'field.absolute': 'Absolute', 'field.relative': 'Relative', 'field.calculate': 'Calculate', 'field.calculating': 'Calculating…',
    'matrix.size': 'Size', 'matrix.square': '(square {rows}×{cols})',
    'catalog.graphing': 'Solving systems by graphing', 'catalog.equations': 'Solving equations of one variable',
    'catalog.systems': 'Solution of systems of equations', 'catalog.interpolation': 'Interpolation',
    'catalog.function-plotter': 'Function plotter', 'catalog.function-evaluator': 'Function evaluator', 'catalog.incremental': 'Incremental search',
    'catalog.bisection': 'Bisection', 'catalog.false-position': 'False position', 'catalog.fixed-point': 'Fixed point',
    'catalog.newton': 'Newton-Raphson method', 'catalog.secant': 'Secant method', 'catalog.multiple-roots': 'Multiple roots',
    'catalog.gaussian-simple': 'Gaussian elimination (simple)', 'catalog.gaussian-partial': 'Gaussian elimination (partial pivot)',
    'catalog.gaussian-total': 'Gaussian elimination (total pivot)', 'catalog.lu-simple': 'Direct Factorization LU - simple',
    'catalog.lu-partial': 'Direct Factorization LU - partial', 'catalog.crout': 'Crout', 'catalog.doolittle': 'Doolittle',
    'catalog.cholesky': 'Cholesky', 'catalog.jacobi': 'Jacobi', 'catalog.gauss-seidel': 'Gauss-Seidel', 'catalog.sor': 'SOR (relaxation)',
    'catalog.vandermonde': 'Vandermonde', 'catalog.lagrange': 'Lagrange', 'catalog.spline-linear': 'Spline (linear)',
    'catalog.spline-quadratic': 'Spline (quadratic)', 'catalog.spline-cubic': 'Spline (cubic)',
  },
}

interface LanguageContextValue {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: TranslationKey, variables?: Record<string, string | number>) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem('toroid-language')
    return stored === 'en' ? 'en' : 'es'
  })

  const value = useMemo<LanguageContextValue>(() => ({
    language,
    setLanguage: (next) => {
      localStorage.setItem('toroid-language', next)
      setLanguage(next)
    },
    t: (key, variables) => {
      let text = translations[language][key]
      for (const [name, replacement] of Object.entries(variables ?? {})) {
        text = text.replace(`{${name}}`, String(replacement))
      }
      return text
    },
  }), [language])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used within LanguageProvider')
  return context
}
