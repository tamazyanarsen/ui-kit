import type { IconProps } from "./types"

// icon / bus transport — 18. Other, набор ALL ICONS.
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function BusTransport({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M3 3a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v3h2a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-2v9a3 3 0 1 1-6 0H9a3 3 0 1 1-6 0v-9H1a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h2zm0 5H2v2h1zm2 6v5h14v-5zm14-2H5V6h14zm0-8V3a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v1zm0 17h-2a1 1 0 1 0 2 0M5 21a1 1 0 1 0 2 0zm16-11h1V8h-1zM6 16.503a1 1 0 0 1 1-1h2a1 1 0 1 1 0 2H7a1 1 0 0 1-1-1m8 0a1 1 0 0 1 1-1h2a1 1 0 1 1 0 2h-2a1 1 0 0 1-1-1" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M11 0a3 3 0 0 1 3 3v1h1a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-1v5.5a2.5 2.5 0 0 1-2.5 2.5 2.5 2.5 0 0 1-2.45-2h-2.1a2.5 2.5 0 0 1-3.407 1.81A2.5 2.5 0 0 1 2 13.5V8H1a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h1V3a3 3 0 0 1 3-3zM4 12h8V9H4zm0-5h8V5H4zm1-5a1 1 0 0 0-1 1h8a1 1 0 0 0-1-1z"/></svg>
  )
}
