import type { IconProps } from "./types"

// icon / pin — 21. Social Networks, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Pin({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path fillRule="evenodd" clipRule="evenodd" d="M12 22C12 22 20 15 20 10C20 5.582 16.418 2 12 2C7.582 2 4 5.582 4 10C4 15 12 22 12 22ZM12 14C14.209 14 16 12.209 16 10C16 7.791 14.209 6 12 6C9.791 6 8 7.791 8 10C8 12.209 9.791 14 12 14Z" fill="currentColor" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path fillRule="evenodd" clipRule="evenodd" d="M8 14.667C8 14.667 13.334 10 13.334 6.667C13.334 3.721 10.946 1.333 8 1.333C5.055 1.333 2.667 3.721 2.667 6.667C2.667 10 8 14.667 8 14.667ZM8 9.333C9.473 9.333 10.667 8.14 10.667 6.667C10.667 5.194 9.473 4 8 4C6.528 4 5.334 5.194 5.334 6.667C5.334 8.14 6.528 9.333 8 9.333Z" fill="currentColor" />
    </svg>
  )
}
