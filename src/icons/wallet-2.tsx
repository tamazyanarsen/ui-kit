import type { IconProps } from "./types"

// icon / wallet 2 — 13. Money Card, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Wallet2({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M4.339 5.536a1 1 0 0 0-1 1v12.558a1 1 0 0 0 1 1h14.849a1 1 0 0 0 1-1l-.003-9.429h2l.003 9.429a3 3 0 0 1-3 3H4.339a3 3 0 0 1-3-3V6.536a3 3 0 0 1 3-3h3.508a1 1 0 1 1 0 2z" clipRule="evenodd"/><path fill="currentColor" fillRule="evenodd" d="M16.586 2.968a1 1 0 0 1 1.268.467l1.831 3.554h1.5a1 1 0 0 1 1 1v1.676h-2v-.676H6.954a1 1 0 0 1-.379-1.925zm.849 4.021-.939-1.823-4.457 1.823z" clipRule="evenodd"/><path fill="currentColor" d="M17.5 16a1.5 1.5 0 1 0-.001-3.001A1.5 1.5 0 0 0 17.5 16"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" d="M5.5 2a1 1 0 0 1 0 2H4.042a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V7H5l-.003-.001a1 1 0 0 1-.14-.011l-.056-.009a1 1 0 0 1-.501-.265l-.007-.007a1 1 0 0 1-.125-1.263l.027-.037a1 1 0 0 1 .424-.333l5.458-2.272a1 1 0 0 1 1.308.538L12.077 5H14l.02.001.022-.001a1 1 0 0 1 1 1v6a3 3 0 0 1-3 3h-8a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3zM11 9a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/></svg>
  )
}
