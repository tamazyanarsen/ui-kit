import type { IconProps } from "./types"

// icon / minus circle, delete widget — 05. Check Plus Minus Close, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function MinusCircleDeleteWidget({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><g transform="translate(-160 -500)"><defs><clipPath id="minus-circle-delete-widget-24-clip2_70326_26"><path fill="#fff" d="M160 500h24v24h-24z"/></clipPath></defs><g clipPath="url(#minus-circle-delete-widget-24-clip2_70326_26)"><path fill="currentColor" fillRule="evenodd" d="M172 502c-5.523 0-10 4.477-10 10s4.477 10 10 10 10-4.477 10-10-4.477-10-10-10m-12 10c0-6.627 5.373-12 12-12s12 5.373 12 12-5.373 12-12 12-12-5.373-12-12m6.286 0a1 1 0 0 1 1-1h9.428a1 1 0 1 1 0 2h-9.428a1 1 0 0 1-1-1" clipRule="evenodd"/></g></g></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><g transform="translate(-56 -504)"><defs><clipPath id="minus-circle-delete-widget-16-clip3_70326_26"><path fill="#fff" d="M56 504h16v16H56z"/></clipPath></defs><g clipPath="url(#minus-circle-delete-widget-16-clip3_70326_26)"><path fill="currentColor" d="M70 512a6 6 0 1 0-12 0 6 6 0 0 0 12 0m-3-1a1 1 0 0 1 0 2h-6a1 1 0 0 1 0-2zm5 1a8 8 0 1 1-16 0 8 8 0 0 1 16 0"/></g></g></svg>
  )
}
