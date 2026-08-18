import type { IconProps } from "./types"

// icon / Symbol / CHF — 12. Currency, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function SymbolChf({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M14.837 17.259V15.442H11.36V13.255H16.614V10.921H11.36V7.386H17.161V4.954H8.411V15.442H6.839V17.259H8.411V19.046H11.36V17.259H14.837Z" fill="currentColor" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M4.648 2V14H2.178V2H4.648ZM9.424 7.126V9.055H3.973V7.126H9.424ZM10 2V3.937H3.973V2H10ZM6.764 10.712V12.179H1V10.712H6.764Z" fill="currentColor" />
    </svg>
  )
}
