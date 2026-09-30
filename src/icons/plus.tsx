import type { IconProps } from "./types"

// icon / Plus — набор ALL ICONS.
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Plus({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M12.004 2a1 1 0 0 1 1 1v8H21a1 1 0 1 1 0 2h-7.996v8a1 1 0 1 1-2 0v-8H3a1 1 0 1 1 0-2h8.004V3a1 1 0 0 1 1-1" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M7 14V9H2a1 1 0 0 1 0-2h5V2a1 1 0 0 1 2 0v5h5a1 1 0 1 1 0 2H9v5a1 1 0 1 1-2 0"/></svg>
  )
}
