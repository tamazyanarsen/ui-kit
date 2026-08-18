import type { IconProps } from "./types"

// icon / arrow triangle up — 08. Arrows, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function ArrowTriangleUp({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M11.208 7.029C11.608 6.509 12.392 6.509 12.793 7.029L18.555 14.515C19.061 15.173 18.592 16.125 17.763 16.125L6.238 16.125C5.408 16.125 4.939 15.173 5.445 14.515L11.208 7.029Z" fill="currentColor" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M7.208 5.029C7.608 4.509 8.392 4.509 8.792 5.029L11.957 9.14C12.463 9.798 11.994 10.75 11.164 10.75L4.836 10.75C4.006 10.75 3.537 9.798 4.043 9.14L7.208 5.029Z" fill="currentColor" />
    </svg>
  )
}
