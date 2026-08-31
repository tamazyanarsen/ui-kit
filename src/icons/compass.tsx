import type { IconProps } from "./types"

// icon / compass — 02. Map, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Compass({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><g transform="translate(-160 -180)"><defs><clipPath id="compass-24-clip0_70326_26"><path fill="#fff" d="M160 180h24v24h-24z"/></clipPath></defs><g clipPath="url(#compass-24-clip0_70326_26)"><path fill="currentColor" fillRule="evenodd" d="M172 182c-5.523 0-10 4.477-10 10s4.477 10 10 10 10-4.477 10-10-4.477-10-10-10m-12 10c0-6.627 5.373-12 12-12s12 5.373 12 12-5.373 12-12 12-12-5.373-12-12m18.216-6.198a1 1 0 0 1 .203 1.092l-3 7a1 1 0 0 1-.472.5l-7.999 4a.999.999 0 0 1-1.364-1.295l3.5-8a1 1 0 0 1 .545-.527l7.5-3a1 1 0 0 1 1.087.23m-7.464 4.474-2.228 5.094 5.201-2.601 1.905-4.444z" clipRule="evenodd"/></g></g></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><g transform="translate(-112 -184)"><defs><clipPath id="compass-16-clip1_70326_26"><path fill="#fff" d="M112 184h16v16h-16z"/></clipPath></defs><g clipPath="url(#compass-16-clip1_70326_26)"><path fill="currentColor" d="M120 184a8 8 0 1 1 0 16 8 8 0 0 1 0-16m0 2a6 6 0 1 0 0 12 6 6 0 0 0 0-12m2.648 2.188a1 1 0 0 1 1.129 1.3l-1.414 4.242a1 1 0 0 1-.633.633l-4.243 1.414a.999.999 0 0 1-1.264-1.265l1.414-4.242a1 1 0 0 1 .633-.633l4.242-1.414zm-3.272 3.188-.623 1.871 1.87-.624.624-1.87z"/></g></g></svg>
  )
}
