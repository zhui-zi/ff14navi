import { useState, useEffect } from 'react'

const KEY = 'ff14navi-theme'

function getSaved() {
  const v = localStorage.getItem(KEY)
  return v === 'light' || v === 'dark' ? v : 'auto'
}

function isOsDark() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function useTheme() {
  const [pref,    setPref]    = useState(getSaved)
  const [sysDark, setSysDark] = useState(isOsDark)

  const effective = pref === 'auto' ? (sysDark ? 'dark' : 'light') : pref

  useEffect(() => {
    document.documentElement.classList.toggle('dark',  effective === 'dark')
    document.documentElement.classList.toggle('light', effective === 'light')
  }, [effective])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const fn = e => setSysDark(e.matches)
    mq.addEventListener('change', fn)
    return () => mq.removeEventListener('change', fn)
  }, [])

  // Cycle: auto → light → dark → auto
  const cycle = () => setPref(p => {
    const next = p === 'auto' ? 'light' : p === 'light' ? 'dark' : 'auto'
    next === 'auto' ? localStorage.removeItem(KEY) : localStorage.setItem(KEY, next)
    return next
  })

  return { pref, effective, cycle }
}
