import type { IconProps } from "./types"

// icon / add card — 13. Money Card, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function AddCard({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M2 4.5v3h17v-3zm19-.222c0-.972-.782-1.778-1.769-1.778H1.769C.782 2.5 0 3.306 0 4.278v12.444c0 .972.782 1.778 1.769 1.778H13a1 1 0 0 0 0-2H2v-7h17v1a1 1 0 0 0 2 0zM20 13.5a1 1 0 0 1 1 1v2h2a1 1 0 0 1 0 2h-2v2a1 1 0 0 1-2 0v-2h-2a1 1 0 0 1 0-2h2v-2a1 1 0 0 1 1-1" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><g transform="translate(-56 -248)"><defs><clipPath id="add-card-16-clip0_70326_26"><path fill="#fff" d="M56 248h16v16H56z"/></clipPath></defs><g clipPath="url(#add-card-16-clip0_70326_26)"><path fill="currentColor" d="M69 257a1 1 0 0 1 1 1v1.005h1.005a1 1 0 0 1 0 2H70V262a1 1 0 0 1-2 0v-.995h-.995a1 1 0 0 1 0-2H68V258a1 1 0 0 1 1-1m-1-7a2 2 0 0 1 2 2v3a1 1 0 0 1-2 0H58v4h6a1 1 0 0 1 0 2h-6a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2zm-10 3h10v-1H58z"/></g></g></svg>
  )
}
