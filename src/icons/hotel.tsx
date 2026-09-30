import type { IconProps } from "./types"

// icon / hotel — 19. Categories, набор ALL ICONS.
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Hotel({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M6 7c-.552 0-1 .45-1 1v2h6V8c0-.55-.448-1-1-1zm6-1.24A3 3 0 0 0 10 5H6C4.343 5 3 6.34 3 8v2.17c-1.165.41-2 1.52-2 2.83v7c0 .55.448 1 1 1s1-.45 1-1v-3h18v3c0 .55.448 1 1 1s1-.45 1-1v-7c0-1.31-.835-2.42-2-2.83V8c0-1.66-1.343-3-3-3h-4c-.768 0-1.469.29-2 .76M19 10V8c0-.55-.448-1-1-1h-4c-.552 0-1 .45-1 1v2zM4 12c-.552 0-1 .45-1 1v2h18v-2c0-.55-.448-1-1-1z" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M6 3c.77 0 1.469.29 2 .77.531-.48 1.23-.77 2-.77h1c1.657 0 3 1.34 3 3v.77c.613.55 1 1.34 1 2.23v4c0 .55-.448 1-1 1s-1-.45-1-1v-1H3v1c0 .55-.448 1-1 1s-1-.45-1-1V9c0-.89.387-1.68 1-2.23V6c0-1.66 1.343-3 3-3zM4 8c-.552 0-1 .45-1 1v1h10V9c0-.55-.448-1-1-1zm6-3c-.552 0-1 .45-1 1h3c0-.55-.448-1-1-1zM5 5c-.552 0-1 .45-1 1h3c0-.55-.448-1-1-1z"/></svg>
  )
}
