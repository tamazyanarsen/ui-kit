import type { IconProps } from "./types"

// icon / road — 18. Other, набор ALL ICONS.
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Road({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M8.263.035a1 1 0 0 1 .702 1.228l-6 22a1 1 0 0 1-1.93-.526l6-22A1 1 0 0 1 8.263.035m7.474 0a1 1 0 0 1 1.228.702l6 22a1 1 0 0 1-1.93.526l-6-22a1 1 0 0 1 .702-1.228M12 2a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1m0 5a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V8a1 1 0 0 1 1-1m0 5a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0v-2a1 1 0 0 1 1-1m0 6a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0v-3a1 1 0 0 1 1-1" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M4.023.79a1 1 0 0 1 1.955.42l-3 14a1 1 0 0 1-1.955-.42zM8 12a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0v-2a1 1 0 0 1 1-1M10.79.022a1 1 0 0 1 1.188.768l3 14a1 1 0 0 1-1.955.42l-3-14A1 1 0 0 1 10.79.022M8 7.5a1 1 0 0 1 1 1V10a1 1 0 0 1-2 0V8.5a1 1 0 0 1 1-1m0-4a1 1 0 0 1 1 1v1a1 1 0 0 1-2 0v-1a1 1 0 0 1 1-1M8 0a1 1 0 0 1 1 1v1a1 1 0 0 1-2 0V1a1 1 0 0 1 1-1"/></svg>
  )
}
