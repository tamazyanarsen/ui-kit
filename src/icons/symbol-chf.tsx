import type { IconProps } from "./types"

// icon / Symbol / CHF — 12. Currency, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function SymbolChf({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M14.837 17.259v-1.817H11.36v-2.187h5.254v-2.334H11.36V7.386h5.801V4.954h-8.75v10.488H6.839v1.817h1.572v1.787h2.949v-1.787z"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M4.648 2v12h-2.47V2zm4.776 5.126v1.929H3.973V7.126zM10 2v1.937H3.973V2zm-3.236 8.712v1.467H1v-1.467z"/></svg>
  )
}
