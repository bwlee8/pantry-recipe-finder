import { useEffect, useState } from 'react'

// Behaves like useState, but reads from and writes to localStorage under `key`.
// Falls back to `initialValue` if storage is empty, unavailable, or holds bad JSON.
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key)
      return stored ? JSON.parse(stored) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Storage can fail in private browsing or when full — safe to ignore here.
    }
  }, [key, value])

  return [value, setValue]
}
