import type { IconProps } from "./types"

// icon / credit card — 13. Money Card, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function CreditCard({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path fillRule="evenodd" clipRule="evenodd" d="M3 6V9H21V6H3ZM23 5.778C23 4.806 22.218 4 21.231 4H2.769C1.782 4 1 4.806 1 5.778V18.222C1 19.194 1.782 20 2.769 20H21.231C22.218 20 23 19.194 23 18.222V5.778ZM21 11H3V18H21V11ZM16 15C16 14.448 16.448 14 17 14H19C19.552 14 20 14.448 20 15C20 15.552 19.552 16 19 16H17C16.448 16 16 15.552 16 15Z" fill="currentColor" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M14 12V14H2V12H14ZM14 4H2V14C0.895 14 0 13.105 0 12V4C0 2.895 0.895 2 2 2H14C15.105 2 16 2.895 16 4V12C16 13.105 15.105 14 14 14V4Z" fill="currentColor" /> <path d="M14 6V8H2V6H14Z" fill="currentColor" />
    </svg>
  )
}
