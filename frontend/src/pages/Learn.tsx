// Learn Center — matches the Figma "toroid-learn" docs layout: a sticky index
// sidebar plus documentation content describing each tool.
import { Link } from 'react-router-dom'
import './Learn.css'
import { useLanguage, type Language } from '../i18n'

interface ToolDoc {
  id: string
  name: string
  slug: string
  category: string
  lines: { label: string; text: string }[]
  note?: string
}

const TOOL_DOCS: Record<Language, { heading: string; tools: ToolDoc[] }[]> = {
  es: [
  {
    heading: '01 / Solución de sistemas por gráfica',
    tools: [
      {
        id: 'function-plotter', name: 'Graficador de funciones', slug: 'function-plotter', category: 'graphing',
        lines: [
          { label: 'Propósito', text: 'Localiza rangos potenciales de raíces y examina el comportamiento continuo de las pendientes.' },
          { label: 'Entradas requeridas', text: 'Expresión f(x) (texto), límites de los ejes x mínimo y x máximo.' },
          { label: 'Idea clave', text: 'Renderiza el lugar geométrico continuo sobre intervalos cartesianos discretos.' },
        ],
        note: 'Es útil para identificar discontinuidades, asíntotas y picos de multiplicidad antes de ejecutar algoritmos específicos.',
      },
    ],
  },
  {
    heading: '02 / Solución de ecuaciones de una variable',
    tools: [
      { id: 'function-evaluator', name: 'Evaluador de funciones', slug: 'function-evaluator', category: 'equations',
        lines: [
          { label: 'Propósito', text: 'Obtén valores puntuales de fórmulas continuas sin renderizar una vista completa.' },
          { label: 'Entradas requeridas', text: 'Texto de f(x) y valor puntual de x.' },
        ] },
      { id: 'incremental', name: 'Búsqueda incremental', slug: 'incremental', category: 'equations',
        lines: [
          { label: 'Propósito', text: 'Localiza pares de coordenadas límite donde la curva cruza y = 0.' },
          { label: 'Entradas requeridas', text: 'f(x), x inicial, tamaño del paso y máximo de iteraciones.' },
          { label: 'Guía clave', text: 'Usa pasos suficientemente pequeños para no saltar raíces cercanas, pero lo bastante amplios para conservar el rendimiento.' },
        ] },
      { id: 'bisection', name: 'Método de bisección', slug: 'bisection', category: 'equations',
        lines: [
          { label: 'Propósito', text: 'Convergencia lineal rigurosa sobre intervalos acotados.' },
          { label: 'Condición de cambio de signo', text: 'Requiere f(a) × f(b) < 0 para cumplir el teorema de Bolzano.' },
          { label: 'Idea clave', text: 'Punto medio xm = (a + b) / 2. Reemplaza el límite que conserva el cambio de signo.' },
        ] },
      { id: 'false-position', name: 'Regla falsa', slug: 'false-position', category: 'equations',
        lines: [
          { label: 'Propósito', text: 'Localiza raíces trazando secantes entre límites con cambio de signo.' },
          { label: 'Fórmula', text: 'xm = b - [f(b) × (b - a)] / [f(b) - f(a)].' },
        ] },
      { id: 'fixed-point', name: 'Iteración de punto fijo', slug: 'fixed-point', category: 'equations',
        lines: [
          { label: 'Propósito', text: 'Mapea iteraciones basadas en transiciones estructurales x = g(x).' },
          { label: 'Condición de convergencia', text: 'Requiere |g\u2019(x)| < 1 en el entorno de la coordenada objetivo.' },
        ] },
      { id: 'newton', name: 'Newton–Raphson', slug: 'newton', category: 'equations',
        lines: [
          { label: 'Propósito', text: 'Convergencia cuadrática rápida mediante derivadas locales continuas.' },
          { label: 'Fórmula', text: 'x_next = xi - f(xi) / f\u2019(xi).' },
          { label: 'Condición', text: 'La derivada local f\u2019(xi) nunca debe ser 0. Las pendientes planas hacen fallar Newton-Raphson.' },
        ] },
      { id: 'secant', name: 'Método de la secante', slug: 'secant', category: 'equations',
        lines: [
          { label: 'Propósito', text: 'Evita las ecuaciones de derivadas usando intervalos discretos anteriores.' },
          { label: 'Advertencia de valor cercano a cero', text: 'Requiere f(xi) - f(xi-1) ≠ 0; de lo contrario, el denominador se acerca a cero.' },
        ] },
      { id: 'multiple-roots', name: 'Raíces múltiples', slug: 'multiple-roots', category: 'equations',
        lines: [
          { label: 'Propósito', text: 'Analiza polinomios con raíces de multiplicidad alta.' },
          { label: 'Newton adaptado', text: 'x_next = xi - [ f(xi) × f\u2019(xi) ] / [ (f\u2019(xi))^2 - f(xi) × f\u2019\u2019(xi) ].' },
        ] },
    ],
  },
  ],
  en: [
    {
      heading: '01 / Solving systems by graphing',
      tools: [{
        id: 'function-plotter', name: 'Function plotter', slug: 'function-plotter', category: 'graphing',
        lines: [
          { label: 'Purpose', text: 'Locate potential root ranges and examine continuous behavioral slopes.' },
          { label: 'Required inputs', text: 'f(x) expression, viewport axis limits x-min and x-max.' },
          { label: 'Key idea', text: 'Render the continuous locus over discrete Cartesian step intervals.' },
        ],
        note: 'Useful for identifying discontinuities, asymptotic lines, and multiplicity peaks before executing targeted algorithms.',
      }],
    },
    {
      heading: '02 / Solving equations of one variable',
      tools: [
        { id: 'function-evaluator', name: 'Function evaluator', slug: 'function-evaluator', category: 'equations', lines: [{ label: 'Purpose', text: 'Obtain point values of continuous formulas without rendering full viewports.' }, { label: 'Required inputs', text: 'f(x) string and point value of x.' }] },
        { id: 'incremental', name: 'Incremental search', slug: 'incremental', category: 'equations', lines: [{ label: 'Purpose', text: 'Locate bounding coordinate pairs where the curve crosses y = 0.' }, { label: 'Required inputs', text: 'f(x), x-start, search step size, and maximum iterations.' }] },
        { id: 'bisection', name: 'Bisection method', slug: 'bisection', category: 'equations', lines: [{ label: 'Purpose', text: 'Rigorous, linear convergence over bounded intervals.' }, { label: 'Sign-change condition', text: 'Requires f(a) × f(b) < 0 to satisfy Bolzano’s Theorem.' }, { label: 'Key idea', text: 'Midpoint xm = (a + b) / 2. Replace the boundary that preserves the sign change.' }] },
        { id: 'false-position', name: 'False position', slug: 'false-position', category: 'equations', lines: [{ label: 'Purpose', text: 'Locate roots by drawing secants across sign-change bounds.' }, { label: 'Formula', text: 'xm = b - [f(b) × (b - a)] / [f(b) - f(a)].' }] },
        { id: 'fixed-point', name: 'Fixed point iteration', slug: 'fixed-point', category: 'equations', lines: [{ label: 'Purpose', text: 'Map iterations based on structural x = g(x) transitions.' }, { label: 'Convergence condition', text: 'Requires |g’(x)| < 1 around the target coordinate.' }] },
        { id: 'newton', name: 'Newton–Raphson', slug: 'newton', category: 'equations', lines: [{ label: 'Purpose', text: 'Rapid, quadratic convergence using continuous local derivatives.' }, { label: 'Formula', text: 'x_next = xi - f(xi) / f’(xi).' }, { label: 'Condition', text: 'The local derivative f’(xi) must never resolve to 0.' }] },
        { id: 'secant', name: 'Secant method', slug: 'secant', category: 'equations', lines: [{ label: 'Purpose', text: 'Avoid derivative equations by mapping discrete backward intervals.' }, { label: 'Near-zero warning', text: 'Requires f(xi) - f(xi-1) ≠ 0, otherwise the denominator approaches zero.' }] },
        { id: 'multiple-roots', name: 'Multiple roots', slug: 'multiple-roots', category: 'equations', lines: [{ label: 'Purpose', text: 'Track polynomials with roots of high multiplicity.' }, { label: 'Adapted Newton', text: 'x_next = xi - [ f(xi) × f’(xi) ] / [ (f’(xi))^2 - f(xi) × f’’(xi) ].' }] },
      ],
    },
  ],
}

export function Learn() {
  const { language } = useLanguage()
  const toolDocs = TOOL_DOCS[language]
  return (
    <div className="learn container">
      <aside className="docs-sidebar">
        <p className="eyebrow">{language === 'es' ? 'Índice de documentación' : 'Documentation index'}</p>
        <nav className="docs-index">
          {toolDocs.map((group) => (
            <div key={group.heading}>
              <span className="docs-index-head">{group.heading}</span>
              {group.tools.map((t) => (
                <a key={t.id} href={`#${t.id}`}>• {t.name}</a>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      <div className="docs-content">
        <header className="doc-header">
          <h1>{language === 'es' ? 'Centro de aprendizaje' : 'Learn Center'}</h1>
          <p className="muted">
            {language === 'es'
              ? 'Descompón las metodologías numéricas en pasos secuenciales. Aprende los supuestos estructurales, las condiciones locales y las reglas algebraicas necesarias para ejecutar simulaciones correctamente.'
              : 'Deconstruct numerical methodologies down to sequential steps. Learn structural assumptions, local conditions, and algebraic rules required to run simulations correctly.'}
          </p>
        </header>

        <section className="doc-overview">
          <h2>{language === 'es' ? 'Conectando funciones validadas, iteraciones numéricas y gráficas cartesianas' : 'Connecting validated functions, numerical iterations, and Cartesian graphs'}</h2>
          <p className="muted">
            {language === 'es'
              ? 'Toroid se estructura alrededor de representaciones paralelas de las matemáticas computacionales. Al evaluar una expresión, el motor construye una representación analítica de la función, genera pasos secuenciales mediante el algoritmo elegido, imprime la tabla de errores y dibuja curvas precisas sobre las coordenadas. Esta paridad hace inmediata la validación y el estudio.'
              : 'Toroid is structured around parallel representations of computational mathematics. When you evaluate an expression, the engine constructs an analytical representation of the function, generates sequential steps via the chosen iteration algorithm, prints the resulting error matrix table, and draws precise curves over coordinates. This parity makes validation and study immediate.'}
          </p>
        </section>

        {toolDocs.map((group) => (
          <section className="doc-category" key={group.heading}>
            <h2 className="doc-category-title">{group.heading}</h2>
            {group.tools.map((t) => (
              <article className="tool-doc" id={t.id} key={t.id}>
                <h3>{t.name}</h3>
                {t.lines.map((l) => (
                  <p key={l.label} className="tool-line">
                    <strong>{l.label}:</strong> {l.text}
                  </p>
                ))}
                {t.note && <div className="tool-note">{language === 'es' ? 'Nota' : 'Note'}: {t.note}</div>}
                <Link className="tool-open" to={`/methods/${t.category}/${t.slug}`}>
                  {language === 'es' ? 'Abrir área de práctica' : 'Open playground'} →
                </Link>
              </article>
            ))}
          </section>
        ))}

        <section className="doc-tables">
          <h2>{language === 'es' ? 'Interpretando tablas de convergencia y márgenes de error' : 'Interpreting convergence tables and error margins'}</h2>
          <p className="muted">
            {language === 'es'
              ? 'Los resultados numéricos son tan válidos como sus márgenes de error. En las vistas tabulares, el error absoluto E = |xi - xi-1| registra los incrementos de cada paso. Cuando E &lt; Tolerancia (normalmente 1e-6), el ciclo termina y valida la coordenada de la raíz.'
              : 'Numerical results are only as valid as their margins of error. In the tabular previews, the absolute error E = |xi - xi-1| tracks step increments. When E &lt; Tolerance (typically 1e-6), the loop terminates and validates the root coordinate.'}
          </p>
        </section>
      </div>
    </div>
  )
}
