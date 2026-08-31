import type { IconProps } from "./types"

// icon / Symbol / INR — 12. Currency, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function SymbolInr({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M10.423 13.704h.127c2.06-.146 3.662-1.562 3.847-3.398h2.823V8.489h-2.901c-.088-.635-.537-1.299-1.074-1.631v-.117h3.975V4.954H6.79v1.895h2.617c1.231 0 2.139.654 2.295 1.64H6.8v1.817h4.922c-.166 1.025-1.211 1.709-2.637 1.709H6.78v1.24l4.678 5.791h3.35z"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M4.989 14 1 9.514V7.735h2.331c1.245 0 1.94-.529 2.085-1.544H1v-.868h4.416c-.137-1.024-.84-1.544-2.085-1.544H1V2h8v.954H6.417c.703.512 1.131 1.311 1.223 2.369H9v.868H7.648c-.146 2.004-1.452 3.28-3.584 3.28h-.183L7.991 14z"/></svg>
  )
}
