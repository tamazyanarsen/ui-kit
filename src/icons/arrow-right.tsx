import type { IconProps } from "./types"

// icon / arrow right — 08. Arrows, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function ArrowRight({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M13.793 18.364a1 1 0 0 0 1.414 0l5.657-5.657a1 1 0 0 0 0-1.414l-5.657-5.657a1 1 0 0 0-1.414 1.414l3.95 3.95h-13.9a1 1 0 0 0 0 2h13.9l-3.95 3.95a1 1 0 0 0 0 1.414" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M8.352 6.661a1 1 0 0 0 1.414 0l2.477-2.477a1 1 0 0 0 0-1.414L9.766.292a1 1 0 0 0-1.414 1.415l.77.77H4.465a1 1 0 0 0 0 2h4.657l-.77.77a1 1 0 0 0 0 1.414"/></svg>
  )
}
