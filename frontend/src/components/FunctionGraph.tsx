// Reusable function plotter backed by the /api/graph/evaluate endpoint.
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { GraphPoint } from '../api/types'

interface FunctionGraphProps {
  points: GraphPoint[]
  height?: number
}

export function FunctionGraph({ points, height = 360 }: FunctionGraphProps) {
  // Recharts skips null y values, producing natural gaps at discontinuities.
  const data = points.map((p) => ({ x: Number(p.x.toFixed(4)), y: p.y }))
  return (
    <div className="function-graph">
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0ddd5" />
          <XAxis dataKey="x" type="number" domain={['dataMin', 'dataMax']} stroke="#9aa0a9" tick={{ fontSize: 11 }} />
          <YAxis stroke="#9aa0a9" tick={{ fontSize: 11 }} />
          <Tooltip
            contentStyle={{
              background: '#ffffff',
              border: '1px solid #e6e4df',
              borderRadius: '8px',
              fontSize: '0.8rem',
            }}
          />
          <ReferenceLine y={0} stroke="#9aa0a9" />
          <ReferenceLine x={0} stroke="#9aa0a9" />
          <Line type="monotone" dataKey="y" stroke="#2c92b8" dot={false} strokeWidth={2} connectNulls={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
