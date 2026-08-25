import { useEffect, useRef, useState, type DependencyList } from 'react'

interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export function useAsync<T>(fn: () => Promise<T>, deps: DependencyList, options?: { enabled?: boolean }): AsyncState<T> {
  const enabled = options?.enabled ?? true
  const [state, setState] = useState<AsyncState<T>>({ data: null, loading: enabled, error: null })

  // Ref so the effect doesn't need `fn` in its dependency array (callers pass a fresh
  // closure every render) while still always calling the latest version.
  const fnRef = useRef(fn)
  fnRef.current = fn

  useEffect(() => {
    if (!enabled) return
    let cancelled = false
    setState({ data: null, loading: true, error: null })
    fnRef
      .current()
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null })
      })
      .catch((err: unknown) => {
        if (!cancelled) setState({ data: null, loading: false, error: err instanceof Error ? err.message : 'Something went wrong.' })
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, enabled])

  return state
}
