import type { IconProps } from "./types"

// icon / sent doc — 16. Docs, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function SentDoc({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M2.5 2a2 2 0 0 1 2-2h10c.265 0 .52.105.707.293l6 6A1 1 0 0 1 21.5 7v5a1 1 0 0 1-2 0V8h-4a2 2 0 0 1-2-2V2h-9v20H13a1 1 0 0 1 0 2H4.5a2 2 0 0 1-2-2zm13 1.414L18.086 6H15.5zM6.5 12a1 1 0 0 1 1-1h9a1 1 0 0 1 0 2h-9a1 1 0 0 1-1-1m12.232 2.86a1 1 0 0 1 1.408-.128l3 2.5a1 1 0 0 1 0 1.536l-3 2.5a1 1 0 1 1-1.28-1.536l.878-.732H15a1 1 0 0 1 0-2h4.738l-.878-.732a1 1 0 0 1-.128-1.408M6.5 17a1 1 0 0 1 1-1h4a1 1 0 0 1 0 2h-4a1 1 0 0 1-1-1" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M9.586 0A2 2 0 0 1 11 .586L13.414 3A2 2 0 0 1 14 4.414V8a1 1 0 0 1-2 0V6H9a1 1 0 0 1-1-1V2H4v12h3.5a1 1 0 0 1 0 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm2.707 10.293a1 1 0 0 1 1.414 0l2 2a1 1 0 0 1 0 1.414l-2 2a1 1 0 0 1-1.414-1.415l.292-.292H10a1 1 0 0 1 0-2h2.586l-.293-.293a1 1 0 0 1 0-1.414M7.5 10.5a1 1 0 0 1 0 2H6a1 1 0 0 1 0-2zm2.5-3a1 1 0 0 1 0 2H6a1 1 0 0 1 0-2zM10 4h1.586L10 2.414z"/></svg>
  )
}
