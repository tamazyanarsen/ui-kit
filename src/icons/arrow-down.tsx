import type { IconProps } from "./types"

// icon / arrow down — 08. Arrows, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function ArrowDown({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M18.364 13.793a1 1 0 0 1 0 1.414l-5.657 5.657a1 1 0 0 1-1.414 0l-5.657-5.657a1 1 0 0 1 1.414-1.414l3.95 3.95v-13.9a1 1 0 0 1 2 0v13.9l3.95-3.95a1 1 0 0 1 1.414 0" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M2.477 4.465a1 1 0 1 1 2 0v4.656l.77-.77a1 1 0 0 1 1.414 1.414l-2.477 2.478c-.39.39-1.024.39-1.415 0L.293 9.765a.999.999 0 1 1 1.414-1.414l.77.771z"/></svg>
  )
}
