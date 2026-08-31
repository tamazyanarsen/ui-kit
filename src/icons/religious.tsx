import type { IconProps } from "./types"

// icon / religious — 19. Categories, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Religious({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M12 1c.552 0 1 .45 1 1v1h1c.552 0 1 .45 1 1s-.448 1-1 1h-1v2.05l4.164 3.7c.214.19.336.46.336.75V13h2c.53 0 1.039.21 1.414.59.375.37.586.88.586 1.41v6h.5c.552 0 1 .45 1 1s-.448 1-1 1H2c-.552 0-1-.45-1-1s.448-1 1-1h.5v-6c0-.53.211-1.04.586-1.41.375-.38.884-.59 1.414-.59h2v-1.5c0-.29.122-.56.336-.75L11 7.05V5h-1c-.552 0-1-.45-1-1s.448-1 1-1h1V2c0-.55.448-1 1-1m-.167 7.99L8.5 11.95V21H11v-4c0-.55.448-1 1-1s1 .45 1 1v4h2.5v-9.05l-3.333-2.96A1 1 0 0 1 12 9c-.057 0-.113 0-.167-.01M17.5 21h2v-6h-2zm-11 0v-6h-2v6z" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M8.005 0c.552 0 1 .45 1 1v1H10c.552 0 1 .45 1 1s-.448 1-1 1h-.995v1L10.6 6.2c.251.19.4.49.4.8v1h2c.552 0 1 .45 1 1v4c.552 0 1 .45 1 1s-.448 1-1 1H2c-.552 0-1-.45-1-1s.448-1 1-1V9c0-.55.448-1 1-1h2V7c0-.31.149-.61.4-.8L7.005 5V4H6c-.552 0-1-.45-1-1s.448-1 1-1h1.005V1c0-.55.448-1 1-1M11 13h1v-3h-1zm-7 0h1v-3H4zm3-5.5V13h2V7.5l-1-.75z"/></svg>
  )
}
