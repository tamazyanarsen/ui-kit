import type { IconProps } from "./types"

// icon / budget — 22. Product, набор ALL ICONS (канвас 70326:26).
// 16 и 24 — отдельные начертания мастера, а не масштаб одного.
export function Budget({ size = 16, ...props }: IconProps) {
  if (size === 24) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><path fill="currentColor" fillRule="evenodd" d="M11.432 1.431a1 1 0 0 1 1.147 0l10 7a1 1 0 0 1-.573 1.819h-1.984v7.5H21a1 1 0 0 1 0 2H3a1 1 0 0 1 0-2h1.011v-7.5H2.006a1 1 0 0 1-.574-1.819zM6.011 10.25v7.5H8.65v-7.5zm4.639 0v7.5h2.722v-7.5zm4.722 0v7.5h2.65v-7.5zm-10.194-2h13.655l-6.827-4.779zM0 21.75a1 1 0 0 1 1-1h22a1 1 0 0 1 0 2H1a1 1 0 0 1-1-1" clipRule="evenodd"/></svg>
    )
  }

  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}><g transform="translate(-56 -504)"><defs><clipPath id="budget-16-clip2_70326_26"><path fill="#fff" d="M56 504h16v16H56z"/></clipPath></defs><g clipPath="url(#budget-16-clip2_70326_26)"><path fill="currentColor" d="M63.555 505.104a1 1 0 0 1 1.026.083l7 5A.999.999 0 0 1 71 512h-1.5v5H71a1 1 0 0 1 0 2H57a1 1 0 0 1 0-2h1.5v-5H57a1.001 1.001 0 0 1-.581-1.813l7-5zM60.5 512v5h1v-5zm3 0v5h1v-5zm3 0v5h1v-5zm-6.38-2h7.76L64 507.229z"/></g></g></svg>
  )
}
