import type { IconProps } from "./types"

// icon / showcase — 22. Product, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Showcase({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M2 5c0-1.66 1.343-3 3-3h14c1.657 0 3 1.34 3 3v14c0 1.66-1.343 3-3 3H5c-1.657 0-3-1.34-3-3zm3-1c-.552 0-1 .45-1 1v14c0 .55.448 1 1 1h14c.552 0 1-.45 1-1V5c0-.55-.448-1-1-1zm2.5 5.5c0-.55.448-1 1-1h7c.552 0 1 .45 1 1s-.448 1-1 1h-7c-.552 0-1-.45-1-1m0 5c0-.55.448-1 1-1h7c.552 0 1 .45 1 1s-.448 1-1 1h-7c-.552 0-1-.45-1-1" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M12 1c1.657 0 3 1.34 3 3v8c0 1.66-1.343 3-3 3H4c-1.657 0-3-1.34-3-3V4c0-1.66 1.343-3 3-3zM4 3c-.552 0-1 .45-1 1v8c0 .55.448 1 1 1h8c.552 0 1-.45 1-1V4c0-.55-.448-1-1-1zm6 6c.552 0 1 .45 1 1s-.448 1-1 1H6c-.552 0-1-.45-1-1s.448-1 1-1zm0-4c.552 0 1 .45 1 1s-.448 1-1 1H6c-.552 0-1-.45-1-1s.448-1 1-1z"/></svg>
  )
}
