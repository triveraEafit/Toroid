// Thin fetch wrapper for the Toroid FastAPI backend.
import type {
  GraphResponse,
  MethodResult,
  MethodsCatalog,
} from './types'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

async function request<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: body === undefined ? 'GET' : 'POST',
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  if (!res.ok) {
    let detail = `Request failed with status ${res.status}`
    try {
      const data = await res.json()
      if (data?.detail) detail = typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail)
    } catch {
      // ignore json parse failure
    }
    throw new Error(detail)
  }
  return res.json() as Promise<T>
}

export const api = {
  getCatalog: () => request<MethodsCatalog>('/api/methods'),
  runMethod: (endpoint: string, payload: unknown) => request<MethodResult>(endpoint, payload),
  evaluate: (payload: { function: string; x_min: number; x_max: number; points: number }) =>
    request<GraphResponse>('/api/graph/evaluate', payload),
  evaluatePoint: (payload: { function: string; x: number }) =>
    request<{ success: boolean; message: string; value: number | null }>('/api/graph/evaluate-point', payload),
}
