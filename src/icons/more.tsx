import type { IconProps } from "./types"

// icon / more — 09. Settings Menus, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function More({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M6 12a2 2 0 1 1-3.999.001A2 2 0 0 1 6 12m8 0a2 2 0 1 1-3.999.001A2 2 0 0 1 14 12m8 0a2 2 0 1 1-3.999.001A2 2 0 0 1 22 12"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M4 8a1.5 1.5 0 1 1-3.001-.001A1.5 1.5 0 0 1 4 8m5.5 0a1.5 1.5 0 1 1-3.001-.001A1.5 1.5 0 0 1 9.5 8M15 8a1.5 1.5 0 1 1-3.001-.001A1.5 1.5 0 0 1 15 8"/></svg>
  )
}
