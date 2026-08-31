import type { IconProps } from "./types"

// icon / chart — 20. User Interface, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Chart({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M21 4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1zM6 17v-7a1 1 0 0 1 2 0v7a1 1 0 0 1-2 0m5 0v-4a1 1 0 0 1 2 0v4a1 1 0 0 1-2 0m5 0V7a1 1 0 0 1 2 0v10a1 1 0 0 1-2 0m7 3a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3V4a3 3 0 0 1 3-3h16a3 3 0 0 1 3 3z"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M13 4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1zm-9 7V6a1 1 0 0 1 2 0v5a1 1 0 0 1-2 0m3 0V8a1 1 0 0 1 2 0v3a1 1 0 0 1-2 0m3 0V5a1 1 0 0 1 2 0v6a1 1 0 0 1-2 0m5 1a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3V4a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3z"/></svg>
  )
}
