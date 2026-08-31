import type { IconProps } from "./types"

// icon / passport — 16. Docs, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Passport({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M7 15a1 1 0 0 1 1-1h8a1 1 0 0 1 0 2H8a1 1 0 0 1-1-1m2 3a1 1 0 0 1 1-1h4a1 1 0 0 1 0 2h-4a1 1 0 0 1-1-1m3-12a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 6M8 8a4 4 0 1 1 8 0 4 4 0 0 1-8 0" clipRule="evenodd"/><path fill="currentColor" fillRule="evenodd" d="M2 1a1 1 0 0 1 1-1h15a4 4 0 0 1 4 4v16a4 4 0 0 1-4 4H3a1 1 0 0 1-1-1zm2 1v20h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M12 0a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H2a1 1 0 0 1-1-1V1a1 1 0 0 1 1-1zM3 14h9a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H3zm7-3a1 1 0 0 1 0 2H6a1 1 0 0 1 0-2zM8 3a3 3 0 1 1 0 6 3 3 0 0 1 0-6m0 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2"/></svg>
  )
}
