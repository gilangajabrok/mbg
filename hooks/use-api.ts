/**
 * Unified API hook factory for all modules
 * Provides typed CRUD operations with loading/error states
 */

import { useState, useCallback } from "react"

export interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export interface UseApiListState<T> {
  items: T[]
  loading: boolean
  error: string | null
  total?: number
}

/**
 * Generic CRUD hook factory
 */
export function useApi<T>(
  fetchFn: () => Promise<T>,
  initialData: T | null = null
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: initialData,
    loading: false,
    error: null,
  })

  const fetch = useCallback(async () => {
    setState({ data: null, loading: true, error: null })
    try {
      const result = await fetchFn()
      setState({ data: result, loading: false, error: null })
      return result
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error"
      setState({ data: null, loading: false, error: message })
      throw err
    }
  }, [fetchFn])

  return { ...state, fetch }
}

/**
 * List hook with pagination
 */
export function useApiList<T>(
  fetchFn: (limit?: number, offset?: number) => Promise<{ items: T[]; total?: number }>
) {
  const [state, setState] = useState<UseApiListState<T>>({
    items: [],
    loading: false,
    error: null,
  })
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const fetch = useCallback(
    async (pg?: number, lim?: number) => {
      const p = pg ?? page
      const l = lim ?? limit
      const offset = (p - 1) * l

      setState({ items: [], loading: true, error: null })
      try {
        const result = await fetchFn(l, offset)
        setState({ items: result.items, loading: false, error: null, total: result.total })
        setPage(p)
        setLimit(l)
        return result
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error"
        setState({ items: [], loading: false, error: message })
        throw err
      }
    },
    [fetchFn, page, limit]
  )

  return { ...state, fetch, page, limit, setPage, setLimit }
}

/**
 * Create hook
 */
export function useApiCreate<T, R>(
  createFn: (data: T) => Promise<R>
) {
  const [state, setState] = useState<UseApiState<R>>({
    data: null,
    loading: false,
    error: null,
  })

  const create = useCallback(
    async (data: T) => {
      setState({ data: null, loading: true, error: null })
      try {
        const result = await createFn(data)
        setState({ data: result, loading: false, error: null })
        return result
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error"
        setState({ data: null, loading: false, error: message })
        throw err
      }
    },
    [createFn]
  )

  return { ...state, create }
}

/**
 * Update hook
 */
export function useApiUpdate<T, R>(
  updateFn: (id: string, data: Partial<T>) => Promise<R>
) {
  const [state, setState] = useState<UseApiState<R>>({
    data: null,
    loading: false,
    error: null,
  })

  const update = useCallback(
    async (id: string, data: Partial<T>) => {
      setState({ data: null, loading: true, error: null })
      try {
        const result = await updateFn(id, data)
        setState({ data: result, loading: false, error: null })
        return result
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error"
        setState({ data: null, loading: false, error: message })
        throw err
      }
    },
    [updateFn]
  )

  return { ...state, update }
}

/**
 * Delete hook
 */
export function useApiDelete(
  deleteFn: (id: string) => Promise<void>
) {
  const [state, setState] = useState<UseApiState<null>>({
    data: null,
    loading: false,
    error: null,
  })

  const delete_ = useCallback(
    async (id: string) => {
      setState({ data: null, loading: true, error: null })
      try {
        await deleteFn(id)
        setState({ data: null, loading: false, error: null })
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error"
        setState({ data: null, loading: false, error: message })
        throw err
      }
    },
    [deleteFn]
  )

  return { ...state, delete: delete_ }
}
