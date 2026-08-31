import type { IconProps } from "./types"

// icon / electricity — 19. Categories, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Electricity({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><g transform="translate(-104 -116)"><defs><clipPath id="electricity-24-clip0_70326_26"><path fill="#fff" d="M104 116h24v24h-24z"/></clipPath></defs><g clipPath="url(#electricity-24-clip0_70326_26)"><path fill="currentColor" fillRule="evenodd" d="M113.09 116.586A1 1 0 0 1 114 116h7a1 1 0 0 1 .868 1.496L118.723 123H123a1 1 0 0 1 .857 1.514l-9 15a1 1 0 0 1-1.853-.605l.901-9.909H109a1 1 0 0 1-.91-1.414zm1.554 1.414-4.091 9H115a1 1 0 0 1 .996 1.091l-.604 6.646 5.842-9.737H117a1 1 0 0 1-.868-1.496l3.145-5.504z" clipRule="evenodd"/></g></g></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><g transform="translate(-56 -116)"><defs><clipPath id="electricity-16-clip1_70326_26"><path fill="#fff" d="M56 116h16v16H56z"/></clipPath></defs><g clipPath="url(#electricity-16-clip1_70326_26)"><path fill="currentColor" d="M67.5 116a1 1 0 0 1 .874 1.485l-1.675 3.015H68.5a1 1 0 0 1 .865 1.501l-5.5 9.5a1 1 0 0 1-1.862-.572l.424-5.929H60a1 1 0 0 1-.919-1.394l3-7 .068-.131c.181-.292.501-.475.851-.475zm-5.983 7H63.5a1 1 0 0 1 .997 1.071l-.192 2.678 2.461-4.249H65a1 1 0 0 1-.874-1.485L65.801 118h-2.142z"/></g></g></svg>
  )
}
