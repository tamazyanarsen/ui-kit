import type { IconProps } from "./types"

// icon / pause — 09. Settings Menus, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Pause({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M9 21c-.552 0-1-.45-1-1V4c0-.55.448-1 1-1s1 .45 1 1v16c0 .55-.448 1-1 1m6 0c-.552 0-1-.45-1-1V4c0-.55.448-1 1-1s1 .45 1 1v16c0 .55-.448 1-1 1" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M10 3c0-.55.448-1 1-1s1 .45 1 1v10c0 .55-.448 1-1 1s-1-.45-1-1zM4 3c0-.55.448-1 1-1s1 .45 1 1v10c0 .55-.448 1-1 1s-1-.45-1-1z"/></svg>
  )
}
