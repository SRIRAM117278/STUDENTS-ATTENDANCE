import { useRef } from 'react'

export default function useDebounce() {
  const refs = useRef({})

  function shouldRun(key, ms = 3000) {
    const now = Date.now()
    if (!refs.current[key] || now - refs.current[key] > ms) {
      refs.current[key] = now
      return true
    }
    return false
  }

  return { shouldRun }
}
