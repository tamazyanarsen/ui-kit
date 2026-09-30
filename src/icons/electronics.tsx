import type { IconProps } from "./types"

// icon / electronics — 18. Other, набор ALL ICONS.
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Electronics({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M14 4v16h8V4zm-2-.182C12 2.797 12.838 2 13.833 2h8.334C23.162 2 24 2.797 24 3.818v16.364A1.826 1.826 0 0 1 22.167 22h-8.334A1.826 1.826 0 0 1 12 20.182zM2.5 7a.42.42 0 0 0-.312.159.8.8 0 0 0-.188.533v7.616c0 .22.079.41.188.533.105.12.221.159.312.159H10a1 1 0 1 1 0 2H8v2h1a1 1 0 1 1 0 2H5a1 1 0 1 1 0-2h1v-2H2.5a2.42 2.42 0 0 1-1.809-.832A2.8 2.8 0 0 1 0 15.308V7.692c0-.677.238-1.348.691-1.86A2.42 2.42 0 0 1 2.5 5H10a1 1 0 1 1 0 2zM15 6a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2h-4a1 1 0 0 1-1-1m0 3a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2h-4a1 1 0 0 1-1-1m1 9a1 1 0 0 1 1-1h2a1 1 0 1 1 0 2h-2a1 1 0 0 1-1-1" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M6 3a1 1 0 0 1 0 2H2v5h4a1 1 0 1 1 0 2h-.5v1H6a1 1 0 1 1 0 2H2.5a1 1 0 1 1 0-2h1v-1H2a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm8-2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2zm-4 12h4V3h-4zm2-3a1 1 0 1 1 0 2 1 1 0 0 1 0-2m0-6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/></svg>
  )
}
