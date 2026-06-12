import { useState, useEffect } from 'react'

const THEME_KEY   = 'ff14navi-theme'
const PALETTE_KEY = 'ff14navi-palette'

function getSaved() {
  const v = localStorage.getItem(THEME_KEY)
  return v === 'light' || v === 'dark' ? v : 'auto'
}

function getSavedPalette() {
  const v = localStorage.getItem(PALETTE_KEY)
  return ['purple', 'gold', 'crystal'].includes(v) ? v : 'purple'
}

function isOsDark() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function useTheme() {
  const [pref,    setPref]         = useState(getSaved)
  const [sysDark, setSysDark]      = useState(isOsDark)
  const [palette, setPaletteState] = useState(getSavedPalette)

  const effective = pref === 'auto' ? (sysDark ? 'dark' : 'light') : pref

  useEffect(() => {
    const cl = document.documentElement.classList
    cl.toggle('dark',  effective === 'dark')
    cl.toggle('light', effective === 'light')
  }, [effective])

  useEffect(() => {
    const cl = document.documentElement.classList
    cl.remove('palette-gold', 'palette-crystal')
    if (palette === 'gold')    cl.add('palette-gold')
    if (palette === 'crystal') cl.add('palette-crystal')
  }, [palette])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const fn = e => setSysDark(e.matches)
    mq.addEventListener('change', fn)
    return () => mq.removeEventListener('change', fn)
  }, [])

  // Cycle: auto → light → dark → auto
  const cycle = () => setPref(p => {
    const next = p === 'auto' ? 'light' : p === 'light' ? 'dark' : 'auto'
    next === 'auto' ? localStorage.removeItem(THEME_KEY) : localStorage.setItem(THEME_KEY, next)
    return next
  })

  const setPalette = (p) => {
    setPaletteState(p)
    localStorage.setItem(PALETTE_KEY, p)
  }

  return { pref, effective, cycle, palette, setPalette }
}
