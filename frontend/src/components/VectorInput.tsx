// Reusable editable 1D numeric vector with add/remove controls.

interface VectorInputProps {
  value: number[]
  onChange: (next: number[]) => void
  label?: string
  fixedLength?: number
}

export function VectorInput({ value, onChange, label, fixedLength }: VectorInputProps) {
  const setItem = (i: number, raw: string) => {
    const next = [...value]
    next[i] = raw === '' || raw === '-' ? 0 : Number(raw)
    onChange(next)
  }

  return (
    <div className="vector-input">
      {label && <label className="field-label">{label}</label>}
      <div className="vector-row">
        {value.map((v, i) => (
          <input
            key={i}
            type="number"
            step="any"
            className="matrix-cell"
            value={v}
            onChange={(e) => setItem(i, e.target.value)}
            aria-label={`${label ?? 'value'} ${i + 1}`}
          />
        ))}
        {fixedLength === undefined && (
          <div className="vector-controls">
            <button type="button" onClick={() => onChange([...value, 0])} aria-label="Add value">
              +
            </button>
            <button
              type="button"
              onClick={() => value.length > 1 && onChange(value.slice(0, -1))}
              aria-label="Remove value"
            >
              −
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
