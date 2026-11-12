// Home page — matches the Figma "toroid main" frame: hero + graph canvas,
// editorial content, a live simulation panel, and a Learn CTA band.
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import type { GraphPoint } from '../api/types'
import { FunctionGraph } from '../components/FunctionGraph'
import { ResultTable } from '../components/ResultTable'
import './Home.css'
import { useLanguage } from '../i18n'

export function Home() {
  const { t } = useLanguage()
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
        <p className="eyebrow">{t('home.eyebrow')}</p>
        <h1 className="hero-title">{t('home.title')}</h1>
        <p className="hero-sub">{t('home.subtitle')}</p>
        <div className="hero-actions">
          <Link to="/methods" className="btn-primary">
            {t('home.methods')} <span aria-hidden="true">→</span>
          </Link>
          <Link to="/learn" className="btn-outline">{t('home.docs')}</Link>
        </div>

        <div className="graph-canvas">
          {curve.length > 0 ? (
            <FunctionGraph points={curve} height={352} />
          ) : (
            <div className="graph-canvas-empty">{t('home.loading')}</div>
          )}
        </div>
      </section>

      <section className="editorial container">
        <div className="editorial-left">
          <p className="eyebrow">{t('home.methodology')}</p>
          <h2>{t('home.editorialTitle')}</h2>
          <p className="muted">{t('home.editorialText')}</p>
        </div>
        <div className="editorial-right">
          <article className="feature">
            <span className="feature-icon">x</span>
            <div>
              <h3>{t('home.rootTitle')}</h3>
              <p className="muted">{t('home.rootText')}</p>
            </div>
          </article>
          <article className="feature">
            <span className="feature-icon">∫</span>
            <div>
              <h3>{t('home.errorTitle')}</h3>
              <p className="muted">{t('home.errorText')}</p>
            </div>
          </article>
        </div>
      </section>

      <section className="sim-panel">
        <div className="container">
          <p className="eyebrow">{t('home.sandbox')}</p>
          <h2>{t('home.parity')}</h2>
          <p className="muted sim-lead">{t('home.parityText')}</p>
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

      <section className="learn-band">
        <div className="container">
          <p className="eyebrow">{t('home.learnEyebrow')}</p>
          <h2>{t('home.learnTitle')}</h2>
          <p>{t('home.learnText')}</p>
          <Link to="/learn" className="btn-primary">{t('home.learnCta')}</Link>
        </div>
      </section>
    </div>
  )
}
