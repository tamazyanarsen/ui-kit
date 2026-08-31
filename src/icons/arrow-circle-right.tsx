import type { IconProps } from "./types"

// icon / arrow circle right — 08. Arrows, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function ArrowCircleRight({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><g transform="translate(-160 -308)"><defs><clipPath id="arrow-circle-right-24-clip2_70326_26"><path fill="#fff" d="M160 308h24v24h-24z"/></clipPath></defs><g clipPath="url(#arrow-circle-right-24-clip2_70326_26)"><path fill="currentColor" fillRule="evenodd" d="M172 330c-5.523 0-10-4.477-10-10s4.477-10 10-10 10 4.477 10 10-4.477 10-10 10m-12-10c0 6.627 5.373 12 12 12s12-5.373 12-12-5.373-12-12-12-12 5.373-12 12m10.864 5.021a1 1 0 0 0 0-1.414L168.257 321h9.9a1 1 0 0 0 0-2h-9.9l2.607-2.607a1 1 0 0 0-1.414-1.414l-4.314 4.314a.997.997 0 0 0 0 1.414l4.314 4.314a1 1 0 0 0 1.414 0" clipRule="evenodd"/></g></g></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><g transform="translate(-112 -312)"><defs><clipPath id="arrow-circle-right-16-clip3_70326_26"><path fill="#fff" d="M112 312h16v16h-16z"/></clipPath></defs><g clipPath="url(#arrow-circle-right-16-clip3_70326_26)"><path fill="currentColor" d="M114 320a6 6 0 1 1 12 0 6 6 0 0 1-12 0m5.648-3.185a1 1 0 0 0-1.414 0l-2.476 2.478a1 1 0 0 0 0 1.414l2.476 2.478a1 1 0 0 0 1.414-1.415l-.769-.77h4.656a1 1 0 0 0 0-2h-4.656l.769-.77a1 1 0 0 0 0-1.415M112 320a8 8 0 1 0 16 0 8 8 0 0 0-16 0"/></g></g></svg>
  )
}
