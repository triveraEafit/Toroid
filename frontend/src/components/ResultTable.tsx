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
    return value.toPrecision(8).replace(/\.?0+$/, '')
  }
  return String(value)
}

export function ResultTable({ columns, rows }: ResultTableProps) {
  if (!columns.length || !rows.length) return null
  return (
    <div className="result-table-wrap">
      <table className="result-table">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j}>{formatCell(cell)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
