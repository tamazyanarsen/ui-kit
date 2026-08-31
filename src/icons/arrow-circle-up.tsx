import type { IconProps } from "./types"

// icon / arrow circle up — 08. Arrows, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function ArrowCircleUp({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><g transform="translate(-160 -500)"><defs><clipPath id="arrow-circle-up-24-clip4_70326_26"><path fill="#fff" d="M160 500h24v24h-24z"/></clipPath></defs><g clipPath="url(#arrow-circle-up-24-clip4_70326_26)"><path fill="currentColor" fillRule="evenodd" d="M172 502c5.523 0 10 4.477 10 10s-4.477 10-10 10-10-4.477-10-10 4.477-10 10-10m12 10c0-6.627-5.373-12-12-12s-12 5.373-12 12 5.373 12 12 12 12-5.373 12-12m-12-7.157a1 1 0 0 0-.707.293l-4.314 4.314a1 1 0 0 0 1.414 1.414l2.607-2.607v9.9a1 1 0 0 0 2 0v-9.9l2.607 2.607a1 1 0 0 0 1.414-1.414l-4.314-4.314a1 1 0 0 0-.707-.293" clipRule="evenodd"/></g></g></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><g transform="translate(-112 -504)"><defs><clipPath id="arrow-circle-up-16-clip5_70326_26"><path fill="#fff" d="M112 504h16v16h-16z"/></clipPath></defs><g clipPath="url(#arrow-circle-up-16-clip5_70326_26)"><path fill="#fff" d="M112 504h16v16h-16z"/><path fill="currentColor" d="M120 506a6 6 0 1 0 0 12 6 6 0 0 0 0-12m-3.185 5.648a1 1 0 0 1 0-1.414l2.478-2.476a1 1 0 0 1 1.414 0l2.478 2.476a1 1 0 0 1-1.415 1.414l-.77-.769v4.656a1 1 0 0 1-2 0v-4.656l-.77.769a1 1 0 0 1-1.415 0M120 504a8 8 0 1 1 0 16 8 8 0 0 1 0-16"/></g></g></svg>
  )
}
