import type { IconProps } from "./types"

// icon / chart-bar — 20. User Interface, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function ChartBar({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M2.964 2c.532 0 .964.432.964.964V19.59c0 .267.215.482.482.482h16.626a.965.965 0 0 1 0 1.928H4.41A2.41 2.41 0 0 1 2 19.59V2.964C2 2.432 2.432 2 2.964 2M19.59 3.446c.533 0 .964.431.964.964v12.289a.964.964 0 1 1-1.927 0V4.41c0-.533.431-.964.963-.964m-5.783 4.337c.533 0 .964.432.964.964v7.952a.964.964 0 1 1-1.928 0V8.747c0-.532.432-.964.964-.964M8.024 12.12c.532 0 .964.432.964.964v3.615a.965.965 0 0 1-1.928 0v-3.615c0-.532.432-.964.964-.964" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M2 1a1 1 0 0 1 1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 1 0 2H4a3 3 0 0 1-3-3V2a1 1 0 0 1 1-1m4 7a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0V9a1 1 0 0 1 1-1m4-3a1 1 0 0 1 1 1v5a1 1 0 0 1-2 0V6a1 1 0 0 1 1-1m4-3a1 1 0 0 1 1 1v8a1 1 0 0 1-2 0V3a1 1 0 0 1 1-1"/></svg>
  )
}
