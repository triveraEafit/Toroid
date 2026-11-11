// Shared types mirroring the FastAPI response schemas.

export interface MethodResult {
  success: boolean
  message: string
  columns: string[]
  rows: unknown[][]
  result: unknown
}

export interface MethodField {
  // Field keys match the backend request schema properties.
  slug: string
}

export interface MethodInfo {
  slug: string
  name: string
  endpoint: string
  fields: string[]
  // "plotter" and "evaluator" render bespoke result views; others use the table.
  kind?: 'plotter' | 'evaluator'
}

export interface MethodCategory {
  key: string
  title: string
  index?: string
  methods: MethodInfo[]
}

export interface MethodsCatalog {
  categories: MethodCategory[]
}

export interface GraphPoint {
  x: number
  y: number | null
}

export interface GraphResponse {
  success: boolean
  message: string
  points: GraphPoint[]
}
