// Reusable iteration/step table for method results.
import './ResultTable.css'

interface ResultTableProps {
  columns: string[]
  rows: unknown[][]
}

function formatCell(value: unknown): string {
  if (value === null || value === undefined) return '—'
  if (typeof value === 'number') {
    if (Number.isInteger(value)) return String(value)
    // Use scientific notation for very small/large magnitudes (e.g. errors
    // like 1.42e-7), otherwise a trimmed fixed-precision value.
    const abs = Math.abs(value)
    if (abs !== 0 && (abs < 1e-4 || abs >= 1e6)) {
      return value.toExponential(4)
    }
    return value.toPrecision(8).replace(/\.?0+$/, '')
  }
  return String(value)
}

// Columns that represent an error get a highlight so absolute vs relative can
// be compared at a glance.
function columnClass(name: string): string {
  const n = name.toLowerCase()
  if (n.includes('abs') && n.includes('error')) return 'col-abs-error'
  if (n.includes('rel') && n.includes('error')) return 'col-rel-error'
  if (n.includes('error')) return 'col-abs-error'
  return ''
}

export function ResultTable({ columns, rows }: ResultTableProps) {
  if (!columns.length || !rows.length) return null
  const classes = columns.map(columnClass)
  return (
    <div className="result-table-wrap">
      <table className="result-table">
        <thead>
          <tr>
            {columns.map((c, j) => (
              <th key={c} className={classes[j]}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} className={classes[j]}>{formatCell(cell)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
