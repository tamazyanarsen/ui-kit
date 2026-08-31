import type { IconProps } from "./types"

// icon / ad — 11. Call Message, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Ad({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M18.82 4c-.416 0-.823.13-1.162.373L11.18 9H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h1v3a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3h.18l6.478 4.627c.339.243.746.373 1.162.373H19a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM9 15H8v3h1zm2-2h.18c.416 0 .823.13 1.162.373L18.82 18H19V6h-.18l-6.478 4.627A2 2 0 0 1 11.18 11H5v2z" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M10.828 2.6c1.322-.956 3.171-.012 3.172 1.62v7.577c0 1.581-1.735 2.517-3.046 1.705l-.126-.084L8 11.371v.138a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V10.23c-.597-.346-1-.991-1-1.73v-1a2 2 0 0 1 2-2h2.819zM7.729 7.311a1 1 0 0 1-.586.189H4v1h3.118a1 1 0 0 1 .586.19L12 11.797V4.221zM5 11.509h1V10.5H5z"/></svg>
  )
}
