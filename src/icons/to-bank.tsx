import type { IconProps } from "./types"

// icon / to bank — 22. Product, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function ToBank({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M11.432 1.102a1 1 0 0 1 1.147 0l10 7a1.002 1.002 0 0 1-.574 1.82h-1.983v7.5H21a1 1 0 1 1 0 2h-8.5a1 1 0 0 1 0-2h.872v-7.5H10.65v4a1 1 0 0 1-2 0v-4H6.011v2a1 1 0 0 1-2 0v-2H2.005a1 1 0 0 1-.573-1.82zm3.94 8.82v7.5h2.65v-7.5zm-10.194-2h13.655l-6.828-4.78zm-.468 6.893a1 1 0 0 1 1.414 0l2.9 2.899c.39.391.39 1.024 0 1.415l-2.9 2.899a.999.999 0 1 1-1.414-1.414l1.192-1.192H1.003a1 1 0 0 1 0-2h4.899L4.71 16.229a1 1 0 0 1 0-1.414M10 21.422a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H11a1 1 0 0 1-1-1" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><g transform="translate(-56 -568)"><defs><clipPath id="to-bank-16-clip4_70326_26"><path fill="#fff" d="M56 568h16v16H56z"/></clipPath></defs><g clipPath="url(#to-bank-16-clip4_70326_26)"><path fill="currentColor" d="M59.293 578.293a1 1 0 0 1 1.414 0l2 2a1 1 0 0 1 0 1.414l-2 2a1 1 0 0 1-1.414-1.414l.293-.293H57a1 1 0 0 1 0-2h2.585l-.292-.292a1 1 0 0 1 0-1.415m4.262-9.189a1 1 0 0 1 1.026.082l7 5A1 1 0 0 1 71 576h-1.5v5H71a1 1 0 0 1 0 2h-6a1 1 0 0 1-.491-1.871A1 1 0 0 1 64.5 581v-5h-1v1a1 1 0 0 1-2 0v-1h-1l-.005.102a1 1 0 0 1-1.99 0L58.5 576H57a1.001 1.001 0 0 1-.581-1.814l7-5zM66.5 581h1v-5h-1zm-6.38-7h7.76L64 571.228z"/></g></g></svg>
  )
}
