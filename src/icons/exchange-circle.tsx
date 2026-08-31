import type { IconProps } from "./types"

// icon / exchange circle — 22. Product, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function ExchangeCircle({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><g transform="translate(-104 -1396)"><defs><clipPath id="exchange-circle-24-clip5_70326_26"><path fill="#fff" d="M104 1396h24v24h-24z"/></clipPath></defs><g clipPath="url(#exchange-circle-24-clip5_70326_26)"><path fill="currentColor" fillRule="evenodd" d="M116 1398c-5.523 0-10 4.48-10 10s4.477 10 10 10 10-4.48 10-10-4.477-10-10-10m-12 10c0-6.63 5.373-12 12-12s12 5.37 12 12-5.373 12-12 12-12-5.37-12-12m15.032-6.77a1 1 0 0 1 1.415 0l2.522 2.52c.39.39.39 1.03 0 1.42l-2.522 2.52c-.391.39-1.024.39-1.415 0a.996.996 0 0 1 0-1.41l.816-.82H111c-.552 0-1-.45-1-1s.448-1 1-1h8.848l-.816-.82a.996.996 0 0 1 0-1.41m-6.064 7c.391.39.391 1.03 0 1.42l-.815.81H121c.552 0 1 .45 1 1s-.448 1-1 1h-8.848l.816.82a.994.994 0 0 1 0 1.41 1 1 0 0 1-1.414 0l-2.522-2.52a.994.994 0 0 1 0-1.41l2.522-2.53a1 1 0 0 1 1.414 0" clipRule="evenodd"/></g></g></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><g transform="translate(-56 -1400)"><defs><clipPath id="exchange-circle-16-clip6_70326_26"><path fill="#fff" d="M56 1400h16v16H56z"/></clipPath></defs><g clipPath="url(#exchange-circle-16-clip6_70326_26)"><path fill="currentColor" d="M64 1400a8 8 0 0 0-8 8 8 8 0 0 0 8 8 8 8 0 0 0 8-8 8 8 0 0 0-8-8m0 2c3.314 0 6 2.69 6 6s-2.686 6-6 6-6-2.69-6-6 2.687-6 6-6m-1.249 5.74a1 1 0 0 0-1.414 0l-1.547 1.54c-.113.11-.198.26-.247.41a1 1 0 0 0-.042.24l-.004.06.004.06a1.03 1.03 0 0 0 .289.65l1.547 1.54a1 1 0 0 0 1.414 0c.34-.34.383-.86.13-1.25h2.564c.552 0 1-.45 1-1s-.448-1-1-1h-2.564a.996.996 0 0 0-.13-1.25m3.949-3.94a1 1 0 0 0-1.414 0 .995.995 0 0 0-.154 1.21h-2.451a1.001 1.001 0 0 0 0 2h2.451a.995.995 0 0 0 .154 1.21 1 1 0 0 0 1.414 0l1.506-1.5a1 1 0 0 0 .173-.24.7.7 0 0 0 .06-.13 1 1 0 0 0 .034-.57c-.041-.17-.13-.34-.267-.48z"/></g></g></svg>
  )
}
