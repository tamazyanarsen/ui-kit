import type { IconProps } from "./types"

// icon / compare — 09. Settings Menus, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Compare({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="#000" d="M2 4a1 1 0 0 1 1-1h18a1 1 0 0 1 0 2H3a1 1 0 0 1-1-1m0 7.5a1 1 0 0 1 1-1h18a1 1 0 0 1 0 2H3a1 1 0 0 1-1-1m1 7a1 1 0 0 0 0 2h9a1 1 0 0 0 0-2zm12 1a1 1 0 0 1 1-1h1.5V17a1 1 0 0 1 2 0v1.5H21a1 1 0 0 1 0 2h-1.5V22a1 1 0 0 1-2 0v-1.5H16a1 1 0 0 1-1-1"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M1.333 2.667C1.333 2.299 1.632 2 2 2h12a.667.667 0 0 1 0 1.333H2a.667.667 0 0 1-.667-.666m0 5C1.333 7.299 1.632 7 2 7h12a.667.667 0 0 1 0 1.333H2a.667.667 0 0 1-.667-.666m11 3c.368 0 .667.298.667.666v1h1a.667.667 0 0 1 0 1.334h-1v1a.667.667 0 0 1-1.333 0v-1h-1a.667.667 0 0 1 0-1.334h1v-1c0-.368.298-.666.666-.666M1.333 13c0-.368.299-.667.667-.667h6a.667.667 0 0 1 0 1.334H2A.667.667 0 0 1 1.333 13" clipRule="evenodd"/><path fill="#000" d="M1 2.667a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H2a1 1 0 0 1-1-1m0 5a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H2a1 1 0 0 1-1-1M2 12a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2zm7.667 1a1 1 0 0 1 1-1h.666v-.667a1 1 0 0 1 2 0V12H14a1 1 0 0 1 0 2h-.667v.667a1 1 0 1 1-2 0V14h-.666a1 1 0 0 1-1-1"/></svg>
  )
}
