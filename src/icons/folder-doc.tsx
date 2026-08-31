import type { IconProps } from "./types"

// icon / folder Doc — 22. Product, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function FolderDoc({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M4 1a1 1 0 0 1 1-1h15a1 1 0 0 1 1 1v11h1a1 1 0 0 1 1 1v8a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3V9a1 1 0 0 1 1-1h2zm2 7h3a1 1 0 0 1 .848.47L12.054 12H19V2H6zm15 6h-9.5a1 1 0 0 1-.848-.47L8.446 10H3v11a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1zM8 5a1 1 0 0 1 1-1h7a1 1 0 0 1 0 2H9a1 1 0 0 1-1-1m4 4a1 1 0 0 1 1-1h3a1 1 0 0 1 0 2h-3a1 1 0 0 1-1-1" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M13 0a1 1 0 0 1 1 1v7h1a1 1 0 0 1 1 1v4a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V7a1 1 0 0 1 1-1h1V1a1 1 0 0 1 1-1zM2 13a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-3H7a1 1 0 0 1-.707-.293L4.586 8H2zm2-7h1c.265 0 .52.105.707.293L7.414 8H12V2H4zm6-3a1 1 0 0 1 0 2H6a1 1 0 0 1 0-2z"/></svg>
  )
}
