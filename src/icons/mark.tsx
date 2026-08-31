import type { IconProps } from "./types"

// icon / mark — 21. Social Networks, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Mark({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M20 12a8 8 0 1 1-16 0 8 8 0 0 1 16 0"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M13.334 8A5.333 5.333 0 1 1 2.668 8a5.333 5.333 0 0 1 10.666 0"/></svg>
  )
}
