import type { IconProps } from "./types"

// icon / list — 09. Settings Menus, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function List({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M0 5a1 1 0 0 1 1-1h1.998a1 1 0 0 1 0 2H1a1 1 0 0 1-1-1m7 0a1 1 0 0 1 1-1h15a1 1 0 0 1 0 2H8a1 1 0 0 1-1-1M.001 12a1 1 0 0 1 1-1h1.997a1 1 0 0 1 0 2H1.001a1 1 0 0 1-1-1M7 12a1 1 0 0 1 1-1h15a1 1 0 0 1 0 2H8a1 1 0 0 1-1-1M.001 19a1 1 0 0 1 1-1h1.997a1 1 0 0 1 0 2H1.001a1 1 0 0 1-1-1M7 19a1 1 0 0 1 1-1h15a1 1 0 0 1 0 2H8a1 1 0 0 1-1-1" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M2 12a1 1 0 0 1 0 2H1a1 1 0 0 1 0-2zm13 0a1 1 0 0 1 0 2H6a1 1 0 0 1 0-2zM2 7a1 1 0 0 1 0 2H1a1 1 0 0 1 0-2zm13 0a1 1 0 0 1 0 2H6a1 1 0 0 1 0-2zM2 2a1 1 0 0 1 0 2H1a1 1 0 0 1 0-2zm13 0a1 1 0 0 1 0 2H6a1 1 0 0 1 0-2z"/></svg>
  )
}
