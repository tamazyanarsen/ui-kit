import type { IconProps } from "./types"

// icon / trash — 09. Settings Menus, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Trash({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M10 3a.997.997 0 0 0-1 1v1h6V4a.997.997 0 0 0-1-1zm7 2V4c0-.796-.316-1.559-.879-2.121A3 3 0 0 0 14 1h-4c-.796 0-1.559.316-2.121.879A3 3 0 0 0 7 4v1H3a1 1 0 0 0 0 2h1v13c0 .796.316 1.559.879 2.121A3 3 0 0 0 7 23h10c.796 0 1.559-.316 2.121-.879A3 3 0 0 0 20 20V7h1a1 1 0 0 0 0-2zM6 7v13a.997.997 0 0 0 1 1h10a.997.997 0 0 0 1-1V7zm4 3a1 1 0 0 1 1 1v6a1 1 0 0 1-2 0v-6a1 1 0 0 1 1-1m3 1a1 1 0 0 1 2 0v6a1 1 0 0 1-2 0z" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><g transform="translate(-56 -312)"><defs><clipPath id="trash-16-clip1_70326_26"><path fill="#fff" d="M56 312h16v16H56z"/></clipPath></defs><g clipPath="url(#trash-16-clip1_70326_26)"><path fill="currentColor" d="M67.9 316.8h-7.8v8.8a.4.4 0 0 0 .399.4h7a.4.4 0 0 0 .401-.4zm-6.6 6.7v-4.2a1 1 0 0 1 2 0v4.2a1 1 0 0 1-2 0m3.4 0v-4.2a1 1 0 1 1 2 0v4.2a1 1 0 0 1-2 0m1.099-9.1a.4.4 0 0 0-.399-.4h-2.8a.4.4 0 0 0-.4.4v.4h3.599zm2 .4h2.5a1 1 0 1 1 0 2H69.9v8.8a2.4 2.4 0 0 1-2.401 2.4h-7a2.4 2.4 0 0 1-2.399-2.4v-8.8h-.4a1 1 0 1 1 0-2h2.5v-.4a2.4 2.4 0 0 1 2.4-2.4h2.8a2.4 2.4 0 0 1 2.399 2.4z"/></g></g></svg>
  )
}
