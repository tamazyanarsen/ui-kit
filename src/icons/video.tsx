import type { IconProps } from "./types"

// icon / video — 14. Device, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Video({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M3 6c-.552 0-1 .45-1 1v10c0 .55.448 1 1 1h11c.552 0 1-.45 1-1V7c0-.55-.448-1-1-1zm14 4.06V7c0-1.66-1.343-3-3-3H3C1.343 4 0 5.34 0 7v10c0 1.66 1.343 3 3 3h11c1.657 0 3-1.34 3-3v-3.06l5.419 3.87a1 1 0 0 0 1.039.08c.333-.17.542-.52.542-.89V7c0-.37-.209-.72-.542-.89a1 1 0 0 0-1.039.08zm.72 1.94L22 15.06V8.94z" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="#000" d="M9 3c1.657 0 3 1.34 3 3l2.4-1.8a.99.99 0 0 1 1.047-.09c.339.16.553.51.553.89v6c0 .38-.214.73-.553.89a.99.99 0 0 1-1.047-.09L12 10c0 1.66-1.343 3-3 3H3c-1.657 0-3-1.34-3-3V6c0-1.66 1.343-3 3-3zM3 5c-.552 0-1 .45-1 1v4c0 .55.448 1 1 1h6c.552 0 1-.45 1-1V6c0-.55-.448-1-1-1zm9.666 3L14 9V7z"/></svg>
  )
}
