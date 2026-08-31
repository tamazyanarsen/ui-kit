import type { IconProps } from "./types"

// icon / external link — 03. Copy Link Share Download Upload, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function ExternalLink({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M3 18V6a3 3 0 0 1 3-3h4a1 1 0 0 1 0 2H6a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-4a1 1 0 0 1 2 0v4a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3m18-9a1 1 0 0 1-2 0V6.414l-6.293 6.293a.999.999 0 1 1-1.414-1.414L17.586 5H15a1 1 0 0 1 0-2h5a1 1 0 0 1 1 1z"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M1.666 12V4a2.335 2.335 0 0 1 2.333-2.333h2.667a1 1 0 1 1 0 2H3.999A.335.335 0 0 0 3.666 4v8a.336.336 0 0 0 .333.334h8a.34.34 0 0 0 .237-.098.34.34 0 0 0 .098-.236V9.334a1 1 0 1 1 2 0V12a2.335 2.335 0 0 1-2.335 2.334h-8A2.336 2.336 0 0 1 1.666 12m12.668-6a1.001 1.001 0 0 1-2 0v-.92L8.707 8.707a1 1 0 0 1-1.414-1.414l3.626-3.626h-.92a1.001 1.001 0 0 1 0-2h3.335a1 1 0 0 1 1 1z"/></svg>
  )
}
