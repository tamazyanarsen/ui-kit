import type { IconProps } from "./types"

// icon / money return — 13. Money Card, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function MoneyReturn({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M2.472 4.744v3h17v-3zm19-.222c0-.971-.782-1.778-1.77-1.778H2.241c-.988 0-1.769.807-1.769 1.778v12.444c0 .972.781 1.778 1.769 1.778h9.231a1 1 0 0 0 0-2h-9v-7h17v1a1 1 0 1 0 2 0zm-2.65 9.616a1 1 0 0 1 0 1.414l-1.193 1.192h4.9a1 1 0 0 1 0 2h-4.9l1.193 1.193a1 1 0 0 1-1.414 1.414l-2.9-2.9a1 1 0 0 1 0-1.414l2.9-2.899a1 1 0 0 1 1.414 0" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M11.293 9.293a1 1 0 0 1 1.414 1.415l-.292.292H15a1 1 0 0 1 0 2h-2.586l.293.293a1 1 0 1 1-1.414 1.414l-2-2a1 1 0 0 1-.102-.12l-.023-.032a1 1 0 0 1-.114-.232l-.011-.031a1.03 1.03 0 0 1-.013-.533l.013-.051.011-.031a.96.96 0 0 1 .239-.384zM12 2a2 2 0 0 1 2 2v3a1 1 0 0 1-2 0H2v4h5a1 1 0 0 1 0 2H2a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM2 5h10V4H2z"/></svg>
  )
}
