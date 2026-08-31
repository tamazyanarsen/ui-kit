import type { IconProps } from "./types"

// icon / scan number — 14. Device, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function ScanNumber({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><g transform="translate(-164 -692)"><defs><clipPath id="scan-number-24-clip5_70326_26"><path fill="#fff" d="M164 692h24v24h-24z"/></clipPath></defs><g clipPath="url(#scan-number-24-clip5_70326_26)"><path fill="currentColor" fillRule="evenodd" d="M164 693a1 1 0 0 1 1-1h5a1 1 0 0 1 0 2h-4v3a1 1 0 0 1-2 0zm17 0a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v4a1 1 0 0 1-2 0v-3h-4a1 1 0 0 1-1-1m-5.502 6.5a1 1 0 0 1 1-1h6a1 1 0 0 1 .888 1.46l-4.665 9a1 1 0 1 1-1.775-.92l3.907-7.54h-4.355a1 1 0 0 1-1-1m-5 1a1 1 0 0 1 1 1v2h2a1 1 0 0 1 0 2h-2v2a1 1 0 0 1-2 0v-2h-2a1 1 0 0 1 0-2h2v-2a1 1 0 0 1 1-1M165 710a1 1 0 0 1 1 1v3h4a1 1 0 0 1 0 2h-5a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1m22 0a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-5a1 1 0 0 1 0-2h4v-3a1 1 0 0 1 1-1" clipRule="evenodd"/></g></g></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><g transform="translate(-116 -696)"><defs><clipPath id="scan-number-16-clip6_70326_26"><path fill="#fff" d="M116 696h16v16h-16z"/></clipPath></defs><g clipPath="url(#scan-number-16-clip6_70326_26)"><path fill="currentColor" d="M116.989 708a1 1 0 0 1 1 1v1h1a1 1 0 1 1 0 2h-2a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1M131 708a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1 0-2h1v-1a1 1 0 0 1 1-1m-3-8a1 1 0 0 1 .895 1.447l-3 6a1 1 0 0 1-1.79-.894l2.277-4.553H124a1 1 0 0 1 0-2zm-8 1a1 1 0 0 1 1 1v1h1a1 1 0 0 1 0 2h-1v1a1 1 0 0 1-2 0v-1h-1a1 1 0 0 1 0-2h1v-1a1 1 0 0 1 1-1m-1.011-5a1 1 0 1 1 0 2h-1v1a1 1 0 1 1-2 0v-2a1 1 0 0 1 1-1zM131 696a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0v-1h-1a1 1 0 0 1 0-2z"/></g></g></svg>
  )
}
