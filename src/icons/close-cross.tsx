import type { IconProps } from "./types"

// icon / close cross — 05. Check Plus Minus Close, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function CloseCross({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M4 4a1 1 0 0 1 1.414 0l6.364 6.364L18.142 4a1 1 0 0 1 1.414 1.415l-6.364 6.363 6.364 6.364a1 1 0 1 1-1.414 1.415l-6.364-6.364-6.364 6.364A1 1 0 0 1 4 18.143l6.364-6.365L4 5.414A1 1 0 0 1 4 4" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M11.878 2.707a1 1 0 0 1 1.414 1.414L9.413 7.999l3.879 3.879a1 1 0 0 1-1.414 1.414L7.999 9.413l-3.878 3.88a.999.999 0 1 1-1.414-1.414l3.878-3.88-3.878-3.878a.999.999 0 1 1 1.414-1.414l3.878 3.878z"/></svg>
  )
}
