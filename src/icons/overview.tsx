import type { IconProps } from "./types"

// icon / overview — 21. Social Networks, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Overview({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M2 2H11V11H2V2Z" fill="currentColor" /> <path d="M2 13H11V22H2V13Z" fill="currentColor" /> <path d="M13 13H22V22H13V13Z" fill="currentColor" /> <path d="M13 2H22V11H13V2Z" fill="currentColor" /> <path fillRule="evenodd" clipRule="evenodd" d="M9 4H4V9H9V4ZM9 15H4V20H9V15ZM20 15H15V20H20V15ZM20 4H15V9H20V4ZM2 2V11H11V2H2ZM2 13V22H11V13H2ZM22 13V22H13V13H22ZM13 2V11H22V2H13Z" fill="currentColor" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M1.333 1.333H7.333V7.333H1.333V1.333Z" fill="currentColor" /> <path d="M1.333 8.667H7.333V14.667H1.333V8.667Z" fill="currentColor" /> <path d="M8.666 8.667H14.666V14.667H8.666V8.667Z" fill="currentColor" /> <path d="M8.666 1.333H14.666V7.333H8.666V1.333Z" fill="currentColor" /> <path fillRule="evenodd" clipRule="evenodd" d="M6 2.667H2.666V6H6V2.667ZM6 10H2.666V13.333H6V10ZM13.333 10H10V13.333H13.333V10ZM13.333 2.667H10V6H13.333V2.667ZM1.333 1.333V7.333H7.333V1.333H1.333ZM1.333 8.667V14.667H7.333V8.667H1.333ZM14.666 8.667V14.667H8.666V8.667H14.666ZM8.666 1.333V7.333H14.666V1.333H8.666Z" fill="currentColor" />
    </svg>
  )
}
