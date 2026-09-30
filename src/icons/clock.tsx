import type { IconProps } from "./types"

// icon / Clock — набор ALL ICONS.
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Clock({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2M0 12C0 5.373 5.373 0 12 0s12 5.373 12 12-5.373 12-12 12S0 18.627 0 12m12-6a1 1 0 0 1 1 1v4h4a1 1 0 1 1 0 2h-5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M14 8A6 6 0 1 0 2 8a6 6 0 0 0 12 0M7 4a1 1 0 0 1 2 0v3h3a1 1 0 1 1 0 2H8a1 1 0 0 1-1-1zm9 4A8 8 0 1 1 0 8a8 8 0 0 1 16 0"/></svg>
  )
}
