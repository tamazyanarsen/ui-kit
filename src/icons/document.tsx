import type { IconProps } from "./types"

// icon / document — 16. Docs, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Document({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M3 2a2 2 0 0 1 2-2h10c.265 0 .52.105.707.293l6 6A1 1 0 0 1 22 7v15a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zm11 0H5v20h15V8h-4a2 2 0 0 1-2-2zm2 1.414L18.586 6H16zM7 12a1 1 0 0 1 1-1h9a1 1 0 0 1 0 2H8a1 1 0 0 1-1-1m0 5a1 1 0 0 1 1-1h9a1 1 0 0 1 0 2H8a1 1 0 0 1-1-1" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M9.586 0A2 2 0 0 1 11 .586L13.414 3A2 2 0 0 1 14 4.414V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zM4 14h8V6H9a1 1 0 0 1-1-1V2H4zm6-3.5a1 1 0 0 1 0 2H6a1 1 0 0 1 0-2zm0-3a1 1 0 0 1 0 2H6a1 1 0 0 1 0-2zM10 4h1.586L10 2.414z"/></svg>
  )
}
