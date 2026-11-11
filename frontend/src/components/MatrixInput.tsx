// Reusable editable matrix with size controls.
import './MatrixInput.css'

interface MatrixInputProps {
  value: number[][]
  onChange: (next: number[][]) => void
  label?: string
}

export function MatrixInput({ value, onChange, label }: MatrixInputProps) {
  const rows = value.length
  const cols = value[0]?.length ?? 0

  const resize = (newRows: number, newCols: number) => {
    const next: number[][] = []
    for (let i = 0; i < newRows; i++) {
      const row: number[] = []
      for (let j = 0; j < newCols; j++) {
        row.push(value[i]?.[j] ?? 0)
      }
      next.push(row)
    }
    onChange(next)
  }

  const setCell = (i: number, j: number, raw: string) => {
    const next = value.map((r) => [...r])
    next[i][j] = raw === '' || raw === '-' ? 0 : Number(raw)
    onChange(next)
  }

  return (
    <div className="matrix-input">
      {label && <label className="field-label">{label}</label>}
      <div className="matrix-size">
        <label>
          Size
          <input
            type="number"
            min={2}
            max={8}
            value={rows}
            onChange={(e) => {
              const n = Math.max(2, Math.min(8, Number(e.target.value) || 2))
              resize(n, n)
            }}
          />
        </label>
        <span className="matrix-size-hint">(square {rows}×{cols})</span>
      </div>
      <div className="matrix-grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {value.map((row, i) =>
          row.map((cell, j) => (
            <input
              key={`${i}-${j}`}
              type="number"
              step="any"
              className="matrix-cell"
              value={cell}
              onChange={(e) => setCell(i, j, e.target.value)}
              aria-label={`a${i + 1}${j + 1}`}
            />
          )),
        )}
      </div>
    </div>
  )
}
