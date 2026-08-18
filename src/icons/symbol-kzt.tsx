import type { IconProps } from "./types"

// icon / Symbol / KZT — 12. Currency, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function SymbolKzt({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M13.48 19.046V10.647H17.396V8.548H6.605V10.647H10.53V19.046H13.48ZM17.396 7.054V4.954H6.605V7.054H17.396Z" fill="currentColor" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M7.371 14V6.848H11V5.06H1V6.848H4.638V14H7.371ZM11 3.788V2H1V3.788H11Z" fill="currentColor" />
    </svg>
  )
}
