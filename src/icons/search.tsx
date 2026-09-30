import type { IconProps } from "./types"

// icon / Search — набор ALL ICONS.
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Search({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M10.5 4a6 6 0 1 0 0 12 6 6 0 0 0 0-12m-8 6a8 8 0 1 1 13.86 5.446l4.847 4.847a1 1 0 0 1-1.414 1.414l-4.973-4.973A8 8 0 0 1 2.5 10" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M11 6.5a4.5 4.5 0 1 0-9 0 4.5 4.5 0 0 0 9 0m2 0c0 1.69-.645 3.228-1.702 4.384l3.409 3.409a1 1 0 1 1-1.414 1.414l-3.566-3.566A6.5 6.5 0 1 1 13 6.5"/></svg>
  )
}
