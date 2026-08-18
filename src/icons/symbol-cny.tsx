import type { IconProps } from "./types"

// icon / Symbol / CNY — 12. Currency, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function SymbolCny({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M16.131 16.976V15.354H13.484V14.026H16.131V12.405H14.227L18.377 4.954H15.184L12.059 10.94H11.971L8.816 4.954H5.623L9.793 12.405H7.889V14.026H10.535V15.354H7.889V16.976H10.535V19.046H13.484V16.976H16.131Z" fill="currentColor" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M9.145 7.901V9.294H1.637V7.901H9.145ZM9.145 10.291V11.676H1.637V10.291H9.145ZM4.93 8.157L7.394 2H10L6.606 9.376H5.224L4.93 8.157ZM3.606 2L6.12 8.231L5.793 9.376H4.402L1 2H3.606ZM6.724 7.745V14H4.218V7.745H6.724Z" fill="currentColor" />
    </svg>
  )
}
