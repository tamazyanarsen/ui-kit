import type { IconProps } from "./types"

// icon / minimize — 09. Settings Menus, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Minimize({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M13 2c.552 0 1 .45 1 1v6c0 .55.448 1 1 1h6c.552 0 1 .45 1 1s-.448 1-1 1h-6c-1.657 0-3-1.34-3-3V3c0-.55.448-1 1-1M2 13c0-.55.448-1 1-1h6c1.657 0 3 1.34 3 3v6c0 .55-.448 1-1 1s-1-.45-1-1v-6c0-.55-.448-1-1-1H3c-.552 0-1-.45-1-1" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M5.5 7.5c1.657 0 3 1.34 3 3v4c0 .55-.448 1-1 1s-1-.45-1-1v-4c0-.55-.448-1-1-1h-4c-.552 0-1-.45-1-1s.448-1 1-1zm3-7c.552 0 1 .45 1 1v4c0 .55.448 1 1 1h4c.552 0 1 .45 1 1s-.448 1-1 1h-4c-1.657 0-3-1.34-3-3v-4c0-.55.448-1 1-1"/></svg>
  )
}
