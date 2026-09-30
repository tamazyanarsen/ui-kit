import type { IconProps } from "./types"

// icon / Copy — набор ALL ICONS.
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Copy({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M10 0a2 2 0 0 0-2 2v3H4a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3h4a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm6 17h4V2H10v3h4a2 2 0 0 1 2 2zM4 7h10v15H4z" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0.333 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M7 0a2 2 0 0 0-2 2v1.333H3a2 2 0 0 0-2 2v9.334a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1.334h2a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm4 11.333h2V2H7v1.333h2a2 2 0 0 1 2 2zm-8-6h6v9.334H3z" clipRule="evenodd"/></svg>
  )
}
