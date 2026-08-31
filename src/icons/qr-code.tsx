import type { IconProps } from "./types"

// icon / QR-code — 14. Device, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function QrCode({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M10 16c.552 0 1 .45 1 1v3c0 .55-.448 1-1 1s-1-.45-1-1v-2H5v2c0 .55-.448 1-1 1s-1-.45-1-1v-3c0-.55.448-1 1-1zm3-13c.552 0 1 .45 1 1v9h6c.552 0 1 .45 1 1v6c0 .55-.448 1-1 1h-6c-.552 0-1-.45-1-1v-6H4c-.552 0-1-.45-1-1V4c0-.55.448-1 1-1zm2 16h4v-4h-4zM5 12h7V5H5zm15-9c.552 0 1 .45 1 1v6c0 .55-.448 1-1 1h-3c-.552 0-1-.45-1-1s.448-1 1-1h2V5h-2c-.552 0-1-.45-1-1s.448-1 1-1zm-10 7H7V7h3z"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M7 11c.552 0 1 .45 1 1v2c0 .55-.448 1-1 1s-1-.45-1-1v-1H3v1c0 .55-.448 1-1 1s-1-.45-1-1v-2c0-.55.448-1 1-1zM9 1c.552 0 1 .45 1 1v7h4c.552 0 1 .45 1 1v4c0 .55-.448 1-1 1h-4c-.552 0-1-.45-1-1v-4H2c-.552 0-1-.45-1-1V2c0-.55.448-1 1-1zm2 12h2v-2h-2zM3 8h5V3H3zm11-7c.552 0 1 .45 1 1v5c0 .55-.448 1-1 1h-2c-.552 0-1-.45-1-1s.448-1 1-1h1V3h-1c-.552 0-1-.45-1-1s.448-1 1-1zM7.167 7.17H3.833V3.83h3.334z"/></svg>
  )
}
