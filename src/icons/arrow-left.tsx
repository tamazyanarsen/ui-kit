import type { IconProps } from "./types"

// icon / arrow left — 08. Arrows, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function ArrowLeft({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M10.207 18.364a1 1 0 0 1-1.414 0l-5.657-5.657a1 1 0 0 1 0-1.414l5.657-5.657a1 1 0 0 1 1.414 1.414L6.257 11h13.9a1 1 0 0 1 0 2h-13.9l3.95 3.95a1 1 0 0 1 0 1.414" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M6.234.293a1 1 0 1 1 1.415 1.414l-.77.77h4.657a1.001 1.001 0 0 1 0 2H6.88l.769.77a1 1 0 1 1-1.415 1.414L3.758 4.184a1 1 0 0 1 0-1.415z"/></svg>
  )
}
