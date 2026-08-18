import type { IconProps } from "./types"

// icon / arrow triangle down — 08. Arrows, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function ArrowTriangleDown({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M12.793 16.971C12.392 17.491 11.608 17.491 11.208 16.971L5.445 9.485C4.939 8.827 5.408 7.875 6.238 7.875H17.763C18.592 7.875 19.061 8.827 18.555 9.485L12.793 16.971Z" fill="currentColor" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M8.793 10.971C8.392 11.491 7.608 11.491 7.208 10.971L4.043 6.86C3.537 6.202 4.006 5.25 4.836 5.25H11.165C11.994 5.25 12.463 6.202 11.957 6.86L8.793 10.971Z" fill="currentColor" />
    </svg>
  )
}
