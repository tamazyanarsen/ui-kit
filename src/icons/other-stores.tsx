import type { IconProps } from "./types"

// icon / other stores — 19. Categories, набор ALL ICONS.
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function OtherStores({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M12 3a3 3 0 0 0-3 3h6a3 3 0 0 0-3-3m3 5v2a1 1 0 0 0 2 0V8h2v13H5V8h2v2a1 1 0 0 0 2 0V8zM7 6H4a1 1 0 0 0-1 1v15a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-3A5 5 0 0 0 7 6m0 8a1 1 0 0 1 1-1h8a1 1 0 0 1 0 2H8a1 1 0 0 1-1-1m2 3a1 1 0 0 1 1-1h4a1 1 0 0 1 0 2h-4a1 1 0 0 1-1-1" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M8 1a4 4 0 0 1 3.874 3H13a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h1.126C4.57 2.275 6.136 1 8 1M4 13h8V6H4zm5-3a1 1 0 0 1 0 2H7a1 1 0 0 1 0-2zm1-3a1 1 0 0 1 0 2H6a1 1 0 0 1 0-2zM8 3c-.74 0-1.385.403-1.73 1h3.46C9.386 3.403 8.74 3 8 3"/></svg>
  )
}
