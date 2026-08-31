import type { IconProps } from "./types"

// icon / Symbol / TRY — 12. Currency, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function SymbolTry({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M10.516 19.046c4.404 0 6.933-2.07 6.933-5.908h-2.773c0 2.138-1.367 3.31-3.457 3.31v-4.092l2.373-1.084V9.661l-2.373 1.084V9.036l2.373-1.084V6.341l-2.373 1.084V4.954H8.338v3.779l-1.787.83v1.612l1.787-.83v1.709l-1.787.83v1.611l1.787-.83v5.381z"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M4.274 14C7.911 14 10 12.237 10 8.969H7.71c0 1.821-1.129 2.819-2.855 2.819V8.304l1.96-.924V6.008l-1.96.923V5.476l1.96-.923V3.181l-1.96.923V2H2.476v3.218L1 5.925v1.372l1.476-.707v1.456L1 8.753v1.372l1.476-.707V14z"/></svg>
  )
}
