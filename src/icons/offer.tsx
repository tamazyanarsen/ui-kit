import type { IconProps } from "./types"

// icon / offer — 22. Product, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Offer({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M14.5 0a1 1 0 0 1 1 1v5h5a1 1 0 1 1 0 2h-6a1 1 0 0 1-1-1V1a1 1 0 0 1 1-1m1.813 14.819a1 1 0 0 1 0 1.415l-3.607 3.606a1 1 0 0 1-1.414 0l-3.606-3.606A1 1 0 1 1 9.1 14.819l1.899 1.9v-5.9a1 1 0 0 1 2 0v5.9l1.9-1.9a1 1 0 0 1 1.414 0" clipRule="evenodd"/><path fill="currentColor" fillRule="evenodd" d="M2.5 2a2 2 0 0 1 2-2h9.586A2 2 0 0 1 15.5.586L20.914 6a2 2 0 0 1 .586 1.414V22a2 2 0 0 1-2 2h-15a2 2 0 0 1-2-2zm11.586 0H4.5v20h15V7.414z" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="#000" d="M10.586 0A2 2 0 0 1 12 .586L14.414 3A2 2 0 0 1 15 4.414V14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zM3 14h10V6h-2a2 2 0 0 1-2-2V2H3zm5-8.914a1 1 0 0 1 1 1V9.5l.707-.707a1 1 0 1 1 1.414 1.414l-2.414 2.414a1 1 0 0 1-1.414 0l-2.414-2.414a1 1 0 1 1 1.414-1.414L7 9.5V6.086a1 1 0 0 1 1-1M11 4h1.586L11 2.414z"/></svg>
  )
}
