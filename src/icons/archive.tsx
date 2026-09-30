import type { IconProps } from "./types"

// icon / archive — 18. Other, набор ALL ICONS.
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Archive({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M1 3.9c0-.497.41-.9.916-.9h20.167c.507 0 .916.403.916.9v4.5c0 .496-.41.9-.916.9h-.917v10.8c0 .497-.41.9-.916.9H3.75a.91.91 0 0 1-.917-.9V9.3h-.917A.91.91 0 0 1 1 8.4zm3.666 5.4v9.9h14.667V9.3zm16.5-1.8H2.833V4.8h18.333zM9.25 12c0-.497.41-.9.916-.9h3.667c.506 0 .916.403.916.9 0 .496-.41.9-.916.9h-3.667a.91.91 0 0 1-.916-.9" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M14 2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1v6a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zM4 12h8V7H4zm4.599-4a1 1 0 1 1 0 2h-2a1 1 0 0 1 0-2zm-5.6-3h10V4H3z"/></svg>
  )
}
