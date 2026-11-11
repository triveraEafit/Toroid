// Learn Center — matches the Figma "toroid-learn" docs layout: a sticky index
// sidebar plus documentation content describing each tool.
import { Link } from 'react-router-dom'
import './Learn.css'

interface ToolDoc {
  id: string
  name: string
  slug: string
  category: string
  lines: { label: string; text: string }[]
  note?: string
}

const TOOL_DOCS: { heading: string; tools: ToolDoc[] }[] = [
  {
    heading: '01 / Solving systems by graphing',
    tools: [
      {
        id: 'function-plotter', name: 'Function plotter', slug: 'function-plotter', category: 'graphing',
        lines: [
          { label: 'Purpose', text: 'Locate potential root-ranges and examine continuous behavioral slopes.' },
          { label: 'Required inputs', text: 'f(x) expression (string), viewport axis limits x-min, x-max.' },
          { label: 'Key idea', text: 'Render the continuous locus over discrete Cartesian step intervals.' },
        ],
        note: 'Useful for identifying discontinuities, asymptotic lines, and multiplicity peaks before executing targeted algorithms.',
      },
    ],
  },
  {
    heading: '02 / Solving equations of one variable',
    tools: [
      { id: 'function-evaluator', name: 'Function evaluator', slug: 'function-evaluator', category: 'equations',
        lines: [
          { label: 'Purpose', text: 'Obtain specific point values of continuous formulas directly without rendering full viewports.' },
          { label: 'Required inputs', text: 'f(x) string, point value of x.' },
        ] },
      { id: 'incremental', name: 'Incremental search', slug: 'incremental', category: 'equations',
        lines: [
          { label: 'Purpose', text: 'Locate bounding coordinate pairs where the curve passes across y = 0.' },
          { label: 'Required inputs', text: 'f(x), x-start, search step size, maximum iterations.' },
          { label: 'Key guidance', text: 'Use steps small enough to not leap over adjacent roots, but wide enough to keep performance over large boundaries.' },
        ] },
      { id: 'bisection', name: 'Bisection method', slug: 'bisection', category: 'equations',
        lines: [
          { label: 'Purpose', text: 'Rigorous, linear convergence over bounded intervals.' },
          { label: 'Sign-change condition', text: 'Requires f(a) × f(b) < 0 to satisfy Bolzano\u2019s Theorem.' },
          { label: 'Key idea', text: 'Midpoint xm = (a + b) / 2. Replace the boundary that preserves the sign change.' },
        ] },
      { id: 'false-position', name: 'False position', slug: 'false-position', category: 'equations',
        lines: [
          { label: 'Purpose', text: 'Locate roots by drawing secants across sign-change bounds.' },
          { label: 'Formula', text: 'xm = b - [f(b) × (b - a)] / [f(b) - f(a)].' },
        ] },
      { id: 'fixed-point', name: 'Fixed point iteration', slug: 'fixed-point', category: 'equations',
        lines: [
          { label: 'Purpose', text: 'Map iterations based on structural x = g(x) transitions.' },
          { label: 'Convergence condition', text: 'Requires |g\u2019(x)| < 1 across the neighborhood of the target coordinate.' },
        ] },
      { id: 'newton', name: 'Newton\u2013Raphson', slug: 'newton', category: 'equations',
        lines: [
          { label: 'Purpose', text: 'Rapid, quadratic convergence utilizing continuous local derivatives.' },
          { label: 'Formula', text: 'x_next = xi - f(xi) / f\u2019(xi).' },
          { label: 'Condition', text: 'The local derivative f\u2019(xi) must never resolve to 0. Flat slopes fail Newton-Raphson.' },
        ] },
      { id: 'secant', name: 'Secant method', slug: 'secant', category: 'equations',
        lines: [
          { label: 'Purpose', text: 'Avoid derivative equations by mapping discrete backward intervals.' },
          { label: 'Near-zero warning', text: 'Requires f(xi) - f(xi-1) ≠ 0, otherwise the denominator approaches zero.' },
        ] },
      { id: 'multiple-roots', name: 'Multiple roots', slug: 'multiple-roots', category: 'equations',
        lines: [
          { label: 'Purpose', text: 'Track structural polynomials with roots of high multiplicity.' },
          { label: 'Adapted Newton', text: 'x_next = xi - [ f(xi) × f\u2019(xi) ] / [ (f\u2019(xi))^2 - f(xi) × f\u2019\u2019(xi) ].' },
        ] },
    ],
  },
]

export function Learn() {
  return (
    <div className="learn container">
      <aside className="docs-sidebar">
        <p className="eyebrow">Documentation index</p>
        <nav className="docs-index">
          {TOOL_DOCS.map((group) => (
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
          <h1>Learn Center</h1>
          <p className="muted">
            Deconstruct numerical methodologies down to sequential steps. Learn structural
            assumptions, local conditions, and algebraic rules required to run simulations correctly.
          </p>
        </header>

        <section className="doc-overview">
          <h2>Connecting validated functions, numerical iterations, and Cartesian graphs</h2>
          <p className="muted">
            Toroid is structured around parallel representations of computational mathematics. When
            you evaluate an expression, the engine constructs an analytical representation of the
            function, generates sequential steps via the chosen iteration algorithm, prints the
            resulting error matrix table, and draws precise curves over coordinates. This parity
            makes validation and study immediate.
          </p>
        </section>

        {TOOL_DOCS.map((group) => (
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
                {t.note && <div className="tool-note">Note: {t.note}</div>}
                <Link className="tool-open" to={`/methods/${t.category}/${t.slug}`}>
                  Open playground →
                </Link>
              </article>
            ))}
          </section>
        ))}

        <section className="doc-tables">
          <h2>Interpreting convergence tables and error margins</h2>
          <p className="muted">
            Numerical results are only as valid as their margins of error. In the tabular previews,
            the absolute error E = |xi - xi-1| tracks step increments. When E &lt; Tolerance
            (typically 1e-6), the loop terminates and validates the root coordinate.
          </p>
        </section>
      </div>
    </div>
  )
}
