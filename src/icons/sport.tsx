import type { IconProps } from "./types"

// icon / sport — 19. Categories, набор ALL ICONS.
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Sport({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M5 7c0-.55.448-1 1-1h3c.552 0 1 .45 1 1v4h4V7c0-.55.448-1 1-1h3c.552 0 1 .45 1 1v1h2c.552 0 1 .45 1 1v2h1c.552 0 1 .45 1 1s-.448 1-1 1h-1v2c0 .55-.448 1-1 1h-2v1c0 .55-.448 1-1 1h-3c-.552 0-1-.45-1-1v-4h-4v4c0 .55-.448 1-1 1H6c-.552 0-1-.45-1-1v-1H3c-.552 0-1-.45-1-1v-2H1c-.552 0-1-.45-1-1s.448-1 1-1h1V9c0-.55.448-1 1-1h2zm0 3H4v4h1zm14 4h1v-4h-1zM7 8v8h1V8zm9 0v8h1V8z" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="#000" d="M6 4c.552 0 1 .45 1 1v2h2V5c0-.55.448-1 1-1h3c.552 0 1 .45 1 1v2h1c.552 0 1 .45 1 1s-.448 1-1 1h-1v2c0 .55-.448 1-1 1h-3c-.552 0-1-.45-1-1V9H7v2c0 .55-.448 1-1 1H3c-.552 0-1-.45-1-1V9H1c-.552 0-1-.45-1-1s.448-1 1-1h1V5c0-.55.448-1 1-1zm-2 6h1V6H4zm7 0h1V6h-1z"/></svg>
  )
}
