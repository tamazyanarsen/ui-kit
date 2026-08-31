import type { IconProps } from "./types"

// icon / alert — 04. Errors Allert Info, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Alert({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><g transform="translate(-156 -116)"><defs><clipPath id="alert-24-clip0_70326_26"><path fill="#fff" d="M156 116h24v24h-24z"/></clipPath></defs><g fill="currentColor" clipPath="url(#alert-24-clip0_70326_26)"><path fillRule="evenodd" d="M168 118c-5.523 0-10 4.477-10 10s4.477 10 10 10 10-4.477 10-10-4.477-10-10-10m-12 10c0-6.627 5.373-12 12-12s12 5.373 12 12-5.373 12-12 12-12-5.373-12-12" clipRule="evenodd"/><path fillRule="evenodd" d="M168 121a1 1 0 0 1 1 1v8a1 1 0 0 1-2 0v-8a1 1 0 0 1 1-1" clipRule="evenodd"/><path d="M169 134a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/></g></g></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><g transform="translate(-60 -120)"><defs><clipPath id="alert-16-clip1_70326_26"><path fill="#fff" d="M60 120h16v16H60z"/></clipPath></defs><g fill="currentColor" clipPath="url(#alert-16-clip1_70326_26)"><path d="M74 128a6 6 0 1 0-12 0 6 6 0 0 0 12 0m-7 0v-3a1 1 0 0 1 2 0v3a1 1 0 0 1-2 0m9 0a8 8 0 1 1-16 0 8 8 0 0 1 16 0"/><path d="M69 131a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/></g></g></svg>
  )
}
