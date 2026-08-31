import type { IconProps } from "./types"

// icon / 1 month — 20. User Interface, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Icon1Month({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M7 .5a1 1 0 0 1 1 1v1h8v-1a1 1 0 0 1 2 0v1h3.091C22.096 2.5 23 3.287 23 4.364v17.272c0 1.077-.904 1.864-1.909 1.864H2.909C1.904 23.5 1 22.713 1 21.636V4.364C1 3.287 1.904 2.5 2.909 2.5H6v-1a1 1 0 0 1 1-1m-1 4H3v3h18v-3h-3v1a1 1 0 0 1-2 0v-1H8v1a1 1 0 0 1-2 0zm15 5H3v12h18zm-8.675.905a1 1 0 0 1 .675.946v7h.5a1 1 0 0 1 0 2h-3a1 1 0 0 1 0-2h.5v-4.085l-.211.27a1 1 0 1 1-1.578-1.227l2-2.572a1 1 0 0 1 1.114-.332" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><g transform="translate(-56 -312)"><defs><clipPath id="1-month-16-clip3_70326_26"><path fill="#fff" d="M56 312h16v16H56z"/></clipPath></defs><g clipPath="url(#1-month-16-clip3_70326_26)"><path fill="currentColor" d="M67 312a1 1 0 0 1 1 1v.5h2a2 2 0 0 1 2 2V326l-.011.204A2 2 0 0 1 70 328H58a2 2 0 0 1-2-2v-10.5a2 2 0 0 1 2-2h2v-.5a1 1 0 0 1 2 0v.5h4v-.5a1 1 0 0 1 1-1m-9 14h12v-10.5h-2v.5a1 1 0 0 1-2 0v-.5h-4v.5a1 1 0 0 1-2 0v-.5h-2zm5.456-8.229a.698.698 0 0 1 1.252.429v4.9h.351a.7.7 0 0 1 0 1.4h-2.101a.7.7 0 0 1 0-1.4h.351v-2.86l-.148.19a.7.7 0 1 1-1.105-.86z"/></g></g></svg>
  )
}
