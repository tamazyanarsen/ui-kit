import type { IconProps } from "./types"

// icon / deposit — 22. Product, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Deposit({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M6.414 3A3.415 3.415 0 0 0 3 6.414v10.091c0 1.104.523 2.086 1.34 2.712a1 1 0 0 1 .327 1.148V21h3v-.081a1 1 0 0 1 1-1h6.666a1 1 0 0 1 1 1V21h3v-.635a1 1 0 0 1 .327-1.148A3.4 3.4 0 0 0 21 16.505V6.414A3.415 3.415 0 0 0 17.586 3zM1 6.414A5.414 5.414 0 0 1 6.414 1h11.172A5.414 5.414 0 0 1 23 6.414v10.091a5.4 5.4 0 0 1-1.667 3.907v.755c0 1.012-.82 1.833-1.833 1.833h-3.333a1.83 1.83 0 0 1-1.673-1.081H9.506A1.83 1.83 0 0 1 7.833 23H4.5a1.833 1.833 0 0 1-1.833-1.833v-.755A5.4 5.4 0 0 1 1 16.505z" clipRule="evenodd"/><path fill="currentColor" fillRule="evenodd" d="M5 9a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3zm3-1a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1z" clipRule="evenodd"/><path fill="currentColor" d="M10 13a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3-3a1 1 0 1 1-2 0 1 1 0 0 1 2 0m0 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/><path fill="currentColor" fillRule="evenodd" d="M18 10a1 1 0 0 1 1-1h2a1 1 0 0 1 0 2h-2a1 1 0 0 1-1-1m-5 0a1 1 0 0 1-1 1H9a1 1 0 0 1 0-2h3a1 1 0 0 1 1 1m5 3a1 1 0 0 1 1-1h2a1 1 0 0 1 0 2h-2a1 1 0 0 1-1-1" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><g transform="translate(-56 -312)"><defs><clipPath id="deposit-16-clip0_70326_26"><path fill="#fff" d="M56 312h16v16H56z"/></clipPath></defs><g clipPath="url(#deposit-16-clip0_70326_26)"><path fill="currentColor" d="M67.5 312.5a4 4 0 0 1 4 4v5.917a4 4 0 0 1-2.5 3.707v.376a1 1 0 0 1-1 1h-3a1 1 0 0 1-1-1 1 1 0 0 1-1 1h-3a1 1 0 0 1-1-1v-.376a4 4 0 0 1-2.5-3.707V316.5a4 4 0 0 1 4-4zm-7 2a2 2 0 0 0-2 2v5.917l.009.184a2 2 0 0 0 1.656 1.787 1 1 0 0 1 .835.986v.126h1v-.083a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v.083h1v-.126a1 1 0 0 1 .835-.986 2 2 0 0 0 1.656-1.787l.009-.184V320.5h-1a3 3 0 0 1-3 3h-3a3 3 0 0 1-3-3v-2a3 3 0 0 1 3-3h3a3 3 0 0 1 3 3h1v-2a2 2 0 0 0-2-2zm2 3a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1zm2 1a1 1 0 0 1 0 2h-1a1 1 0 0 1 0-2z"/></g></g></svg>
  )
}
