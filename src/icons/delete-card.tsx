import type { IconProps } from "./types"

// icon / delete card — 13. Money Card, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function DeleteCard({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M2.439 4.939v3h17v-3zm19-.222c0-.971-.782-1.778-1.769-1.778H2.208c-.987 0-1.769.807-1.769 1.778v12.445c0 .971.782 1.777 1.769 1.777h11.231a1 1 0 1 0 0-2h-11v-7h17v1a1 1 0 1 0 2 0zm-3.828 10.394a1 1 0 0 1 1.414 0l1.414 1.414 1.414-1.414a1 1 0 0 1 1.415 1.414l-1.415 1.414 1.415 1.415a1 1 0 0 1-1.415 1.414l-1.414-1.414-1.414 1.414a1 1 0 0 1-1.414-1.414l1.414-1.415-1.414-1.414a1 1 0 0 1 0-1.414" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="#000" d="M13.709 9.875a1 1 0 0 1 1.414 1.414l-.711.711.711.711a1 1 0 0 1-1.415 1.414l-.711-.711-.703.704a1 1 0 1 1-1.414-1.414l.703-.704-.703-.703a1 1 0 1 1 1.414-1.415l.704.704zM12 2a2 2 0 0 1 2 2v3a1 1 0 0 1-2 0H2v4h6a1 1 0 0 1 0 2H2a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM2 5h10V4H2z"/></svg>
  )
}
