import type { IconProps } from "./types"

// icon / close circle — 05. Check Plus Minus Close, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function CloseCircle({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><g transform="translate(-160 -564)"><defs><clipPath id="close-circle-24-clip4_70326_26"><path fill="#fff" d="M160 564h24v24h-24z"/></clipPath></defs><g clipPath="url(#close-circle-24-clip4_70326_26)"><path fill="currentColor" fillRule="evenodd" d="M172 566c-5.523 0-10 4.477-10 10s4.477 10 10 10 10-4.477 10-10-4.477-10-10-10m-12 10c0-6.627 5.373-12 12-12s12 5.373 12 12-5.373 12-12 12-12-5.373-12-12m7.959-4.041a1 1 0 0 1 1.415 0l2.626 2.627 2.626-2.626a1 1 0 1 1 1.415 1.414L173.414 576l2.627 2.626c.39.391.39 1.024 0 1.415-.391.39-1.024.39-1.415 0L172 577.414l-2.626 2.627a1 1 0 0 1-1.415-1.414l2.627-2.627-2.627-2.626a1 1 0 0 1 0-1.415" clipRule="evenodd"/></g></g></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><g transform="translate(-56 -568)"><defs><clipPath id="close-circle-16-clip5_70326_26"><path fill="#fff" d="M56 568h16v16H56z"/></clipPath></defs><g clipPath="url(#close-circle-16-clip5_70326_26)"><path fill="currentColor" d="M70 576a6 6 0 1 0-12 0 6 6 0 0 0 12 0m-4.586-2.828a1 1 0 1 1 1.415 1.414L65.414 576l1.415 1.414a1 1 0 0 1-1.415 1.414L64 577.414l-1.414 1.414a.999.999 0 1 1-1.414-1.414L62.586 576l-1.414-1.414a1 1 0 1 1 1.414-1.414L64 574.585zM72 576a8 8 0 1 1-16 0 8 8 0 0 1 16 0"/></g></g></svg>
  )
}
