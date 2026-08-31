import type { IconProps } from "./types"

// icon / other — 20. User Interface, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Other({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M1 3a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2zm8 0H3v6h6zm4 0a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-6a2 2 0 0 1-2-2zm8 0h-6v6h6zM1 15a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2zm8 0H3v6h6zm9 0a3 3 0 1 0 0 6 3 3 0 0 0 0-6m-5 3a5 5 0 1 1 10.001.001A5 5 0 0 1 13 18" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="#000" d="M6.5 8.5a1 1 0 0 1 1 1V14a1 1 0 0 1-.898.995L6.5 15H2l-.102-.005a1 1 0 0 1-.893-.892L1 14V9.5a1 1 0 0 1 1-1zm5.25 0a3.25 3.25 0 1 1 0 6.5 3.25 3.25 0 0 1 0-6.5m0 2a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5M3 13h2.5v-2.5H3zM6.5 1a1 1 0 0 1 1 1v4.5a1 1 0 0 1-.898.995L6.5 7.5H2l-.102-.005a1 1 0 0 1-.893-.892L1 6.5V2a1 1 0 0 1 1-1zM14 1a1 1 0 0 1 1 1v4.5a1 1 0 0 1-.897.995L14 7.5H9.5l-.103-.005a1 1 0 0 1-.892-.892L8.5 6.5V2a1 1 0 0 1 1-1zM3 5.5h2.5V3H3zm7.5 0H13V3h-2.5z"/></svg>
  )
}
