import type { IconProps } from "./types"

// icon / Drag — набор ALL ICONS.
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Drag({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M10 4.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m7-14a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M5 12a1 1 0 1 1 0 2 1 1 0 0 1 0-2m6 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2M5 7a1 1 0 1 1 0 2 1 1 0 0 1 0-2m6 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2M5 2a1 1 0 1 1 0 2 1 1 0 0 1 0-2m6 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/></svg>
  )
}
