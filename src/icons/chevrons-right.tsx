import type { IconProps } from "./types"

// icon / chevrons-right — 09. Settings Menus, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function ChevronsRight({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M5.293 6.29a1 1 0 0 1 1.414 0l5 5c.391.39.391 1.03 0 1.42l-5 5a1 1 0 0 1-1.414 0 1.006 1.006 0 0 1 0-1.42L9.586 12 5.293 7.71a1.006 1.006 0 0 1 0-1.42m7 0a1 1 0 0 1 1.414 0l5 5c.391.39.391 1.03 0 1.42l-5 5a1 1 0 0 1-1.414 0 1.006 1.006 0 0 1 0-1.42L16.586 12l-4.293-4.29a1.006 1.006 0 0 1 0-1.42" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="#000" d="M3.144 3.44a1 1 0 0 1 1.414 0L8.41 7.29c.39.39.391 1.03 0 1.42l-3.852 3.85a1 1 0 0 1-1.414 0c-.39-.39-.39-1.03 0-1.42L6.289 8 3.144 4.86c-.39-.4-.39-1.03 0-1.42m4.8 0a1 1 0 0 1 1.414 0l3.852 3.85c.39.39.39 1.03 0 1.42l-3.852 3.85a1 1 0 0 1-1.414 0c-.39-.39-.39-1.03 0-1.42L11.089 8 7.944 4.86c-.39-.4-.39-1.03 0-1.42"/></svg>
  )
}
