import type { IconProps } from "./types"

// icon / credit card — 13. Money Card, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function CreditCard({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M3 6v3h18V6zm20-.222C23 4.806 22.218 4 21.231 4H2.769C1.782 4 1 4.806 1 5.778v12.444C1 19.194 1.782 20 2.769 20h18.462c.987 0 1.769-.806 1.769-1.778zM21 11H3v7h18zm-5 4a1 1 0 0 1 1-1h2a1 1 0 0 1 0 2h-2a1 1 0 0 1-1-1" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M14 12v2H2v-2zm0-8H2v10a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2z"/><path fill="currentColor" d="M14 6v2H2V6z"/></svg>
  )
}
