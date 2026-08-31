import type { IconProps } from "./types"

// icon / payments — 22. Product, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Payments({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M3 4v16h18V4zM1 4c0-.9.623-2 1.81-2h18.38C22.377 2 23 3.1 23 4v16c0 1.1-.895 2-2 2H2.81C1.623 22 1 20.9 1 20zm11.293 4.29a1 1 0 0 1 1.414 0l3 3c.391.39.391 1.03 0 1.42l-3 3a1 1 0 0 1-1.414 0 1.006 1.006 0 0 1 0-1.42L13.586 13H8c-.552 0-1-.45-1-1s.448-1 1-1h5.586l-1.293-1.29a1.006 1.006 0 0 1 0-1.42" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="#000" d="M15 1c.552 0 1 .45 1 1v12c0 .55-.448 1-1 1H1c-.552 0-1-.45-1-1V2c0-.55.448-1 1-1zM2 13h12V3H2zm5.707-8.12a1 1 0 0 1 1.414 0l2.414 2.41c.391.39.391 1.03 0 1.42l-2.414 2.41a1 1 0 0 1-1.414 0 .996.996 0 0 1 0-1.41L8.414 9H5c-.552 0-1-.45-1-1s.448-1 1-1h3.414l-.707-.71a.996.996 0 0 1 0-1.41"/></svg>
  )
}
