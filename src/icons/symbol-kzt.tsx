import type { IconProps } from "./types"

// icon / Symbol / KZT — 12. Currency, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function SymbolKzt({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M13.48 19.046v-8.399h3.916V8.548H6.605v2.099h3.925v8.399zm3.916-11.992v-2.1H6.605v2.1z"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M7.371 14V6.848H11V5.06H1v1.788h3.638V14zM11 3.788V2H1v1.788z"/></svg>
  )
}
