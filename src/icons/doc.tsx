import type { IconProps } from "./types"

// icon / doc — 16. Docs, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Doc({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M2.5 2a2 2 0 0 1 2-2h9.586A2 2 0 0 1 15.5.586L20.914 6a2 2 0 0 1 .586 1.414V22a2 2 0 0 1-2 2h-15a2 2 0 0 1-2-2zm11.586 0H4.5v20h15V7.414zM6.5 12a1 1 0 0 1 1-1h9a1 1 0 0 1 0 2h-9a1 1 0 0 1-1-1m0 5a1 1 0 0 1 1-1h9a1 1 0 0 1 0 2h-9a1 1 0 0 1-1-1" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M10 0a1 1 0 0 1 .707.293l3 3A1 1 0 0 1 14 4v11a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V1a1 1 0 0 1 1-1zM4 14h8V4.414L9.586 2H4zm6-4a1 1 0 0 1 0 2H6a1 1 0 0 1 0-2zm0-3a1 1 0 0 1 0 2H6a1 1 0 0 1 0-2z"/></svg>
  )
}
