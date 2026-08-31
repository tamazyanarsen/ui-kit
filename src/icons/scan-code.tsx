import type { IconProps } from "./types"

// icon / scan code — 14. Device, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function ScanCode({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><g transform="translate(-164 -628)"><defs><clipPath id="scan-code-24-clip3_70326_26"><path fill="#fff" d="M164 628h24v24h-24z"/></clipPath></defs><g clipPath="url(#scan-code-24-clip3_70326_26)"><path fill="currentColor" fillRule="evenodd" d="M164 629a1 1 0 0 1 1-1h5a1 1 0 0 1 0 2h-4v3a1 1 0 0 1-2 0zm17 0a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v4a1 1 0 0 1-2 0v-3h-4a1 1 0 0 1-1-1m-12.5 6a1 1 0 0 1 1 1v8a1 1 0 0 1-2 0v-8a1 1 0 0 1 1-1m3 0a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0v-2a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1v8a1 1 0 0 1-2 0v-8a1 1 0 0 1 1-1m5 0a1 1 0 0 1 1 1v8a1 1 0 0 1-2 0v-8a1 1 0 0 1 1-1m3 0a1 1 0 0 1 1 1v8a1 1 0 0 1-2 0v-8a1 1 0 0 1 1-1m-12 6a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0v-2a1 1 0 0 1 1-1m-6.5 5a1 1 0 0 1 1 1v3h4a1 1 0 0 1 0 2h-5a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1m22 0a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-5a1 1 0 0 1 0-2h4v-3a1 1 0 0 1 1-1" clipRule="evenodd"/></g></g></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><g transform="translate(-116 -632)"><defs><clipPath id="scan-code-16-clip4_70326_26"><path fill="#fff" d="M116 632h16v16h-16z"/></clipPath></defs><g clipPath="url(#scan-code-16-clip4_70326_26)"><path fill="currentColor" d="M116.989 644a1 1 0 0 1 1 1v1h1a1 1 0 1 1 0 2h-2a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1M131 644a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1 0-2h1v-1a1 1 0 0 1 1-1m-12-8a1 1 0 0 1 1 1v6a1 1 0 0 1-2 0v-6a1 1 0 0 1 1-1m3 5a1 1 0 0 1 1 1v1a1 1 0 0 1-2 0v-1a1 1 0 0 1 1-1m3-5a1 1 0 0 1 1 1v6a1 1 0 0 1-2 0v-6a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1v6a1 1 0 0 1-2 0v-6a1 1 0 0 1 1-1m-7 0a1 1 0 0 1 1 1v1a1 1 0 0 1-2 0v-1a1 1 0 0 1 1-1m-3.011-4a1 1 0 1 1 0 2h-1v1a1 1 0 1 1-2 0v-2a1 1 0 0 1 1-1zM131 632a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0v-1h-1a1 1 0 0 1 0-2z"/></g></g></svg>
  )
}
