import type { IconProps } from "./types"

// icon / signin — 06. Users, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Signin({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M11 3a1 1 0 0 1 1-1h6a3 3 0 0 1 3 3v14a3 3 0 0 1-3 3h-6a1 1 0 0 1 0-2h6a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-6a1 1 0 0 1-1-1M9.942 8.177a1 1 0 0 1 1.415 0l3.733 3.733a1 1 0 0 1 0 1.414l-3.733 3.733a1 1 0 1 1-1.415-1.414l2.026-2.026H3.617a1 1 0 1 1 0-2h8.351L9.942 9.592a1 1 0 0 1 0-1.415" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M13.637 13.728V2.272A.273.273 0 0 0 13.363 2H8.272a1 1 0 0 1 0-2h5.091a2.273 2.273 0 0 1 2.274 2.272v11.456A2.273 2.273 0 0 1 13.363 16H8.272a1 1 0 0 1 0-2h5.091a.273.273 0 0 0 .274-.272M6.672 4.49a1 1 0 0 1 1.414 0l2.903 2.904a1 1 0 0 1 0 1.414l-2.903 2.903a1 1 0 0 1-1.414-1.414l1.196-1.196H1.909a1 1 0 0 1 0-2h5.959L6.672 5.904a1 1 0 0 1 0-1.414"/></svg>
  )
}
