// Loads the method catalog from the backend, falling back to a bundled copy
// so navigation renders even if the API is briefly unavailable.
import { useEffect, useState } from 'react'
import { api } from '../api/client'
import type { MethodsCatalog } from '../api/types'
import { FALLBACK_CATALOG } from './catalog'

export function useCatalog() {
  const [catalog, setCatalog] = useState<MethodsCatalog>(FALLBACK_CATALOG)
  const [online, setOnline] = useState<boolean | null>(null)

  useEffect(() => {
    let active = true
    api
      .getCatalog()
      .then((data) => {
        if (active) {
          setCatalog(data)
          setOnline(true)
        }
      })
      .catch(() => {
        if (active) setOnline(false)
      })
    return () => {
      active = false
    }
  }, [])

  return { catalog, online }
}
