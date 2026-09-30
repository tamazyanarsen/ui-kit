import type { IconProps } from "./types"

// icon / gas station — 19. Categories, набор ALL ICONS.
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function GasStation({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M2 4a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v10.455h3a1 1 0 0 1 1 1V18a1 1 0 1 0 2 0v-5.17a3 3 0 0 1-2.292-5.537L18.295 5.88a1 1 0 0 1 1.414-1.415l3.376 3.376.084.085a3 3 0 0 1 .831 2.17V18a3 3 0 1 1-6 0v-1.546h-2V22h1a1 1 0 1 1 0 2H1a1 1 0 1 1 0-2h1zm2 18h10V4a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1zM22 9.96a1 1 0 0 0-.27-.645l-.044-.044a1 1 0 1 0 .314.785zM5 6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2zm6 0H7v3h4z" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M8 1a3 3 0 0 1 3 3v5h1a1 1 0 0 1 1 1v.5a.5.5 0 0 0 1 0V6.414l-1.707-1.707a1 1 0 1 1 1.414-1.414l2 2q.055.056.1.12.013.015.024.031.04.062.071.128.032.065.054.135l.016.062q.027.111.028.231v4.5a2.5 2.5 0 0 1-2.5 2.5 2.5 2.5 0 0 1-2.45-2H11v3a1 1 0 1 1 0 2H1a1 1 0 1 1 0-2V4a3 3 0 0 1 3-3zM4 3a1 1 0 0 0-1 1v10h6V4a1 1 0 0 0-1-1zm3 1a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z"/></svg>
  )
}
