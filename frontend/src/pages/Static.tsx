// Help and About pages reproducing the Figma content (no invented features).
import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Static.css'

const SYNTAX = [
  { op: 'Exponentiation', syntax: 'x^2, x^3', example: 'x^2 - 4x + 4' },
  { op: 'Trigonometric', syntax: 'sin(x), cos(x)', example: 'sin(x) - exp(x)' },
  { op: 'Logarithmic', syntax: 'log(x), log10(x)', example: 'log(x - 1) + 2' },
  { op: 'Square Root', syntax: 'sqrt(x)', example: 'sqrt(2x + 1) - x' },
  { op: 'Exponential', syntax: 'exp(x)', example: 'exp(-x) - x' },
  { op: 'Parentheses', syntax: '(x + 1)', example: '(x - 2) * (x + 3)' },
  { op: 'Multiplication', syntax: '2*x (explicit)', example: 'Requires * for multiplier bounds' },
]

const FAQ = [
  {
    q: 'Why does Bisection converge so slowly compared to Newton\u2013Raphson?',
    a: 'Bisection scales with simple linear convergence, halving bounds on every iteration. Newton-Raphson leverages quadratic derivative projections to double precision digits per step, though it requires specific conditions.',
  },
  {
    q: 'What happens when a tangent slope evaluates to zero?',
    a: 'Newton-Raphson iterations divide by f\u2019(xi). Flat slopes resolve the derivative to 0, which breaks the division. Toroid stops and reports the error rather than continuing.',
  },
  {
    q: 'How do I read the convergence tables?',
    a: 'Each row is one iteration: the current approximation, the function value, and the absolute error relative to the previous step. When the error drops below the tolerance, the root is accepted.',
  },
]

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="faq-item">
      <button className="faq-q" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span>{q}</span>
        <span aria-hidden="true">{open ? '−' : '+'}</span>
      </button>
      {open && <p className="faq-a">{a}</p>}
    </div>
  )
}

export function Help() {
  return (
    <div className="help container">
      <header className="help-header">
        <h1>How can we help?</h1>
        <div className="help-index">
          <span>Workspace Anatomy</span>
          <span>Getting Started</span>
          <span>Syntax Guide</span>
          <span>FAQ</span>
        </div>
      </header>

      <section className="help-section">
        <h2>Workspace Anatomy</h2>
        <p className="muted">Toroid is partitioned into simple modules:</p>
        <ul className="anatomy-list">
          <li><strong>Home:</strong> The rapid numerical dashboard mapping interactive convergence plots.</li>
          <li><strong>Methods:</strong> Comprehensive listing of all plotting, isolation, and evaluation tools.</li>
          <li><strong>Learn:</strong> Detailed math curricula, algebraic step proofs, and convergence conditions.</li>
          <li><strong>Playground Sandbox:</strong> Live iteration panels that evaluate user-input equations instantly.</li>
        </ul>
      </section>

      <section className="help-section">
        <h2>Getting Started</h2>
        <div className="steps-flow">
          <div className="step-node">
            <span className="step-num">01</span>
            <h3>Choose a Method</h3>
            <p className="muted">Select any algorithm (e.g. Bisection, Newton) from the unified directory.</p>
          </div>
          <div className="step-node">
            <span className="step-num">02</span>
            <h3>Formulate Inputs</h3>
            <p className="muted">Enter your expression (such as x^2 - 3) alongside bounds and tolerance.</p>
          </div>
          <div className="step-node">
            <span className="step-num">03</span>
            <h3>Inspect Graph &amp; Table</h3>
            <p className="muted">Observe convergence vectors and the iteration matrix instantly.</p>
          </div>
        </div>
      </section>

      <section className="help-section">
        <h2>Formula Syntax Reference</h2>
        <p className="muted">Use standard algebraic and functional notation inside sandbox inputs:</p>
        <div className="syntax-table-wrap">
          <table className="syntax-table">
            <thead>
              <tr><th>Operation</th><th>Syntax</th><th>Example usage &amp; context</th></tr>
            </thead>
            <tbody>
              {SYNTAX.map((s) => (
                <tr key={s.op}>
                  <td>{s.op}</td>
                  <td><code>{s.syntax}</code></td>
                  <td>{s.example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="help-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-items">
          {FAQ.map((f) => <FaqItem key={f.q} {...f} />)}
        </div>
      </section>

      <div className="theory-callout help-callout">
        💡 Ready to test some functions? Launch the unified <Link to="/methods">Methods Index</Link> or
        dive into core proofs over on the <Link to="/learn">Learn Hub</Link>.
      </div>
    </div>
  )
}

export function About() {
  return (
    <div className="help container">
      <header className="help-header">
        <h1>About Toroid</h1>
      </header>
      <section className="help-section">
        <p className="muted">
          Toroid is a website where you'll find several methods used to solve numerical analysis
          problems: plotting functions, evaluating expressions, and locating roots of equations of
          one variable.
        </p>
        <p className="muted">
          The frontend is built with React, TypeScript and Vite. The numerical methods run in a
          Python FastAPI backend.
        </p>
      </section>
    </div>
  )
}

export function NotFound() {
  return (
    <div className="help container">
      <header className="help-header">
        <h1>Page not found</h1>
      </header>
      <p className="muted">
        That page doesn't exist. Head back to the <Link to="/">home page</Link>.
      </p>
    </div>
  )
}
