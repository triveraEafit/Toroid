// Renders a MethodResult: status message, headline result, and step table.
import type { MethodResult } from '../api/types'
import { ResultTable } from './ResultTable'
import './MethodResultView.css'

interface MethodResultViewProps {
  result: MethodResult | null
  error?: string | null
}

function renderHeadline(value: unknown): string | null {
  if (value === null || value === undefined) return null
  if (typeof value === 'number') return value.toPrecision(10).replace(/\.?0+$/, '')
  if (Array.isArray(value)) return `[ ${value.map((v) => (typeof v === 'number' ? v.toPrecision(8).replace(/\.?0+$/, '') : v)).join(',  ')} ]`
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>
    if (typeof obj.polynomial === 'string') return `P(x) = ${obj.polynomial}`
    if (Array.isArray(obj.segments)) return `${obj.segments.length} piecewise segments`
    return JSON.stringify(value)
  }
  return String(value)
}

export function MethodResultView({ result, error }: MethodResultViewProps) {
  if (error) {
    return <div className="result-banner result-error" role="alert">{error}</div>
  }
  if (!result) return null

  const headline = renderHeadline(result.result)

  return (
    <div className="method-result">
      <div className={`result-banner ${result.success ? 'result-ok' : 'result-warn'}`} role="status">
        {result.message || (result.success ? 'Done' : 'No result')}
      </div>
      {headline && (
        <div className="result-headline">
          <span className="result-headline-label">Result</span>
          <code>{headline}</code>
        </div>
      )}
      <ResultTable columns={result.columns} rows={result.rows} />
    </div>
  )
}
