import type { IconProps } from "./types"

// icon / in compare — 20. User Interface, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function InCompare({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M3 1a2 2 0 0 0-2 2v18a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm15 6a1 1 0 0 0-2 0v10a1 1 0 0 0 2 0zM7 9a1 1 0 0 1 1 1v7a1 1 0 0 1-2 0v-7a1 1 0 0 1 1-1m6 4a1 1 0 0 0-2 0v4a1 1 0 0 0 2 0z" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M3 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm9 4a1 1 0 0 0-2 0v6a1 1 0 0 0 2 0zM5 5a1 1 0 0 1 1 1v5a1 1 0 0 1-2 0V6a1 1 0 0 1 1-1m4 3a1 1 0 0 0-2 0v3a1 1 0 0 0 2 0z" clipRule="evenodd"/></svg>
  )
}
