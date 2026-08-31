import type { IconProps } from "./types"

// icon / check circle — 05. Check Plus Minus Close, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function CheckCircle({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M17.765 8.56a1 1 0 0 1-.033 1.413L11.01 16.39a1 1 0 0 1-1.381 0l-3.361-3.208a1 1 0 1 1 1.381-1.447l2.67 2.549 6.032-5.757a1 1 0 0 1 1.414.033" clipRule="evenodd"/><path fill="currentColor" fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2M0 12C0 5.373 5.373 0 12 0s12 5.373 12 12-5.373 12-12 12S0 18.627 0 12" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M14 8A6 6 0 1 0 2 8a6 6 0 0 0 12 0m-3.482-2.474a1 1 0 1 1 1.38 1.448l-4.277 4.083a1 1 0 0 1-1.381 0L4.102 9.015a.999.999 0 1 1 1.38-1.447L6.931 8.95zM16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0"/></svg>
  )
}
