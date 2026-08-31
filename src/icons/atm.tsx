import type { IconProps } from "./types"

// icon / ATM — 14. Device, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Atm({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M1 4a3 3 0 0 1 3-3h16a3 3 0 0 1 3 3v13a3 3 0 0 1-3 3h-3v-2h3a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h3v2H4a3 3 0 0 1-3-3z" clipRule="evenodd"/><path fill="currentColor" d="M17 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0m0 3.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0M20 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0m0 3.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0m-6.118 5.92a1.883 1.883 0 1 1-3.765-.001 1.883 1.883 0 0 1 3.765.001"/><path fill="currentColor" fillRule="evenodd" d="M4 14.118a1 1 0 0 1 1-1h14a1 1 0 0 1 0 2H5a1 1 0 0 1-1-1M4 6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4.201a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2 0v4.201h6V6z" clipRule="evenodd"/><path fill="currentColor" fillRule="evenodd" d="M6 20.151v-5.527h2v5.527a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-5.527h2v5.527a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><g transform="translate(-116 -184)"><defs><clipPath id="atm-16-clip1_70326_26"><path fill="#fff" d="M116 184h16v16h-16z"/></clipPath></defs><g clipPath="url(#atm-16-clip1_70326_26)"><path fill="currentColor" d="M129 184a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-1.174a3 3 0 0 1-2.826 2h-2a3 3 0 0 1-2.826-2H119a3 3 0 0 1-3-3v-8a3 3 0 0 1 3-3zm-7 13a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2h-.587a1.5 1.5 0 1 1-2.826 0H122zm-3-11a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h1v-1a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2v1h1a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1zm6 1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1zm3 3a1 1 0 1 1 0 2 1 1 0 0 1 0-2m-7 0h3v-1h-3zm7-3a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/></g></g></svg>
  )
}
