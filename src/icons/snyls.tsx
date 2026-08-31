import type { IconProps } from "./types"

// icon / SNYLS — 16. Docs, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Snyls({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M0 5a2 2 0 0 1 2-2h20a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm15.5 0H2v2h13.5zm2 0v2H22V5zM22 9h-4.5v1.645a3.501 3.501 0 0 1 0 6.71V19H22zm-6.5 10v-1.645a3.5 3.5 0 0 1 0-6.71V9H2v10zm1-6.5a1.5 1.5 0 1 0 .001 3.001A1.5 1.5 0 0 0 16.5 12.5m-12.75-.125a1 1 0 0 1 1-1h5.497a1 1 0 0 1 0 2H4.75a1 1 0 0 1-1-1m0 3.25a1 1 0 0 1 1-1h4a1 1 0 0 1 0 2h-4a1 1 0 0 1-1-1" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M15 2a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zM2 12h7v-.21a2.498 2.498 0 0 1 .019-4.591A1 1 0 0 1 9 7H2zm9-5q0 .103-.02.199A2.502 2.502 0 0 1 11 11.79V12h3V7zM5 8a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm5 1a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1M2 5h7V4H2zm9 0h3V4h-3z"/></svg>
  )
}
