import type { IconProps } from "./types"

// icon / arrow down left debiting — 08. Arrows, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function ArrowDownLeftDebiting({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M12 2C6.477 2 2 6.48 2 12s4.477 10 10 10 10-4.48 10-10S17.523 2 12 2M0 12C0 5.37 5.373 0 12 0s12 5.37 12 12-5.373 12-12 12S0 18.63 0 12m17.061-5.06c.39.39.39 1.02 0 1.41l-7 7h3.686c.552 0 1 .45 1 1 0 .56-.448 1-1 1H7.646c-.552 0-1-.44-1-1v-6.1a1.001 1.001 0 0 1 2 0v3.69l7-7a1 1 0 0 1 1.415 0" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M3.758 12.24a5.987 5.987 0 0 0 8.485 0 5.994 5.994 0 0 0 0-8.48 5.987 5.987 0 0 0-8.485 0 5.99 5.99 0 0 0 0 8.48m6.245-1.74a1 1 0 0 1-.999 1H5.501c-.553 0-1-.45-1-1L4.5 7c0-.56.448-1 1-1s1 .45 1 1v1.09l3.293-3.3a1 1 0 0 1 1.414 0c.391.39.391 1.03 0 1.42L7.915 9.5h1.088c.552 0 1 .45 1 1m-7.66 3.16a8.01 8.01 0 0 1 0-11.32 8.01 8.01 0 0 1 11.314 0 8.01 8.01 0 0 1 0 11.32 8.01 8.01 0 0 1-11.314 0"/></svg>
  )
}
