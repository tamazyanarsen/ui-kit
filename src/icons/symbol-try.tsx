import type { IconProps } from "./types"

// icon / Symbol / TRY — 12. Currency, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function SymbolTry({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M10.516 19.046C14.92 19.046 17.449 16.976 17.449 13.138H14.676C14.676 15.276 13.309 16.448 11.219 16.448V12.356L13.592 11.272V9.661L11.219 10.745V9.036L13.592 7.952V6.341L11.219 7.425V4.954H8.338V8.733L6.551 9.563V11.175L8.338 10.345V12.054L6.551 12.884V14.495L8.338 13.665V19.046H10.516Z" fill="currentColor" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M4.274 14C7.911 14 10 12.237 10 8.969H7.71C7.71 10.79 6.581 11.788 4.855 11.788V8.304L6.815 7.38V6.008L4.855 6.931V5.476L6.815 4.553V3.181L4.855 4.104V2H2.476V5.218L1 5.925V7.297L2.476 6.59V8.046L1 8.753V10.125L2.476 9.418V14H4.274Z" fill="currentColor" />
    </svg>
  )
}
