import { useState, useEffect } from 'react'

// Returns null when the target has passed; callers treat null as "expired"
function calc(target) {
  const diff = target - Date.now()
  if (diff <= 0) return null
  const d = Math.floor(diff / 86400000)
  const h = Math.floor((diff % 86400000) / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  const s = Math.floor((diff % 60000) / 1000)
  return { d, h, m, s }
}

export function useCountdown(target) {
  const [t, setT] = useState(() => calc(target))
  useEffect(() => {
    const id = setInterval(() => setT(calc(target)), 1000)
    return () => clearInterval(id)
  }, [target])
  return t
}

export function fmtCountdown(t) {
  if (!t) return null
  const hh = String(t.h).padStart(2, '0')
  const mm = String(t.m).padStart(2, '0')
  const ss = String(t.s).padStart(2, '0')
  return t.d > 0 ? `${t.d}天 ${hh}:${mm}:${ss}` : `${hh}:${mm}:${ss}`
}
