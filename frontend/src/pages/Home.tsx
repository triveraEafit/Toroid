// Home page — matches the Figma "toroid main" frame: hero + graph canvas,
// editorial content, a live simulation panel, and a Learn CTA band.
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import type { GraphPoint } from '../api/types'
import { FunctionGraph } from '../components/FunctionGraph'
import { ResultTable } from '../components/ResultTable'
import './Home.css'

export function Home() {
  const [curve, setCurve] = useState<GraphPoint[]>([])

  // Plot a sample curve in the hero canvas, matching the design's sine wave.
  useEffect(() => {
    let active = true
    api
      .evaluate({ function: 'sin(x) * cos(x / 2)', x_min: -12, x_max: 12, points: 400 })
      .then((r) => {
        if (active && r.success) setCurve(r.points)
      })
      .catch(() => undefined)
    return () => {
      active = false
    }
  }, [])

  // Static Newton-on-f(x)=x^3-x-2 iteration preview, as in the Figma mock.
  const demoColumns = ['Iteration', 'a', 'xm', 'b', 'F(xm)', 'Absolute Error']
  const demoRows: (number | string)[][] = [
    [0, 2.0, 5.0, 0.4787, -1.2713, '—'],
    [1, 1.636364, 0.720511, 0.115064, 0.2098, 0.363636],
    [2, 1.530391, 0.05431, 0.009091, 0.0231, 0.105973],
    [3, 1.521442, 0.000321, 0.000142, 0.0001, 0.008949],
    [4, 1.52138, 0.0, 0.0, 0.0, 0.000062],
  ]

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero container">
        <p className="eyebrow">Visual calculator for analysis</p>
        <h1 className="hero-title">From functions to numerical approximations</h1>
        <p className="hero-sub">
          A modern workspace dedicated to plotting root-finding progressions, integral limits,
          and interpolation coordinates. Map classic algorithms instantly onto precise Cartesian
          viewports.
        </p>
        <div className="hero-actions">
          <Link to="/methods" className="btn-primary">
            Explore Methods <span aria-hidden="true">→</span>
          </Link>
          <Link to="/learn" className="btn-outline">Read Docs</Link>
        </div>

        <div className="graph-canvas">
          {curve.length > 0 ? (
            <FunctionGraph points={curve} height={352} />
          ) : (
            <div className="graph-canvas-empty">Loading plot…</div>
          )}
        </div>
      </section>

      {/* Editorial */}
      <section className="editorial container">
        <div className="editorial-left">
          <p className="eyebrow">Algorithmic methodology</p>
          <h2>Bridging pure calculus with discrete machines</h2>
          <p className="muted">
            In mathematics, analytical solutions can be rare or impossible. Numerical methods offer
            a practical compromise, converting infinite limits into finite, sequential steps that
            computers can trace. Toroid builds the computational bridge for study and validation.
          </p>
        </div>
        <div className="editorial-right">
          <article className="feature">
            <span className="feature-icon">x</span>
            <div>
              <h3>Root Isolation Algorithms</h3>
              <p className="muted">
                Deconstruct methods like Bisection, Secant, and Newton-Raphson. Witness the exact
                criteria that dictate linear versus quadratic convergence speeds in direct viewports.
              </p>
            </div>
          </article>
          <article className="feature">
            <span className="feature-icon">∫</span>
            <div>
              <h3>Convergence &amp; Error Tracking</h3>
              <p className="muted">
                Follow each iteration's approximation and absolute error. Track truncation margins
                mathematically until the tolerance threshold validates a root.
              </p>
            </div>
          </article>
        </div>
      </section>

      {/* Simulation panel */}
      <section className="sim-panel">
        <div className="container">
          <p className="eyebrow">Live output sandbox preview</p>
          <h2>Instant visual &amp; numerical parity</h2>
          <p className="muted sim-lead">
            Watch computational iteration stacks map dynamically alongside coordinates. No delay, no
            guesswork.
          </p>
          <div className="sim-grid">
            <div className="card sim-graph">
              <div className="sim-graph-head">
                <span>NEWTON_CONVERGENCE_PLOT</span>
                <span>Tol: 1e-6</span>
              </div>
              {curve.length > 0 && <FunctionGraph points={curve} height={260} />}
            </div>
            <div className="card sim-table">
              <h4 className="sim-table-title">ITERATION MATRIX</h4>
              <ResultTable columns={demoColumns} rows={demoRows} />
            </div>
          </div>
        </div>
      </section>

      {/* Learn CTA band */}
      <section className="learn-band">
        <div className="container">
          <p className="eyebrow">Comprehensive theory base</p>
          <h2>Dive into detailed method theory inside our Learn Center</h2>
          <p>
            Master Taylor series expansions, local versus global convergence proofs, and step
            boundaries before you analyze. Our structured curriculum is built specifically for
            university mathematics courses.
          </p>
          <Link to="/learn" className="btn-primary">Explore Learn Hub</Link>
        </div>
      </section>
    </div>
  )
}
