import type { IconProps } from "./types"

// icon / suburban transport — 18. Other, набор ALL ICONS.
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function SuburbanTransport({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M0 .5h11a3 3 0 0 1 3 3v15a1 1 0 0 1-1 1h-3a4 4 0 0 1-8 0H0v-2h2.292q.118.001.228.026A4 4 0 0 1 6 15.5c1.48 0 2.773.804 3.465 2H12v-1h-1a1 1 0 1 1 0-2h1v-2H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h8v-1a1 1 0 0 0-1-1H0zm12 6H9v4h3zm-5 4v-4H4v4zm9-4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-1v6h.5a1 1 0 1 1 0 2h-3a1 1 0 1 1 0-2h.5v-6h-1a2 2 0 0 1-2-2zm6 0h-4v4h4zm-16 11a2 2 0 1 0 0 4 2 2 0 0 0 0-4" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M7 0a3 3 0 0 1 3 3v8.902q.005.05.005.103a1 1 0 0 1-1 1H7a3 3 0 0 1-6 0H.005v-2h1.759a2.99 2.99 0 0 1 4.472 0H8V9H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h6a1 1 0 0 0-1-1H0V0zm8 3a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-.5v3.005h.505a1 1 0 1 1 0 2h-3a1 1 0 0 1 0-2h.495V9H12a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM4 12a1 1 0 1 0 0 2 1 1 0 0 0 0-2M3 7h2V5H3zm4 0h1V5H7zm6 0h1V5h-1z"/></svg>
  )
}
