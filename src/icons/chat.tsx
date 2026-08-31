import type { IconProps } from "./types"

// icon / chat — 11. Call Message, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Chat({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M1 3a2 2 0 0 1 2-2h18a2 2 0 0 1 2 2v18a1 1 0 0 1-1.664.747L17.12 18H3a2 2 0 0 1-2-2zm20 0H3v13h14.12c.49 0 .962.18 1.329.505L21 18.773zM6 7a1 1 0 0 1 1-1h10a1 1 0 0 1 0 2H7a1 1 0 0 1-1-1m0 5a1 1 0 0 1 1-1h5a1 1 0 0 1 0 2H7a1 1 0 0 1-1-1" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M14 2a1 1 0 0 1 1 1v11a1 1 0 0 1-1.651.759l-2.418-2.074H2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zM3 10.685h8.3l.089.003c.207.019.404.101.562.237l1.049.899V4H3zM8 8a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2zm2-3a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2z"/></svg>
  )
}
