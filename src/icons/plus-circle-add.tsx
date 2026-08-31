import type { IconProps } from "./types"

// icon / plus circle, add — 05. Check Plus Minus Close, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function PlusCircleAdd({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><g transform="translate(-160 -372)"><defs><clipPath id="plus-circle-add-24-clip0_70326_26"><path fill="#fff" d="M160 372h24v24h-24z"/></clipPath></defs><g clipPath="url(#plus-circle-add-24-clip0_70326_26)"><path fill="currentColor" fillRule="evenodd" d="M172 374c-5.523 0-10 4.477-10 10s4.477 10 10 10 10-4.477 10-10-4.477-10-10-10m-12 10c0-6.627 5.373-12 12-12s12 5.373 12 12-5.373 12-12 12-12-5.373-12-12m12-5.714a1 1 0 0 1 1 1V383h3.714a1 1 0 1 1 0 2H173v3.714a1 1 0 1 1-2 0V385h-3.714a1 1 0 1 1 0-2H171v-3.714a1 1 0 0 1 1-1" clipRule="evenodd"/></g></g></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><g transform="translate(-56 -376)"><defs><clipPath id="plus-circle-add-16-clip1_70326_26"><path fill="#fff" d="M56 376h16v16H56z"/></clipPath></defs><g clipPath="url(#plus-circle-add-16-clip1_70326_26)"><path fill="currentColor" d="M70 384a6 6 0 1 0-12 0 6 6 0 0 0 12 0m-7 3v-2h-2a1 1 0 0 1 0-2h2v-2a1 1 0 0 1 2 0v2h2a1 1 0 0 1 0 2h-2v2a1 1 0 0 1-2 0m9-3a8 8 0 1 1-16 0 8 8 0 0 1 16 0"/></g></g></svg>
  )
}
