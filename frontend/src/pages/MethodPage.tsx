// Calculator page for a single tool. Resolves the tool from the catalog by
// category + slug, renders the generic MethodForm, calls the backend, and
// shows the appropriate result view (table, plot, or single value).
import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api/client'
import type { GraphPoint, MethodResult } from '../api/types'
import { FunctionGraph } from '../components/FunctionGraph'
import { MethodForm } from '../components/MethodForm'
import { MethodResultView } from '../components/MethodResultView'
import { useCatalog } from '../methods/useCatalog'
import './MethodPage.css'

export function MethodPage() {
  const { category, slug } = useParams()
  const { catalog } = useCatalog()
  const [result, setResult] = useState<MethodResult | null>(null)
  const [points, setPoints] = useState<GraphPoint[] | null>(null)
  const [pointValue, setPointValue] = useState<number | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const method = useMemo(() => {
    const cat = catalog.categories.find((c) => c.key === category)
    return cat?.methods.find((m) => m.slug === slug)
  }, [catalog, category, slug])

  if (!method) {
    return (
      <div className="method-page container">
        <div className="card">
          <h2>Tool not found</h2>
          <p className="muted">
            Pick a tool from the <Link to="/methods">Methods directory</Link>.
          </p>
        </div>
      </div>
    )
  }

  const reset = () => {
    setResult(null)
    setPoints(null)
    setPointValue(null)
    setMessage(null)
    setError(null)
  }

  const handleSubmit = async (values: Record<string, unknown>) => {
    setLoading(true)
    reset()
    try {
      if (method.kind === 'plotter') {
        const res = await api.evaluate({
          function: String(values.function),
          x_min: Number(values.x_min),
          x_max: Number(values.x_max),
          points: 400,
        })
        if (!res.success) setError(res.message)
        else setPoints(res.points)
      } else if (method.kind === 'evaluator') {
        const res = await api.evaluatePoint({ function: String(values.function), x: Number(values.x) })
        if (!res.success) setError(res.message)
        else {
          setPointValue(res.value ?? null)
          setMessage(`f(${values.x}) = ${res.value}`)
        }
      } else {
        const res = await api.runMethod(method.endpoint, values)
        setResult(res)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Request failed')
    } finally {
      setLoading(false)
    }
  }

  const hasOutput = result || points || pointValue !== null || error

  return (
    <div className="method-page container">
      <header className="method-head">
        <Link to="/methods" className="back-link">← All methods</Link>
        <span className="eyebrow">{category}</span>
        <h1>{method.name}</h1>
      </header>

      <div className="method-grid">
        <section className="card method-inputs">
          <h2>Inputs</h2>
          <MethodForm
            key={method.slug}
            fields={method.fields}
            onSubmit={handleSubmit}
            loading={loading}
            submitLabel={method.kind === 'plotter' ? 'Plot' : method.kind === 'evaluator' ? 'Evaluate' : 'Calculate'}
          />
        </section>

        <section className="card method-output">
          <h2>Result</h2>
          {!hasOutput && <p className="muted">Enter parameters and run the tool to see the output.</p>}
          {error && <div className="result-banner result-error" role="alert">{error}</div>}
          {message && !error && <div className="result-banner result-ok">{message}</div>}
          {pointValue !== null && (
            <div className="result-headline">
              <span className="result-headline-label">Value</span>
              <code>{pointValue}</code>
            </div>
          )}
          {points && <FunctionGraph points={points} />}
          {result && <MethodResultView result={result} />}
        </section>
      </div>
    </div>
  )
}
