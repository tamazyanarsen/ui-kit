import type { IconProps } from "./types"

// icon / arrow up — 08. Arrows, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function ArrowUp({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M5.636 10.207a1 1 0 0 1 0-1.414l5.657-5.657a1 1 0 0 1 1.414 0l5.657 5.657a.999.999 0 1 1-1.414 1.414L13 6.257v13.9a1 1 0 0 1-2 0v-13.9l-3.95 3.95a1 1 0 0 1-1.414 0" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M2.477 11.536V6.878l-.77.771A1 1 0 0 1 .293 6.234l2.476-2.477a1 1 0 0 1 1.415 0l2.477 2.477a1 1 0 1 1-1.414 1.415l-.77-.77v4.657a1.001 1.001 0 0 1-2 0"/></svg>
  )
}
