import type { IconProps } from "./types"

// icon / arrow circle left — 08. Arrows, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function ArrowCircleLeft({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><g transform="translate(-160 -244)"><defs><clipPath id="arrow-circle-left-24-clip0_70326_26"><path fill="#fff" d="M160 244h24v24h-24z"/></clipPath></defs><g clipPath="url(#arrow-circle-left-24-clip0_70326_26)"><path fill="currentColor" fillRule="evenodd" d="M172 246c-5.523 0-10 4.477-10 10s4.477 10 10 10 10-4.477 10-10-4.477-10-10-10m-12 10c0-6.627 5.373-12 12-12s12 5.373 12 12-5.373 12-12 12-12-5.373-12-12m13.136-5.021a1 1 0 0 1 1.414 0l4.314 4.314a.997.997 0 0 1 0 1.414l-4.314 4.314a1 1 0 0 1-1.414-1.414l2.607-2.607h-9.9a1 1 0 0 1 0-2h9.9l-2.607-2.607a1 1 0 0 1 0-1.414" clipRule="evenodd"/></g></g></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><g transform="translate(-64 -248)"><defs><clipPath id="arrow-circle-left-16-clip1_70326_26"><path fill="#fff" d="M64 248h16v16H64z"/></clipPath></defs><g clipPath="url(#arrow-circle-left-16-clip1_70326_26)"><path fill="currentColor" d="M78 256a6 6 0 1 0-12 0 6 6 0 0 0 12 0m-5.648-3.185a1 1 0 0 1 1.414 0l2.476 2.478a1 1 0 0 1 0 1.414l-2.476 2.478a1 1 0 0 1-1.414-1.415l.769-.77h-4.656a1 1 0 0 1 0-2h4.656l-.769-.77a1 1 0 0 1 0-1.415M80 256a8 8 0 1 1-16 0 8 8 0 0 1 16 0"/></g></g></svg>
  )
}
