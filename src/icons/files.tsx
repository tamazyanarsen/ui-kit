import type { IconProps } from "./types"

// icon / files — 16. Docs, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Files({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M8.4 3v1.398h4.95c.265 0 .52.106.707.293l4.25 4.25a1 1 0 0 1 .293.707V18H20V6.664L16.336 3zm10.2 17h1.55A1.85 1.85 0 0 0 22 18.15V6.25a1 1 0 0 0-.293-.707l-4.25-4.25A1 1 0 0 0 16.75 1h-8.5A1.85 1.85 0 0 0 6.4 2.85v1.548H4.85A1.85 1.85 0 0 0 3 6.248v15.3a1.85 1.85 0 0 0 1.85 1.85h11.9a1.85 1.85 0 0 0 1.85-1.85zm-2-9.937-3.664-3.665h-5.48a1 1 0 0 1-.112 0H5v15h11.6zM7.25 14.75a1 1 0 0 1 1-1h5.1a1 1 0 0 1 0 2h-5.1a1 1 0 0 1-1-1m0 3.398a1 1 0 0 1 1-1h5.1a1 1 0 0 1 0 2h-5.1a1 1 0 0 1-1-1" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M12 0a1 1 0 0 1 .707.293l3 3A1 1 0 0 1 16 4v8a1 1 0 0 1-1 1h-2v2a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h2V1a1 1 0 0 1 1-1zM4 14h7V7.414L8.586 5H4zm5-3a1 1 0 0 1 0 2H6a1 1 0 0 1 0-2zM7 3h2a1 1 0 0 1 .707.293l3 3A1 1 0 0 1 13 7v4h1V4.414L11.586 2H7zm2 5a1 1 0 0 1 0 2H6a1 1 0 0 1 0-2z"/></svg>
  )
}
