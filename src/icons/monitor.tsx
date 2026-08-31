import type { IconProps } from "./types"

// icon / monitor — 14. Device, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Monitor({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M4 4c-.552 0-1 .45-1 1v10c0 .55.448 1 1 1h16c.552 0 1-.45 1-1V5c0-.55-.448-1-1-1zm9 14h7c1.657 0 3-1.34 3-3V5c0-1.66-1.343-3-3-3H4C2.343 2 1 3.34 1 5v10c0 1.66 1.343 3 3 3h7v2H8c-.552 0-1 .45-1 1s.448 1 1 1h8c.552 0 1-.45 1-1s-.448-1-1-1h-3z" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="#000" d="M12 2c1.657 0 3 1.34 3 3v4c0 1.66-1.343 3-3 3H9.005v1H11c.552 0 1 .45 1 1s-.448 1-1 1H5c-.552 0-1-.45-1-1s.448-1 1-1h2.005v-1H4c-1.657 0-3-1.34-3-3V5c0-1.66 1.343-3 3-3zM4 4c-.552 0-1 .45-1 1v4c0 .55.448 1 1 1h8c.552 0 1-.45 1-1V5c0-.55-.448-1-1-1z"/></svg>
  )
}
