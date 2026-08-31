import type { IconProps } from "./types"

// icon / arrow up right replenishment — 08. Arrows, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function ArrowUpRightReplenishment({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M12 2C6.477 2 2 6.48 2 12s4.477 10 10 10 10-4.48 10-10S17.523 2 12 2M0 12C0 5.37 5.373 0 12 0s12 5.37 12 12-5.373 12-12 12S0 18.63 0 12m10.253-3.35c-.552 0-1-.45-1-1 0-.56.448-1 1-1h6.101c.552 0 1 .44 1 1v6.1a1.001 1.001 0 0 1-2 0v-3.69l-7 7c-.391.39-1.024.39-1.415 0a.996.996 0 0 1 0-1.41l7-7z" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M12.243 3.76a5.987 5.987 0 0 0-8.485 0 5.99 5.99 0 0 0 0 8.48 5.987 5.987 0 0 0 8.485 0 5.994 5.994 0 0 0 0-8.48M5.997 5.5c0-.55.448-1 1-1H10.5c.552 0 1 .45 1 1l.001 3.5a.996.996 0 0 1-1 1C9.948 10 9.5 9.55 9.5 9V7.91l-3.292 3.3a1.002 1.002 0 1 1-1.415-1.42L8.086 6.5H6.998c-.553 0-1.001-.45-1.001-1m7.66-3.16a8.01 8.01 0 0 1 0 11.32 8.01 8.01 0 0 1-11.314 0 8.01 8.01 0 0 1 0-11.32 8.01 8.01 0 0 1 11.314 0"/></svg>
  )
}
