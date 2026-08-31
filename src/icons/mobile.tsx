import type { IconProps } from "./types"

// icon / mobile — 14. Device, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Mobile({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M0 4a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v16a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3zm3-1a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zm16.269 4.318a1 1 0 0 1 1.413-.049C22.104 8.595 23 10.444 23 12.5s-.896 3.905-2.318 5.231a1 1 0 1 1-1.364-1.462C20.368 15.289 21 13.956 21 12.5s-.632-2.789-1.682-3.769a1 1 0 0 1-.049-1.413M16.306 9.28a1 1 0 0 1 1.414.026A4.6 4.6 0 0 1 19 12.5a4.6 4.6 0 0 1-1.28 3.194 1 1 0 1 1-1.44-1.388c.443-.459.72-1.095.72-1.806s-.277-1.347-.72-1.806a1 1 0 0 1 .026-1.414M5.5 18.728a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2h-1a1 1 0 0 1-1-1" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M11 3.5a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1zm2 9a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-9a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3z"/><path fill="currentColor" d="M8.5 10.333a1 1 0 0 1 0 2h-1a1 1 0 1 1 0-2z"/></svg>
  )
}
