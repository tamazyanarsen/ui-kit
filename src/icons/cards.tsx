import type { IconProps } from "./types"

// icon / cards — 13. Money Card, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Cards({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M6 4v4h12.308C19.206 8 20 8.711 20 9.667V14h2V4zm14 12h2.308c.898 0 1.692-.711 1.692-1.667V3.667C24 2.711 23.206 2 22.308 2H5.692C4.794 2 4 2.711 4 3.667V8H1.692C.794 8 0 8.711 0 9.667v10.666C0 21.289.794 22 1.692 22h16.616c.898 0 1.692-.711 1.692-1.667zM2 10v2h16v-2zm16 4H2v6h16zm-5 4a1 1 0 0 1 1-1h2a1 1 0 0 1 0 2h-2a1 1 0 0 1-1-1" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M14 1a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-1v2a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h1V3a2 2 0 0 1 2-2zM2 14h9v-4H2zm7-3a1 1 0 0 1 0 2H8a1 1 0 0 1 0-2zM5 5h6a2 2 0 0 1 2 2v3h1V3H5zM2 8h9V7H2z"/></svg>
  )
}
