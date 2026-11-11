// Generic form that renders inputs for a method based on its declared fields.
// Reused by every calculator page; each field key maps to a FieldSpec.
import { useState } from 'react'
import { specFor } from '../methods/fields'
import { MatrixInput } from './MatrixInput'
import { VectorInput } from './VectorInput'
import './MethodForm.css'

interface MethodFormProps {
  fields: string[]
  onSubmit: (values: Record<string, unknown>) => void
  loading?: boolean
  submitLabel?: string
}

function initialValues(fields: string[]): Record<string, unknown> {
  const values: Record<string, unknown> = {}
  for (const key of fields) {
    values[key] = structuredClone(specFor(key).default)
  }
  return values
}

export function MethodForm({ fields, onSubmit, loading, submitLabel = 'Calculate' }: MethodFormProps) {
  const [values, setValues] = useState<Record<string, unknown>>(() => initialValues(fields))

  const update = (key: string, value: unknown) => setValues((v) => ({ ...v, [key]: value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(values)
  }

  return (
    <form className="method-form" onSubmit={handleSubmit}>
      {fields.map((key) => {
        const spec = specFor(key)
        const value = values[key]
        return (
          <div className="form-field" key={key}>
            {spec.kind === 'matrix' ? (
              <MatrixInput value={value as number[][]} onChange={(v) => update(key, v)} label={spec.label} />
            ) : spec.kind === 'vector' || spec.kind === 'points' ? (
              <VectorInput value={value as number[]} onChange={(v) => update(key, v)} label={spec.label} />
            ) : spec.kind === 'select' ? (
              <>
                <label className="field-label" htmlFor={key}>{spec.label}</label>
                <select id={key} value={String(value)} onChange={(e) => update(key, e.target.value)}>
                  {spec.options?.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </>
            ) : (
              <>
                <label className="field-label" htmlFor={key}>{spec.label}</label>
                <input
                  id={key}
                  type={spec.kind === 'number' ? 'number' : 'text'}
                  step={spec.kind === 'number' ? (spec.step ?? 'any') : undefined}
                  value={value as string | number}
                  onChange={(e) =>
                    update(key, spec.kind === 'number' ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value)
                  }
                />
                {spec.help && <span className="field-help">{spec.help}</span>}
              </>
            )}
          </div>
        )
      })}
      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? 'Calculating…' : submitLabel}
      </button>
    </form>
  )
}
