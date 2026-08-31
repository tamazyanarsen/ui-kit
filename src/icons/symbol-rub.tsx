import type { IconProps } from "./types"

// icon / Symbol / RUB — 12. Currency, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function SymbolRub({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M10.717 7.344h1.719c1.689 0 2.578.84 2.578 2.197 0 1.367-.889 2.207-2.598 2.207h-1.699zm3.818 9.863v-1.816h-3.818v-1.397h2.441c2.881 0 4.844-1.875 4.844-4.482C18.002 6.875 16.137 5 13.314 5H7.768v6.787H6v2.158h1.768v1.446H6v1.816h1.768v1.885h2.949v-1.885z"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M6.825 9.723H1V7.794h5.772q.706 0 1.125-.239.427-.239.616-.659.19-.429.19-.973 0-.536-.205-.981a1.6 1.6 0 0 0-.616-.725q-.41-.28-1.049-.28H4.818V14H2.536V2h4.289q1.308 0 2.236.503a3.54 3.54 0 0 1 1.437 1.384q.502.882.502 2.02 0 1.194-.517 2.052a3.3 3.3 0 0 1-1.445 1.31q-.928.454-2.213.454m.418.675v1.929H1v-1.929z"/></svg>
  )
}
